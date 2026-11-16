/* Minimal complete topic for the clear-explainer engine. Copy it, then replace every field.
   Build:  python3 scripts/build_page.py --out /tmp/demo.html assets/example-topic.js
   Check:  node scripts/check_page.js /tmp/demo.html
   Note: the toy numbers below are computed by code (bs()), never typed in by hand. */
(function () {
  const A = [3, 8, 12, 17, 21, 26, 30, 35, 41]; // sorted toy array
  const TARGET = 26;
  // Every number on the page comes from this one function: the walkthrough and the lab both use it.
  function bs(arr, x) {
    const steps = [];
    let lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      steps.push({ lo, hi, mid, v: arr[mid] });
      if (arr[mid] === x) return { found: mid, steps };
      if (arr[mid] < x) lo = mid + 1; else hi = mid - 1;
    }
    return { found: -1, steps };
  }
  const RUN = bs(A, TARGET);
  const X = (i) => 40 + i * 72;

  function row(step, label) {
    let s = "";
    A.forEach((v, i) => {
      const out = step && (i < step.lo || i > step.hi);
      const isMid = step && i === step.mid;
      s += `<rect class="${isMid ? "s-hi" : "s-box"}" x="${X(i)}" y="120" width="60" height="44" rx="6"${out ? ' opacity="0.3"' : ""}/>`;
      s += `<text class="s-fg t-mono" x="${X(i) + 30}" y="147" text-anchor="middle" font-size="14"${out ? ' opacity="0.3"' : ""}>${v}</text>`;
      s += `<text class="s-muted t-mono" x="${X(i) + 30}" y="186" text-anchor="middle" font-size="11">${i}</text>`;
    });
    if (step) s += `<text class="t-q" x="${X(step.mid) + 30}" y="104" text-anchor="middle" font-size="12" font-weight="600">mid</text>`;
    s += `<text class="s-fg" x="360" y="250" text-anchor="middle" font-size="14">${label}</text>`;
    return s;
  }

  CE.register({
    id: "binary-search",
    num: 1, total: 1, list: "Example list", phase: "Basics",
    title: "Binary Search",
    lede: "Binary search finds a value in a <b>sorted</b> list. It checks the middle item and throws away the half that can't hold the value.",
    checked: "2026-11-16",
    prereqs: [{ text: "What a sorted list is." }, { text: "How integer division rounds down." }],
    predict: { q: "A sorted list has 1,000,000 items. About how many checks does binary search need in the worst case?", o: ["About 20", "About 1,000", "About 500,000", "About 1,000,000"], a: 0, why: "Each check halves the range: 2^20 ≈ 1,000,000, so about 20 checks." },
    playerTitle: "Find 26 in nine numbers",
    playerIntro: `The numbers on the stage come from a real run of the algorithm on this page.`,
    scenes: [
      { title: "1 · The sorted list", text: "The list is sorted from small to large. We look for " + TARGET + ".", draw: () => row(null, "Target: " + TARGET) },
      ...RUN.steps.map((st, k) => ({
        title: `${k + 2} · Check index ${st.mid}`,
        text: st.v === TARGET ? `The middle item is ${st.v}. It matches, so the search stops after ${k + 1} checks.`
          : `The middle item is ${st.v}. ${st.v < TARGET ? "It is too small, so the left half goes away." : "It is too big, so the right half goes away."}`,
        draw: () => row(st, `range ${st.lo}–${st.hi}, middle ${st.mid}`)
      }))
    ],
    html: `
<section><span class="eyebrow">Understand</span><h2>The idea in three steps</h2>
<ol class="steps">
<li><span>Look at the middle item of the current range.</span></li>
<li><span>If it is too small, keep only the right half. If it is too big, keep only the left half.</span></li>
<li><span>Repeat until you find the value or the range is empty.</span></li>
</ol></section>
<section><span class="eyebrow">Work it out by hand</span>
<details class="reveal"><summary>In [2, 4, 6, 8, 10, 12, 14], which indexes does the search check to find 12?</summary>
<div><p>Index 3 (value 8, too small), then index 5 (value 12, match). Two checks.</p></div></details></section>
<section><span class="eyebrow">Code · Python</span>
<div class="code"><button class="btn copy" type="button" data-ce-copy="#bs-code">Copy</button>
<pre id="bs-code">def binary_search(arr, x):
    lo, hi = 0, len(arr) - 1
    while lo &lt;= hi:
        mid = (lo + hi) // 2
        if arr[mid] == x:
            return mid
        if arr[mid] &lt; x:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1</pre></div></section>`,
    recall: [{ q: "Why must the list be sorted?", model: "The search throws away half the list after one comparison. That is only safe when every item on one side is known to be smaller or larger." }],
    quiz: [
      { q: "The middle item is smaller than the target. What happens?", o: ["Keep the right half", "Keep the left half", "Stop the search", "Sort the list again"], a: 0, why: "Everything left of a too-small item is also too small." },
      { q: "What is the worst-case number of checks for n items?", o: ["About log₂ n", "About n / 2", "About n", "About √n"], a: 0, why: "The range halves each time." }
    ],
    cards: [{ f: "Precondition of binary search?", b: "The list is sorted." }, { f: "Worst-case checks for n items?", b: "About log₂ n." }],
    resources: [{ kind: "Docs", title: "Python bisect module", url: "https://docs.python.org/3/library/bisect.html", tier: "search", note: "Example only: replace with links you checked." }],
    next: { title: "Next topic", text: "Say what comes next and how it connects." },
    init(root) { return () => {}; } // set up the lab here; return a cleanup function
  });
})();
