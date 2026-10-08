const quotes = [
  {
    text: "They explained everything clearly and helped me find frames that fit my life—not just my prescription.",
    author: "— Amanda K.",
  },
  {
    text: "Without a doubt the most comprehensive eye exam I've ever had—clear answers and care I trust.",
    author: "— Jessica M.",
  },
  {
    text: "Warm, welcoming, and precise. We've been patients for years and always feel looked after.",
    author: "— David R.",
  },
];

let quoteIndex = 0;
const quoteEl = document.querySelector(".stories-quote blockquote > p");
const authorEl = document.querySelector(".stories-quote cite");
const storiesNum = document.querySelector(".stories-num");

function renderQuote(i) {
  if (!quoteEl || !authorEl) return;
  quoteIndex = (i + quotes.length) % quotes.length;
  quoteEl.textContent = quotes[quoteIndex].text;
  authorEl.textContent = quotes[quoteIndex].author;
  if (storiesNum) {
    const n = String(quoteIndex + 1).padStart(2, "0");
    storiesNum.textContent = `${n} / 0${quotes.length}`;
  }
}

document.querySelectorAll(".stories-nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    renderQuote(quoteIndex + Number(btn.dataset.dir));
  });
});

const menuBtn = document.querySelector(".nav-burger");
const navPrimary = document.querySelector(".nav-primary");
if (menuBtn && navPrimary) {
  menuBtn.addEventListener("click", () => {
    const open = navPrimary.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
}
