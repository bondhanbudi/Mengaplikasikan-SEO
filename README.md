# 🎓 Bondhan Education – LMS SEO untuk SMK

LMS interaktif **Mengaplikasikan Search Engine Optimization (SEO)** untuk siswa SMK Kelas XI (Bisnis Digital/Pemasaran): materi, latihan interaktif, **Proyek PjBL Video SEO**, kuis HOTS, serta sertifikat dan laporan yang dapat diunduh.

Dibangun dengan **HTML + CSS + JavaScript murni** (tanpa CDN, tanpa build, tanpa server) sehingga langsung berjalan di GitHub Pages maupun dibuka lokal tanpa internet.

## Fitur
| Tab | Isi |
|---|---|
| 🏠 Beranda | Profil siswa (tersimpan otomatis), dashboard progres, 7 lencana, alur belajar |
| 📖 Materi | 4 modul, 17 kartu: Ruang Lingkup SEO, Jenis-Jenis SEO, Kata Kunci, Teknik Optimasi (a–f) + rangkuman formula sukses |
| 🎮 Latihan | 2 urutkan langkah, 2 jodohkan, 3 klasifikasi (jenis keyword, search intent, White/Black Hat) dengan skor & bunyi benar/salah |
| 🎬 Proyek PjBL | LKPD Video SEO: identitas & 4 peran tim, 6 tahap dengan checklist & tautan bukti, **Lembar Kerja Praktik** dengan **SEO Checker otomatis** (10 kriteria) dan pratinjau hasil pencarian, rubrik penilaian diri (20/25/30/15/10) |
| 📝 Kuis | 10 soal HOTS (A–D) dengan pembahasan, sertifikat, dan unduh laporan (.html) |

## Struktur folder
```
├── index.html          # halaman utama
├── css/style.css       # tampilan
├── js/data.js          # SELURUH konten (materi, latihan, PjBL, rubrik, kuis) – edit di sini
├── js/app.js           # logika aplikasi
├── assets/img/         # gambar latar
├── assets/audio/       # musik latar
├── .nojekyll
└── README.md
```

## Menjalankan lokal
Buka `index.html` di Chrome/Edge/Firefox.

## Hosting di GitHub Pages
1. Buat repositori baru di GitHub (mis. `bondhan-education`), set **Public**.
2. Unggah **seluruh isi folder ini** (termasuk folder `css`, `js`, `assets`, dan file `.nojekyll`) ke cabang `main`.
   - Lewat web: **Add file → Upload files** → seret semua isi folder → **Commit changes**.
   - Atau lewat git:
     ```bash
     git init && git add . && git commit -m "LMS Bondhan Education"
     git branch -M main
     git remote add origin https://github.com/USERNAME/bondhan-education.git
     git push -u origin main
     ```
3. Buka **Settings → Pages** → **Source: Deploy from a branch** → **Branch: main**, folder **/(root)** → **Save**.
4. Tunggu 1–2 menit. Alamat LMS: `https://USERNAME.github.io/bondhan-education/`

## Menyesuaikan konten (guru)
Semua konten ada di `js/data.js`:
- `MATERI` – kartu materi per modul
- `LATIHAN` – latihan urutkan, jodohkan, klasifikasi
- `PLATFORM`, `PERAN`, `TAHAP`, `RUBRIK` – pengaturan PjBL
- `KUIS` – soal, opsi, kunci (`a` = indeks 0–3), dan pembahasan

## Catatan
- Progres tiap siswa tersimpan di **localStorage browser** masing-masing (tidak ada server/database). Ganti perangkat berarti mulai dari awal.
- Siswa mengumpulkan tugas dengan **mengunduh Laporan (.html)** (berisi rekap tahap, lembar kerja SEO, rubrik, dan kuis) lalu mengirimkannya ke guru.
- Sumber materi: *Materi Ajar SEO SMK Kelas XI* dan *LKPD PjBL Video SEO SMK Kelas XI*.
