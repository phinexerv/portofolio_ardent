# Portofolio Sederhana

Website portofolio statis: HTML + CSS + JavaScript murni. Tanpa instalasi, tanpa build tool.

## Struktur

```
portofolio/
├── index.html   → isi & struktur halaman
├── style.css    → warna, font, tata letak
├── script.js    → tema gelap/terang, menu mobile, animasi
└── README.md
```

## Cara melihat hasilnya

1. Klik dua kali `index.html` (terbuka di browser), atau
2. Di VSCode: klik kanan `index.html` → **Open with Live Server**
   (pasang ekstensi *Live Server* dulu kalau belum ada — halaman otomatis refresh setiap kali disimpan).

## Yang perlu diganti

| Lokasi | Bagian |
|---|---|
| `index.html` baris `<title>` & `<meta name="description">` | Nama, headline, deskripsi untuk mesin pencari |
| `.hero-copy` | Eyebrow, judul besar, perkenalan singkat, dua tautan aksi |
| `.portrait` | Foto profil: `foto-profil.jpg` (crop 4:5 dari `perayaan.kelulusan-20.jpg`, 1000×1250 px, 177 KB). Mau ganti foto? Timpa saja berkas dengan nama yang sama |
| `.facts` | Bidang, peran, lokasi, status |
| `#tentang` | 4 paragraf tentang diri + daftar 4 poin pekerjaan |
| `#pengalaman` | Riwayat kerja & pendidikan: periode, lokasi, jabatan, organisasi, deskripsi, tag |
| `#keahlian` | 4 kartu keahlian (desain, pemodelan 3D, metode perancangan, gudang) + tag |
| `#proyek` | 3 baris proyek (judul, deskripsi, tag, tahun, tautan `href`) |
| `#kontak` | Email (`mailto:`), WhatsApp, Instagram, LinkedIn, dan formulir pesan |
| JSON-LD `<script type="application/ld+json">` | Data terstruktur (nama, jabatan, perusahaan, universitas) untuk Google |
| `.site-footer` | Nama dan keterangan di footer |

Isi saat ini diselaraskan dengan profil LinkedIn: R&D Intern di CV. Mebel Internasional
(Sep 2026 – sekarang), Warehouse Assistant di FMC Corporation (Jun–Agu 2025), dan
S1 Teknik Industri Universitas Muhammadiyah Surakarta.

Cari komentar `<!-- GANTI: ... -->` di `index.html` sebagai penanda.

## Mengubah warna dan font

Semua ada di blok `:root` paling atas `style.css`:

- `--paper` → warna latar
- `--ink` → warna teks
- `--accent` → warna aksen (terakota)
- `--font-display` → font judul
- `--font-body` → font isi

Tema gelap memakai variabel yang sama di `html[data-theme="dark"]`.

## Publikasi gratis

### Alur kerja sekarang (otomatis)

Folder ini sudah terhubung ke repo GitHub `phinexerv/portofolio_ardent` dan ke project
Vercel `portofolio-ardent` (Production Branch: `main`). Jadi setiap kali isi diubah:

```
git add -A
git commit -m "update isi"
git push
```

Vercel langsung membangun dan merilis sendiri ke https://portofolio-ardent.vercel.app
(biasanya selesai < 1 menit). Tidak perlu lagi menjalankan `vercel deploy`.

### Kalau ingin manual / darurat

- Klik dua kali `deploy.bat`, atau
- dari folder ini: `vercel deploy --prod`

Keduanya tetap sah dan langsung merilis tanpa lewat Git.

- **Vercel** (dipakai saat ini): dari folder ini jalankan `vercel deploy --prod`,
  atau cukup **klik dua kali `deploy.bat`** (paling mudah, tanpa buka terminal).
  Situs tayang di https://portofolio-ardent.vercel.app
  Setiap kali isi diubah, cukup ulangi perintah itu di folder yang sama.
  Berkas yang tidak perlu ikut diunggah didaftarkan di `.vercelignore`.
  Deploy otomatis (setiap `git push`) hanya aktif kalau folder ini sudah
  terhubung ke repo GitHub/GitLab lewat dashboard Vercel.
- **GitHub Pages**: buat repo, unggah 3 file, Settings → Pages → Branch `main` / root.
- **Netlify Drop**: buka `app.netlify.com/drop`, tarik folder `portofolio` ke halaman itu.
