/* Mindvesta Finance — service worker
 * - Aset aplikasi (index, manifest, ikon): di-precache -> aplikasi terbuka tanpa internet.
 * - Navigasi: cache-first dari index (data pengguna ada di localStorage, bukan di sini).
 * - Pustaka/font lintas-origin (pdf.js, tesseract, html2canvas, Google Fonts, dst.): di-cache saat pertama dipakai online
 *   (stale-while-revalidate), sehingga fitur OCR/PDF/ekspor gambar tetap jalan offline SETELAH sekali dipakai online.
 * Naikkan VERSION setiap rilis agar cache lama dibersihkan. */
const VERSION='mv-v1.1.0';
const CORE=VERSION+'-core', RUNTIME=VERSION+'-rt';
const PRECACHE=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-192.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CORE).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('mv-')&&!k.startsWith(VERSION)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',e=>{if(e.data==='skipWaiting')self.skipWaiting()});

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(!/^https?:$/.test(url.protocol))return;
  // 1) navigasi halaman: cache dulu, jaringan sebagai cadangan, index sebagai fallback offline
  if(req.mode==='navigate'){
    e.respondWith(caches.match('index.html').then(hit=>hit||fetch(req)).catch(()=>caches.match('index.html')));
    return;
  }
  // 2) aset satu origin: cache-first, perbarui di latar
  if(url.origin===location.origin){
    e.respondWith(caches.match(req).then(hit=>{
      const net=fetch(req).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(CORE).then(c=>c.put(req,cp))}return r}).catch(()=>hit);
      return hit||net;
    }));
    return;
  }
  // 3) lintas-origin (CDN/font): stale-while-revalidate
  e.respondWith(caches.open(RUNTIME).then(c=>c.match(req).then(hit=>{
    const net=fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(req,r.clone());return r}).catch(()=>hit||Response.error());
    return hit||net;
  })));
});
