const nav = document.querySelector(".site-nav");
const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector("#site-menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

document.querySelectorAll(".nav-item.has-drop > button").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const item = btn.parentElement;
    const open = !item.classList.contains("is-open");
    document.querySelectorAll(".nav-item.has-drop").forEach((other) => {
      other.classList.remove("is-open");
      other.querySelector("button")?.setAttribute("aria-expanded", "false");
    });
    item.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
    event.stopPropagation();
  });
});

document.addEventListener("click", () => {
  document.querySelectorAll(".nav-item.has-drop").forEach((item) => {
    item.classList.remove("is-open");
    item.querySelector("button")?.setAttribute("aria-expanded", "false");
  });
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

const hero = document.querySelector(".hero");
const filmSticky = document.querySelector(".film-sticky");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let heroTick = false;

function updateHeroSlide() {
  heroTick = false;
  if (reduceMotion) return;
  const vh = window.innerHeight || 1;
  const y = window.scrollY;
  const heroP = Math.min(1, Math.max(0, y / vh));
  const filmP = Math.min(1, Math.max(0, y / (vh * 2)));
  hero?.style.setProperty("--hero-shift", `${heroP * 10}vh`);
  filmSticky?.style.setProperty("--film-shift", `${filmP * 8}vh`);
}

window.addEventListener(
  "scroll",
  () => {
    if (heroTick) return;
    heroTick = true;
    requestAnimationFrame(updateHeroSlide);
  },
  { passive: true }
);
updateHeroSlide();

const slides = [...document.querySelectorAll(".review-slide")];
const countEl = document.querySelector(".reviews-count");
const prevBtn = document.querySelector(".reviews-prev");
const nextBtn = document.querySelector(".reviews-next");
let reviewIndex = 0;

function showReview(index) {
  if (!slides.length) return;
  reviewIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("is-active", i === reviewIndex));
  if (countEl) {
    const n = String(reviewIndex + 1).padStart(2, "0");
    const total = String(slides.length).padStart(2, "0");
    countEl.textContent = `${n} / ${total}`;
  }
}

if (!reduceMotion) {
  const revealGroups = [
    [".intro-lead", ".intro-kicker", ".intro-copy p", ".intro-link"],
    [".services-head > *", ".pills", ".card"],
    [".focus h2", ".focus-col"],
    [".duo-card"],
    [".practice-inner > .label", ".practice-inner > h2", ".practice-lead", ".practice-step"],
    [".scanner-card-left > *", ".scanner-defs > *", ".scanner-bot > *"],
    [".why-head", ".why-card"],
    [".reviews-head", ".reviews-left", ".reviews-right"],
    [".faq-left", ".faq-item"],
    [".cta-inner > *"],
    [".footer-top > *", ".footer-cols > *", ".footer-bottom > *"],
  ];

  revealGroups.forEach((group) => {
    const els = group.flatMap((sel) => [...document.querySelectorAll(sel)]);
    els.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--d", `${Math.min(i, 5) * 80}ms`);
    });
  });

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealObs.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));
}

prevBtn?.addEventListener("click", () => showReview(reviewIndex - 1));
nextBtn?.addEventListener("click", () => showReview(reviewIndex + 1));

document.querySelectorAll(".faq-item").forEach((item) => {
  const btn = item.querySelector("button");
  btn?.addEventListener("click", () => {
    const open = item.classList.contains("is-open");
    document.querySelectorAll(".faq-item").forEach((other) => {
      other.classList.remove("is-open");
      other.querySelector("button")?.setAttribute("aria-expanded", "false");
    });
    if (!open) {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});
