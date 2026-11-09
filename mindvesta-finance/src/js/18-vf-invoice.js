
(function(){'use strict';
/* ===== VitalFinance Pro — Modul Invoice v2 =====
   Perubahan utama:
   - Layout invoice profesional (A4, siap cetak/PDF), tema mengikuti aplikasi (gelap/terang/pink/Simpel)
   - Form lengkap per bagian, setiap bagian punya checkbox tampil/sembunyi
   - Perhitungan dilakukan dalam satuan sen (integer) -> bebas error floating-point
   - Preview real-time; cetak/PDF via jendela cetak, PNG via html2canvas
*/
var LS='vf_invoice_v2',LS_OLD='vf_invoice_v1',st={},D,ov,busy=0,theme='auto';
try{st=JSON.parse(localStorage.getItem(LS)||'{}')}catch(e){st={}}
function put(){try{localStorage.setItem(LS,JSON.stringify(st))}catch(e){tt('Penyimpanan penuh, gambar besar tidak tersimpan.')}}

/* ---------- util ---------- */
var h=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var nl=function(s){return h(s).replace(/\n/g,'<br>')};
var rp=function(n){n=Math.round(n||0);return(n<0?'-':'')+'Rp '+Math.abs(n).toLocaleString('id-ID')};
function today(){var n=new Date;return new Date(n-n.getTimezoneOffset()*6e4).toISOString().slice(0,10)}
function addDays(d,k){var x=new Date(d+'T00:00:00');if(isNaN(x))return today();x.setDate(x.getDate()+k);return new Date(x-x.getTimezoneOffset()*6e4).toISOString().slice(0,10)}
var fd=function(d){if(!d)return'-';var x=new Date(d+'T00:00:00');return isNaN(x)?h(d):x.toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})};
/* angka: "1.500.000" / "1500000" / "12,5" -> Number (aman untuk desimal koma) */
function num(v){if(typeof v==='number')return isFinite(v)?v:0;v=String(v==null?'':v).trim();if(!v)return 0;
  if(v.indexOf(',')>-1)v=v.replace(/\./g,'').replace(',','.');else if(/^\d{1,3}(\.\d{3})+$/.test(v))v=v.replace(/\./g,'');
  v=v.replace(/[^\d.\-]/g,'');var n=parseFloat(v);return isFinite(n)?n:0}
var money=function(v){return Math.max(0,Math.round(num(v)))};                /* Rupiah bulat, tidak negatif */
var fmtIn=function(v){var n=money(v);return n?n.toLocaleString('id-ID'):''};
var r2=function(n){return Math.round(n*100)/100};
var uid=function(){return Math.random().toString(36).slice(2,8)};

/* ---------- perhitungan (satu sumber kebenaran untuk preview, cetak, PNG) ---------- */
function calc(d){
  var sub=0,rows=[];
  d.items.forEach(function(i){
    var q=Math.max(0,num(i.q)),p=money(i.p),t=Math.round(q*p);
    if(!(String(i.n||'').trim()||p))return;           /* baris kosong diabaikan */
    rows.push({n:i.n,q:q,p:p,t:t});sub+=t});
  var disc=0,dl='';
  if(d.on.disc){var dv=Math.max(0,num(d.disc.v));
    if(d.disc.t==='pct'){dv=Math.min(100,dv);disc=Math.round(sub*dv/100);dl='Diskon ('+r2(dv)+'%)'}
    else{disc=Math.min(money(dv),sub);dl='Diskon'}}
  var after=sub-disc,ship=d.on.ship?money(d.ship):0;
  var taxBase=after+(d.taxShip?ship:0),tax=0,tl='';
  if(d.on.tax){var tr=Math.min(100,Math.max(0,num(d.tax.r)));
    if(d.tax.inc){tax=Math.round(taxBase-taxBase/(1+tr/100))}else tax=Math.round(taxBase*tr/100);
    tl=(d.tax.n||'PPN')+' ('+r2(tr)+'%)'+(d.tax.inc?' · sudah termasuk':'')}
  var grand=after+ship+(d.on.tax&&d.tax.inc?0:tax);
  var paid=d.on.dp?Math.min(money(d.dp),grand):0;
  return{rows:rows,sub:sub,disc:disc,dl:dl,ship:ship,tax:tax,tl:tl,grand:grand,paid:paid,due:grand-paid,taxInc:!!(d.on.tax&&d.tax.inc)}}

/* ---------- default data & toggle ---------- */
var BLOCKS=[ /* id, label, default on */
 ['title','Judul dokumen',1],['no','Nomor invoice',1],['date','Tanggal terbit',1],['due','Tanggal jatuh tempo',1],
 ['logo','Logo',1],['sname','Nama bisnis penjual',1],['saddr','Alamat penjual',1],['sphone','Telepon penjual',1],['smail','Email penjual',1],['npwp','NPWP',1],
 ['buyer','Blok pembeli (Tagihan kepada)',1],['baddr','Alamat pembeli',1],['bcontact','Kontak pembeli',1],
 ['disc','Diskon',0],['ship','Ongkos kirim',0],['tax','Pajak (PPN)',1],['dp','Uang muka / DP terbayar',0],
 ['pay','Metode pembayaran',1],['terms','Syarat & ketentuan',1],['notes','Catatan tambahan',1],['sig','Tanda tangan',1],['sigb','Tanda tangan pembeli',0]];
function defOn(){var o={};BLOCKS.forEach(function(b){o[b[0]]=!!b[2]});return o}
var NOTE_DEF='Terima kasih atas kepercayaan Anda. Kami menantikan kerja sama selanjutnya.';
var TERMS_DEF='1. Pembayaran paling lambat pada tanggal jatuh tempo.\n2. Keterlambatan dikenakan denda 1% per minggu dari total tagihan.\n3. Uang muka tidak dapat dikembalikan bila terjadi pembatalan sepihak.';
function fresh(){
  var p=st.prof||{};
  return{lang:st.lang||'INVOICE',no:nomor(),date:today(),due:addDays(today(),14),
    on:Object.assign(defOn(),st.on||{}),
    sname:p.sname||'',saddr:p.saddr||'',sphone:p.sphone||'',smail:p.smail||'',npwp:p.npwp||'',logo:p.logo||'',
    bname:'',baddr:'',bcontact:'',
    items:[{id:uid(),n:'',q:1,p:''}],
    disc:{t:'pct',v:''},ship:'',tax:{n:'PPN',r:11,inc:false},taxShip:false,dp:'',
    pay:p.pay||'',qr:p.qr||'',plink:p.plink||'',cx:{del:'',per:'',use:''},bdg:'',dsc:'',thumbs:[],tlink:'',fx:{c:'USD',r:'',m:'PayPal · Stripe · Wise'},terms:p.terms!=null?p.terms:TERMS_DEF,notes:p.notes!=null?p.notes:NOTE_DEF,
    sig:p.sig||'',bsig:'',sigName:p.sigName||''}}
function nomor(){var y=new Date().getFullYear(),n=(st.cnt&&st.cnt[y]||0)+1;return'INV/'+y+'/'+String(n).padStart(3,'0')}
function bump(){var y=new Date().getFullYear();st.cnt=st.cnt||{};st.cnt[y]=(st.cnt[y]||0)+1}

/* ---------- gaya / tema invoice ---------- */
var STYLES=[['modern','Modern'],['classic','Klasik'],['minimal','Minimal'],['bold','Tegas']];
var ACCENTS=['#0f766e','#1d4ed8','#7c3aed','#be123c','#c2410c','#b8860b','#111827'];
/* Warna dasar kertas ditentukan oleh tema aplikasi aktif */
function appTheme(){
  var b=document.body,R=document.documentElement;
  if(b.classList.contains('sm'))return{k:'simpel',dark:true,ac:'#b8ff3c',paper:'#0e0e1c',ink:'#f4f4ff',mu:'#9b9bb8',ln:'#2c2c4d',soft:'#171730',onac:'#0a0a14'};
  if(R.classList.contains('fmr')||b.classList.contains('fm'))return{k:'pink',dark:false,ac:'#ee6495',paper:'#ffffff',ink:'#33303a',mu:'#8a7f87',ln:'#f3d9e2',soft:'#fff4f8',onac:'#ffffff'};
  if(R.dataset.t==='light')return{k:'terang',dark:false,ac:getComputedStyle(R).getPropertyValue('--ac').trim()||'#b8860b',paper:'#ffffff',ink:'#12201b',mu:'#566b63',ln:'#d6e0dc',soft:'#f2f6f4',onac:'#12201b'};
  return{k:'gelap',dark:true,ac:getComputedStyle(R).getPropertyValue('--ac').trim()||'#f0b84a',paper:'#111a17',ink:'#e8efec',mu:'#8fa69d',ln:'#243430',soft:'#16201d',onac:'#1a1305'}}
function hex(c){c=(c||'').trim();if(/^#[0-9a-f]{6}$/i.test(c))return c;if(/^#[0-9a-f]{3}$/i.test(c))return'#'+c.slice(1).split('').map(function(x){return x+x}).join('');return'#b8860b'}
function lum(x){x=hex(x).slice(1);var c=[0,2,4].map(function(i){return parseInt(x.substr(i,2),16)});return(c[0]*.299+c[1]*.587+c[2]*.114)/255}
/* Gaya cetak (kertas putih) vs gaya layar (ikut tema aplikasi) */
function palette(forPrint){
  var t=appTheme(),mode=forPrint?'light':(theme==='auto'?(t.dark?'dark':'light'):theme),ac=hex(st.accent||t.ac);
  if(!st.accent&&forPrint&&t.dark)ac=hex(t.k==='simpel'?'#2f7d00':ac);
  if(mode==='dark')return{paper:t.dark?t.paper:'#12161c',ink:t.dark?t.ink:'#eef1f5',mu:t.dark?t.mu:'#9aa4b2',ln:t.dark?t.ln:'#2a3340',soft:t.dark?t.soft:'#1a212b',ac:ac,onac:lum(ac)>.6?'#10131a':'#fff'};
  var bl=t.dark?{paper:'#ffffff',ink:'#16202a',mu:'#5d6b78',ln:'#dfe5ea',soft:'#f4f7f9'}:{paper:t.paper,ink:t.ink,mu:t.mu,ln:t.ln,soft:t.soft};
  return Object.assign(bl,{ac:ac,onac:lum(ac)>.6?'#10131a':'#fff'})}

/* ---------- font (Google Fonts bila online; fallback sistem bila offline) ---------- */
var SANS="'Segoe UI',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif",SERIF="Georgia,'Times New Roman',serif";
var FONT={
 jakarta:{l:'Jakarta + Inter',h:'Plus Jakarta Sans',b:'Inter',s:'sans',q:['Plus+Jakarta+Sans:wght@500;600;700;800','Inter:wght@400;500;600;700']},
 serif:{l:'Playfair + Serif',h:'Playfair Display',b:'Source Serif 4',s:'serif',q:['Playfair+Display:wght@600;700;800','Source+Serif+4:wght@400;600;700']},
 dm:{l:'DM Sans',h:'DM Sans',b:'DM Sans',s:'sans',q:['DM+Sans:wght@400;500;600;700']},
 grotesk:{l:'Grotesk + Plex',h:'Space Grotesk',b:'IBM Plex Sans',s:'sans',q:['Space+Grotesk:wght@500;600;700','IBM+Plex+Sans:wght@400;500;600;700']},
 manrope:{l:'Manrope',h:'Manrope',b:'Manrope',s:'sans',q:['Manrope:wght@400;500;600;700;800']}};
var STYLE_FONT={modern:'jakarta',classic:'serif',minimal:'dm',bold:'grotesk'};
function fontId(){var f=st.font,t=curTpl();return f&&FONT[f]?f:(t?t.f:(STYLE_FONT[st.style||'modern']||'jakarta'))}
function fontVars(id){var f=FONT[id],fb=f.s==='serif'?SERIF:SANS;return'--fh:\''+f.h+'\','+fb+';--fb:\''+f.b+'\','+fb+';'}
function fontHref(id){return'https://fonts.googleapis.com/css2?family='+FONT[id].q.join('&family=')+'&display=swap'}
function ensureFonts(id){var k='vfi-font-'+id;if(document.getElementById(k))return;var l=document.createElement('link');l.id=k;l.rel='stylesheet';l.href=fontHref(id);l.onload=function(){if(ov)pvSoon()};document.head.appendChild(l)}
function fontReady(id){ensureFonts(id);var f=FONT[id];if(!document.fonts||!document.fonts.load)return Promise.resolve();
  return Promise.race([Promise.all([document.fonts.load('700 20px "'+f.h+'"'),document.fonts.load('400 14px "'+f.b+'"'),document.fonts.load('600 14px "'+f.b+'"')]),new Promise(function(r){setTimeout(r,3500)})]).catch(function(){})}
if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener('loadingdone',function(){if(ov)pvSoon()});

/* ---------- impor invoice dari gambar / PDF ---------- */
var PARSE=window.VFInvParse,lastSrc=null,undoSnap=null,ibusy=0;
function libLoad(u){return new Promise(function(ok,no){var s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=function(){no(new Error('Butuh internet sekali untuk memuat mesin pembaca (OCR/PDF).'))};document.head.appendChild(s)})}
function impBusy(t){var e=ov&&ov.querySelector('#impBusy');if(!e)return;e.style.display=t?'flex':'none';e.firstChild.textContent=t||''}
function askPw(){return new Promise(function(ok){var v=window.prompt('PDF terkunci 🔒 Masukkan password (mis. tanggal lahir DDMMYYYY):');ok(v===null?null:v)})}
function thumbOf(file){return new Promise(function(ok){try{var u=URL.createObjectURL(file),i=new Image;i.onload=function(){var k=Math.min(1,900/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);var g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);ok(c.toDataURL('image/jpeg',.72))};i.onerror=function(){URL.revokeObjectURL(u);ok('')};i.src=u}catch(e){ok('')}})}
async function pdfLayout(file,cx){
  await VFX.pdfInit({lib:libLoad});
  var data=new Uint8Array(await file.arrayBuffer()),pw,doc=null,task;
  var dg=false;for(var i=0;i<5&&!doc;i++){try{task=pdfjsLib.getDocument({data:data.slice(),password:pw,isEvalSupported:false,verbosity:0});doc=await task.promise}
    catch(e){try{task&&task.destroy()}catch(x){}if(e&&e.name==='PasswordException'){cx.busy('');pw=await cx.askPw();if(pw===null)throw new Error('Dibatalkan')}else if(!dg&&VFX._pdfMode!=='main'&&/worker|handler|fake|setting up|undefined/i.test(String(e&&e.message||e))){dg=true;await VFX.pdfInit({lib:libLoad},{mainThread:true})}else throw e}}
  if(!doc)throw new Error('Password salah.');
  var pages=[],thumb='',N=Math.min(doc.numPages,8),chars=0;
  try{for(var p=1;p<=N;p++){cx.busy('Membaca teks PDF… hal '+p+'/'+N);var page=await doc.getPage(p),tc=await page.getTextContent(),t=PARSE.layoutText(tc.items);chars+=t.replace(/\s/g,'').length;pages.push(t);
      if(p===1){try{var v0=page.getViewport({scale:1}),vp=page.getViewport({scale:Math.min(1.3,800/v0.width)}),cv=document.createElement('canvas');cv.width=Math.ceil(vp.width);cv.height=Math.ceil(vp.height);var g=cv.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,cv.width,cv.height);await page.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise;thumb=cv.toDataURL('image/jpeg',.72)}catch(e){}}
      try{page.cleanup()}catch(e){}}}
  finally{try{await doc.destroy()}catch(e){}}
  if(chars<40*N)return{text:'',thumb:thumb};   /* PDF hasil scan: tidak ada teks asli -> OCR */
  return{text:pages.join('\n\n'),thumb:thumb,pages:doc.numPages}}
async function readSource(file){
  if(!window.VFX||!VFX.ready)throw new Error('Mesin pembaca belum siap. Muat ulang halaman lalu coba lagi.');
  if(file.size>30*1024*1024)throw new Error('File terlalu besar (maks 30 MB).');
  var isPdf=/pdf/i.test(file.type)||/\.pdf$/i.test(file.name),cx={busy:impBusy,lib:libLoad,askPw:askPw},out={text:'',thumb:'',kind:isPdf?'pdf':'img',name:file.name};
  if(isPdf){
    try{var r=await pdfLayout(file,cx);out.text=r.text;out.thumb=r.thumb;out.pages=r.pages}catch(e){if(/Dibatalkan|Password salah|internet/i.test(e.message||''))throw e;out.text=''}
    if(!out.text){out.kind='pdf-ocr';out.text=await VFX.pdf(file,cx)}}
  else if(/^image\//.test(file.type)||/\.(png|jpe?g|webp|gif|bmp|heic)$/i.test(file.name)){out.thumb=await thumbOf(file);out.text=await VFX.ocr(file,cx)}
  else throw new Error('Format tidak didukung. Gunakan PDF, JPG, atau PNG.');
  return out}

var WF={no:'Nomor invoice',date:'Tanggal terbit',due:'Jatuh tempo',sname:'Nama penjual',saddr:'Alamat penjual',sphone:'Telepon penjual',smail:'Email penjual',npwp:'NPWP',buyer:'Pembeli',baddr:'Alamat pembeli',bcontact:'Kontak pembeli',disc:'Diskon',ship:'Ongkir',tax:'Pajak',dp:'DP',pay:'Metode pembayaran',terms:'Syarat & ketentuan',notes:'Catatan'};
function mergeInto(r){
  var o=D.on,pn=(st.prof&&st.prof.sname||'').trim().toLowerCase();
  if(r.found.title)D.lang=r.title;
  function f(key,onk,found,val){if(found){D[key]=val;if(onk)o[onk]=true}else if(onk)o[onk]=false}
  f('no','no',r.found.no,r.no);f('date','date',r.found.date,r.date);f('due','due',r.found.due,r.due);
  f('sname','sname',r.found.sname,r.sname);f('saddr','saddr',r.found.saddr,r.saddr);f('sphone','sphone',r.found.sphone,r.sphone);f('smail','smail',r.found.smail,r.smail);f('npwp','npwp',r.found.npwp,r.npwp);
  if(!r.found.sname)D.sname='';else if(D.logo&&pn!==String(r.sname).trim().toLowerCase())D.logo='';
  o.logo=!!D.logo;
  f('bname',null,r.found.buyer,r.bname);o.buyer=!!r.found.buyer;if(!r.found.buyer)D.bname='';
  f('baddr','baddr',r.found.baddr,r.baddr);f('bcontact','bcontact',r.found.bcontact,r.bcontact);
  D.items=r.items.length?r.items.map(function(i){return{id:uid(),n:i.n,q:i.q,p:i.p}}):[{id:uid(),n:'',q:1,p:''}];
  o.disc=!!r.disc;if(r.disc)D.disc={t:r.disc.t,v:String(r.disc.v)};else D.disc={t:'pct',v:''};
  o.ship=!!r.found.ship;D.ship=r.found.ship?r.ship:'';
  o.tax=!!r.tax;if(r.tax){D.tax={n:r.tax.n,r:r.tax.r,inc:!!r.tax.inc};D.taxShip=!!r.taxShip}else{D.tax={n:'PPN',r:11,inc:false};D.taxShip=false}
  o.dp=!!r.found.dp;D.dp=r.found.dp?r.dp:'';
  f('pay','pay',r.found.pay,r.pay);f('terms','terms',r.found.terms,r.terms);f('notes','notes',r.found.notes,r.notes);
  if(!r.found.pay)D.pay='';if(!r.found.terms)D.terms='';if(!r.found.notes)D.notes='';
  D.imported=true}
function fillForm(){
  var m={lang:D.lang,no:D.no,date:D.date,due:D.due,sname:D.sname,saddr:D.saddr,sphone:D.sphone,smail:D.smail,npwp:D.npwp,bname:D.bname,baddr:D.baddr,bcontact:D.bcontact,dv:D.disc.v,shipv:fmtIn(D.ship),dpv:fmtIn(D.dp),taxn:D.tax.n,taxr:D.tax.r,pay:D.pay,terms:D.terms,notes:D.notes,signame:D.sigName};
  Object.keys(m).forEach(function(k){var e=ov.querySelector('#'+k);if(e)e.value=m[k]==null?'':m[k]});
  var ti=ov.querySelector('#taxinc'),ts=ov.querySelector('#taxship');if(ti)ti.checked=!!D.tax.inc;if(ts)ts.checked=!!D.taxShip;
  ov.querySelectorAll('[data-lang]').forEach(function(b){b.classList.toggle('on',b.dataset.lang===D.lang)});
  ov.querySelectorAll('[data-dt]').forEach(function(b){b.classList.toggle('on',b.dataset.dt===D.disc.t)});
  itemsUI();logoUI();sigUI();syncOn()}
function clearWarn(){ov.querySelectorAll('.warn').forEach(function(e){e.classList.remove('warn')})}
function markWarn(r){clearWarn();var M={no:'#no',date:'#date',due:'#due',sname:'#sname',bname:'#bname',items:'#its',tax:'#taxr',dp:'#dpv',totals:'#calc'};
  function mk2(f){var e=M[f]&&ov.querySelector(M[f]);if(e)e.classList.add('warn')}
  r.warns.forEach(function(w){if(w.lvl!=='info')mk2(w.field)});r.checks.forEach(function(c){if(c.ok===false)mk2(c.field)});
  if(!r.found.no)mk2('no');if(!r.found.date)mk2('date');if(!r.found.sname)mk2('sname');if(!r.found.buyer)mk2('bname')}
function showReport(r,src){
  var el=ov.querySelector('#impRep'),lv=r.empty?'rendah':r.level,ic={tinggi:'✅',sedang:'⚠️',rendah:'❗'}[lv],lab={tinggi:'Tinggi',sedang:'Sedang',rendah:'Rendah'}[lv];
  var kind={pdf:'PDF digital — dibaca langsung dari teks aslinya (paling akurat)','pdf-ocr':'PDF hasil scan — dibaca dengan OCR',img:'Gambar — dibaca dengan OCR',teks:'Teks yang Anda edit'}[src.kind]||'';
  var x='<div class="rep lv-'+lv+'"><div class="rh"><span>'+ic+'</span><span>Hasil baca · keyakinan '+lab+(r.empty?'':' ('+r.score+'%)')+'</span></div><div class="hint" style="margin-top:2px">'+h(kind)+(src.name?' · '+h(src.name):'')+'</div>';
  if(src.thumb)x+='<img class="th" src="'+src.thumb+'" alt="Pratinjau file sumber">';
  var lis='';r.checks.forEach(function(c){lis+='<li><i>'+(c.ok===true?'✓':c.ok===false?'✕':'•')+'</i><span>'+h(c.msg)+'</span></li>'});
  r.warns.filter(function(w){return w.lvl!=='info'}).forEach(function(w){lis+='<li><i>'+(w.lvl==='err'?'✕':'⚠')+'</i><span>'+h(w.msg)+'</span></li>'});
  r.warns.filter(function(w){return w.lvl==='info'}).forEach(function(w){lis+='<li><i>ℹ</i><span>'+h(w.msg)+'</span></li>'});
  if(lis)x+='<ul>'+lis+'</ul>';
  if(!r.empty){var miss=Object.keys(WF).filter(function(k){return!r.found[k]}).map(function(k){return WF[k]});
    x+='<div class="hint">Terisi dari dokumen: '+(Object.keys(r.found).filter(function(k){return WF[k]}).length)+' kolom · '+r.items.length+' item.'+(miss.length?' Tidak ditemukan (otomatis disembunyikan): '+h(miss.join(', '))+'.':'')+' Logo &amp; tanda tangan tidak bisa dibaca dari gambar — tambahkan manual.</div>';
    x+='<div class="hint"><b>Kolom yang diberi bingkai kuning perlu Anda cek.</b> Tidak ada OCR yang 100% bebas salah; angka sudah dicocokkan otomatis, tetapi bandingkan sekilas dengan dokumen asli sebelum dikirim.</div>'}
  x+='<details'+(r.empty||lv==='rendah'?' open':'')+'><summary>Teks mentah hasil baca (bisa diedit)</summary><textarea class="in" id="rawT" spellcheck="false"></textarea><button class="bt gh sm2" id="reparse">🔄 Baca ulang dari teks ini</button></details>';
  x+='<div class="g2"><button class="bt gh sm2" id="undoImp">↩ Urungkan impor</button>'+(r.itemsDelta>0?'<button class="bt gh sm2" id="addDelta">＋ Tambah baris selisih</button>':'<span></span>')+'</div></div>';
  el.innerHTML=x;var ta=el.querySelector('#rawT');if(ta)ta.value=r.raw||''}
function applyText(text,src){
  lastSrc=src;var r=PARSE.parse(text);
  if(!undoSnap)undoSnap=JSON.stringify(D);
  if(!r.empty){mergeInto(r);fillForm();pv();markWarn(r)}
  showReport(r,src);lastParse=r;
  var rep=ov.querySelector('#impRep');if(rep&&rep.scrollIntoView)rep.scrollIntoView({block:'nearest',behavior:'smooth'});
  return r}
var lastParse=null;
async function importFile(file){
  if(ibusy||!file)return;ibusy=1;
  try{impBusy('Membuka file…');var src=await readSource(file);impBusy('Menganalisis & memverifikasi…');await new Promise(function(r){setTimeout(r,30)});applyText(src.text,src)}
  catch(e){if(!/Dibatalkan/.test(e&&e.message||''))tt((e&&e.message)||'Gagal membaca file.')}
  finally{impBusy('');ibusy=0}}
function undoImport(){if(!undoSnap)return;try{D=JSON.parse(undoSnap)}catch(e){return}undoSnap=null;D.imported=false;clearWarn();fillForm();pv();var el=ov.querySelector('#impRep');if(el)el.innerHTML='';tt('Impor dibatalkan.')}

var CSSI=`
.vfi,.vfi *{all:revert}
.vfi{width:794px;min-height:1123px;background:var(--p);color:var(--i);font:13px/1.55 var(--fb);font-feature-settings:'tnum' 1,'lnum' 1,'kern' 1;font-kerning:normal;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;padding:48px 52px;box-sizing:border-box;position:relative;text-align:left;display:flex;flex-direction:column}
.vfi *{box-sizing:border-box}
.vfi .hd{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;margin-bottom:28px}
.vfi .brand{display:flex;gap:14px;align-items:flex-start;min-width:0;flex:1}
.vfi .logo{max-height:64px;max-width:150px;object-fit:contain;flex:none}
.vfi .sn{font-family:var(--fh);font-size:20px;font-weight:800;letter-spacing:-.015em;line-height:1.15;margin-bottom:4px}
.vfi .sm{color:var(--m);font-size:12px;line-height:1.55;overflow-wrap:anywhere}
.vfi .tt{text-align:right;flex:none}
.vfi .ti{font-family:var(--fh);font-size:34px;font-weight:800;letter-spacing:.08em;color:var(--a);line-height:1}
.vfi .tn{font-family:var(--fb);margin-top:8px;font-weight:600;font-size:13.5px;letter-spacing:.03em}
.vfi .meta{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:22px}
.vfi .box{background:var(--s);border:1px solid var(--l);border-radius:10px;padding:14px 16px;min-width:0}
.vfi .lb{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--m);margin-bottom:5px}
.vfi .bn{font-family:var(--fh);font-weight:700;font-size:15.5px;letter-spacing:-.005em;overflow-wrap:anywhere}
.vfi .dts{display:grid;grid-template-columns:auto 1fr;gap:3px 14px;font-size:12.5px}
.vfi .dts span{color:var(--m)}.vfi .dts b{text-align:right}
.vfi table{width:100%;border-collapse:collapse;margin-bottom:6px}
.vfi th{background:var(--a);color:var(--oa);font-size:10px;letter-spacing:.13em;text-transform:uppercase;padding:11px 12px;text-align:left;font-weight:700}
.vfi td{padding:11px 12px;border-bottom:1px solid var(--l);vertical-align:top}
.vfi th.r,.vfi td.r{text-align:right;white-space:nowrap}.vfi th.c,.vfi td.c{text-align:center;white-space:nowrap}
.vfi td.d{overflow-wrap:anywhere;width:46%}
.vfi tr{page-break-inside:avoid}
.vfi .sum{display:flex;justify-content:flex-end;margin:10px 0 22px}
.vfi .sum table{width:330px;margin:0}.vfi .sum td{padding:6px 12px;border:0}.vfi .sum td:first-child{color:var(--m)}
.vfi .sum .neg td:last-child{color:#c2410c}
.vfi .sum .gt td{background:var(--a);color:var(--oa);font-family:var(--fh);font-weight:800;font-size:15.5px;padding:12px}.vfi .sum .gt td:first-child{color:var(--oa);border-radius:8px 0 0 8px}.vfi .sum .gt td:last-child{border-radius:0 8px 8px 0}
.vfi .sum .due td{font-weight:800;border-top:1px dashed var(--l);padding-top:10px}
.vfi .info{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px}.vfi .info.one{grid-template-columns:1fr}
.vfi .tx{white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px;line-height:1.6;color:var(--i)}
.vfi .nt{margin-bottom:18px}
.vfi .sg{display:flex;justify-content:flex-end;gap:40px;margin-top:auto;padding-top:26px;page-break-inside:avoid}
.vfi .sg>div{width:200px;text-align:center}.vfi .sg img{max-height:70px;max-width:100%;display:block;margin:0 auto 4px;object-fit:contain}
.vfi .sg .sp{height:70px}.vfi .sg .ln{border-top:1px solid var(--i);padding-top:5px;font-weight:700;font-size:12.5px}.vfi .sg small{color:var(--m);font-size:10.5px;display:block}
.vfi .ft{text-align:center;color:var(--m);font-size:10.5px;margin-top:18px}
.vfi .nil{color:var(--m);text-align:center;padding:18px}
/* gaya: classic */
.vfi td.r b,.vfi .dts b{font-weight:650}
.vfi.s-classic .tn,.vfi.s-classic .lb{font-family:var(--fb)}.vfi.s-classic .hd{border-bottom:3px double var(--a);padding-bottom:18px}
.vfi.s-classic .ti{font-weight:700;letter-spacing:.12em}.vfi.s-classic th{background:none;color:var(--i);border-top:2px solid var(--a);border-bottom:2px solid var(--a)}
.vfi.s-classic .box{background:none;border-radius:2px}.vfi.s-classic .sum .gt td{background:none;color:var(--a);border-top:2px solid var(--a);border-bottom:2px solid var(--a);border-radius:0!important}.vfi.s-classic .sum .gt td:first-child{color:var(--a)}
/* gaya: minimal */
.vfi.s-minimal .box{background:none;border:0;border-left:3px solid var(--a);border-radius:0;padding:2px 12px}
.vfi.s-minimal th{background:none;color:var(--m);border-bottom:2px solid var(--i)}.vfi.s-minimal .ti{color:var(--i);font-weight:300;letter-spacing:.2em}
.vfi.s-minimal .sum .gt td{background:none;color:var(--i);border-top:2px solid var(--i);border-radius:0!important}.vfi.s-minimal .sum .gt td:first-child{color:var(--i)}
/* gaya: bold */
.vfi.s-bold{padding-top:0}.vfi.s-bold .hd{background:var(--a);color:var(--oa);margin:0 -52px 28px;padding:36px 52px}
.vfi.s-bold .hd .sm,.vfi.s-bold .hd .ti{color:var(--oa)}.vfi.s-bold .ti{font-size:40px}.vfi.s-bold .box{border-radius:0;border-width:0 0 0 5px;border-left-color:var(--a)}
.vfi.s-bold th{border-radius:0}.vfi.s-bold .sum .gt td{border-radius:0!important}
`;
var CSS=`[id="vfi-ov"] *{all:revert}
`+CSSI+`
/* ===== overlay editor: ikut tema aplikasi ===== */
#vfi-ov,#vfi-ov *{box-sizing:border-box}
#vfi-ov input[type=file],#vfi-ov [hidden]{display:none!important}
#vfi-ov{position:fixed;inset:0;z-index:2147483000;overflow:auto;background:var(--bg,#0d1412);color:var(--tx,#e8efec);font:15px/1.45 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;-webkit-overflow-scrolling:touch;--vc:var(--cd,#16201d);--vc2:var(--cd2,rgba(128,128,128,.16));--vl:var(--ln,rgba(128,128,128,.28));--vm:var(--mu,#8fa69d);--va:var(--ac,#f0b84a);--vo:var(--onac,#1a1305)}
#vfi-ov.t-sm{--bg:#0a0a14;--tx:#f4f4ff;--vc:#15152a;--vc2:#222240;--vl:#2c2c4d;--vm:#9b9bb8;--va:#b8ff3c;--vo:#0a0a14}
#vfi-ov.t-pk{--bg:#fff6f9;--tx:#33303a;--vc:#fff;--vc2:#fdeaf1;--vl:#f3d9e2;--vm:#8a7f87;--va:#ee6495;--vo:#fff}
#vfi-ov.t-lt{--bg:#edf2f0;--tx:#12201b;--vc:#fff;--vc2:#e3ebe8;--vl:#d6e0dc;--vm:#566b63}
#vfi-ov .bar{position:sticky;top:0;z-index:6;display:flex;align-items:center;gap:12px;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 10px;background:var(--bg);border-bottom:1px solid var(--vl);font-weight:700}
#vfi-ov .bar button.x{border:0;background:var(--vc2);color:inherit;width:36px;height:36px;border-radius:50%;font-size:20px;cursor:pointer}
#vfi-ov .bar .sp{flex:1}
#vfi-ov .w{max-width:620px;margin:0 auto;padding:12px 14px 130px}
#vfi-ov h4{margin:20px 0 8px;font-size:12px;color:var(--vm);text-transform:uppercase;letter-spacing:.08em}
#vfi-ov .pvw{overflow:hidden;border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.35);background:#fff;position:relative}
#vfi-ov .pvi{width:794px;transform-origin:0 0}
#vfi-ov .card{background:var(--vc);border:1px solid var(--vl);border-radius:16px;padding:12px 14px;margin-bottom:12px}
#vfi-ov .card>.hdr{display:flex;align-items:center;gap:10px;font-weight:700;font-size:14px;margin-bottom:2px}
#vfi-ov .card>.hdr span{flex:1}
#vfi-ov .card.off>.body{display:none}
#vfi-ov .card.off{opacity:.8}
#vfi-ov .fl{display:block;margin-top:10px}#vfi-ov .fl>small{display:block;font-size:11px;color:var(--vm);margin-bottom:4px}
#vfi-ov .in{width:100%;padding:11px 12px;border:1px solid var(--vl);border-radius:12px;background:var(--vc2);color:inherit;font:inherit;font-size:15px;min-width:0;margin:0}
#vfi-ov textarea.in{min-height:78px;resize:vertical}
#vfi-ov .g2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
#vfi-ov .ck{display:flex;align-items:center;gap:10px;min-height:36px;cursor:pointer;font-size:14px;user-select:none}
#vfi-ov .ck input{appearance:none;-webkit-appearance:none;flex:none;width:22px;height:22px;border-radius:7px;border:2px solid var(--vm);background:transparent;display:grid;place-items:center;cursor:pointer;margin:0;padding:0}
#vfi-ov .ck input:checked{background:var(--va);border-color:var(--va)}
#vfi-ov .ck input:checked::after{content:'';width:5px;height:10px;border:solid var(--vo);border-width:0 2.5px 2.5px 0;transform:rotate(45deg) translate(-1px,-1px)}
#vfi-ov .ck input:focus-visible{outline:2px solid var(--va);outline-offset:2px}
#vfi-ov .ck.sub{font-size:13px;color:var(--vm);min-height:32px}
#vfi-ov .ck.dis{opacity:.45}
#vfi-ov .item{border:1px solid var(--vl);border-radius:14px;padding:10px;margin-top:10px;background:var(--vc2)}
#vfi-ov .item .in{background:var(--vc)}
#vfi-ov .item .r1{display:flex;gap:8px;align-items:center}#vfi-ov .item .r1 .in{flex:1}
#vfi-ov .item .r2{display:grid;grid-template-columns:90px 1fr 1fr;gap:8px;margin-top:8px;align-items:center}
#vfi-ov .item .tot{text-align:right;font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#vfi-ov .rm{flex:none;border:0;background:none;color:inherit;opacity:.7;font-size:18px;width:36px;height:36px;border-radius:10px;cursor:pointer}
#vfi-ov .bt{display:block;width:100%;padding:13px;border:0;border-radius:14px;background:var(--va);color:var(--vo);font:700 15px system-ui;margin-top:8px;text-align:center;cursor:pointer}
#vfi-ov .bt.gh{background:var(--vc2);color:inherit}#vfi-ov .bt.sm2{padding:9px;font-size:13px}
#vfi-ov .seg{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
#vfi-ov .seg button{border:1px solid var(--vl);background:transparent;color:inherit;border-radius:99px;padding:7px 13px;font-size:13px;cursor:pointer}
#vfi-ov .seg button.on{background:var(--va);color:var(--vo);border-color:var(--va);font-weight:700}
#vfi-ov .sw{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
#vfi-ov .sw button{width:30px;height:30px;border-radius:50%;border:3px solid transparent;box-shadow:0 0 0 1px var(--vl);cursor:pointer;padding:0}
#vfi-ov .sw button.on{border-color:var(--bg);box-shadow:0 0 0 2px var(--tx)}
#vfi-ov .calc{background:var(--vc2);border-radius:12px;padding:10px 12px;margin-top:10px;font-size:13px}
#vfi-ov .calc div{display:flex;justify-content:space-between;gap:10px;padding:2px 0}#vfi-ov .calc .gt{font-weight:800;font-size:15px;border-top:1px solid var(--vl);margin-top:4px;padding-top:6px}
#vfi-ov .dock{position:fixed;left:0;right:0;bottom:0;padding:10px 14px calc(10px + env(safe-area-inset-bottom,0px));background:var(--bg);display:flex;gap:8px;border-top:1px solid var(--vl);z-index:6}
#vfi-ov .dock .bt{margin:0;flex:1;padding:12px 6px;font-size:14px}
#vfi-ov .hint{font-size:12px;color:var(--vm);margin-top:6px}
#vfi-ov .logoRow{display:flex;gap:10px;align-items:center;margin-top:8px}#vfi-ov .logoRow img{max-height:44px;max-width:110px;background:#fff;border-radius:8px;padding:3px}
#vfi-ov .rep{margin-top:10px;border:2px solid var(--vl);border-radius:14px;padding:12px;background:var(--vc2)}
#vfi-ov .rep.lv-tinggi{border-color:#16a34a}#vfi-ov .rep.lv-sedang{border-color:#f59e0b}#vfi-ov .rep.lv-rendah{border-color:#ef4444}
#vfi-ov .rep .rh{font-weight:800;font-size:14px;display:flex;gap:8px;align-items:center}
#vfi-ov .rep ul{list-style:none;margin:8px 0 0;padding:0;font-size:13px}#vfi-ov .rep li{display:flex;gap:8px;padding:3px 0;line-height:1.4}#vfi-ov .rep li i{font-style:normal;flex:none;width:18px;text-align:center}
#vfi-ov .rep img.th{max-width:100%;max-height:150px;border-radius:10px;margin-top:8px;display:block;cursor:zoom-in;background:#fff;object-fit:contain}#vfi-ov .rep img.th.z{max-height:none;cursor:zoom-out}
#vfi-ov .rep details{margin-top:8px}#vfi-ov .rep summary{cursor:pointer;font-size:13px;color:var(--vm);padding:4px 0}
#vfi-ov .rep textarea{min-height:150px;font:12px/1.4 ui-monospace,Menlo,Consolas,monospace;white-space:pre;overflow:auto}
#vfi-ov .warn{outline:2px solid #f59e0b;outline-offset:1px;border-radius:12px}
#vfi-ov #impBusy{position:fixed;inset:0;z-index:9;background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center;color:#fff;font:700 16px system-ui;text-align:center;padding:24px}
#vfi-ov .drop.dg{outline:3px dashed var(--va)}
#vfi-tt{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#222;color:#fff;padding:10px 16px;border-radius:20px;z-index:2147483600;font:14px system-ui;max-width:86%;text-align:center}
#nav.vfi6{grid-template-columns:repeat(6,1fr)}#nav.vfi6 button{font-size:10px;padding-left:0;padding-right:0}#F .fn.vfi6{grid-template-columns:repeat(6,1fr)}#F .fn.vfi6 button{min-width:0}
`;

/* ===== Katalog 20 Template Invoice (registry data-driven) ===== */
Object.assign(FONT,{
 cormorant:{l:'Cormorant + Jost',h:'Cormorant Garamond',b:'Jost',s:'serif',q:['Cormorant+Garamond:wght@500;600;700','Jost:wght@400;500;600']},
 archivo:{l:'Archivo',h:'Archivo',b:'Archivo',s:'sans',q:['Archivo:wght@400;500;700;800;900']},
 sora:{l:'Sora',h:'Sora',b:'Sora',s:'sans',q:['Sora:wght@400;600;700;800']},
 bodoni:{l:'Bodoni + Jost',h:'Bodoni Moda',b:'Jost',s:'serif',q:['Bodoni+Moda:wght@500;600;700','Jost:wght@400;500;600']},
 fraunces:{l:'Fraunces + DM Sans',h:'Fraunces',b:'DM Sans',s:'serif',q:['Fraunces:wght@600;700;800','DM+Sans:wght@400;500;600;700']},
 poppins:{l:'Poppins',h:'Poppins',b:'Poppins',s:'sans',q:['Poppins:wght@400;500;600;700;800']},
 inter:{l:'Inter',h:'Inter',b:'Inter',s:'sans',q:['Inter:wght@400;500;600;700;800']}});
BLOCKS.push(['cxd','Deliverables',0],['cxp','Periode / Exclusivity',0],['cxu','Usage rights',0],['bdg','Badge paket',0],['qr','QRIS',1],['pbtn','Tombol Pay Now',1],['dsc','Disclaimer',0],['fx','Indikator kurs',0]);

/* mkT(id, kategori, nama, font, [kertas, tinta, muted, garis, soft, aksen], opsi) */
function mkT(id,c,n,f,k,o){return Object.assign({id:id,c:c,n:n,f:f,p:k[0],i:k[1],m:k[2],l:k[3],s:k[4],a:k[5]},o||{})}
var TPL=[
 mkT('glam',0,'Beauty & Lifestyle Glam','cormorant',['#fdf6f2','#4a3535','#9a7f7a','#ecd5cd','#f8e8e2','#b76e79'],{b:'Reels + Story + Unboxing',cx:1}),
 mkT('street',0,'Streetwear & Fashion Creator','archivo',['#fffdf5','#0a0a0a','#555555','#0a0a0a','#ffe14d','#ff4d2e'],{b:'Drop Campaign',cx:1}),
 mkT('game',0,'Gaming & Tech Streamer','sora',['#0d0f1a','#e6e8ff','#8d93c4','#272b4d','#151934','#22d3ee'],{dl:'Sponsorship / Live Stream Placement',ql:'Slot',b:'Live Stream Sponsor',cx:1,x:'av'}),
 mkT('pol',0,'Travel & Aesthetic Vlogger','serif',['#f4ede1','#3d342a','#8a7a66','#dccfb9','#ebe1cf','#a67c52'],{dl:'Konten / Dokumentasi',b:'Travel Collab',cx:1}),
 mkT('quick',0,'TikTok & Micro-Influencer Quick','jakarta',['#ffffff','#111111','#6b7280','#eeeeee','#f6f6f8','#fe2c55'],{w:'m',b:'TikTok Collab',cx:1}),
 mkT('edit',1,'Editorial & High Fashion','bodoni',['#ffffff','#111111','#7a7a7a','#d9d9d9','#fafafa','#111111'],{dl:'Produksi / Layanan',cx:1}),
 mkT('pop',1,'Creative Agency Pop','poppins',['#fffbe8','#14143c','#4b4b7a','#14143c','#fff1a8','#2f3cff'],{dl:'Proyek / Deliverable'}),
 mkT('mono',1,'Minimalist Studio Monochrome','grotesk',['#ffffff','#000000','#666666','#000000','#f2f2f2','#000000'],{dl:'Lingkup Pekerjaan'}),
 mkT('cine',1,'Videographer Showcase','manrope',['#1c1c1e','#f2f2f2','#9a9a9f','#38383c','#262628','#f59e0b'],{dl:'Produksi Video',ql:'Hari',cx:1}),
 mkT('copy',1,'Copywriter & PR Retainer','dm',['#ffffff','#1f2937','#6b7280','#e5e7eb','#f9fafb','#0f766e'],{dl:'Pekerjaan / Retainer',ql:'Jam'}),
 mkT('kor',2,'Korean Aesthetic Boutique','jakarta',['#fbf8ee','#3f4a3c','#8a9484','#dde3d0','#eef2e4','#8fae8b'],{dl:'Produk'}),
 mkT('cafe',2,'Artisan Coffee & Culinary','fraunces',['#f7efe4','#3b2418','#8a6a55','#dcc8b2','#efe0cc','#c2622d'],{dl:'Menu / Pesanan'}),
 mkT('saas',2,'SaaS & Tech Startup Clean','inter',['#ffffff','#0f172a','#64748b','#e2e8f0','#f1f5f9','#4f46e5'],{dl:'Paket / Langganan',ql:'Seat',x:'dpp'}),
 mkT('flora',2,'Event Organizer & Floral','cormorant',['#fffdfb','#4a3f3a','#9a8a82','#ead9d2','#fbf0ee','#c97b84'],{dl:'Layanan / Dekorasi',x:'flora'}),
 mkT('craft',2,'Handcraft & Custom Gift','fraunces',['#fcf5ea','#4b3a2f','#8b7565','#e5d3bd','#f6e8d3','#b5535a'],{dl:'Produk Custom',x:'craft'}),
 mkT('gold',3,'Executive Gold & Midnight','bodoni',['#0b0b10','#f4efe4','#a89f8a','#3a3322','#14141b','#d4af37'],{dl:'Layanan Eksekutif'}),
 mkT('navy',3,'Corporate Clean Navy','inter',['#ffffff','#0b1f3a','#5a6b85','#d8e0ec','#f2f5fa','#0b2a5b'],{dl:'Deskripsi Layanan'}),
 mkT('legal',3,'Legal & Advisory Minimal','serif',['#ffffff','#1a1a1a','#555555','#bbbbbb','#f6f6f6','#1f2a44'],{dl:'Jasa Hukum / Advisory',ql:'Jam',x:'dsc'}),
 mkT('fit',3,'Fitness & Personal Trainer','archivo',['#fff8f3','#1b1b1b','#6b6b6b','#f0d9cc','#ffeadf','#ff3d00'],{dl:'Program / Sesi',ql:'Sesi',b:'Coaching Program'}),
 mkT('fx',3,'Freelance Multi-Currency','dm',['#ffffff','#111827','#6b7280','#e5e7eb','#f3f4f6','#0891b2'],{x:'fx'})];
var DSC='Dokumen ini bukan nasihat hukum final. Hak cipta atas hasil kerja tetap pada penyedia jasa sampai pelunasan penuh. Penggunaan di luar lingkup yang disepakati memerlukan persetujuan tertulis.';
function curTpl(){for(var i=0;i<TPL.length;i++)if(TPL[i].id===st.tpl)return TPL[i]}
function tplPal(T){var ac=hex(st.accent||T.a);return{paper:T.p,ink:T.i,mu:T.m,ln:T.l,soft:T.s,ac:ac,onac:lum(ac)>.6?'#10131a':'#fff'}}
function tw(){var t=curTpl();return t&&t.w==='m'?440:794}
function url(u){u=String(u||'').trim();if(!u)return'';if(!/^https?:\/\//i.test(u)){if(/^[a-z][a-z0-9+.-]*:/i.test(u))return'';u='https://'+u}return u}

/* dekorasi vektor (inline SVG -> tetap tajam di PDF & PNG) */
function fl(s){return'<svg class="deco" style="'+s+'" width="130" height="96" viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M4 86C30 60 60 40 112 6"/><path d="M30 64c-8-10-6-20 2-26 6 8 6 18-2 26zM52 48c-10-4-14-14-10-24 10 2 14 12 10 24zM74 32c-4-10 0-20 10-24 4 10 0 20-10 24zM40 72c10-2 20 2 24 12-10 2-20-2-24-12z"/><circle cx="108" cy="9" r="3.5"/></svg>'}
var DECO={flora:fl('top:22px;right:26px')+fl('bottom:20px;left:24px;transform:rotate(180deg)'),
 craft:'<svg class="deco" style="top:0;right:60px" width="52" height="96" viewBox="0 0 52 96"><path d="M0 0h52v96l-26-20L0 96z" fill="currentColor"/></svg><svg class="deco st" style="bottom:96px;left:60px" width="96" height="96" viewBox="0 0 96 96" fill="none" stroke="currentColor"><circle cx="48" cy="48" r="44" stroke-width="2.5"/><circle cx="48" cy="48" r="37" stroke-width="1" stroke-dasharray="3 3"/><text x="48" y="46" text-anchor="middle" font-size="11" font-weight="800" fill="currentColor" stroke="none" letter-spacing="1.5">HANDMADE</text><text x="48" y="60" text-anchor="middle" font-size="8" fill="currentColor" stroke="none" letter-spacing="1">WITH LOVE</text></svg>'};

/* blok tambahan yang dipakai SEMUA template */
function xBlocks(d,c,T){var on=d.on,o={d:DECO[T.x]||'',b:'',m:'',p:'',z:''};
 if(on.bdg&&d.bdg.trim())o.b='<div class="bdg">'+h(d.bdg)+'</div>';
 var L=[['cxd','Deliverables Media Sosial','del'],['cxp','Periode Tayang / Exclusivity','per'],['cxu','Usage Rights / Hak Cipta Iklan','use']].filter(function(x){return on[x[0]]&&d.cx[x[2]].trim()});
 if(L.length)o.m+='<div class="cx" style="--n:'+L.length+'">'+L.map(function(x){return'<div class="box"><div class="lb">'+x[1]+'</div><div class="tx">'+h(d.cx[x[2]])+'</div></div>'}).join('')+'</div>';
 if(d.thumbs.length)o.m+='<div class="th3">'+d.thumbs.map(function(u){return'<img src="'+u+'" alt="">'}).join('')+'</div>'+(d.tlink.trim()?'<div class="sm" style="margin:-8px 0 16px">Portofolio: '+h(d.tlink)+'</div>':'');
 var q=on.qr&&d.qr,u=on.pbtn?url(d.plink):'';
 if(q||u)o.p='<div class="pz">'+(q?'<div class="qr"><img src="'+d.qr+'" alt="QRIS"><b>QRIS</b><br>Scan untuk membayar</div>':'')+'<div><div class="lb">Bayar cepat</div><div class="tx">Sisa tagihan <b>'+rp(c.due)+'</b></div>'+(u?'<a class="pn" href="'+h(u)+'">Pay Now &rsaquo;</a><div class="sm" style="margin-top:6px">'+h(u)+'</div>':'')+'</div></div>';
 if(T.x==='fx'&&on.fx&&d.fx.m.trim())o.z+='<div class="fxb">'+d.fx.m.split(/[·,|]/).filter(function(s){return s.trim()}).map(function(s){return'<b>'+h(s.trim())+'</b>'}).join('')+'</div>';
 if(on.dsc&&d.dsc.trim())o.z+='<div class="box nt dsc"><div class="lb">Disclaimer &amp; Hak Cipta</div><div class="tx">'+h(d.dsc)+'</div></div>';
 return o}
function xr(d,c,T,pos){if(!T)return'';
 if(pos===0&&T.x==='dpp'&&d.on.tax)return'<tr><td>DPP (sebelum pajak)</td><td class="r">'+rp(c.sub-c.disc+(d.taxShip?c.ship:0)-(c.taxInc?c.tax:0))+'</td></tr>';
 if(pos===1&&T.x==='fx'&&d.on.fx){var r=num(d.fx.r);if(r>0){var v;try{v=new Intl.NumberFormat('en-US',{style:'currency',currency:d.fx.c}).format(c.due/r)}catch(e){v=r2(c.due/r)+' '+d.fx.c}
  return'<tr class="due"><td>Setara '+h(d.fx.c)+'<br><small>Kurs 1 '+h(d.fx.c)+' = '+rp(r)+'</small></td><td class="r">'+v+'</td></tr>'}}
 return''}

/* CSS template: dipakai di pratinjau, cetak/PDF, dan PNG */
var TC=`
.vfi.s-tpl{overflow:hidden}.vfi .deco{position:absolute;color:var(--a);pointer-events:none}
.vfi .bdg{align-self:flex-start;margin:-8px 0 18px;padding:7px 15px;border-radius:99px;background:var(--a);color:var(--oa);font:700 11px/1 var(--fb);letter-spacing:.12em;text-transform:uppercase}
.vfi .cx{display:grid;grid-template-columns:repeat(var(--n),1fr);gap:12px;margin-bottom:18px}
.vfi .pz{display:flex;gap:18px;align-items:center;margin-bottom:18px;padding:14px 16px;border:1px solid var(--l);background:var(--s);border-radius:10px}
.vfi .qr{flex:none;text-align:center;font-size:10px;color:var(--m);line-height:1.4}.vfi .qr img{display:block;width:116px;height:116px;object-fit:contain;background:#fff;padding:6px;border:2.5px solid var(--a);border-radius:12px;margin-bottom:4px}
.vfi .pn{display:inline-block;margin-top:10px;padding:11px 26px;border-radius:99px;background:var(--a);color:var(--oa);text-decoration:none;font:800 13px var(--fh);letter-spacing:.06em}
.vfi .th3{display:flex;gap:12px;margin-bottom:18px}.vfi .th3 img{flex:1;min-width:0;height:100px;object-fit:cover;border-radius:6px;border:1px solid var(--l)}
.vfi .fxb{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}.vfi .fxb b{padding:5px 12px;border:1.5px solid var(--a);color:var(--a);border-radius:99px;font-size:11px}
.vfi .dsc .tx{font-size:10.5px;color:var(--m)}.vfi .sum small{font-size:10px;font-weight:400}
.t-glam .ti{font-size:44px;font-style:italic;font-weight:600;letter-spacing:.02em;text-transform:none}.vfi.t-glam{background:linear-gradient(160deg,var(--p),var(--s))}.t-glam .box{border-radius:20px}.t-glam th{background:var(--s);color:var(--a)}
.vfi.t-street{border:3px solid #0a0a0a}.t-street .ti{display:inline-block;background:var(--s);color:#0a0a0a;padding:4px 12px;border:2.5px solid #0a0a0a;box-shadow:5px 5px 0 #0a0a0a;font-weight:900;font-size:32px}.t-street .box{background:#fff;border:2px solid #0a0a0a;border-radius:0;box-shadow:4px 4px 0 #0a0a0a}.t-street th{background:#0a0a0a;color:#fff;border-radius:0}.t-street td{border-bottom:2px solid #0a0a0a}.t-street .sum .gt td{background:var(--a);color:var(--oa);border:2px solid #0a0a0a;border-radius:0!important}.t-street .bdg{border-radius:0;border:2px solid #0a0a0a;background:var(--s);color:#0a0a0a}
.t-game .hd{position:relative;padding-bottom:20px}.t-game .hd:after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:linear-gradient(90deg,var(--a),#a855f7)}.t-game .logo{width:64px;height:64px;max-width:64px;border-radius:50%;object-fit:cover;border:2px solid var(--a)}.t-game .ti{text-shadow:0 0 18px var(--a)}.t-game .box{background:var(--s)}.t-game th,.t-game .sum .gt td,.t-game .bdg{background:linear-gradient(90deg,var(--a),#a855f7);color:#0d0f1a}.t-game .sum .gt td:first-child{color:#0d0f1a}
.t-pol .hd{border-bottom:1px solid var(--i);padding-bottom:16px}.t-pol .ti{font-size:48px;font-style:italic;text-transform:lowercase;letter-spacing:0;font-weight:600}.t-pol .th3{gap:18px;padding:6px 10px}.t-pol .th3 img{background:#fff;border:0;border-radius:2px;padding:8px 8px 28px;height:130px;box-shadow:0 6px 14px rgba(61,52,42,.22);transform:rotate(-2.5deg)}.t-pol .th3 img:nth-child(2){transform:rotate(2deg)}.t-pol .box{background:#fffaf0;border-radius:2px}.t-pol th{background:none;color:var(--a);border-bottom:2px solid var(--a)}.t-pol .sum .gt td{background:none;color:var(--i);border-top:2px solid var(--a);border-bottom:2px solid var(--a);border-radius:0!important}.t-pol .sum .gt td:first-child{color:var(--i)}
.vfi.w-m{width:440px;min-height:0;padding:28px 22px;margin:0 auto;font-size:12.5px}.w-m .hd{flex-direction:column;align-items:center;text-align:center;gap:10px}.w-m .brand{flex-direction:column;align-items:center}.w-m .tt{text-align:center}.w-m .ti{font-size:26px}.w-m .meta,.w-m .info,.w-m .cx{grid-template-columns:1fr}.w-m .sum table{width:100%}.w-m th.c:first-child,.w-m td.c:first-child{display:none}.w-m .pz{flex-direction:column;text-align:center}.w-m .bdg{align-self:center}.t-quick .box{border-radius:16px}
.vfi.t-edit{padding:64px 70px}.t-edit .ti{font-size:56px;font-weight:500;letter-spacing:-.02em;text-transform:none;color:var(--i)}.t-edit .hd{border-bottom:1px solid var(--i);padding-bottom:26px;margin-bottom:34px}.t-edit .box{background:none;border:0;border-top:1px solid var(--i);border-radius:0;padding:10px 0}.t-edit th{background:none;color:var(--i);font-weight:500;border-bottom:1px solid var(--i)}.t-edit .sum .gt td{background:none;color:var(--i);border-top:1px solid var(--i);border-radius:0!important;font-weight:500}.t-edit .sum .gt td:first-child{color:var(--i)}.t-edit .bdg{background:none;color:var(--i);border:1px solid var(--i);border-radius:0}
.vfi.t-pop{border:4px solid var(--i)}.t-pop .ti{display:inline-block;background:#ffd400;color:var(--i);padding:6px 16px;border:3px solid var(--i);border-radius:14px;box-shadow:4px 4px 0 var(--i);font-size:30px}.t-pop .box{background:#fff;border:3px solid var(--i);border-radius:18px}.t-pop th{background:#ffd400;color:var(--i);border-top:3px solid var(--i);border-bottom:3px solid var(--i)}.t-pop td{border-bottom:2px solid var(--i)}.t-pop .sum .gt td{background:var(--a);color:var(--oa);border:3px solid var(--i);border-radius:14px!important}.t-pop .bdg{background:#ffd400;color:var(--i);border:3px solid var(--i)}
.vfi.t-mono{padding:56px 60px}.t-mono .ti{font-weight:300;letter-spacing:.32em;color:var(--i)}.t-mono .hd{border-bottom:5px solid var(--a);padding-bottom:20px}.t-mono .box{background:none;border:1px solid var(--a);border-radius:0}.t-mono th{background:var(--a);color:var(--oa);border-radius:0}.t-mono td{border-bottom:1px solid var(--a)}.t-mono .sum .gt td{background:var(--a);color:var(--oa);border-radius:0!important}.t-mono .sum .gt td:first-child{color:var(--oa)}
.t-cine .hd{border-bottom:1px solid var(--l);padding-bottom:20px}.t-cine .ti{font-weight:300;letter-spacing:.34em}.t-cine .box{background:var(--s);border-radius:4px}.t-cine th{background:none;color:var(--a);border-bottom:2px solid var(--a)}.t-cine .sum .gt td{background:none;color:var(--a);border-top:2px solid var(--a);border-radius:0!important}.t-cine .sum .gt td:first-child{color:var(--a)}.t-cine .th3 img{height:110px;border-radius:2px}
.t-copy th{background:none;color:var(--m);border-bottom:2px solid var(--i)}.t-copy tbody tr:nth-child(even) td{background:var(--s)}.t-copy .ti{color:var(--i);letter-spacing:.04em}.t-copy .sum .gt td{background:none;color:var(--i);border-top:2px solid var(--i);border-radius:0!important}.t-copy .sum .gt td:first-child{color:var(--i)}.t-copy .box{border-radius:6px}
.t-kor .ti{text-transform:lowercase;font-weight:700;letter-spacing:.02em}.t-kor .box{border:1.5px dashed var(--a);background:var(--s);border-radius:20px}.t-kor th{background:var(--s);color:var(--a)}.t-kor .bdg{background:var(--s);color:var(--a);border:1.5px dashed var(--a)}
.vfi.t-cafe{border-top:16px solid var(--a)}.t-cafe .ti{font-style:italic;text-transform:none;font-size:38px;letter-spacing:0}.t-cafe .hd{border-bottom:2px dotted var(--a);padding-bottom:18px}.t-cafe .box{background:var(--s);border:1px dashed var(--a);border-radius:6px}.t-cafe th{background:var(--a);color:var(--oa)}.t-cafe td{border-bottom:1px dotted var(--a)}
.t-saas .ti{font-size:30px;letter-spacing:-.02em;text-transform:none;font-weight:700}.t-saas .box{border-radius:12px;background:var(--s)}.t-saas th{background:var(--s);color:var(--m);border-bottom:1px solid var(--l)}.t-saas .bdg{border-radius:6px}
.vfi.t-flora{padding:64px 56px}.t-flora .hd{flex-direction:column;align-items:center;text-align:center;gap:14px}.t-flora .brand{justify-content:center}.t-flora .tt{text-align:center}.t-flora .ti{font-style:italic;font-size:44px;text-transform:none;letter-spacing:.02em;font-weight:600}.t-flora .box{background:var(--s);border-radius:18px 4px 18px 4px}.t-flora th{background:none;color:var(--a);border-top:1px solid var(--a);border-bottom:1px solid var(--a)}.t-flora .sum .gt td{background:none;color:var(--a);border-top:1px solid var(--a);border-bottom:1px solid var(--a);border-radius:0!important}.t-flora .sum .gt td:first-child{color:var(--a)}.t-flora .bdg{align-self:center}
.vfi.t-craft{border:3px double var(--a)}.t-craft .ti{font-style:italic;text-transform:none;font-size:40px;letter-spacing:0}.t-craft .box{background:var(--s);border:1.5px dashed var(--a);border-radius:10px}.t-craft th{background:var(--a);color:var(--oa)}.t-craft .deco.st{transform:rotate(-12deg);opacity:.8}
.vfi.t-gold{border:1px solid var(--a)}.vfi.t-gold:before{content:"";position:absolute;top:9px;left:9px;right:9px;bottom:9px;border:1px solid var(--a);pointer-events:none}.t-gold .ti{font-weight:500;letter-spacing:.3em}.t-gold .hd{border-bottom:1px solid var(--a);padding-bottom:22px}.t-gold .box{background:var(--s);border-radius:2px}.t-gold th{background:none;color:var(--a);border-bottom:1px solid var(--a)}.t-gold .bdg{background:none;color:var(--a);border:1px solid var(--a)}
.t-navy .hd,.t-fit .hd{background:var(--a);color:var(--oa);margin:-48px -52px 28px;padding:36px 52px}.t-navy .hd .sm,.t-navy .ti,.t-fit .hd .sm,.t-fit .ti{color:var(--oa)}.t-navy .box{border-radius:4px}.t-navy th{background:var(--s);color:var(--a);border-bottom:2px solid var(--a)}
.t-fit .hd{border-bottom:12px solid var(--i)}.t-fit .ti{font-style:italic;font-weight:900;font-size:46px}.t-fit .box{border-radius:0;border-left:6px solid var(--a)}.t-fit th{background:var(--i);color:var(--p);border-radius:0}.t-fit .sum .gt td{border-radius:0!important}.t-fit .bdg{border-radius:0}
.t-legal .ti{font-size:26px;letter-spacing:.24em;font-weight:700;color:var(--i)}.t-legal .hd{border-bottom:2px solid var(--a);padding-bottom:18px}.t-legal .box{background:none;border:1px solid var(--l);border-radius:0}.t-legal th{background:none;color:var(--i);border-top:2px solid var(--a);border-bottom:2px solid var(--a)}.t-legal .sum .gt td{background:none;color:var(--i);border-top:2px solid var(--a);border-radius:0!important}.t-legal .sum .gt td:first-child{color:var(--i)}.t-legal .dsc{border-left:4px solid var(--a)}
.t-fx .ti{font-size:28px;letter-spacing:-.01em;text-transform:none}.t-fx .box{border-radius:12px}.t-fx th{background:var(--s);color:var(--m)}
`;
var TED=`
#vfi-ov .tpg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0 6px}
#vfi-ov .tp{border:2px solid var(--vl);background:var(--vc2);color:inherit;border-radius:14px;padding:6px;text-align:left;font-size:12px;cursor:pointer}#vfi-ov .tp.on{border-color:var(--va)}
#vfi-ov .tp i{display:block;height:56px;border-radius:8px;border:1px solid;position:relative;margin-bottom:6px}#vfi-ov .tp u{position:absolute;left:8px;top:10px;width:55%;height:8px;border-radius:4px;text-decoration:none}
#vfi-ov .tp u+u{top:26px;height:5px;width:70%;opacity:.5}#vfi-ov .tp u+u+u{top:36px;width:34%}
`;
CSSI+=TC;CSS+=TC+TED;

/* ---------- UI editor: katalog, brand kit, kolom kreator, pembayaran cepat ---------- */
var tcat=0,CATS=['Influencer & Creator','Kreatif & Agensi','Bisnis & E-commerce','Jasa Profesional'];
/* ===== v23 — +20 template (10 Pink Kawaii + 10 Bisnis Premium). MURNI TAMBAHAN: tidak mengubah TPL/ID/CSS lama.
   Semua CSS di-scope ke .vfi.t-<id>; data invoice lama (st.tpl lama) dirender persis seperti sebelumnya. ===== */
CATS.push('Pink Kawaii','Bisnis Premium');
Object.assign(FONT,{
 fredoka:{l:'Fredoka + Nunito',h:'Fredoka',b:'Nunito',s:'sans',q:['Fredoka:wght@400;500;600;700','Nunito:wght@400;600;700;800']},
 silk:{l:'Silkscreen + DM Sans',h:'Silkscreen',b:'DM Sans',s:'sans',q:['Silkscreen:wght@400;700','DM+Sans:wght@400;500;600;700']},
 garamond:{l:'EB Garamond',h:'EB Garamond',b:'EB Garamond',s:'serif',q:['EB+Garamond:wght@400;500;600;700']},
 barlow:{l:'Barlow Condensed + Barlow',h:'Barlow Condensed',b:'Barlow',s:'sans',q:['Barlow+Condensed:wght@500;600;700','Barlow:wght@400;500;600;700']}});

/* --- ikon vektor SVG (currentColor -> mengikuti warna aksen) --- */
function sv(b,w,h,st,cls){var vb=arguments[5]||'0 0 24 24',m=/color:\s*(#[0-9a-fA-F]{3,8})/.exec(st),c=m?m[1]:(sv.c||'#f06a97'),
 g='<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="'+vb+'" fill="'+c+'" color="'+c+'"'+(/crisp/.test(st)?' shape-rendering="crispEdges"':'')+'>'+b+'</svg>';
 return'<img'+(cls===''?'':' class="deco"')+' alt="" aria-hidden="true" style="display:block;width:'+w+'px;height:'+h+'px;'+st+'" src="data:image/svg+xml;charset=utf-8,'+encodeURIComponent(g)+'">'}
function px(m){var o='';m.forEach(function(r,y){for(var x=0;x<r.length;x++)if(r[x]==='#')o+='<rect x="'+x+'" y="'+y+'" width="1" height="1"/>'});return o}
var I={
 bow:'<path d="M12 12C8 4 1 6 2 11c1 5 7 4 10 1 3 3 9 4 10-1 1-5-6-7-10 1z"/><path d="M10.5 13.5 7.5 21M13.5 13.5l3 7.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/><circle cx="12" cy="12" r="2.3" fill="#fff" fill-opacity=".85"/>',
 spk:'<path d="M12 1c1 7 4 10 11 11-7 1-10 4-11 11-1-7-4-10-11-11C8 11 11 8 12 1z"/>',
 hrt:'<path d="M12 21 3.4 12.6A5.2 5.2 0 0 1 12 6.2a5.2 5.2 0 0 1 8.6 6.4z"/>',
 cld:'<path d="M7 19a4.5 4.5 0 0 1-.7-8.9A6 6 0 0 1 17.8 10 4.5 4.5 0 0 1 17.5 19z"/>',
 cup:'<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17M8 3v3M12 3v3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
 cat:'<path d="M3 3.5 8 7a9.5 9.5 0 0 1 8 0l5-3.5V13a9 9 0 0 1-18 0z"/><circle cx="8.6" cy="12" r="1.3" fill="#fff"/><circle cx="15.4" cy="12" r="1.3" fill="#fff"/><path d="M11 14.6h2l-1 1.2z" fill="#fff"/><path d="M3.5 14.4l3 .6M3.5 17l3-1M20.5 14.4l-3 .6M20.5 17l-3-1" stroke="#fff" stroke-width=".9" stroke-linecap="round" fill="none"/>',
 bear:'<circle cx="5.2" cy="5" r="3.4"/><circle cx="18.8" cy="5" r="3.4"/><circle cx="12" cy="13.5" r="9"/><ellipse cx="12" cy="16.6" rx="3.8" ry="2.9" fill="#fff" fill-opacity=".7"/><circle cx="8.6" cy="11.6" r="1.2" fill="#4a2f2a"/><circle cx="15.4" cy="11.6" r="1.2" fill="#4a2f2a"/><ellipse cx="12" cy="15.4" rx="1.4" ry="1" fill="#4a2f2a"/>',
 ber:'<path d="M12 22C5 18.5 2.8 11.5 5 8.2c3-2 11-2 14 0 2.2 3.3 0 10.3-7 13.8z"/><path d="M6.5 7.5 12 3l5.5 4.5-5.5 1.3z" fill="#6fbf73"/><g fill="#fff" fill-opacity=".8"><circle cx="9" cy="12" r=".9"/><circle cx="15" cy="12" r=".9"/><circle cx="12" cy="15" r=".9"/><circle cx="10" cy="18" r=".8"/><circle cx="14.2" cy="18" r=".8"/></g>',
 sak:[0,72,144,216,288].map(function(a){return'<ellipse cx="12" cy="6.2" rx="3.6" ry="5" transform="rotate('+a+' 12 12)" fill-opacity=".9"/>'}).join('')+'<circle cx="12" cy="12" r="2" fill="#ffd36e"/>',
 boba:'<path d="M5 8h14l-1.6 12.5a1.5 1.5 0 0 1-1.5 1.3H8.1a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M4 8h16M14 8l3-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/><g fill="#fff" fill-opacity=".85"><circle cx="9" cy="18.6" r="1.2"/><circle cx="12" cy="18.8" r="1.2"/><circle cx="15" cy="18.6" r="1.2"/><circle cx="10.5" cy="16" r="1.1"/><circle cx="13.5" cy="16" r="1.1"/></g>',
 chk:'<circle cx="12" cy="12" r="10"/><path d="M7.3 12.5 10.6 15.7 16.8 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'},
 PH=px(['.##.##.','#######','#######','.#####.','..###..','...#...']),PS=px(['...#...','...#...','#######','.#####.','..###..','.##.##.','.#...#.']),PXS='shape-rendering:crispEdges;';
Object.assign(DECO,{
 pk_sakura:(sv.c='#f06a97',sv(I.sak,44,44,'top:12px;right:22px;color:#f58fb0')+sv(I.sak,26,26,'top:18px;right:76px;opacity:.7;transform:rotate(20deg)')+sv(I.sak,40,40,'bottom:18px;left:24px;opacity:.85;transform:rotate(-15deg)')+sv(I.cld,34,34,'bottom:20px;right:70px;color:#fff')),
 pk_kitty:(sv.c='#ff5fa2',sv(I.bow,40,40,'top:14px;left:20px;transform:rotate(-14deg)')+sv(I.cat,40,40,'bottom:18px;right:22px')+sv(I.hrt,18,18,'bottom:24px;right:70px;opacity:.7')+sv(I.hrt,14,14,'top:22px;right:30px;opacity:.6')),
 pk_berry:(sv.c='#ff6f91',sv(I.ber,40,40,'top:16px;right:22px;transform:rotate(12deg)')+sv(I.ber,24,24,'top:24px;right:70px;color:#ff8fa8;transform:rotate(-18deg)')+sv(I.ber,38,38,'bottom:18px;left:24px;transform:rotate(-10deg)')),
 pk_coquette:(sv.c='#e58fab',sv(I.bow,40,40,'top:20px;left:50%;margin-left:-20px')+sv(I.bow,30,30,'bottom:24px;left:28px;transform:rotate(-20deg);opacity:.85')+sv(I.bow,30,30,'bottom:24px;right:28px;transform:rotate(20deg);opacity:.85')),
 pk_sparkle:(sv.c='#ff1f8e',sv(I.spk,34,34,'top:14px;right:24px')+sv(I.spk,18,18,'top:24px;right:66px;color:#ff7ac8')+sv(I.spk,28,28,'bottom:18px;left:26px')+sv(I.spk,16,16,'bottom:30px;left:62px;color:#ff7ac8')+sv(I.spk,20,20,'bottom:22px;right:30px;color:#ffb3d6')),
 pk_teddy:(sv.c='#e8899f',sv(I.hrt,20,20,'top:20px;right:30px')+sv(I.hrt,13,13,'top:26px;right:58px;color:#f2b3c1')+sv(I.hrt,18,18,'bottom:22px;left:30px;color:#f2b3c1')),
 pk_y2k:(sv.c='#ff2bd6',sv(PH,40,34,PXS+'top:14px;right:24px',0,'0 0 7 6')+sv(PS,24,24,PXS+'top:18px;right:78px;color:#7ad7ff',0,'0 0 7 7')+sv(PH,26,22,PXS+'bottom:22px;left:28px;color:#3a0a3a',0,'0 0 7 6')+sv(PS,22,22,PXS+'bottom:22px;right:28px',0,'0 0 7 7')),
 pk_matcha:(sv.c='#e8a0b4',sv(I.boba,36,36,'top:14px;right:24px;color:#e8a0b4')+sv(I.cup,30,30,'bottom:20px;left:28px;color:#9db89a')+sv(I.hrt,16,16,'bottom:26px;right:30px;color:#f1b6c4')),
 pk_grid:(sv.c='#ff7aa8',sv(I.hrt,24,24,'top:16px;right:28px')+sv(I.hrt,14,14,'top:22px;right:60px;color:#ffb3cb')+sv(I.chk,24,24,'bottom:20px;left:28px')),
 pk_cloud:(sv.c='#f58fc0',sv(I.cld,48,48,'top:10px;right:20px;color:#fff')+sv(I.cld,30,30,'top:18px;right:76px;color:#fff;opacity:.8')+sv(I.cld,44,44,'bottom:16px;left:22px;color:#fff;opacity:.95')+sv(I.spk,18,18,'top:22px;left:48px;color:#fff')+sv(I.spk,14,14,'top:30px;left:78px;color:#ffe08a')+sv(I.spk,18,18,'bottom:24px;right:34px;color:#fff'))});

/* --- v23.1: ikon imut tambahan untuk 10 template pink (margin kiri/kanan/bawah, di belakang isi) --- */
Object.assign(I,{
 star:'<path d="M12 2.5l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.3 6.4 19.5l1.3-6.2L3 9l6.3-.7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
 paw:'<ellipse cx="12" cy="16.2" rx="5" ry="4"/><circle cx="5.3" cy="11" r="2"/><circle cx="9.5" cy="6.6" r="2.2"/><circle cx="14.5" cy="6.6" r="2.2"/><circle cx="18.7" cy="11" r="2"/>',
 chy:'<circle cx="7" cy="17" r="4.5"/><circle cx="17" cy="17" r="4.5"/><path d="M7 12.5C8 7 11 4 14 3M17 12.5C16 8 14.5 5 14 3" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M14 3c3-1 6 0 7 2-3 1-6 0-7-2z" fill="#6fbf73"/><circle cx="5.6" cy="15.6" r="1.1" fill="#fff" fill-opacity=".7"/><circle cx="15.6" cy="15.6" r="1.1" fill="#fff" fill-opacity=".7"/>',
 cup2:'<path d="M5 12h14l-2 9H7z" fill-opacity=".6"/><path d="M4 12a4 4 0 0 1 3-4 4 4 0 0 1 5-4 4 4 0 0 1 5 4 4 4 0 0 1 3 4z"/><circle cx="12" cy="3.2" r="1.9" fill="#ff4d6d"/><path d="M9 14v5M12 14v5M15 14v5" stroke="#fff" stroke-opacity=".6" stroke-width="1"/>',
 ice:'<path d="M7 12l5 10 5-10z" fill-opacity=".6"/><circle cx="12" cy="9" r="5.8"/><circle cx="9.5" cy="7.6" r="1" fill="#fff" fill-opacity=".85"/><path d="M9.4 15l5 .1M10.6 18l2.8 0" stroke="#fff" stroke-opacity=".6" stroke-width="1"/>',
 bfl:'<path d="M12 12C8 3 2 4 3 9c1 4 5 4 9 3zM12 12c4-9 10-8 9-3-1 4-5 4-9 3z"/><path d="M12 12c-5 2-8 7-4 8 3 0 4-4 4-8zM12 12c5 2 8 7 4 8-3 0-4-4-4-8z" fill-opacity=".7"/><rect x="11.3" y="8" width="1.4" height="10" rx=".7"/>',
 bun:'<ellipse cx="8.6" cy="6" rx="2.4" ry="5.5"/><ellipse cx="15.4" cy="6" rx="2.4" ry="5.5"/><circle cx="12" cy="15" r="7.5"/><ellipse cx="8.6" cy="6.4" rx="1" ry="3.4" fill="#fff" fill-opacity=".5"/><ellipse cx="15.4" cy="6.4" rx="1" ry="3.4" fill="#fff" fill-opacity=".5"/><circle cx="9.3" cy="14" r="1" fill="#4a2f2a"/><circle cx="14.7" cy="14" r="1" fill="#4a2f2a"/><path d="M11 16.4h2l-1 1z" fill="#fff"/><circle cx="7.2" cy="16.5" r="1.3" fill="#fff" fill-opacity=".45"/><circle cx="16.8" cy="16.5" r="1.3" fill="#fff" fill-opacity=".45"/>',
 moon:'<path d="M19.5 15.5A8 8 0 0 1 8.5 4.5a8 8 0 1 0 11 11z"/>',
 lol:'<circle cx="12" cy="9" r="6.8"/><path d="M12 15.5V23" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M12 9m-3.6 0a3.6 3.6 0 1 0 7.2 0 3.6 3.6 0 1 0-7.2 0" fill="none" stroke="#fff" stroke-width="1.5" stroke-opacity=".85"/>',
 dai:[0,45,90,135,180,225,270,315].map(function(a){return'<ellipse cx="12" cy="6" rx="2.3" ry="4.2" transform="rotate('+a+' 12 12)" fill-opacity=".9"/>'}).join('')+'<circle cx="12" cy="12" r="2.6" fill="#ffd36e"/>',
 don:'<path fill-rule="evenodd" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/><g stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-opacity=".9"><path d="M6 8l1.5 1M17.5 7l-1.2 1.4M18.4 14l-1.6-.6M7 16.5l1.6-.8M12 4.8v1.3"/></g>',
 fce:'<ellipse cx="12" cy="13" rx="9.5" ry="8"/><circle cx="8.3" cy="12.5" r="1.3" fill="#4a2f2a"/><circle cx="15.7" cy="12.5" r="1.3" fill="#4a2f2a"/><ellipse cx="6" cy="15" rx="1.8" ry="1.1" fill="#fff" fill-opacity=".5"/><ellipse cx="18" cy="15" rx="1.8" ry="1.1" fill="#fff" fill-opacity=".5"/><path d="M10.4 15.2q1.6 1.6 3.2 0" stroke="#4a2f2a" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
 rbw:'<g fill="none" stroke-width="2.4" stroke-linecap="round"><path d="M2.5 19a9.5 9.5 0 0 1 19 0" stroke="#ff7ac8"/><path d="M6 19a6 6 0 0 1 12 0" stroke="#ffd36e"/><path d="M9.5 19a2.5 2.5 0 0 1 5 0" stroke="#7ad7ff"/></g>'});
function ad(id,c,s){sv.c=c;DECO[id]+=s}
function sd(L,R,c){/* L,R: [ikon,ukuran,top%,gaya] kiri / kanan */var o='';L.forEach(function(a){o+=sv(I[a[0]],Math.round(a[1]*1.4),Math.round(a[1]*1.4),'top:'+a[2]+'%;left:'+(a[4]||12)+'px;'+(a[3]||''))});R.forEach(function(a){o+=sv(I[a[0]],Math.round(a[1]*1.4),Math.round(a[1]*1.4),'top:'+a[2]+'%;right:'+(a[4]||12)+'px;'+(a[3]||''))});return o}
ad('pk_sakura','#f58fb0',sd([['sak',26,24,'opacity:.8'],['bfl',26,42,'color:#f9a8c6'],['bun',28,60,'color:#f9c4d6'],['sak',22,78,'opacity:.7;transform:rotate(30deg)']],[['bfl',24,30,'color:#f9a8c6;transform:scaleX(-1)'],['sak',24,48,'opacity:.8;transform:rotate(-20deg)'],['star',24,66,'color:#ffd36e'],['bun',26,82,'color:#f9c4d6']])+sv(I.bun,34,34,'bottom:16px;left:50%;margin-left:-17px;color:#f9c4d6'));
ad('pk_kitty','#ff5fa2',sd([['paw',24,26,'opacity:.55;transform:rotate(-20deg)'],['cat',26,44,'opacity:.9'],['paw',22,62,'opacity:.5;transform:rotate(15deg)'],['hrt',20,80,'opacity:.7']],[['paw',22,30,'opacity:.55;transform:rotate(20deg)'],['bow',26,48,'opacity:.9;transform:rotate(12deg)'],['paw',24,66,'opacity:.5;transform:rotate(-15deg)'],['star',22,84,'color:#ffd36e']])+sv(I.cat,34,34,'bottom:16px;left:50%;margin-left:-17px;opacity:.9'));
ad('pk_berry','#ff6f91',sd([['chy',26,24],['cup2',26,42,'color:#ff9bb3'],['ice',26,60,'color:#ffb3c6'],['hrt',20,78,'opacity:.7']],[['don',26,30,'color:#ff9bb3'],['ber',26,48],['chy',24,66,'transform:rotate(-12deg)'],['cup2',26,82,'color:#ff9bb3']])+sv(I.ice,34,34,'bottom:16px;left:50%;margin-left:-17px;color:#ffb3c6'));
ad('pk_coquette','#e58fab',sd([['hrt',20,24,'opacity:.7'],['bfl',26,42,'color:#f3b6c8'],['chy',24,60],['bow',22,78,'opacity:.8']],[['bow',22,28,'opacity:.8'],['star',22,46,'color:#f3c1cf'],['hrt',22,64,'opacity:.7'],['bfl',26,82,'color:#f3b6c8;transform:scaleX(-1)']])+sv(I.hrt,24,24,'bottom:18px;left:50%;margin-left:-12px;opacity:.7'));
ad('pk_sparkle','#ff1f8e',sd([['spk',24,24,'color:#ff7ac8'],['fce',28,42,'color:#ffb3d6'],['lol',26,60,'color:#ff7ac8'],['moon',22,78,'color:#ffd36e']],[['hrt',22,30,'color:#ff7ac8'],['star',26,48,'color:#ffd36e'],['spk',22,66,'color:#ffb3d6'],['fce',26,82,'color:#ffb3d6']])+sv(I.hrt,26,26,'bottom:16px;left:50%;margin-left:-13px;color:#ff7ac8'));
ad('pk_teddy','#e8899f',sd([['paw',24,26,'color:#d9b3a0;opacity:.8'],['bear',26,44,'color:#d9b3a0'],['cup2',24,62,'color:#f2b3c1'],['hrt',20,80,'color:#f2b3c1']],[['hrt',20,30,'color:#f2b3c1'],['bun',26,48,'color:#e8c9b8'],['star',22,66,'color:#f0c987'],['paw',22,84,'color:#d9b3a0;opacity:.8']])+sv(I.bear,34,34,'bottom:16px;left:50%;margin-left:-17px;color:#d9b3a0'));
ad('pk_y2k','#ff2bd6',sd([['bfl',26,26,'color:#7ad7ff'],['chy',24,44,'color:#ff2bd6'],['bfl',24,62,'color:#ff9de2'],['fce',24,80,'color:#ff9de2']],[['chy',24,30,'color:#ff2bd6;transform:rotate(-10deg)'],['star',22,48,'color:#7ad7ff'],['spk',22,66,'color:#3a0a3a'],['bfl',24,84,'color:#7ad7ff;transform:scaleX(-1)']])+sv(PH,34,29,PXS+'bottom:18px;left:50%;margin-left:-17px',0,'0 0 7 6'));
ad('pk_matcha','#e8a0b4',sd([['dai',26,24,'color:#f6c9d3'],['cup',26,42,'color:#9db89a'],['bun',26,60,'color:#e9d8cf'],['hrt',20,78,'color:#f1b6c4']],[['boba',26,30,'color:#e8a0b4'],['dai',24,48,'color:#f6c9d3'],['cup2',26,66,'color:#c9d9c1'],['star',22,84,'color:#cfe0c8']])+sv(I.boba,32,32,'bottom:16px;left:50%;margin-left:-16px;color:#e8a0b4'));
ad('pk_grid','#ff7aa8',sd([['hrt',22,24],['fce',26,42,'color:#ffb3cb'],['chk',22,60],['star',22,78,'color:#ffd36e']],[['chk',22,30],['hrt',20,48,'color:#ffb3cb'],['cup2',26,66,'color:#ff9bb3'],['fce',24,84,'color:#ffb3cb']])+sv(I.chk,28,28,'bottom:16px;left:50%;margin-left:-14px'));
ad('pk_cloud','#f58fc0',sd([['moon',24,24,'color:#ffe08a'],['rbw',32,42],['star',22,60,'color:#fff'],['bfl',24,78,'color:#fff']],[['star',22,28,'color:#ffe08a'],['cld',28,46,'color:#fff'],['spk',20,64,'color:#fff'],['rbw',30,82]])+sv(I.rbw,38,38,'bottom:14px;left:50%;margin-left:-19px'));
var MK={bear:sv(I.bear,38,38,'color:#c9967a;display:block;margin:0 0 -6px auto','') ,boba:sv(I.boba,34,34,'color:#e8a0b4;display:block;margin:0 0 -6px auto',''),chk:sv(I.chk,30,30,'color:#ff7aa8;display:block;margin:0 0 -6px auto','')};
/* ikon maskot di atas baris Total: hanya muncul bila template punya T.mk; selain itu keluaran xr() lama tidak berubah */
var _xr=xr;xr=function(d,c,T,pos){var o=_xr(d,c,T,pos);if(pos===0&&T&&T.mk&&MK[T.mk])o+='<tr class="mk"><td colspan="2">'+MK[T.mk]+'</td></tr>';return o};

/* --- registry: id baru berprefiks pk_/bz_ (tidak bentrok dengan 20 id lama) --- */
[['pk_sakura',4,'Sakura Blossom Cute','fredoka',['#fff5f8','#5b2a3f','#b0788d','#f6cfdd','#ffe6ee','#f06a97'],{b:'Sakura Collab',cx:1,x:'pk_sakura'}],
 ['pk_kitty',4,'Kawaii Kitty & Ribbons','fredoka',['#ffeaf3','#5a2342','#b0698f','#ffc2db','#ffd6e7','#ff5fa2'],{b:'Kawaii Pack',cx:1,x:'pk_kitty'}],
 ['pk_berry',4,'Strawberry Milkshake','fredoka',['#ffffff','#5a2a35','#b77a86','#ffd5de','#fff0f3','#ff6f91'],{b:'Sweet Collab',cx:1,x:'pk_berry'}],
 ['pk_coquette',4,'Cozy Coquette Bow','cormorant',['#fff7f9','#6b3b4c','#b88a98','#f3d3dc','#fdeaf0','#e58fab'],{b:'Coquette Set',cx:1,x:'pk_coquette'}],
 ['pk_sparkle',4,'Chibi Creator Sparkle','fredoka',['#fff0f7','#4a1030','#a8507e','#ffb3d6','#ffdcec','#ff1f8e'],{b:'TikTok / Reels Endorse',cx:1,x:'pk_sparkle'}],
 ['pk_teddy',4,'Teddy Bear Warmth','fredoka',['#fbf1e6','#5c3a33','#a88679','#ecd3c4','#f6e3d6','#e8899f'],{b:'Cozy Collab',cx:1,x:'pk_teddy',mk:'bear'}],
 ['pk_y2k',4,'Y2K Cyber Pink','silk',['#fff0fb','#3a0a3a','#9c3f93','#ff9de2','#ffd9f5','#ff2bd6'],{b:'Y2K Drop',cx:1,x:'pk_y2k'}],
 ['pk_matcha',4,'Matcha & Pink Latte','fredoka',['#fbf7f4','#4a4036','#8f8a7c','#dfe3d0','#f1ece6','#e8a0b4'],{b:'Latte Collab',cx:1,x:'pk_matcha',mk:'boba'}],
 ['pk_grid',4,'Bubblegum Grid UI','fredoka',['#fff5f8','#552538','#a97587','#ffd0df','#ffffff','#ff7aa8'],{b:'Paket Konten',cx:1,x:'pk_grid',mk:'chk'}],
 ['pk_cloud',4,'Dreamy Cloud & Pink Sky','fredoka',['#fdf0fa','#4b3868','#8a7aa8','#e2d0f5','#fbe6f3','#f58fc0'],{b:'Dreamy Collab',cx:1,x:'pk_cloud'}],
 ['bz_obsidian',5,'Executive Obsidian & Gold','bodoni',['#08080a','#f3ecd8','#a89c80','#4a3f1f','#121214','#cfa83a'],{dl:'Layanan Eksekutif'}],
 ['bz_swiss',5,'Minimalist Swiss Corporate','inter',['#ffffff','#111111','#6b6b6b','#d4d4d4','#f2f2f2','#3d3d3d'],{dl:'Deskripsi'}],
 ['bz_indigo',5,'SaaS Modern Indigo','sora',['#ffffff','#1e2140','#64698c','#e0e3f5','#f3f4fc','#4f46e5'],{dl:'Paket / Langganan',ql:'Seat',x:'dpp'}],
 ['bz_slate',5,'Architectural Slate','barlow',['#e9eaea','#1d2022','#5d6366','#9aa0a3','#dcdedf','#3b4144'],{dl:'Lingkup Pekerjaan'}],
 ['bz_navy',5,'Global Enterprise Navy','archivo',['#ffffff','#0a1a33','#52627e','#c9d3e3','#eef2f8','#0a2a5e'],{dl:'Deskripsi Layanan'}],
 ['bz_legal',5,'Legal & Advisory Formal','garamond',['#fffefb','#1b1b1b','#5a5a5a','#b9b4a8','#f7f5ef','#1b2a49'],{dl:'Jasa Hukum / Advisory',ql:'Jam',x:'dsc'}],
 ['bz_fintech',5,'Fintech Neo-Clean','manrope',['#ffffff','#0b2b2a','#5b7a78','#d3ece8','#effaf8','#0f766e'],{dl:'Layanan / Produk',x:'dpp'}],
 ['bz_estate',5,'Luxury Real Estate & Property','cormorant',['#f6f1e7','#26262a','#7d766a','#d9ccb0','#ede4d2','#b89a5a'],{dl:'Properti / Layanan'}],
 ['bz_vc',5,'Venture Capital Dark Mode','grotesk',['#0c0e12','#e9edf2','#8b95a5','#222833','#141820','#34d399'],{dl:'Deskripsi',ql:'Unit'}],
 ['bz_consult',5,'Consulting Executive Grey','dm',['#f4f5f6','#222426','#6d7378','#c9cdd1','#e8eaec','#8d949b'],{dl:'Pekerjaan / Retainer',ql:'Jam'}]
].forEach(function(a){if(!TPL.some(function(t){return t.id===a[0]}))TPL.push(mkT(a[0],a[1],a[2],a[3],a[4],a[5]))});

/* --- CSS ber-scope: setiap aturan diawali .vfi.t-<id> atau .vfi[class*=" t-pk_/t-bz_"] --- */
var PK='.vfi[class*=" t-pk_"]',BZ='.vfi[class*=" t-bz_"]',V=
 PK+'{padding:58px 62px}'+PK+':before{content:"";position:absolute;top:16px;left:16px;right:16px;bottom:16px;border:2.5px dashed var(--l);border-radius:30px;pointer-events:none;z-index:0}'
+PK+'>*,'+BZ+'>*{position:relative;z-index:1}'+PK+'>.deco,'+BZ+'>.deco{position:absolute;z-index:0}'
+PK+' .box{border-radius:24px;background:var(--s);border:2px solid var(--l)}'+PK+' .ti{font-size:38px;font-weight:700;letter-spacing:.01em;text-transform:none}'
+PK+' th:first-child{border-radius:16px 0 0 16px}'+PK+' th:last-child{border-radius:0 16px 16px 0}'+PK+' td{border-bottom:2px dotted var(--l)}'
+PK+' .sum .gt td:first-child{border-radius:99px 0 0 99px;padding-left:20px}'+PK+' .sum .gt td:last-child{border-radius:0 99px 99px 0;padding-right:20px}'
+PK+' .pz{border-radius:24px;border:2px solid var(--l)}'+PK+' .th3 img{border-radius:18px;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.08)}'+PK+' .sg .ln{border-top:2px dotted var(--i)}'
+'.vfi .sum tr.mk td{padding:0 12px;border:0;background:none;line-height:0;text-align:right}'
+BZ+'{padding:52px 56px 64px}';
var C={
pk_sakura:'&{background:linear-gradient(170deg,#fff8fb,#ffe0ea)}& .ti{color:var(--a)}& .box{background:rgba(255,255,255,.7)}& th{background:linear-gradient(90deg,#f58fb0,var(--a))}',
pk_kitty:'&:before{border:3px dotted var(--a)}& .box{background:#fff;border-color:var(--a)}& .ti{text-shadow:3px 3px 0 #fff,5px 5px 0 var(--l);color:var(--a)}& .bdg{border:2px solid #fff;box-shadow:0 0 0 2px var(--a)}',
pk_berry:'&:after{content:"";position:absolute;top:0;left:0;right:0;height:16px;background:repeating-linear-gradient(90deg,var(--a) 0 10px,#fff 10px 20px);opacity:.85;z-index:0}& .hd{border-bottom:3px dotted var(--a);padding-bottom:18px}& .ti{color:var(--a)}& th{background:var(--a)}',
pk_coquette:'&:before{border:0;top:0;left:0;right:0;bottom:auto;height:18px;border-radius:0;background:radial-gradient(circle at 10px -1px,var(--p) 8px,var(--a) 8.5px,var(--a) 10px,transparent 10.5px) 0 0/20px 18px repeat-x}&:after{content:"";position:absolute;left:0;right:0;bottom:0;height:18px;transform:scaleY(-1);background:radial-gradient(circle at 10px -1px,var(--p) 8px,var(--a) 8.5px,var(--a) 10px,transparent 10.5px) 0 0/20px 18px repeat-x;z-index:0}& .ti{font-size:46px;font-style:italic;font-weight:600;color:var(--a)}& .box{border-radius:20px;border:1px solid var(--a);background:#fffafc}& th{background:none;color:var(--a);border-top:1px solid var(--a);border-bottom:1px solid var(--a);border-radius:0!important}& td{border-bottom:1px dotted var(--a)}',
pk_sparkle:'&{background:radial-gradient(circle at 88% 6%,#ffc6e4,transparent 38%),var(--p)}& .ti{color:var(--a);text-shadow:0 0 14px #ffb3d6;font-weight:700}& th{background:linear-gradient(90deg,var(--a),#ff7ac8)}& .box{background:#fff;border-color:#ffb3d6;box-shadow:0 6px 0 #ffd3e8}& .sum .gt td{background:linear-gradient(90deg,var(--a),#ff7ac8)}',
pk_teddy:'&:before{border:3px dashed #e3bfae}& .box{background:#fff8f0;border:2px dashed #e3bfae}& .ti{color:#8a5a4c}& th{background:#e3bfae;color:#5c3a33}& .sum .gt td{background:var(--a)}',
pk_y2k:'&{background:linear-gradient(135deg,#fff0fb,#f3d9ff 60%,#d9f2ff)}&:before{border:2px solid var(--i);border-radius:14px}& .ti{font-size:28px;letter-spacing:.06em;text-transform:uppercase;font-weight:400;color:var(--a);text-shadow:3px 3px 0 #ffd0f4}& .box{border:2px solid var(--i);border-radius:12px;box-shadow:4px 4px 0 var(--a);background:#fff}& th{background:var(--i);color:#ff9de2;border-radius:0!important}& .sum .gt td{background:var(--i);color:#ff9de2!important;border-radius:0!important}& .lb{font-family:var(--fh)}& td{border-bottom:2px dashed var(--l)}',
pk_matcha:'&:before{border-color:#cfe0c8}& .hd{border-bottom:3px solid #cfe0c8;padding-bottom:16px}& .ti{color:#6f8f6a}& .box{background:#f3f6ec;border:2px solid #dfe3d0}& th{background:#9db89a;color:#fff}& td{border-bottom:2px dotted #cfe0c8}& .sum .gt td{background:var(--a)}',
pk_grid:'&{background-color:#ffe9f0;background-image:linear-gradient(var(--l) 1px,transparent 1px),linear-gradient(90deg,var(--l) 1px,transparent 1px);background-size:28px 28px}&:before{border:0}& .box{border-radius:16px;background:#fff}& .lb:before{content:"\\2713";display:inline-block;width:16px;height:16px;line-height:16px;margin-right:6px;border-radius:50%;background:var(--a);color:#fff;text-align:center;font-size:10px;letter-spacing:0}& table{border-collapse:separate;border-spacing:0 8px}& .sum table{border-spacing:0;border-collapse:collapse}& th,& td{border:0}& tbody td{background:#fff}& tbody td:first-child{border-radius:14px 0 0 14px}& tbody td:last-child{border-radius:0 14px 14px 0}& .sum tbody td{background:none}& .sum .gt td{background:var(--a)}',
pk_cloud:'&{background:linear-gradient(180deg,#ffd0e6 0%,#ecd7fb 48%,#fdf0fa 100%)}&:before{border:2.5px dashed #fff}& .ti{color:#b0479a;text-shadow:0 2px 0 #fff}& .box{background:rgba(255,255,255,.78);border-color:#fff;border-radius:26px}& th{background:linear-gradient(90deg,#f58fc0,#b79cf0)}& .sum .gt td{background:linear-gradient(90deg,#f58fc0,#b79cf0)}',
bz_obsidian:'&{border:1px solid var(--a)}&:before{content:"";position:absolute;top:10px;left:10px;right:10px;bottom:10px;border:1px solid var(--a);pointer-events:none;z-index:0}& .ti{font-weight:500;letter-spacing:.32em;color:var(--a)}& .hd{padding-bottom:22px;border-bottom:1px solid var(--a)}& .hd:after{content:"";position:absolute;left:0;right:0;bottom:-5px;height:1px;background:linear-gradient(90deg,transparent,var(--a),transparent)}& .box{border-radius:0;border:1px solid var(--l);background:var(--s)}& th{background:none;color:var(--a);border-bottom:1px solid var(--a);border-radius:0}& .sum .gt td{border-radius:0!important}& .bdg{background:none;border:1px solid var(--a);color:var(--a)}',
bz_swiss:'&{padding:56px 60px}& .hd{border-top:8px solid var(--i);padding-top:20px}& .ti{font-size:60px;font-weight:800;letter-spacing:-.04em;line-height:.9;text-transform:none;color:var(--i)}& .box{background:var(--s);border:0;border-radius:0}& .lb{color:var(--i)}& th{background:none;color:var(--m);border-bottom:2px solid var(--i);border-radius:0}& td{border-bottom:1px solid var(--l)}& .sum .gt td{background:none;color:var(--i);border-top:3px solid var(--i);border-radius:0!important}& .sum .gt td:first-child{color:var(--i)}',
bz_indigo:'& .hd{background:linear-gradient(120deg,var(--a),#6d5ef0 65%,#38bdf8);margin:-52px -56px 28px;padding:36px 56px;color:#fff}& .hd .sm,& .hd .sn,& .ti,& .tn{color:#fff}& .ti{font-size:32px;text-transform:none;letter-spacing:-.02em}& .box{border-radius:14px}& th{background:var(--s);color:var(--a);border-bottom:2px solid var(--a)}& .sum .gt td{background:var(--a)}& .bdg{border-radius:8px}',
bz_slate:'&{background:repeating-linear-gradient(0deg,rgba(0,0,0,.018) 0 2px,transparent 2px 4px),var(--p);border-top:12px solid var(--i)}&:after{content:"";position:absolute;left:0;right:0;bottom:0;height:12px;background:repeating-linear-gradient(45deg,var(--i) 0 10px,var(--p) 10px 20px);z-index:0}& .ti{font-size:46px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--i)}& .box{background:transparent;border:2px solid var(--i);border-radius:0}& th{background:var(--i);color:var(--p);border-radius:0}& td{border-bottom:2px solid var(--l)}& .sum .gt td{background:var(--i);color:var(--p);border-radius:0!important}& .sum .gt td:first-child{color:var(--p)}',
bz_navy:'& .hd{background:var(--a);color:#fff;margin:-52px -56px 28px;padding:38px 56px;border-bottom:5px solid #c9a24a}& .hd .sm,& .hd .sn,& .ti,& .tn{color:#fff}& .ti{font-weight:800;font-size:38px;letter-spacing:.12em}&:after{content:"";position:absolute;left:0;right:0;bottom:0;height:10px;background:var(--a);z-index:0}& .box{border-radius:2px;border-left:4px solid var(--a)}& th{background:var(--s);color:var(--a);border-bottom:2px solid var(--a);border-radius:0}& .sum .gt td{border-radius:0!important}',
bz_legal:'& .hd{flex-direction:column;align-items:center;text-align:center;border-bottom:3px double var(--a);padding-bottom:18px}& .brand{justify-content:center}& .tt{text-align:center}& .ti{font-size:26px;letter-spacing:.32em;text-transform:uppercase;font-weight:600;color:var(--i)}& .box{background:none;border:1px solid var(--l);border-radius:0}& .lb{letter-spacing:.2em}& th{background:none;color:var(--i);border-top:2px solid var(--a);border-bottom:2px solid var(--a);border-radius:0}& .sum .gt td{background:none;color:var(--i);border-top:2px solid var(--a);border-radius:0!important}& .sum .gt td:first-child{color:var(--i)}& .dsc{border-left:4px solid var(--a)}&:after{content:"DOKUMEN RAHASIA \\00B7 CONFIDENTIAL";position:absolute;left:0;right:0;bottom:22px;text-align:center;font-size:9px;letter-spacing:.3em;color:var(--m);z-index:0}',
bz_fintech:'&:before{content:"";position:absolute;top:0;right:0;width:340px;height:300px;background:radial-gradient(circle at 100% 0,#c9f5ec,transparent 62%);pointer-events:none;z-index:0}& .ti{font-size:30px;text-transform:none;font-weight:800;letter-spacing:-.02em}& .tn{display:inline-block;background:#d9f7f0;color:var(--a);padding:3px 11px;border-radius:99px}& .box{border-radius:14px;background:var(--s)}& th{background:none;color:var(--m);border-bottom:2px solid var(--a)}& .sum .gt td{background:linear-gradient(90deg,var(--a),#14b8a6);color:#fff}& .sum .gt td:first-child{color:#fff}& .bdg{background:#d9f7f0;color:var(--a)}',
bz_estate:'& .hd{background:#26262a;color:#f6f1e7;margin:-52px -56px 28px;padding:40px 56px;border-bottom:4px solid var(--a)}& .hd .sm,& .hd .sn,& .tn{color:#f6f1e7}& .ti{font-size:40px;font-weight:500;letter-spacing:.2em;color:var(--a)}& .box{background:var(--s);border:1px solid var(--l);border-radius:0}& th{background:none;color:var(--a);border-bottom:1px solid var(--a);border-radius:0}& .sum .gt td{background:#26262a;color:var(--a);border-radius:0!important}& .sum .gt td:first-child{color:var(--a)}&:after{content:"";position:absolute;left:56px;right:56px;bottom:26px;height:1px;background:var(--a);z-index:0}',
bz_vc:'&{background:radial-gradient(var(--l) 1px,transparent 1px) 0 0/22px 22px,var(--p)}& .ti{font-size:22px;letter-spacing:.3em;font-weight:500;color:var(--i)}& .ti:before{content:"";display:inline-block;width:10px;height:10px;background:var(--a);margin-right:12px}& .box{background:var(--s);border:1px solid var(--l);border-radius:6px}& th{background:none;color:var(--m);border-bottom:1px solid var(--a);font-size:9.5px;border-radius:0}& td{border-bottom:1px solid var(--l)}& td.r,& td.c{font-variant-numeric:tabular-nums}& .sum .gt td{background:none;color:var(--a);border-top:1px solid var(--a);border-bottom:1px solid var(--a);border-radius:0!important}& .sum .gt td:first-child{color:var(--a)}& .bdg{background:none;border:1px solid var(--a);color:var(--a)}',
bz_consult:'& .hd{border-bottom:1px solid var(--i);padding-bottom:20px;position:relative}& .hd:after{content:"";position:absolute;left:0;right:0;bottom:-6px;height:3px;background:linear-gradient(90deg,#9aa1a7,#eceef0,#9aa1a7,#eceef0,#9aa1a7)}& .ti{font-weight:600;letter-spacing:.18em;font-size:28px;color:var(--i)}& .box{background:#fff;border:1px solid var(--l);border-radius:2px}& th{background:linear-gradient(180deg,#eceef0,#cfd3d7);color:var(--i);border-radius:0}& .sum .gt td{background:linear-gradient(90deg,#3a3f44,#5b6168);color:#fff;border-radius:0!important}& .sum .gt td:first-child{color:#fff}'};
Object.keys(C).forEach(function(k){V+=C[k].replace(/&/g,'.vfi.t-'+k)});
CSSI+=V;CSS+=V;

function tpGrid(){return TPL.filter(function(t){return t.c===tcat}).map(function(t){return'<button class="tp'+(st.tpl===t.id?' on':'')+'" data-tpl="'+t.id+'"><i style="background:'+t.p+';border-color:'+t.l+'"><u style="background:'+t.a+'"></u><u style="background:'+t.m+'"></u><u style="background:'+t.m+'"></u></i><span>'+(TPL.indexOf(t)+1)+'. '+h(t.n)+'</span></button>'}).join('')}
function tplCards(){var T=curTpl();tcat=T?T.c:tcat;
 return'<div class="card" style="margin-top:12px"><div class="hdr"><span>✨ Katalog Template ('+TPL.length+')</span></div><div class="body"><div class="seg" id="tpCat">'+CATS.map(function(n,i){return'<button data-cat="'+i+'" class="'+(i===tcat?'on':'')+'">'+n+'</button>'}).join('')+'</div><div class="tpg" id="tpg">'+tpGrid()+'</div><button class="bt gh sm2" data-tpl="">Kembali ke gaya Klasik (4 gaya)</button><div class="hint">Gaya &amp; tema di kartu “Tampilan” hanya untuk mode Klasik. Warna aksen berlaku di semua template; pilih swatch otomatis untuk warna asli template.</div></div></div>'
 +'<div class="card"><div class="hdr"><span>🎨 Brand Kit</span></div><div class="body"><div class="g2"><label class="fl"><small>Warna aksen utama</small><input type="color" class="in" id="bk_c" value="'+hex(st.accent||(T&&T.a)||'#b8860b')+'" style="padding:3px;height:44px"></label><label class="bt sm2" style="margin-top:22px">🖼️ Upload logo<input id="bk_l" type="file" accept="image/*" hidden></label></div><label class="bt gh sm2">✍️ Tanda tangan (latar otomatis transparan)<input id="bk_s" type="file" accept="image/*" hidden></label><button class="bt gh sm2" id="bk_save">💾 Simpan Brand Kit</button></div></div>'}
function chips(k,a){return'<div class="seg">'+a.map(function(v){return'<button data-ch="'+k+'" data-v="'+h(v)+'">+ '+h(v)+'</button>'}).join('')+'</div>'}
function xCards(){return'<div class="card"><div class="hdr"><span>📣 Kolom Kreator &amp; Iklan</span></div><div class="body">'
 +ck('cxd','Deliverables Media Sosial')+area('x_del','Deliverables','1 Reels + 3 IG Story',D.cx.del)+chips('del',['1 Reels','3 IG Story','1 TikTok Video','Unboxing','Feed Post'])
 +ck('cxp','Periode Tayang / Exclusivity')+fld('x_per','Periode / exclusivity','Tayang 30 hari, exclusivity 60 hari',D.cx.per)+chips('per',['Tayang 30 hari','Tayang 90 hari','Exclusivity 60 hari'])
 +ck('cxu','Usage Rights / Hak Cipta Iklan')+fld('x_use','Usage rights','Organic only',D.cx.use)+chips('use',['Organic only','Paid Ads 3 bulan','Whitelisting 30 hari','Perpetual'])
 +ck('bdg','Badge paket')+fld('x_bdg','Teks badge','Reels + Story + Unboxing',D.bdg)+'<div class="hint">Kolom ini tampil di semua template; aktifkan hanya yang dipakai.</div></div></div>'
 +'<div class="card"><div class="hdr"><span>⚡ Pembayaran Cepat</span></div><div class="body">'
 +ck('qr','Tampilkan QRIS / barcode')+'<div class="logoRow" id="qrRow"></div><label class="bt gh sm2">📷 Upload QRIS<input id="x_qr" type="file" accept="image/*" hidden></label>'
 +ck('pbtn','Tombol “Pay Now”')+fld('x_plink','Link pembayaran','https://pay.example.com/inv-001',D.plink,'inputmode="url"')
 +'<div class="hint">QRIS dibingkai warna aksen tetapi tetap hitam-putih agar terbaca scanner. Pay Now menjadi link aktif di PDF; di PNG, link ikut terkirim lewat teks WhatsApp.</div></div></div>'
 +'<div class="card"><div class="hdr"><span>🧩 Ekstra Template</span></div><div class="body"><small class="hint">Thumbnail karya / foto polaroid (maks. 3)</small><div class="logoRow" id="thRow"></div><label class="bt gh sm2">🖼️ Tambah thumbnail<input id="x_th" type="file" accept="image/*" hidden></label>'+fld('x_tlink','Link portofolio','vimeo.com/namamu',D.tlink)
 +ck('dsc','Disclaimer &amp; klausul hak cipta')+area('x_dsc','Disclaimer','',D.dsc)
 +ck('fx','Indikator kurs (multi-currency)')+'<div class="g2"><label class="fl"><small>Mata uang</small><select class="in" id="x_fxc">'+['USD','EUR','SGD','AUD','GBP','JPY'].map(function(c){return'<option'+(D.fx.c===c?' selected':'')+'>'+c+'</option>'}).join('')+'</select></label>'+fld('x_fxr','Kurs (Rp per 1 unit)','16250',D.fx.r,'inputmode="decimal"')+'</div>'+fld('x_fxm','Metode pembayaran internasional','PayPal · Stripe · Wise',D.fx.m)+'<div class="hint">Kurs diisi manual; total tetap dihitung dalam Rupiah.</div></div></div>'}
function thUI(){var r=ov.querySelector('#thRow'),q=ov.querySelector('#qrRow');
 if(r)r.innerHTML=D.thumbs.length?D.thumbs.map(function(u,i){return'<span style="position:relative"><img src="'+u+'" alt=""><button class="rm" data-thx="'+i+'" style="position:absolute;top:-8px;right:-8px;background:var(--vc);width:22px;height:22px;font-size:12px" aria-label="Hapus thumbnail">✕</button></span>'}).join(''):'<span class="hint" style="margin:0">Belum ada thumbnail</span>';
 if(q)q.innerHTML=D.qr?'<img src="'+D.qr+'" alt="QRIS"><button class="bt gh sm2" data-qrx="1" style="width:auto;margin:0;padding:8px 12px">Hapus QRIS</button>':'<span class="hint" style="margin:0">Belum ada QRIS</span>'}
function fillX(){var m={x_del:D.cx.del,x_per:D.cx.per,x_use:D.cx.use,x_bdg:D.bdg,x_plink:D.plink,x_tlink:D.tlink,x_dsc:D.dsc,x_fxr:D.fx.r,x_fxm:D.fx.m};Object.keys(m).forEach(function(k){var e=ov.querySelector('#'+k);if(e)e.value=m[k]||''});thUI();syncOn()}
function tplInit(){var T=curTpl();if(T){D.bdg=T.b||'';if(T.x==='dsc')D.dsc=DSC}}
function applyTpl(id){st.tpl=id;var T=curTpl();
 if(T){D.bdg=T.b||'';D.on.bdg=!!T.b;D.on.cxd=D.on.cxp=D.on.cxu=!!T.cx;D.on.dsc=T.x==='dsc';D.on.fx=T.x==='fx';if(T.x==='dsc'&&!D.dsc.trim())D.dsc=DSC}
 put();ov.querySelectorAll('[data-tpl]').forEach(function(b){b.classList.toggle('on',id!==''&&b.dataset.tpl===id)});fillX();pv()}
function bindTpl(){thUI();
 ov.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
  if(b.dataset.tpl!==undefined)return applyTpl(b.dataset.tpl);
  if(b.dataset.cat!==undefined){tcat=+b.dataset.cat;ov.querySelectorAll('#tpCat button').forEach(function(x){x.classList.toggle('on',x===b)});ov.querySelector('#tpg').innerHTML=tpGrid();return}
  if(b.dataset.ch){var k=b.dataset.ch;D.cx[k]=(D.cx[k]?D.cx[k]+', ':'')+b.dataset.v;ov.querySelector('#x_'+k).value=D.cx[k];pvSoon();return}
  if(b.dataset.thx!==undefined){D.thumbs.splice(+b.dataset.thx,1);thUI();pv();return}
  if(b.dataset.qrx){D.qr='';thUI();pv();return}
  if(b.id==='bk_save'){remember();tt('Brand Kit tersimpan ✅')}});
 ov.addEventListener('input',function(e){var t=e.target,v=t.value,m={x_del:function(){D.cx.del=v},x_per:function(){D.cx.per=v},x_use:function(){D.cx.use=v},x_bdg:function(){D.bdg=v},x_plink:function(){D.plink=v},x_tlink:function(){D.tlink=v},x_dsc:function(){D.dsc=v},x_fxr:function(){D.fx.r=v},x_fxm:function(){D.fx.m=v}};
  if(m[t.id]){m[t.id]();pvSoon()}else if(t.id==='bk_c'){st.accent=v;put();ov.querySelectorAll('#acSw button').forEach(function(x){x.classList.remove('on')});pvSoon()}});
 ov.addEventListener('change',function(e){var t=e.target,f=t.files&&t.files[0];
  if(t.id==='x_fxc'){D.fx.c=t.value;pv();return}
  if(!f)return;t.value='';
  if(t.id==='x_qr')pic(f,600,0,function(u){D.qr=u;D.on.qr=true;syncOn();thUI();pv()});
  if(t.id==='x_th'&&D.thumbs.length<3)pic(f,520,0,function(u){D.thumbs.push(u);thUI();pv()});
  if(t.id==='bk_l')pic(f,420,0,function(u){D.logo=u;D.on.logo=true;syncOn();logoUI();pv()});
  if(t.id==='bk_s')pic(f,420,1,function(u){D.sig=u;D.on.sig=true;syncOn();sigUI();pv()})})}

function tt(m){var e=document.getElementById('vfi-tt')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'vfi-tt'}));e.textContent=m;e.style.display='block';clearTimeout(tt.x);tt.x=setTimeout(function(){e.style.display='none'},3200)}

/* ---------- render invoice (HTML string) ---------- */
function R(d,forPrint){
  var c=calc(d),on=d.on,TP=curTpl(),P=TP?tplPal(TP):palette(forPrint);
  var vars='--p:'+P.paper+';--i:'+P.ink+';--m:'+P.mu+';--l:'+P.ln+';--s:'+P.soft+';--a:'+P.ac+';--oa:'+P.onac+';'+fontVars(fontId());
  var sname=on.sname&&d.sname?'<div class="sn">'+h(d.sname)+'</div>':'';
  var lines=[];
  if(on.saddr&&d.saddr.trim())lines.push(nl(d.saddr));
  if(on.sphone&&d.sphone.trim())lines.push('Telp: '+h(d.sphone));
  if(on.smail&&d.smail.trim())lines.push(h(d.smail));
  if(on.npwp&&d.npwp.trim())lines.push('NPWP: '+h(d.npwp));
  var logo=on.logo&&d.logo?'<img class="logo" src="'+d.logo+'" alt="">':'';
  var brand=(logo||sname||lines.length)?'<div class="brand">'+logo+'<div>'+sname+(lines.length?'<div class="sm">'+lines.join('<br>')+'</div>':'')+'</div></div>':'<div class="brand"></div>';
  var title=on.title?'<div class="ti">'+h(d.lang||'INVOICE')+'</div>':'';
  var tn=on.no&&d.no?'<div class="tn">'+h(d.no)+'</div>':'';
  var hd='<div class="hd">'+brand+((title||tn)?'<div class="tt">'+title+tn+'</div>':'')+'</div>';
  /* meta: pembeli + tanggal */
  var buyer='';
  if(on.buyer){var bl=[];if(on.baddr&&d.baddr.trim())bl.push(nl(d.baddr));if(on.bcontact&&d.bcontact.trim())bl.push(nl(d.bcontact));
    buyer='<div class="box"><div class="lb">Ditagihkan kepada</div><div class="bn">'+h(d.bname||'Nama Pembeli')+'</div>'+(bl.length?'<div class="sm">'+bl.join('<br>')+'</div>':'')+'</div>'}
  var dt=[];if(on.date)dt.push('<span>Tanggal terbit</span><b>'+fd(d.date)+'</b>');if(on.due)dt.push('<span>Jatuh tempo</span><b>'+fd(d.due)+'</b>');
  var dates=dt.length?'<div class="box"><div class="lb">Detail</div><div class="dts">'+dt.join('')+'</div></div>':'';
  var meta=(buyer||dates)?'<div class="meta"'+((buyer&&dates)?'':' style="grid-template-columns:1fr"')+'>'+buyer+dates+'</div>':'';
  /* tabel item */
  var rows=c.rows.map(function(r,i){return'<tr><td class="c">'+(i+1)+'</td><td class="d">'+h(r.n||'-')+'</td><td class="c">'+r2(r.q)+'</td><td class="r">'+rp(r.p)+'</td><td class="r"><b>'+rp(r.t)+'</b></td></tr>'}).join('')||'<tr><td colspan="5" class="nil">Belum ada item</td></tr>';
  var table='<table><thead><tr><th class="c">No</th><th>'+(TP&&TP.dl||'Deskripsi')+'</th><th class="c">'+(TP&&TP.ql||'Qty')+'</th><th class="r">Harga satuan</th><th class="r">Jumlah</th></tr></thead><tbody>'+rows+'</tbody></table>';
  /* ringkasan */
  var s='<tr><td>Subtotal</td><td class="r">'+rp(c.sub)+'</td></tr>';
  if(on.disc&&c.disc>0)s+='<tr class="neg"><td>'+h(c.dl)+'</td><td class="r">-'+rp(c.disc)+'</td></tr>';
  if(on.ship&&c.ship>0)s+='<tr><td>Ongkos kirim</td><td class="r">'+rp(c.ship)+'</td></tr>';
  if(on.tax&&(c.tax>0||num(d.tax.r)>0))s+='<tr><td>'+h(c.tl)+'</td><td class="r">'+rp(c.tax)+'</td></tr>';
  s+=xr(d,c,TP,0);s+='<tr class="gt"><td>Total</td><td class="r">'+rp(c.grand)+'</td></tr>';
  if(on.dp&&c.paid>0){s+='<tr><td>Dibayar di muka</td><td class="r">-'+rp(c.paid)+'</td></tr><tr class="due"><td>Sisa tagihan</td><td class="r">'+rp(c.due)+'</td></tr>'}
  s+=xr(d,c,TP,1);var sum='<div class="sum"><table><tbody>'+s+'</tbody></table></div>';
  /* instruksi */
  var ib=[];
  if(on.pay&&d.pay.trim())ib.push('<div class="box"><div class="lb">Metode pembayaran</div><div class="tx">'+h(d.pay)+'</div></div>');
  if(on.terms&&d.terms.trim())ib.push('<div class="box"><div class="lb">Syarat &amp; ketentuan</div><div class="tx">'+h(d.terms)+'</div></div>');
  var info=ib.length?'<div class="info'+(ib.length===1?' one':'')+'">'+ib.join('')+'</div>':'';
  var notes=on.notes&&d.notes.trim()?'<div class="box nt"><div class="lb">Catatan</div><div class="tx">'+h(d.notes)+'</div></div>':'';
  /* tanda tangan */
  var sg='';
  if(on.sig||on.sigb){var a=on.sig?'<div>'+(d.sig?'<img src="'+d.sig+'" alt="">':'<div class="sp"></div>')+'<div class="ln">'+h(d.sigName||d.sname||'Penjual')+'</div><small>Penjual</small></div>':'';
    var b=on.sigb?'<div>'+(d.bsig?'<img src="'+d.bsig+'" alt="">':'<div class="sp"></div>')+'<div class="ln">'+h(d.bname||'Pembeli')+'</div><small>Pembeli</small></div>':'';
    sg='<div class="sg">'+b+a+'</div>'}
  var sty=TP?'tpl':(st.style||'modern'),X=TP?xBlocks(d,c,TP):{d:'',b:'',m:'',p:'',z:''};
  return'<div class="vfi s-'+sty+(TP?' t-'+TP.id+(TP.w?' w-'+TP.w:''):'')+'" style="'+vars+'">'+X.d+hd+X.b+meta+table+sum+X.m+X.p+info+X.z+notes+sg+'</div>'}

/* ---------- ekspor ---------- */
function lib(){return window.html2canvas?Promise.resolve():new Promise(function(ok,no){var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';s.onload=ok;s.onerror=function(){no(new Error('Butuh internet sekali untuk membuat gambar invoice. Coba tombol Cetak/PDF.'))};document.head.appendChild(s)})}
async function mk(){await lib();await fontReady(fontId());var o=document.createElement('div');o.style.cssText='position:fixed;left:-9999px;top:0;width:'+tw()+'px';o.innerHTML='<style>'+CSSI+'</style>'+R(D,true);document.body.appendChild(o);
  try{await new Promise(function(r){setTimeout(r,150)});var c=await html2canvas(o.querySelector('.vfi'),{scale:2,backgroundColor:null,useCORS:true,logging:false});return await new Promise(function(r){c.toBlob(r,'image/png')})}finally{o.remove()}}
function valid(){if(on('sname')&&!D.sname.trim()&&!D.on.logo)return'Isi nama bisnis penjual dulu (atau matikan centangnya).';if(!calc(D).rows.length)return'Isi minimal 1 item beserta harganya.';return''}
function on(k){return D.on[k]}
function remember(){if(D.imported){put();return}st.prof={sname:D.sname,saddr:D.saddr,sphone:D.sphone,smail:D.smail,npwp:D.npwp,logo:D.logo,pay:D.pay,terms:D.terms,notes:D.notes,sig:D.sig,sigName:D.sigName,qr:D.qr,plink:D.plink};st.on=D.on;st.lang=D.lang;put()}
function done(){remember();if(!D.imported){bump();D.no=nomor();syncUI();pv()}}
async function send(kind){if(busy)return;var v=valid();if(v)return tt(v);busy=1;var bs=ov.querySelectorAll('.dock .bt'),old=[].map.call(bs,function(b){return b.textContent});bs.forEach(function(b){b.textContent='⏳'});
 try{var b=await mk(),safe=D.no.replace(/[\/\\]/g,'-'),name='Invoice-'+safe+'.png',f=new File([b],name,{type:'image/png'}),c=calc(D),tx='Invoice '+D.no+(D.sname?' dari '+D.sname:'')+(D.bname?' untuk '+D.bname:'')+'\nTotal: '+rp(c.grand)+(D.on.due?'\nJatuh tempo: '+fd(D.due):'')+(D.on.pbtn&&url(D.plink)?'\nBayar: '+url(D.plink):'');
  done();
  if(kind!=='dl'&&navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:'Invoice',text:tx});return}catch(e){if(e&&e.name==='AbortError')return}}
  var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},4000);
  if(kind==='wa'){tt('Gambar terunduh. Lampirkan di chat WhatsApp.');setTimeout(function(){window.open('https://wa.me/?text='+encodeURIComponent(tx),'_blank')},600)}else tt('Invoice tersimpan ✅')
 }catch(e){tt(e.message||'Gagal membuat invoice.')}finally{busy=0;bs.forEach(function(b,i){b.textContent=old[i]})}}
function printPdf(){var v=valid();if(v)return tt(v);var id=fontId(),F=FONT[id];
  var f=document.createElement('iframe');f.setAttribute('aria-hidden','true');f.style.cssText='position:fixed;right:0;bottom:0;width:0;height:0;border:0';document.body.appendChild(f);
  var doc=f.contentWindow.document,title='Invoice-'+D.no.replace(/[\/\\]/g,'-');
  doc.open();doc.write('<!doctype html><html><head><meta charset="utf-8"><title>'+h(title)+'</title><link rel="stylesheet" href="'+fontHref(id).replace(/&/g,'&amp;')+'"><style>@page{size:A4;margin:0}html,body{margin:0;background:#fff}'+CSSI+'.vfi{width:210mm;min-height:297mm;box-shadow:none;-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head><body>'+R(D,true)+'</body></html>');doc.close();
  var lk=doc.querySelector('link'),wait=new Promise(function(r){if(!lk||lk.sheet)return r();lk.onload=r;lk.onerror=r;setTimeout(r,3000)});
  wait.then(function(){var d2=f.contentWindow.document;if(!d2.fonts||!d2.fonts.load)return;return Promise.race([Promise.all([d2.fonts.load('700 20px "'+F.h+'"'),d2.fonts.load('400 14px "'+F.b+'"'),d2.fonts.load('600 14px "'+F.b+'"')]),new Promise(function(r){setTimeout(r,3000)})])}).catch(function(){}).then(function(){setTimeout(function(){try{f.contentWindow.focus();f.contentWindow.print()}catch(e){tt('Gagal membuka jendela cetak.')}setTimeout(function(){f.remove()},2000);done()},150)})}

/* ---------- UI editor ---------- */
function pv(){if(!ov)return;ensureFonts(fontId());var e=ov.querySelector('#pv'),w=ov.querySelector('.pvw'),k=w.clientWidth/tw();e.style.width=tw()+'px';e.innerHTML=R(D,false);e.style.transform='scale('+k+')';w.style.height=Math.ceil(e.firstChild.offsetHeight*k)+'px';calcUI()}
function pvSoon(){cancelAnimationFrame(pvSoon.r);pvSoon.r=requestAnimationFrame(pv)}
function calcUI(){var c=calc(D),el=ov.querySelector('#calc');if(!el)return;
  var x='<div><span>Subtotal</span><b>'+rp(c.sub)+'</b></div>';
  if(D.on.disc)x+='<div><span>'+h(c.dl||'Diskon')+'</span><b>-'+rp(c.disc)+'</b></div>';
  if(D.on.ship)x+='<div><span>Ongkos kirim</span><b>'+rp(c.ship)+'</b></div>';
  if(D.on.tax)x+='<div><span>'+h(c.tl)+'</span><b>'+rp(c.tax)+'</b></div>';
  x+='<div class="gt"><span>Total</span><b>'+rp(c.grand)+'</b></div>';
  if(D.on.dp)x+='<div><span>Sisa tagihan</span><b>'+rp(c.due)+'</b></div>';el.innerHTML=x;
  ov.querySelectorAll('.item').forEach(function(it,i){var r=D.items[i];if(r){var q=Math.max(0,num(r.q)),p=money(r.p);it.querySelector('.tot').textContent=rp(Math.round(q*p))}})}
function ck(k,label,sub){return'<label class="ck'+(sub?' sub':'')+'"><input type="checkbox" data-on="'+k+'"'+(D.on[k]?' checked':'')+'>'+label+'</label>'}
function fld(id,label,ph,val,extra){return'<label class="fl"><small>'+label+'</small><input class="in" id="'+id+'" placeholder="'+h(ph||'')+'" value="'+h(val)+'" '+(extra||'')+'></label>'}
function area(id,label,ph,val){return'<label class="fl"><small>'+label+'</small><textarea class="in" id="'+id+'" placeholder="'+h(ph||'')+'">'+h(val)+'</textarea></label>'}
function sec(id,title,body,master){ /* master = id toggle yang mengaktifkan seluruh kartu */
  var off=master&&!D.on[master];return'<div class="card'+(off?' off':'')+'" data-sec="'+id+'"><div class="hdr">'+(master?'<label class="ck" style="min-height:0"><input type="checkbox" data-on="'+master+'"'+(D.on[master]?' checked':'')+'><span>'+title+'</span></label>':'<span>'+title+'</span>')+'</div><div class="body">'+body+'</div></div>'}
function itemsUI(){ov.querySelector('#its').innerHTML=D.items.map(function(i,x){return'<div class="item" data-x="'+x+'"><div class="r1"><input class="in" data-k="n" placeholder="Deskripsi produk / jasa" value="'+h(i.n)+'"><button class="rm" data-del="'+x+'" aria-label="Hapus item">✕</button></div><div class="r2"><input class="in" data-k="q" inputmode="decimal" placeholder="Qty" value="'+h(i.q)+'" aria-label="Kuantitas"><input class="in" data-k="p" inputmode="numeric" placeholder="Harga satuan" value="'+h(fmtIn(i.p))+'" aria-label="Harga satuan"><div class="tot">'+rp(Math.round(Math.max(0,num(i.q))*money(i.p)))+'</div></div></div>'}).join('')}
function logoUI(){var l=ov.querySelector('#logoRow');if(l)l.innerHTML=(D.logo?'<img src="'+D.logo+'" alt="Logo"><button class="bt gh sm2" id="xlogo" style="width:auto;margin:0;padding:8px 12px">Hapus logo</button>':'<span class="hint" style="margin:0">Belum ada logo</span>')}
function sigUI(){['sig','bsig'].forEach(function(k){var l=ov.querySelector('#l'+k);if(!l)return;l.firstChild.nodeValue=D[k]?'✓ Tanda tangan terpasang · ketuk untuk ganti':(k==='sig'?'✍️ Upload tanda tangan penjual':'✍️ Upload tanda tangan pembeli');var x=ov.querySelector('#x'+k);if(x)x.style.display=D[k]?'':'none'})}
function syncUI(){var n=ov.querySelector('#no');if(n)n.value=D.no}
function syncOn(){ov.querySelectorAll('[data-on]').forEach(function(i){i.checked=!!D.on[i.dataset.on]});ov.querySelectorAll('.card[data-sec]').forEach(function(c){var m=c.querySelector('.hdr [data-on]');if(m)c.classList.toggle('off',!D.on[m.dataset.on])});
  var bd=ov.querySelector('#taxinc');if(bd)bd.disabled=!D.on.tax}
function build(){
  var fs='<button data-font="auto" class="'+(!st.font||st.font==='auto'?'on':'')+'">Font otomatis</button>'+Object.keys(FONT).map(function(k){return'<button data-font="'+k+'" class="'+(st.font===k?'on':'')+'">'+FONT[k].l+'</button>'}).join('');
  var a=ACCENTS.map(function(c){return'<button data-ac="'+c+'" style="background:'+c+'" class="'+(hex(st.accent||'')===c?'on':'')+'" aria-label="Warna '+c+'"></button>'}).join('');
  var ss=STYLES.map(function(s){return'<button data-sty="'+s[0]+'" class="'+((st.style||'modern')===s[0]?'on':'')+'">'+s[1]+'</button>'}).join('');
  return'<div class="bar"><button class="x" id="vx" aria-label="Tutup">‹</button><span>🧾 Buat Invoice</span><span class="sp"></span></div><div class="w">'
  +'<div class="card drop" id="impCard"><div class="hdr"><span>📥 Impor invoice yang sudah ada</span></div><div class="body"><div class="hint" style="margin:2px 0 8px">Upload invoice berupa PDF, JPG, atau PNG. Datanya dibaca otomatis, dimasukkan ke form, lalu ditata ulang dengan desain baru.</div><div class="g2"><label class="bt sm2">📂 Pilih file<input id="fimp" type="file" accept="image/*,application/pdf,.pdf" hidden></label><label class="bt gh sm2">📷 Foto<input id="fcam" type="file" accept="image/*" capture="environment" hidden></label></div><div class="hint">PDF digital dibaca dari teks aslinya (akurat). Foto/scan memakai OCR, lalu dicek silang: qty×harga, subtotal, pajak, dan total. Bisa juga seret &amp; lepas file ke kotak ini.</div><div id="impRep"></div></div></div><div id="impBusy"><span></span></div>'
  +'<div class="pvw"><div class="pvi" id="pv"></div></div>'
  +tplCards()+'<div class="card" style="margin-top:12px"><div class="hdr"><span>🎨 Tampilan</span></div><div class="body"><div class="seg" id="stySeg">'+ss+'</div><div class="seg" id="fSeg">'+fs+'</div><div class="seg" id="thSeg"><button data-th="auto" class="on">Ikut tema aplikasi</button><button data-th="light">Terang</button><button data-th="dark">Gelap</button></div><div class="sw" id="acSw"><button data-ac="" class="'+(st.accent?'':'on')+'" style="background:conic-gradient(#f0b84a,#4fd1a5,#7c3aed,#ee6495,#f0b84a)" aria-label="Warna tema otomatis"></button>'+a+'</div><div class="hint">Mode Gelap hanya untuk pratinjau &amp; gambar. Cetak/PDF selalu memakai kertas terang agar hemat tinta. Font ditarik dari Google Fonts saat online; saat offline otomatis memakai font sistem.</div></div></div>'
  +sec('id','1 · Identitas dokumen','<div class="g2"><div>'+ck('title','Judul')+'</div><div>'+ck('no','Nomor')+'</div></div><div class="seg" id="langSeg"><button data-lang="INVOICE">INVOICE</button><button data-lang="FAKTUR">FAKTUR</button></div>'+fld('lang','Judul dokumen','INVOICE',D.lang)+fld('no','Nomor invoice','INV/2026/001',D.no)+'<div class="g2"><div>'+ck('date','Tampilkan tgl terbit')+fld('date','Tanggal terbit','',D.date,'type="date"')+'</div><div>'+ck('due','Tampilkan jatuh tempo')+fld('due','Jatuh tempo','',D.due,'type="date"')+'<div class="seg" id="dueSeg"><button data-d="7">+7</button><button data-d="14">+14</button><button data-d="30">+30</button></div></div></div>')
  +sec('seller','2 · Penjual (Anda)',ck('sname','Nama bisnis')+fld('sname','Nama bisnis / penjual','PT Contoh Jaya',D.sname)+ck('logo','Logo')+'<div class="logoRow" id="logoRow"></div><label class="bt gh sm2">🖼️ Upload logo<input id="flogo" type="file" accept="image/*" hidden></label>'+ck('saddr','Alamat')+area('saddr','Alamat','Jl. Contoh No. 1, Jakarta',D.saddr)+'<div class="g2"><div>'+ck('sphone','Telepon')+fld('sphone','Telepon','0812…',D.sphone,'inputmode="tel"')+'</div><div>'+ck('smail','Email')+fld('smail','Email','nama@bisnis.com',D.smail,'inputmode="email"')+'</div></div>'+ck('npwp','NPWP')+fld('npwp','NPWP','00.000.000.0-000.000',D.npwp))
  +sec('buyer','3 · Pembeli',fld('bname','Nama klien / perusahaan','PT Klien Sejahtera',D.bname)+ck('baddr','Alamat')+area('baddr','Alamat','',D.baddr)+ck('bcontact','Kontak')+area('bcontact','Telepon / email','',D.bcontact),'buyer')
  +'<div class="card"><div class="hdr"><span>4 · Rincian transaksi</span></div><div class="body"><div id="its"></div><button class="bt gh" id="ad">＋ Tambah item</button></div></div>'
  +'<div class="card"><div class="hdr"><span>5 · Rincian pembayaran</span></div><div class="body">'
   +ck('disc','Diskon')+'<div class="g2" data-dep="disc"><div class="seg" id="dtSeg"><button data-dt="pct">%</button><button data-dt="nom">Rp</button></div>'+fld('dv','Nilai diskon','0',D.disc.v,'inputmode="decimal"')+'</div>'
   +ck('ship','Ongkos kirim')+fld('shipv','Ongkos kirim (Rp)','0',fmtIn(D.ship),'inputmode="numeric"')
   +ck('tax','Pajak')+'<div class="g2">'+fld('taxn','Nama pajak','PPN',D.tax.n)+fld('taxr','Tarif (%)','11',D.tax.r,'inputmode="decimal"')+'</div><label class="ck sub"><input type="checkbox" id="taxinc"'+(D.tax.inc?' checked':'')+'>Harga sudah termasuk pajak</label><label class="ck sub"><input type="checkbox" id="taxship"'+(D.taxShip?' checked':'')+'>Ongkos kirim ikut dikenai pajak</label>'
   +ck('dp','Uang muka / DP terbayar')+fld('dpv','Jumlah DP (Rp)','0',fmtIn(D.dp),'inputmode="numeric"')
   +'<div class="calc" id="calc"></div></div></div>'
  +'<div class="card"><div class="hdr"><span>6 · Instruksi &amp; ketentuan</span></div><div class="body">'+ck('pay','Metode pembayaran')+area('pay','Info rekening / payment gateway','BCA 123 456 7890 a.n. PT Contoh Jaya\nQRIS / link pembayaran…',D.pay)+ck('terms','Syarat &amp; ketentuan')+area('terms','Syarat & ketentuan','',D.terms)+ck('notes','Catatan tambahan')+area('notes','Catatan / ucapan terima kasih','',D.notes)+'</div></div>'
  +xCards()+'<div class="card"><div class="hdr"><span>7 · Tanda tangan</span></div><div class="body">'+ck('sig','Tanda tangan penjual')+fld('signame','Nama penanda tangan','',D.sigName)+'<label class="bt gh sm2" id="lsig">x<input id="fs" type="file" accept="image/*" hidden></label><button class="bt gh sm2" id="xsig">Hapus tanda tangan penjual</button>'+ck('sigb','Tanda tangan pembeli')+'<label class="bt gh sm2" id="lbsig">x<input id="fb" type="file" accept="image/*" hidden></label><button class="bt gh sm2" id="xbsig">Hapus tanda tangan pembeli</button></div></div>'
  +'</div><div class="dock"><button class="bt" data-s="pdf">🖨️ Cetak / PDF</button><button class="bt gh" data-s="wa">📲 WA</button><button class="bt gh" data-s="dl">⬇ PNG</button></div>'}

/* gambar: kompres + (opsional) hilangkan latar putih untuk tanda tangan */
function pic(f,mw,tp,cb){var r=new FileReader;r.onload=function(){var i=new Image;i.onload=function(){var k=Math.min(1,mw/i.width),c=document.createElement('canvas');c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);var x=c.getContext('2d');x.drawImage(i,0,0,c.width,c.height);if(tp){var I=x.getImageData(0,0,c.width,c.height),a=I.data;for(var j=0;j<a.length;j+=4)if(a[j]*.3+a[j+1]*.59+a[j+2]*.11>225)a[j+3]=0;x.putImageData(I,0,0)}cb(c.toDataURL('image/png'))};i.onerror=function(){tt('Gambar tidak bisa dibaca.')};i.src=r.result};r.onerror=function(){tt('File tidak bisa dibaca.')};r.readAsDataURL(f)}

function open(){if(document.getElementById('vfi-ov'))return;
  if(!document.getElementById('vfi-css')){var s=document.createElement('style');s.id='vfi-css';s.textContent=CSS;document.head.appendChild(s)}
  D=fresh();tplInit();theme='auto';undoSnap=null;lastSrc=null;lastParse=null;
  ov=document.createElement('div');ov.id='vfi-ov';ov.setAttribute('data-no-i18n','1');
  var t=appTheme();ov.className=t.k==='simpel'?'t-sm':t.k==='pink'?'t-pk':t.k==='terang'?'t-lt':'';
  ov.innerHTML=build();document.body.appendChild(ov);document.body.style.overflow='hidden';
  itemsUI();logoUI();sigUI();syncOn();pv();
  ov.querySelectorAll('[data-lang]').forEach(function(b){b.classList.toggle('on',b.dataset.lang===D.lang)});
  ov.querySelectorAll('[data-dt]').forEach(function(b){b.classList.toggle('on',b.dataset.dt===D.disc.t)});
  ov.addEventListener('click',function(e){if(e.target.classList&&e.target.classList.contains('th')){e.target.classList.toggle('z');return}var b=e.target.closest('button');if(!b)return;
   if(b.id==='vx'){closeOv();return}
   if(b.dataset.s){if(b.dataset.s==='pdf')printPdf();else send(b.dataset.s);return}
   if(b.id==='ad'){D.items.push({id:uid(),n:'',q:1,p:''});itemsUI();pv();var ins=ov.querySelectorAll('.item');ins[ins.length-1].querySelector('input').focus();return}
   if(b.dataset.del!==undefined){D.items.splice(+b.dataset.del,1);if(!D.items.length)D.items.push({id:uid(),n:'',q:1,p:''});itemsUI();pv();return}
   if(b.dataset.sty){st.style=b.dataset.sty;put();ov.querySelectorAll('[data-sty]').forEach(function(x){x.classList.toggle('on',x===b)});pv();return}
   if(b.dataset.th){theme=b.dataset.th;ov.querySelectorAll('[data-th]').forEach(function(x){x.classList.toggle('on',x===b)});pv();return}
   if(b.dataset.ac!==undefined){st.accent=b.dataset.ac;put();ov.querySelectorAll('#acSw button').forEach(function(x){x.classList.toggle('on',x===b)});pv();return}
   if(b.dataset.lang){D.lang=b.dataset.lang;ov.querySelector('#lang').value=D.lang;ov.querySelectorAll('[data-lang]').forEach(function(x){x.classList.toggle('on',x===b)});pv();return}
   if(b.dataset.d){D.due=addDays(D.date,+b.dataset.d);ov.querySelector('#due').value=D.due;pv();return}
   if(b.dataset.dt){D.disc.t=b.dataset.dt;ov.querySelectorAll('[data-dt]').forEach(function(x){x.classList.toggle('on',x===b)});pv();return}
   if(b.dataset.font!==undefined){st.font=b.dataset.font==='auto'?'':b.dataset.font;put();ov.querySelectorAll('[data-font]').forEach(function(x){x.classList.toggle('on',x===b)});pv();return}
   if(b.id==='reparse'){var ta=ov.querySelector('#rawT');if(ta)applyText(ta.value,Object.assign({},lastSrc||{},{kind:'teks'}));return}
   if(b.id==='undoImp'){undoImport();return}
   if(b.id==='addDelta'&&lastParse&&lastParse.itemsDelta>0){D.items.push({id:uid(),n:'(Baris tidak terbaca — isi manual)',q:1,p:lastParse.itemsDelta});itemsUI();pv();tt('Baris selisih ditambahkan. Isi deskripsinya.');return}
   if(b.id==='xsig'){D.sig='';sigUI();pv();return}if(b.id==='xbsig'){D.bsig='';sigUI();pv();return}if(b.id==='xlogo'){D.logo='';logoUI();pv();return}});
  ov.addEventListener('change',function(e){var t=e.target;
   if(t.dataset.on){D.on[t.dataset.on]=t.checked;syncOn();pv();return}
   if(t.id==='taxinc'){D.tax.inc=t.checked;pv();return}if(t.id==='taxship'){D.taxShip=t.checked;pv()}});
  ov.addEventListener('input',function(e){var t=e.target,id=t.id;if(t.classList)t.classList.remove('warn');var wi=t.closest&&t.closest('#its');if(wi)wi.classList.remove('warn');
   if(t.dataset.k){var r=D.items[+t.closest('.item').dataset.x];if(!r)return;
     if(t.dataset.k==='p'){var n=money(t.value);r.p=n;t.value=n?n.toLocaleString('id-ID'):''}else r[t.dataset.k]=t.value;pvSoon();return}
   var m={lang:function(v){D.lang=v;ov.querySelectorAll('[data-lang]').forEach(function(x){x.classList.toggle('on',x.dataset.lang===v)})},no:function(v){D.no=v},date:function(v){D.date=v||today()},due:function(v){D.due=v||D.date},
    sname:function(v){D.sname=v},saddr:function(v){D.saddr=v},sphone:function(v){D.sphone=v},smail:function(v){D.smail=v},npwp:function(v){D.npwp=v},
    bname:function(v){D.bname=v},baddr:function(v){D.baddr=v},bcontact:function(v){D.bcontact=v},
    dv:function(v){D.disc.v=v},taxn:function(v){D.tax.n=v},taxr:function(v){D.tax.r=v},
    shipv:function(v){var n=money(v);D.ship=n;t.value=n?n.toLocaleString('id-ID'):''},dpv:function(v){var n=money(v);D.dp=n;t.value=n?n.toLocaleString('id-ID'):''},
    pay:function(v){D.pay=v},terms:function(v){D.terms=v},notes:function(v){D.notes=v},signame:function(v){D.sigName=v}};
   if(m[id]){m[id](t.value);pvSoon()}});
  ov.querySelector('#fimp').onchange=function(){var f=this.files[0];this.value='';importFile(f)};
  ov.querySelector('#fcam').onchange=function(){var f=this.files[0];this.value='';importFile(f)};
  var dz=ov.querySelector('#impCard');['dragenter','dragover'].forEach(function(ev){dz.addEventListener(ev,function(e){e.preventDefault();dz.classList.add('dg')})});['dragleave','drop'].forEach(function(ev){dz.addEventListener(ev,function(e){e.preventDefault();dz.classList.remove('dg')})});dz.addEventListener('drop',function(e){var f=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0];if(f)importFile(f)});
  ov.querySelector('#flogo').onchange=function(){var f=this.files[0];this.value='';if(f)pic(f,420,0,function(u){D.logo=u;D.on.logo=true;syncOn();logoUI();pv()})};
  ov.querySelector('#fs').onchange=function(){var f=this.files[0];this.value='';if(f)pic(f,420,1,function(u){D.sig=u;D.on.sig=true;syncOn();sigUI();pv()})};
  ov.querySelector('#fb').onchange=function(){var f=this.files[0];this.value='';if(f)pic(f,420,1,function(u){D.bsig=u;D.on.sigb=true;syncOn();sigUI();pv()})};
  bindTpl();window.addEventListener('resize',onRs)}
function onRs(){if(ov&&document.body.contains(ov))pvSoon();else window.removeEventListener('resize',onRs)}
function closeOv(){if(ov){remember();ov.remove();ov=null}document.body.style.overflow='';window.removeEventListener('resize',onRs)}

/* ---------- tombol akses (tetap seperti versi sebelumnya) ---------- */
function mkBtn(src){var n=src.cloneNode(true);n.removeAttribute('data-a');n.removeAttribute('data-i');n.classList.remove('on');n.removeAttribute('aria-current');n.setAttribute('data-inv','1');return n}
function inj(){var f=document.querySelector('#F .fn'),a=f&&f.querySelector('[data-i="analisis"]');
 if(a&&!f.querySelector('[data-inv]')){var n=mkBtn(a),sv=n.querySelector('svg'),sp=n.querySelector('span');if(sv)sv.innerHTML='<path d="M12 6h24v36l-4-3-4 3-4-3-4 3-4-3-4 3z"/><path d="M18 16h12M18 23h12M18 30h7"/>';if(sp)sp.textContent='Invoice';a.after(n);f.classList.add('vfi6')}
 var m=document.getElementById('nav'),w=m&&m.querySelector('[data-i="wlt"]');
 if(w&&!m.querySelector('[data-inv]')){var n2=mkBtn(w),s2=n2.querySelector('svg');if(s2)s2.innerHTML='<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/>';[].slice.call(n2.childNodes).forEach(function(c){if(c.nodeType===3)n2.removeChild(c)});n2.appendChild(document.createTextNode('Invoice'));w.after(n2);m.classList.add('vfi6')}
 var sm=document.body.classList.contains('sm')&&document.querySelector('#SM .w');
 if(sm&&!sm.querySelector('[data-inv]')&&document.querySelector('#SM .nv .on[data-i="home"]')){var b=document.createElement('button');b.className='gh';b.setAttribute('data-inv','1');b.style.cssText='display:block;width:100%;margin:18px 0 8px';b.textContent='🧾 Buat Invoice';sm.appendChild(b)}}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-inv]');if(b){e.preventDefault();e.stopPropagation();open()}},true);
var q;new MutationObserver(function(){cancelAnimationFrame(q);q=requestAnimationFrame(inj)}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
/* migrasi ringan dari v1: ambil nama penjual & tanda tangan lama */
try{if(!st.prof){var o=JSON.parse(localStorage.getItem(LS_OLD)||'null');if(o&&(o.me||o.sig)){st.prof={sname:o.me||'',sig:o.sig||''};put()}}}catch(e){}
(function(){var e=document.createElement('style');e.id='vfi-css';e.textContent=CSS;document.head.appendChild(e)})();inj();window.VFInvoice={open:open,calc:calc,importText:function(t){return applyText(t,{kind:'teks'})},data:function(){return D},fontId:fontId,templates:TPL,render:R,fresh:fresh,use:function(i){st.tpl=i}};
})();
