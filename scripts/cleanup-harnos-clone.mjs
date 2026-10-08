import fs from "fs";

const p = "_redesign-draft/index.html";
let h = fs.readFileSync(p, "utf8");
const before = h.length;

h = h.replace(/src="data:image\/[^"]+"/g, 'src=""');
h = h.replace(/url\(data:image\/[^)]+\)/g, "url()");
h = h.replace(/\u00C2\u00B7/g, "·");
h = h.replace(/Â·/g, "·");
h = h.replace(/c 2025/g, "© 2026");
h = h.replace(/© 2025/g, "© 2026");

// Replace empty imgs in modal/office with grey blocks via CSS already;
// also add ph-grey class wrappers where helpful
h = h.replace(
  /(<div class="valeda-modal-img">)\s*<img[^>]*>/g,
  '$1<div class="ph-grey" role="img" aria-label="Announcement image placeholder"></div>'
);
h = h.replace(
  /(<div class="office-slide[^"]*"[^>]*>)\s*<img[^>]*>/g,
  '$1<div class="ph-grey" role="img" aria-hidden="true"></div>'
);

fs.writeFileSync(p, h);
console.log({ before, after: h.length });
console.log({
  hero: h.includes("hero-eye"),
  services: h.includes("services-grid"),
  about: h.includes("about-section"),
  reviews: h.includes("reviews-carousel"),
  footer: h.includes("footer-logo"),
});
