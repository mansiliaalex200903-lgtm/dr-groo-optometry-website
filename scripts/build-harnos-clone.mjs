import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "_redesign-draft");
const srcHtml = path.join(process.env.TEMP || "/tmp", "harnos.html");

const html = fs.readFileSync(srcHtml, "utf8");
const styleStart = html.indexOf("<style>") + 7;
const styleEnd = html.indexOf("</style>");
let css = html.slice(styleStart, styleEnd);

css += `
/* Dr Groo adaptations */
.service-desc { font-size:.92rem; line-height:1.82; color:var(--stone); font-weight:400; flex:1; }
.ph-grey {
  background: linear-gradient(145deg, #c8c8c8 0%, #b0b0b0 100%) !important;
  width: 100%;
  height: 100%;
  display: block;
  min-height: 220px;
  border: 0;
}
.valeda-modal-img { background: #c5c5c5; min-height: 280px; }
.valeda-modal-img img, .office-slide img { display: none !important; }
.valeda-modal-img::after, .office-slide::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, #c8c8c8, #b0b0b0);
}
.valeda-modal-img, .office-slide { position: relative; overflow: hidden; }
.office-slide::before { z-index: 0; }
.office-caption { position: relative; z-index: 1; }
.nav-logo-img { display: none !important; }
.nav-logo-mark {
  width: 42px; height: 42px; flex-shrink: 0;
}
`;

fs.writeFileSync(path.join(outDir, "css", "style.css"), css, "utf8");

// Body from after </style> / before </html>, strip scripts we'll re-add carefully
let body = html.slice(html.indexOf("<body"));
body = body.replace(/<\/html>\s*$/i, "");

// Strip broken encoding leftovers later via replacements
const replacements = [
  [/Harnos Optometry/g, "Hudson Valley Eye Doctor"],
  [/Harnos<br><em>Optometry<\/em>/g, "Hudson Valley<br><em>Eye Doctor</em>"],
  [/Harnos\s*<br\s*\/?>\s*<em>Optometry<\/em>/gi, "Hudson Valley<br><em>Eye Doctor</em>"],
  [/Premier Eye Care in New Paltz, NY/g, "State of the Art in Eye Care · Newburgh, NY"],
  [/Premier Eye Care · New Paltz, NY/g, "Eye Care · Newburgh, NY"],
  [/Premier Eye Care Â· New Paltz, NY/g, "Eye Care · Newburgh, NY"],
  [/New Paltz, New York/g, "Newburgh, New York"],
  [/New Paltz, NY/g, "Newburgh, NY"],
  [/New Paltz/g, "Newburgh"],
  [/\(845\) 255-4696/g, "(845) 565-2020"],
  [/8452554696/g, "8455652020"],
  [/\(845\) 255-1201/g, "(845) 565-1202"],
  [/845-255-1201/g, "845-565-1202"],
  [/info@harnoseyecare\.com/g, "info@drelainamgroo.com"],
  [/222 Main Street/g, "1 Scobie Drive"],
  [/12561/g, "12550"],
  [/Est\.<\/span>\s*<span class="lbl">2023<br>/g, 'Est.</span><span class="lbl">40+ yrs<br>'],
  [/serving Newburgh and the Hudson Valley since 2023/g, "serving Newburgh and the Hudson Valley for over 40 years"],
  [/since 2023/g, "for over 40 years"],
  [/Drs\. Harnos and Morrison are also associate clinical professors at SUNY College of Optometry\./g,
    "Drs. Elaina M. Groo and John Kaknis bring over thirty years of experience in behavioral optometric care, ocular disease, dry eye, and specialty contact lenses."],
  [/Academic Excellence/g, "Experienced Doctors"],
  [/Our doctors teach at SUNY College of Optometry, keeping us at the cutting edge\./g,
    "Personal attention from doctors, licensed opticians, technicians, and a dedicated front desk team."],
  [/Over 600 frames and expert opticians to help you look great and see clearly\. Your style, your prescription, perfected\./g,
    "Designer frames and New York State licensed opticians—Michael Kors, Gucci, Ray-Ban, Nike and more."],
  [/Located in the heart of Newburgh, we serve the Hudson Valley with state-of-the-art technology and a genuinely personal approach\./g,
    "Located at 1 Scobie Drive in Newburgh, we serve the Hudson Valley with state-of-the-art technology and a genuinely personal approach."],
  [/New at Harnos Optometry/g, "New at Hudson Valley Eye Doctor"],
  [/Introducing <em>Valeda&trade; PBM<\/em>/g, "Introducing the <em>Biophotonic Scanner</em>"],
  [/The first FDA-approved treatment for dry macular degeneration\./g,
    "Testing for macular pigment and carotenoids to support long-term retinal health."],
  [/A gentle, non-invasive light therapy &mdash; no needles, no dilation, no downtime\. In just minutes, it's designed to help improve and maintain vision over time\./g,
    "MPOD testing helps identify risk factors for AMD and guides nutritional support with zeaxanthin and lutein."],
  [/100% Covered by Medicare/g, "Ask about macular health"],
  [/service-valeda\.html/g, "services.html"],
  [/our-doctors\.html/g, "our-practice.html"],
  [/insurance\.html/g, "patient-forms.html"],
  [/order-contacts\.html/g, "https://secure.yourlens.com/grookaknis/"],
  [/blog\.html/g, "blog.html"],
  [/contact\.html/g, "contact.html"],
  [/service-eye-exams\.html/g, "services.html"],
  [/service-glasses\.html/g, "services.html"],
  [/service-dry-eye\.html/g, "services.html"],
  [/service-pediatric\.html/g, "services.html"],
  [/service-myopia\.html/g, "services.html"],
  [/service-imaging\.html/g, "services.html"],
  [/service-scleral\.html/g, "services.html"],
  [/service-contacts\.html/g, "https://secure.yourlens.com/grookaknis/"],
  [/service-ortho\.html/g, "services.html"],
  [/https:\/\/book2\.getweave\.com\/[^"']+/g, "contact.html"],
  [/https:\/\/www\.google\.com\/maps\/search\/Harnos\+Optometry\+New\+Paltz/g, "https://maps.google.com/?q=1+Scobie+Drive+Newburgh+NY+12550"],
  [/https:\/\/harnoseyecare\.com\/the-eye-opener-test\//g, "blog.html"],
  [/We're a Harnos family for life\./g, "We're a Hudson Valley Eye Doctor family for life."],
  [/Dr\. Morrison was incredibly thorough/g, "Dr. Groo was incredibly thorough"],
  [/Brandon is amazing!/g, "The team is amazing!"],
  [/The premier medical providers in Newburgh!/g, "The premier eye care providers in Newburgh!"],
  [/Mon–Thu 9AM–1PM, 2PM–5PM/g, "Mon–Wed 9–5 · Thu 11–8"],
  [/Monâ€“Thu 9AMâ€“1PM, 2PMâ€“5PM/g, "Mon–Wed 9–5 · Thu 11–8"],
  [/Fri 8AMâ€“3PM/g, "Fri by appointment"],
  [/Fri 8AM–3PM/g, "Fri by appointment"],
  [/Etnia Barcelona Â· Tom Ford Â· Lool Â· Modo Â· Eco Â· Morel Â· ProDesign Â· Nifties Â· Kate Spade Â· Erkers Â· Silhouette Â· Klik Â· Garrett Leight Â· OGI Â· O&X/g,
    "Michael Kors · Gucci · Ray-Ban · Lilly Pulitzer · Safilo · Nike · Designer Frames · Digital Lenses"],
  [/Etnia Barcelona · Tom Ford · Lool · Modo · Eco · Morel · ProDesign · Nifties · Kate Spade · Erkers · Silhouette · Klik · Garrett Leight · OGI · O&X/g,
    "Michael Kors · Gucci · Ray-Ban · Lilly Pulitzer · Safilo · Nike · Designer Frames · Digital Lenses"],
];

for (const [re, to] of replacements) body = body.replace(re, to);

// Fix common mojibake
body = body
  .replace(/â€”/g, "—")
  .replace(/â€™/g, "'")
  .replace(/â€œ|â€/g, '"')
  .replace(/â€“/g, "–")
  .replace(/â†’/g, "→")
  .replace(/â˜…/g, "★")
  .replace(/Â·/g, "·")
  .replace(/â–¾/g, "▾")
  .replace(/â˜°/g, "☰")
  .replace(/â”€/g, "─");

// Remove logo img tags (use SVG mark instead via CSS hide); keep structure
// Build full document
const head = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Hudson Valley Eye Doctor — Dr. Elaina M. Groo &amp; Dr. John Kaknis</title>
<meta name="description" content="Independent optometry in Newburgh, NY. Comprehensive eye exams, optical, contact lenses, and advanced eye care. Call (845) 565-2020."/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&family=Jost:wght@200;300;400;500&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="css/style.css"/>
</head>
`;

// body currently starts with <body>... — strip duplicate style/script head pieces if any
// Remove inline <style> brand scroll is fine
// Inject SVG logo mark after nav-logo-link open
body = body.replace(
  /<a href="index\.html" class="nav-logo-link">\s*<img[^>]*>/,
  `<a href="index.html" class="nav-logo-link">
    <svg class="nav-logo-mark" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <rect x="10" y="18" width="100" height="84" stroke="#C4973D" stroke-width="1.5" opacity=".6"/>
      <path d="M18,68 Q60,30 102,68" stroke="#E0B55A" stroke-width="2.5" fill="none"/>
      <path d="M18,68 Q60,102 102,68" stroke="#E0B55A" stroke-width="2.5" fill="none"/>
      <circle cx="60" cy="68" r="17" stroke="#E0B55A" stroke-width="2"/>
      <circle cx="60" cy="68" r="9" stroke="#E0B55A" stroke-width="1.5"/>
      <circle cx="60" cy="68" r="3.5" fill="#E0B55A"/>
    </svg>`
);

const full = head + body + "\n</html>\n";
fs.writeFileSync(path.join(outDir, "index.html"), full, "utf8");
console.log("Wrote index.html", full.length, "and style.css", css.length);
