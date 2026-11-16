/* clear-explainer page engine.
   A topic file calls CE.register({...}); an optional catalog file calls CE.setCatalog({...}).
   The engine renders the shared parts of every page (header, prerequisites, predict-first,
   scene player, recall, quiz, flashcards, resources, next) around the topic's own HTML,
   routes between the hub and topics with plain #hash names, and keeps per-viewer progress
   in localStorage (wrapped in try/catch; the page works without it). */
(function () {
  "use strict";
  const topics = {};
  const order = [];
  let catalog = null;
  let current = null;           // cleanup function of the current view

  // ---------- helpers ----------
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const DAY = 86400000;
  const STEPS = [1, 3, 7, 14, 30];

  const store = {
    prefix: "ce:",
    get(key, d) { try { const v = localStorage.getItem(this.prefix + key); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(key, v) { try { localStorage.setItem(this.prefix + key, JSON.stringify(v)); } catch (e) { /* storage blocked: page still works */ } }
  };
  const tkey = (id, part) => id + ":" + part;

  function speechOK() { try { return !!(window.speechSynthesis && typeof SpeechSynthesisUtterance !== "undefined"); } catch (e) { return false; } }
  function stopSpeech() { try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {} }
  function speak(text, rate, onend) {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = rate || 1;
      if (onend) { u.onend = onend; u.onerror = onend; }
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  }

  // ---------- progress model (shared with the hub) ----------
  function cardsDue(id, n) {
    const rec = store.get(tkey(id, "cards"), {});
    const now = Date.now();
    let due = 0, next = Infinity;
    for (let i = 0; i < n; i++) {
      const r = rec[i];
      if (!r || r.due <= now) due++; else next = Math.min(next, r.due);
    }
    return { due, next };
  }
  function status(id) {
    if (!topics[id]) return { cls: "", label: "not built yet" };
    if (store.get(tkey(id, "done"), false)) return { cls: "done", label: "done" };
    const quiz = store.get(tkey(id, "quiz"), {});
    if (store.get(tkey(id, "seen"), false) || Object.keys(quiz).length) return { cls: "prog", label: "in progress" };
    return { cls: "", label: "not started" };
  }

  // ---------- shared renderers ----------
  function renderHeader(t) {
    const h = el("header");
    const crumbs = [t.list, t.phase, t.num && t.total ? `Topic ${t.num} of ${t.total}` : null].filter(Boolean);
    h.innerHTML =
      `<div class="row">${crumbs.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>
       <h1>${esc(t.title)}</h1>
       <p class="lede">${t.lede}</p>
       ${t.checked ? `<p class="checked">Facts and links checked on ${esc(t.checked)}.</p>` : ""}
       <button class="btn done" type="button" aria-pressed="false"></button>`;
    const b = h.querySelector(".done");
    const paint = () => { const d = store.get(tkey(t.id, "done"), false); b.setAttribute("aria-pressed", d ? "true" : "false"); b.textContent = d ? "✓ Topic done" : "Mark topic as done"; };
    b.addEventListener("click", () => { store.set(tkey(t.id, "done"), !store.get(tkey(t.id, "done"), false)); paint(); });
    paint();
    return h;
  }

  function renderPrereqs(t) {
    if (!t.prereqs || !t.prereqs.length) return null;
    const s = el("section");
    s.setAttribute("aria-label", "Before you start");
    s.innerHTML = `<span class="eyebrow">Before you start</span>
      <div class="card"><p class="small muted">You should already be able to answer these. If not, open the linked topic first.</p>
      <ul class="plain">${t.prereqs.map((p) => `<li>${p.text}${p.id ? ` <a href="#${esc(p.id)}">→ topic ${esc(p.label || p.id)}</a>` : ""}</li>`).join("")}</ul></div>`;
    return s;
  }

  function choiceBlock(item, picked, onPick) {
    const wrap = el("div", "card");
    wrap.appendChild(el("div", "qn", esc(item.q)));
    const opts = el("div", "opts");
    item.o.forEach((o, oi) => {
      const b = el("button", "opt");
      b.type = "button";
      b.innerHTML = o;
      if (picked != null) { if (oi === item.a) b.classList.add("right"); else if (oi === picked) b.classList.add("wrong"); }
      b.addEventListener("click", () => onPick(oi));
      opts.appendChild(b);
    });
    wrap.appendChild(opts);
    if (picked != null) wrap.appendChild(el("div", "why", (picked === item.a ? "<b>Correct.</b> " : "<b>Not quite.</b> ") + item.why));
    return wrap;
  }

  function renderPredict(t) {
    if (!t.predict) return null;
    const s = el("section");
    s.innerHTML = `<span class="eyebrow">Predict first</span><p class="small muted">Guess before you watch. A wrong guess is fine: it makes the answer stick.</p>`;
    const slot = el("div");
    s.appendChild(slot);
    const draw = () => { const p = store.get(tkey(t.id, "predict"), null); slot.innerHTML = ""; slot.appendChild(choiceBlock(t.predict, p, (oi) => { store.set(tkey(t.id, "predict"), oi); draw(); })); };
    draw();
    return s;
  }

  function renderPlayer(t) {
    if (!t.scenes || !t.scenes.length) return { node: null, stop() {} };
    const scenes = t.scenes;
    const s = el("section");
    s.innerHTML =
      `<span class="eyebrow">Watch · animated walkthrough</span>
       <h2>${esc(t.playerTitle || "Step by step")}</h2>
       ${t.playerIntro ? `<p class="muted small">${t.playerIntro}</p>` : ""}
       <div class="player" tabindex="0" aria-label="Animated walkthrough. Left and right arrow keys change the scene.">
         <div class="pbar"><span></span></div>
         <div class="stage"><svg class="diagram" viewBox="0 0 720 340" role="img" aria-live="polite"></svg></div>
         <div class="caption"><div class="stitle"></div><div class="stext"></div></div>
         <div class="controls">
           <button class="btn prev" type="button">◀ Prev</button>
           <button class="btn primary play" type="button">▶ Play</button>
           <button class="btn next" type="button">Next ▶</button>
           <label class="toggle"><span>Speed</span><select class="speed" aria-label="Playback speed"><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option></select></label>
           <label class="toggle speakwrap"><input type="checkbox" class="speak"> Read aloud</label>
           <button class="btn ts" type="button" aria-expanded="false">Transcript</button>
           <div class="dots"></div>
         </div>
         <ol class="transcript" hidden>${scenes.map((sc) => `<li><b>${esc(sc.title.replace(/^\d+\s*·\s*/, ""))}.</b> ${esc(sc.text)}</li>`).join("")}</ol>
       </div>`;
    const q = (c) => s.querySelector(c);
    const stage = q(".stage svg"), title = q(".stitle"), text = q(".stext"), bar = q(".pbar span"), dots = q(".dots");
    const playBtn = q(".play"), speakBox = q(".speak"), speedSel = q(".speed");
    if (!speechOK()) q(".speakwrap").hidden = true;
    const defs = '<defs><marker id="ce-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="currentColor"/></marker></defs>';
    let cur = 0, playing = false, timer = null, alive = true;
    scenes.forEach((sc, i) => { const b = el("button", "dot"); b.type = "button"; b.setAttribute("aria-label", "Scene " + (i + 1)); b.addEventListener("click", () => go(i, true)); dots.appendChild(b); });

    function render() {
      const sc = scenes[cur];
      let body = "";
      try { body = sc.draw(); } catch (e) { body = `<text x="20" y="40" class="s-muted">This scene could not be drawn.</text>`; console.error(e); }
      stage.innerHTML = defs + `<g class="scene">${body}</g>`;
      stage.setAttribute("aria-label", sc.title + ". " + sc.text);
      title.textContent = sc.title; text.textContent = sc.text;
      bar.style.width = ((cur + 1) / scenes.length * 100).toFixed(1) + "%";
      Array.from(dots.children).forEach((d, i) => i === cur ? d.setAttribute("aria-current", "step") : d.removeAttribute("aria-current"));
    }
    const rate = () => parseFloat(speedSel.value) || 1;
    function schedule() {
      clearTimeout(timer); stopSpeech();
      if (!playing || !alive) return;
      const advance = () => { if (!playing || !alive) return; if (cur < scenes.length - 1) { cur++; render(); schedule(); } else setPlaying(false); };
      const sc = scenes[cur];
      if (speakBox.checked && speechOK() && speak(sc.title.replace(/^\d+\s*·\s*/, "") + ". " + sc.text, rate(), () => { timer = setTimeout(advance, 500); })) return;
      timer = setTimeout(advance, 7000 / rate());
    }
    function setPlaying(p) { playing = p; playBtn.textContent = p ? "❚❚ Pause" : "▶ Play"; if (!p) { clearTimeout(timer); stopSpeech(); } }
    function go(i, user) {
      cur = Math.max(0, Math.min(scenes.length - 1, i)); render();
      if (playing) schedule();
      else if (user && speakBox.checked && speechOK()) { stopSpeech(); speak(scenes[cur].text, rate()); }
    }
    playBtn.addEventListener("click", () => { if (playing) setPlaying(false); else { if (cur === scenes.length - 1) { cur = 0; render(); } setPlaying(true); schedule(); } });
    q(".prev").addEventListener("click", () => go(cur - 1, true));
    q(".next").addEventListener("click", () => go(cur + 1, true));
    speakBox.addEventListener("change", () => { if (!speakBox.checked) stopSpeech(); else if (playing) schedule(); });
    speedSel.addEventListener("change", () => { if (playing) schedule(); });
    q(".ts").addEventListener("click", function () { const tr = q(".transcript"); tr.hidden = !tr.hidden; this.setAttribute("aria-expanded", String(!tr.hidden)); });
    q(".player").addEventListener("keydown", (e) => {
      if (e.target.tagName === "SELECT") return;
      if (e.key === "ArrowRight") { go(cur + 1, true); e.preventDefault(); }
      if (e.key === "ArrowLeft") { go(cur - 1, true); e.preventDefault(); }
    });
    render();
    return { node: s, stop() { alive = false; setPlaying(false); } };
  }

  function renderRecall(t) {
    if (!t.recall || !t.recall.length) return null;
    const s = el("section");
    s.innerHTML = `<span class="eyebrow">Recall · in your own words</span><h2>Explain it back</h2>
      <p class="small muted">Write your answer first, then compare. Recall from memory makes the idea stick. A quiz only tests recognition.</p>`;
    const saved = store.get(tkey(t.id, "recall"), {});
    t.recall.forEach((r, i) => {
      const c = el("div", "card");
      const st = saved[i] || {};
      c.innerHTML = `<div class="qn">${esc(r.q)}</div>
        <textarea class="recall" id="ce-${esc(t.id)}-recall-${i}" aria-label="Your answer">${esc(st.text || "")}</textarea>
        <details class="reveal"><summary>Compare with a model answer</summary><div><div class="model">${r.model}</div>
        <div class="row small"><span class="muted">How did you do?</span>
          <button class="btn" type="button" data-g="got">Got it</button><button class="btn" type="button" data-g="partly">Partly</button><button class="btn" type="button" data-g="missed">Missed it</button>
          <span class="mono gl">${st.grade ? "· " + esc(st.grade) : ""}</span></div></div></details>`;
      const ta = c.querySelector("textarea");
      const save = (patch) => { const all = store.get(tkey(t.id, "recall"), {}); all[i] = Object.assign({}, all[i], patch); store.set(tkey(t.id, "recall"), all); };
      ta.addEventListener("input", () => save({ text: ta.value }));
      c.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => { save({ grade: b.dataset.g }); c.querySelector(".gl").textContent = "· " + b.dataset.g; }));
      s.appendChild(c);
    });
    return s;
  }

  function renderQuiz(t) {
    if (!t.quiz || !t.quiz.length) return null;
    const s = el("section");
    s.innerHTML = `<span class="eyebrow">Recall · self-check</span><h2>${t.quiz.length} questions</h2><p class="score"></p>`;
    const list = el("div", "quiz"); s.appendChild(list);
    const reset = el("button", "btn", "Reset answers"); reset.type = "button"; reset.style.justifySelf = "start"; s.appendChild(reset);
    function draw() {
      const ans = store.get(tkey(t.id, "quiz"), {});
      list.innerHTML = "";
      let right = 0, done = 0;
      t.quiz.forEach((item, qi) => {
        const p = ans[qi];
        if (p != null) { done++; if (p === item.a) right++; }
        const blk = choiceBlock(Object.assign({}, item, { q: (qi + 1) + ". " + item.q }), p, (oi) => { const a = store.get(tkey(t.id, "quiz"), {}); a[qi] = oi; store.set(tkey(t.id, "quiz"), a); draw(); });
        list.appendChild(blk);
      });
      s.querySelector(".score").textContent = done ? `Score: ${right} / ${t.quiz.length}` + (done < t.quiz.length ? ` (${t.quiz.length - done} left)` : "") : "Pick an answer to see why it is right or wrong. Your answers stay in this browser.";
    }
    reset.addEventListener("click", () => { store.set(tkey(t.id, "quiz"), {}); draw(); });
    draw();
    return s;
  }

  function renderCards(t) {
    if (!t.cards || !t.cards.length) return null;
    const s = el("section");
    s.innerHTML = `<span class="eyebrow">Review · spaced repetition</span><h2>Flashcards</h2>
      <p class="small muted">“Good” moves a card to the next review gap (1, 3, 7, 14, 30 days). “Again” brings it back in this session. The hub shows how many cards are due.</p>`;
    const box = el("div"); s.appendChild(box);
    let queue = [], showBack = false, practiceAll = false;
    function build() {
      const rec = store.get(tkey(t.id, "cards"), {}), now = Date.now();
      queue = t.cards.map((_, i) => i).filter((i) => practiceAll || !rec[i] || rec[i].due <= now);
    }
    function grade(i, good) {
      const rec = store.get(tkey(t.id, "cards"), {});
      const r = rec[i] || { step: -1 };
      if (good) { r.step = Math.min(r.step + 1, STEPS.length - 1); r.due = Date.now() + STEPS[r.step] * DAY; queue.shift(); }
      else { r.step = -1; r.due = Date.now(); queue.push(queue.shift()); }
      rec[i] = r; store.set(tkey(t.id, "cards"), rec);
      showBack = false; draw();
    }
    function draw() {
      box.innerHTML = "";
      if (!queue.length) {
        const { next } = cardsDue(t.id, t.cards.length);
        const c = el("div", "card fc", `<div class="side">No cards due.${isFinite(next) ? " Next review: " + new Date(next).toLocaleDateString() + "." : ""}</div>`);
        const b = el("button", "btn", "Practice all cards anyway"); b.type = "button";
        b.addEventListener("click", () => { practiceAll = true; build(); draw(); });
        c.appendChild(b); box.appendChild(c); return;
      }
      const i = queue[0], card = t.cards[i];
      const c = el("div", "card fc");
      c.innerHTML = `<div class="small muted">${queue.length} left</div><div class="side">${card.f}</div>${showBack ? `<div class="side back">${card.b}</div>` : ""}`;
      const row = el("div", "row"); row.style.justifyContent = "center";
      if (!showBack) { const b = el("button", "btn primary", "Show answer"); b.type = "button"; b.addEventListener("click", () => { showBack = true; draw(); }); row.appendChild(b); }
      else {
        const a = el("button", "btn", "Again"); a.type = "button"; a.addEventListener("click", () => grade(i, false));
        const g = el("button", "btn primary", "Good"); g.type = "button"; g.addEventListener("click", () => grade(i, true));
        row.append(a, g);
      }
      c.appendChild(row); box.appendChild(c);
    }
    build(); draw();
    return s;
  }

  const TIER = {
    source: "official page found",
    third: "confirmed by third party",
    search: "not confirmed · search link"
  };
  function resourceCard(r) {
    const a = el("a", "card rcard");
    a.href = r.url; a.target = "_blank"; a.rel = "noopener";
    a.innerHTML = `<span class="kind"><span class="eyebrow">${esc(r.kind)}</span><span class="tier ${esc(r.tier)}">${TIER[r.tier] || esc(r.tier)}</span></span>
      <span class="t">${esc(r.title)}</span>${r.note ? `<span class="small muted">${r.note}</span>` : ""}`;
    return a;
  }
  function renderResources(t) {
    if (!t.resources || !t.resources.length) return null;
    const s = el("section");
    s.innerHTML = `<span class="eyebrow">Go deeper · in this order</span><h2>Watch and read</h2>
      <p class="small muted legend"><span><span class="tier source">official page found</span>: the official site or repo showed up in a search</span><span><span class="tier third">confirmed by third party</span>: found only via listings or mirrors</span><span><span class="tier search">search link</span>: exact URL not confirmed</span></p>`;
    const g = el("div", "res");
    t.resources.forEach((r) => g.appendChild(resourceCard(r)));
    s.appendChild(g);
    return s;
  }

  function renderNext(t) {
    if (!t.next) return null;
    const s = el("section", "next");
    const link = t.next.id && topics[t.next.id] ? `<a class="btn" href="#${esc(t.next.id)}">Open topic →</a>` : "";
    s.innerHTML = `<span class="eyebrow">Next in your list</span><h3>${esc(t.next.title)}</h3><p class="small muted">${t.next.text}</p>${link}`;
    return s;
  }

  function enableCopy(root) {
    root.querySelectorAll("[data-ce-copy]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const src = root.querySelector(btn.getAttribute("data-ce-copy"));
        if (!src) return;
        const ok = () => { btn.textContent = "Copied"; setTimeout(() => (btn.textContent = "Copy"), 1500); };
        const fallback = () => { const r = document.createRange(); r.selectNodeContents(src); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = "Selected: press Ctrl+C"; };
        try { navigator.clipboard.writeText(src.textContent).then(ok, fallback); } catch (e) { fallback(); }
      });
    });
  }

  // ---------- views ----------
  function topicView(t, main) {
    store.set(tkey(t.id, "seen"), true);
    const parts = [];
    if (catalog) {
      const nav = el("nav", "topnav");
      nav.innerHTML = `<a class="chip" href="#hub">← All topics</a><span class="chip">${esc(catalog.title || "")}</span>`;
      document.body.insertBefore(nav, main);
      parts.push(() => nav.remove());
    }
    main.appendChild(renderHeader(t));
    [renderPrereqs(t), renderPredict(t)].forEach((n) => n && main.appendChild(n));
    const player = renderPlayer(t);
    if (player.node) main.appendChild(player.node);
    const body = el("div"); body.style.display = "contents"; body.innerHTML = t.html || "";
    main.appendChild(body);
    [renderRecall(t), renderQuiz(t), renderCards(t), renderResources(t), renderNext(t)].forEach((n) => n && main.appendChild(n));
    enableCopy(main);
    let cleanupInit = null;
    try { cleanupInit = t.init ? t.init(main) : null; } catch (e) { console.error(e); }
    document.title = t.title + (catalog ? " · " + (catalog.short || catalog.title) : "");
    return () => { player.stop(); parts.forEach((f) => f()); if (typeof cleanupInit === "function") cleanupInit(); };
  }

  function hubView(main) {
    const c = catalog;
    const all = c.phases.flatMap((p) => p.topics);
    const built = all.filter((tp) => topics[tp.id]);
    const done = all.filter((tp) => status(tp.id).cls === "done").length;
    const due = built.reduce((n, tp) => n + cardsDue(tp.id, (topics[tp.id].cards || []).length).due, 0);
    const h = el("header");
    h.innerHTML = `<span class="eyebrow">Study hub</span><h1>${esc(c.title)}</h1>${c.lede ? `<p class="lede">${c.lede}</p>` : ""}
      <div class="stats">
        <div class="card stat"><span class="n">${done} / ${all.length}</span><span class="small muted">topics done</span><div class="meter"><span style="width:${(done / all.length * 100).toFixed(0)}%"></span></div></div>
        <div class="card stat"><span class="n">${built.length}</span><span class="small muted">topic pages built</span></div>
        <div class="card stat"><span class="n">${due}</span><span class="small muted">flashcards due now</span></div>
      </div>`;
    main.appendChild(h);
    if (c.mapHtml) { const m = el("section"); m.innerHTML = c.mapHtml; main.appendChild(m); }
    c.phases.forEach((p) => {
      const s = el("section", "phase");
      s.innerHTML = `<span class="eyebrow">${esc(p.name)}</span>`;
      p.topics.forEach((tp) => {
        const st = status(tp.id);
        const isBuilt = !!topics[tp.id];
        const cd = isBuilt ? cardsDue(tp.id, (topics[tp.id].cards || []).length).due : 0;
        const row = el("div", "card trow");
        row.innerHTML = `<span class="num">${tp.num}</span>
          <div class="body"><h3>${isBuilt ? `<a href="#${esc(tp.id)}">${esc(tp.title)}</a>` : esc(tp.title)}</h3>
            <p class="small muted">${tp.blurb}</p>
            <div class="links">${(tp.resources || []).map((r) => `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a> <span class="tier ${esc(r.tier)}">${r.tier === "source" ? "✓ source" : r.tier === "third" ? "third party" : "search"}</span>`).join("")}</div>
            ${isBuilt && cd ? `<span class="small"><a href="#${esc(tp.id)}">${cd} flashcard${cd > 1 ? "s" : ""} due</a></span>` : ""}
          </div>
          <span class="status ${st.cls}">${st.label}</span>`;
        s.appendChild(row);
      });
      main.appendChild(s);
    });
    if (c.footer) main.appendChild(el("p", "small muted", c.footer));
    document.title = c.title;
    return null;
  }

  function route() {
    if (typeof current === "function") { try { current(); } catch (e) {} }
    current = null;
    stopSpeech();
    const main = document.querySelector("main");
    main.innerHTML = "";
    const id = (location.hash || "").replace(/^#/, "");
    if (topics[id]) current = topicView(topics[id], main);
    else if (catalog) current = hubView(main);
    else if (order.length) current = topicView(topics[order[0]], main);
    window.scrollTo(0, 0);
  }

  window.CE = {
    store, esc,
    register(t) { if (!topics[t.id]) order.push(t.id); topics[t.id] = t; },
    setCatalog(c) { catalog = c; if (c.storeKey) store.prefix = "ce:" + c.storeKey + ":"; },
    start() { if (!document.querySelector("main")) document.body.appendChild(el("main")); window.addEventListener("hashchange", route); route(); }
  };
})();
