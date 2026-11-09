
/* ================= UNIVERSAL SMART SEARCH ================= */
(function(){
'use strict';
if(window.__vfs)return;window.__vfs=1;
var NS='http://www.w3.org/2000/svg';
var $q=function(s,r){return(r||document).querySelector(s)};
var norm=function(s){return String(s==null?'':s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]+/g,' ').replace(/\s+/g,' ').trim()};
var mode=function(){try{return S&&S.settings&&S.settings.mode}catch(e){return undefined}};
var isW=function(){return mode()==='wanita'},isSM=function(){return document.body.classList.contains('sm')};
var call=function(n){var a=[].slice.call(arguments,1);try{if(typeof A==='object'&&A&&typeof A[n]==='function'){A[n].apply(A,a);return true}}catch(e){console.warn('vfs',e)}return false};
var clickSel=function(s){var b=$q(s);if(b){b.click();return true}return false};
var clickText=function(s,t){var l=[].slice.call(document.querySelectorAll(s)).filter(function(b){return norm(b.textContent).indexOf(norm(t))>-1||(window.VFC&&VFC.on&&norm(b.textContent).indexOf(norm(VFC.t(t)))>-1)})[0];if(l){l.click();return true}return false};
var openFire=function(){try{if(typeof FIRETracker==='object'){FIRETracker.open();return true}}catch(e){}return false};

/* ---- registri fitur (navigasi lintas-mode) ---- */
var REG=[
 {id:'add',e:'✏️',t:'Catat transaksi',d:'Pengeluaran, pemasukan, pindah saldo',k:'tambah catat input pengeluaran pemasukan uang keluar masuk',go:function(){return isSM()?clickSel('[data-s=add]'):isW()?call('fadd',''):clickSel('#fab')}},
 {id:'trx',e:'🧾',t:'Riwayat transaksi',d:'Cari, filter, ekspor CSV',k:'riwayat transaksi history cari filter csv ekspor mutasi',go:function(){return isSM()?clickSel('[data-s=hist]'):isW()?call('fx','trx'):call('tab','trx')},after:'transaksi'},
 {id:'bud',e:'🎯',t:'Anggaran bulanan',d:'Terpakai vs batas tiap kategori',k:'anggaran budget batas bulanan saran gaji',go:function(){return isSM()?clickSel('[data-s=bud]'):isW()?call('bul'):call('tab','bud')},after:'anggaran'},
 {id:'wlt',e:'🏦',t:'Aset, utang & piutang',d:'Kekayaan bersih, pelunasan utang',k:'aset utang piutang kekayaan emas properti saham cicilan pinjaman',go:function(){return isW()?call('fx','wlt'):call('tab','wlt')},after:'aset'},
 {id:'wallet',e:'👛',t:'Dompet & rekening',d:'Saldo tiap dompet',k:'dompet rekening saldo kas bank e-wallet',go:function(){return isW()?call('fgo','dompet'):call('tab','wlt')},after:'dompet'},
 {id:'ana',e:'📊',t:'Analisis & diagram',d:'Donat kategori, tren harian',k:'analisis diagram grafik donat tren kategori statistik',go:function(){return isSM()?clickText('#SM button','Cerita'):isW()?call('fgo','analisis'):call('tab','home')},after:'kategori'},
 {id:'fire',e:'🔥',t:'F.I.R.E Tracker',d:'Kebebasan finansial & pensiun dini',k:'fire financial independence retire early pensiun dini swr 4 inflasi bunga berbunga proyeksi rebahan',go:openFire},
 {id:'set',e:'⚙️',t:'Pengaturan & cadangan',d:'Ekspor, impor, hapus data',k:'pengaturan setting cadangan backup ekspor impor hapus data kategori',go:function(){return isW()?call('fgo','lebih'):isSM()?clickText('#SM button','Akun'):call('tab','more')},after:'cadangan'},
 {id:'mode',e:'🎀',t:'Ganti mode tampilan',d:'Pria · Wanita · Simpel (Gen-Z)',k:'mode tampilan tema pria wanita simpel gen z ganti',go:function(){return isW()?call('pick'):call('tab','more')},after:'mode tampilan'},
 {id:'stmt',e:'🏦',t:'Rekening koran / mutasi',d:'Impor PDF, CSV, atau gambar mutasi bank & e-wallet',k:'rekening koran mutasi impor pdf csv bank ewallet bca mandiri gopay ovo dana seabank statement',go:function(){return call('smstmt')}},
 {id:'paste',e:'📋',t:'Tempel teks mutasi',d:'Salin teks dari m-banking lalu tempel',k:'tempel paste teks mutasi salin m-banking e-statement',go:function(){return call('smpaste')}},
 {id:'quick',e:'⚡',t:'Catat cepat',d:'Ketik “kopi 18rb” → otomatis tercatat',k:'catat cepat ketik kalimat kopi 18rb natural otomatis',go:function(){return call('smquick')}},
 {id:'split',e:'🍻',t:'Split bill',d:'Patungan & bagi tagihan, kirim ke WhatsApp',k:'split bill patungan bagi tagihan makan bareng teman whatsapp',go:function(){return call('smsplit')}},
 {id:'xfer',e:'🔁',t:'Pindah saldo',d:'Pindahkan uang antar dompet',k:'pindah saldo transfer antar dompet rekening',go:function(){return call('smxfer')}},
 {id:'pocket',e:'🎯',t:'Kantong & target tabungan',d:'Wishlist, tenggat & saran nabung per minggu',k:'kantong pocket target tabungan wishlist tujuan nabung tenggat impian',go:function(){return isSM()?clickText('#SM button','Target'):call('smkantong')}},
 {id:'jajan',e:'💸',t:'Batas jajan & streak',d:'Maskot, bar jajan bulanan, streak mencatat',k:'batas jajan bulanan streak maskot hemat budget harian mencatat',go:function(){return isSM()?clickText('#SM button','Beranda'):call('smjajan')}},
 {id:'badge',e:'🏅',t:'Lencana & cerita bulanan',d:'Kalkulator FOMO, lencana, ringkasan per kategori',k:'lencana badge fomo cerita bulanan kopi impulsif paylater pencapaian achievement',go:function(){return isSM()?clickText('#SM button','Cerita'):call('smlencana')}},
 {id:'roast',e:'🔥',t:'Roast My Spending',d:'Wrapped bulananmu, siap dibagikan',k:'roast wrapped bagikan gambar share story pengeluaran lucu',go:function(){return call('smroast')}},
 {id:'files',e:'📄',t:'Berkas mutasi diunggah',d:'Kelola & hapus berkas impor',k:'berkas mutasi unggah hapus impor file kelola',go:function(){return isSM()?clickText('#SM button','Akun'):call('smberkas')}},
 {id:'hub',e:'✨',t:'Semua fitur Mode Simpel',d:'Mutasi, split bill, kantong, lencana, dll',k:'fitur simpel semua mode gen z ringkas daftar',go:function(){return isSM()?clickText('#SM button','Beranda'):call('smhub')}},
 {id:'kal',e:'📅',t:'Kalender',d:'Lihat transaksi per tanggal',k:'kalender calendar tanggal harian hari bulan agenda jadwal',go:function(){return call('smgo','kal')}},
 {id:'diag',e:'🍩',t:'Diagram',d:'Grafik pengeluaran & pemasukan',k:'diagram grafik chart donat pie batang statistik visual',go:function(){return call('smgo','diag')}},
 {id:'ring',e:'🗒️',t:'Ringkasan bulanan',d:'Rekap masuk, keluar & selisih per bulan',k:'ringkasan bulanan rekap laporan summary bulan masuk keluar selisih',go:function(){return call('smgo','ring')}},
 {id:'langg',e:'🔔',t:'Langganan',d:'Netflix, Spotify, dll per bulan/tahun',k:'langganan subscription netflix spotify youtube bulanan tahunan berlangganan',go:function(){return call('smgo','langg')}},
 {id:'jad',e:'⏰',t:'Pembayaran terjadwal',d:'Tagihan berulang & pengingat',k:'pembayaran terjadwal tagihan berulang pengingat cicilan jatuh tempo reminder',go:function(){return call('smgo','jad')}},
 {id:'wawas',e:'💡',t:'Wawasan',d:'Insight kebiasaan keuanganmu',k:'wawasan insight analisis kebiasaan saran tips pola belanja',go:function(){return call('smgo','wawas')}},
 {id:'tema',e:'🎨',t:'Kustomisasi',d:'Ikon emoji & warna aksen',k:'kustomisasi tema ikon emoji warna aksen tampilan dekorasi gelap terang',go:function(){return call('smgo','tema')}},
 {id:'goal',e:'🌱',t:'Target tabungan baru',d:'Buat tujuan menabung',k:'target tujuan tabungan baru dana darurat nabung goal impian',go:function(){return call('goaladd')}},
 {id:'debt',e:'🧾',t:'Tambah utang / piutang',d:'Catat pinjaman & cicilan',k:'tambah utang piutang pinjaman cicilan hutang catat',go:function(){return call('debtadd')}},
 {id:'asset',e:'🏠',t:'Tambah aset',d:'Emas, properti, investasi',k:'tambah aset emas properti saham investasi kekayaan',go:function(){return call('assetadd')}},
 {id:'ncat',e:'🏷️',t:'Kategori baru',d:'Tambah kategori + ikon',k:'kategori baru tambah ikon label jenis pengeluaran',go:function(){return call('ncat')}},
 {id:'month',e:'🗓️',t:'Pilih bulan',d:'Pindah ke bulan lain',k:'pilih bulan ganti periode bulan lalu bulan depan tahun',go:function(){return isW()?call('fmonth'):call('smgo','kal')}},
 {id:'diary',e:'📔',t:'Diary / buku baru',d:'Buat Financial Diary baru',k:'diary buku baru financial diary tambah usaha liburan',go:function(){return isW()?call('fnewbk'):call('smgo','smhub')}},
 {id:'rename',e:'✏️',t:'Ubah nama diary',d:'Ganti nama Financial Diary',k:'ubah nama diary buku ganti rename financial',go:function(){return isW()?call('frename'):false}},
 {id:'dup',e:'⧉',t:'Duplikat diary',d:'Salin diary beserta isinya',k:'duplikat diary buku salin copy gandakan',go:function(){return isW()?call('fdupbk'):false}},
 {id:'hide',e:'👁️',t:'Sembunyikan saldo',d:'Samarkan nominal di layar',k:'sembunyikan saldo mata privasi samarkan nominal hide',go:function(){return isW()?call('fhide'):false}},
 {id:'detail',e:'📋',t:'Mode Detail',d:'Tampilan lengkap semua fitur',k:'mode detail lengkap tampilan semua fitur pindah',go:function(){return isSM()?call('smgo','smhub'):call('fall')}},
 {id:'lang',e:'🌐',t:'Language / Bahasa',d:'Indonesia · English · mata uang / currency',k:'language bahasa english inggris indonesia currency mata uang idr rupiah usd sgd gbp aud twd ntd nt taiwan myr rm ringgit malaysia jpy yen jepang japan hkd hongkong hong kong translate terjemah',go:function(){if(window.VFC){VFC.open();return true}return false}}
];
if(window.VFC&&VFC.en)REG.forEach(function(r){try{r.k=(r.k||'')+' '+VFC.t(r.t+' '+r.d).toLowerCase()}catch(e){}});

/* ---- auto-index: beri data-search-tags pada kontainer fitur yang dirender dinamis ---- */
var STAMP='section.c,#F .fc,#F .fgl,#F .fti,#F .fsimp,#F .fqs button,.f27-rb,#SM .tl,#SM .bud,#SM .hero,#nav button,#F .fn button,#F .fml button,.fe-pill';
var st=0;
function stamp(){st=0;try{document.querySelectorAll(STAMP).forEach(function(el){
  if(el.closest('#vfs')||el.hasAttribute('data-search-tags'))return;
  var h=el.querySelector('h1,h2,h3,b,strong'),t=(h&&h.textContent||el.getAttribute('aria-label')||el.textContent||'').replace(/\s+/g,' ').trim().slice(0,60);
  if(!t)return;el.setAttribute('data-search-title',t);el.setAttribute('data-search-tags',norm((el.textContent||'').slice(0,220)));
})}catch(e){console.warn('vfs stamp',e)}}
var sched=function(){if(!st){st=setTimeout(stamp,250)}};

/* ---- fuzzy ---- */
function lev(a,b,max){if(Math.abs(a.length-b.length)>max)return max+1;var p=[],i,j;for(j=0;j<=b.length;j++)p.push(j);
 for(i=1;i<=a.length;i++){var c=[i],m=i;for(j=1;j<=b.length;j++){var v=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));c.push(v);if(v<m)m=v}if(m>max)return max+1;p=c}return p[b.length]}
function subseq(t,s){var i=0;for(var j=0;j<s.length&&i<t.length;j++)if(s[j]===t[i])i++;return i===t.length}
function score(qt,e){var tot=0;for(var n=0;n<qt.length;n++){var t=qt[n],b=0;
  if(e.n.indexOf(t)===0)b=100;else if(e.n.indexOf(t)>-1)b=80;
  for(var i=0;i<e.w.length;i++){var w=e.w[i];
   if(w===t)b=Math.max(b,90);else if(w.indexOf(t)===0)b=Math.max(b,70);else if(t.length>=3&&w.indexOf(t)>-1)b=Math.max(b,45);
   else if(t.length>=4){var mx=t.length>6?2:1,d=lev(t,w.slice(0,t.length+1),mx);if(d<=mx)b=Math.max(b,42-d*8)}}
  if(!b&&t.length>=3&&subseq(t,e.n))b=18;
  if(!b)return 0;tot+=b}return tot/qt.length}

/* ---- kumpulkan kandidat ---- */
function pool(){var out=[];
 REG.forEach(function(r){out.push({src:'reg',r:r,n:norm(r.t),w:norm(r.t+' '+r.k+' '+r.d).split(' '),bonus:r.sm&&!isSM()?-10:0})});
 document.querySelectorAll('[data-search-tags]').forEach(function(el){
  if(el.closest('#vfs')||el.hidden||!el.getClientRects().length)return;
  var t=el.getAttribute('data-search-title')||el.getAttribute('aria-label')||(el.textContent||'').trim().slice(0,50);
  out.push({src:'dom',el:el,t:t,n:norm(t),w:norm(el.getAttribute('data-search-tags')).split(' '),bonus:-5})});
 return out}

/* ---- pulse + scroll ---- */
var pt=0,pe=null;
function pulse(el){if(!el||!el.isConnected)return;try{if(pe)pe.classList.remove('vfs-pulse')}catch(e){}clearTimeout(pt);
 el.scrollIntoView({behavior:'smooth',block:'center'});void el.offsetWidth;el.classList.add('vfs-pulse');pe=el;
 pt=setTimeout(function(){el.classList.remove('vfs-pulse');pe=null},1900)}
function findAfter(txt){var k=norm(txt),c=[].slice.call(document.querySelectorAll('[data-search-tags]')).filter(function(e){return !e.closest('#vfs')&&norm(e.getAttribute('data-search-tags')+' '+(e.getAttribute('data-search-title')||'')).indexOf(k)>-1});return c[0]||null}
function waitFor(fn,tries,cb){var i=0;(function tick(){stamp();var r=fn();if(r)return cb(r);if(++i<tries)setTimeout(tick,90)})()}

function choose(item){close();
 if(item.src==='dom'){pulse(item.el);return}
 var r=item.r,ok=false;try{ok=r.go()}catch(e){console.warn('vfs go',e)}
 if(r.sm&&!isSM()){waitFor(function(){return findAfter(r.after)},10,pulse);try{toast('Fitur ini ada di Mode Simpel ✨')}catch(e){}return}
 if(r.after)waitFor(function(){return findAfter(r.after)},12,pulse)}

/* ---- UI (dibangun sekali; satu listener per elemen → tidak bocor saat re-render) ---- */
var root,inp,list,btn,sel=-1,items=[],last=null,built=false;
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function icon(){var s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');var c=document.createElementNS(NS,'circle');c.setAttribute('cx',11);c.setAttribute('cy',11);c.setAttribute('r',7);var p=document.createElementNS(NS,'path');p.setAttribute('d','M20 20l-3.5-3.5');s.append(c,p);return s}
function build(){
 btn=el('button','');btn.id='vfs-btn';btn.type='button';btn.setAttribute('aria-label','Cari fitur (Ctrl+K)');btn.setAttribute('data-search-tags','cari pencarian search temukan fitur');btn.append(icon());
 root=el('div','');root.id='vfs';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Pencarian');
 var p=el('div','vfs-p'),row=el('div','vfs-i');inp=el('input','');inp.type='search';inp.placeholder='Cari fitur… (mis. "anggran", "split", "fire")';inp.setAttribute('autocomplete','off');inp.setAttribute('enterkeyhint','go');inp.setAttribute('role','combobox');inp.setAttribute('aria-controls','vfs-l');inp.setAttribute('aria-expanded','true');
 var cl=el('button','','✕');cl.type='button';cl.setAttribute('aria-label','Tutup');cl.dataset.x='1';
 row.append(icon(),inp,el('kbd','','Esc'),cl);list=el('ul','vfs-l');list.id='vfs-l';list.setAttribute('role','listbox');
 p.append(row,list,el('div','vfs-f','↑↓ pilih · Enter buka · Ctrl/⌘+K buka cepat'));root.append(p);
 document.body.append(btn,root);
 btn.addEventListener('click',open);
 root.addEventListener('mousedown',function(e){if(e.target===root)close()});
 root.addEventListener('click',function(e){if(e.target.closest('[data-x]'))return close();var li=e.target.closest('.vfs-r');if(li)choose(items[+li.dataset.i])});
 list.addEventListener('mousemove',function(e){var li=e.target.closest('.vfs-r');if(li&&+li.dataset.i!==sel)mark(+li.dataset.i)});
 inp.addEventListener('input',run);
 built=true}
function hi(txt,q){var f=el('span','');var n=norm(txt),t=q.split(' ').filter(Boolean)[0];var i=t?txt.toLowerCase().indexOf(t):-1;
 if(i<0){f.textContent=txt;return f}f.append(document.createTextNode(txt.slice(0,i)));var m=el('mark','',txt.slice(i,i+t.length));f.append(m,document.createTextNode(txt.slice(i+t.length)));return f}
function mark(i){sel=i;[].forEach.call(list.children,function(li){if(li.dataset.i===undefined)return;var on=+li.dataset.i===i;li.setAttribute('aria-selected',on);if(on){inp.setAttribute('aria-activedescendant',li.id);li.scrollIntoView({block:'nearest'})}})}
function run(){var q=norm(inp.value),qt=q.split(' ').filter(Boolean),P=pool(),res;
 if(!qt.length){res=P.filter(function(x){return x.src==='reg'&&!(x.r.sm&&!isSM())}).slice(0,7).map(function(x){return{x:x,s:0}})}
 else res=P.map(function(x){return{x:x,s:score(qt,x)+(x.bonus||0)}}).filter(function(o){return o.s>0}).sort(function(a,b){return b.s-a.s}).slice(0,9);
 list.replaceChildren();items=[];
 if(!res.length){list.append(el('li','vfs-n','Tidak ketemu 🔎 Coba kata lain, mis. "utang", "kalender", "fire".'));sel=-1;return}
 list.append(el('li','vfs-g',qt.length?'Hasil':'Pintasan'));
 res.forEach(function(o,i){var x=o.x,li=el('li','vfs-r');li.id='vfs-o'+i;li.dataset.i=i;li.setAttribute('role','option');
  var t=el('div','vfs-t'),b=el('b');b.append(hi(x.src==='reg'?x.r.t:x.t,q));t.append(b,el('small','',x.src==='reg'?x.r.d:'Ada di layar ini'));
  li.append(el('span','vfs-e',x.src==='reg'?x.r.e:'📍'),t);if(x.src==='reg'&&x.r.sm)li.append(el('span','vfs-b','Simpel'));
  items.push(x);list.append(li)});mark(0)}
function open(){if(!built)build();if(root.classList.contains('on'))return;stamp();last=document.activeElement;root.classList.add('on');document.body.style.overflow='hidden';inp.value='';run();setTimeout(function(){inp.focus()},30)}
function close(){if(!root||!root.classList.contains('on'))return;root.classList.remove('on');document.body.style.overflow='';if(last&&last.focus&&document.contains(last))try{last.focus()}catch(e){}}
document.addEventListener('keydown',function(e){
 var k=e.key,typing=/^(INPUT|TEXTAREA|SELECT)$/.test((e.target&&e.target.tagName)||'')||(e.target&&e.target.isContentEditable);
 if((e.ctrlKey||e.metaKey)&&String(k).toLowerCase()==='k'){e.preventDefault();root&&root.classList.contains('on')?close():open();return}
 if(k==='/'&&!typing&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!(root&&root.classList.contains('on'))){e.preventDefault();open();return}
 if(!root||!root.classList.contains('on'))return;
 if(k==='Escape'){e.preventDefault();e.stopPropagation();close()}
 else if(k==='ArrowDown'){e.preventDefault();if(items.length)mark((sel+1)%items.length)}
 else if(k==='ArrowUp'){e.preventDefault();if(items.length)mark((sel-1+items.length)%items.length)}
 else if(k==='Enter'){e.preventDefault();if(items[sel])choose(items[sel])}
 else if(k==='Tab'){e.preventDefault();inp.focus()}
},true);
function boot(){try{build();new MutationObserver(sched).observe(document.body,{childList:true,subtree:true});stamp();window.VFSearch={open:open,close:close,reindex:stamp}}catch(e){console.warn('vfs boot',e)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
