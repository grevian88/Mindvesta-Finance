# Mindvesta Finance

Aplikasi keuangan pribadi (PWA, offline-first). Data tersimpan di `localStorage` perangkat (kunci `vitalfinance_data` dipertahankan agar data lama tetap terbaca).

## Struktur
```
src/index.template.html   kerangka HTML (penanda {{inc:...}} menunjuk modul)
src/css/NN-*.css          23 modul CSS (urutan = urutan cascade, JANGAN diubah sembarangan)
src/js/NN-*.js            22 modul JS (urutan = urutan eksekusi)
src/manifest.webmanifest  manifest PWA
src/sw.js                 service worker (naikkan VERSION tiap rilis)
src/icons/                ikon 192/512, maskable, apple-touch
build.py                  rakit src/ -> dist/
tools/split.py            alat sekali-pakai yang memecah berkas lama jadi src/
dist/                     hasil build: siap di-hosting / dibungkus APK
```

## Build & jalankan
```
python3 build.py
cd dist && python3 -m http.server 8080     # buka http://localhost:8080 di Chrome
```
Service worker hanya aktif di `http://localhost` atau HTTPS (tidak di `file://`).

## Memasang di Android
1. Taruh isi `dist/` di hosting HTTPS (GitHub Pages, Netlify, Cloudflare Pages, dst.).
2. Buka di Chrome Android -> menu ⋮ -> "Pasang aplikasi" / "Tambahkan ke layar utama".
3. Untuk APK/Play Store: bungkus URL itu dengan Bubblewrap (TWA) atau Capacitor.

## Catatan offline
Aplikasi inti (UI, transaksi, laporan) jalan penuh tanpa internet. Pustaka OCR/PDF/ekspor-gambar dan font dimuat dari CDN
dan di-cache otomatis saat PERTAMA dipakai online; setelah itu bisa dipakai offline.
Saat merilis versi baru: ubah `VERSION` di `src/sw.js`, jalankan `build.py`, lalu unggah ulang `dist/`.
