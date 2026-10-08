/**
 * Mirror https://www.drelainamgroo.com/ into ./live for offline redesign.
 * Downloads pages, uploads, theme assets, and Weebly CDN CSS/JS/fonts.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "live");
const BASE = "https://www.drelainamgroo.com";

const PAGES = [
  "/",
  "/our-practice.html",
  "/patient-forms.html",
  "/contact-us.html",
  "/our-services--whats-new.html",
  "/biophotonic-scanner.html",
  "/eye-care-provider.html",
  "/your-examination-visit.html",
  "/cosmetic-non-surgical-eye-lid-lift.html",
  "/optical.html",
  "/contact-lens-video.html",
  "/diabeties-and-the-eye.html",
  "/retinal-health.html",
  "/things-you-want-to-know.html",
  "/for-fun.html",
  "/optical-products.html",
  "/category.html",
  "/vuity.html",
  "/swim-goggles.html",
  "/new-page.html",
  "/new-products.html",
  "/blog.html",
  "/eye-lids-and-lashes.html",
  "/new-page1.html",
  "/privacy-notice.html",
];

const CORE_CDN = [
  "https://cdn11.editmysite.com/css/sites.css?buildtime=1788266894",
  "https://cdn11.editmysite.com/css/old/fancybox.css?buildtime=1788266894",
  "https://cdn11.editmysite.com/css/social-icons.css?buildtime=1788266894",
  "https://cdn11.editmysite.com/js/jquery-1.8.3.min.js",
  "https://cdn11.editmysite.com/js/site/main.js?buildtime=1788266894",
  "https://cdn11.editmysite.com/js/site/commerce-core.js?buildtime=1788266894",
  "https://cdn11.editmysite.com/js/site/main-commerce-browse.js?buildtime=1788266894",
  "https://cdn2.editmysite.com/js/lang/en/stl.js?buildTime=1788266894&",
  "https://cdn2.editmysite.com/js/site/main-customer-accounts-site.js?buildtime=1788266894",
  "https://cdn2.editmysite.com/fonts/Lato/font.css?2",
  "https://cdn2.editmysite.com/fonts/Cookie/font.css?2",
  "https://cdn2.editmysite.com/fonts/Roboto/font.css?2",
  "https://cdn2.editmysite.com/fonts/Montserrat/font.css?2",
  "https://cdn2.editmysite.com/fonts/Cardo/font.css?2",
  "https://cdn2.editmysite.com/images/old/bg_feed.gif",
  "https://cdn2.editmysite.com/images/util/videojs/play-icon.png",
  "https://cdn2.editmysite.com/images/util/videojs/@2x/play-icon.png",
  "https://cdn2.editmysite.com/images/editor/theme-background/stock/Orange-Blue.jpg",
];

const THEME_ASSETS = [
  "/files/theme/images/default-bg.jpg",
  "/files/theme/images/search.svg",
  "/files/theme/images/select-dropdown.png",
  "/files/main_style.css",
  "/files/templateArtifacts.js",
  "/files/theme/custom.js",
  "/files/theme/mobile.js",
  "/files/theme/plugins.js",
];

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function stripQuery(u) {
  try {
    const url = new URL(u, BASE);
    return url.pathname + (url.hash || "");
  } catch {
    return u.split("?")[0];
  }
}

function localPathFromUrl(u) {
  const abs = u.startsWith("//") ? "https:" + u : u.startsWith("http") ? u : BASE + (u.startsWith("/") ? u : "/" + u);
  const url = new URL(abs);
  if (url.hostname.includes("editmysite.com") || url.hostname.includes("weebly.com")) {
    // Map CDN to live/cdn/<host>/...
    const p = url.pathname.replace(/^\//, "");
    return path.join(OUT, "cdn", url.hostname, p);
  }
  if (url.hostname.includes("drelainamgroo.com") || u.startsWith("/") || u.startsWith("uploads") || u.startsWith("files")) {
    const p = url.pathname.replace(/^\//, "");
    return path.join(OUT, p || "index.html");
  }
  return null;
}

async function download(url, dest, retries = 3) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    return { skipped: true, dest };
  }
  ensureDir(dest);
  const abs = url.startsWith("//") ? "https:" + url : url.startsWith("http") ? url : BASE + url;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(abs, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "*/*",
        },
        redirect: "follow",
      });
      if (!res.ok) {
        if (res.status === 404) return { error: 404, url: abs };
        throw new Error(`HTTP ${res.status}`);
      }
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buf);
      return { ok: true, dest, bytes: buf.length };
    } catch (e) {
      if (i === retries - 1) return { error: String(e.message || e), url: abs };
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
}

function extractUrls(text) {
  const found = new Set();
  const re = /(?:href|src|data-src|poster)=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(text))) found.add(m[1]);
  const re2 = /url\(["']?([^"')\s]+)["']?\)/gi;
  while ((m = re2.exec(text))) found.add(m[1].replace(/&quot;/g, "").replace(/^"|"$/g, ""));
  return [...found];
}

function rewriteHtml(html) {
  let out = html;

  // Absolute site paths stay as /files /uploads (serve from live root) — fine.
  // Point CDN URLs to local ./cdn/...
  out = out.replace(/https?:\/\/cdn(\d+)\.editmysite\.com\//g, "/cdn/cdn$1.editmysite.com/");
  out = out.replace(/\/\/cdn(\d+)\.editmysite\.com\//g, "/cdn/cdn$1.editmysite.com/");
  out = out.replace(/https?:\/\/www\.weebly\.com\//g, "/cdn/www.weebly.com/");
  out = out.replace(/\/\/www\.weebly\.com\//g, "/cdn/www.weebly.com/");

  // Strip cache-busting query on local assets for cleaner local serving
  out = out.replace(/(\/(?:files|uploads|cdn)\/[^"'?\s]+)\?[^"'\s]*/g, "$1");

  // Cloudflare email protection -> plain mailto for local use
  out = out.replace(
    /href="\/cdn-cgi\/l\/email-protection[^"]*"/g,
    'href="mailto:info@drelainamgroo.com"'
  );

  return out;
}

function rewriteCss(css, cssFileUrl) {
  let out = css;
  // Rewrite CDN urls inside CSS
  out = out.replace(/https?:\/\/cdn(\d+)\.editmysite\.com\//g, "/cdn/cdn$1.editmysite.com/");
  out = out.replace(/\/\/cdn(\d+)\.editmysite\.com\//g, "/cdn/cdn$1.editmysite.com/");
  // Relative urls in font.css need to stay relative to css file location — download those separately
  return out;
}

async function processCssForFonts(cssPath, cssUrl) {
  if (!fs.existsSync(cssPath)) return;
  let css = fs.readFileSync(cssPath, "utf8");
  const urls = extractUrls(css);
  const baseUrl = new URL(cssUrl);
  for (const u of urls) {
    if (u.startsWith("data:")) continue;
    let abs;
    try {
      abs = new URL(u, baseUrl).href;
    } catch {
      continue;
    }
    if (!abs.includes("editmysite.com") && !abs.includes("weebly.com")) continue;
    const dest = localPathFromUrl(abs);
    if (!dest) continue;
    await download(abs, dest);
  }
  css = rewriteCss(css);
  // Fix relative font urls: they are relative to the css file which is under /cdn/cdn2.../fonts/X/
  // Leave relative paths as-is since we download next to them.
  fs.writeFileSync(cssPath, css);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const queue = new Set();
  const downloadedPages = [];

  console.log("Downloading pages...");
  for (const page of PAGES) {
    const url = BASE + page;
    const dest =
      page === "/"
        ? path.join(OUT, "index.html")
        : path.join(OUT, page.replace(/^\//, ""));
    const r = await download(url, dest);
    if (r.error && r.error !== "skipped") {
      // force re-download pages always for freshness
    }
    // Always overwrite HTML pages for fresh rewrite
    {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      if (res.ok) {
        let html = await res.text();
        for (const u of extractUrls(html)) queue.add(u);
        html = rewriteHtml(html);
        ensureDir(dest);
        fs.writeFileSync(dest, html, "utf8");
        downloadedPages.push(page);
        console.log("  page", page);
      } else {
        console.log("  FAIL page", page, res.status);
      }
    }
  }

  console.log("Downloading theme assets...");
  for (const a of THEME_ASSETS) {
    const dest = path.join(OUT, a.replace(/^\//, "").split("?")[0]);
    const r = await download(a, dest);
    console.log(" ", a, r.ok ? "ok" : r.skipped ? "exists" : r.error);
    if (a.endsWith(".css") && fs.existsSync(dest)) {
      for (const u of extractUrls(fs.readFileSync(dest, "utf8"))) queue.add(u);
    }
  }

  console.log("Downloading core CDN...");
  for (const a of CORE_CDN) {
    const dest = localPathFromUrl(a);
    if (!dest) continue;
    const r = await download(a, dest);
    console.log(" ", path.relative(OUT, dest), r.ok ? "ok" : r.skipped ? "exists" : r.error);
    if (dest.endsWith(".css") || a.includes("font.css")) {
      await processCssForFonts(dest, a.startsWith("//") ? "https:" + a : a);
    }
    if (fs.existsSync(dest) && (dest.endsWith(".css") || dest.endsWith(".js"))) {
      try {
        for (const u of extractUrls(fs.readFileSync(dest, "utf8"))) queue.add(u);
      } catch {}
    }
  }

  // Collect upload/image refs from all HTML
  for (const page of downloadedPages) {
    const dest =
      page === "/"
        ? path.join(OUT, "index.html")
        : path.join(OUT, page.replace(/^\//, ""));
    if (fs.existsSync(dest)) {
      for (const u of extractUrls(fs.readFileSync(dest, "utf8"))) queue.add(u);
    }
  }

  console.log("Downloading discovered assets...", queue.size);
  let n = 0;
  for (const u of queue) {
    if (!u || u.startsWith("data:") || u.startsWith("mailto:") || u.startsWith("tel:") || u.startsWith("#"))
      continue;
    if (u.startsWith("javascript:")) continue;
    // Skip external non-asset services
    if (/google|facebook|instagram|linkedin|recaptcha|smilereminder|solutionreach|yourlens|eyepromise|saveonvision|cursors-4u|eyefinity/i.test(u) && !/editmysite|weebly|drelainamgroo|\/uploads\/|\/files\//i.test(u))
      continue;

    let abs = u;
    if (u.startsWith("//")) abs = "https:" + u;
    else if (u.startsWith("/")) abs = BASE + u.split("?")[0];
    else if (!u.startsWith("http")) {
      // relative theme paths like theme/images/...
      if (u.startsWith("theme/")) abs = BASE + "/files/" + u.split("?")[0];
      else continue;
    }

    // Only mirror site + weebly CDN assets
    if (!/drelainamgroo\.com|editmysite\.com|weebly\.com|\/uploads\/|\/files\//i.test(abs) && !u.startsWith("/uploads") && !u.startsWith("/files") && !u.startsWith("theme/"))
      continue;

    const clean = abs.split("?")[0];
    const dest = localPathFromUrl(clean.startsWith("http") ? clean : u.startsWith("/") ? clean : abs);
    if (!dest) continue;

    // Avoid downloading HTML pages again as assets
    if (dest.endsWith(".html") && path.dirname(dest) === OUT) continue;

    const r = await download(clean, dest);
    n++;
    if (r.ok) console.log("  +", path.relative(OUT, dest));
    else if (r.error && r.error !== 404) console.log("  !", clean, r.error);
    else if (r.error === 404) console.log("  404", clean);

    // If CSS, chase fonts
    if (dest.endsWith(".css") && fs.existsSync(dest)) {
      await processCssForFonts(dest, clean);
    }
  }

  // Rewrite main_style.css query strings in url()
  const mainCss = path.join(OUT, "files", "main_style.css");
  if (fs.existsSync(mainCss)) {
    let css = fs.readFileSync(mainCss, "utf8");
    css = css.replace(/url\(([^)]+)\?[^)]+\)/g, "url($1)");
    fs.writeFileSync(mainCss, css);
  }

  // Write a simple README
  const readme = `# Local mirror of https://www.drelainamgroo.com/

This folder is a 1:1 offline starter copy of the live Weebly site for redesign work.

## Run

From the project root:

\`\`\`
npm run dev
\`\`\`

Then open http://localhost:3001

## Structure

- \`*.html\` — site pages (same paths as live)
- \`files/\` — theme CSS/JS/images
- \`uploads/\` — media uploaded on the live site
- \`cdn/\` — Weebly/EditMySite CSS, JS, and fonts (localized)

External embeds (appointment scheduler, reviews widget, contact-lens store) still point at their live hosts.
`;
  fs.writeFileSync(path.join(OUT, "README.md"), readme);

  console.log("\nDone. Pages:", downloadedPages.length, "Asset pass items:", n);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
