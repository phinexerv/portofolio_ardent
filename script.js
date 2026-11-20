/* ==========================================================
   Portofolio — script.js
   Bagian: tema, menu mobile, animasi masuk (stagger), navigasi
   aktif, progress scroll, tahun footer, formulir, judul hero,
   spotlight/magnetik/ripple, header blur & parallax.
   ========================================================== */

const root = document.documentElement;
const STORAGE_KEY = "portofolio-tema";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
  const apply = () => {
    root.dataset.theme = next;
    themeStore.set(next);
  };
  // View Transitions membuat pergantian tema memudar mulus (bila didukung)
  if (document.startViewTransition && !reduceMotion.matches) {
    try {
      document.startViewTransition(apply);
      return;
    } catch { /* lanjut tanpa transisi */ }
  }
  apply();
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
// Kelompok ber-atribut data-stagger: setiap anak muncul berurutan
document.querySelectorAll("[data-stagger]").forEach((group) => {
  [...group.children].forEach((child, i) => {
    child.classList.add("reveal");
    child.style.setProperty("--i", Math.min(i, 6));
  });
});

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

/* ---------- 8. Judul hero: muncul baris per baris ---------- */
(function splitDisplayLines() {
  const el = document.querySelector(".hero .display");
  if (!el) return;

  if (reduceMotion.matches) {
    el.classList.add("is-split");
    return;
  }

  try {
    const lines = [[]];
    [...el.childNodes].forEach((node) => {
      if (node.nodeType === 1 && node.tagName === "BR") lines.push([]);
      else lines[lines.length - 1].push(node);
    });

    const frag = document.createDocumentFragment();
    lines.forEach((nodes, i) => {
      if (!nodes.length) return;
      const line = document.createElement("span");
      line.className = "line";
      const inner = document.createElement("span");
      inner.style.setProperty("--i", i);
      nodes.forEach((node) => inner.appendChild(node.cloneNode(true)));
      line.appendChild(inner);
      frag.appendChild(line);
    });

    el.replaceChildren(frag);
    el.classList.add("is-split");
  } catch {
    // bila gagal, tampilkan judul seperti biasa
    document.documentElement.classList.remove("js");
  }
})();

/* ---------- 9. Spotlight & tombol magnetik (kursor mouse) ---------- */
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (finePointer.matches && !reduceMotion.matches) {
  document.querySelectorAll(".spotlight").forEach((host) => {
    host.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType !== "mouse") return;
        const rect = host.getBoundingClientRect();
        host.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        host.style.setProperty("--my", `${event.clientY - rect.top}px`);
      },
      { passive: true }
    );
  });

  document.querySelectorAll(".btn-send").forEach((btn) => {
    btn.addEventListener("pointermove", (event) => {
      const rect = btn.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      btn.style.setProperty("--tx", `${(x * 6).toFixed(1)}px`);
      btn.style.setProperty("--ty", `${(y * 4).toFixed(1)}px`);
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.setProperty("--tx", "0px");
      btn.style.setProperty("--ty", "0px");
    });
  });
}

/* ---------- 10. Ripple saat tombol kirim diklik ---------- */
document.querySelectorAll(".btn-send").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    if (reduceMotion.matches) return;
    const rect = btn.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    const size =
      Math.hypot(
        Math.max(x - rect.left, rect.right - x),
        Math.max(y - rect.top, rect.bottom - y)
      ) * 2;

    const wave = document.createElement("span");
    wave.className = "ripple";
    wave.style.width = `${size}px`;
    wave.style.height = `${size}px`;
    wave.style.left = `${x - rect.left}px`;
    wave.style.top = `${y - rect.top}px`;
    btn.appendChild(wave);
    wave.addEventListener("animationend", () => wave.remove());
  });
});

/* ---------- 11. Header blur & parallax foto ---------- */
const siteHeader = document.querySelector(".site-header");
const portraitImg = document.querySelector(".portrait img");
let scrollFrame = 0;

function onScrollFrame() {
  scrollFrame = 0;

  if (siteHeader) {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 6);
  }

  if (portraitImg && !reduceMotion.matches) {
    const box = portraitImg.parentElement.getBoundingClientRect();
    if (box.bottom > -60 && box.top < window.innerHeight + 60) {
      const offset =
        (box.top + box.height / 2 - window.innerHeight / 2) / window.innerHeight;
      portraitImg.style.setProperty("--py", `${(offset * -16).toFixed(1)}px`);
    }
  }
}

function requestScrollFrame() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(onScrollFrame);
}

window.addEventListener("scroll", requestScrollFrame, { passive: true });
window.addEventListener("resize", requestScrollFrame);
requestScrollFrame();
