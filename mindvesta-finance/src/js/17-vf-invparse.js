
(function(root){'use strict';
/* ===== VFInvParse — pembaca invoice: teks (PDF/OCR) -> data terstruktur + verifikasi silang =====
   Prinsip anti-salah:
   1) Angka dibaca dengan aturan Indonesia & Inggris (1.250.000 / 1,250,000.00 / 12,5), salah-OCR (O->0, l->1) dikoreksi hanya pada token angka.
   2) Setiap baris item dicocokkan: qty x harga = jumlah. Hanya kombinasi yang cocok yang diterima.
   3) Hasil dicocokkan ke dokumen: jumlah item = subtotal, subtotal - diskon + ongkir + pajak = total.
   4) Apa pun yang tidak cocok / tidak ditemukan ditandai, tidak ditebak diam-diam.                 */
var MON={jan:1,januari:1,january:1,feb:2,peb:2,februari:2,pebruari:2,february:2,mar:3,maret:3,march:3,apr:4,april:4,mei:5,may:5,jun:6,juni:6,june:6,jul:7,juli:7,july:7,agu:8,agt:8,ags:8,agus:8,agustus:8,aug:8,august:8,sep:9,sept:9,september:9,okt:10,oct:10,oktober:10,october:10,nov:11,nop:11,november:11,nopember:11,des:12,dec:12,desember:12,december:12};
var pad=function(n){return n<10?'0'+n:''+n};
function iso(y,m,d){y=+y;m=+m;d=+d;if(y<100)y+=2000;if(m<1||m>12||d<1||d>31||y<1990||y>2100)return null;var t=new Date(Date.UTC(y,m-1,d));if(t.getUTCMonth()!==m-1)return null;return y+'-'+pad(m)+'-'+pad(d)}
function addDays(s,k){var t=new Date(s+'T00:00:00Z');t.setUTCDate(t.getUTCDate()+k);return t.getUTCFullYear()+'-'+pad(t.getUTCMonth()+1)+'-'+pad(t.getUTCDate())}

/* ---------- tanggal ---------- */
function findDates(s){
  s=s.replace(/(^|[^A-Za-z0-9])([0-9OoIl]{1,2}[\/.\-][0-9OoIl]{1,2}[\/.\-][0-9OoIl]{2,4})(?![A-Za-z0-9])/g,function(all,pre,d){return/[0-9]/.test(d)?pre+d.replace(/[Oo]/g,'0').replace(/[Il]/g,'1'):all});
  var out=[],m,re;
  function ok(i,len){var p=s.charAt(i-1),n=s.charAt(i+len);if(/[A-Za-z0-9\/]/.test(p))return false;if(/[0-9\/]/.test(n))return false;return out.every(function(o){return i>=o.i+o.len||i+len<=o.i})}
  function add(i,len,v,amb){if(v&&ok(i,len))out.push({i:i,len:len,iso:v,amb:!!amb,raw:s.substr(i,len)})}
  re=/(\d{4})\s*[-\/.]\s*(\d{1,2})\s*[-\/.]\s*(\d{1,2})/g;while(m=re.exec(s))add(m.index,m[0].length,iso(m[1],m[2],m[3]));
  re=/(\d{1,2})\s*[-\/.]\s*(\d{1,2})\s*[-\/.]\s*(\d{4}|\d{2})(?!\d)/g;
  while(m=re.exec(s)){var a=+m[1],b=+m[2],v=null,amb=false;
    if(a>12){v=iso(m[3],b,a)}else if(b>12){v=iso(m[3],a,b);amb=true}else{v=iso(m[3],b,a);amb=(a!==b)}
    add(m.index,m[0].length,v,amb)}
  re=/(\d{1,2})(?:st|nd|rd|th)?[\s\-\/.]*([A-Za-z]{3,10})\.?,?[\s\-\/.]*(\d{4}|\d{2})(?!\d)/g;
  while(m=re.exec(s)){var mo=MON[m[2].toLowerCase()];if(mo)add(m.index,m[0].length,iso(m[3],mo,m[1]))}
  re=/([A-Za-z]{3,10})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})(?!\d)/g;
  while(m=re.exec(s)){var mo2=MON[m[1].toLowerCase()];if(mo2)add(m.index,m[0].length,iso(m[3],mo2,m[2]))}
  return out.sort(function(x,y){return x.i-y.i})}

/* ---------- angka ---------- */
function parseNum(s){
  s=String(s==null?'':s).trim();if(!s)return null;
  var neg=/^\(.*\)$/.test(s)||/^-/.test(s)||/^(?:rp|idr)\.?\s*-/i.test(s);
  s=s.replace(/^(?:rp|idr|usd|us\$|\$)\.?\s*/i,'').replace(/(?:,-|\.-|,--)$/,'').replace(/[()\-\s]/g,'');
  if(!/^\d[\d.,]*$/.test(s))return null;
  var dots=(s.match(/\./g)||[]).length,coms=(s.match(/,/g)||[]).length,v;
  if(dots&&coms){var ld=s.lastIndexOf('.'),lc=s.lastIndexOf(','),dec=ld>lc?'.':',',th=dec==='.'?',':'.';
    var tail=s.slice(Math.max(ld,lc)+1);if(tail.length===3&&s.split(th).length>2&&false)return null;
    v=s.split(th).join('').replace(dec,'.')}
  else if(dots||coms){var sep=dots?'.':',',n=dots||coms,parts=s.split(sep),last=parts[parts.length-1];
    if(n>1){if(!parts.slice(1).every(function(p){return p.length===3}))return null;v=parts.join('')}
    else if(last.length===3){v=parts[0]==='0'?parts[0]+'.'+last:parts.join('')}
    else if(last.length<=2)v=parts[0]+'.'+last;
    else return null}
  else v=s;
  var f=parseFloat(v);if(!isFinite(f))return null;return neg?-f:f}
/* koreksi salah-OCR hanya pada token yang terlihat seperti angka (>=2 digit asli + pemisah) */
function fixTok(t){
  var m=/^((?:rp|idr)\.?)?([0-9OoDIl|SsBbZz.,\-()]{3,})((?:,-|\.-)?)$/i.exec(t);if(!m)return{t:t,fixed:false};
  var body=m[2],digits=(body.match(/[0-9]/g)||[]).length;if(digits<2||!/[.,]/.test(body)&&digits<4)return{t:t,fixed:false};
  var f=body.replace(/[OoD]/g,'0').replace(/[Il|]/g,'1').replace(/[Ss]/g,'5').replace(/B/g,'8').replace(/[Zz]/g,'2');
  return{t:(m[1]||'')+f+(m[3]||''),fixed:f!==body}}
function numTok(t){
  var f=fixTok(t),v=parseNum(f.t);if(v===null)return null;
  var money=/[.,]\d{3}(?!\d)/.test(f.t)||/^(?:rp|idr)/i.test(f.t)||/\d{5,}/.test(f.t.replace(/[.,]/g,''));
  return{v:v,fixed:f.fixed,money:money,raw:t}}

/* ---------- baris & sel (posisi kolom dipertahankan) ---------- */
function cellsOf(raw){var out=[],re=/\S+(?: \S+)*/g,m;while(m=re.exec(raw))out.push({x:m.index,text:m[0].replace(/(\d[.,])\s+(?=\d{3}(?!\d))/g,'$1')});return out}
function toLines(text){
  return String(text||'').replace(/\r/g,'').replace(/[\u00a0\u2007\u202f]/g,' ').replace(/[\u2013\u2014]/g,'-').replace(/[\u2018\u2019]/g,"'").replace(/\t/g,'    ').split('\n').map(function(raw,i){
    raw=raw.replace(/\s+$/,'');var s=raw.trim().replace(/(\d[.,])\s+(?=\d{3}(?!\d))/g,'$1');
    if(/^[\s_\-=.~*|]{3,}$/.test(raw))s='';
    return{i:i,raw:raw,s:s,cells:s?cellsOf(raw):[]}})}

/* ---------- label ---------- */
var RX={
 title:/^(invoice|faktur(?:\s*pajak)?|tagihan|nota(?:\s*penjualan)?|kwitansi|bill|proforma(?:\s*invoice)?|tax\s*invoice|sales\s*invoice|receipt)$/i,
 buyer:/^(?:ditagihkan\s*kepada|ditagih\s*kepada|tagihan\s*kepada|kepada(?:\s*yth)?|yth\.?|bill(?:ed)?\s*to|invoice\s*to|customer|pelanggan|klien|client|pembeli|sold\s*to|penerima)\b\s*[:.\-]?\s*(.*)$/i,
 seller:/^(?:dari|from|penjual|penerbit|diterbitkan\s*oleh|vendor|supplier)\b\s*[:.\-]?\s*(.*)$/i,
 pay:/^(?:metode\s*pembayaran|cara\s*pembayaran|instruksi\s*pembayaran|informasi\s*pembayaran|info\s*pembayaran|detail\s*pembayaran|pembayaran\s*(?:ke|melalui)|payment(?:\s*(?:method|info|information|details|instructions?))?|transfer\s*(?:ke|to)|rekening(?:\s*bank)?|bank\s*(?:details?|account))\b\s*[:.\-]?\s*(.*)$/i,
 terms:/^(?:syarat(?:\s*(?:&|dan)\s*ketentuan)?|ketentuan(?:\s*pembayaran)?|terms(?:\s*(?:&|and)\s*conditions?)?|terms\s*of\s*payment|kebijakan|term\s*&\s*condition)\b\s*[:.\-]?\s*(.*)$/i,
 notes:/^(?:catatan(?:\s*tambahan)?|notes?|keterangan|pesan|remarks?|memo)\b\s*[:.\-]?\s*(.*)$/i,
 sig:/^(?:tanda\s*tangan|hormat\s*kami|authori[sz]ed|signature|disetujui|penerima|mengetahui)/i,
 meta:/^(?:no\.?|nomor|tanggal|tgl\.?|date|jatuh\s*tempo|due|detail|halaman|page|invoice\s*(?:no|number|date|#)|inv\b)/i,
 dueL:/(jatuh\s*tempo|tgl\.?\s*tempo|batas\s*(?:waktu\s*)?(?:pembayaran|bayar)|due\s*date|payment\s*due|due\s*on|pay\s*by|bayar\s*sebelum|tempo)/i,
 issueL:/(tanggal\s*(?:terbit|invoice|faktur|dokumen)?|tgl\.?\s*(?:terbit|invoice|faktur)?|date(?:\s*of\s*issue)?|issue\s*date|invoice\s*date|dated|diterbitkan)/i
};
var TOT=[ /* urutan penting: yang lebih spesifik dulu */
 ['sub',/^(?:sub\s*-?\s*total|total\s*(?:harga|belanja|sebelum\s*(?:pajak|diskon))|jumlah\s*(?:harga|sebelum))\b/i],
 ['disc',/^(?:diskon|discount|potongan|disc\b|promo|voucher|cashback)/i],
 ['ship',/^(?:ongkos\s*kirim|ongkir|biaya\s*(?:kirim|pengiriman|antar)|pengiriman|shipping|delivery|freight|postage|handling)/i],
 ['pph',/^pph\b/i],
 ['tax',/^(?:ppn|ppnbm|pajak|tax|vat|gst)/i],
 ['dp',/^(?:dp\b|uang\s*muka|down\s*payment|deposit|dibayar|telah\s*dibayar|sudah\s*dibayar|pembayaran\s*diterima|payment\s*received|amount\s*paid|paid)/i],
 ['due',/^(?:sisa(?:\s*(?:tagihan|pembayaran|bayar))?|balance(?:\s*due)?|outstanding|kurang\s*bayar|amount\s*due|total\s*due)/i],
 ['grand',/^(?:grand\s*total|total\s*(?:tagihan|bayar|pembayaran|akhir|invoice|keseluruhan|amount|yang\s*harus\s*dibayar)|jumlah\s*(?:tagihan|total|yang\s*harus\s*dibayar|bayar)|invoice\s*total|total)\b/i]];
function totKey(t){for(var k=0;k<TOT.length;k++)if(TOT[k][1].test(t))return TOT[k][0];return null}
var STOP=/^(?:ditagihkan|ditagih|tagihan\s*kepada|kepada|yth|bill(?:ed)?\s*to|ship\s*to|dari\b|from\b|penjual|detail\b|tanggal|tgl\b|date\b|jatuh|due\b|no\.?\s*(?:invoice|faktur)?\b|nomor|metode|cara\s*pembayaran|instruksi|payment|rekening|syarat|ketentuan|terms|catatan|notes?\b|keterangan|sub\s*-?\s*total|total\b|diskon|discount|ongkos|ongkir|ppn|pajak|tax\b|vat\b|dp\b|uang\s*muka|sisa\b|balance|tanda\s*tangan|hormat|signature|authori[sz]ed)/i;
var BANK=/\b(bca|bni|bri|mandiri|cimb|permata|btpn|danamon|ocbc|maybank|jago|seabank|bsi|bank|rek(?:ening)?\.?|a\.?\s?n\.?|atas\s*nama|qris|gopay|ovo|dana|shopeepay|linkaja|virtual\s*account|va\b|paypal|transfer|swift)\b/i;
var EMAIL=/[A-Za-z0-9._%+\-]+\s?@\s?[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/;
var PHONE=/(?:\+?62|0)[\s\-.]?\(?\d{2,4}\)?[\s\-.]?\d{3,4}[\s\-.]?\d{2,5}/;
var PHONEL=/(?:telp?\.?|telepon|phone|hp|wa|whatsapp|mobile|tel|kontak|contact)\s*[:.\-]?\s*([+\d(][\d\s\-().+\/]{6,})/i;

/* ---------- header tabel ---------- */
function isHeader(s){var d=/(deskripsi|description|uraian|nama\s*(?:barang|produk|item|jasa|layanan)|item|produk|barang|keterangan|rincian|layanan|jasa)/i.test(s),q=/\b(qty|kuantitas|quantity|jml|kts|banyak|jumlah)\b/i.test(s),p=/(harga|price|rate|tarif|satuan|unit\s*price)/i.test(s),t=/(total|amount|jumlah|subtotal|nilai)/i.test(s);
  return d&&((q?1:0)+(p?1:0)+(t?1:0)>=2)||(q&&p&&t)}
var UNIT=/^(?:pcs?|unit|units|buah|set|pak|pack|box|kg|gr?|jam|hari|bln|bulan|lbr|lembar|rim|roll|ltr|liter|m2|m|mtr|meter|org|orang|kali|x|paket|lot|ea|each)\.?$/i;

/* ---------- parse satu baris item ---------- */
function rowOf(s){
  var tk=s.split(/\s+/),items=[],i,f,nm,firstText=-1;
  for(i=0;i<tk.length;i++){if(/^[A-Za-z]{2,}/.test(tk[i])&&!/^(?:rp|idr)\.?$/i.test(tk[i])&&!/^[A-Za-z]{1,3}\d/.test(tk[i])||/^[A-Za-z]{3,}/.test(tk[i])){if(!UNIT.test(tk[i])||i>0){firstText=i;break}}}
  var nums=[],skip={};
  for(i=0;i<tk.length;i++){var t=tk[i];
    if(/^(?:rp|idr)\.?$/i.test(t)){skip[i]=1;continue}
    if(/^[x×@*]$/i.test(t)){skip[i]=1;continue}
    var q=/^(\d+(?:[.,]\d+)?)(?:x|×|pcs?|unit|buah|set|pak|box|kg|jam|hari|bln|lbr|m2|mtr|paket)\.?$/i.exec(t);
    if(q){nm=numTok(q[1]);if(nm){nm.raw=t;nm.unit=true;nm.i=i;nums.push(nm);continue}}
    nm=numTok(t);if(nm&&!/%$/.test(t)){nm.i=i;nums.push(nm)}}
  /* nomor urut di depan (sebelum teks pertama) dibuang */
  nums=nums.filter(function(n){return firstText<0||n.i>firstText});
  return{tk:tk,nums:nums,skip:skip,firstText:firstText}}
function tolOK(q,p,t){return Math.abs(q*p-t)<=1+0.001*Math.abs(t)}
function descOf(r,uptoIdx){
  var out=[];for(var i=0;i<r.tk.length&&i<uptoIdx;i++){if(r.skip[i])continue;out.push(r.tk[i])}
    var s=out.join(' ');if(/^\d{1,3}[.)]?\s+\S/.test(s)&&r.firstText>0)s=s.replace(/^\d{1,3}[.)]?\s+/,'');
  return s.replace(/[\s:|,;]+$/,'').trim()}
function parseRow(s){
  var r=rowOf(s),n=r.nums,N=n.length;if(!N)return{text:true,desc:s};
  var res=null,a,b,c,k,i,j;
  /* 1) cari (qty, harga, jumlah) yang konsisten di ekor baris */
  for(k=N-1;k>=Math.max(2,N-2)&&!res;k--){
    for(j=k-1;j>=1&&j>=k-2&&!res;j--)for(i=j-1;i>=0&&i>=j-2&&!res;i--){
      if(tolOK(n[i].v,n[j].v,n[k].v)&&n[i].v>=0&&n[j].v>0&&n[k].v>0&&n[i].v<100000){
        res={q:n[i].v,p:n[j].v,t:n[k].v,at:n[i].i,fix:n[i].fixed||n[j].fixed||n[k].fixed,how:'cocok'}}}}
  /* 1b) tiga angka dengan qty kecil tapi tidak konsisten -> tandai (jangan menebak) */
  if(!res&&N>=3){a=n[N-3];b=n[N-2];c=n[N-1];if(a.v>0&&a.v<=9999&&!a.money&&b.money&&c.money)res={q:a.v,p:b.v,t:c.v,at:a.i,fix:a.fixed||b.fixed||c.fixed,how:'tak-cocok',bad:true}}
  /* 2) dua angka terakhir */
  if(!res&&N>=2){a=n[N-2];b=n[N-1];
    var smallQ=a.v>0&&a.v<=9999&&!a.money&&b.v>=a.v;
    if(smallQ&&(b.money||b.v>a.v*50||b.v>=1000)){res={q:a.v,p:Math.round(b.v/a.v),t:b.v,at:a.i,fix:a.fixed||b.fixed,how:'hitung-harga'}}
    else if(a.money||b.money){ if(b.v>=a.v&&a.v>0&&Math.abs(b.v/a.v-Math.round(b.v/a.v))<1e-9){res={q:Math.round(b.v/a.v),p:a.v,t:b.v,at:a.i,fix:a.fixed||b.fixed,how:'hitung-qty'}}
      else res={q:1,p:b.v,t:b.v,at:b.i,fix:b.fixed,how:'satu-jumlah',amb:true}}}
  /* 3) satu angka */
  if(!res&&N>=1){b=n[N-1];if(b.money||b.v>=1000)res={q:1,p:b.v,t:b.v,at:b.i,fix:b.fixed,how:'satu'}}
  /* 4) tiga angka tak konsisten -> tandai, jangan menebak */
  if(!res&&N>=3){a=n[N-3];b=n[N-2];c=n[N-1];if(c.money||c.v>=1000)res={q:a.v,p:b.v,t:c.v,at:a.i,fix:a.fixed||b.fixed||c.fixed,how:'tak-cocok',bad:true}}
  if(!res)return{text:true,desc:s};
  var d=descOf(r,res.at);res.desc=d;return res}

/* ---------- blok & kolom ---------- */
function pickCell(l,c0,c1){for(var k=0;k<l.cells.length;k++){var x=l.cells[k].x;if(x>=c0-3&&x<c1-1)return l.cells[k]}return null}
var _ocr=false,_sn='';
function rowLike(s){var m=(s.match(/\d{1,3}(?:[.,]\d{3})+/g)||[]).length;return m>=2||m>=1&&/^\d{1,3}[.)]?\s+[A-Za-z]/.test(s)}
function block(L,i,ci,max){
  var c0=L[i].cells[ci].x,c1=L[i].cells[ci+1]?L[i].cells[ci+1].x:1e9,right=ci>0,hasRight=c1<1e9,out=[];
  for(var j=i+1;j<L.length&&out.length<max;j++){var l=L[j];
    if(!l.s){if(out.length)break;else continue}
    var c=pickCell(l,c0,c1),listy;
    if(!c){ if(_ocr&&right&&out.length&&l.cells.length===1&&(/^[a-z(]/.test(l.s)||/^\d{1,2}[.)]\s/.test(l.s))&&!STOP.test(l.s)&&!EMAIL.test(l.s)&&!/^www\./i.test(l.s))c=l.cells[0];else break}
    else if(_ocr&&hasRight&&out.length&&l.cells.length===1&&!EMAIL.test(l.s)&&!/^www\./i.test(l.s)&&(/^[a-z(]/.test(c.text)||/^\d{1,2}[.)]\s/.test(c.text)))break;
    if(STOP.test(c.text)||isHeader(l.s)||TOT.some(function(t){return t[1].test(c.text)&&/\d/.test(l.s)})||/^\d{1,3}$/.test(c.text.trim())||rowLike(l.s)||_sn&&c.text.trim().toLowerCase()===_sn.toLowerCase())break;
    out.push(c.text)}
  return out}
function money(n){return Math.round(n||0)}

/* ================= PARSER UTAMA ================= */
function parse(text){
  var L=toLines(text),res={found:{},items:[],warns:[],checks:[],totals:{},raw:String(text||'')},W=res.warns,C=res.checks;
  function warn(l,msg,f){W.push({lvl:l,msg:msg,field:f||''})}
  var nonEmpty=L.filter(function(l){return l.s}).length;
  if(nonEmpty<3){warn('err','Teks yang terbaca terlalu sedikit. Coba foto yang lebih tajam/terang atau gunakan PDF aslinya.');res.empty=true;return res}
  if(/\b(usd|eur|sgd|us\$|€|£)\b|\$\s?\d/i.test(res.raw))warn('warn','Terdeteksi mata uang selain Rupiah. Angka dibaca apa adanya dan dibulatkan ke Rupiah penuh.');

  /* ----- judul ----- */
  for(var a=0;a<Math.min(L.length,25);a++){var cs=L[a].cells;for(var b=0;b<cs.length;b++){var ct=cs[b].text.trim(),cc=ct.replace(/\s+/g,'');if(RX.title.test(ct)){res.title=ct.toUpperCase();break}if(ct.length<=26&&/^(?:[A-Za-z]\s?){4,}$/.test(ct)&&RX.title.test(cc)){res.title=cc.toUpperCase();break}}if(res.title)break}
  if(res.title){res.found.title=true;if(/PAJAK/.test(res.title))res.title='FAKTUR PAJAK'}

  /* ----- nomor invoice ----- */
  var NO=[/(?:invoice|inv|faktur|tagihan|nota|bill)\s*(?:no|nomor|number|num|#)\.?\s*[:#.\-]?\s*([A-Z0-9][\w\/\-.]{2,30})/i,/(?:\bno|nomor|number)\.?\s*(?:invoice|inv|faktur|tagihan|nota)?\s*[:#]\s*([A-Z0-9][\w\/\-.]{2,30})/i,/\b((?:INV|FAK|FKT|FP|NOTA|KW|SI)[\/\-.][A-Z0-9\/\-.]{2,30})/];
  outer:for(var p=0;p<NO.length;p++)for(var q=0;q<L.length;q++){var mm=NO[p].exec(L[q].s);if(mm){var cand=mm[1].replace(/[.,;:]+$/,'');if(/\d/.test(cand)&&!findDates(cand).length&&!/^(?:invoice|faktur|tanggal)/i.test(cand)){res.no=cand;res.found.no=true;res.noLine=q;break outer}}}

  /* ----- tanggal ----- */
  var dates=[];
  L.forEach(function(l,li){var ds=findDates(l.s);ds.forEach(function(d){var before=l.s.slice(Math.max(0,d.i-45),d.i);
    if(!before.trim()&&li>0)before=L[li-1].s.slice(-45);
    var due=RX.dueL.test(before),iss=RX.issueL.test(before.replace(RX.dueL,''));
    var lb=due?'due':(iss?'issue':'');dates.push({iso:d.iso,amb:d.amb,raw:d.raw,lbl:lb,li:li})})});
  var dI=dates.filter(function(d){return d.lbl==='issue'})[0],dD=dates.filter(function(d){return d.lbl==='due'})[0],un=dates.filter(function(d){return!d.lbl});
  if(!dI&&un.length){dI=un[0];un=un.slice(1)}
  if(!dD&&un.length){dD=un.filter(function(d){return!dI||d.iso>=dI.iso})[0]}
  if(dI){res.date=dI.iso;res.found.date=true;if(dI.amb)warn('info','Tanggal terbit "'+dI.raw+'" dibaca dengan format hari/bulan/tahun → '+dI.iso+'.','date')}
  if(dD){res.due=dD.iso;res.found.due=true;if(dD.amb)warn('info','Jatuh tempo "'+dD.raw+'" dibaca dengan format hari/bulan/tahun → '+dD.iso+'.','due')}
  if(!res.due&&res.date){var tm=/(?:net|termin|tempo|payment\s*terms?|jangka\s*waktu)[^\d\n]{0,14}(\d{1,3})\s*(?:hari|days?)/i.exec(res.raw);
    if(tm){res.due=addDays(res.date,+tm[1]);res.found.due=true;res.dueDerived=true;warn('info','Jatuh tempo dihitung dari termin '+tm[1]+' hari setelah tanggal terbit.','due')}}
  if(res.date&&res.due&&res.due<res.date)warn('warn','Jatuh tempo ('+res.due+') lebih awal dari tanggal terbit ('+res.date+'). Mungkin tertukar — mohon cek.','due');

  /* ----- posisi penting ----- */
  var hdr=-1,buyerAt=null,sellerAt=null,firstTot=L.length;
  _ocr=!L.some(function(l){return l.s&&l.raw.length-l.raw.replace(/^\s+/,'').length>=3});_sn='';
  for(var i0=0;i0<L.length;i0++){if(L[i0].s&&L[i0].cells.some(function(c){return totKey(c.text.trim())&&/\d/.test(L[i0].s)})&&i0>2){firstTot=i0;break}}
  for(var i=0;i<L.length;i++){if(!L[i].s)continue;if(hdr<0&&isHeader(L[i].s)&&i>1)hdr=i;
    L[i].cells.forEach(function(c,ci){var m;
      if(!buyerAt&&i<firstTot&&(m=RX.buyer.exec(c.text))&&c.text.length<60)buyerAt={i:i,ci:ci,rest:(m[1]||'').trim()};
      if(!sellerAt&&i<firstTot&&(i<L.length*.5)&&(m=RX.seller.exec(c.text))&&c.text.length<40&&((m[1]||'').trim()||i<hdr||hdr<0&&i<firstTot-2))sellerAt={i:i,ci:ci,rest:(m[1]||'').trim()}})}
  var topLimit=Math.min(buyerAt?buyerAt.i:1e9,hdr>=0?hdr:1e9,L.length);
  if(sellerAt&&buyerAt&&sellerAt.i>buyerAt.i)topLimit=Math.min(topLimit,sellerAt.i);

  /* ----- pembeli ----- */
  if(buyerAt){var bl=block(L,buyerAt.i,buyerAt.ci,6);if(buyerAt.rest)bl.unshift(buyerAt.rest);
    var bn=null,ba=[],bc=[];
    bl.forEach(function(t){var em=EMAIL.exec(t),ph=PHONEL.exec(t)||(!/jl\.?|jalan|no\.|rt|rw/i.test(t)&&PHONE.exec(t)),np=/npwp/i.test(t);
      if(bn===null&&!em&&!ph&&!np&&!RX.meta.test(t)&&!findDates(t).length)bn=t;
      else if(em||ph||np)bc.push(t);else if(!RX.meta.test(t)&&!findDates(t).length)ba.push(t)});
    if(bn){res.bname=bn;res.found.buyer=true}
    if(ba.length){res.baddr=ba.join('\n');res.found.baddr=true}
    if(bc.length){res.bcontact=bc.join('\n');res.found.bcontact=true}}
  else warn('warn','Blok pembeli ("Kepada"/"Bill To") tidak ditemukan.','bname');

  /* ----- penjual ----- */
  var sl=[];
  if(sellerAt){sl=block(L,sellerAt.i,sellerAt.ci,7);if(sellerAt.rest)sl.unshift(sellerAt.rest)}
  else{var gap=0;for(var j=0;j<topLimit&&sl.length<8;j++){var l=L[j];if(!l.s){if(sl.length)gap++;if(gap>1)break;continue}
      var pick=null;for(var k=0;k<l.cells.length;k++){var t=l.cells[k].text.trim();
        if(RX.title.test(t)||RX.meta.test(t)||findDates(t).length&&t.replace(findDates(t)[0].raw,'').trim().length<4||(res.no&&t.indexOf(res.no)>-1&&t.length<res.no.length+14)||/^halaman|^page\s*\d/i.test(t))continue;
        pick=t;break}
      if(pick&&!STOP.test(pick)){sl.push(pick);for(var k2=0;k2<l.cells.length;k2++){var t2=l.cells[k2].text.trim();if(t2!==pick&&(EMAIL.test(t2)||PHONEL.test(t2)||/npwp/i.test(t2)))sl.push(t2)}}else if(pick&&STOP.test(pick)&&sl.length)break}}
  if(sl.length){var sn=null,sa=[];
    sl.forEach(function(t){var em=EMAIL.exec(t),pl=PHONEL.exec(t),np=/npwp/i.test(t),web=/^(?:www\.|https?:)/i.test(t);
      if(np){var nm=/npwp\s*[:.\-]?\s*([\dOo.\-\s]{15,26})/i.exec(t);if(nm){res.npwp=nm[1].replace(/\s+/g,'').replace(/[Oo]/g,'0').replace(/[.\-]+$/,'');res.found.npwp=true}}
      if(em){res.smail=em[0].replace(/\s/g,'');res.found.smail=true}
      if(pl){res.sphone=pl[1].trim().replace(/[\s\/]+$/,'');res.found.sphone=true}else if(!em&&!np){var ph=PHONE.exec(t);if(ph&&!/jl\.?|jalan/i.test(t)&&t.replace(ph[0],'').replace(/[^A-Za-z]/g,'').length<6){res.sphone=ph[0].trim();res.found.sphone=true;return}}
      if(em||np||pl||web){var rest=t.replace(EMAIL,'').replace(/npwp\s*[:.\-]?\s*[\dOo.\-\s]{15,26}/i,'').replace(PHONEL,'').replace(/\b(?:e-?mail|telp?|phone|hp|wa)\b\s*[:.\-]?/ig,'').replace(/[|•,;\s]+$/,'').trim();if(rest.length>3&&!web)(sn===null?(sn=rest):sa.push(rest));return}
      if(sn===null)sn=t;else sa.push(t)});
    if(sn){res.sname=sn.replace(/^(?:dari|from|penjual)\s*[:.\-]?\s*/i,'');res.found.sname=true;_sn=res.sname}
    if(sa.length){res.saddr=sa.join('\n');res.found.saddr=true}}
  if(!res.npwp){var nm2=/npwp\s*[:.\-]?\s*([\dOo][\dOo.\-\s]{13,24}[\dOo])/i.exec(res.raw);if(nm2){res.npwp=nm2[1].replace(/\s+/g,'').replace(/[Oo]/g,'0');res.found.npwp=true}}
  if(!res.sname)warn('warn','Nama penjual/bisnis tidak terbaca.','sname');

  /* ----- tabel item ----- */
  var start=-1,end=L.length,rows=[],pend=[],discRows=0,startFrom=hdr>=0?hdr+1:0;
  function isTotLine(l){return l.cells.some(function(c){return totKey(c.text.trim())&&/\d/.test(l.s)})||/^(?:terbilang|say\b)/i.test(l.s)}
  if(hdr<0)warn('warn','Header tabel item tidak ditemukan; baris dikenali dari pola angka (kurang pasti).','items');
  for(var r=startFrom;r<L.length;r++){var ln=L[r];if(!ln.s)continue;
    if(isTotLine(ln)||RX.pay.test(ln.cells[0].text)&&ln.cells[0].text.length<40||RX.terms.test(ln.cells[0].text)&&ln.cells[0].text.length<40||RX.notes.test(ln.cells[0].text)&&ln.cells[0].text.length<24||RX.sig.test(ln.s)){end=r;break}
    if(hdr<0){ if(r<topLimit)continue; if(RX.meta.test(ln.s)||findDates(ln.s).length||EMAIL.test(ln.s)||/npwp/i.test(ln.s)||PHONEL.test(ln.s)||BANK.test(ln.s))continue}
    var pr=parseRow(ln.s);
    if(pr.text){ if(hdr<0)continue;
      if(rows.length&&!/^(?:catatan|notes?|terima\s*kasih)/i.test(ln.s)){rows[rows.length-1].n+=' '+ln.s.replace(/\s{2,}/g,' ');rows[rows.length-1].cont=true}else pend.push(ln.s);continue}
    if(/^(?:diskon|discount|potongan)/i.test(pr.desc||'')){res.totals.tdisc=(res.totals.tdisc||0)+Math.abs(pr.t);discRows++;continue}
    if(pr.p<=0&&pr.t<=0)continue;
    var dsc=pr.desc||(pend.length?pend.join(' '):'');pend=[];
    rows.push({n:dsc,q:pr.q,p:pr.p,t:pr.t,how:pr.how,bad:!!pr.bad,fix:!!pr.fix,line:ln.i,amb:!!pr.amb})}
  res.itemsEnd=end;
  if(!rows.length)warn('err','Tidak ada baris item yang berhasil dibaca. Tambahkan item secara manual atau perbaiki teks mentah lalu "Baca ulang".','items');
  rows.forEach(function(r,ix){
    if(!r.n){r.n='';warn('warn','Item '+(ix+1)+': deskripsi tidak terbaca.','items')}
    if(r.bad)warn('warn','Item '+(ix+1)+' ("'+r.n+'"): qty × harga ≠ jumlah di dokumen ('+r.q+' × '+r.p+' ≠ '+r.t+'). Mohon cek angka.','items');
    if(r.how==='hitung-harga')warn('info','Item '+(ix+1)+': harga satuan dihitung dari jumlah ÷ qty.','items');
    if(r.how==='satu-jumlah'||r.amb)warn('info','Item '+(ix+1)+': hanya satu angka tegas terbaca, qty dianggap 1.','items');
    if(r.fix)warn('info','Item '+(ix+1)+': ada karakter angka yang dikoreksi otomatis (mis. O→0).','items')});
  res.items=rows;

  /* ----- total / pajak / diskon / ongkir ----- */
  var un2=[],T=res.totals,seen={};
  var from=Math.max(0,Math.min(end,L.length)-0);
  function valueOf(l,ci,li){ // angka di sebelah kanan label pada baris yang sama; bila kosong, baris berikutnya yang hanya angka
    var rest=l.cells.slice(ci).map(function(c){return c.text}).join('  ').replace(/^[^\s]+(?:\s[^\s0-9%(]+)*/,function(m){return m});
    var toks=rest.split(/\s+/),vals=[],rate=null;
    toks.forEach(function(t,ix){if(/^\(?\d{1,2}(?:[.,]\d+)?\s*%\)?$/.test(t)){rate=parseFloat(t.replace(',','.').replace(/[()%]/g,''));return}
      if(ix===0&&!/\d/.test(t))return;var n=numTok(t);if(n&&(n.money||n.v>=0)&&!/%/.test(t))vals.push(n)});
    var pm=/(\d{1,2}(?:[.,]\d+)?)\s*%/.exec(rest);if(pm&&rate===null)rate=parseFloat(pm[1].replace(',','.'));
    return{vals:vals,rate:rate,text:rest}}
  for(var u=Math.max(0,hdr>=0?hdr+1:0);u<L.length;u++){var lu=L[u];if(!lu.s||u<(rows.length?rows[0].line:0))continue;
    lu.cells.forEach(function(c,ci){var key=totKey(c.text.trim());if(!key)return;
      var v=valueOf(lu,ci,u),money=v.vals.filter(function(n){return n.money||n.v>0}),val=money.length?money[money.length-1]:null;
      if(!val&&!v.rate&&u+1<L.length){var nx=L[u+1];if(nx.s&&/^[Rp\sIDR\d.,\-()]+$/i.test(nx.s)){var n2=numTok(nx.s.replace(/^(?:rp|idr)\.?\s*/i,''));if(n2)val=n2}}
      if(!val&&v.rate===null){un2.push({key:key,line:u});return}
      var rec={v:val?val.v:null,rate:v.rate,line:u,text:c.text.trim()};
      if(key==='sub'||key==='disc'||key==='ship'||key==='tax'||key==='dp'||key==='due'){ if(T[key]===undefined)T[key]=rec; else if(key==='tax'&&rec.v!==null&&T[key].v!==null)T.tax2=rec}
      else if(key==='grand'){ if(val)T.grand=rec }
      else if(key==='pph'){warn('warn','Ada potongan PPh ('+rec.text+'). Modul invoice belum mendukung PPh; abaikan atau tambahkan di catatan.','tax')}})}
  /* label & angka terpisah kolom (OCR) */
  if(un2.length){var nums=[];for(var z=un2[un2.length-1].line+1;z<L.length&&nums.length<un2.length+1;z++){if(L[z].s&&/^[Rp\sIDR\d.,\-()]+$/i.test(L[z].s)){var nz=numTok(L[z].s.replace(/^(?:rp|idr)\.?\s*/i,''));if(nz)nums.push(nz)}}
    if(nums.length>=un2.length){un2.forEach(function(x,ix){if(x.key==='grand'||T[x.key]===undefined){T[x.key==='grand'?'grand':x.key]={v:nums[ix].v,rate:null,line:x.line,text:'',zip:true}}});warn('info','Label dan angka total terpisah kolom; dicocokkan berdasarkan urutan — mohon cek.','totals')}}
  if(!T.grand&&T.due&&!T.dp&&T.due.text&&/amount\s*due|total\s*due|balance\s*due/i.test(T.due.text)){T.grand=T.due;delete T.due}

  if(!T.grand&&T.due&&T.due.v!=null&&T.dp&&T.dp.v!=null){T.grand={v:Math.abs(T.dp.v)+T.due.v,derived:true};warn('info','Baris Total tidak terbaca; total dihitung dari dibayar + sisa tagihan.','totals')}
  /* ----- bentuk akhir: diskon, ongkir, pajak, dp ----- */
  var sumT=0,sumC=0;rows.forEach(function(r){sumT+=r.t;sumC+=Math.round(r.q*r.p)});
  var subDoc=T.sub&&T.sub.v!=null?T.sub.v:null,sub=subDoc!=null?subDoc:sumT;
  var discAmt=0;
  if(T.disc&&T.disc.v!=null){discAmt=Math.abs(T.disc.v)}
  if(res.totals.tdisc)discAmt+=res.totals.tdisc;
  if(discAmt>0){
    if(T.disc&&T.disc.rate!=null&&sub>0&&Math.abs(Math.round(sub*T.disc.rate/100)-discAmt)<=1){res.disc={t:'pct',v:T.disc.rate,amt:discAmt}}
    else res.disc={t:'nom',v:discAmt,amt:discAmt};res.found.disc=true}
  var shipAmt=T.ship&&T.ship.v!=null?Math.abs(T.ship.v):0;if(shipAmt>0){res.ship=shipAmt;res.found.ship=true}
  var after=sub-discAmt,grandDoc=T.grand&&T.grand.v!=null?T.grand.v:null;
  if(T.tax&&(T.tax.v!=null||T.tax.rate!=null)){
    var tv=T.tax.v!=null?Math.abs(T.tax.v):null,tr=T.tax.rate;
    if(tv!=null&&tr==null&&after>0){var cr=tv/after*100,known=[1.1,2,10,11,12,0.5,1,1.2];var kn=known.filter(function(k){return Math.abs(k-cr)<0.12})[0];
      if(kn===undefined&&shipAmt>0){var cr2=tv/(after+shipAmt)*100;kn=known.filter(function(k){return Math.abs(k-cr2)<0.12})[0]}
      tr=kn!==undefined?kn:Math.round(cr*100)/100}
    var inc=false,taxShip=false,expEx=Math.round(after*(tr||0)/100);
    if(tv!=null&&tr!=null){
      if(grandDoc!=null&&Math.abs(grandDoc-(after+shipAmt))<=1&&tv>0)inc=true;
      else if(shipAmt>0&&Math.abs(Math.round((after+shipAmt)*tr/100)-tv)<=1&&Math.abs(expEx-tv)>1)taxShip=true;
      if(!inc&&!taxShip&&Math.abs(expEx-tv)>1&&grandDoc!=null){warn('warn','PPN di dokumen ('+tv+') tidak sama dengan '+tr+'% × dasar ('+expEx+'). Mohon cek.','tax')}}
    res.tax={n:/pajak|ppn|vat|gst|tax/i.exec(T.tax.text||'PPN')?(/^ppn/i.test(T.tax.text)?'PPN':/^vat/i.test(T.tax.text)?'VAT':/^pajak/i.test(T.tax.text)?'Pajak':/^gst/i.test(T.tax.text)?'GST':/^tax/i.test(T.tax.text)?'Tax':'PPN'):'PPN',r:tr!=null?tr:11,inc:inc,amt:tv};res.taxShip=taxShip;res.found.tax=true}
  if(T.dp&&T.dp.v!=null){res.dp=Math.abs(T.dp.v);res.found.dp=true}
  else if(T.due&&T.due.v!=null&&grandDoc!=null&&T.due.v<grandDoc){res.dp=grandDoc-T.due.v;res.found.dp=true;warn('info','Uang muka dihitung dari total − sisa tagihan.','dp')}

  /* ----- instruksi / syarat / catatan ----- */
  function grab(rx,maxLines,lenLimit){var out=[];for(var i=0;i<L.length;i++){if(!L[i].s)continue;for(var ci=0;ci<L[i].cells.length;ci++){var c=L[i].cells[ci].text,m=rx.exec(c);if(m&&(c.length-(m[1]||'').length)<=lenLimit){var bl=block(L,i,ci,maxLines);if(m[1]&&m[1].trim())bl.unshift(m[1].trim());if(bl.length)return bl}}}return null}
  var pay=grab(RX.pay,8,60),terms=grab(RX.terms,10,60),notes=grab(RX.notes,6,30);
  if(!pay){var pl2=L.filter(function(l,ix){return l.s&&ix>=(hdr>=0?hdr:0)&&BANK.test(l.s)&&/\d{6,}|\d{3}[\s\-]\d{3}/.test(l.s)&&!TOT.some(function(t){return t[1].test(l.s)})}).map(function(l){return l.cells[0].text});if(pl2.length)pay=pl2.slice(0,4)}
  if(!notes){var tk2=L.filter(function(l){return /terima\s*kasih|thank\s*you/i.test(l.s)&&l.s.length<160});if(tk2.length)notes=[tk2[tk2.length-1].s]}
  if(pay){res.pay=pay.join('\n');res.found.pay=true}
  if(terms){res.terms=terms.join('\n');res.found.terms=true}
  if(notes){res.notes=notes.join('\n');res.found.notes=true}

  /* ================= VERIFIKASI SILANG ================= */
  function chk(ok,msg,f){C.push({ok:ok,msg:msg,field:f||''})}
  var rowsBad=rows.some(function(r){return r.bad});
  if(rows.length){
    if(!rowsBad)chk(true,'Setiap baris item: qty × harga = jumlah ('+rows.length+' baris).','items');
    if(subDoc!=null){
      if(Math.abs(sumT-subDoc)<=1)chk(true,'Jumlah semua item = subtotal dokumen (Rp '+subDoc.toLocaleString('id-ID')+').','items');
      else{
        /* coba perbaikan 1 baris: bila mengganti total 1 baris membuat jumlah cocok */
        var delta=subDoc-sumT,fixed=false;
        rows.forEach(function(r,ix){if(fixed)return;if(Math.abs(r.q*r.p-(r.t+delta))<=1||r.bad&&Math.abs(r.q*r.p-(r.t+delta))<=1){}});
        var cand=rows.map(function(r,ix){return{ix:ix,r:r}}).filter(function(o){return o.r.bad&&Math.abs(Math.round(o.r.q*o.r.p)+(sumT-o.r.t)-subDoc)<=1});
        if(cand.length===1){var o=cand[0].r;chk(true,'Item '+(cand[0].ix+1)+' dikoreksi: qty × harga ('+Math.round(o.q*o.p)+') dipakai karena cocok dengan subtotal.','items');var oldT=o.t;o.t=Math.round(o.q*o.p);o.bad=false;warn('warn','Item '+(cand[0].ix+1)+': jumlah di dokumen terbaca '+oldT.toLocaleString('id-ID')+', tetapi qty × harga = '+o.t.toLocaleString('id-ID')+' dan cocok dengan subtotal. Dipakai '+o.t.toLocaleString('id-ID')+' — cek dengan dokumen asli.','items');for(var wi=W.length-1;wi>=0;wi--)if(W[wi].msg.indexOf('Item '+(cand[0].ix+1)+' (')===0&&W[wi].msg.indexOf('≠ jumlah')>-1)W.splice(wi,1);o.corrected=true;sumT=rows.reduce(function(s,x){return s+x.t},0);sumC=sumT}
        else{
          var d2=subDoc-sumC;
          chk(false,'Jumlah item (Rp '+sumC.toLocaleString('id-ID')+') ≠ subtotal dokumen (Rp '+subDoc.toLocaleString('id-ID')+'); selisih Rp '+Math.abs(d2).toLocaleString('id-ID')+(d2>0?'. Kemungkinan ada baris yang belum terbaca.':'. Kemungkinan ada baris terbaca ganda atau angka salah.'),'items');res.itemsDelta=d2}}}
    else chk(null,'Subtotal tidak tertera di dokumen — tidak ada pembanding untuk jumlah item.','items')}
  var calcSub=sumC,calcAfter=calcSub-money(res.disc?res.disc.amt:0)+0,exp=null;
  if(grandDoc!=null){
    var disc2=res.disc?(res.disc.t==='pct'?Math.round(calcSub*res.disc.v/100):Math.min(res.disc.v,calcSub)):0,aft=calcSub-disc2,sh=res.ship||0,tb=aft+(res.taxShip?sh:0),tx=0;
    if(res.tax){tx=res.tax.inc?Math.round(tb-tb/(1+res.tax.r/100)):Math.round(tb*res.tax.r/100)}
    exp=aft+sh+(res.tax&&res.tax.inc?0:tx);
    if(Math.abs(exp-grandDoc)<=1)chk(true,'Total hasil hitung = total dokumen (Rp '+grandDoc.toLocaleString('id-ID')+').','totals');
    else{chk(false,'Total hasil hitung (Rp '+exp.toLocaleString('id-ID')+') ≠ total di dokumen (Rp '+grandDoc.toLocaleString('id-ID')+'); selisih Rp '+Math.abs(grandDoc-exp).toLocaleString('id-ID')+'. Mungkin ada biaya/pajak lain yang tidak terbaca.','totals');res.grandDelta=grandDoc-exp}
    res.grandDoc=grandDoc}
  else chk(null,'Total akhir tidak tertera / tidak terbaca — tidak bisa diverifikasi.','totals');

  /* ----- skor keyakinan ----- */
  var sc=100;W.forEach(function(w){sc-=(w.lvl==='err'?35:w.lvl==='warn'?10:0)});C.forEach(function(c){if(c.ok===false)sc-=25;else if(c.ok===null)sc-=8});
  if(!rows.length)sc=Math.min(sc,20);if(!res.found.no)sc-=4;if(!res.found.date)sc-=4;
  res.score=Math.max(0,Math.min(100,sc));res.level=res.score>=85?'tinggi':res.score>=60?'sedang':'rendah';
  return res}

/* ---------- susun teks berposisi dari item pdf.js (dipakai saat membaca PDF digital) ---------- */
function layoutText(items,pageNo){
  var rows=[];items.forEach(function(it){if(!it.str||!it.str.trim())return;var y=it.transform[5],x=it.transform[4],h=it.height||Math.abs(it.transform[3])||10;
    var r=null;for(var k=0;k<rows.length;k++)if(Math.abs(rows[k].y-y)<=Math.max(2.5,h*.35)){r=rows[k];break}
    if(!r){r={y:y,a:[]};rows.push(r)}r.a.push({x:x,s:it.str,w:it.width||0,h:h})});
  if(!rows.length)return'';
  rows.sort(function(a,b){return b.y-a.y});
  var ws=[];rows.forEach(function(r){r.a.forEach(function(c){if(c.s.length>=3&&c.w>0)ws.push(c.w/c.s.length)})});ws.sort(function(a,b){return a-b});
  var cw=ws.length?ws[ws.length>>1]:5;if(cw<2)cw=5;
  var gaps=[];for(var i=1;i<rows.length;i++)gaps.push(rows[i-1].y-rows[i].y);gaps.sort(function(a,b){return a-b});var mg=gaps.length?gaps[gaps.length>>1]:12;
  var out=[];
  rows.forEach(function(r,ri){
    if(ri>0&&rows[ri-1].y-r.y>mg*2.1)out.push('');
    r.a.sort(function(p,q){return p.x-q.x});var s='',endX=null;
    r.a.forEach(function(c){var col=Math.round(c.x/cw);
      if(endX===null){s=new Array(col+1).join(' ')+c.s}
      else{var gp=c.x-endX;
        if(gp>Math.max(cw*1.8,c.h*.9)){var padN=Math.max(2,col-s.length);s+=new Array(padN+1).join(' ')+c.s}
        else if(gp>Math.max(c.h*.17,.8))s+=' '+c.s;else s+=c.s}
      endX=c.x+c.w});
    out.push(s)});
  return out.join('\n')}

root.VFInvParse={parse:parse,parseNum:parseNum,findDates:findDates,layoutText:layoutText,parseRow:parseRow,toLines:toLines};
})(typeof window!=='undefined'?window:globalThis);
