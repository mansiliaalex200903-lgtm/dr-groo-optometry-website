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
