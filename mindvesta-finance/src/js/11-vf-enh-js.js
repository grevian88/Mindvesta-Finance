
(function(){
'use strict';
if(window.__vfEnh)return;window.__vfEnh=1;
const EMO=/\p{Extended_Pictographic}/u;
const isW=()=>{try{return S.settings.mode==='wanita'}catch(e){return false}};
const nz=x=>String(x==null?'':x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

/* ---------- Ikon kategori: [Pria, Wanita] ---------- */
const CAT={
 'makanan':['🍽️','🍰'],'kopi & jajan':['☕','🧋'],'transportasi':['🚗','🛵'],'belanja pribadi':['🛍️','👗'],
 'belanja dapur':['🛒','🥬'],'tagihan':['🧾','🧾'],'listrik rumah':['💡','💡'],'sewa / cicilan rumah':['🏠','🏡'],
 'pulsa & internet pribadi':['📱','📱'],'kesehatan':['💊','🩺'],'pendidikan':['🎓','📚'],'hiburan & rekreasi':['🎬','🎀'],
 'kebutuhan keluarga':['👨‍👩‍👧','👨‍👩‍👧'],'asuransi':['🛡️','🛡️'],'donasi / zakat':['🤲','🤲'],'service kendaraan':['🔧','🔧'],
 'perawatan diri':['💆','💄'],'operasional usaha':['🏢','🏪'],'pembayaran utang':['💳','💳'],'lainnya':['📦','🎁'],
 'gaji':['💼','💖'],'penjualan/omset':['🏪','🛍️'],'penghasilan sampingan':['💻','✨'],'bonus & thr':['🎁','🎉'],
 'investasi/aset':['📈','🌱'],'sewa properti':['🏘️','🏘️'],'dividen/bunga':['💰','💰'],'pengembalian dana':['↩️','↩️'],
 'lainnya - pemasukan':['➕','➕'],'tabungan':['🏦','🐷'],'transfer':['🔁','🔁']
};
const KW=[[/bensin|bbm|pertalite|pertamax|spbu|bahan bakar/,'⛽'],[/kopi|ngopi|jajan|boba|cafe/,'☕','🧋'],[/makan|nasi|resto|warteg|bakso|sarapan/,'🍽️','🍰'],
 [/dapur|sayur|pasar|sembako/,'🛒'],[/belanja|baju|sepatu|fashion/,'🛍️','👗'],[/listrik|pln|token/,'💡'],[/air|pdam/,'🚰'],[/pulsa|internet|wifi|kuota/,'📱'],
 [/transport|ojek|grab|gojek|parkir|tol|kereta|bus/,'🚗','🛵'],[/sehat|medis|dokter|obat|apotek/,'💊','🩺'],[/sekolah|kuliah|kursus|didik/,'🎓','📚'],
 [/hibur|film|game|liburan|wisata|rekreasi/,'🎬','🎀'],[/anak|keluarga|bayi/,'👨‍👩‍👧'],[/asuransi|bpjs/,'🛡️'],[/zakat|donasi|sedekah|infak/,'🤲'],
 [/kendaraan|bengkel|service|servis/,'🔧'],[/salon|spa|skincare|kecantikan|perawatan/,'💆','💄'],[/utang|hutang|cicil|kredit|pinjam/,'💳'],
 [/tabung|saving|dana darurat/,'🏦','🐷'],[/gaji|salary/,'💼','💖'],[/bonus|thr|hadiah|kado/,'🎁','🎉'],[/invest|saham|reksa|kripto|emas/,'📈','🌱'],
 [/sewa|kontrak|kost|kos/,'🏠'],[/langgan|subscri|netflix|spotify/,'🔁'],[/hewan|kucing|anjing|pet/,'🐾']];
function catIcon(name){
  const c=String(name==null?'':name).trim();if(!c)return '';
  try{const u=S.icons&&S.icons[c];if(u&&u!=='•')return u==='pump'?'⛽':u}catch(e){}
  const n=nz(c),w=isW()?1:0;
  if(CAT[n])return CAT[n][w];
  for(const k of KW)if(k[0].test(n))return (w&&k[2])||k[1];
  return w?'🌸':'🏷️';
}
const isCat=n=>{try{return [...S.catExp,...S.catInc].some(c=>nz(c)===nz(n))||!!CAT[nz(n)]}catch(e){return !!CAT[nz(n)]}};

/* ---------- Ikon judul bagian: [Pria, Wanita] ---------- */
const HEAD=[
 [/^dompet\s*&|^dompet$/,'👛','👛'],[/pengeluaran terbesar/,'🏆','🏆'],[/pengeluaran/,'💸','💸'],[/arus kas/,'💹','💹'],[/^terbaru/,'🕘','🕘'],
 [/^diagram|per kategori|^grafik/,'📊','📊'],[/^kalender/,'🗓️','🗓️'],[/^ringkasan/,'🧾','🧾'],[/berlangganan|langganan/,'🔁','🔁'],
 [/terjadwal/,'⏰','⏰'],[/^wawasan/,'💡','💡'],[/^per hari/,'📅','📅'],[/^akumulasi/,'📈','📈'],[/foto|^simpan/,'📸','📸'],[/mode saran/,'🧮','🧮'],
 [/anggaran/,'🎯','🎀'],[/target tabungan|^tabungan|tujuan/,'🏦','🐷'],[/berutang kepada saya|piutang/,'🤝','🤝'],[/saya berutang|^utang/,'💳','💳'],
 [/saldo|kekayaan/,'💎','💎'],[/posisi bersih/,'⚖️','⚖️'],[/mode tampilan/,'🎭','🎭'],[/gaya tampilan/,'🪄','🪄'],[/kustomisasi/,'🎨','🎨'],
 [/latar belakang/,'🖼️','🖼️'],[/buat sendiri/,'✏️','✏️'],[/kreasi saya/,'💾','💾'],[/^tema/,'🌗','🌗'],[/warna aksen/,'🌈','🌈'],
 [/ikon kategori/,'🏷️','🏷️'],[/^kategori/,'🗂️','🗂️'],[/^tampilan/,'👁️','👁️'],[/cadangan/,'💾','💾'],[/cara pakai/,'📖','📖'],
 [/pemasukan/,'💰','💰'],[/aset/,'💎','💎'],[/pengaturan/,'⚙️','⚙️'],[/split bill/,'🍻','🍻'],[/struk|scan/,'🧾','🧾'],[/lencana|badge/,'🏅','🏅'],
 [/streak/,'🔥','🔥'],[/girl math/,'🧮','🧮'],[/roast/,'🔥','🔥']
];
/* ---------- Ikon tombol teks ---------- */
const BTN={
 'ekspor json':'📤','impor json':'📥','ekspor semua csv':'📊','ekspor csv bulan ini':'📊','hapus semua':'🗑️','lihat semua':'📜','bayar':'💸',
 'ubah':'✏️','atur':'⚙️','atur gaji':'💼','pakai mode wanita':'👩','pakai mode pria':'🧑','reset ke standar':'↺','check-in portofolio':'✅',
 'dompet baru':'👛','aset':'💎','tambah langganan':'🔁','tambah pembayaran':'⏰','buku baru':'📗','duplikat':'📑','ubah/hapus':'✏️',
 'semua':'🧾','masuk':'📥','keluar':'📤','pindah':'🔁','ditandai':'⭐','foto':'📎','simpan':'💾','batal':'✖️','selesai':'✅','hapus':'🗑️',
 'akun':'👛','utang':'💳','total':'⚖️','otomatis':'🌓','gelap':'🌙','terang':'☀️','coba mode simpel':'✨','bayar sekarang':'💸'
};
const ZONES='main,#E,#D,#sh,#SM,#F,#bgl,#PT';

function setI(el,key,list){ // simpan kunci, hitung ikon sesuai mode saat ini
  const v=(isW()?list[1]:list[0])||list[0];
  if(el.getAttribute('data-vfk')!==key)el.setAttribute('data-vfk',key);
  if(el.getAttribute('data-vfi')!==v)el.setAttribute('data-vfi',v);
}
function firstText(el){for(const n of el.childNodes)if(n.nodeType===3&&n.nodeValue.trim())return n;return null}

function decHeads(root){
  root.querySelectorAll('h2,h3,.tt').forEach(h=>{
    if(h.closest('[data-vfx]'))return;
    const prev=h.querySelector(':scope > .vf-t');
    const first=prev?prev.textContent:(firstText(h)||{}).nodeValue||'';
    if(!first||EMO.test(first.trim().slice(0,3))||EMO.test(h.textContent.trim().slice(0,3)))return;
    const key=nz(first);
    const m=HEAD.find(x=>x[0].test(key));if(!m)return;
    let target=prev;
    if(!target){const tn=firstText(h);if(!tn)return;const sp=document.createElement('span');sp.className='vf-t';tn.parentNode.insertBefore(sp,tn);sp.appendChild(tn);target=sp}
    setI(target,String(HEAD.indexOf(m)),[m[1],m[2]]);
  });
}
function decDots(root){
  root.querySelectorAll('.dot').forEach(d=>{
    const t=d.textContent.trim();
    if(d.hasAttribute('data-vfc')){const c=d.getAttribute('data-vfc');const v=c==='__tf'?'🔁':catIcon(c);if(v&&d.getAttribute('data-vfi')!==v)d.setAttribute('data-vfi',v);return}
    if(!/^[A-Za-z0-9?]$/.test(t))return;
    const row=d.closest('.r,button,li,div');const sm=row&&row.querySelector('small');
    let c='';if(sm){const s=sm.textContent;c=s.indexOf('→')>-1?'__tf':s.split(' · ')[0].trim()}
    if(!c)return;
    const v=c==='__tf'?'🔁':catIcon(c);if(!v)return;
    d.setAttribute('data-vfc',c);d.setAttribute('data-vfi',v);
  });
}
function decNames(root){
  /* nama kategori / dompet pada baris tombol & chip */
  const wl=(()=>{try{return S.wallets||[]}catch(e){return []}})();
  root.querySelectorAll('button b,.ws b,button > span:first-child,.chip,button.rowb b').forEach(el=>{
    if(el.classList.contains('dot')||el.hasAttribute('data-vfx'))return;
    if(el.childElementCount>0&&!el.matches('.chip'))return;
    const raw=el.matches('.chip')?el.textContent:(el.firstChild&&el.firstChild.nodeType===3?el.firstChild.nodeValue:'');
    let txt=raw.replace(/^[•●✓]\s*/,'').replace(/\s*×\s*$/,'').trim();
    if(!txt||txt.length>40||EMO.test(txt.slice(0,3)))return;
    if(el.matches('.chip')&&el.dataset.a==='ico'&&/^•/.test(raw.trim())){ // "• Makanan" -> ikon kategori
      if(!el.querySelector('.vf-hide')&&el.firstChild&&el.firstChild.nodeType===3){
        const tn=el.firstChild,m=tn.nodeValue.match(/^(\s*•\s*)(.*)$/s);
        if(m){const h=document.createElement('span');h.className='vf-hide';h.textContent=m[1];tn.nodeValue=m[2];el.insertBefore(h,tn)}}
    }
    const w=wl.find(x=>nz(x)===nz(txt));
    if(w){const n=nz(w);const ic=/tunai|kas\b|cash|dompet/.test(n)?'💵':/bank|rekening|bca|bri|mandiri|bni/.test(n)?'🏦':/wallet|gopay|ovo|dana|shopee|linkaja/.test(n)?'📲':/kartu|kredit|card/.test(n)?'💳':/tabung/.test(n)?'🐷':'👛';
      el.setAttribute('data-vfw',txt);el.setAttribute('data-vfi',ic);return}
    if(isCat(txt)){el.setAttribute('data-vfn',txt);el.setAttribute('data-vfi',catIcon(txt))}
  });
  root.querySelectorAll('[data-vfn]').forEach(el=>{const v=catIcon(el.getAttribute('data-vfn'));if(el.getAttribute('data-vfi')!==v)el.setAttribute('data-vfi',v)});
}
function decBtns(root){
  root.querySelectorAll('button:not(.dot):not(.chip):not([data-vfi]),a.b').forEach(b=>{
    if(b.childElementCount>0||b.hasAttribute('data-vfx')||b.closest('nav'))return;
    const tn=b.firstChild;if(!tn||tn.nodeType!==3)return;
    const raw=tn.nodeValue;if(EMO.test(raw.trim().slice(0,3)))return;
    const m=raw.match(/^(\s*[+＋✎⧉‹›]\s*)?(.*?)\s*$/s);if(!m)return;
    if(m[1])return; /* tombol bertanda + / ✎ / ⧉ sudah punya penanda sendiri */
    const key=nz(m[2]);const e=BTN[key];if(!e)return;
    if(/^[‹›]$/.test(m[2]))return;
    b.setAttribute('data-vfi',e);b.setAttribute('data-vfb',key);
  });
}
function decChipsBtn(root){ /* chip teks biasa (Semua/Masuk/Keluar/dll.) */
  root.querySelectorAll('.chip:not([data-vfi]):not([data-vfx])').forEach(c=>{
    if(c.childElementCount>0)return;const t=nz(c.textContent.replace(/^[+＋✎⧉]\s*/,''));
    if(EMO.test(c.textContent.trim().slice(0,3)))return;const e=BTN[t];if(e)c.setAttribute('data-vfi',e)})
}
function decHeader(){
  const h=document.querySelector('header h1');if(h)h.setAttribute('data-vfi',isW()?'🌸':'💰');
  const p=document.querySelector('header .pill');if(p&&!p.hasAttribute('data-vfi'))p.setAttribute('data-vfi','📴');
  document.documentElement.setAttribute('data-vfm',isW()?'wanita':'pria');
}
let busy=0,pend=0;
function pass(){
  pend=0;if(busy)return;busy=1;
  try{
    decHeader();
    document.querySelectorAll(ZONES).forEach(z=>{decHeads(z);decDots(z);decNames(z);decBtns(z);decChipsBtn(z)});
  }catch(e){console.warn('vf-enh',e)}
  busy=0;
}
function sched(){if(pend)return;pend=1;requestAnimationFrame(pass)}
new MutationObserver(sched).observe(document.body,{childList:true,subtree:true});
document.addEventListener('visibilitychange',sched);
sched();

/* ---------- Pengaman input angka (nilai sangat besar) ---------- */
window.addEventListener('input',e=>{
  const t=e.target;if(!t||t.tagName!=='INPUT')return;
  try{
    if(t.id==='pa'){
      const v=t.value,nv=v.replace(/[0-9.,]+/g,m=>{const d=m.replace(/\D/g,'');return d.length>15?d.slice(0,15):m});
      if(nv!==v)t.value=nv;
    }else if(t.dataset&&(t.dataset.m!==undefined||t.dataset.money!==undefined)){
      const d=t.value.replace(/\D/g,'');
      if(d.length>15){t.value=d.slice(0,15)}
    }
  }catch(x){}
},true);
/* gambar: tolak berkas non-gambar / terlalu besar sebelum diproses agar tidak membekukan tab */
document.addEventListener('change',e=>{
  const t=e.target;if(!t||t.type!=='file'||!t.files||t.id==='imp')return;
  const bad=[...t.files].filter(f=>f.size>25*1024*1024);
  if(bad.length){e.stopImmediatePropagation();t.value='';try{toast('Foto terlalu besar (maks. 25 MB per file).')}catch(x){}}
},true);
})();
