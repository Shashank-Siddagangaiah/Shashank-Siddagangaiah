#!/usr/bin/env node
/* check_page.js - one-pass check of a study page before you publish it.

   Usage: node check_page.js PAGE.html [--shots DIR] [--text OUT.txt]
   --text writes the visible text of every route, so ste_lint.py can measure pages whose text lives in JS.

   PAGE.html must be a full document. For a file built with --artifact, the script wraps it in a
   skeleton first. It checks, at desktop (1100px, light) and phone (400px, dark) widths:
     - no page errors and no console errors
     - no horizontal page scroll
     - every route: the hub and each #topic linked from it (engine pages), or the single page
     - the scene player: clicks Next through every scene; each scene must draw some SVG
     - quiz persistence: answers question 1, reloads, expects the answer to still show
   It prints PASS/FAIL lines and exits 1 on any failure. --shots saves a full-page PNG per view.
   Uses the pre-installed Playwright + Chromium (require('playwright')). */
const fs = require("fs");
const path = require("path");
const os = require("os");
let chromium;
try { ({ chromium } = require("playwright")); } catch (e) { console.error("playwright not found: run where require('playwright') works"); process.exit(2); }

const args = process.argv.slice(2);
const file = args.find((a, i) => !a.startsWith("--") && !["--shots", "--text"].includes(args[i - 1]));
const shotsIdx = args.indexOf("--shots");
const shots = shotsIdx >= 0 ? args[shotsIdx + 1] : null;
const textIdx = args.indexOf("--text");
const textOut = textIdx >= 0 ? args[textIdx + 1] : null;   // rendered text of every route, for ste_lint.py
const texts = [];
if (!file) { console.error("usage: node check_page.js PAGE.html [--shots DIR]"); process.exit(2); }

let src = fs.readFileSync(file, "utf8");
let target = path.resolve(file);
if (!/^\s*<!doctype/i.test(src)) {
  src = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + src + "</body></html>";
  target = path.join(os.tmpdir(), "check_page_" + process.pid + ".html");
  fs.writeFileSync(target, src);
}
const url = "file://" + target;
let failures = 0;
const fail = (m) => { failures++; console.log("FAIL " + m); };
const pass = (m) => console.log("PASS " + m);

(async () => {
  const browser = await chromium.launch();
  for (const [label, width, scheme] of [["desktop-light", 1100, "light"], ["phone-dark", 400, "dark"]]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
    const page = await ctx.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push(e.message));
    page.on("console", (m) => { if (m.type() === "error" && !/fonts\.(googleapis|gstatic)/.test(m.text())) errs.push(m.text()); });
    await page.goto(url);
    await page.waitForTimeout(300);
    const hashes = await page.evaluate(() => Array.from(new Set(Array.from(document.querySelectorAll('a[href^="#"]')).map((a) => a.getAttribute("href")).filter((h) => h.length > 1 && h !== "#hub"))));
    const routes = [""].concat(hashes.slice(0, 20));
    for (const h of routes) {
      const name = `${label} ${h || "(start)"}`;
      await page.goto(url + h);
      await page.waitForTimeout(250);
      const hs = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      hs ? fail(name + ": horizontal scroll") : pass(name + ": no horizontal scroll");
      if (textOut && label === "desktop-light") texts.push(await page.evaluate(() => { const c = document.querySelector("main") || document.body; const k = c.cloneNode(true); k.querySelectorAll("svg, pre, code, script, style, textarea, button, select, .legend, .tier, .chip").forEach((e) => e.remove()); k.querySelectorAll(".transcript").forEach((e) => e.removeAttribute("hidden")); return k.innerText; }));
      const n = (await page.locator(".player .next").count()) ? await page.locator(".player .dot").count() : 0;
      if (n) {
        let empty = 0;
        for (let i = 0; i < n; i++) {
          const kids = await page.evaluate(() => { const g = document.querySelector(".player .stage svg .scene"); return g ? g.childElementCount : 0; });
          if (!kids) empty++;
          if (i < n - 1) await page.click(".player .next", { timeout: 3000 }).catch(() => {});
        }
        empty ? fail(`${name}: ${empty}/${n} scenes drew nothing`) : pass(`${name}: ${n} scenes drawn`);
      }
      const quizBtn = page.locator(".quiz .opt").first();
      if (await quizBtn.count()) {
        await quizBtn.click({ timeout: 3000 }).catch(() => {});
        await page.reload();
        await page.waitForTimeout(250);
        const kept = await page.locator(".quiz .opt.right, .quiz .opt.wrong").count();
        kept ? pass(name + ": quiz answer kept after reload") : fail(name + ": quiz answer lost after reload");
        await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
      }
      if (shots) { fs.mkdirSync(shots, { recursive: true }); await page.screenshot({ path: path.join(shots, `${label}${h.replace("#", "_") || "_start"}.png`), fullPage: true }); }
    }
    errs.length ? fail(`${label}: errors: ${[...new Set(errs)].join(" | ")}`) : pass(`${label}: no console errors`);
    await ctx.close();
  }
  await browser.close();
  if (textOut) { fs.writeFileSync(textOut, texts.join("\n\n")); console.log("wrote rendered text to " + textOut + " (lint it with ste_lint.py)"); }
  console.log(failures ? `${failures} check(s) failed` : "all checks passed");
  process.exit(failures ? 1 : 0);
})();
