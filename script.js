/* ==========================================================
   Portofolio — script.js
   Bagian: tema, menu mobile, animasi masuk, navigasi aktif,
   progress scroll, dan tahun di footer.
   ========================================================== */

const root = document.documentElement;
const STORAGE_KEY = "portofolio-tema";

/* ---------- 1. Tema terang / gelap ---------- */
// localStorage bisa diblokir (mode privat / file://), jadi dibungkus try/catch
const themeStore = {
  get() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  },
  set(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch { /* diabaikan */ }
  }
};

(function initTheme() {
  const saved = themeStore.get();
  if (saved === "dark" || saved === "light") {
    root.dataset.theme = saved;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.dataset.theme = "dark";
  }
})();

document.getElementById("themeToggle")?.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  themeStore.set(next);
});

/* ---------- 2. Menu mobile ---------- */
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
});

nav?.addEventListener("click", (e) => {
  if (e.target.tagName === "A" && nav.classList.contains("open")) {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

/* ---------- 3. Animasi masuk saat digulir ---------- */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  revealItems.forEach((el) => revealObserver.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("in"));
}

/* ---------- 4. Sorot menu sesuai bagian yang terlihat ---------- */
const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a")];

if ("IntersectionObserver" in window && sections.length) {
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => activeObserver.observe(s));
}

/* ---------- 5. Progress bar scroll ---------- */
const progress = document.getElementById("progress");

function updateProgress() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const ratio = max > 0 ? h.scrollTop / max : 0;
  progress.style.transform = `scaleX(${Math.min(ratio, 1)})`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

/* ---------- 6. Tahun otomatis di footer ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- 7. Formulir kontak ---------- */
// Situs ini statis (tanpa server), jadi formulir menyusun pesan lalu
// membukanya di aplikasi email pengunjung. Alamat tujuan diambil dari
// tautan email di daftar kontak, supaya cukup ganti di satu tempat.
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

if (contactForm) {
  const emailLink = document.getElementById("emailLink");
  const tujuanEmail = (emailLink?.getAttribute("href") || "")
    .replace(/^mailto:/i, "")
    .split("?")[0]
    .trim();

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      if (formNote) formNote.textContent = "Lengkapi nama, email, dan pesan terlebih dahulu.";
      return;
    }

    const data = new FormData(contactForm);
    const nilai = (kunci) => (data.get(kunci) || "").toString().trim();
    const nama = nilai("nama");
    const email = nilai("email");
    const subjek = nilai("subjek") || `Pesan dari ${nama}`;
    const pesan = nilai("pesan");

    const isi = [`Nama: ${nama}`, `Email: ${email}`, "", pesan].join("\n");
    const url =
      `mailto:${tujuanEmail}` +
      `?subject=${encodeURIComponent(subjek)}` +
      `&body=${encodeURIComponent(isi)}`;

    window.location.href = url;
    if (formNote) formNote.textContent = `Aplikasi email Anda dibuka. Jika tidak muncul, kirim langsung ke ${tujuanEmail}.`;
  });
}
