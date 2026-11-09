
/*!
 * VFX Extract Engine v2.0 — modul plug-and-play untuk VitalFinance Pro (100% client-side)
 * Tidak mengubah ID/Class/DOM lama. Dipakai lewat hook "coba VFX dulu, jatuh balik ke fungsi lama".
 * Isi: enhanceImageForOCR · OcrSession (rotasi+fallback+terminate) · pdfText (flattened→OCR, async)
 *      parseStmt super-dinamis · CSV chunked · pickBetter (anti-regresi) · exclusive (anti-ganda)
 */
(function (root) {
  'use strict';
  if (root.VFX && root.VFX.__v) return;

  const VFX = {
    __v: '2.0.0',
    ready: false,
    busyFlag: false,
    config: {
      lang: 'ind+eng',
      minConf: 62,          // di bawah ini dianggap "teks sampah" → coba varian/rotasi lain
      maxSide: 2600,        // batas sisi terpanjang canvas (hemat memori)
      minSide: 1500,        // upscale gambar kecil sampai sisi terpanjang ini
      yieldMs: 12,          // jatah waktu per potongan sebelum menyerahkan thread ke UI
      maxAttempts: 9,
      /* Semua alamat eksplisit. Urutan = prioritas; kalau satu CDN gagal otomatis pindah ke berikutnya. */
      tesseract: {
        src: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js',
        srcs: ['https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js', 'https://unpkg.com/tesseract.js@5.1.1/dist/tesseract.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.1.1/tesseract.min.js'],
        workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js',
        corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5',          // FOLDER (bukan file .js) agar SIMD otomatis dipilih
        langPaths: ['https://tessdata.projectnaptha.com/4.0.0', 'https://cdn.jsdelivr.net/gh/naptha/tessdata@gh-pages/4.0.0'],
        initTimeoutMs: 120000
      },
      pdfjs: {                                                                // v3.11.174 = rilis terakhir berformat UMD (v4+ hanya .mjs, tidak bisa dari file://)
        src: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        worker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
        srcs: ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js', 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js'],
        workers: ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js', 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js', 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js']
      },
      jsqr: ['https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js', 'https://unpkg.com/jsqr@1.4.0/dist/jsQR.js']
    }
  };

  /* ───────────────────────── util ───────────────────────── */
  const yieldUI = () => new Promise(r => setTimeout(r, 0));
  const nowMs = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
  async function drain(gen, onTick) {           // jalankan generator dengan time-slicing (anti-freeze)
    let t = nowMs(), r;
    for (;;) {
      r = gen.next();
      if (r.done) return r.value;
      if (nowMs() - t > VFX.config.yieldMs) { if (onTick) onTick(r.value); await yieldUI(); t = nowMs(); }
    }
  }
  function drainSync(gen) { let r; while (!(r = gen.next()).done); return r.value; }

  VFX.exclusive = async function (fn) {          // cegah proses ganda saat tombol ditekan berulang
    if (VFX.busyFlag) return { busy: true };
    VFX.busyFlag = true;
    try { return { value: await fn() }; } finally { VFX.busyFlag = false; }
  };
  const _bound = new WeakMap();
  VFX.bindOnce = function (el, type, fn, key) {  // listener tidak pernah menumpuk
    let m = _bound.get(el); if (!m) { m = {}; _bound.set(el, m); }
    const k = type + ':' + (key || ''); if (m[k]) return false; m[k] = fn; el.addEventListener(type, fn); return true;
  };

  /* ───────────── 1. IMAGE PRE-PROCESSING (inti: typed array, bisa diuji tanpa DOM) ───────────── */
  const IMG = {
    gray(rgba, n) { const g = new Uint8ClampedArray(n); for (let i = 0, j = 0; j < n; i += 4, j++) g[j] = (rgba[i] * 77 + rgba[i + 1] * 150 + rgba[i + 2] * 29) >> 8; return g; },
    mean(g) { let s = 0; for (let i = 0; i < g.length; i++) s += g[i]; return s / g.length; },
    invert(g) { for (let i = 0; i < g.length; i++) g[i] = 255 - g[i]; },
    // Hilangkan bayangan / kertas lecek: estimasi latar per-blok (rata-rata piksel terang) → bagi
    flatten(g, w, h) {
      const f = Math.max(8, Math.round(Math.min(w, h) / 48)), gw = Math.ceil(w / f), gh = Math.ceil(h / f);
      let bg = new Float32Array(gw * gh);
      for (let by = 0; by < gh; by++) for (let bx = 0; bx < gw; bx++) {
        let s = 0, c = 0; const x1 = Math.min(w, (bx + 1) * f), y1 = Math.min(h, (by + 1) * f);
        for (let y = by * f; y < y1; y++) for (let x = bx * f; x < x1; x++) { s += g[y * w + x]; c++; }
        const m = s / c; let s2 = 0, c2 = 0;
        for (let y = by * f; y < y1; y++) for (let x = bx * f; x < x1; x++) { const v = g[y * w + x]; if (v >= m) { s2 += v; c2++; } }
        bg[by * gw + bx] = c2 ? s2 / c2 : m;
      }
      for (let pass = 0; pass < 2; pass++) {       // haluskan peta latar (box blur radius 1)
        const o = new Float32Array(gw * gh);
        for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
          let s = 0, c = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < gw && yy < gh) { s += bg[yy * gw + xx]; c++; } }
          o[y * gw + x] = s / c;
        }
        bg = o;
      }
      for (let y = 0; y < h; y++) {
        const fy = Math.min(gh - 1, Math.max(0, y / f - .5)), y0 = fy | 0, y1 = Math.min(gh - 1, y0 + 1), ty = fy - y0;
        for (let x = 0; x < w; x++) {
          const fx = Math.min(gw - 1, Math.max(0, x / f - .5)), x0 = fx | 0, x1 = Math.min(gw - 1, x0 + 1), tx = fx - x0;
          const b = (bg[y0 * gw + x0] * (1 - tx) + bg[y0 * gw + x1] * tx) * (1 - ty) + (bg[y1 * gw + x0] * (1 - tx) + bg[y1 * gw + x1] * tx) * ty;
          const v = g[y * w + x] / Math.max(40, b) * 245; g[y * w + x] = v > 255 ? 255 : v;
        }
      }
    },
    stretch(g) {                                    // perluas kontras (persentil 1%–99%)
      const hst = new Uint32Array(256); for (let i = 0; i < g.length; i++) hst[g[i]]++;
      const n = g.length; let a = 0, lo = 0, hi = 255, c = 0;
      for (a = 0; a < 256; a++) { c += hst[a]; if (c >= n * .01) { lo = a; break; } }
      c = 0; for (a = 255; a >= 0; a--) { c += hst[a]; if (c >= n * .01) { hi = a; break; } }
      if (hi - lo < 24) return;
      const k = 255 / (hi - lo); for (let i = 0; i < g.length; i++) { const v = (g[i] - lo) * k; g[i] = v < 0 ? 0 : v > 255 ? 255 : v; }
    },
    sharpen(g, w, h, amount) {                      // unsharp mask (blur separabel [1 2 1]/4)
      const t = new Float32Array(w * h), b = new Float32Array(w * h);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; t[i] = (g[y * w + Math.max(0, x - 1)] + 2 * g[i] + g[y * w + Math.min(w - 1, x + 1)]) / 4; }
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; b[i] = (t[Math.max(0, y - 1) * w + x] + 2 * t[i] + t[Math.min(h - 1, y + 1) * w + x]) / 4; }
      for (let i = 0; i < g.length; i++) { const v = g[i] + amount * (g[i] - b[i]); g[i] = v < 0 ? 0 : v > 255 ? 255 : v; }
    },
    otsu(g) {                                       // Otsu's thresholding
      const hst = new Uint32Array(256); for (let i = 0; i < g.length; i++) hst[g[i]]++;
      const total = g.length; let sum = 0; for (let i = 0; i < 256; i++) sum += i * hst[i];
      let sB = 0, wB = 0, best = 0, thr = 127;
      for (let t = 0; t < 256; t++) { wB += hst[t]; if (!wB) continue; const wF = total - wB; if (!wF) break; sB += t * hst[t]; const mB = sB / wB, mF = (sum - sB) / wF, v = wB * wF * (mB - mF) * (mB - mF); if (v > best) { best = v; thr = t; } }
      return thr;
    },
    binarize(g, thr) { for (let i = 0; i < g.length; i++) g[i] = g[i] > thr ? 255 : 0; },
    despeckle(b, w, h) {                            // buang bintik noise & tutup lubang kecil
      const o = new Uint8ClampedArray(b);
      for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
        const i = y * w + x; let dark = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && b[i + dy * w + dx] === 0) dark++;
        if (b[i] === 0 && dark <= 1) o[i] = 255; else if (b[i] === 255 && dark >= 7) o[i] = 0;
      }
      b.set(o);
    },
    // pipeline lengkap pada array → {gray, bin, thr, inverted}
    enhance(rgba, w, h) {
      const g = IMG.gray(rgba, w * h); let inv = false;
      if (IMG.mean(g) < 115) { IMG.invert(g); inv = true; }           // mode gelap → teks gelap di latar terang
      IMG.flatten(g, w, h); IMG.stretch(g); IMG.sharpen(g, w, h, .9);
      const gray = new Uint8ClampedArray(g), thr = IMG.otsu(g);
      IMG.binarize(g, thr); IMG.despeckle(g, w, h);
      return { gray, bin: g, thr, inverted: inv };
    }
  };
  VFX._IMG = IMG;

  const isBrowser = typeof document !== 'undefined';
  function loadImg(url) { return new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('Gambar tidak bisa dibuka.')); i.src = url; }); }
  async function toCanvas(src) {                    // File/Blob/Image/Canvas → canvas berskala aman
    let url = null, img = src, bmp = null;
    try {
      if (typeof Blob !== 'undefined' && src instanceof Blob) {
        if (typeof createImageBitmap === 'function') { try { bmp = await createImageBitmap(src, { imageOrientation: 'from-image' }); } catch (e) { bmp = null; } }
        if (bmp) img = bmp; else { url = URL.createObjectURL(src); img = await loadImg(url); }
      }
      const w0 = img.width || img.naturalWidth, h0 = img.height || img.naturalHeight, long = Math.max(w0, h0), C = VFX.config;
      const k = long < C.minSide ? C.minSide / long : long > C.maxSide ? C.maxSide / long : 1;
      const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w0 * k)); c.height = Math.max(1, Math.round(h0 * k));
      const x = c.getContext('2d', { willReadFrequently: true }); x.imageSmoothingQuality = 'high'; x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
      return c;
    } finally { if (bmp && bmp.close) bmp.close(); if (url) URL.revokeObjectURL(url); }
  }
  function canvasFromGray(a, w, h) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'), d = x.createImageData(w, h), p = d.data;
    for (let i = 0, j = 0; j < a.length; j++, i += 4) { p[i] = p[i + 1] = p[i + 2] = a[j]; p[i + 3] = 255; }
    x.putImageData(d, 0, 0); return c;
  }
  function rotateCanvas(c, deg) {
    const r = document.createElement('canvas'), q = deg % 180 !== 0; r.width = q ? c.height : c.width; r.height = q ? c.width : c.height;
    const x = r.getContext('2d'); x.translate(r.width / 2, r.height / 2); x.rotate(deg * Math.PI / 180); x.drawImage(c, -c.width / 2, -c.height / 2); return r;
  }
  function freeCanvas(c) { if (c) { c.width = 0; c.height = 0; } }

  // API wajib: enhanceImageForOCR(image) → canvas (Grayscale · Scaling · Sharpen · Otsu · denoise)
  VFX.enhanceImageForOCR = async function (image, opts) {
    opts = opts || {}; const base = image instanceof HTMLCanvasElement ? image : await toCanvas(image);
    try {
      const w = base.width, h = base.height, id = base.getContext('2d').getImageData(0, 0, w, h), r = IMG.enhance(id.data, w, h);
      return canvasFromGray(opts.mode === 'gray' ? r.gray : r.bin, w, h);
    } finally { if (base !== image) freeCanvas(base); }
  };
  async function makeVariants(base) {
    const w = base.width, h = base.height, id = base.getContext('2d').getImageData(0, 0, w, h), r = IMG.enhance(id.data, w, h);
    return { bin: canvasFromGray(r.bin, w, h), gray: canvasFromGray(r.gray, w, h), inverted: r.inverted };
  }

  /* ───────────── penilaian kualitas teks OCR (deteksi teks sampah) ───────────── */
  const KWS = /(total|rp|idr|tunai|cash|saldo|tanggal|tgl|transfer|bayar|rekening|mutasi|debit|kredit|struk|ppn|qty|harga|kembali|jumlah|keterangan|periode|berhasil|pembayaran|kasir|subtotal|nota|invoice)/gi;
  function scoreText(text, conf) {
    const t = String(text || ''), ns = t.replace(/\s/g, '');
    if (ns.length < 12) return { score: 0, good: false };
    const alnum = (ns.match(/[A-Za-z0-9]/g) || []).length / ns.length, toks = t.split(/\s+/).filter(Boolean);
    const wordlike = toks.filter(w => /[aeiouAEIOU]/.test(w) && /[A-Za-z]{3,}/.test(w)).length / Math.max(1, toks.length);
    const nums = (t.match(/\d[\d.,]{2,}/g) || []).length, kw = (t.match(KWS) || []).length;
    const c = isFinite(conf) ? conf : 50;
    const score = c * .5 + alnum * 20 + Math.min(30, kw * 6) + wordlike * 20 + Math.min(10, nums);
    return { score, good: c >= VFX.config.minConf && alnum > .6 && (kw >= 1 || nums >= 3 || wordlike > .35), alnum, kw, nums };
  }
  VFX.scoreText = scoreText;

  /* ───────────── OCR session: worker tunggal, rotasi, terminate ───────────── */
  /* ───────────── loader CDN berlapis · progress bar · antrean ───────────── */
  function injectScript(url, ms) {
    return new Promise((ok, no) => {
      const el = document.createElement('script'); let done = false, tm = null;
      const fin = (f, v) => { if (done) return; done = true; clearTimeout(tm); f(v); };
      tm = setTimeout(() => { try { el.remove(); } catch (e) { } fin(no, new Error('timeout ' + url)); }, ms || 25000);
      el.src = url; el.async = true; el.onload = () => fin(ok); el.onerror = () => { try { el.remove(); } catch (e) { } fin(no, new Error('gagal ' + url)); };
      document.head.append(el);
    });
  }
  async function loadAny(urls, check) {                    // coba tiap URL sampai global yang dicari muncul
    if (check && check()) return;
    for (const u of [].concat(urls)) { try { await injectScript(u); if (!check || check()) return; } catch (e) { console.warn('VFX loader:', e.message); } }
    throw new Error('Butuh internet untuk memuat mesin pembaca (sekali saja).');
  }
  const withTimeout = (p, ms, msg) => new Promise((ok, no) => { const t = setTimeout(() => no(new Error(msg || 'timeout')), ms); p.then(v => { clearTimeout(t); ok(v); }, e => { clearTimeout(t); no(e); }); });
  VFX._loadAny = loadAny;
  async function loadLib(ctx, url) { return loadAny(url); }

  VFX.ui = {                                               // bar persen tipis di atas layar; tidak menyentuh DOM/ID lama
    el: null, bar: null, lab: null, last: 0,
    _mk() {
      if (this.el || !isBrowser || !document.body) return;
      const e = document.createElement('div'); e.id = 'vfx-prog'; e.setAttribute('aria-hidden', 'true');
      e.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:2147483000;pointer-events:none;display:none;padding-top:env(safe-area-inset-top,0px)';
      e.innerHTML = '<div style="height:4px;background:rgba(127,127,127,.28)"><div data-b style="height:4px;width:0;background:#22c55e;transition:width .25s"></div></div><div data-t style="margin:6px auto 0;width:max-content;max-width:92%;padding:4px 12px;border-radius:999px;font:600 12px/1.3 system-ui,sans-serif;background:rgba(0,0,0,.75);color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></div>';
      document.body.append(e); this.el = e; this.bar = e.querySelector('[data-b]'); this.lab = e.querySelector('[data-t]');
    },
    set(p, t) { this._mk(); if (!this.el) return; p = Math.max(this.last, Math.min(100, Math.round(p))); this.last = p; this.el.style.display = 'block'; this.bar.style.width = p + '%'; if (t != null) this.lab.textContent = t + ' · ' + p + '%'; },
    reset() { this.last = 0; },
    end() { this.last = 0; if (this.el) { this.el.style.display = 'none'; this.bar.style.width = '0'; } }
  };

  let _q = Promise.resolve(), _qn = 0;                       // antrean: satu pekerjaan berat pada satu waktu (hemat RAM HP 4 GB)
  VFX.queueSize = () => _qn;
  VFX.queue = function (fn, ctx) {
    if (_qn > 0 && ctx && ctx.busy) ctx.busy('Menunggu antrean… (' + _qn + ' berkas di depan) ⏳');
    _qn++;
    const run = async () => { VFX.ui.reset(); try { return await fn(); } finally { _qn--; if (!_qn) VFX.ui.end(); } };
    const p = _q.then(run, run); _q = p.catch(() => { }); return p;
  };
  VFX.tessOptions = () => ({ workerPath: VFX.config.tesseract.workerPath, corePath: VFX.config.tesseract.corePath, langPath: VFX.config.tesseract.langPaths[0] });
  class OcrSession {
    constructor(ctx) { this.ctx = ctx || {}; this.worker = null; this.closed = false; this.base = 40; this.span = 55; }
    status(t) { if (this.ctx.busy) this.ctx.busy(t); }
    _log(m) {
      const st = String((m && m.status) || ''), pr = (m && m.progress) || 0, p = Math.round(pr * 100);
      if (st === 'recognizing text') { if (this.pct) this.status(this.pct(pr)); VFX.ui.set(this.base + pr * this.span, 'Membaca teks'); }
      else if (/loading tesseract core/.test(st)) { this.status('Memuat mesin OCR… ' + p + '%'); VFX.ui.set(5 + p * .1, 'Memuat mesin OCR'); }
      else if (/loading language/.test(st)) { this.status('Mengunduh data bahasa (sekali saja)… ' + p + '%'); VFX.ui.set(15 + p * .2, 'Mengunduh bahasa'); }
      else if (/initializ/.test(st)) VFX.ui.set(36, 'Menyiapkan mesin');
    }
    async ensure() {
      if (this.worker) return;
      const T = VFX.config.tesseract; this.status('Memuat mesin OCR… 🔧'); VFX.ui.set(3, 'Memuat mesin OCR');
      await loadAny(T.srcs, () => root.Tesseract && root.Tesseract.createWorker);
      const logger = m => this._log(m), base = { workerPath: T.workerPath, corePath: T.corePath, logger }, tries = [];
      T.langPaths.forEach(lp => tries.push(Object.assign({}, base, { langPath: lp })));
      tries.push({ logger });                                           // pilihan terakhir: bawaan Tesseract.js
      for (const o of tries) {
        const pr = root.Tesseract.createWorker(VFX.config.lang, 1, o);
        try {
          const w = await withTimeout(pr, T.initTimeoutMs, 'Mesin OCR terlalu lama dimuat.');
          await w.setParameters({ tessedit_pageseg_mode: '6', preserve_interword_spaces: '1', user_defined_dpi: '300' });
          this.worker = w; return;
        } catch (e) { console.warn('VFX Tesseract init gagal:', e && e.message || e); pr.then(w => w && w.terminate && w.terminate()).catch(() => { }); }
      }
      throw new Error('Mesin pembaca gambar gagal dimuat. Periksa internet (sekali saja) lalu coba lagi.');
    }
    async rec(canvas, psm, label) {
      await this.worker.setParameters({ tessedit_pageseg_mode: String(psm) });
      const { data } = await this.worker.recognize(canvas), sc = scoreText(data.text, data.confidence);
      return { text: data.text || '', conf: data.confidence || 0, sc, data, label, psm };
    }
    // baca satu canvas berwarna: bin→gray→psm4→rotasi 90/180/270 (berhenti saat sudah bagus)
    async read(base, o) {
      o = o || {}; await this.ensure(); const cfg = VFX.config; let v = null, best = null, tries = 0;
      const rotated = [];
      const consider = async (cv, psm, label, deg) => {
        if (tries >= cfg.maxAttempts) return false; tries++;
        const r = await this.rec(cv, psm, label); r.deg = deg || 0;
        if (!best || r.sc.score > best.sc.score) best = r;
        return r.sc.good;
      };
      try {
        this.status('Menganalisis gambar… 🔍'); v = await makeVariants(base);
        this.pct = p => (o.label || 'Membaca gambar… ') + Math.round(p * 100) + '%';
        this.status('Mengekstrak teks… 📖');
        if (await consider(v.bin, 6, 'bin')) return this._fin(best, base, o);
        if (await consider(v.gray, 6, 'gray')) return this._fin(best, base, o);
        if (await consider(v.gray, 4, 'gray4')) return this._fin(best, base, o);
        // teks sampah → coba rotasi
        this.status('Teks kurang jelas, mencoba memutar gambar… 🔄');
        for (const deg of [90, 270, 180]) {
          const rc = rotateCanvas(v.bin, deg); rotated.push(rc);
          if (await consider(rc, 6, 'rot' + deg, deg)) break;
          if (best && best.sc.score > 85) break;
        }
        if (!best || !best.sc.good) {                       // rotasi pada varian abu-abu
          for (const deg of [90, 270, 180]) { if (tries >= cfg.maxAttempts) break; const rc = rotateCanvas(v.gray, deg); rotated.push(rc); if (await consider(rc, 6, 'rotg' + deg, deg)) break; }
        }
        return this._fin(best, base, o);
      } finally { freeCanvas(v && v.bin); freeCanvas(v && v.gray); rotated.forEach(freeCanvas); }
    }
    _fin(r, base, o) {
      let text = r ? r.text : '';
      if (r && r.deg === 0 && o.colorHints !== false && r.data && r.data.lines) { try { const th = addColorHints(r.data.lines, base); text = th.replace(/\s/g, '').length >= Math.min(8, String(r.text || '').replace(/\s/g, '').length) ? th : r.text; } catch (e) { text = r.text; } }
      return { text, conf: r ? r.conf : 0, good: !!(r && r.sc.good) };
    }
    async close() { if (this.worker && !this.closed) { this.closed = true; try { await this.worker.terminate(); } catch (e) { } } this.worker = null; }
  }
  VFX.OcrSession = OcrSession;

  // Warna teks asli (hijau = masuk, merah = keluar) → penanda ⟦hijau⟧/⟦merah⟧ untuk sistem scoring
  function addColorHints(lines, base) {
    const x = base.getContext('2d', { willReadFrequently: true }), W = base.width, H = base.height, out = [];
    for (const ln of lines) {
      let t = (ln.text || '').replace(/\n+$/, ''); const b = ln.bbox;
      if (b && /\d[\d.,]{2,}/.test(t) && !/⟦/.test(t)) {
        const x0 = Math.max(0, b.x0 | 0), y0 = Math.max(0, b.y0 | 0), w = Math.min(W - x0, (b.x1 - b.x0) | 0), h = Math.min(H - y0, (b.y1 - b.y0) | 0);
        if (w > 4 && h > 3) {
          const d = x.getImageData(x0, y0, w, h).data; let g = 0, r = 0, n = 0;
          for (let i = 0; i < d.length; i += 4) {
            const R = d[i], G = d[i + 1], B = d[i + 2], mx = Math.max(R, G, B), mn = Math.min(R, G, B);
            if (mx < 60 || mx - mn < 55) continue;          // hanya piksel berwarna jenuh
            n++; if (G > R + 25 && G > B + 15) g++; else if (R > G + 55 && R > B + 40) r++;
          }
          const tot = w * h;
          if (n > tot * .02) { if (g > n * .6) t += ' ⟦hijau⟧'; else if (r > n * .6) t += ' ⟦merah⟧'; }
        }
      }
      out.push(t);
    }
    return out.join('\n');
  }
  VFX.stripHints = s => String(s).replace(/\s*⟦(?:hijau|merah)⟧/g, '');

  // API tingkat tinggi: file gambar → teks
  const _ocr = async function (file, ctx) {
    ctx = ctx || {}; const sess = new OcrSession(ctx); let base = null;
    try {
      if (ctx.busy) ctx.busy('Menganalisis gambar… 🔍');
      VFX.ui.set(2, 'Menyiapkan gambar'); base = await toCanvas(file);
      let qr = null; try { qr = await VFX.scanQRIS(base, { allowLib: false }); } catch (e) { }
      const r = await sess.read(base, { colorHints: ctx.colorHints });
      if (!qr && (/qris|nmid|merchant/i.test(r.text) || r.text.replace(/\s/g, '').length < 40)) { try { qr = await VFX.scanQRIS(base, { allowLib: true }); } catch (e) { } }
      VFX.ui.set(100, 'Selesai');
      return qr ? qr.header + '\n' + r.text : r.text;
    } finally { freeCanvas(base); await sess.close(); }
  };
  VFX.ocr = (file, ctx) => VFX.queue(() => _ocr(file, ctx), ctx);

  /* ───────────── 2. PDF (teks → baris; halaman flattened → OCR) ───────────── */
  /* Akar error "Setting up fake worker failed … WorkerMessageHandler":
     worker PDF.js dulu dibuat dari Blob berisi importScripts(). Begitu browser/WebView menolak Worker (file://, WebView Android),
     PDF.js pindah ke "fake worker" yang memuat skrip itu di thread utama — di sana importScripts() tidak ada, jadi
     window.pdfjsWorker tidak pernah terbentuk. Perbaikan: (1) worker asli dari Blob berisi KODE worker (hasil fetch);
     (2) bila gagal, muat pdf.worker.min.js sebagai <script> biasa sehingga PDF.js memakai handler di thread utama. */
  async function loadMainThreadWorker() {
    if (root.pdfjsWorker && root.pdfjsWorker.WorkerMessageHandler) return;
    for (const u of VFX.config.pdfjs.workers) {
      try {
        await injectScript(u);
        const g = root['pdfjs-dist/build/pdf.worker'];
        if (!(root.pdfjsWorker && root.pdfjsWorker.WorkerMessageHandler) && g && g.WorkerMessageHandler) root.pdfjsWorker = g;
        if (root.pdfjsWorker && root.pdfjsWorker.WorkerMessageHandler) return;
      } catch (e) { console.warn('VFX pdf worker:', e.message); }
    }
    throw new Error('Mesin pembaca PDF gagal dimuat. Periksa internet (sekali saja) lalu coba lagi.');
  }
  VFX.pdfInit = async function (ctx, o) {
    o = o || {}; const P = VFX.config.pdfjs;
    await loadAny(P.srcs, () => root.pdfjsLib && root.pdfjsLib.getDocument);
    const G = root.pdfjsLib.GlobalWorkerOptions;
    if (o.mainThread) { await loadMainThreadWorker(); G.workerSrc = P.workers[0]; VFX._pdfMode = 'main'; return 'main'; }
    if (VFX._pdfMode) return VFX._pdfMode;
    if (typeof Worker !== 'undefined' && typeof fetch === 'function' && typeof Blob !== 'undefined') {
      for (const u of P.workers) {
        try {
          const r = await withTimeout(fetch(u), 20000, 'timeout'); if (!r.ok) continue;
          const code = await r.text(); if (code.length < 20000) continue;          // pastikan benar-benar skrip worker
          G.workerSrc = URL.createObjectURL(new Blob([code], { type: 'text/javascript' })); VFX._pdfMode = 'worker'; return 'worker';
        } catch (e) { console.warn('VFX pdf worker fetch:', e.message); }
      }
    }
    await loadMainThreadWorker(); G.workerSrc = P.workers[0]; VFX._pdfMode = 'main'; return 'main';
  };
  function itemsToLines(items) {
    const ys = [], ls = {};
    for (const it of items) {
      if (!it.str || !it.str.trim()) continue;
      const y = it.transform[5]; let k = ys.find(v => Math.abs(v - y) <= 2.5); if (k === undefined) { k = y; ys.push(y); }
      (ls[k] = ls[k] || []).push([it.transform[4], it.str, it.width || 0]);
    }
    return Object.keys(ls).map(Number).sort((a, b) => b - a).map(y => {
      const a = ls[y].sort((p, q) => p[0] - q[0]); let s = '', end = null;
      for (const c of a) { if (end !== null && c[0] - end > 10) s += '  '; else if (s) s += ' '; s += c[1]; end = c[0] + c[2]; }
      return s;
    }).join('\n');
  }
  const _pdf = async function (file, ctx) {
    ctx = ctx || {}; const busy = ctx.busy || (() => { });
    busy('Membuka PDF… 📄'); VFX.ui.set(2, 'Membuka PDF');
    await VFX.pdfInit(ctx);
    const data = new Uint8Array(await file.arrayBuffer()); let pw, doc = null, task = null, downgraded = false;
    for (let i = 0; i < 5 && !doc; i++) {
      try { task = root.pdfjsLib.getDocument({ data: data.slice(), password: pw, isEvalSupported: false, verbosity: 0 }); doc = await task.promise; }
      catch (e) {
        if (task) { try { task.destroy(); } catch (x) { } }
        if (e && e.name === 'PasswordException') { busy(); if (!ctx.askPw) throw e; pw = await ctx.askPw(); if (pw === null) throw new Error('Dibatalkan'); busy('Membuka PDF… 📄'); }
        else if (!downgraded && VFX._pdfMode !== 'main' && /worker|handler|fake|setting up|undefined/i.test(String((e && e.message) || e))) { downgraded = true; await VFX.pdfInit(ctx, { mainThread: true }); }
        else throw e;
      }
    }
    if (!doc) throw new Error('Password salah.');
    let sess = null; const out = [], N = doc.numPages;
    try {
      for (let p = 1; p <= N; p++) {
        busy('Mengekstrak teks… hal ' + p + '/' + N); VFX.ui.set(6 + (p - 1) / N * 90, 'PDF hal ' + p + '/' + N);
        const page = await doc.getPage(p); let txt = '';
        try { txt = itemsToLines((await page.getTextContent()).items); } catch (e) { txt = ''; }
        if (txt.replace(/\s/g, '').length < 30) {                       // PDF hasil scan/flattened → lempar ke Tesseract
          const v0 = page.getViewport({ scale: 1 }), sc = Math.min(3, Math.max(1.5, 1800 / v0.width)), vp = page.getViewport({ scale: sc });
          const cv = document.createElement('canvas'); cv.width = Math.ceil(vp.width); cv.height = Math.ceil(vp.height);
          try {
            await page.render({ canvasContext: cv.getContext('2d', { willReadFrequently: true }), viewport: vp }).promise;
            if (!sess) sess = new OcrSession(ctx);
            sess.pct = null; sess.base = 6 + (p - 1) / N * 90 + 20 / N; sess.span = 70 / N;
            const r = await sess.read(cv, { label: 'Membaca hal ' + p + '/' + N + '… ', colorHints: false });
            txt = r.text;
          } finally { freeCanvas(cv); }
        }
        out.push(txt); try { page.cleanup(); } catch (e) { }
        await yieldUI();                                                 // PDF 50 halaman tetap responsif
      }
    } finally { if (sess) await sess.close(); try { await doc.destroy(); } catch (e) { } try { if (task) task.destroy(); } catch (e) { } }
    VFX.ui.set(100, 'Selesai');
    return out.join('\n');
  };
  VFX.pdf = (file, ctx) => VFX.queue(() => _pdf(file, ctx), ctx);

  /* ───────────── 3. NORMALISASI & PRIMITIF PARSER ───────────── */
  const MONTHS = { jan: 1, januari: 1, feb: 2, peb: 2, pebruari: 2, februari: 2, mar: 3, maret: 3, apr: 4, april: 4, mei: 5, may: 5, jun: 6, juni: 6, jul: 7, juli: 7, agu: 8, agt: 8, ags: 8, agustus: 8, aug: 8, august: 8, sep: 9, sept: 9, september: 9, okt: 10, oct: 10, oktober: 10, october: 10, nov: 11, nop: 11, november: 11, des: 12, dec: 12, desember: 12, december: 12 };
  const OCRMAP = { O: '0', o: '0', Q: '0', I: '1', l: '1', '|': '1', '!': '1', B: '8', S: '5', Z: '2' };
  function fixNumTokens(s) {
    s = s.replace(/\b(rp|idr)\s*[.:]?\s*(?=[0-9OolI|!BSZ])/gi, 'Rp ');
    // tanggal bertipo: 2O/1O/2O25 → 20/10/2025
    s = s.replace(/(?:^|[^A-Za-z0-9])([0-9OoIl]{1,4}(?:[\/\-.][0-9OoIl]{1,4}){1,2})(?![A-Za-z0-9])/g, (m, t) => /\d/.test(t) ? m.replace(t, t.replace(/[Oo]/g, '0').replace(/[Il]/g, '1')) : m);
    // nominal bertipo: 1.OOO.OOO,OO → 1.000.000,00
    s = s.replace(/(^|[^A-Za-z])([0-9OolI|!BSZ][0-9OolI|!BSZ.,]{2,})(?![A-Za-z])/g, (m, pre, t) => {
      if (!/[0-9]/.test(t)) return m;
      const mapped = t.replace(/[OolI|!BSZQ]/g, c => OCRMAP[c] || c);
      if (!/^\d[\d.,]*\d$|^\d+$/.test(mapped)) return m;
      const letters = (t.match(/[OolI|!BSZQ]/g) || []).length; if (letters > t.length / 2) return m;
      return pre + mapped;
    });
    s = s.replace(/(\d)\s*([.,])\s*(\d{3})(?!\d)/g, '$1$2$3');                     // "1. 000" → "1.000"
    s = s.replace(/\b(Rp\s*\d{1,3})((?:\s\d{3}){1,3})(?!\d)/gi, (m, a, b) => a + b.replace(/\s/g, '.'));
    s = s.replace(/(\d{1,3})((?:\s\d{3}){1,3})(?=[.,]\d{2}(?!\d))/g, (m, a, b) => a + b.replace(/\s/g, '.'));
    s = s.replace(/(\d)[.,]{2,}(\d)/g, '$1.$2');                                   // pemisah ribuan ganda
    return s;
  }
  function normLine(s) { return fixNumTokens(String(s).replace(/[\u00a0\u2007\u202f\u200b\ufeff]/g, ' ').replace(/[\t]+/g, '  ').replace(/ {3,}/g, '  ').trim()); }
  VFX.fixNumTokens = fixNumTokens;

  function parseMoney(s) {                                 // 1.000,00 · 1,000.00 · 1.000 · 1,5 · 25000
    s = String(s).replace(/[^\d.,]/g, ''); if (!s) return 0;
    const ld = s.lastIndexOf('.'), lc = s.lastIndexOf(','); let dec = -1;
    if (ld > -1 && lc > -1) { const p = Math.max(ld, lc), after = s.length - p - 1; dec = after <= 2 ? p : -1; }
    else if (ld > -1 || lc > -1) { const p = Math.max(ld, lc), sep = s[p], cnt = s.split(sep).length - 1, after = s.length - p - 1; dec = (cnt === 1 && after <= 2) ? p : -1; }
    const v = dec > -1 ? parseFloat(s.slice(0, dec).replace(/[.,]/g, '') + '.' + s.slice(dec + 1)) : parseFloat(s.replace(/[.,]/g, ''));
    return Math.round(isFinite(v) ? v : 0);
  }
  VFX.parseMoney = parseMoney;

  function monthOf(w) { w = w.toLowerCase(); return MONTHS[w] || 0; }
  function findDate(s, year) {                              // → {iso, s, e} | null
    let m, mkd = (Y, M, D) => { if (Y < 100) Y += 2000; const d = new Date(Y, M - 1, D); return d.getFullYear() === Y && d.getMonth() === M - 1 && d.getDate() === D ? Y + '-' + String(M).padStart(2, '0') + '-' + String(D).padStart(2, '0') : ''; };
    const fut = iso => { if (!iso) return ''; const n = new Date(); n.setDate(n.getDate() + 31); return new Date(iso) > n ? mkd(+iso.slice(0, 4) - 1, +iso.slice(5, 7), +iso.slice(8)) : iso; };
    if ((m = /\b(20\d{2})[-\/.](\d{1,2})[-\/.](\d{1,2})\b/.exec(s))) { const r = mkd(+m[1], +m[2], +m[3]); if (r) return { iso: r, s: m.index, e: m.index + m[0].length }; }
    if ((m = /\b(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4}|\d{2})\b/.exec(s))) { const r = mkd(+m[3], +m[2], +m[1]); if (r) return { iso: r, s: m.index, e: m.index + m[0].length }; }
    const re = /\b(\d{1,2})[\s\-\/.]*([A-Za-z]{3,9})\.?(?:[\s\-\/.,]*(\d{4}|\d{2})\b)?/g;
    while ((m = re.exec(s))) { const mo = monthOf(m[2]); if (!mo) continue; const r = mkd(m[3] ? +m[3] : year, mo, +m[1]); if (r) return { iso: m[3] ? r : fut(r), s: m.index, e: m.index + m[0].length }; }
    if ((m = /^\s*(\d{1,2})[\/\-](\d{1,2})(?![\/\-.]?\d)/.exec(s))) { const r = mkd(year, +m[2], +m[1]); if (r) return { iso: fut(r), s: m.index, e: m.index + m[0].length }; }
    return null;
  }
  VFX.findDate = findDate;

  const AMT_RE = /(?:^|[^\w.,])(?:([+\-−–])\s*)?(?:(rp|idr)\s*)?(?:([+\-−–])\s*)?(\(?)(\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?|\d+[.,]\d{1,2}|\d+)(\)?)(?:\s*([+\-−–])(?![\w]))?(?![\w])(?:\s*(CR|DB|DR|KR|D|K|C)(?![A-Za-z]))?/gi;
  function findAmounts(s) {
    s = s.replace(/\b\d{9,}\b/g, ' ').replace(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, ' ');   // no. rekening/ref & jam bukan nominal
    const out = []; AMT_RE.lastIndex = 0; let m;
    while ((m = AMT_RE.exec(s))) {
      const raw = m[5], rp = !!m[2], hasSep = /[.,]/.test(raw), sg = m[1] || m[3] || '';
      if (!hasSep && !rp && !sg && raw.length < 4) continue;                           // "5", "25" bukan nominal
      let v = parseMoney(raw); if (v > 9e11) continue;
      let sign = /[+]/.test(sg) ? '+' : sg ? '-' : ''; if (m[4] && m[6]) sign = '-'; else if (m[7]) sign = /[+]/.test(m[7]) ? '+' : '-';
      let mk = (m[8] || '').toUpperCase(); mk = mk === 'CR' || mk === 'KR' || mk === 'K' || mk === 'C' ? 'CR' : mk ? 'DB' : '';
      out.push({ v, sg: sign, mk, rp, fmt: hasSep || rp, idx: m.index, end: m.index + m[0].length });
    }
    return out;
  }
  VFX.findAmounts = findAmounts;

  /* ───────────── bank / e-wallet auto-detect ───────────── */
  const BANKS = [['GoPay', /go-?pay|gojek/gi], ['OVO', /\bovo\b/gi], ['DANA', /\bdana\b/gi], ['ShopeePay', /shopee\s*pay/gi], ['LinkAja', /link\s*aja/gi], ['Flip', /\bflip\b/gi], ['SeaBank', /sea\s*bank/gi], ['Jago', /\bjago\b/gi], ['blu', /\bblu\b/gi], ['Jenius', /jenius/gi], ['NeoBank', /neo\s*(?:bank|commerce)/gi], ['Allo Bank', /allo\s*bank/gi], ['BCA', /\bm?-?bca\b|klikbca|\bmybca\b/gi], ['Mandiri', /mandiri|livin/gi], ['BRI', /\bbri\b|brimo/gi], ['BNI', /\bbni\b/gi], ['BTN', /\bbtn\b/gi], ['CIMB', /cimb/gi], ['Danamon', /danamon/gi], ['Permata', /permata/gi], ['OCBC', /ocbc/gi], ['Maybank', /maybank/gi], ['Panin', /panin/gi], ['BSI', /\bbsi\b|syariah indonesia/gi], ['Muamalat', /muamalat/gi]];
  const WALLETS = new Set(['GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja', 'Flip']);
  function detectBank(text) {
    const head = text.slice(0, 700); let best = null, bs = 0;
    for (const [n, re] of BANKS) { const a = (head.match(re) || []).length * 3 + (text.match(re) || []).length; if (a > bs) { bs = a; best = n; } }
    return best || 'Bank';
  }

  /* ───────────── penentuan arah (scoring) ───────────── */
  const OUTW = [[/\b(db|dr|debit|debet)\b/i, 6], [/\badm(in)?\b|biaya admin|\bfee\b|\bpajak\b|\btax\b/i, 5], [/\b(transfer|tf|trf)\s*ke\b|\bke\s+(rek|rekening)\b/i, 3], [/\btarik\b|\bwithdraw/i, 3], [/\b(bayar|pembayaran|pembelian|payment|purchase|belanja|tagihan|cicilan|langganan)\b/i, 2.5], [/\bqris\b|\bpos\b|\becommerce\b/i, 2], [/\b(keluar|dibayar)\b/i, 3]];
  const INW = [[/\b(cr|kredit|credit)\b/i, 6], [/\b(masuk|diterima|terima|received|incoming)\b/i, 3], [/\b(gaji|salary|payroll|bonus|thr)\b/i, 3], [/\b(bunga|interest|dividen)\b/i, 3], [/\b(setoran|setor|deposit)\b/i, 2.5], [/\b(refund|cashback|pengembalian|reward)\b/i, 3], [/\b(transfer|tf|trf)\s*dari\b|\bdari\b/i, 2]];
  function dirScore(o) {
    let i = 0, x = 0; const t = o.text;
    if (o.chain === 'up') i += 7; else if (o.chain === 'down') x += 7;
    if (o.sg === '+') i += 4; else if (o.sg === '-') x += 4;
    if (o.mk === 'CR') i += 6; else if (o.mk === 'DB') x += 6;
    if (o.hint === 'hijau') i += 2.5; else if (o.hint === 'merah') x += 2.5;
    if (o.pos === 'in') i += 5; else if (o.pos === 'out') x += 5;
    for (const [re, w] of OUTW) if (re.test(t)) x += w;
    for (const [re, w] of INW) if (re.test(t)) i += w;
    if (/top\s*-?up/i.test(t)) { if (o.wallet) i += 3; else x += 2; }
    return { i, x };
  }

  /* ───────────── 4. PARSER MUTASI (generator → bisa sync atau time-sliced) ───────────── */
  const SKIP = /^(halaman|page)\b|^(no\.?\s*rek|nomor rekening|account\s*(no|number)|mata uang|currency|catatan|notes?|bersambung|continued|nama\s*:|cabang|branch)\b|mutasi\s*(debet|debit|kredit|credit)\s*:|^total\s*(mutasi|debit|debet|kredit|credit|pemasukan|pengeluaran)|tanggal\s+(keterangan|deskripsi|transaksi)|date\s+(description|remark)|saldo\s*(awal|akhir)|opening balance|closing balance|^(ringkasan|summary)\b/i;
  function cleanDesc(s, spans) {
    let t = s; spans.sort((a, b) => b.s - a.s).forEach(p => { t = t.slice(0, p.s) + ' ' + t.slice(p.e); });
    return t.replace(/⟦[^⟧]*⟧/g, ' ').replace(/\b(CR|DB|DR|KR)\b/g, ' ').replace(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, ' ').replace(/\b(rp|idr)\b\.?/gi, ' ').replace(/[|;]+/g, ' ').replace(/^[\s\-–—:,.]+|[\s\-–—:,.]+$/g, '').replace(/\s+/g, ' ').trim().slice(0, 60);
  }
  function yearOf(text) {
    let m = /(?:periode|period)[^\n]{0,70}?(20\d\d)/i.exec(text); if (m) return +m[1];
    const c = {}; (text.match(/\b20\d\d\b/g) || []).forEach(y => c[y] = (c[y] || 0) + 1);
    const top = Object.entries(c).sort((a, b) => b[1] - a[1])[0]; return top ? +top[0] : new Date().getFullYear();
  }
  function recon(rows, sa, ea) { if (sa == null || ea == null || !rows.length) return null; let inn = 0, out = 0; rows.forEach(r => r.type === 'income' ? inn += r.amount : out += r.amount); const diff = sa + inn - out - ea; return { ok: Math.abs(diff) <= 1, diff }; }
  function qual(res) {
    if (!res || !res.rows || !res.rows.length) return -1e9;
    let s = res.rows.length; if (res.recon) s += res.recon.ok ? 40 : -25; res.rows.forEach(r => { if (r.flag && r.flag !== 'cek kategori') s -= .7; else if (r.flag) s -= .05; }); if (res.structured) s += 25; if (res.chain) s += 15; return s;
  }
  VFX.qual = qual;
  VFX.pickBetter = function (a, b) {
    if (!b || !b.rows || !b.rows.length) return a; if (!a || !a.rows || !a.rows.length) return b;
    if (a.recon && a.recon.ok && !(b.recon && b.recon.ok)) return a;           // jangan merusak hasil lama yang sudah cocok saldo
    return (b.rows.length >= a.rows.length * .8 && qual(b) > qual(a) + .5) ? b : a;                                       // seri → tetap hasil lama (zero regression)
  };

  function* stmtGen(text, ctx) {
    ctx = ctx || {}; const catf = ctx.cat || (() => 'Lainnya'), raw = String(text || '');
    if (looksCSV(raw)) { const r = yield* csvGen(raw, ctx); if (r && r.rows.length) return r; }
    const year = yearOf(raw), bank = detectBank(raw), wallet = WALLETS.has(bank);
    const lines = raw.split(/\r?\n/), items = []; let sa = null, ea = null;
    const gm = re => { const m = raw.match(re); return m ? parseMoney(m[1]) : null; };
    sa = gm(/(?:saldo\s*awal|opening\s*balance)[^\d\n]*([\d.,]+)/i); ea = gm(/(?:saldo\s*akhir|closing\s*balance|ending\s*balance)[^\d\n]*([\d.,]+)/i);
    for (let n = 0; n < lines.length; n++) {
      if (n % 250 === 0) yield n;
      let ln = lines[n]; if (!ln.trim()) continue;
      const hm = /⟦(hijau|merah)⟧/.exec(ln), hint = hm ? hm[1] : ''; ln = normLine(ln.replace(/\s*⟦(?:hijau|merah)⟧/g, ''));
      if (SKIP.test(ln)) continue;
      const dt = findDate(ln, year); let rest = ln; const spans = [];
      if (dt) { spans.push({ s: dt.s, e: dt.e }); rest = ln.slice(0, dt.s) + ' '.repeat(dt.e - dt.s) + ln.slice(dt.e); }
      const ams = findAmounts(rest);
      items.push({ ln, rest, dt: dt ? dt.iso : '', ams, hint, spans });
    }
    const anchored = items.filter(it => it.dt && it.ams.length).length, tabular = anchored >= 2;
    const rows = []; let cur = '', buf = [], prev = null, k = 0;
    const colsOf = ams => {                                  // [debit,credit,saldo] | [jumlah,saldo] | [jumlah]
      const n = ams.length;
      if (n >= 3 && (ams[0].v === 0 || ams[1].v === 0)) { const dbt = ams[0].v !== 0; return { a: dbt ? ams[0] : ams[1], bal: ams[n - 1], pos: dbt ? 'out' : 'in' }; }
      if (n === 2 && (ams[0].v === 0 || ams[1].v === 0) && ams[0].fmt && ams[1].fmt) { const dbt = ams[0].v !== 0; return { a: dbt ? ams[0] : ams[1], bal: null, pos: dbt ? 'out' : 'in' }; }
      if (n >= 2) return { a: ams[n - 2], bal: ams[n - 1], pos: '' };
      return { a: ams[0], bal: null, pos: '' };
    };
    const push = (it, date, desc, flag) => {
      const c = colsOf(it.ams); if (!c.a || c.a.v <= 0) return;
      const r = { id: rows.length, date, desc: String(desc || '').replace(/\s*\b(?:sisa\s+)?(?:saldo|balance)\b[\s:]*$/i, '').trim() || 'Mutasi', amount: c.a.v, bal: c.bal ? c.bal.v : null, sg: c.a.sg, mk: c.a.mk, pos: c.pos, hint: it.hint, text: it.ln, flag: flag || '' };
      rows.push(r); prev = r;
    };
    for (const it of items) {
      if ((k++) % 250 === 0) yield k;
      const has = it.ams.length > 0;
      if (it.dt && has) { push(it, it.dt, cleanDesc(it.ln, it.spans.concat(it.ams.map(a => ({ s: a.idx, e: a.end })))), ''); cur = it.dt; buf = []; }
      else if (it.dt && !has) { cur = it.dt; buf = []; }
      else if (!it.dt && has) {
        const formatted = it.ams.some(a => a.fmt);
        if (!tabular || (prev && formatted && /[A-Za-z]{3}/.test(it.ln))) {
          const d = cur || (prev && prev.date) || ''; const desc = [...buf.slice(-2), cleanDesc(it.ln, it.ams.map(a => ({ s: a.idx, e: a.end })))].filter(Boolean).join(' ').slice(0, 60);
          push(it, d || new Date().toISOString().slice(0, 10), desc, d ? '' : 'cek tanggal'); buf = [];
        } else if (prev && prev.desc.length < 45) { prev.desc = (prev.desc + ' ' + cleanDesc(it.ln, it.ams.map(a => ({ s: a.idx, e: a.end })))).slice(0, 60).trim(); }
      } else {
        const t = it.ln.trim();
        if (tabular && prev && t.length < 80 && prev.desc.length < 45 && !SKIP.test(t)) prev.desc = (prev.desc + ' ' + t).slice(0, 60).trim();
        else if (t.length > 2 && t.length < 70) buf.push(t);
      }
    }
    // rantai saldo (forward/reverse) → arah paling pasti
    const wb = rows.filter(r => r.bal != null); let chain = '';
    if (wb.length >= 3) {
      let f = 0, v = 0, pairs = 0;
      for (let i = 1; i < rows.length; i++) { const a = rows[i - 1], b = rows[i]; if (a.bal == null || b.bal == null) continue; pairs++; if (Math.abs(Math.abs(b.bal - a.bal) - b.amount) <= 1) f++; if (Math.abs(Math.abs(a.bal - b.bal) - a.amount) <= 1) v++; }
      if (pairs && Math.max(f, v) / pairs >= .5) chain = f >= v ? 'fwd' : 'rev';
    }
    if (rows.length && sa != null && rows[0].bal != null && chain === 'fwd') rows[0]._c = rows[0].bal > sa ? 'up' : 'down';
    for (let i = 0; i < rows.length; i++) {
      if (i % 250 === 0) yield i;
      const r = rows[i]; let ch = r._c || '';
      if (chain === 'fwd' && i > 0 && rows[i - 1].bal != null && r.bal != null && Math.abs(Math.abs(r.bal - rows[i - 1].bal) - r.amount) <= 1) ch = r.bal > rows[i - 1].bal ? 'up' : 'down';
      if (chain === 'rev' && i < rows.length - 1 && rows[i + 1].bal != null && r.bal != null && Math.abs(Math.abs(r.bal - rows[i + 1].bal) - r.amount) <= 1) ch = r.bal > rows[i + 1].bal ? 'up' : 'down';
      const s = dirScore({ text: r.text, sg: r.sg, mk: r.mk, hint: r.hint, pos: r.pos, chain: ch, wallet });
      r.type = s.i > s.x ? 'income' : 'expense';
      r.flag = r.flag || (Math.abs(s.i - s.x) < 2 ? 'cek arah' : '');
    }
    const out = rows.map((r, i) => {
      const t = r.type, c = catf(r.desc, t);
      return { id: i, date: r.date, desc: r.desc, amount: r.amount, type: t, cat: c, on: 1, flag: r.flag || (/lainnya/i.test(c) ? 'cek kategori' : '') };
    });
    return { bank, rows: out, recon: recon(out, sa, ea), loose: tabular ? 0 : 1, engine: 'vfx', chain: !!chain };
  }

  /* ───────────── CSV (chunked, tanpa freeze) ───────────── */
  function looksCSV(raw) {
    const L = raw.split(/\r?\n/, 12).filter(l => l.trim()); if (L.length < 3) return false;
    for (const d of [',', ';', '\t', '|']) { const c = L.map(l => l.split(d).length - 1); if (c[0] >= 2 && c.slice(0, 8).every(x => Math.abs(x - c[0]) <= 1 || x >= 2) && /(tanggal|tgl|date|keterangan|deskripsi|description|debit|kredit|credit|saldo|balance|jumlah|amount)/i.test(L.slice(0, 6).join(' '))) return true; }
    return false;
  }
  function* csvRows(raw) {
    raw = raw.replace(/^\ufeff/, ''); const first = raw.split(/\r?\n/, 6).join('\n'); let d = ',', bc = -1;
    for (const c of [',', ';', '\t', '|']) { const n = (first.match(new RegExp(c === '|' ? '\\|' : c, 'g')) || []).length; if (n > bc) { bc = n; d = c; } }
    const rows = []; let row = [], f = '', q = false, i = 0;
    for (; i < raw.length; i++) {
      const ch = raw[i];
      if (q) { if (ch === '"') { if (raw[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch; }
      else if (ch === '"') q = true; else if (ch === d) { row.push(f); f = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && raw[i + 1] === '\n') i++; row.push(f); f = ''; if (row.some(x => x.trim())) rows.push(row); row = []; }
      else f += ch;
      if (i % 30000 === 0) yield i;
    }
    row.push(f); if (row.some(x => x.trim())) rows.push(row); return rows;
  }
  function* csvGen(raw, ctx) {
    const catf = ctx.cat || (() => 'Lainnya'), R = yield* csvRows(raw); if (R.length < 2) return null;
    const G = { date: /tanggal|tgl|date|waktu|time/i, desc: /keterangan|deskripsi|description|uraian|remark|narasi|detail|berita|transaksi/i, debit: /^(debit|debet|keluar|pengeluaran|withdrawal|db)$|debit|debet/i, credit: /^(credit|kredit|masuk|pemasukan|deposit|cr)$|kredit|credit/i, amount: /jumlah|amount|nominal|mutasi/i, bal: /saldo|balance/i, type: /^(d\/c|dc|type|tipe|jenis|cr\/db|db\/cr|status)$/i };
    let hi = -1, map = null;
    for (let i = 0; i < Math.min(15, R.length); i++) { const m = {}; R[i].forEach((c, j) => { const t = c.trim(); for (const k of Object.keys(G)) if (m[k] === undefined && G[k].test(t)) m[k] = j; }); if (m.date !== undefined && (m.amount !== undefined || m.debit !== undefined || m.credit !== undefined)) { hi = i; map = m; break; } }
    if (!map) return null;
    const year = yearOf(raw), rows = []; let sa = null;
    for (let i = hi + 1; i < R.length; i++) {
      if (i % 400 === 0) yield i;
      const c = R[i], ds = (c[map.date] || '').trim(), dt = findDate(normLine(ds), year); if (!dt) continue;
      const desc = ((map.desc !== undefined ? c[map.desc] : '') || '').replace(/\s+/g, ' ').trim().slice(0, 60) || 'Mutasi';
      const mv = k => map[k] === undefined ? null : parseMoney(normLine(c[map[k]] || '')); let amount = 0, type = '', flag = '';
      const dbt = mv('debit'), crd = mv('credit'), am = mv('amount');
      if (dbt || crd) { if (crd && !dbt) { amount = crd; type = 'income'; } else if (dbt && !crd) { amount = dbt; type = 'expense'; } else if (dbt && crd) { amount = Math.max(dbt, crd); type = dbt >= crd ? 'expense' : 'income'; flag = 'cek arah'; } }
      else if (am) {
        const rawA = (c[map.amount] || '').trim(), tt = map.type !== undefined ? (c[map.type] || '') : ''; amount = am;
        const s = dirScore({ text: tt + ' ' + desc, sg: /^\s*[-−–(]/.test(rawA) ? '-' : /^\s*\+/.test(rawA) ? '+' : '', mk: /\b(CR|K|KR|C)\b/i.test(tt + ' ' + rawA) ? 'CR' : /\b(DB|D|DR)\b/i.test(tt + ' ' + rawA) ? 'DB' : '', hint: '', pos: '', chain: '', wallet: false });
        type = s.i > s.x ? 'income' : 'expense'; if (Math.abs(s.i - s.x) < 2) flag = 'cek arah';
      }
      if (!amount) continue;
      const cat = catf(desc, type); rows.push({ id: rows.length, date: dt.iso, desc, amount, type, cat, on: 1, flag: flag || (/lainnya/i.test(cat) ? 'cek kategori' : '') });
    }
    if (!rows.length) return null;
    const bank = detectBank(raw); return { bank, rows, recon: null, loose: 0, engine: 'vfx', structured: true };
  }

  VFX.parseStmt = (text, ctx) => drainSync(stmtGen(text, ctx));
  VFX.parseStmtAsync = (text, ctx) => drain(stmtGen(text, ctx), ctx && ctx.onTick);

  /* ───────────── 6. DIAGNOSIS (buka file dengan #vfxdiag, atau jalankan VFX.diagnose() di console) ───────────── */
  VFX.diagnose = async function (full) {
    const out = [], P = VFX.config.pdfjs, T = VFX.config.tesseract, add = (k, v) => out.push(k + ': ' + v);
    add('versi VFX', VFX.__v); add('protokol', location.protocol); add('Worker', typeof Worker !== 'undefined'); add('fetch', typeof fetch === 'function');
    add('BarcodeDetector (QR)', !!root.BarcodeDetector); add('online', navigator.onLine);
    const step = async (name, fn) => { const t0 = nowMs(); try { const v = await fn(); add(name, 'OK' + (v ? ' (' + v + ')' : '') + ' ' + Math.round(nowMs() - t0) + 'ms'); } catch (e) { add(name, 'GAGAL — ' + ((e && e.message) || e)); } };
    await step('muat Tesseract.js', async () => { await loadAny(T.srcs, () => root.Tesseract && root.Tesseract.createWorker); });
    await step('muat PDF.js', async () => { await loadAny(P.srcs, () => root.pdfjsLib && root.pdfjsLib.getDocument); return root.pdfjsLib.version; });
    await step('worker PDF', async () => VFX.pdfInit({}));
    await step('worker PDF mode thread-utama', async () => { await VFX.pdfInit({}, { mainThread: true }); return 'pdfjsWorker=' + !!(root.pdfjsWorker && root.pdfjsWorker.WorkerMessageHandler); });
    if (full) await step('mesin OCR + data bahasa (±20 MB sekali saja)', async () => { const s = new OcrSession({}); try { await s.ensure(); } finally { await s.close(); } });
    else add('mesin OCR', 'dilewati (jalankan VFX.diagnose(true) untuk uji unduh bahasa)');
    return out.join('\n');
  };
  if (isBrowser && /vfxdiag/.test(location.hash)) {
    const run = async () => {
      const d = document.createElement('pre'); d.style.cssText = 'position:fixed;inset:0;z-index:2147483001;margin:0;padding:calc(16px + env(safe-area-inset-top,0px)) 16px 16px;background:#111;color:#cfc;font:12px/1.5 monospace;white-space:pre-wrap;overflow:auto';
      d.textContent = 'VFX diagnosis berjalan…'; document.body.append(d);
      d.textContent = await VFX.diagnose(/full/.test(location.hash)); d.onclick = () => d.remove();
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  }

  VFX.ready = true;
  root.VFX = VFX;
})(typeof window !== 'undefined' ? window : globalThis);

