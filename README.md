# SIMASRA — Sistem Manajemen & Monitoring Asrama Deiyai

Sistem Manajemen dan Monitoring Asrama Deiyai Kota Studi Jayapura (ASDEY-Monitoring).
Aplikasi web _single-page_ berbasis Alpine.js untuk mengelola data penghuni, kamar/barak,
presensi (manual & QR), izin keluar/masuk, pelanggaran, aktivitas asrama, inventaris,
laporan, dan manajemen pengguna dengan hak akses berbasis peran (RBAC).

---

## 1. Ringkasan Teknis

| Komponen                | Teknologi                                                         |
| ----------------------- | ----------------------------------------------------------------- |
| UI reaktif              | [Alpine.js 3.x](https://alpinejs.dev/) (CDN)                      |
| Styling                 | Tailwind CSS (CDN) + `asset/css/style.css`, `asset/css/login.css` |
| Notifikasi/dialog       | SweetAlert2                                                       |
| QR generate             | qrcodejs                                                          |
| QR scan (kamera)        | html5-qrcode                                                      |
| Grafik                  | Chart.js                                                          |
| Export PDF              | jsPDF + jsPDF-AutoTable                                           |
| Export Excel            | SheetJS (xlsx)                                                    |
| Penyimpanan data        | `localStorage` & `sessionStorage` browser (tanpa backend/server)  |
| Sinkronisasi lintas tab | Web Storage API (`window` event `storage`) — lihat §2.6           |

**File utama:**

- `login.html` — halaman login, registrasi mandiri (khusus role penghuni), dan lupa sandi.
- `index.html` — shell aplikasi (dashboard, seluruh halaman fitur, modal, dan komponen UI).
- `script.js` (dimuat sebagai `asset/js/script.js`) — seluruh logika aplikasi (state Alpine, akses data, aturan bisnis, sinkronisasi real-time).
- `README.md` — dokumen ini.

> Catatan: aset pendukung yang direferensikan (`asset/css/style.css`, `asset/css/login.css`,
> `asset/img/logo-login.png`, `asset/img/android-chrome-192x192.png`) **tidak disertakan** dalam
> berkas yang diperiksa, sehingga isinya tidak dapat diaudit di sini. Pastikan berkas-berkas
> tersebut tersedia di path yang sesuai sebelum aplikasi dijalankan.

---

## 2. Hasil Audit

Audit dilakukan terhadap `index.html`, `login.html`, dan `script.js` secara menyeluruh:
pencocokan setiap `@click`/`x-model`/`x-text`/`x-for` di HTML terhadap fungsi dan properti
yang benar-benar didefinisikan di `script.js`, pengecekan keseimbangan tag (`<div>`,
`<section>`, `<table>`, `<template>`), pengecekan ID elemen (kanvas chart, elemen QR reader)
antara HTML dan JS, serta penelusuran alur data presensi, izin, registrasi, lupa sandi, dan
notifikasi real-time.

### 2.1 Bug kritis — DITEMUKAN & DIPERBAIKI

| #   | Temuan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Dampak                                                                                                                                                                     | Status                                                                                                                                                                                                                                                                                                                                             |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Duplikasi section "Manajemen Pengguna"** — `index.html` memiliki _dua_ blok `<section x-show="currentPage==='pengguna'">` (baris ±1648 dan ±1995 pada berkas asli). Alpine merender **keduanya secara bersamaan** saat halaman "Pengguna" dibuka: versi lama (tabel sederhana tanpa pencarian/filter/paginasi) tampil menumpuk di atas versi lengkap (dengan kartu statistik role, pencarian, filter role, dan paginasi).                                                                                                               | Tampilan halaman Manajemen Pengguna pecah/duplikat, membingungkan admin, dan tombol aksi (edit/hapus/nonaktifkan) muncul dobel untuk data yang sama.                       | ✅ **Diperbaiki** — blok duplikat (versi sederhana, tanpa fitur pencarian/filter/paginasi) dihapus; versi lengkap yang konsisten dengan `filteredUsers`, `filteredUsersAll`, `currentPageUser`, `itemsPerPageUser` di `script.js` dipertahankan.                                                                                                   |
| 2   | **Urutan kolom tabel presensi tidak konsisten** — kolom "Jam Masuk" tampil sebelum "Jam Keluar", namun permintaan sebelumnya meminta urutan Jam Keluar → Jam Masuk.                                                                                                                                                                                                                                                                                                                                                                       | Ketidakkonsistenan tampilan data presensi.                                                                                                                                 | ✅ **Diperbaiki (sesi sebelumnya)** — header dan sel tabel presensi kini konsisten: Tanggal → **Jam Keluar** → **Jam Masuk** → Status → Metode.                                                                                                                                                                                                    |
| 3   | **Scan QR presensi tidak memberi konfirmasi jelas & bisa mencatat ganda tanpa jeda** — setelah kamera membaca QR, hanya teks kecil `scanFeedback` yang berubah (tanpa alert), dan kamera terus memindai frame berikutnya sehingga kode QR yang sama berisiko langsung terbaca ulang (mis. check-in lalu langsung ter-checkout tanpa jeda).                                                                                                                                                                                                | Risiko pencatatan jam masuk/keluar keliru, dan pengguna tidak mendapat konfirmasi yang jelas.                                                                              | ✅ **Diperbaiki (sesi sebelumnya)** — ditambahkan `_handleQrScanResult()` yang menampilkan alert SweetAlert ("Presensi Masuk/Keluar Berhasil" atau "Gagal"), menjeda (`pause`) kamera selama alert tampil, lalu melanjutkan (`resume`) otomatis — memberi kesempatan scan berikutnya (mis. untuk jam pulang) tanpa pencatatan ganda tak disengaja. |
| 4   | **Registrasi & lupa sandi tidak memberi tahu admin secara real-time** — `handleRegister()` dan `handleResetPassword()` di `login.html` menulis akun baru/perubahan sandi langsung ke `simasra_users`, dan skemanya sudah 100% konsisten dengan `script.js`. Namun `index.html` hanya memuat `this.users` **sekali** saat `init()` tanpa listener apa pun, sehingga jika admin sudah membuka dashboard, pendaftaran/reset sandi yang terjadi di tab `login.html` lain tidak akan terlihat sampai admin memuat ulang halaman secara manual. | Admin tidak bisa memantau pendaftaran akun baru maupun aktivitas lupa sandi secara langsung dari dashboard yang sedang terbuka — monitoring tertunda sampai reload manual. | ✅ **Diperbaiki (Sesi 6)** — lihat rincian lengkap di §2.6.                                                                                                                                                                                                                                                                                        |

### 2.2 Hasil pemeriksaan — TIDAK ada masalah

Pemeriksaan berikut **konsisten dan tidak ditemukan bug**:

- Semua fungsi yang dipanggil lewat `@click="..."` di `index.html` (55 fungsi unik) terdefinisi di `script.js`.
- Seluruh `x-model` (izin, pelanggaran, aktivitas, inventaris, barak, user, profil, pengaturan, filter) cocok dengan struktur `form`/state di `script.js`.
- ID kanvas grafik (`chart-status-penghuni`, `chart-hunian-barak`, `chart-kehadiran-mingguan`, `chart-laporan-distrik`, `chart-laporan-jenjang`, `chart-laporan-inventaris`) cocok 1:1 antara HTML dan pemanggilan `renderDonutChart`/`renderBarChart` di JS.
- ID elemen pemindai QR (`qr-reader`, `qr-reader-dashboard`, `qr-kartu-anggota`, `qr-dashboard-penghuni`) cocok antara HTML dan JS.
- Tidak ada ID duplikat di `index.html`.
- Tag `<div>`, `<section>`, `<table>`, `<template>` seimbang (terbuka = tertutup) setelah perbaikan.
- `PAGE_TITLES`, `ROLE_ACCESS`, dan `x-show="currentPage==='...'"` di semua halaman (dashboard, penghuni, kamar, presensi, izin, pelanggaran, aktivitas, inventaris, laporan, pengguna) saling konsisten.
- `STORAGE_KEYS` di `script.js` konsisten dengan key `localStorage` yang dipakai `login.html` (`simasra_users`, `simasra_penghuni`, `simasra_notifikasi`).
- Alur registrasi mandiri (`login.html`) memverifikasi NIK terhadap data penghuni (`simasra_penghuni`) dan mencegah NIK/username dobel sebelum membuat akun baru — konsisten dengan model data di `script.js`.
- Tipe input tanggal pada form Izin sudah tepat: `tanggalKeluar` = `date`, `estimasiKembali` = `datetime-local`, dan format tampilannya di tabel mengikuti tipe tersebut.
- Logika presensi (`_catatPresensi`) menangani 3 skenario dengan benar: belum ada catatan hari ini → check-in; sudah check-in tapi belum check-out → check-out; sudah keduanya → ditolak dengan pesan yang sesuai.

### 2.3 Catatan / rekomendasi tambahan (bukan bug, untuk dipertimbangkan)

- **Keamanan kata sandi**: kata sandi pengguna disimpan **plain text** di `localStorage` (`simasra_users`) dan diverifikasi langsung di sisi klien (`user.password !== pass`). Ini wajar untuk **prototipe/demo tanpa backend**, tetapi **tidak layak untuk produksi** — data (termasuk kata sandi) sepenuhnya dapat diakses lewat DevTools browser siapa pun yang memakai perangkat tersebut. Untuk produksi disarankan backend + hashing (mis. bcrypt) + sesi/token sisi server.
- **Penyimpanan data hanya di browser**: seluruh data (penghuni, barak, presensi, izin, dll.) tersimpan di `localStorage` perangkat yang dipakai. Data **tidak tersinkronisasi antar perangkat/browser** (lihat juga batasan sinkronisasi real-time di §2.6), dan akan **hilang** jika cache/`localStorage` dibersihkan atau tombol "Hapus Semua Data" ditekan. Cocok untuk demo, kurang cocok untuk operasional multi-admin/multi-perangkat.
- **CDN tanpa versi terkunci**: `alpinejs@3.x.x` pada tag `<script>` memakai rentang versi mengambang (bukan versi tetap seperti `qrcodejs@1.0.0` atau `html5-qrcode@2.3.8`). Ini mengikuti pola resmi dokumentasi Alpine, namun tetap membawa risiko kecil perubahan perilaku bila Alpine merilis versi minor/patch baru.
- **Konsistensi kecil**: satu `x-for` (opsi `<select>` filter "Tahun Masuk", elemen `<option>`) tidak memakai atribut `:key`, berbeda dari pola `x-for` lain di berkas yang konsisten memakainya. Alpine tetap berfungsi tanpa `:key` di sini (daftar tahun statis), namun disarankan menambahkannya demi konsistensi gaya kode.
- **Aset eksternal tidak diverifikasi**: file gambar/CSS di folder `asset/` (logo, ikon, stylesheet kustom) tidak ikut diunggah, sehingga tidak bisa diperiksa keberadaannya maupun isinya.
- **Sinkronisasi real-time terbatas satu perangkat**: mekanisme di §2.6 memakai event `storage` bawaan browser, yang **hanya bekerja antar-tab dalam satu browser/perangkat yang sama**. Untuk monitoring real-time lintas perangkat (mis. penghuni mendaftar dari HP, admin memantau dari laptop terpisah), arsitektur ini butuh backend (API + database, misalnya migrasi ke Laravel yang sedang direncanakan) dengan polling berkala atau WebSocket/broadcasting.

---

## 3. Fitur per Peran (Role)

| Peran        | Akses Halaman                                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| **Admin**    | Dashboard, Data Penghuni, Manajemen Kamar, Presensi, Izin, Pelanggaran, Aktivitas, Inventaris, Laporan, Manajemen Pengguna |
| **Pembina**  | Dashboard, Data Penghuni, Manajemen Kamar, Presensi, Izin, Pelanggaran, Aktivitas, Inventaris, Laporan                     |
| **Pimpinan** | Dashboard, Data Penghuni, Manajemen Kamar, Presensi, Izin, Pelanggaran, Aktivitas, Inventaris, Laporan                     |
| **Penghuni** | Dashboard, Kartu Anggota (QR), Presensi (miliknya), Izin (miliknya), Pelanggaran (miliknya), Aktivitas                     |

---

## 4. Menjalankan Proyek

Karena tidak memakai backend/build tool, cukup jalankan sebagai situs statis:

```bash
# Contoh dengan Python (opsional, agar tidak membuka lewat file://)
python3 -m http.server 8080
```

lalu buka `http://localhost:8080/login.html` di browser.

### Akun Demo Bawaan

| Role     | Username   | Kata Sandi    |
| -------- | ---------- | ------------- |
| Admin    | `admin`    | `admin123`    |
| Pembina  | `pembina`  | `pembina123`  |
| Pimpinan | `pimpinan` | `pimpinan123` |
| Penghuni | `penghuni` | `penghuni123` |

> Akun demo ini juga dipakai sebagai _fallback_ saat `localStorage` kosong (`_seedDefaultUsers()` di `script.js`, harus identik dengan `defaultUsers` di `login.html`). Kata sandi ini hanya untuk demo — **ganti/lepas sebelum dipakai di lingkungan nyata**.

### Mencoba Fitur Monitoring Real-Time (Sesi 6)

Untuk melihat langsung sinkronisasi real-time antara `login.html` dan dashboard admin:

1. Buka `index.html` di satu tab, login sebagai `admin`, lalu buka menu **Manajemen Pengguna** atau biarkan di **Dashboard**.
2. Buka `login.html` di **tab baru** (tab terpisah, browser yang sama), lalu daftarkan akun penghuni baru lewat tab "Daftar" (perlu NIK yang sudah terdaftar di data Penghuni).
3. Kembali ke tab dashboard admin — tanpa reload, akan muncul **toast notifikasi** "Ada pendaftaran akun baru dari halaman Login", dan kartu statistik pengguna serta daftar di Manajemen Pengguna otomatis bertambah.
4. Notifikasi pendaftaran juga tersimpan di lonceng notifikasi topbar (ikon `fa-user-plus`, warna biru langit) dan bisa diklik untuk langsung membuka halaman Manajemen Pengguna.

---

## 5. Riwayat Perbaikan

| Tanggal Sesi       | Perubahan                                                                                                                                                                                                                                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sesi 1             | Urutan kolom tabel presensi disamakan (Tanggal → Jam Keluar → Jam Masuk); alert SweetAlert + jeda kamera ditambahkan setelah scan QR presensi berhasil/gagal.                                                                                                                                                                       |
| Sesi 2             | Ditemukan & dihapus duplikasi section "Manajemen Pengguna" di `index.html`; audit menyeluruh konsistensi HTML ↔ script.js; README disusun ulang dengan hasil audit lengkap.                                                                                                                                                         |
| Sesi 3             | Audit responsivitas menyeluruh (lihat §2.4) + perbaikan 5 temuan responsif/UX di `index.html`, `login.html`, dan `login.css`. Tidak ada bug fungsional baru ditemukan pada logika Alpine/JS (semua binding, fungsi, dan state notifikasi/profil sudah konsisten).                                                                   |
| Sesi 4             | Perbaikan posisi dropdown notifikasi khusus tampilan mobile agar muncul tepat di bawah topbar/tombol lonceng (sebelumnya bisa terlihat "mengambang" tidak presisi di layar sempit), memakai anchor `<header>` + kelas responsif `sm:` bertingkat.                                                                                   |
| Sesi 5             | Audit integrasi `login.html` ↔ `index.html`/`script.js`: session storage, localStorage keys, skema data pengguna & penghuni, RBAC, dan dark mode diverifikasi seluruhnya konsisten (lihat §2.5). Ditemukan & diperbaiki 1 celah integrasi: `login.html` tidak auto-redirect pengguna yang sesinya masih aktif.                      |
| Sesi 6 (audit ini) | Ditemukan & diperbaiki celah **monitoring real-time**: dashboard admin tidak ter-update otomatis saat ada pendaftaran/reset sandi dari `login.html` di tab lain. Ditambahkan `_setupLiveSync()` di `script.js`, notifikasi otomatis untuk admin di `login.html`, dan ikon notifikasi khusus tipe akun di `index.html` (lihat §2.6). |

### 2.6 Audit & perbaikan monitoring real-time admin (Sesi 6)

**Temuan:** integrasi data antara `login.html` dan `index.html` sudah konsisten secara skema (§2.5), tetapi belum **real-time**. `index.html` hanya membaca `simasra_users` sekali saat `init()`; perubahan yang ditulis dari tab `login.html` lain (registrasi mandiri, lupa sandi) tidak terpantul ke dashboard admin yang sedang terbuka tanpa reload manual.

**Perbaikan yang diterapkan:**

| #   | Berkas       | Perubahan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `script.js`  | Ditambahkan method `_setupLiveSync()` yang memasang `window.addEventListener('storage', ...)`. Listener ini mendengarkan perubahan pada kunci `simasra_users`, `simasra_notifikasi`, dan `simasra_penghuni` yang terjadi di tab/jendela lain, lalu menyinkronkan `this.users`, `this.notifikasi`, dan `this.penghuni` secara reaktif — seluruh getter turunan (`totalUserAdmin`, `totalUserPenghuni`, `filteredUsers`, dst.) otomatis ikut ter-render ulang oleh Alpine tanpa kode tambahan. Dipanggil dari `init()`. |
| 2   | `script.js`  | Saat jumlah `users` bertambah akibat sinkronisasi (indikasi pendaftar baru) dan role yang sedang login bukan `penghuni`, ditampilkan toast SweetAlert non-blocking di pojok kanan atas sebagai sinyal visual instan untuk admin/pembina.                                                                                                                                                                                                                                                                              |
| 3   | `login.html` | Ditambahkan `_tambahNotifikasiUntukAdmin()` — menulis entri notifikasi ke `simasra_notifikasi` dengan skema identik `_tambahNotifikasi()` di `script.js` (`{id, tipe, judul, pesan, waktu, dibaca, untukRole, untukNik}`), dipanggil setelah `handleRegister()` dan `handleResetPassword()` berhasil, dengan `untukRole: ['admin']`.                                                                                                                                                                                  |
| 4   | `index.html` | Ditambahkan pemetaan ikon khusus untuk `n.tipe === 'akun'` (ikon `fa-user-plus`, warna biru langit) pada widget "Aktivitas Terbaru" di dashboard admin.                                                                                                                                                                                                                                                                                                                                                               |
| 5   | `script.js`  | `bukaNotifikasi()` diperluas: klik pada notifikasi bertipe `'akun'` kini mengarahkan admin langsung ke halaman **Manajemen Pengguna**.                                                                                                                                                                                                                                                                                                                                                                                |

**Batasan yang perlu diketahui (bukan bug, keterbatasan arsitektur):**

- Event `storage` bawaan browser **hanya terpicu di tab/jendela lain** dari yang menulis data, dan **hanya berlaku dalam satu browser/perangkat yang sama** — localStorage tidak pernah tersinkronisasi lintas perangkat atau lintas browser.
- Karena itu, "monitoring real-time" pada versi ini berarti: _admin yang login di perangkat/browser yang sama dengan tempat pendaftaran terjadi (mis. dua tab di komputer asrama yang sama) akan melihat pembaruan instan_. Untuk skenario penghuni mendaftar dari perangkat pribadi sementara admin memantau dari perangkat terpisah, dibutuhkan backend bersama (server + database) dengan mekanisme polling berkala atau WebSocket/broadcasting — sejalan dengan rencana migrasi ke Laravel + MySQL.

### 2.5 Audit integrasi login ↔ index (Sesi 5) — temuan & perbaikan

Pemeriksaan menelusuri seluruh titik pertemuan data antara `login.html` dan `index.html`/`script.js`: kunci `sessionStorage`/`localStorage`, skema objek pengguna & penghuni, daftar akses per role, dan preferensi tampilan (mode gelap).

**Hasil yang TERBUKTI konsisten (tidak ada masalah):**

- Kunci `sessionStorage` yang ditulis `login.html` saat login berhasil (`isLoggedIn`, `loggedInUser`, `loggedInUsername`, `loggedInRole`, `loggedInUserId`, `loggedInNik`) — seluruhnya dibaca dengan nama yang sama persis oleh `script.js` saat inisialisasi (`currentRole`, `currentUsername`, `currentUserId`, `currentNik`) dan dihapus dengan nama yang sama saat `handleLogout()`.
- Kunci `localStorage` `simasra_users` dan `simasra_penghuni` yang dipakai `login.html` untuk verifikasi login/registrasi/lupa-sandi — identik dengan `STORAGE_KEYS.USERS` dan `STORAGE_KEYS.PENGHUNI` di `script.js`.
- Array `defaultUsers` (fallback) di `login.html` — identik byte-per-byte dengan `_seedDefaultUsers()` di `script.js` (4 akun demo: admin, pembina, pimpinan, penghuni).
- Objek `newUser` yang dibuat saat registrasi mandiri (`{id, username, password, role, nama, nik, active}`) — skemanya cocok 100% dengan struktur yang dibaca `script.js` (`_currentUserRecord()`, `toggleUserActive()`, dsb.), termasuk flag `active` yang dicek dua arah (login menolak akun `active:false`, admin bisa menonaktifkan dari Manajemen Pengguna).
- Reset kata sandi (`handleResetPassword`) menulis ke field `password` pada objek user yang sama di `simasra_users` — konsisten dengan cara `saveSettings()` di `script.js` mengganti sandi dari dalam aplikasi.
- Preferensi mode gelap memakai kunci `localStorage.theme` yang sama persis di kedua halaman dengan logika fallback `prefers-color-scheme` yang identik, sehingga tema tetap konsisten saat berpindah antara `login.html` dan `index.html`.
- Halaman/menu (`currentPage`) yang dikontrol `hasAccess()` di `index.html` — seluruh 11 key (`dashboard`, `kartu`, `penghuni`, `kamar`, `presensi`, `izin`, `pelanggaran`, `aktivitas`, `inventaris`, `laporan`, `pengguna`) cocok 1:1 dengan `ROLE_ACCESS` dan `PAGE_TITLES` di `script.js`, dan sesuai tabel akses per role di §3.
- Penjagaan sesi searah dari `index.html` sudah ada sejak awal: `init()` di `script.js` mengecek `sessionStorage.isLoggedIn`, dan mengalihkan ke `login.html` jika belum login.

**Temuan & perbaikan:**

| #   | Temuan                                                                                                                                                                                                                                                                                                                                                                                           | Berkas       | Status                                                                                                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Penjagaan sesi hanya berjalan satu arah: `index.html` sudah redirect ke `login.html` bila belum login, tapi `login.html` **tidak** redirect balik ke `index.html` bila pengguna ternyata sudah memiliki sesi aktif (mis. membuka `login.html` lagi lewat riwayat browser/bookmark saat masih login) — pengguna akan melihat form login yang membingungkan alih-alih langsung masuk ke dashboard. | `login.html` | ✅ Diperbaiki — ditambahkan pengecekan `sessionStorage.getItem('isLoggedIn')` di awal `init()` Alpine `loginApp`; jika sesi aktif, langsung `window.location.replace('index.html')`. |

**Catatan operasional (bukan bug):** Pendaftaran mandiri (tab "Daftar") mensyaratkan NIK yang sudah ada di `simasra_penghuni`. Karena data penghuni contoh baru di-seed saat `index.html` pertama kali dijalankan (`resetInitialData()`), pada instalasi yang benar-benar baru dan hanya membuka `login.html` tanpa pernah login sebagai admin ke `index.html` terlebih dahulu, tab pendaftaran akan selalu menolak dengan pesan "NIK tidak ditemukan". Ini sesuai desain (registrasi penghuni harus melalui data yang dikelola admin), namun perlu diperhatikan saat deployment pertama kali — sebaiknya admin login dan menambahkan data penghuni terlebih dahulu sebelum tautan pendaftaran mandiri dibagikan ke calon penghuni.

### 2.4 Audit responsivitas (Sesi 3) — temuan & perbaikan

Pemeriksaan tambahan difokuskan pada perilaku tampilan di lebar layar kecil (ponsel, ≤375px dan ≤320px), termasuk modal profil, dropdown notifikasi, dan seluruh grid/kartu statistik di setiap halaman.

| #   | Temuan                                                                                                                                                                             | Berkas                    | Status                                                                                                            |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 1   | Sidebar mobile (drawer) tidak memiliki _backdrop/overlay_ — saat dibuka di ponsel, tak ada cara menutupnya dengan tap di luar sidebar, dan konten di belakangnya tidak digelapkan. | `index.html`              | ✅ Diperbaiki — ditambahkan lapisan backdrop `bg-black/50` (khusus `md:hidden`) yang menutup sidebar saat diklik. |
| 2   | Dropdown notifikasi memakai lebar tetap `w-80` (320px) tanpa batas berbasis viewport, berisiko meluber di perangkat ≤320px (mis. iPhone SE lama).                                  | `index.html`              | ✅ Diperbaiki — ditambahkan `max-w-[calc(100vw-2rem)]`.                                                           |
| 3   | Grid 4 kartu statistik ringkasan Barak/Kamar (`grid-cols-4` tanpa breakpoint) memaksa 4 kolom sempit yang berdesakan di ponsel.                                                    | `index.html` (Kamar)      | ✅ Diperbaiki — diubah menjadi `grid-cols-2 sm:grid-cols-4`.                                                      |
| 4   | Grid 3 kartu statistik kondisi Inventaris (`grid-cols-3` tanpa breakpoint, teks besar `text-3xl`) berdesakan di layar sempit.                                                      | `index.html` (Inventaris) | ✅ Diperbaiki — diubah menjadi `grid-cols-1 sm:grid-cols-3`.                                                      |
| 5   | Tab Login/Registrasi/Lupa Sandi di `login.html` memakai `x-show` tanpa `x-cloak`, berisiko sekilas menampilkan ketiga tab bertumpuk sebelum Alpine.js selesai inisialisasi.        | `login.html`, `login.css` | ✅ Diperbaiki — ditambahkan `x-cloak` pada ketiga tab + aturan CSS `[x-cloak]{display:none!important}`.           |

**Hasil pemeriksaan lain (tidak ada masalah):**

- Seluruh 9 tabel data sudah dibungkus `overflow-x-auto`, aman di ponsel tanpa merusak layout.
- Grafik (Chart.js) sudah `responsive: true`; kanvas dibungkus `.chart-wrap` dengan `max-width` wajar.
- Modal (`modal-backdrop` + `modal-box`) sudah `width:100%` dengan `max-w-*` responsif dan `max-height:90vh; overflow-y:auto`.
- Modal Profil & Pengaturan: tab Profil (nama, email, No. HP, foto) dan tab Pengaturan (ganti sandi, mode gelap) sudah satu kolom responsif secara default.
- Nama pengguna di topbar sudah disembunyikan di layar sempit (`hidden sm:block`) agar tidak memakan ruang.
- Sebagian besar grid form sudah memakai pola `grid-cols-1 sm:grid-cols-2`/`md:grid-cols-*` yang tepat — hanya temuan #3 dan #4 di atas yang terlewat.
