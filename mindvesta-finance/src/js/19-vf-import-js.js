
/* MODUL IMPOR REKENING KORAN — pemrosesan PDF/CSV/TXT */
(function(){
'use strict';
const $=(s,r)=>(r||document).querySelector(s);
const E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rp=n=>'Rp '+new Intl.NumberFormat('id-ID').format(Math.round(n||0));
const iso=d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const nid=()=>{const n=Math.max(Date.now(),(nid.l||0)+1);nid.l=n;return n};
const SS=()=>typeof S!=='undefined'?S:{transactions:[],wallets:['Kas Tunai'],catExp:[],catInc:[]};
const tst=m=>{try{toast(m)}catch(e){alert(m)}};
/* ---------- angka & tanggal (format Indonesia) ---------- */
function pn(s){s=String(s||'').replace(/rp\.?|idr/ig,'').replace(/[^\d.,]/g,'');if(!s)return 0;const m=s.match(/[.,](\d{1,2})$/);
 if(m&&(/[.,]\d{3}/.test(s.slice(0,-m[0].length))||(m[1].length===2&&!/[.,]/.test(s.slice(0,-3)))))s=s.slice(0,-m[0].length);return +s.replace(/[.,]/g,'')||0}
const AMT=/(^|[^\d.,\/:-])(?:rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?|\d{4,9})(?![\d\/:-]|[.,]\d)/gi;
const amts=l=>{const o=[];let m;AMT.lastIndex=0;while((m=AMT.exec(l)))o.push(pn(m[2]));return o.filter(v=>v>0)};
const MON={jan:1,feb:2,mar:3,apr:4,mei:5,may:5,jun:6,jul:7,agu:8,aug:8,ags:8,sep:9,okt:10,oct:10,nov:11,des:12,dec:12};
function fdate(t){let m,y,mo,d;
 if(m=t.match(/\b(20\d\d)[-\/](\d{1,2})[-\/](\d{1,2})\b/)){y=+m[1];mo=+m[2];d=+m[3]}
 else if(m=t.match(/\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](20\d\d|\d\d)\b/)){d=+m[1];mo=+m[2];y=+m[3];if(y<100)y+=2000}
 else if(m=t.match(/\b(\d{1,2})\s+([A-Za-z]{3,9})\.?,?\s+(20\d\d)\b/)){const k=MON[m[2].slice(0,3).toLowerCase()];if(!k)return '';d=+m[1];mo=k;y=+m[3]}
 else return '';
 const x=new Date(y,mo-1,d);if(x.getFullYear()!==y||x.getMonth()!==mo-1||x.getDate()!==d)return '';
 return y+'-'+String(mo).padStart(2,'0')+'-'+String(d).padStart(2,'0')}
const dd=(a,b)=>Math.abs(Date.parse(a+'T12:00')-Date.parse(b+'T12:00'))/864e5;
/* ---------- kategori & dompet ---------- */
const CATK=[[/makan|minum|kopi|resto|warung|bakso|nasi|ayam|gofood|grabfood|dimsum|roti|snack|cafe|kafe|mie |es teh|sirup|susu/,/makan|jajan|kopi|food/i],
[/indomaret|alfamart|superindo|hypermart|supermarket|sayur|minimarket|pasar|sabun|deterjen|tisu/,/dapur|rumah|belanja/i],
[/grab|gojek|ojek|bensin|pertamina|shell|parkir|tol|kereta|krl|transj|taksi|bluebird/,/transport/i],
[/apotek|apotik|kimia farma|guardian|klinik|rumah sakit|dokter|obat|vitamin|halodoc/,/kesehat/i],
[/pln|listrik|pdam|indihome|telkom|pulsa|paket data|bpjs|cicilan|tagihan|token/,/tagihan|listrik|pulsa|utilitas/i],
[/netflix|spotify|bioskop|cgv|xxi|game|steam|youtube|disney/,/hiburan|langgan/i],
[/baju|kaos|celana|sepatu|fashion|uniqlo|zara|hijab|jilbab|dress|jaket/,/pakaian|belanja|pribadi/i],
[/charger|kabel|earphone|headset|laptop|mouse|keyboard|powerbank|flashdisk|elektronik/,/elektronik|belanja|pribadi/i]];
function pickCat(desc,type,fb){const L=(type==='income'?SS().catInc:SS().catExp)||[],x=' '+String(desc).toLowerCase()+' ';
 for(const[r,t]of CATK){if(r.test(x)){const m=L.find(c=>t.test(c));if(m)return m}}
 return (fb&&L.find(c=>fb.test(c)))||L.find(c=>/lain/i.test(c))||L[L.length-1]||'Lainnya'}
const WB=[['bca','BCA'],['mandiri','Mandiri'],['bri','BRI'],['bni','BNI'],['gopay','GoPay'],['ovo','OVO'],['dana','DANA'],['shopeepay','ShopeePay'],['seabank','SeaBank'],['jago','Jago'],['jenius','Jenius'],['blu','blu']];
function findWallet(text,kind){const W=SS().wallets,x=String(text).toLowerCase();
 let best=W.find(w=>w&&x.includes(String(w).toLowerCase()));if(best)return best;
 for(const[k,n]of WB){if(new RegExp('\\b'+k+'\\b').test(x)){const w=W.find(w=>String(w).toLowerCase().includes(k))||W.find(w=>(/^(gopay|ovo|dana|shopeepay)$/.test(k)?/e-?wallet|dompet digital|digital/i:/rekening|bank|tabungan/i).test(w));if(w)return w}}
 return (kind==='mutasi'&&W.find(w=>/rekening|bank/i.test(w)))||W[0]}
function stmtRows(text,src){
 const P=window.VFS&&VFS.parseStmt;if(!P)throw new Error('Parser mutasi bawaan tidak ditemukan.');
 const p=P(text),w=findWallet((p.bank||'')+' '+String(text).slice(0,400),'mutasi'),bad=p.recon&&p.recon.ok===false;
 return (p.rows||[]).map(r=>{const fl=[];if(r.flag)fl.push(r.flag);if(bad)fl.push('Saldo tidak cocok dengan mutasi — cek baris');
  return {kind:'mutasi',src,date:r.date||iso(),amount:+r.amount||0,type:r.type==='income'?'income':'expense',wallet:w,ref:'',flags:fl,desc:r.desc||'Mutasi',
   cat:r.cat||pickCat(r.desc,r.type),on:r.on!==false&&r.amount>0&&!bad,conf:Math.max(30,90-fl.length*20)}})}
/* ---------- pasca-proses: transfer sendiri, duplikat, rekonsiliasi ---------- */
const TRX=/transfer|pindah|top\s?-?up|isi\s*saldo|tarik\s*tunai|setor|antar\s*(rekening|bank)/i;
function post(rows){const W=SS().wallets,T=SS().transactions;
 rows.forEach(r=>{ // transfer antar rekening/e-wallet milik sendiri
  if(r.type==='transfer'||!TRX.test(r.desc))return;
  const to=W.find(w=>w!==r.wallet&&new RegExp('\\b'+String(w).toLowerCase().replace(/[^a-z0-9 ]/g,'.')+'\\b').test(r.desc.toLowerCase()));
  if(to&&r.type==='expense'){r.type='transfer';r.toWallet=to;r.cat='Transfer';r.flags.push('Transfer antar rekening sendiri — bukan pengeluaran/pemasukan')}});
 rows.forEach((a,i)=>{ // pasangan debit-kredit dari dua mutasi yang sama = satu transfer
  if(a.type!=='expense'||!TRX.test(a.desc))return;
  rows.forEach((b,j)=>{if(j===i||b.type!=='income'||!b.on||!a.on||b.amount!==a.amount||dd(a.date,b.date)>1||!TRX.test(b.desc)||a.wallet===b.wallet)return;
   a.type='transfer';a.toWallet=b.wallet;a.cat='Transfer';a.flags.push('Pasangan debit–kredit digabung jadi satu transfer');b.on=false;b.flags.push('Bagian dari transfer yang sama — tidak dicatat dua kali')})});
 const pr={mutasi:0};
 rows.forEach((a,i)=>rows.forEach((b,j)=>{ // rekonsiliasi lintas sumber
  if(j<=i||a.kind===b.kind||a.type!=='expense'||b.type!=='expense'||!a.on||!b.on||a.amount!==b.amount||dd(a.date,b.date)>3)return;
  const[k,d]=(pr[a.kind]||0)>=(pr[b.kind]||0)?[a,b]:[b,a];d.on=false;d.flags.push('Sama dengan «'+k.desc.slice(0,30)+'» ('+k.kind+') — direkonsiliasi, tidak dihitung dobel');
  if(!k.wallet||k.kind==='market')k.wallet=d.wallet||k.wallet}));
 const seen={};rows.forEach(r=>{const k=r.type+'|'+r.amount+'|'+r.date+'|'+(r.ref||r.desc.toLowerCase().slice(0,12));
  if(seen[k]&&r.on){r.on=false;r.flags.push('Duplikat dalam proses scan ini')}seen[k]=1;
  const hit=T.find(t=>(+t.amount===r.amount)&&t.type===r.type&&t.isoDate&&dd(t.isoDate,r.date)<=1);
  if(hit){const strong=(r.ref&&hit.ref===r.ref)||(hit.isoDate===r.date&&hit.wallet===r.wallet);
   r.flags.push(strong?'Sudah tercatat sebelumnya — dilewati':'Mirip transaksi yang sudah ada ('+E(hit.note||hit.category)+') — cek duplikat');
   if(strong)r.on=false;r.conf=Math.min(r.conf,strong?40:60)}});
 rows.forEach(r=>{if(r.conf<50&&r.on&&!r.flags.some(f=>/dilewati|DIBATALKAN/.test(f)))r.on=false;r.id=++post.n;r.on=!!r.on});return rows}
post.n=0;
/* ---------- baca berkas ---------- */
const lib=u=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=()=>no(new Error('Butuh internet sekali untuk memuat mesin pembaca.'));document.head.appendChild(s)});
async function readFile(f,busy){
 if(/\.csv$|\.txt$|text\//i.test(f.name+f.type))return f.text();
 if(!window.VFX||!VFX.ready)throw new Error('Mesin pembaca belum siap. Muat ulang halaman, lalu coba lagi.');
 const ctx={busy,lib,askPw:()=>Promise.resolve(prompt('PDF terkunci. Masukkan password (BCA biasanya DDMMYYYY):'))};
 const t=/pdf/i.test(f.type)||/\.pdf$/i.test(f.name)?await VFX.pdf(f,ctx):await VFX.ocr(f,ctx);
 const s=typeof t==='string'?t:(t&&t.text)||'';return window.VFS&&VFS.ocrFix?VFS.ocrFix(s):s}
async function scanOne(f,kind,busy){
 if(kind!=='mutasi'||(!/\.(pdf|csv|txt)$/i.test(f.name||'')&&!/^(application\/pdf|text\/csv|text\/plain)$/i.test(f.type||'')))throw new Error('Hanya file PDF, CSV, atau TXT yang didukung untuk impor rekening koran.');
 const text=await readFile(f,busy);
 if(String(text).replace(/\s/g,'').length<25)throw new Error('Teks hampir tidak terbaca — file kosong atau teks tidak terbaca. Periksa PDF/CSV/TXT yang dipilih.');
 busy('Menganalisis…');let rows;
 if(kind!=='mutasi')throw new Error('Jenis impor tidak tersedia.');
 rows=stmtRows(text,f.name);
 if(!rows.length)throw new Error('Tidak ada transaksi yang dikenali. Periksa format dan isi file mutasi.');
 return{rows,text}}
/* ---------- tampilan ---------- */
const MENU=[['mutasi','🏦','Impor Rekening Koran','PDF, CSV, atau teks mutasi']];
const ST={kind:'mutasi',files:[],rows:[],log:[],texts:{},busy:false,open:false};
let root;
function ensure(){if(root)return root;root=document.createElement('div');root.id='vf-import-statement';root.setAttribute('role','dialog');root.setAttribute('aria-label','Impor Rekening Koran');document.body.appendChild(root);
 root.addEventListener('click',onClick);root.addEventListener('change',onChange);root.addEventListener('input',onInput);
 root.addEventListener('dragover',e=>e.preventDefault());root.addEventListener('drop',e=>{e.preventDefault();if(e.dataTransfer&&e.dataTransfer.files.length)run([...e.dataTransfer.files])});return root}
function theme(){const c=(getComputedStyle(document.body).backgroundColor.match(/\d+/g)||[255,255,255]).map(Number);root.dataset.th=(.299*c[0]+.587*c[1]+.114*c[2])<110?'d':'l'}
function pick(){const i=$('#ssf',root);if(i)try{i.click()}catch(e){}}
function open(kind,auto){if(kind&&kind!=='mutasi')return;ensure();ST.kind='mutasi';ST.open=true;theme();root.classList.add('ssxon');document.documentElement.style.overflow='hidden';draw();if(auto)pick()}
function close(){if(ST.busy&&!confirm('Proses scan masih berjalan. Tutup?'))return;ST.open=false;root.classList.remove('ssxon');document.documentElement.style.overflow='';}
function opts(a,cur){return a.map(x=>'<option'+(x===cur?' selected':'')+'>'+E(x)+'</option>').join('')}
function row(r,i){const C=r.type==='income'?SS().catInc:SS().catExp,W=SS().wallets,cl=r.conf>=80?'ssxhi':r.conf>=55?'ssxmd':'ssxlo';
 return '<div class="ssxrw'+(r.on?'':' ssxoff')+'" data-i="'+i+'"><div class="ssxrh"><label class="ssxck"><input type="checkbox" data-k="on"'+(r.on?' checked':'')+'><span>Simpan</span></label><span class="ssxcf '+cl+'">Yakin '+Math.round(r.conf)+'%</span><span class="ssxsr">'+E(r.src)+'</span><button class="ssxx" data-k="del" aria-label="Hapus baris">🗑</button></div>'
 +'<input class="ssxds" data-k="desc" value="'+E(r.desc)+'" maxlength="90" aria-label="Keterangan">'
 +'<div class="ssxg"><label>Tanggal<input type="date" data-k="date" value="'+E(r.date)+'"></label><label>Nominal (Rp)<input data-k="amount" inputmode="numeric" value="'+new Intl.NumberFormat('id-ID').format(r.amount||0)+'"></label>'
 +'<label>Jenis<select data-k="type"><option value="expense"'+(r.type==='expense'?' selected':'')+'>Pengeluaran</option><option value="income"'+(r.type==='income'?' selected':'')+'>Pemasukan</option><option value="transfer"'+(r.type==='transfer'?' selected':'')+'>Transfer sendiri</option></select></label>'
 +(r.type==='transfer'?'<label>Ke dompet<select data-k="toWallet">'+opts(W.filter(w=>w!==r.wallet),r.toWallet)+'</select></label>':'<label>Kategori<select data-k="cat">'+opts(C.includes(r.cat)?C:[r.cat,...C],r.cat)+'</select></label>')
 +'<label>'+(r.type==='transfer'?'Dari dompet':'Dompet')+'<select data-k="wallet">'+opts(W,r.wallet)+'</select></label></div>'
 +(r.flags.length?'<ul class="ssxfl">'+r.flags.map(f=>'<li>⚠ '+E(f)+'</li>').join('')+'</ul>':'')+'</div>'}
function sum(){const on=ST.rows.filter(r=>r.on&&r.amount>0),o=on.filter(r=>r.type==='expense').reduce((s,r)=>s+r.amount,0),m=on.filter(r=>r.type==='income').reduce((s,r)=>s+r.amount,0);
 return{n:on.length,o,m,t:on.filter(r=>r.type==='transfer').length,w:ST.rows.filter(r=>r.conf<80||r.flags.length).length}}
function draw(){const k=ST.kind,mm=MENU.find(m=>m[0]===k),s=sum();
 root.innerHTML='<div class="ssxss"><div class="ssxhd"><div><div class="ssxti">🏦 IMPOR REKENING KORAN</div><p>Impor dan periksa transaksi mutasi bank sebelum disimpan.</p></div><button class="ssxx" data-a="close" aria-label="Tutup">✕</button></div>'
 +'<div class="ssxmn">'+MENU.map(m=>'<button data-a="menu" data-v="'+m[0]+'" class="'+(m[0]===k?'ssxon':'')+'"'+(ST.busy?' disabled':'')+'><b>'+m[1]+' '+m[2]+'</b><small>'+m[3]+'</small></button>').join('')+'</div>'
 +'<div class="ssxdz"><p><b>'+mm[2]+'</b> — pilih beberapa file sekaligus.</p><div class="ssxbt"><label class="ssxb ssxp">📁 Pilih berkas<input type="file" id="ssf" multiple accept="'+'.pdf,.csv,.txt'+'" style="display:none"></label>'
 +'</div>'
 +'<small>File PDF, CSV, atau teks diproses untuk membaca mutasi. Periksa hasilnya sebelum menyimpan.</small></div>'
 +(ST.log.length?'<ul class="ssxlg">'+ST.log.map(l=>'<li class="ssx'+l.s+'">'+({w:'⏳',r:'🔎',ok:'✅',er:'⚠️'}[l.s])+' <b>'+E(l.n)+'</b> — <span class="ssxmg">'+E(l.m)+'</span>'+(ST.texts[l.n]?'<details><summary>Lihat teks hasil baca</summary><pre>'+E(ST.texts[l.n])+'</pre></details>':'')+'</li>').join('')+'</ul>':'')
 +(ST.rows.length?'<div class="ssxrs"><div class="ssxsm"><b>'+ST.rows.length+' transaksi terbaca</b><span>Dipilih '+s.n+' · Keluar '+rp(s.o)+' · Masuk '+rp(s.m)+(s.t?' · Transfer '+s.t:'')+'</span>'+(s.w?'<span class="ssxwn">'+s.w+' baris perlu dicek</span>':'')+'</div>'
  +'<div class="ssxbt"><button class="ssxb" data-a="all">Pilih semua</button><button class="ssxb" data-a="none">Kosongkan</button></div><div id="ssr">'+ST.rows.map(row).join('')+'</div>'
  +'<div class="ssxft"><button class="ssxb" data-a="rescan"'+(ST.busy||!ST.files.length?' disabled':'')+'>↻ Scan Ulang</button><button class="ssxb" data-a="close">Batalkan</button><button class="ssxb ssxp" data-a="save"'+(s.n?'':' disabled')+'>Simpan '+s.n+' Transaksi</button></div></div>':'')
 +'</div>';
 const f=$('#ssf',root),c=$('#ssc',root);[f,c].forEach(i=>i&&(i.onchange=()=>{const a=[...i.files];i.value='';if(a.length)run(a)}))}
async function run(files){if(ST.busy)return tst('Masih memproses berkas sebelumnya…');
 ST.files=files;ST.busy=true;ST.rows=[];ST.log=files.map(f=>({n:f.name,s:'w',m:'antre'}));ST.texts={};draw();let all=[];
 for(let i=0;i<files.length;i++){const f=files[i],lg=ST.log[i];lg.s='r';lg.m='membaca…';draw();
  try{const r=await scanOne(f,ST.kind,m=>{lg.m=String(m||'').slice(0,60);const e=$('.ssxlg li.ssxr .ssxmg',root);if(e)e.textContent=lg.m});
   all=all.concat(r.rows);ST.texts[f.name]=r.text;lg.s='ok';lg.m=r.rows.length+' transaksi'}
  catch(e){lg.s='er';lg.m=(e&&e.message)||'Gagal membaca berkas.'}draw()}
 ST.rows=post(all);ST.busy=false;draw();const el=$('.ssxrs',root);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
 if(!ST.rows.length)tst('Tidak ada transaksi yang berhasil dibaca.')}
function onClick(e){const b=e.target.closest('[data-a],[data-k="del"]');if(!b)return;const a=b.dataset.a,i=b.closest('[data-i]');
 if(b.dataset.k==='del'){ST.rows.splice(+i.dataset.i,1);return draw()}
 if(a==='close')close();else if(a==='menu'&&!ST.busy){ST.kind=b.dataset.v;ST.rows=[];ST.log=[];ST.files=[];draw();pick()}
 else if(a==='all'){ST.rows.forEach(r=>{if(r.amount>0)r.on=true});draw()}else if(a==='none'){ST.rows.forEach(r=>r.on=false);draw()}
 else if(a==='rescan'&&ST.files.length)run(ST.files);else if(a==='save')save()}
function onInput(e){const t=e.target,k=t.dataset.k,w=t.closest('[data-i]');if(!w)return;const r=ST.rows[+w.dataset.i];
 if(k==='amount'){const d=t.value.replace(/\D/g,'').slice(0,12);t.value=d?new Intl.NumberFormat('id-ID').format(+d):'';r.amount=+d||0;r.conf=Math.max(r.conf,85);const s=sum(),el=$('.ssxsm span',root);if(el)el.textContent='Dipilih '+s.n+' · Keluar '+rp(s.o)+' · Masuk '+rp(s.m)}
 else if(k==='desc')r.desc=t.value}
function onChange(e){const t=e.target,k=t.dataset.k,w=t.closest('[data-i]');if(!w||!k)return;const r=ST.rows[+w.dataset.i];
 if(k==='on')r.on=t.checked;else if(k==='date'){if(t.value)r.date=t.value}
 else if(k==='type'){r.type=t.value;if(r.type==='transfer'){r.toWallet=SS().wallets.find(x=>x!==r.wallet);r.cat='Transfer'}else r.cat=pickCat(r.desc,r.type)}
 else if(k==='amount'){r.amount=+t.value.replace(/\D/g,'')||0;return}
 else r[k]=t.value;
 if(k==='on'||k==='type'||k==='wallet')draw()}
function save(){const on=ST.rows.filter(r=>r.on),bad=on.filter(r=>!(r.amount>0)||!r.date||(r.type==='transfer'&&(!r.toWallet||r.toWallet===r.wallet)));
 if(bad.length)return tst('Ada '+bad.length+' baris yang nominal/tanggal/dompet tujuannya belum valid.');
 if(!on.length)return tst('Pilih minimal satu transaksi.');
 const uncertain=on.filter(r=>r.conf<80||r.flags.length).length;
 if(uncertain&&!confirm(uncertain+' dari '+on.length+' transaksi yang dipilih masih bertanda peringatan. Simpan sesuai isi tabel sekarang?'))return;
 const bk=typeof bkc==='function'?bkc():undefined,batch='ss'+Date.now(),W=SS().wallets;
 const tx=on.map(r=>{const t={id:nid(),book:bk,scope:'personal',type:r.type,amount:Math.round(r.amount),category:r.type==='transfer'?'Transfer':r.cat,wallet:r.wallet||W[0],note:r.desc,photos:[],party:'',chk:'1',isoDate:r.date,date:fd(r.date),ssrc:batch};
  if(r.type==='transfer')t.toWallet=r.toWallet;if(r.ref)t.ref=r.ref;if(r.items&&r.items.length)t.items=r.items;t.smart=r.kind;return t});
 SS().transactions.unshift(...tx);try{save_()}catch(e){}
 ST.rows=[];ST.log=[];ST.files=[];tst(tx.length+' transaksi tersimpan ✅');close()}
function save_(){window.save()}
/* ---------- pintu masuk ---------- */
const HOOK='[data-s="stmt"],[data-a="smstmt"]';
const KM={stmt:'mutasi',smstmt:'mutasi'};
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest(HOOK);if(!b||root&&root.contains(b))return;
 try{const k=b.dataset.s||b.dataset.a;e.preventDefault();e.stopImmediatePropagation();open(KM[k]||ST.kind,true)}catch(x){console.warn('Impor mutasi gagal dibuka',x)}},true);
if(window.VFSMX){VFSMX.stmt=()=>open('mutasi',true)}
window.VFStatementImport={open,close};
})();

