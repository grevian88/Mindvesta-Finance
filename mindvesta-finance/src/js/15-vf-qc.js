
/* ====== VFQC ENGINE: parser bahasa Indonesia sehari-hari (murni, tanpa DOM) ====== */
var VFQCE=(function(){
'use strict';
var MONTHS=['januari','februari','maret','april','mei','juni','juli','agustus','september','oktober','november','desember'];
var MON_RE='januari|februari|pebruari|maret|april|mei|juni|juli|agustus|agustus|september|oktober|november|nopember|desember|jan|feb|mar|apr|jun|jul|agu|ags|agt|sep|sept|okt|nov|nop|des';
var MON_IDX={januari:0,jan:0,februari:1,pebruari:1,feb:1,maret:2,mar:2,april:3,apr:3,mei:4,juni:5,jun:5,juli:6,jul:6,agustus:7,agu:7,ags:7,agt:7,september:8,sep:8,sept:8,oktober:9,okt:9,november:10,nopember:10,nov:10,nop:10,desember:11,des:11};
var WD={minggu:0,ahad:0,senin:1,selasa:2,rabu:3,kamis:4,jumat:5,sabtu:6};
var NUMW={nol:0,satu:1,dua:2,tiga:3,empat:4,lima:5,enam:6,tujuh:7,delapan:8,sembilan:9,sepuluh:10};
var SLANG_AMT={seceng:1000,goceng:5000,gopek:500,ceban:10000,goban:50000,gocap:50000,cepek:100000,cepe:100000,noceng:5000,sejeti:1000000};

/* ---------- util tanggal ---------- */
function mid(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
function dim(y,m){return new Date(y,m+1,0).getDate()}
function isoOf(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function addDays(d,n){var x=new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);return x}
function mondayOf(d){var x=mid(d),k=(x.getDay()+6)%7;return addDays(x,-k)}
function cnt(s){if(s==null||s==='')return 1;s=String(s);if(/^\d+$/.test(s))return +s;if(s==='se')return 1;return NUMW[s]!=null?NUMW[s]:1}

/* ---------- normalisasi bahasa gaul/singkatan ---------- */
var SLANG=[
 [/[​‌‍﻿]/g,''],[/[‘’`´]/g,"'"],[/[“”]/g,'"'],
 [/\b(?:kmrn|kemaren|kmaren|kemrn|kmarin|kemarennn|kmren|kemarin+)\b/g,'kemarin'],
 [/\b(?:bln|blan|bulang)\b/g,'bulan'],
 [/\b(?:mgg|mggu|mng|pekan|pkn)\b/g,'minggu'],
 [/\b(?:thn|thun|taun)\b/g,'tahun'],
 [/\b(?:tgl|tanggl|tgal|tggl|tg)\b(?=\s*\d)/g,'tanggal'],
 [/\b(?:hr|hri)\b/g,'hari'],
 [/\b(?:sblm|sblmnya|sebelomnya|sebelum nya)\b/g,'sebelumnya'],
 [/\b(?:yg|yng)\b/g,'yang'],[/\bdr\b/g,'dari'],[/\bdgn\b/g,'dengan'],[/\bpk\b|\bpake\b|\bpakek\b|\bmakai\b|\bmemakai\b|\bmenggunakan\b/g,'pakai'],
 [/\b(?:tf|trf|trsf|trnsfr|transfr|tranfer|trasnfer|transver|transfeer)\b/g,'transfer'],
 [/\bdi\s+(transfer|kirim|kirimin|kasih|kasi|bayar|bayarin|terima|jual|beliin|belikan|balikin|traktir|ganti|tf|trf|trasfer|transferin)\b/g,'di$1'],
 [/\b(ditf|ditrf)\b/g,'ditransfer'],
 [/\b(?:byr|byar|bayr)\b/g,'bayar'],[/\b(?:blanja|blnja|belnja)\b/g,'belanja'],[/\b(?:bli|beli2)\b/g,'beli'],
 [/\b(?:gajian|gajihan|gajih|gaji an)\b/g,'gaji'],
 [/\b(?:udh|udah|sdh|sudah|dah|telah)\b/g,'sudah'],
 [/\b(?:td|tdi)\b/g,'tadi'],[/\b(?:brusan|barusan|baru saja|baru aja|bru aja)\b/g,'barusan'],
 [/\b(?:e[- ]?wallet|ewallet|dompet digital|e money|emoney)\b/g,'ewallet'],
 [/\b(?:shopee ?pay|spay|s-pay)\b/g,'shopeepay'],[/\bgo[- ]?pay\b/g,'gopay'],[/\blink ?aja\b/g,'linkaja'],
 [/\b(?:m[- ]?banking|mbank|ibanking|i-banking|internet banking|net banking)\b/g,'mbanking'],
 [/\bpay ?later\b|\bs?paylater\b/g,'paylater'],
 [/\bsea ?bank\b/g,'seabank'],[/\bbank ?jago\b/g,'jago'],[/\bbank ?neo\b/g,'neo'],
 [/\bdi\s+(dapat|dapet|dpt)\b/g,'dapat'],
 [/\b(?:dapet|dpt|dpet|dapt)\b/g,'dapat'],
 [/\b(?:nerima|menerima|nerimain)\b/g,'terima'],
 [/\b(?:dikasi|dikasih in|di kasih|dikasiin|dikasihin)\b/g,'dikasih'],
 [/\b(?:duitnya|uangnya)\b/g,'duit'],
 [/\b(?:rb\.|rbu)\b/g,'rb'],
 [/\bsatu\s+(?=ribu|juta)/g,'se'],
 [/\bjum'?at\b|\bjumat\b|\bjum at\b/g,'jumat'],[/\bkemis\b/g,'kamis'],[/\bsabtu\b/g,'sabtu'],
 [/\bhari\s+ini\b/g,'hariini'],[/\bbulan\s+ini\b/g,'bulanini'],[/\bminggu\s+ini\b/g,'mingguini'],[/\btahun\s+ini\b/g,'tahunini']
];
function normalize(s){
 s=String(s==null?'':s).toLowerCase().replace(/\s+/g,' ').trim();
 for(var i=0;i<SLANG.length;i++)s=s.replace(SLANG[i][0],SLANG[i][1]);
 return s.replace(/\s+/g,' ').trim();
}

/* ---------- angka dalam kata ---------- */
var NW_WORDS=['setengah','seperempat','sembilan','delapan','sepuluh','sebelas','seratus','seribu','sejuta','sejeti','semiliar','semilyar','tujuh','empat','enam','tiga','lima','satu','dua','belas','puluh','ratus','ribu','rebu','juta','jeti','miliar','milyar','nol','se'];
function splitNum(tok){
 if(!/^[a-z]+$/.test(tok))return null;
 var memo={};
 function go(i){
  if(i===tok.length)return [];
  if(memo[i]!==undefined)return memo[i];
  for(var k=0;k<NW_WORDS.length;k++){var w=NW_WORDS[k];
   if(tok.substr(i,w.length)===w){var r=go(i+w.length);if(r){memo[i]=[w].concat(r);return memo[i]}}}
  memo[i]=null;return null}
 var r=go(0);return r&&r.length?r:null;
}
function evalWords(ws){
 var total=0,chunk=0,last=0,half=false,sawScale=false,i;
 for(i=0;i<ws.length;i++){var w=ws[i];
  if(NUMW[w]!=null&&w!=='sepuluh'){last=NUMW[w];continue}
  if(w==='se'){last=1;continue}
  if(w==='sepuluh'){chunk+=10;continue}
  if(w==='sebelas'){chunk+=11;continue}
  if(w==='belas'){chunk+=(last||0)+10;last=0;continue}
  if(w==='puluh'){chunk+=(last||1)*10;last=0;continue}
  if(w==='seratus'){chunk+=100;continue}
  if(w==='ratus'){chunk+=(last||1)*100;last=0;continue}
  if(w==='setengah'){half=true;continue}
  if(w==='seperempat'){half=.5;continue}
  var mult=0;
  if(w==='ribu'||w==='rebu')mult=1e3;else if(w==='juta'||w==='jeti')mult=1e6;else if(w==='miliar'||w==='milyar')mult=1e9;
  else if(w==='seribu'){total+=1e3;continue}else if(w==='sejuta'||w==='sejeti'){total+=1e6;continue}else if(w==='semiliar'||w==='semilyar'){total+=1e9;continue}
  if(mult){var v=chunk+last+(half===true?.5:half?.25:0);if(v===0)v=1;total+=v*mult;chunk=0;last=0;half=false;sawScale=true;continue}
 }
 total+=chunk+last;
 return {v:Math.round(total),scale:sawScale||ws.some(function(w){return w==='seribu'||w==='sejuta'||w==='sejeti'||w==='semiliar'})};
}

/* ---------- tanggal ---------- */
var PREP='(?:(?:dari|di|pada|pas|waktu|sejak|sekitar|kira-kira|kurang lebih|hari)\\s+)?';
function extractDate(t,now){
 var base=mid(now),R={dayShift:0,weekShift:0,monthShift:0,yearShift:0,wd:null,strict:false,day:null,month:null,year:null,part:null,weekExplicit:false,abs:null,future:false},phr=[],found=false,m;
 function eat(re,fn){var guard=0;while((m=re.exec(t))&&guard++<6){var s=m[0];var pre=t.slice(Math.max(0,m.index-12),m.index);
   if(/(?:untuk|buat|utk|bwt|bagi)\s*$/.test(pre)&&/bulan|minggu|tahun/.test(s)){ /* "untuk bulan lalu" = peruntukan, bukan tanggal transaksi */
     re.lastIndex=m.index+s.length;
     if(re.global===false)break;continue}
   fn(m);phr.push(s.trim());found=true;
   t=(t.slice(0,m.index)+' '+t.slice(m.index+s.length)).replace(/\s+/g,' ');re.lastIndex=0}}
 /* tanggal lengkap */
 eat(new RegExp('\\b'+PREP+'(\\d{4})-(\\d{1,2})-(\\d{1,2})\\b'),function(m){R.abs=new Date(+m[1],+m[2]-1,+m[3])});
 if(!R.abs)eat(new RegExp('\\b'+PREP+'(?:tanggal\\s+)?(\\d{1,2})[\\/\\-.](\\d{1,2})[\\/\\-.](\\d{2,4})\\b(?!\\d)'),function(m){var y=+m[3];if(y<100)y+=2000;R.abs=new Date(y,+m[2]-1,+m[1])});
 if(!R.abs)eat(new RegExp('\\b'+PREP+'(?:tanggal\\s+)?(\\d{1,2})\\/(\\d{1,2})\\b(?![\\d\\/])'),function(m){if(+m[2]>=1&&+m[2]<=12&&+m[1]>=1&&+m[1]<=31){R.day=+m[1];R.month=+m[2]-1}});
 /* tanggal + nama bulan (+tahun) */
 eat(new RegExp('\\b'+PREP+'(?:tanggal\\s+)?(\\d{1,2})\\s*(?:-|\\s)?\\s*('+MON_RE+')\\b\\.?(?:\\s+(\\d{4}))?'),function(m){R.day=+m[1];R.month=MON_IDX[m[2]];if(m[3])R.year=+m[3]});
 eat(/\b(?:dari|di|pada|pas|waktu|sejak)?\s*tanggal\s+(\d{1,2})\b(?:\s+bulan\s+(?:yang\s+)?(lalu|kemarin|sebelumnya)|\s+(lalu))?/,function(m){R.day=+m[1];if(m[2]||m[3])R.monthShift-=1});
 /* bulan lalu / ini / depan, dengan "awal/akhir/pertengahan" */
 eat(/\b(\d{1,2}|satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan|sepuluh)\s*bulan\s+(?:yang\s+)?(?:lalu|lewat|kemarin|sebelumnya)\b/,function(m){R.monthShift-=cnt(m[1])});
 eat(/\b(?:(awal|akhir|ujung|pertengahan|tengah)\s+)?bulan\s+(?:yang\s+)?(lalu|kemarin|sebelumnya|lewat)\b/,function(m){R.monthShift-=1;if(m[1])R.part=/awal/.test(m[1])?'awal':/akhir|ujung/.test(m[1])?'akhir':'tengah'});
 eat(/\b(?:(awal|akhir|ujung|pertengahan|tengah)\s+)?bulan\s+depan\b/,function(m){R.monthShift+=1;R.future=true;if(m[1])R.part=/awal/.test(m[1])?'awal':/akhir|ujung/.test(m[1])?'akhir':'tengah'});
 eat(/\b(?:(awal|akhir|ujung|pertengahan|tengah)\s+)?bulanini\b/,function(m){if(m[1])R.part=/awal/.test(m[1])?'awal':/akhir|ujung/.test(m[1])?'akhir':'tengah'});
 eat(/\bse(bulan)\s+(?:yang\s+)?(?:lalu|lewat|kemarin|sebelumnya)\b/,function(){R.monthShift-=1});
 eat(/\b(\d{1,2}|satu|dua|tiga|empat|lima|enam)\s*bulan\s+(?:lagi|kedepan|ke depan)\b/,function(m){R.monthShift+=cnt(m[1]);R.future=true});
 /* tahun */
 eat(/\b(?:(\d{1,2}|satu|dua|tiga)\s*tahun|setahun)\s+(?:yang\s+)?(?:lalu|lewat|kemarin|sebelumnya)\b/,function(m){R.yearShift-=cnt(m[1])});
 eat(/\btahun\s+(?:yang\s+)?(?:lalu|kemarin|sebelumnya|lewat)\b/,function(){R.yearShift-=1});
 eat(/\btahun\s+depan\b/,function(){R.yearShift+=1;R.future=true});
 eat(/\btahunini\b/,function(){});
 /* hari-hari dalam seminggu (dahulukan sebelum frasa "minggu") */
 var wdRe=/\b(?:hari\s+)?(senin|selasa|rabu|kamis|jumat|sabtu|ahad)(?:\s+(lalu|kemarin|kmrn|sebelumnya))?\b/;
 eat(wdRe,function(m){R.wd=WD[m[1]];if(m[2])R.strict=true});
 if(R.wd==null)eat(/\bhari\s+minggu(?:\s+(lalu|kemarin|sebelumnya))?\b/,function(m){R.wd=0;if(m[1])R.strict=true});
 if(R.wd==null)eat(/\bminggu(?=\s+(?:pagi|siang|sore|malam)\b)/,function(){R.wd=0});
 /* minggu lalu dst */
 eat(/\b(?:(\d{1,2}|satu|dua|tiga|empat)\s*)?minggu\s+(?:yang\s+)?(?:lalu|lewat|kemarin|sebelumnya)\b/,function(m){R.weekShift-=cnt(m[1]);R.weekExplicit=true});
 eat(/\bse(minggu)\s+(?:yang\s+)?(?:lalu|lewat|kemarin|sebelumnya)\b/,function(){R.weekShift-=1;R.weekExplicit=true});
 eat(/\bminggu\s+depan\b/,function(){R.weekShift+=1;R.weekExplicit=true;R.future=true});
 eat(/\b(\d{1,2}|satu|dua|tiga|empat)\s*minggu\s+(?:lagi|kedepan|ke depan)\b/,function(m){R.weekShift+=cnt(m[1]);R.weekExplicit=true;R.future=true});
 eat(/\bmingguini\b/,function(){R.weekExplicit=true});
 /* hari lalu */
 eat(/\b(?:kemarin\s+lusa|lusa\s+kemarin|kemarin\s+dulu|kemaren\s+dulu)\b/,function(){R.dayShift-=2});
 eat(/\b(\d{1,3}|satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan|sepuluh)\s*hari\s+(?:yang\s+)?(?:lalu|lewat|kemarin|sebelumnya|silam)\b/,function(m){R.dayShift-=cnt(m[1])});
 eat(/\bsehari\s+(?:yang\s+)?(?:lalu|lewat|sebelumnya)\b/,function(){R.dayShift-=1});
 eat(/\b(\d{1,3}|satu|dua|tiga|empat|lima|enam|tujuh)\s*hari\s+(?:lagi|kedepan|ke depan)\b/,function(m){R.dayShift+=cnt(m[1]);R.future=true});
 eat(/\b(?:semalam|tadi\s+malam|kemarin\s+(?:malam|sore|siang|pagi)|malam\s+tadi|malam\s+kemarin|kemarin)\b/,function(){R.dayShift-=1});
 eat(/\b(?:besok(?:\s+(?:pagi|siang|sore|malam))?)\b/,function(){R.dayShift+=1;R.future=true});
 eat(/\blusa\b/,function(){R.dayShift+=2;R.future=true});
 eat(/\b(?:hariini|barusan|sekarang|tadi\s+(?:pagi|siang|sore)|(?:pagi|siang|sore)\s+tadi|tadi)\b/,function(){});
 /* nama bulan tanpa tanggal: wajib didahului "bulan"/"di"/"pada" kecuali nama panjang yang tak ambigu */
 eat(new RegExp('\\b(?:(?:dari|di|pada|pas|waktu|sejak|buat|untuk)\\s+)?bulan\\s+('+MON_RE+')\\b(?:\\s+(\\d{4}))?'),function(m){R.month=MON_IDX[m[1]];if(m[2])R.year=+m[2]});
 eat(/\b(?:dari|di|pada|pas|waktu|sejak)\s+(januari|februari|maret|juni|juli|agustus|september|oktober|november|desember|mei|april)\b(?:\s+(\d{4}))?/,function(m){R.month=MON_IDX[m[1]];if(m[2])R.year=+m[2]});
 eat(/\b(januari|februari|maret|juni|juli|agustus|september|oktober|november|desember)\b(?:\s+(\d{4}))?(?=\s*(?:lalu|kemarin)?\s*$|\s)/,function(m){R.month=MON_IDX[m[1]];if(m[2])R.year=+m[2]});
 /* tanggal N (tanpa bulan) */
 var date=null,label=[];
 if(R.abs){date=mid(R.abs)}else{
  var y=base.getFullYear(),mo=base.getMonth(),dd=base.getDate(),monthGiven=R.month!=null||R.monthShift!==0||R.yearShift!==0||R.year!=null;
  if(R.month!=null){mo=R.month;if(R.year!=null)y=R.year;else if(mo>base.getMonth()&&!R.future)y=y-1}
  else if(R.year!=null)y=R.year;
  y+=R.yearShift;mo+=R.monthShift;y+=Math.floor(mo/12);mo=((mo%12)+12)%12;
  var D=dim(y,mo);
  if(R.day!=null){dd=R.day;if(!monthGiven&&dd>base.getDate()){mo-=1;if(mo<0){mo=11;y-=1}D=dim(y,mo)}}
  else if(R.part){dd=R.part==='awal'?1:R.part==='akhir'?D:15}
  dd=Math.max(1,Math.min(dd,D));
  date=new Date(y,mo,dd);
  if(R.weekShift||R.dayShift)date=addDays(date,R.weekShift*7+R.dayShift);
  if(R.wd!=null){
   if(R.weekExplicit){var mon=mondayOf(addDays(base,R.weekShift*7));date=addDays(mon,(R.wd+6)%7)}
   else{var from=R.dayShift?date:base,diff=(from.getDay()-R.wd+7)%7;if(R.strict&&diff===0)diff=7;date=addDays(from,-diff)}
  }
 }
 var fut=date.getTime()>base.getTime();
 return {text:t.replace(/\s+/g,' ').trim(),date:found?date:null,found:found,phrases:phr,future:fut,rel:R};
}

/* ---------- jam (dibuang agar tidak dianggap nominal) ---------- */
function stripTime(t){
 return t.replace(/\b(?:jam|pukul|pkl|jm)\s*\d{1,2}(?:[.:]\d{2})?(?:\s*(?:pagi|siang|sore|malam|wib|wita|wit))?\b/g,' ')
  .replace(/\b\d{1,2}:\d{2}(?::\d{2})?\s*(?:wib|wita|wit)?\b/g,' ')
  .replace(/\b\d{1,2}\.\d{2}\s*(?:wib|wita|wit)\b/g,' ')
  .replace(/\s+/g,' ').trim();
}

/* ---------- nominal ---------- */
var NON_MONEY_UNIT='kg|kilo|gr|gram|g|mg|ml|liter|lt|l|km|m|cm|mm|mb|gb|tb|menit|jam|detik|hari|minggu|bulan|tahun|buah|pcs|biji|porsi|orang|org|kali|lembar|bungkus|bks|botol|gelas|potong|unit|persen|pak|pack|slot|level|lvl|butir|ekor|sachet|dus|kotak|karung|sak|meter|inci|inch|lusin|kodi|rim|roll|set|paket|hp|th|thn|bln|hr|mg|mgg|x|kalii?|cup|slice';
function findAmounts(t){
 var out=[],used=[],m;
 function free(s,e){for(var i=0;i<used.length;i++)if(s<used[i][1]&&e>used[i][0])return false;return true}
 function add(o){if(free(o.start,o.end)){used.push([o.start,o.end]);out.push(o)}}
 /* 1) slang */
 var re=/\b(seceng|goceng|gopek|ceban|goban|gocap|cepek|cepe|noceng)\b/g;
 while((m=re.exec(t)))add({start:m.index,end:m.index+m[0].length,v:SLANG_AMT[m[1]],kind:'slang',sc:5,raw:m[0]});
 /* 2) angka + "setengah" + satuan: 2 setengah juta */
 re=/\b(\d+)\s*setengah\s*(juta|jt|ribu|rb)\b/g;
 while((m=re.exec(t))){var mu=/j/.test(m[2])?1e6:1e3;add({start:m.index,end:m.index+m[0].length,v:Math.round((+m[1]+.5)*mu),kind:'unit',sc:5,raw:m[0]})}
 /* 3) rp / angka dengan satuan */
 re=/(rp\.?|idr)?\s*(\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?|\d+(?:[.,]\d+)?)\s*(juta|jt|jeti|miliar|milyar|ribuan|ribu|rebu|rb|rbn|k|perak|rupiah|rp|,-|-)?(?![a-z])/g;
 while((m=re.exec(t))){
  var s=m.index,e=s+m[0].length;
  /* buang spasi awal bila tidak ada "rp" */
  if(!m[1]){var lead=m[0].match(/^\s+/);if(lead)s+=lead[0].length}
  var numTxt=m[2],unit=m[3]||'',pre=t.slice(Math.max(0,s-8),s),post=t.slice(e,e+14);
  if(/(?:no|nomor|ke|kamar|lantai|blok|rt|rw|id|kode|pin|otp|plat|tlp|telp|wa|hp)\.?\s*[-#]?\s*$/.test(pre)&&!m[1]&&!unit)continue;
  if(/^[a-z]/.test(post.trim())&&!unit&&!m[1]){ /* angka + kata: cek satuan non-uang */
    var w=post.trim().match(/^[a-z]+/)[0];if(new RegExp('^(?:'+NON_MONEY_UNIT+')$').test(w))continue}
  if(/^\s*%/.test(post)||/^\s*[x×]\b/.test(post)&&!unit)continue;
  var v,grouped=/^\d{1,3}([.,]\d{3})+/.test(numTxt)&&!/^0/.test(numTxt);
  var digits=numTxt.replace(/[^\d]/g,'');
  if(grouped&&!unit){var main=numTxt.replace(/[.,]\d{1,2}$/,function(x){return /[.,]\d{3}$/.test(numTxt)?x:''});v=+main.replace(/[.,]/g,'')}
  else if(grouped&&unit){v=+numTxt.replace(/[.,]/g,'')}
  else v=parseFloat(numTxt.replace(',','.'));
  if(!isFinite(v))continue;
  var mult=1,u=unit.replace(/^,?-$/,'');
  if(/^(juta|jt|jeti)$/.test(u))mult=1e6;else if(/^(miliar|milyar)$/.test(u))mult=1e9;else if(/^(ribuan|ribu|rebu|rb|rbn|k)$/.test(u))mult=1e3;
  var kind,sc,flag='';
  if(mult>1){v=Math.round(v*mult);kind='unit';sc=5}
  else if(m[1]||/^(perak|rupiah|rp)$/.test(u)||/^,?-$/.test(unit)){v=Math.round(v);kind='rp';sc=6}
  else if(grouped){v=Math.round(v);kind='grouped';sc=4}
  else if(digits.length>=4&&!/[.,]/.test(numTxt)){v=Math.round(v);kind='bare';sc=3}
  else{ /* angka kecil tanpa satuan (mis. "kopi 18") */
    if(/[.,]/.test(numTxt)&&v<1000&&!/^\d+[.,]\d{3}$/.test(numTxt)){v=Math.round(v*1000);kind='small';sc=1;flag='small'}
    else{v=Math.round(v*1000);kind='small';sc=1;flag='small'}}
  if(v<=0)continue;
  if(digits.length>=11&&!unit&&!m[1])continue; /* nomor rekening/hp */
  add({start:s,end:e,v:v,kind:kind,sc:sc,raw:m[0].trim(),flag:flag,orig:numTxt});
 }
 /* 4) angka dalam kata ("lima belas ribu", "seratus ribu", "setengah juta") */
 var toks=[],tr=/\S+/g;
 while((m=tr.exec(t)))toks.push({w:m[0],s:m.index,e:m.index+m[0].length});
 var i=0;
 while(i<toks.length){
  var parts=splitNum(toks[i].w.replace(/[.,;:!?]+$/,''));
  if(!parts){i++;continue}
  var j=i,words=[],ok=true;
  while(j<toks.length){var p=splitNum(toks[j].w.replace(/[.,;:!?]+$/,''));if(!p)break;words=words.concat(p);j++}
  var ev=evalWords(words);
  var after=j<toks.length?toks[j].w:'';
  var hasUnitAfter=/^(?:rupiah|perak|rp)$/.test(after);
  if(ev.v>0&&(ev.scale||hasUnitAfter&&ev.v>=100)){
    var st=toks[i].s,en=toks[j-1].e+(hasUnitAfter?1+after.length:0);
    add({start:st,end:en,v:ev.v,kind:'words',sc:4,raw:t.slice(st,en)})}
  i=j;
 }
 out.sort(function(a,b){return a.start-b.start});
 return out;
}

/* ---------- dompet / cara bayar ---------- */
var BANK_BR='bca|bri|bni|mandiri|cimb|niaga|permata|btn|bsi|danamon|ocbc|nobu|panin|maybank|mega|bjb|bukopin|btpn|jago|seabank|blu|jenius|neo|allo|livin|brimo|wondr|bank|rekening|rek|atm|debit|mbanking';
var EW_BR='gopay|ovo|shopeepay|linkaja|isaku|sakuku|doku|paypal|ewallet|qris|flazz|brizzi|tapcash|dana';
var PREPW='(?:pakai|via|lewat|melalui|dengan|secara|by|dari|ke|di|dr|ke dalam|masuk ke|masuk|ke rekening|rekening)';
function findWallets(t){
 var res=[],m,re;
 /* tunai */
 re=/\b(?:(pakai|dari|via|secara|dengan|bayar|di)\s+)?(?:uang\s+|duit\s+)?(tunai|cash|kontan|cod|kes)\b/g;
 while((m=re.exec(t)))res.push({cls:'cash',brand:null,prep:m[1]||'',s:m.index,e:m.index+m[0].length,w:m[2]});
 re=/\b(?:(pakai|dari|via|secara|dengan|bayar|ambil|di)\s+)?(?:kas\s+tunai|dompet|kas)\b(?!\s*(?:rt|rw|masjid|kelas|kantor))/g;
 while((m=re.exec(t)))if(/kas\s+tunai|dompet/.test(m[0])||/\bpakai\s+kas\b/.test(m[0]))res.push({cls:'cash',brand:null,prep:m[1]||'',s:m.index,e:m.index+m[0].length,w:'kas'});
 /* e-wallet (kecuali "dana") */
 re=new RegExp('\\b(?:('+PREPW.slice(3,-1)+'|topup|top up|isi|transfer|ditransfer|kirim|dikirim|saldo)\\s+)?(gopay|ovo|shopeepay|linkaja|isaku|sakuku|doku|paypal|ewallet|qris|flazz|brizzi|tapcash)\\b','g');
 while((m=re.exec(t)))res.push({cls:'ewallet',brand:m[2]==='ewallet'||m[2]==='qris'?null:m[2],prep:m[1]||'',s:m.index,e:m.index+m[0].length,w:m[2]});
 /* DANA: hanya bila konteksnya jelas dompet digital */
 re=/\b(pakai|via|lewat|melalui|dengan|dari|ke|di|dr|topup|top up|isi|isi saldo|transfer|ditransfer|kirim|dikirim|saldo|masuk ke|masuk|tf)\s+dana\b(?!\s+(?:darurat|pensiun|cadangan|kas|desa|talangan|sosial|hibah|bantuan|kuliah|pendidikan|investasi|usaha|kegiatan|acara|tabungan|liburan|bersama|bos|kantor|proyek|operasional))/g;
 while((m=re.exec(t)))res.push({cls:'ewallet',brand:'dana',prep:m[1],s:m.index,e:m.index+m[0].length,w:'dana'});
 re=/\bdana\s*$/g;
 if(!res.some(function(x){return x.brand==='dana'})&&(m=re.exec(t))&&/\d/.test(t)&&/\b(?:transfer|ditransfer|topup|top up|bayar|pakai|isi)\b/.test(t))res.push({cls:'ewallet',brand:'dana',prep:'',s:m.index,e:m.index+m[0].length,w:'dana'});
 /* bank */
 re=new RegExp('\\b(?:('+PREPW.slice(3,-1)+'|transfer|ditransfer|kirim|dikirim|rek|rekening|tarik|setor)\\s+)?(?:(?:bank|rekening|rek|kartu)\\s+)?(bca|bri|bni|mandiri|cimb|niaga|permata|btn|bsi|danamon|ocbc|nobu|panin|maybank|bjb|bukopin|btpn|jago|seabank|blu|jenius|neo|allo|livin|brimo|wondr|mbanking|atm)\\b','g');
 while((m=re.exec(t)))res.push({cls:'bank',brand:/^(mbanking|atm)$/.test(m[2])?null:m[2],prep:m[1]||'',s:m.index,e:m.index+m[0].length,w:m[2]});
 re=/\b(?:(pakai|dari|ke|via|lewat|di)\s+)?(?:kartu\s+debit|debit|rekening|rek|bank)\b/g;
 while((m=re.exec(t))){res.push({cls:'bank',brand:null,prep:m[1]||'',s:m.index,e:m.index+m[0].length,w:'bank'})}
 /* buang yang saling menimpa (ambil yang paling panjang) */
 res.sort(function(a,b){return a.s-b.s||(b.e-b.s)-(a.e-a.s)});
 var clean=[];res.forEach(function(r){var ov=clean.some(function(c){return r.s<c.e&&r.e>c.s});if(!ov)clean.push(r)});
 return clean;
}
function nz(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'')}
function pickWallet(W,cls,brand){
 if(!W||!W.length)return {name:'',exact:false};
 var N=W.map(nz),i;
 if(brand){for(i=0;i<W.length;i++)if(N[i].indexOf(nz(brand))>-1)return {name:W[i],exact:true}}
 var defs={cash:['kastunai','tunai','cash','dompet','kas'],bank:['rekeningbank','bank','rekening'],ewallet:['ewallet','dompetdigital','wallet']};
 var rx={cash:/kas|tunai|cash|dompet/,bank:/bank|rekening|\brek\b|bca|bri|bni|mandiri|cimb|jago|seabank|blu|jenius|bsi|btn|permata|danamon|ocbc|neo|allo|livin|brimo/,ewallet:/wallet|dana|gopay|ovo|shopee|linkaja|isaku|sakuku|doku|paypal|digital/};
 var d=defs[cls]||[];
 for(var k=0;k<d.length;k++)for(i=0;i<W.length;i++)if(N[i]===d[k])return {name:W[i],exact:true};
 for(i=0;i<W.length;i++)if(rx[cls]&&rx[cls].test(String(W[i]).toLowerCase()))return {name:W[i],exact:true};
 return {name:'',exact:false};
}

/* ---------- kamus kategori ---------- */
/* [intent, tipe, regex (kata kunci), bobot] ; intent -> nama kategori asli via CATMAP */
var KW=[
 /* ===== PENGELUARAN ===== */
 ['makan','expense',/\b(makan|makanan|nasi|bakso|baso|mie|mi ayam|mie ayam|mi goreng|mie goreng|miegoreng|soto|sate|satai|ayam|geprek|penyet|penyetan|lauk|warteg|warung makan|padang|resto|restoran|rumah makan|sarapan|brunch|lunch|dinner|pecel|gado|gudeg|rawon|nasgor|bubur|lontong|ketoprak|siomay|batagor|cilok|seblak|martabak|roti|kebab|burger|pizza|pasta|ramen|sushi|dimsum|dim sum|indomie|pempek|empek|bakwan|tahu|tempe|ikan|seafood|lele|bebek|rendang|telur|katsu|kfc|mcd|mcdonald|hokben|solaria|richeese|pizza hut|geprek|nasi goreng|ketupat|capcay|kwetiau|bihun|oseng|tongseng|tengkleng|opor|sop|sup|rica|iga|kikil|jeroan|lalapan|gorengan|catering|katering|kantin|foodcourt|food court|gofood|grabfood|shopeefood|traktir|nraktir|ditraktir|lapar|jajan makan|makan siang|makan malam|makan pagi|sahur|buka puasa|bukber|takjil|nasi kuning|nasi uduk|nasi padang|nasi campur|nasi bungkus|nasbung|mie instan|mie instant|gacoan|mixue|kebuli|mandi|sambal|kerupuk|krupuk|snack berat|porsi)\b/,3],
 ['makan','expense',/\b(makan|lunch|dinner|sarapan)\b/,2],
 ['kopi','expense',/\b(kopi|ngopi|kafe|cafe|coffee|latte|capuccino|cappuccino|americano|espresso|boba|bubble tea|teh|es teh|esteh|tehbotol|teh botol|es|minum|minuman|jus|jus buah|smoothie|jajan|snack|camilan|cemilan|ngemil|kue|donat|donut|es krim|eskrim|ice cream|starbucks|kenangan|janji jiwa|chatime|fore|tomoro|kopi kenangan|tuku|cokelat|coklat|susu kotak|yakult|air mineral|aqua|le minerale|cleo|aqua galon|pocari|mizone|nutrisari|permen|coklat|wafer|keripik|chiki|chitato|snack|popcorn|cimol|cireng|tahu crispy|kentang goreng|french fries|gorengan|jco|dunkin|krispy|breadtalk|brownies|cake|pastry|croissant|gula aren|thai tea|matcha|milo|sirup|es campur|es cendol|cendol|dawet|es doger|es kelapa|kelapa muda|wedang|bandrek|sekoteng)\b/,3],
 ['transport','expense',/\b(bensin|bbm|pertalite|pertamax|pertamax turbo|solar|dexlite|shell|isi bensin|full tank|ojek|ojol|gojek|grab|grabcar|gocar|goride|grabbike|maxim|indriver|in driver|taksi|taxi|bluebird|angkot|bus|busway|transjakarta|tj|krl|commuter|commuterline|mrt|lrt|kereta|tiket kereta|kai|parkir|parkiran|tol|etoll|e-toll|e toll|travel|pesawat|tiket pesawat|garuda|lion air|citilink|bis|damri|ongkos|ongkos naik|transport|transportasi|naik|jalan tol|toll|tap|flazz|brizzi|tapcash|jaklingko|kapal|feri|ferry|becak|bajaj|odong|ojeg|bemo|elf|shuttle|bandara|tiket bus|rental|sewa mobil|sewa motor)\b/,3],
 ['dapur','expense',/\b(sayur|sayuran|pasar|beras|sembako|minyak goreng|minyak|gula|garam|tepung|bumbu|daging|ikan segar|buah|buah buahan|belanja bulanan|belanja dapur|belanja harian|belanja mingguan|galon|gas|elpiji|lpg|gas melon|gas 3kg|susu|kecap|saus|kornet|sarden|mentega|margarin|kopi sachet|teh celup|bawang|cabai|cabe|tomat|kentang|wortel|kangkung|bayam|tempe|tahu|telur 1kg|ayam potong|ikan asin|alfamart|indomaret|alfamidi|superindo|hypermart|giant|transmart|lotte|carrefour|ranch market|farmers market|tukang sayur|abang sayur|mamang sayur|mbak sayur|tokopaedia|warung sembako|grosir|pasar tradisional|pasar induk|sabun cuci|sabun cuci piring|detergen|deterjen|rinso|molto|pewangi|pembersih|pel|sapu|sikat|tisu|tissue|kantong plastik|sampah|keresek|kresek|minyak tanah|korek|lilin|baterai|lampu|bohlam|piring|gelas|panci|wajan|sendok|kompor|rice cooker|blender)\b/,3],
 ['belanja','expense',/\b(baju|kaos|kemeja|celana|jaket|hoodie|sweater|sepatu|sandal|tas|topi|jam tangan|aksesoris|aksesori|kacamata|dompet baru|gesper|ikat pinggang|kaos kaki|dalaman|daleman|bra|rok|gamis|hijab|jilbab|mukena|sarung|batik|jas|dasi|belanja online|olshop|shopee|tokopedia|lazada|tiktok shop|tiktokshop|bukalapak|blibli|zalora|checkout|co shopee|ongkir|hp baru|handphone|smartphone|headset|earphone|charger|casing|tempered glass|powerbank|power bank|kabel|laptop|keyboard|mouse|monitor|flashdisk|gadget|elektronik|furnitur|furniture|kasur|bantal|selimut|sprei|lemari|meja|kursi|karpet|gorden|tirai|hiasan|dekorasi|kado|hadiah|parsel|parcel|souvenir|oleh oleh|oleh-oleh|belanja|shopping|mall|outlet|thrift|preloved|jersey|jersi|bola|raket|sepeda)\b/,3],
 ['tagihan','expense',/\b(tagihan|pdam|air ledeng|ledeng|iuran|ipl|iuran warga|iuran rt|iuran rw|iuran bulanan|retribusi|keamanan|kebersihan|sampah|pbb|pajak bumi|abonemen|admin|biaya admin|denda|materai|meterai|biaya bulanan|bayar kas|kas rt|kas rw|arisan|iuran arisan|setoran arisan|langganan tv|tv kabel|indovision|nex parabola|parabola|k vision|biaya layanan|biaya administrasi|biaya transfer|biaya notaris|biaya bank)\b/,3],
 ['tagihan','expense',/\bpajak\b/,2],
 ['listrik','expense',/\b(listrik|token|token listrik|pln|pln mobile|tagihan listrik|bayar listrik|pulsa listrik|meteran)\b/,4],
 ['sewa','expense',/\b(sewa|kos|kost|kosan|kontrakan|kontrak|kpr|cicilan rumah|angsuran rumah|sewa rumah|sewa kos|bayar kos|uang kos|uang sewa|sewa apartemen|apartemen|dp rumah|uang muka|perpanjang kontrak|sewa kamar)\b/,3],
 ['pulsa','expense',/\b(pulsa|paket data|kuota|data internet|internet|wifi|wi-fi|indihome|biznet|first media|myrepublic|telkomsel|simpati|kartu as|halo|xl|axis|indosat|im3|tri|three|smartfren|by\.u|byu|livin|isi pulsa|voucher data|token wifi|paket telepon|paket nelpon|paket sms|speedy|iconnet|cbn|oxygen|megavision)\b/,4],
 ['sehat','expense',/\b(obat|apotek|apotik|dokter|klinik|rs|rumah sakit|puskesmas|vitamin|suplemen|periksa|berobat|medical check up|mcu|lab|laboratorium|rontgen|usg|gigi|dokter gigi|behel|kawat gigi|kacamata|lensa|softlens|masker|termometer|tensi|rawat inap|rawat jalan|operasi|persalinan|melahirkan|bidan|terapi|fisioterapi|psikolog|psikiater|konsultasi dokter|halodoc|alodokter|kimia farma|guardian|watsons|k24|panadol|paracetamol|paracetamol|bodrex|promag|antangin|tolak angin|minyak kayu putih|plester|betadine|salep|sirup obat|imunisasi|vaksin|suntik|infus|opname|tes covid|swab|antigen|pcr)\b/,4],
 ['sekolah','expense',/\b(spp|uang sekolah|sekolah|kuliah|ukt|kursus|les|les privat|bimbel|buku|buku pelajaran|alat tulis|atk|fotokopi|fotocopy|photocopy|print|ngeprint|cetak|jilid|seminar|workshop|pelatihan|training|udemy|coursera|skillshare|kelas online|ujian|seragam|pendaftaran|registrasi|biaya pendaftaran|wisuda|skripsi|tesis|jurnal|toefl|ielts|sertifikasi|bootcamp|bimbingan|uang pangkal|uang gedung|daftar ulang|tas sekolah|pensil|pulpen|bolpen|penggaris|crayon|kertas)\b/,3],
 ['hiburan','expense',/\b(netflix|spotify|youtube premium|yt premium|disney|disney\+|hotstar|vidio|viu|wetv|iqiyi|prime video|hbo|max|apple music|joox|nonton|bioskop|cinema|xxi|cgv|film|game|top up game|topup game|diamond|diamonds|uc pubg|pubg|mobile legends|ml|free fire|ff|genshin|valorant|steam|playstation|ps4|ps5|psn|nintendo|xbox|konser|festival|wisata|liburan|jalan jalan|jalan-jalan|tiket masuk|tiket wisata|karaoke|hotel|staycation|penginapan|villa|camping|mancing|pancing|futsal|badminton|sewa lapangan|renang|tiket konser|dufan|ancol|taman|kebun binatang|museum|bowling|billiard|biliar|timezone|arcade|ngegame|kafe game|warnet|rental ps|bermain|piknik|healing|tamasya|outing|gathering|nongkrong|clubbing|bar|pub|sewa kamera|langganan netflix|langganan spotify)\b/,3],
 ['keluarga','expense',/\b(anak|popok|pampers|susu formula|susu anak|mainan|istri|suami|orang tua|ortu|bapak|ibu|emak|nenek|kakek|adek|adik|kakak|abang|mertua|keponakan|cucu|uang saku|uang jajan|jajan anak|bulanan istri|nafkah|baju anak|sekolah anak|daycare|babysitter|pengasuh|baby sitter|pembantu|asisten rumah tangga|art|laundry|londri|cuci baju|setrika|kebutuhan rumah|kebutuhan keluarga|perlengkapan bayi|stroller|stroler|kado anak|ngasih ibu|kasih ibu|kasih bapak|kasih ortu|kirim ortu|kirim ibu|kirim bapak|kirim keluarga|kirim ke ibu|kirim ke bapak|bayarin adik|bayarin kakak|jatah)\b/,3],
 ['asuransi','expense',/\b(asuransi|premi|bpjs|bpjs kesehatan|bpjs ketenagakerjaan|jamsostek|prudential|allianz|axa|manulife|aia|sequis|cigna|jiwasraya|unit link|unitlink|polis|klaim)\b/,4],
 ['donasi','expense',/\b(zakat|zakat fitrah|zakat mal|sedekah|infaq|infak|donasi|amal|sumbangan|kotak amal|kondangan|nyumbang|amplop|angpao keluar|angpau|ampao|kado nikah|sumbang|persepuluhan|kolekte|perpuluhan|wakaf|qurban|kurban|aqiqah|kitabisa|dompet dhuafa|baznas|laz|bantuan|santunan|takziah|melayat|duka|jenguk|menjenguk|bingkisan|parcel lebaran|thr keponakan|thr anak|bagi bagi|bagi-bagi|traktiran)\b/,3],
 ['servis','expense',/\b(bengkel|servis|service|ganti oli|oli|oli mesin|ban|ban motor|ban mobil|tambal ban|cuci motor|cuci mobil|steam|doorsmeer|aki|accu|rem|kampas|kampas rem|stnk|pajak motor|pajak mobil|pajak kendaraan|pajak tahunan|perpanjang stnk|sim|perpanjang sim|spion|busi|rantai|filter|tune up|tuneup|spooring|balancing|knalpot|kopling|gear|sparepart|spare part|suku cadang|aksesoris motor|aksesoris mobil|helm|derek|towing|tilang|denda tilang|asuransi mobil|kir|uji emisi|body repair|cat mobil|poles|kaca film|wiper|air radiator|coolant|jasa montir|montir)\b/,3],
 ['rawat','expense',/\b(salon|barbershop|barber|cukur|potong rambut|pangkas|pangkas rambut|skincare|make up|makeup|kosmetik|parfum|sabun mandi|shampo|sampo|odol|pasta gigi|sikat gigi|deodoran|spa|pijat|massage|refleksi|totok|manicure|pedicure|nail|nail art|creambath|facial|waxing|threading|lulur|perawatan|perawatan diri|sunscreen|serum|toner|pelembab|lipstik|lipstick|bedak|maskara|eyeliner|pembalut|gym|fitness|yoga|pilates|zumba|personal trainer|pt gym|membership gym|tato|tindik|bleaching|laser|filler|botox|cukuran|pisau cukur|hair|rambut|kuku|cuci rambut|smoothing|rebonding|semir|toko kecantikan|sephora|miniso|watsons)\b/,3],
 ['usaha','expense',/\b(modal|modal usaha|stok|stok barang|kulakan|kulak|bahan baku|bahan|gaji karyawan|upah karyawan|gaji pegawai|gaji staf|sewa tempat usaha|sewa toko|sewa kios|operasional|packing|kemasan|packaging|bayar supplier|supplier|restock|belanja stok|iklan|ads|beriklan|facebook ads|fb ads|ig ads|google ads|endorse|endorsement|biaya produksi|produksi|ongkir paket|ekspedisi|jne|jnt|j&t|sicepat|anteraja|pos indonesia|kurir|etalase|booth|stand|gerobak|peralatan usaha|mesin usaha|lisensi|domain|hosting|server|software|aplikasi kasir|pajak usaha|pph|ppn|npwp|izin usaha|nib|siup|biaya usaha|keperluan usaha|kebutuhan usaha|keperluan toko|kebutuhan toko)\b/,3],
 ['utang','expense',/\b(utang|hutang|ngutang|pinjol|pinjaman|cicilan|cicil|nyicil|angsuran|angsur|kredit|kartu kredit|kk|cc|credit card|paylater|kredivo|akulaku|home credit|indodana|adakami|kredit motor|kredit mobil|cicilan motor|cicilan mobil|cicilan hp|cicilan laptop|cicilan kpr|kur|bayar utang|bayar hutang|lunasi|pelunasan|melunasi|bayar cicilan|leasing|fif|adira|baf|wom|oto|bunga pinjaman|denda keterlambatan|tunggakan|bayar tunggakan|piutang|talangan|dana talangan|pinjam|minjem|pinjem|minjam)\b/,4],
 /* ===== PEMASUKAN ===== */
 ['gaji','income',/\b(gaji|salary|payroll|upah bulanan|gaji pokok|gaji bulanan|slip gaji|gajian)\b/,5],
 ['jual','income',/\b(jual|jualan|dijual|terjual|omset|omzet|hasil jual|hasil jualan|dagang|dagangan|laku|penjualan|orderan|order masuk|pesanan masuk|pelanggan bayar|customer bayar|pembeli|setoran penjualan|hasil dagang|pendapatan toko|pendapatan usaha|jual hp|jual motor|jual mobil|jual barang|jual bekas|barang bekas|preloved terjual|closing|deal)\b/,4],
 ['sampingan','income',/\b(freelance|freelancer|lembur|proyek|project|sampingan|side job|sidejob|narik|ngojek|ojol|driver|komisi|fee|honor|honorarium|bayaran|jasa|endorse masuk|konten|adsense|youtube|monetisasi|ngajar|privat|les privat|tip|tips|job|garapan|garap|desain|design|editing|editor|translate|terjemah|nulis|menulis|artikel|copywriting|mc|fotografer|foto|video|syuting|show|manggung|tampil|gig|sablon|jahit|jasa jahit|servis masuk|montir masuk|part time|parttime|paruh waktu|magang|uang lembur|lemburan|uang makan|uang transport|uang bensin kantor|uang dinas|dinas|perjalanan dinas|spj|sppd)\b/,3],
 ['bonus','income',/\b(bonus|thr|tunjangan|insentif|angpao|angpau|ampao|hadiah|reward|undian|giveaway|lomba|menang|juara|doorprize|voucher menang|kuis|hadiah lomba|uang kaget|rezeki|rejeki|kado uang|salam tempel|salam tempel lebaran|uang lebaran|pesangon|uang pisah|uang duka masuk|gratifikasi|bonus tahunan|bonus kinerja|bonus akhir tahun|tantiem)\b/,4],
 ['invest','income',/\b(saham|jual saham|emas|jual emas|crypto|kripto|bitcoin|btc|reksadana|reksa dana|obligasi|sbn|ori|sukuk|deposito|cair deposito|capital gain|cuan|profit|untung saham|untung crypto|p2p|p2p lending|investasi|pencairan investasi|cair reksadana|pencairan reksadana|jual reksadana|jual crypto|jual kripto|tarik profit|withdraw profit|wd profit|trading|forex|jual aset|aset cair|properti terjual|jual rumah|jual tanah)\b/,4],
 ['dividen','income',/\b(dividen|bunga|bunga bank|bunga deposito|bunga tabungan|bagi hasil|royalti|royalty|kupon|coupon|interest|passive income|pasif|imbal hasil|yield|hasil investasi|bunga obligasi|kupon obligasi)\b/,4],
 ['sewaprop','income',/\b(sewa masuk|uang sewa masuk|terima sewa|pemasukan kos|pemasukan kontrakan|uang kos masuk|anak kos bayar|penyewa bayar|penyewa|sewa properti|uang kontrakan masuk|kontrakan masuk|kos masuk|bayaran kos|bayaran kontrakan|sewa ruko|sewa lapak|sewa lahan|sewa tanah|sewa gedung|sewa gudang|sewa rumah masuk)\b/,5],
 ['refund','income',/\b(refund|dikembalikan|pengembalian|retur|cashback|balikin|dibalikin|dibalik|uang kembali|ganti rugi|reimburse|reimbursement|kembali dana|dana kembali|ongkir kembali|saldo kembali|kembali uang|klaim cair|klaim masuk|klaim asuransi|asuransi cair|diganti|penggantian|ganti uang|ganti ongkos|diskon cair|voucher cair|point cair|poin cair|reward cair|tukar poin)\b/,4]
];
var CATMAP={
 makan:[/makan/,'Makanan'],kopi:[/kopi|jajan/,'Kopi & Jajan'],transport:[/transport|bahan bakar|bensin/,'Transportasi'],dapur:[/dapur|sembako/,'Belanja Dapur'],
 belanja:[/belanja pribadi|belanja(?!.*dapur)|pribadi/,'Belanja Pribadi'],tagihan:[/^tagihan|tagihan/,'Tagihan'],listrik:[/listrik/,'Listrik Rumah'],sewa:[/sewa|cicilan rumah|kos|kontrak/,'Sewa / Cicilan Rumah'],
 pulsa:[/pulsa|internet/,'Pulsa & Internet Pribadi'],sehat:[/sehat|kesehatan|medis/,'Kesehatan'],sekolah:[/pendidik|sekolah|kuliah/,'Pendidikan'],hiburan:[/hibur|rekreasi/,'Hiburan & Rekreasi'],
 keluarga:[/keluarga|rumah tangga/,'Kebutuhan Keluarga'],asuransi:[/asuransi/,'Asuransi'],donasi:[/donasi|zakat|sedekah|amal/,'Donasi / Zakat'],servis:[/service|servis|kendaraan|bengkel/,'Service Kendaraan'],
 rawat:[/perawatan|kecantikan/,'Perawatan Diri'],usaha:[/operasional|usaha|bisnis/,'Operasional Usaha'],utang:[/utang|hutang|cicilan|pinjaman/,'Pembayaran Utang'],
 gaji:[/gaji|salary/,'Gaji'],jual:[/penjualan|omset|jual/,'Penjualan/Omset'],sampingan:[/sampingan|freelance/,'Penghasilan Sampingan'],bonus:[/bonus|thr/,'Bonus & THR'],
 invest:[/investasi|aset/,'Investasi/Aset'],dividen:[/dividen|bunga/,'Dividen/Bunga'],sewaprop:[/sewa properti|sewa/,'Sewa Properti'],refund:[/pengembalian|refund|kembali/,'Pengembalian Dana']
};
var STOP=/^(beli|bayar|dapat|terima|transfer|ditransfer|dari|ke|di|untuk|buat|yang|dan|sama|dengan|pakai|via|lewat|tadi|sudah|aku|saya|gue|gw|lagi|habis|abis|duit|uang|rupiah|rp|total|jadi|cuma|hanya|sekitar|kira|barusan|kemarin|hari|bulan|minggu|tahun|lalu|ini|itu|nya|bayarin|beliin|buat|untuk|cash|tunai|bank|rekening|dompet|sebesar|senilai|seharga|harga|biaya|ongkos|pembayaran|pembelian|catat|catatan|tolong|mohon|dong|deh|sih|nih|ya|yah|aja|saja|pun)$/;

/* ---------- jenis: masuk / keluar / pindah ---------- */
var INC_STRONG=/\b(freelance|freelancer|lembur|lemburan|bunga|kupon|bunga bank|passive income|gaji|upah|honor|honorarium|bonus|thr|tunjangan|insentif|komisi|dividen|angpao|angpau|ampao|cashback|refund|reimburse|pemasukan|pendapatan|penghasilan|omset|omzet|jualan|laku|terjual|dijual|cuan|untung|laba|profit|royalti|bagi hasil|pencairan|cair|warisan|hadiah|menang|undian|giveaway|dapat|terima|diterima|ditransfer|ditransferin|transferan|kiriman|dikirim|dikirimin|dikasih|dibayar|dibayarin|dibalikin|dikembalikan|balikin|uang masuk|duit masuk|dana masuk|saldo masuk|masuk rekening|masuk dompet|masuk saldo|pemasukan|setoran masuk|diganti|ganti rugi|dipinjemin|dipinjamin|dipinjami|dibelikan uang|dikasi|dikirimi|ditransferi|ditf|rezeki|rejeki|bayaran)\b/;
var EXP_STRONG=/\b(beli|membeli|beliin|belikan|dibeli|bayar|membayar|bayarin|bayarkan|belanja|jajan|jajanin|traktir|nraktir|isi|ngisi|topup|top up|sewa|nyewa|cicil|nyicil|angsur|langganan|donasi|sedekah|infaq|infak|zakat|sumbang|nyumbang|makan|minum|ngopi|nonton|servis|service|parkir|ongkir|ongkos|biaya|tagihan|admin|denda|pajak|iuran|retribusi|hilang|kehilangan|kena|rugi|pengeluaran|pembelian|pembayaran|bensin|bbm|lunasi|pelunasan|melunasi|setor|nyetor|kirim ke|transfer ke|tf ke|kasih ke|ngasih ke|kasih|ngasih|kirimin ke|ngirim ke|ditraktir)\b/;

function bareHas(t,re){return re.test(t)}

function decideType(t){
 var inc=0,exp=0;
 /* pengecualian frasa yang mengandung "masuk" dsb */
 var u=t.replace(/\b(tiket masuk|biaya masuk|pintu masuk|jalan masuk|masuk angin|uang masuk sekolah|uang masuk kuliah|uang pangkal|masuk tol|biaya masuk wisata)\b/g,' tiketmasuk ');
 if(/tiketmasuk/.test(u))exp+=3;
 /* membayar gaji/upah = pengeluaran */
 var payWage=/\b(?:bayar|bayarin|bayarkan|kasih|ngasih|transfer ke|tf ke|kirim|setor|nyetor|ngegaji)\s+(?:si\s+)?(?:gaji|upah|honor|bonus|thr|komisi|bayaran)\b|\b(?:gaji|upah|honor|thr|bonus)\s+(?:karyawan|pegawai|pembantu|asisten|staf|staff|tukang|driver|supir|sopir|babysitter|art|kurir|admin|penjaga|satpam|guru|ojol|crew|kru|anak buah|tim)\b/.test(u);
 if(payWage)exp+=6;
 var m;
 if((m=u.match(INC_STRONG)))inc+=4;
 /* penerimaan pasif vs pengiriman ke orang lain */
 var passive=u.match(/\b(ditransfer|ditransferin|ditransferi|dikirim|dikirimin|dikirimi|dikasih|dibayar|dibayarin|dibalikin|dikembalikan|diterima|dipinjemin|dipinjamin|dipinjami)\b(?:\s+\w+){0,3}?\s+(ke)\s+(\w+)/);
 if(passive){var tgt=passive[3];if(!/^(rekening|rek|bank|dompet|saldo|akun|bca|bri|bni|mandiri|dana|gopay|ovo|shopeepay|linkaja|saya|aku|gue|gw|ku|kantong|e|ewallet|jago|seabank|blu|jenius|cimb|permata|ocbc|btn|bsi|neo|allo)$/.test(tgt)){inc-=4;exp+=3}}
 if(/\b(?:transfer|kirim|tf)\s+dari\b/.test(u))inc+=3;
 if(/\b(?:uang|duit|dana|saldo)\s+masuk\b/.test(u))inc+=3;
 if(/\bmasuk(?:\s+ke)?\s+(?:rekening|rek|bank|dompet|saldo|ewallet|gopay|ovo|dana|shopeepay|linkaja)\b/.test(u))inc+=3;
 if(/\b(?:dipinjemin|dipinjamin|pinjam(?:\s+dari)|pinjem(?:\s+dari)|minjem(?:\s+dari)|minjam(?:\s+dari)|pinjol\s+cair|pinjaman\s+cair)\b/.test(u))inc+=4;
 if(/\b(?:dapat|terima)\s+(?:bantuan|dana|uang|duit|transfer|kiriman|gaji|bonus|thr|hadiah|angpao|komisi)\b/.test(u))inc+=3;
 if((m=u.match(EXP_STRONG))){exp+=3;
  /* "isi saldo/isi bensin" dsb: ok, tetap pengeluaran */
 }
 if(/\b(?:beli|bayar|belanja|jajan|isi|topup|top up|sewa|cicil|donasi|sedekah|zakat|lunasi|traktir|bayarin)\b/.test(u))exp+=2;
 /* jual saham dll */
 if(/\bjual\b/.test(u)&&!/\bbeli\b/.test(u))inc+=3;
 /* "dari <orang>" + kata kerja menerima */
 if(/\b(?:dapat|terima|diterima|transferan|kiriman|dikasih)\b.*\bdari\b/.test(u))inc+=2;
 /* kata kerja menerima pada awal (mis. "ditransfer ibu 500rb") */
 if(/^(?:sudah\s+)?(?:ditransfer|dikirim|dikasih|dibayar|dibayarin|diterima)\b/.test(u))inc+=2;
 /* kasih/ngasih tanpa "ke" tapi ke orang: pengeluaran sudah dari EXP_STRONG */
 var type=inc>exp?'income':'expense';
 return {type:type,inc:inc,exp:exp,confident:Math.abs(inc-exp)>=3};
}

/* deteksi pindah saldo */
function detectTransfer(t,wallets){
 var from=null,to=null,why='';
 var tarik=/\b(?:tarik|narik|ambil)\s+(?:tunai|uang tunai|cash|duit|uang)?(?:\s+(?:di|dari))?\s*(?:atm|bank|rekening|bca|bri|bni|mandiri|cimb|jago|seabank|blu|jenius|bsi|btn)\b|\btarik\s+tunai\b|\bnarik\s+(?:tunai|duit|uang|cash)\b|\bambil\s+(?:duit|uang|cash|tunai)\s+(?:di|dari)\s+atm\b|\bwithdraw\b/;
 var setor=/\b(?:setor|nyetor|nabung)\s+(?:tunai|uang tunai|cash)\b|\bsetor\s+(?:tunai|cash)\b|\bsetor\s+(?:ke|di)\s+(?:atm|bank|rekening)\b/;
 var topup=/\b(?:top ?up|topup|isi saldo|isi ulang saldo|isi ulang|tambah saldo|isi)\s+(?:saldo\s+)?(?:gopay|ovo|dana|shopeepay|linkaja|isaku|sakuku|doku|ewallet|e wallet)\b|\b(?:top ?up|topup)\s+(?:ke\s+)?(?:gopay|ovo|dana|shopeepay|linkaja|isaku|ewallet)\b/;
 var pindah=/\b(?:pindah(?:in|kan)?|mutasi|pindahin|geser|oper|pindah saldo)\b/;
 if(tarik.test(t)){from='bank';to='cash';why='tarik tunai'}
 else if(setor.test(t)){from='cash';to='bank';why='setor tunai'}
 else if(topup.test(t)){to='ewallet';from='bank';why='top up e-wallet'}
 else if(pindah.test(t)){why='pindah saldo'}
 return {is:!!why,from:from,to:to,why:why};
}

/* ---------- pembersihan catatan ---------- */
function cleanNote(raw,fallback){
 var s=' '+raw+' ';
 s=s.replace(/\b(?:rp\.?|idr)\b/g,' ').replace(/[,;:|]+/g,' ').replace(/\s+-\s+/g,' ').replace(/\s+/g,' ');
 s=s.replace(/\b(?:sebesar|senilai|seharga|sejumlah|harganya|harga|totalnya|total|kira-kira|kurang lebih|sekitar|cuma|hanya|sebanyak)\b/g,' ');
 s=s.replace(/\b(?:sudah|tadi|barusan|aku|saya|gue|gw|tolong|catat|catatkan|dong|deh|nih|sih|ya|yah)\b/g,' ');
 var w=s.trim().split(/\s+/).filter(Boolean);
 while(w.length&&/^(dari|di|ke|pakai|via|lewat|dengan|sama|dan|untuk|buat|yang|pada|pas|waktu|sejak|jam|pukul|di|se)$/.test(w[0]))w.shift();
 while(w.length&&/^(dari|di|ke|pakai|via|lewat|dengan|sama|dan|untuk|buat|yang|pada|pas|waktu|sejak|jam|pukul|se)$/.test(w[w.length-1]))w.pop();
 if(w.length>1)w=w.filter(function(x,i){return !( /^(duit|uang|rupiah)$/.test(x)&&i===w.length-1 )});
 var out=w.join(' ').replace(/^[^a-z0-9]+|[^a-z0-9)]+$/gi,'').replace(/\s+/g,' ').trim();
 if(!out)out=fallback||'';
 if(out)out=out.charAt(0).toUpperCase()+out.slice(1);
 return out.slice(0,80);
}

/* ---------- kategori ---------- */
function catFromName(text,list){
 var x=' '+text+' ',cnt={},i,k;
 var names=list.map(function(c){return String(c).toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()});
 names.forEach(function(cn){cn.split(' ').forEach(function(w){cnt[w]=(cnt[w]||0)+1})});
 for(i=0;i<list.length;i++){var cn=names[i];if(!cn||/^lainnya/.test(cn))continue;if(x.indexOf(' '+cn+' ')>-1)return list[i]}
 for(i=0;i<list.length;i++){var cn2=names[i];if(!cn2||/^lainnya/.test(cn2))continue;
  var ws=cn2.split(' ').filter(function(w){return w.length>=4&&cnt[w]===1&&!/^(pribadi|rumah|usaha|aset|dana|lain|lainnya|pemasukan|pengeluaran|keluarga|kebutuhan)$/.test(w)});
  for(k=0;k<ws.length;k++)if(x.indexOf(' '+ws[k]+' ')>-1)return list[i]}
 return null}
function lastResort(list,type){
 for(var i=list.length-1;i>=0;i--)if(/^lainnya/i.test(list[i]))return list[i];
 return list[list.length-1]||(type==='income'?'Lainnya - Pemasukan':'Lainnya')}
function mapIntent(intent,list){
 var spec=CATMAP[intent];if(!spec)return null;
 if(list.indexOf(spec[1])>-1)return spec[1];
 for(var i=0;i<list.length;i++)if(spec[0].test(String(list[i]).toLowerCase()))return list[i];
 return null}
function histIndex(hist){
 var idx={};
 (hist||[]).slice(0,800).forEach(function(t){if(!t||!t.note||!t.category||t.type==='transfer')return;
  var toks=String(t.note).toLowerCase().replace(/[^a-z\s]/g,' ').split(/\s+/).filter(function(w){return w.length>=4&&!STOP.test(w)});
  var seen={};toks.forEach(function(w){if(seen[w])return;seen[w]=1;var k=t.type+'|'+w;(idx[k]=idx[k]||{})[t.category]=((idx[k]||{})[t.category]||0)+1})});
 return idx}
function chooseCategory(text,type,ctx){
 var list=type==='income'?ctx.catInc:ctx.catExp;list=list&&list.length?list:(type==='income'?['Lainnya - Pemasukan']:['Lainnya']);
 var res={name:'',why:'',conf:0};
 /* 1) riwayat pribadi */
 var idx=ctx._hidx||(ctx._hidx=histIndex(ctx.history));
 var toks=text.toLowerCase().replace(/[^a-z\s]/g,' ').split(/\s+/).filter(function(w){return w.length>=4&&!STOP.test(w)});
 var bestH=null;
 toks.forEach(function(w){var e=idx[type+'|'+w];if(!e)return;var tot=0,top=null,tc=0;Object.keys(e).forEach(function(c){tot+=e[c];if(e[c]>tc){tc=e[c];top=c}});
  if(tot>=2&&tc/tot>=.75&&list.indexOf(top)>-1&&(!bestH||tot>bestH.tot))bestH={name:top,tot:tot,w:w}});
 /* 2) kamus */
 var score={},order=[];
 KW.forEach(function(k){if(k[1]!==type)return;var m=text.match(k[2]);if(m){score[k[0]]=(score[k[0]]||0)+k[3];if(order.indexOf(k[0])<0)order.push(k[0]);}});
 var bi=null,bs=0;order.forEach(function(i){if(score[i]>bs){bs=score[i];bi=i}});
 var dict=null;if(bi){var nm=mapIntent(bi,list);if(nm)dict={name:nm,intent:bi,score:bs}}
 var byName=catFromName(text,list);
 if(bestH&&(!dict||bestH.tot>=3||dict.score<4)){return {name:bestH.name,why:'dari kebiasaanmu ("'+bestH.w+'")',conf:3}}
 if(byName&&(!dict||byName===dict.name||dict.score<4))return {name:byName,why:'nama kategori disebut',conf:3};
 if(dict)return {name:dict.name,why:'kata kunci '+dict.intent,conf:dict.score>=3?3:2,intent:dict.intent};
 if(bestH)return {name:bestH.name,why:'dari kebiasaanmu ("'+bestH.w+'")',conf:2};
 if(byName)return {name:byName,why:'nama kategori disebut',conf:2};
 return {name:lastResort(list,type),why:'kategori tidak dikenali',conf:0};
}

/* ---------- split beberapa catatan ---------- */
function splitSegments(raw){
 var lines=String(raw).split(/\r?\n|;|\|/).map(function(s){return s.trim()}).filter(Boolean);
 var out=[];
 lines.forEach(function(l){
  var nl=normalize(l);
  var parts=nl.split(/\s*(?:,(?!\d)|\.(?=\s+[a-z])|\bdan\b|\bterus\b|\bserta\b|\bplus\b|\+|\bsama\b)\s*(?=[a-z])/).map(function(x){return x.trim()}).filter(Boolean);
  if(parts.length>1){
   var ok=parts.every(function(p){var d=extractDate(stripTime(p),new Date(2000,0,1));return findAmounts(d.text).some(function(a){return a.sc>=3})});
   if(ok){parts.forEach(function(p){out.push(p)});return}
  }
  out.push(nl);
 });
 return out;
}
function splitByAmounts(t,amts){
 var strong=amts.filter(function(a){return a.sc>=3});
 if(strong.length<2)return [t];
 var first=strong[0],pre=t.slice(0,first.start).replace(/\b(beli|bayar|transfer|dapat|terima|ditransfer|dikasih|kirim|isi|topup|top up)\b/g,'').replace(/\s+/g,' ').trim();
 var segs=[],i;
 if(!pre){for(i=0;i<strong.length;i++){var s=strong[i].start,e=i+1<strong.length?strong[i+1].start:t.length;segs.push(t.slice(s,e).trim())}}
 else{var prev=0;for(i=0;i<strong.length;i++){var e2=strong[i].end;
   var tail=i+1<strong.length?'':t.slice(e2);
   segs.push((t.slice(prev,e2)+(tail?' '+tail:'')).trim());prev=e2}}
 return segs.filter(Boolean);
}

/* ---------- inti: parse satu segmen ---------- */
function parseSegment(seg,ctx,glob){
 var warn=[],why={},now=ctx.now;
 var t=stripTime(seg);
 var dt=extractDate(t,now);t=dt.text;
 var wm=findWallets(t);
 var amts=findAmounts(t);
 return {t:t,dt:dt,wm:wm,amts:amts};
}

function parse(raw,ctx){
 ctx=ctx||{};ctx.now=ctx.now||new Date();ctx.wallets=ctx.wallets&&ctx.wallets.length?ctx.wallets:['Kas Tunai','Rekening Bank','E-Wallet'];
 ctx.catExp=ctx.catExp||['Makanan','Kopi & Jajan','Transportasi','Belanja Pribadi','Belanja Dapur','Tagihan','Listrik Rumah','Sewa / Cicilan Rumah','Pulsa & Internet Pribadi','Kesehatan','Pendidikan','Hiburan & Rekreasi','Kebutuhan Keluarga','Asuransi','Donasi / Zakat','Service Kendaraan','Perawatan Diri','Operasional Usaha','Pembayaran Utang','Lainnya'];
 ctx.catInc=ctx.catInc||['Gaji','Penjualan/Omset','Penghasilan Sampingan','Bonus & THR','Investasi/Aset','Sewa Properti','Dividen/Bunga','Pengembalian Dana','Lainnya - Pemasukan'];
 var segs=splitSegments(raw);
 /* tahap 1: ekstrak tanggal & cara bayar per segmen, lalu pecah bila ada beberapa nominal */
 var work=[];
 segs.forEach(function(sg){
  var t=stripTime(sg);
  var dt0=extractDate(t,ctx.now);
  var amts0=findAmounts(dt0.text);
  var pieces=splitByAmounts(dt0.text,amts0);
  if(pieces.length>1){pieces.forEach(function(p){work.push({txt:p,dateInfo:dt0.found?dt0:null,orig:sg})})}
  else work.push({txt:dt0.text,dateInfo:dt0.found?dt0:null,orig:sg,single:true});
 });
 var items=work.map(function(w){return buildItem(w,ctx)});
 /* warisan tanggal & dompet bila hanya satu segmen yang menyebutkan */
 var withDate=items.filter(function(i){return i._dateGiven}),withW=items.filter(function(i){return i._walletGiven});
 if(items.length>1){
  if(withDate.length===1){items.forEach(function(i){if(!i._dateGiven){i.date=withDate[0].date;i.dateLabel=withDate[0].dateLabel;i.why.date=withDate[0].why.date+' (berlaku untuk semua)';i.future=withDate[0].future}})}
  if(withW.length===1){items.forEach(function(i){if(!i._walletGiven&&i.type!=='transfer'){i.wallet=withW[0].wallet;i.why.wallet=withW[0].why.wallet+' (berlaku untuk semua)'}})}
 }
 return items.map(function(i){delete i._dateGiven;delete i._walletGiven;return i});
}

function buildItem(w,ctx){
 var txt=w.txt,warn=[],why={};
 var di=w.dateInfo,dtObj=di;
 var t=txt;
 /* tanggal per-segmen (bila segmen punya sendiri) */
 var own=extractDate(t,ctx.now);
 if(own.found){dtObj=own;t=own.text}
 var amts=findAmounts(t);
 /* pilih nominal */
 var sel=null;
 amts.forEach(function(a){if(!sel||a.sc>sel.sc||(a.sc===sel.sc&&a.v>sel.v))sel=a});
 /* qty: "2x", "x2" */
 var qty=1,qtxt=t;
 var qm=qtxt.match(/(?:^|\s)(\d{1,2})\s*[x×]\s+(?=[a-z])/)||qtxt.match(/\s[x×]\s*(\d{1,2})(?:\s|$)/)||qtxt.match(/(?:^|\s)(\d{1,2})\s*[x×](?=[a-z])/);
 var perUnit=/\b(?:@|masing[- ]masing|per|tiap|satuan|each|per porsi|per biji|per buah)\b/.test(t)||/@/.test(t);
 var wordQty=t.match(/\b(\d{1,2})\s*(?:buah|biji|pcs|porsi|bungkus|botol|gelas|potong|cup|mangkok|piring|bh|bks)\b/);
 var qm2=!qm&&t.match(/(?:^|\s)(\d{1,2})\s*[x×]\s*(?=\d|rp)/);
 var bareQty=perUnit?t.match(/(?:^|\s)(\d{1,2})\s+(?=[a-z])/):null;
 if(qm2&&+qm2[1]>1)qm=qm2;
 if(qm&&+qm[1]>1&&+qm[1]<100)qty=+qm[1];
 else if(bareQty&&+bareQty[1]>1&&!wordQty)qty=+bareQty[1];
 else if(wordQty&&perUnit&&+wordQty[1]>1)qty=+wordQty[1];
 var warns=[];
 var wallets=findWallets(t);
 /* buang frasa dompet dari teks catatan */
 var noteTxt=t;
 /* buang nominal terpilih */
 var amount=0;
 if(sel){amount=sel.v;noteTxt=(t.slice(0,sel.start)+' '+t.slice(sel.end)).replace(/\s+/g,' ');
  if(sel.flag==='small')warns.push('Angka "'+sel.orig+'" tanpa satuan dianggap ribuan (Rp'+fmtN(sel.v)+'). Cek lagi ya.');
  if(qty>1&&!/\b(total|totalnya|semua|jadi|all in|keseluruhan)\b/.test(t)){amount=sel.v*qty;why.amount=qty+' × Rp'+fmtN(sel.v)}
  else if(qty>1){qty=1}
 }
 else warns.push('Nominal belum terbaca. Tulis misalnya "15rb", "1,5jt", atau "15.000".');
 if(sel&&amts.filter(function(a){return a.sc>=3&&a!==sel}).length)warns.push('Ada lebih dari satu nominal, dipakai Rp'+fmtN(sel.v)+'.');
 noteTxt=noteTxt.replace(/(?:^|\s)\d{1,2}\s*[x×]\s*(?=\d|rp)/,' ').replace(/@/g,' ');
 if(qty>1&&bareQty&&!qm)noteTxt=noteTxt.replace(/(?:^|\s)\d{1,2}\s+(?=[a-z])/,' ');
 noteTxt=noteTxt.replace(/(?:^|\s)\d{1,2}\s*[x×]\s+(?=[a-z])/,' ').replace(/(?:^|\s)\d{1,2}\s*[x×](?=\s|$)/,' ').replace(/\s[x×]\s*\d{1,2}(?=\s|$)/,' ').replace(/(?:^|\s)\d{1,2}\s*[x×](?=[a-z])/,' ');
 /* tipe */
 var norm0=t;
 var tr=detectTransfer(norm0,ctx.wallets),type,tdec=null;
 if(!tr.is&&wallets.length>=2){
  var fr=wallets.filter(function(x){return /^(dari|pakai|via|lewat)$/.test(x.prep)})[0],tt=wallets.filter(function(x){return /^(ke|masuk ke|masuk|topup|top up|isi|saldo)$/.test(x.prep)})[0];
  if(fr&&tt&&fr!==tt&&(fr.cls!==tt.cls||fr.brand!==tt.brand)&&!/\b(beli|belanja|bayar|jajan|makan|gaji|dapat|terima)\b/.test(norm0))tr={is:true,from:fr.cls,to:tt.cls,why:'dari '+fr.w+' ke '+tt.w};
 }
 if(tr.is)type='transfer';
 else{tdec=decideType(norm0);type=tdec.type}
 /* dompet */
 var wallet='',walletWhy='',walletGiven=false,toWallet='';
 var rm=[];
 /* hapus kata dompet dari catatan */
 wallets.forEach(function(x){rm.push([x.s,x.e])});
 var ncs=wallets.filter(function(x){return x.cls==='bank'||x.cls==='ewallet'||x.cls==='cash'});
 var needTransferKw=/\b(transfer|ditransfer|transferan|transferin|ditransferin)\b/.test(norm0);
 if(type==='transfer'){
  var fromCls=tr.from,toCls=tr.to,fromB=null,toB=null;
  wallets.forEach(function(x){
   if(/^(dari|pakai|via|lewat|ambil|tarik)$/.test(x.prep)){fromCls=x.cls;fromB=x.brand}
   else if(/^(ke|topup|top up|isi|saldo|masuk|masuk ke|setor)$/.test(x.prep)){toCls=x.cls;toB=x.brand}
   else if(!toCls||!tr.to){ if(!(tr.to)){toCls=x.cls;toB=x.brand} }
  });
  if(!fromCls)fromCls='bank';if(!toCls)toCls='cash';
  var fw=pickWallet(ctx.wallets,fromCls,fromB),tw=pickWallet(ctx.wallets,toCls,toB);
  wallet=fw.name||ctx.wallets[0];toWallet=tw.name||ctx.wallets[1]||ctx.wallets[0];
  if(!fw.name||!tw.name)warns.push('Dompet untuk pindah saldo kurang cocok. Pilih sendiri dari daftar.');
  if(wallet===toWallet)warns.push('Dompet asal dan tujuan sama. Ubah salah satunya.');
  walletWhy='pindah saldo: '+tr.why;walletGiven=true;
 }else{
  var cls=null,brand=null,main=null;
  /* utamakan e-wallet/bank/tunai yang disebut eksplisit; "transfer" tanpa merek = bank */
  var pri={ewallet:3,bank:2,cash:1};
  wallets.forEach(function(x){if(!main||(pri[x.cls]>pri[main.cls])||(pri[x.cls]===pri[main.cls]&&x.brand&&!main.brand))main=x});
  if(main){cls=main.cls;brand=main.brand;walletGiven=true;walletWhy='disebut "'+main.w+'"'}
  else if(needTransferKw){cls='bank';walletGiven=true;walletWhy='kata "transfer" → rekening bank'}
  else if(/\bqris\b/.test(norm0)){cls='ewallet';walletGiven=true}
  if(!cls){cls='cash';walletWhy='default Kas Tunai (tidak ada cara bayar disebut)'}
  if(main&&main.w==='qris')warns.push('QRIS dianggap lewat e-wallet. Ganti dompet bila lewat bank.');
  var pw=pickWallet(ctx.wallets,cls,brand);
  if(pw.name){wallet=pw.name}else{
   var dw=pickWallet(ctx.wallets,'cash',null);wallet=dw.name||ctx.wallets[0];
   if(cls!=='cash')warns.push('Dompet "'+(cls==='bank'?'Rekening Bank':'E-Wallet')+'" belum ada. Dipakai '+wallet+'. Tambah dompetnya di menu Akun/Dompet.');
  }
  if(wallet&&!walletWhy.match(/Kas/))walletWhy+=' → '+wallet;else if(!walletGiven)walletWhy='default '+wallet+' (tidak ada cara bayar disebut)';
 }
 /* catatan */
 var wr=wallets.slice().sort(function(a,b){return b.s-a.s});
 /* hapus dompet dari teks catatan (posisi pada teks "t", bukan noteTxt): bangun ulang */
 var base=t;
 if(sel)base=(base.slice(0,sel.start)+' '+base.slice(sel.end));
 /* posisi bergeser: hapus dompet pakai regex sederhana */
 var nt=noteTxt;
 if(type!=='transfer')wallets.forEach(function(x){var wtxt=nt.match(new RegExp('(?:\\b(?:pakai|via|lewat|dari|ke|di|dengan|secara|melalui|saldo|masuk ke|masuk)\\s+)?(?:(?:bank|rekening|rek|kartu)\\s+)?\\b'+x.w.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\$&')+'\\b'));if(wtxt)nt=nt.replace(wtxt[0],' ')});
 var noteFallback=type==='income'?'Pemasukan':type==='transfer'?'Pindah saldo':'Pengeluaran';
 var note=cleanNote(nt.replace(/\b(?:ditransfer|transferan)\b/g,function(m){return m}),noteFallback);
 if(qty>1&&sel)note=(note+' ×'+qty).trim();
 /* kategori */
 var category='',catWhy='';
 if(type==='transfer'){category='Transfer';catWhy='pindah saldo'}
 else{var cc=chooseCategory(nt+' '+norm0,type,ctx);category=cc.name;catWhy=cc.why;
  if(cc.conf===0&&type!=='income')warns.push('Kategori belum bisa ditebak, dipakai "'+category+'". Ubah bila perlu.')}
 /* tanggal */
 var date=mid(ctx.now),dateGiven=false,dateWhy='hari ini (tidak ada tanggal disebut)',fut=false;
 if(dtObj&&dtObj.found&&dtObj.date){date=dtObj.date;dateGiven=true;fut=dtObj.future;dateWhy='"'+dtObj.phrases.join(', ')+'"'}
 if(fut)warns.push('Tanggalnya di masa depan. Pastikan benar.');
 var res={raw:w.orig||txt,amount:amount,qty:qty,unit:sel?sel.v:0,type:type,category:category,wallet:wallet,toWallet:toWallet,note:note,date:isoOf(date),dateLabel:relLabel(date,ctx.now),future:fut,warn:warns,why:{amount:why.amount||(sel?('"'+sel.raw+'"'):''),type:type==='transfer'?tr.why:(tdec&&tdec.confident?(type==='income'?'kata penerimaan uang':'kata pengeluaran'):'default pengeluaran'),category:catWhy,wallet:walletWhy,date:dateWhy}};
 res._dateGiven=dateGiven;res._walletGiven=walletGiven;
 return res;
}

function fmtN(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')}
var HARI=['Min','Sen','Sel','Rab','Kam','Jum','Sab'],BLN=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
function relLabel(d,now){
 var b=mid(now),x=mid(d),diff=Math.round((x-b)/864e5);
 var abs=HARI[x.getDay()]+', '+x.getDate()+' '+BLN[x.getMonth()]+' '+x.getFullYear();
 var rel=diff===0?'Hari ini':diff===1?'Besok':diff===-1?'Kemarin':diff<0&&diff>-7?(-diff)+' hari lalu':diff<0&&diff>-60?Math.round(-diff/7)+' minggu lalu':diff<0?Math.round(-diff/30)+' bulan lalu':diff+' hari lagi';
 return abs+' · '+rel}

return {parse:parse,normalize:normalize,findAmounts:findAmounts,extractDate:extractDate,fmtN:fmtN,relLabel:relLabel,isoOf:isoOf,pickWallet:pickWallet,chooseCategory:chooseCategory};
})();
if(typeof module!=='undefined')module.exports=VFQCE;

/* ====== VFQC UI: sheet Catat Cepat, Excel (.xlsx tanpa library), kirim WhatsApp ====== */
(function(){
'use strict';
var E=VFQCE,ov=null,st=null,lastTimer=0,confirmId=null;
function $(s,r){return (r||document).querySelector(s)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function N(n){return E.fmtN(n)}
function toastX(m){try{toast(m)}catch(e){}}
function ctx(){return {now:new Date(),wallets:S.wallets,catExp:S.catExp,catInc:S.catInc,history:S.transactions}}
function catsOf(ty){return ty==='income'?S.catInc:S.catExp}
function isoToD(i){var p=i.split('-').map(Number);return new Date(p[0],p[1]-1,p[2])}
var HR=['Min','Sen','Sel','Rab','Kam','Jum','Sab'],BL=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
function fdate(i){var d=isoToD(i);return HR[d.getDay()]+', '+d.getDate()+' '+BL[d.getMonth()]+' '+d.getFullYear()}
function uid(){var n=Math.max(Date.now(),(uid.l||0)+1);uid.l=n;return n}

/* ---------------- XLSX writer ---------------- */
var CRC=(function(){var t=[],c,n,k;for(n=0;n<256;n++){c=n;for(k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(b){var c=0xFFFFFFFF;for(var i=0;i<b.length;i++)c=CRC[(c^b[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0}
function zip(files){
 var enc=new TextEncoder(),parts=[],cd=[],off=0,now=new Date();
 var dt=((now.getHours()<<11)|(now.getMinutes()<<5)|(now.getSeconds()>>1))&0xFFFF,dd=(((now.getFullYear()-1980)<<9)|((now.getMonth()+1)<<5)|now.getDate())&0xFFFF;
 function u16(v){return [v&255,(v>>8)&255]}function u32(v){return [v&255,(v>>8)&255,(v>>16)&255,(v>>>24)&255]}
 files.forEach(function(f){
  var nb=enc.encode(f.name),db=typeof f.data==='string'?enc.encode(f.data):f.data,crc=crc32(db);
  var h=[].concat(u32(0x04034b50),u16(20),u16(0x0800),u16(0),u16(dt),u16(dd),u32(crc),u32(db.length),u32(db.length),u16(nb.length),u16(0));
  parts.push(new Uint8Array(h),nb,db);
  cd.push({nb:nb,crc:crc,len:db.length,off:off});
  off+=h.length+nb.length+db.length});
 var cdStart=off,cdParts=[];
 cd.forEach(function(c){
  var h=[].concat(u32(0x02014b50),u16(20),u16(20),u16(0x0800),u16(0),u16(dt),u16(dd),u32(c.crc),u32(c.len),u32(c.len),u16(c.nb.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(c.off));
  cdParts.push(new Uint8Array(h),c.nb);off+=h.length+c.nb.length});
 var end=new Uint8Array([].concat(u32(0x06054b50),u16(0),u16(0),u16(cd.length),u16(cd.length),u32(off-cdStart),u32(cdStart),u16(0)));
 return new Blob(parts.concat(cdParts,[end]),{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
function xe(s){return String(s==null?'':s).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function colL(i){var s='';i++;while(i>0){var m=(i-1)%26;s=String.fromCharCode(65+m)+s;i=Math.floor((i-1)/26)}return s}
function serial(d){return Math.round((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(1899,11,30))/864e5)}
function serialDT(ms){var d=new Date(ms);return serial(d)+(d.getHours()*3600+d.getMinutes()*60+d.getSeconds())/86400}
/* cell: {v, t:'s'|'n'|'f', s:styleId, f:formula} */
function cellXml(r,c,o){
 var ref=colL(c)+r;
 if(o==null||o.v===''&&o.t!=='f')return '<c r="'+ref+'"'+(o&&o.s?' s="'+o.s+'"':'')+'/>';
 if(o.t==='f')return '<c r="'+ref+'"'+(o.s?' s="'+o.s+'"':'')+'><f>'+xe(o.f)+'</f><v>'+(o.v==null?0:o.v)+'</v></c>';
 if(o.t==='n')return '<c r="'+ref+'"'+(o.s?' s="'+o.s+'"':'')+'><v>'+o.v+'</v></c>';
 return '<c r="'+ref+'" t="inlineStr"'+(o.s?' s="'+o.s+'"':'')+'><is><t xml:space="preserve">'+xe(o.v)+'</t></is></c>';
}
function sheetXml(rows,cols,opts){
 opts=opts||{};
 var x='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
 x+='<sheetViews><sheetView workbookViewId="0"'+(opts.tab?' tabSelected="1"':'')+' showGridLines="'+(opts.grid===false?0:1)+'">'+(opts.freeze?'<pane ySplit="'+opts.freeze+'" topLeftCell="A'+(opts.freeze+1)+'" activePane="bottomLeft" state="frozen"/>':'')+'</sheetView></sheetViews><sheetFormatPr defaultRowHeight="15"/>';
 x+='<cols>'+cols.map(function(w,i){return '<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+w+'" customWidth="1"/>'}).join('')+'</cols><sheetData>';
 rows.forEach(function(row,ri){if(!row)return;var r=ri+1;x+='<row r="'+r+'"'+(row.h?' ht="'+row.h+'" customHeight="1"':'')+'>';(row.c||row).forEach(function(c,ci){x+=cellXml(r,ci,c)});x+='</row>'});
 x+='</sheetData>';
 if(opts.filter)x+='<autoFilter ref="'+opts.filter+'"/>';
 if(opts.merge)x+='<mergeCells count="'+opts.merge.length+'">'+opts.merge.map(function(m){return '<mergeCell ref="'+m+'"/>'}).join('')+'</mergeCells>';
 x+='<pageMargins left="0.5" right="0.5" top="0.75" bottom="0.75" header="0.3" footer="0.3"/><pageSetup orientation="landscape" fitToHeight="0"/></worksheet>';
 return x;
}
var STY='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'+
'<numFmts count="3"><numFmt numFmtId="164" formatCode="dd\\ mmm\\ yyyy"/><numFmt numFmtId="165" formatCode="dd\\ mmm\\ yyyy\\ hh:mm"/><numFmt numFmtId="166" formatCode="&quot;Rp&quot;\\ #,##0"/></numFmts>'+
'<fonts count="6"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="16"/><color rgb="FF1F6F5C"/><name val="Calibri"/></font><font><sz val="11"/><color rgb="FF0D8A68"/><name val="Calibri"/></font><font><sz val="11"/><color rgb="FFD4402F"/><name val="Calibri"/></font></fonts>'+
'<fills count="4"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F6F5C"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFEAF4F1"/><bgColor indexed="64"/></patternFill></fill></fills>'+
'<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFD6E0DC"/></left><right style="thin"><color rgb="FFD6E0DC"/></right><top style="thin"><color rgb="FFD6E0DC"/></top><bottom style="thin"><color rgb="FFD6E0DC"/></bottom><diagonal/></border></borders>'+
'<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="12">'+
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'+ /*0*/
'<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>'+ /*1 header*/
'<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>'+ /*2 teks*/
'<xf numFmtId="166" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>'+ /*3 rupiah*/
'<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left"/></xf>'+ /*4 tanggal*/
'<xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left"/></xf>'+ /*5 tgl jam*/
'<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>'+ /*6 judul*/
'<xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>'+ /*7 label tebal*/
'<xf numFmtId="166" fontId="2" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>'+ /*8 rupiah tebal*/
'<xf numFmtId="0" fontId="4" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>'+ /*9 masuk*/
'<xf numFmtId="0" fontId="5" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>'+ /*10 keluar*/
'<xf numFmtId="0" fontId="2" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>'+ /*11 pindah*/
'</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
var JN={income:'Masuk',expense:'Keluar',transfer:'Pindah'};
function qcRows(period){
 var now=new Date(),td=E.isoOf(now),m=td.slice(0,7),pm=E.isoOf(new Date(now.getFullYear(),now.getMonth()-1,1)).slice(0,7),w7=E.isoOf(new Date(now.getFullYear(),now.getMonth(),now.getDate()-6));
 var rows=S.transactions.filter(function(t){return t&&t.qc}).map(function(t){return {t:t,d:(typeof td_==='function'?td_(t):(t.isoDate||''))}});
 rows=rows.map(function(o){o.d=o.t.isoDate||o.d;return o}).filter(function(o){
  if(period==='today')return o.d===td;if(period==='7d')return o.d>=w7&&o.d<=td;if(period==='month')return o.d.slice(0,7)===m;if(period==='lastmonth')return o.d.slice(0,7)===pm;return true});
 rows.sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:(a.t.qcAt||0)-(b.t.qcAt||0)});
 return rows.map(function(o){return o.t});
}
function buildXlsx(list,periodLabel){
 var H=['No','Tanggal','Dicatat pada','Jenis','Kategori','Dompet','Dompet Tujuan','Jumlah (Rp)','Catatan','Kalimat Asli'],
  rows=[{c:H.map(function(h){return {v:h,s:1}}),h:30}];
 var inc=0,exp=0,byCat={},byW={};
 list.forEach(function(t,i){
  var d=isoToD(t.isoDate),jn=JN[t.type]||'Keluar',a=+t.amount||0;
  if(t.type==='income')inc+=a;else if(t.type==='expense')exp+=a;
  if(t.type==='expense'){byCat[t.category]=(byCat[t.category]||0)+a}
  var wk=t.wallet||'-';byW[wk]=byW[wk]||{i:0,o:0};if(t.type==='income')byW[wk].i+=a;else if(t.type==='expense')byW[wk].o+=a;
  rows.push({c:[{v:i+1,t:'n',s:2},{v:serial(d),t:'n',s:4},{v:t.qcAt?serialDT(t.qcAt):serial(d),t:'n',s:5},{v:jn,s:t.type==='income'?9:t.type==='expense'?10:11},{v:t.category||'',s:2},{v:t.wallet||'',s:2},{v:t.toWallet||'',s:2},{v:a,t:'n',s:3},{v:t.note||'',s:2},{v:t.qcRaw||'',s:2}]});
 });
 var n=list.length+1,SN="'Data Catat Cepat'!",rngD=SN+'$D$2:$D$'+Math.max(n,2),rngH=SN+'$H$2:$H$'+Math.max(n,2),rngE=SN+'$E$2:$E$'+Math.max(n,2),rngF=SN+'$F$2:$F$'+Math.max(n,2);
 var s1=sheetXml(rows,[6,14,19,10,24,18,18,16,34,44],{freeze:1,filter:'A1:J'+Math.max(n,2),tab:1});
 var sum=[];
 sum.push([{v:'Ringkasan Catat Cepat – Mindvesta Finance',s:6}]);
 sum.push([{v:'Periode: '+periodLabel+' · dibuat '+fdate(E.isoOf(new Date()))}]);
 sum.push([]);
 sum.push([{v:'Jumlah catatan',s:7},{t:'f',f:'COUNTA('+SN+'$A$2:$A$'+Math.max(n,2)+')',v:list.length,s:7}]);
 sum.push([{v:'Total Masuk',s:7},{t:'f',f:'SUMIF('+rngD+',"Masuk",'+rngH+')',v:inc,s:8}]);
 sum.push([{v:'Total Keluar',s:7},{t:'f',f:'SUMIF('+rngD+',"Keluar",'+rngH+')',v:exp,s:8}]);
 sum.push([{v:'Selisih (Masuk − Keluar)',s:7},{t:'f',f:'B5-B6',v:inc-exp,s:8}]);
 sum.push([]);
 sum.push([{v:'Pengeluaran per kategori',s:1},{v:'Total (Rp)',s:1}]);
 var cats=Object.keys(byCat).sort(function(a,b){return byCat[b]-byCat[a]});
 cats.forEach(function(c){sum.push([{v:c,s:2},{t:'f',f:'SUMIFS('+rngH+','+rngD+',"Keluar",'+rngE+',A'+(sum.length+1)+')',v:byCat[c],s:3}])});
 if(!cats.length)sum.push([{v:'(belum ada)',s:2},{v:0,t:'n',s:3}]);
 sum.push([]);
 sum.push([{v:'Dompet',s:1},{v:'Masuk (Rp)',s:1},{v:'Keluar (Rp)',s:1}]);
 Object.keys(byW).forEach(function(w){var r=sum.length+1;sum.push([{v:w,s:2},{t:'f',f:'SUMIFS('+rngH+','+rngD+',"Masuk",'+rngF+',A'+r+')',v:byW[w].i,s:3},{t:'f',f:'SUMIFS('+rngH+','+rngD+',"Keluar",'+rngF+',A'+r+')',v:byW[w].o,s:3}])});
 var s2=sheetXml(sum,[30,20,20],{grid:false});
 var wb='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView xWindow="0" yWindow="0" windowWidth="24000" windowHeight="12000"/></bookViews><sheets><sheet name="Data Catat Cepat" sheetId="1" r:id="rId1"/><sheet name="Ringkasan" sheetId="2" r:id="rId2"/></sheets><definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">\'Data Catat Cepat\'!$A$1:$J$'+Math.max(n,2)+'</definedName></definedNames><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>';
 return zip([
  {name:'[Content_Types].xml',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'},
  {name:'_rels/.rels',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'},
  {name:'xl/workbook.xml',data:wb},
  {name:'xl/_rels/workbook.xml.rels',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'},
  {name:'xl/styles.xml',data:STY},
  {name:'xl/worksheets/sheet1.xml',data:s1},
  {name:'xl/worksheets/sheet2.xml',data:s2}
 ]);
}
var PER={all:'Semua data',today:'Hari ini','7d':'7 hari terakhir',month:'Bulan ini',lastmonth:'Bulan lalu'};
function fname(){return 'CatatCepat_MindvestaFinance_'+E.isoOf(new Date())+'.xlsx'}
function download(blob,name){var a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){a.remove();URL.revokeObjectURL(u)},1500)}
function summaryText(list,per){
 var inc=0,exp=0;list.forEach(function(t){if(t.type==='income')inc+=+t.amount||0;else if(t.type==='expense')exp+=+t.amount||0});
 var L=['*Catat Cepat – Mindvesta Finance*','Periode: '+PER[per],'Jumlah catatan: '+list.length,'Masuk: Rp'+N(inc),'Keluar: Rp'+N(exp),'Selisih: '+(inc-exp<0?'-':'')+'Rp'+N(Math.abs(inc-exp)),''];
 list.slice(-12).reverse().forEach(function(t){L.push('• '+fdate(t.isoDate).replace(/^\w+, /,'')+' | '+(JN[t.type]||'')+' | '+(t.category||'')+' | Rp'+N(t.amount)+(t.note?' | '+t.note:''))});
 if(list.length>12)L.push('… dan '+(list.length-12)+' catatan lain (lihat file Excel)');
 return L.join('\n');
}
function waNumber(){var v=String((S.settings&&S.settings.qcWa)||'').replace(/\D/g,'');if(!v)return '';if(v[0]==='0')v='62'+v.slice(1);else if(v[0]==='8')v='62'+v;return v}
function exportXls(){
 var per=st&&st.per||'all',list=qcRows(per);
 if(!list.length)return toastX('Belum ada data Catat Cepat untuk periode ini.');
 download(buildXlsx(list,PER[per]),fname());toastX('Excel diunduh ('+list.length+' catatan) ✅');
}
async function shareWA(){
 var per=st&&st.per||'all',list=qcRows(per);
 if(!list.length)return toastX('Belum ada data Catat Cepat untuk periode ini.');
 var blob=buildXlsx(list,PER[per]),name=fname(),text=summaryText(list,per),mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent||'');
 try{var file=new File([blob],name,{type:blob.type});
  if(mobile&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Catat Cepat Mindvesta Finance',text:text});return}
 }catch(e){if(e&&e.name==='AbortError')return}
 download(blob,name);
 var num=waNumber();
 setTimeout(function(){window.open('https://wa.me/'+num+'?text='+encodeURIComponent(text+'\n\n📎 File Excel sudah terunduh ('+name+'), lampirkan di chat ini.'),'_blank')},500);
 toastX('Excel diunduh. Lampirkan ke chat WhatsApp yang terbuka 📎');
}

/* ---------------- UI ---------------- */
var CSS='.qc-pv{text-align:center;font-size:24px;font-weight:800;padding:12px;border-radius:14px;background:var(--q-bg2);border:1px solid var(--q-ln)}.qc-pv::before{content:attr(data-i);margin-right:.4em}.qc-cols{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.qc-cols button{width:32px;height:32px;border-radius:50%;border:2px solid var(--q-ln)}.qc-cols button.on{border-color:var(--q-tx);box-shadow:0 0 0 2px var(--q-ac)}.qc-cols input{width:38px;height:34px;border:0;background:none;padding:0}.qc-fonts{display:flex;gap:6px;flex-wrap:wrap}.qc-fonts button{padding:7px 12px;border-radius:12px;border:1px solid var(--q-ln);font-size:15px}.qc-fonts button.on{background:var(--q-ac);color:var(--q-on);border-color:var(--q-ac)}'+
'.qc-ig{display:grid;grid-template-columns:repeat(8,1fr);gap:6px}.qc-ig button{font-size:24px;padding:6px 0;border-radius:12px;border:1px solid var(--q-ln);text-align:center;background:var(--q-bg2)}.qc-ig button.on{border-color:var(--q-ac);background:var(--q-ac)}'+
'.qc-ov{--q-bg:var(--cd,#16201d);--q-bg2:var(--bg,#0d1412);--q-tx:var(--tx,#e8efec);--q-mu:var(--mu,#8fa69d);--q-ln:var(--ln,#243430);--q-ac:var(--ac,#f0b84a);--q-on:var(--onac,#1a1405);--q-in:var(--in,#4fd1a5);--q-out:var(--out,#ff7b6b);position:fixed;inset:0;z-index:2147482500;background:rgba(5,10,8,.62);display:flex;align-items:flex-end;justify-content:center;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);font-size:15px}'+
'body.fm .qc-ov{--q-bg:#fff;--q-bg2:#fff4f8;--q-tx:#4a3a52;--q-mu:#9a8aa3;--q-ln:#f3d9e4;--q-ac:#ee6495;--q-on:#fff;--q-in:#0d8a68;--q-out:#d4402f;background:rgba(80,30,60,.35)}'+
'.qc-sh{background:var(--q-bg);color:var(--q-tx);width:100%;max-width:560px;max-height:94vh;display:flex;flex-direction:column;border-radius:22px 22px 0 0;box-shadow:0 -12px 40px #0006}'+
'.qc-hd{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 6px}.qc-hd b{font-size:18px}.qc-x{width:36px;height:36px;border-radius:50%;background:var(--q-bg2);color:var(--q-tx);display:grid;place-items:center;font-size:16px}'+
'.qc-bd{overflow:auto;padding:4px 16px 18px;-webkit-overflow-scrolling:touch}'+
'.qc-in{width:100%;background:var(--q-bg2);color:var(--q-tx);border:2px solid var(--q-ac);border-radius:16px;padding:12px 14px;font:inherit;resize:none;min-height:56px}'+
'.qc-ex{display:flex;gap:6px;overflow-x:auto;padding:8px 0 4px}.qc-ex button{white-space:nowrap;font-size:12px;border:1px solid var(--q-ln);border-radius:99px;padding:5px 10px;color:var(--q-mu);background:var(--q-bg2)}'+
'.qc-hint{font-size:12px;color:var(--q-mu);padding:2px 2px 6px}'+
'.qc-it{background:var(--q-bg2);border:1px solid var(--q-ln);border-radius:16px;padding:12px;margin:8px 0}'+
'.qc-top{display:flex;align-items:center;justify-content:space-between;gap:8px}.qc-amt{font-size:22px;font-weight:800;font-variant-numeric:tabular-nums}.qc-amt.income{color:var(--q-in)}.qc-amt.expense{color:var(--q-out)}'+
'.qc-seg{display:flex;gap:4px}.qc-seg button{padding:5px 10px;border-radius:99px;font-size:12px;font-weight:700;border:1px solid var(--q-ln);color:var(--q-mu)}.qc-seg button.on{background:var(--q-ac);color:var(--q-on);border-color:var(--q-ac)}'+
'.qc-g{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.qc-g label{display:block;font-size:11px;color:var(--q-mu);margin-bottom:2px}.qc-g .w2{grid-column:1/-1}'+
'.qc-g input,.qc-g select{width:100%;background:var(--q-bg);color:var(--q-tx);border:1px solid var(--q-ln);border-radius:10px;padding:8px 9px;font:inherit;font-size:14px;min-width:0}'+
'.qc-lab{font-size:12px;color:var(--q-mu);margin-top:6px;line-height:1.5}.qc-lab b{color:var(--q-tx);font-weight:600}'+
'.qc-w{font-size:12px;color:#b45309;background:#fef3c7;border-radius:8px;padding:5px 8px;margin-top:6px}body:not(.fm) .qc-w{color:#fcd34d;background:#3b2f0a}'+
'.qc-del{font-size:12px;color:var(--q-out);padding:4px 0 0}'+
'.qc-save{width:100%;margin-top:10px;background:var(--q-ac);color:var(--q-on);font-weight:800;padding:14px;border-radius:16px;text-align:center;font-size:16px}.qc-save[disabled]{opacity:.4}'+
'.qc-sec{margin-top:16px;border-top:1px solid var(--q-ln);padding-top:12px}.qc-sec h4{font-size:13px;margin-bottom:6px}'+
'.qc-rec{display:flex;align-items:center;gap:8px;padding:7px 0;border-top:1px solid var(--q-ln);font-size:13px}.qc-rec:first-of-type{border-top:0}.qc-rec div{flex:1;min-width:0}.qc-rec small{color:var(--q-mu);font-size:11px;display:block}.qc-rec button{color:var(--q-out);font-size:12px;padding:4px 6px}'+
'.qc-xr{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.qc-xr button{padding:12px;border-radius:14px;font-weight:700;text-align:center;border:1px solid var(--q-ac);color:var(--q-ac)}.qc-xr button.wa{background:#25d366;color:#053b1b;border-color:#25d366}'+
'.qc-row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}.qc-row2 select,.qc-row2 input{width:100%;background:var(--q-bg2);color:var(--q-tx);border:1px solid var(--q-ln);border-radius:10px;padding:8px;font:inherit;font-size:14px}'+
'.qc-card{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:12px 14px;border-radius:22px;background:linear-gradient(135deg,var(--cd,#16201d),var(--bg,#0d1412));color:var(--tx,#e8efec);border:1.5px solid var(--ac,#f0b84a);box-shadow:0 10px 26px -16px var(--ac,#f0b84a);position:relative;overflow:hidden}'+
'.qc-card .qe{width:48px;height:48px;border-radius:16px;background:var(--ac,#f0b84a);color:var(--onac,#1a1405);display:grid;place-items:center;flex:none;font-size:26px}.qc-card .qt{flex:1;min-width:0;display:block}.qc-card b{display:block;font-size:16px;text-align:left}.qc-card b em{font-style:normal;color:var(--ac,#f0b84a);font-size:12px}'+
'.qc-card .qin{display:block;margin-top:5px;font-size:12.5px;color:var(--mu,#8fa69d);background:#ffffff14;border-radius:99px;padding:5px 12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left}.qc-card .qin u{display:inline-block;width:1.5px;height:12px;margin-left:2px;vertical-align:-2px;background:var(--ac,#f0b84a);animation:qcb 1s steps(1) infinite}@keyframes qcb{50%{opacity:0}}'+
'.qc-card .qx{display:flex;flex-direction:column;gap:4px;flex:none}.qc-card .qx i{font-style:normal;font-size:10.5px;font-weight:700;border:1px solid var(--ln,#243430);border-radius:99px;padding:2px 9px;color:var(--mu,#8fa69d);text-align:center}'+
'body.fm .qc-card{background:linear-gradient(135deg,#ffffff 0%,#ffeaf2 60%,#ffe0ec 100%);color:#5b3446;border:1.5px solid #fff;border-radius:38px 38px 38px 12px;box-shadow:0 18px 38px -18px #d6648c8c,inset 0 1px 0 #fff;margin:6px 0 18px;padding:12px 16px 12px 12px}'+
'body.fm .qc-card::after{content:"";position:absolute;right:-26px;top:-30px;width:110px;height:110px;border-radius:50%;background:radial-gradient(circle,#ffc4d9aa,transparent 70%);pointer-events:none}'+
'body.fm .qc-card .qe{background:linear-gradient(145deg,#f98fb4,#e5668d);color:#fff;border-radius:50%;box-shadow:0 8px 16px -8px #e5668d,inset 0 2px 0 #ffffff80}body.fm .qc-card .qe svg{width:30px;height:30px}'+
'body.fm .qc-card b{color:#c2587a;font-size:17px}body.fm .qc-card b em{color:#f58db0}'+
'body.fm .qc-card .qin{background:#fff;color:#a47a8d;box-shadow:inset 0 0 0 1.5px #f8d4e2}body.fm .qc-card .qin u{background:#e5668d}'+
'body.fm .qc-card .qx i{border:0;background:linear-gradient(135deg,#f58db0,#f6b9a6);color:#fff}'+
'body.fm .fbk.on{transform:none!important}body.fm .fbs{align-items:center}'+
'.hdw{display:flex;align-items:center;gap:6px}.hdw .hd{height:26px}.hdw .hdo{flex:none;width:auto!important;font-size:11px;font-weight:700;padding:0 10px;border-radius:99px;background:#ffffff40;color:#fff}body.fm .hdw .hdo{background:#fff;color:#e5668d}.eks{display:contents}'+
'.pg .ed[data-closed="1"]{box-shadow:0 0 0 2px #e5668d inset}'+
''+
'.fp .qcb{font-size:22px;line-height:1;opacity:1!important;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#ffe27a,#ffb84a);box-shadow:0 6px 12px -6px #c98a14;text-align:center}';

function build(){
 if(ov)return;
 var st0=document.createElement('style');st0.id='qc-css';st0.textContent=CSS;document.head.appendChild(st0);
}
function parseNow(){
 var raw=st.text;st.items=raw.trim()?E.parse(raw,ctx()):[];
 /* pertahankan kolom yang sudah diubah manual */
 if(st.locks&&st.prevN===st.items.length)st.items.forEach(function(it,i){var l=st.locks[i];if(!l)return;Object.keys(l).forEach(function(k){it[k]=l[k]});if(l.date)it.dateLabel=fdate(l.date)});
 else st.locks={};
 st.prevN=st.items.length;
}
function opts(list,cur){var l=list.slice();if(cur&&l.indexOf(cur)<0)l.unshift(cur);return l.map(function(x){return '<option'+(x===cur?' selected':'')+'>'+esc(x)+'</option>'}).join('')}
function renderPv(){
 var h='';
 if(!st.items.length){h='<div class="qc-hint">Ketik bebas, nanti otomatis dirapikan: jumlah, kategori, dompet, tanggal, dan masuk/keluar. Cek hasilnya sebelum menyimpan.</div>'}
 st.items.forEach(function(it,i){
  var tr=it.type==='transfer';
  h+='<div class="qc-it" data-i="'+i+'"><div class="qc-top"><div class="qc-amt '+it.type+'">'+(it.type==='income'?'+':it.type==='expense'?'−':'⇄ ')+'Rp'+N(it.amount)+'</div><div class="qc-seg">'+['expense','income','transfer'].map(function(t){return '<button type="button" data-qc="ty" data-v="'+t+'" class="'+(it.type===t?'on':'')+'">'+({expense:'Keluar',income:'Masuk',transfer:'Pindah'})[t]+'</button>'}).join('')+'</div></div>'+
  '<div class="qc-g"><div class="w2"><label>Jumlah (Rp)</label><input inputmode="numeric" data-f="amount" value="'+N(it.amount)+'"></div>'+
  (tr?'<div><label>Dari dompet</label><select data-f="wallet">'+opts(S.wallets,it.wallet)+'</select></div><div><label>Ke dompet</label><select data-f="toWallet">'+opts(S.wallets,it.toWallet)+'</select></div>'
     :'<div><label>Kategori</label><select data-f="category">'+opts(catsOf(it.type),it.category)+'</select></div><div><label>Dompet</label><select data-f="wallet">'+opts(S.wallets,it.wallet)+'</select></div>')+
  '<div><label>Tanggal</label><input type="date" data-f="date" value="'+it.date+'"></div><div><label>Catatan</label><input data-f="note" maxlength="80" value="'+esc(it.note)+'"></div></div>'+
  '<div class="qc-lab">📅 <b>'+esc(it.dateLabel)+'</b><br>🧠 '+(tr?'':'Kategori: '+esc(it.why.category)+' · ')+'Dompet: '+esc(it.why.wallet||'')+'</div>'+
  it.warn.map(function(w){return '<div class="qc-w">⚠️ '+esc(w)+'</div>'}).join('')+
  (st.items.length>1?'<button type="button" class="qc-del" data-qc="rm" data-i="'+i+'">✕ Buang catatan ini</button>':'')+'</div>';
 });
 var ok=st.items.some(function(i){return i.amount>0});
 $('#qcpv').innerHTML=h;
 var b=$('#qcsave');b.disabled=!ok;b.textContent=st.items.length>1?'Simpan '+st.items.filter(function(i){return i.amount>0}).length+' catatan ⚡':'Simpan ⚡';
}
function renderRecent(){
 var rec=S.transactions.filter(function(t){return t&&t.qc}).sort(function(a,b){return (b.qcAt||0)-(a.qcAt||0)}).slice(0,5);
 var all=S.transactions.filter(function(t){return t&&t.qc}).length;
 $('#qcrec').innerHTML=rec.length?rec.map(function(t){var sg=t.type==='income'?'+':t.type==='expense'?'−':'⇄ ';return '<div class="qc-rec"><div><b>'+esc(t.note||t.category)+'</b><small>'+esc(fdate(t.isoDate))+' · '+esc(t.category)+' · '+esc(t.wallet)+(t.toWallet?' → '+esc(t.toWallet):'')+'</small></div><b style="color:var(--q-'+(t.type==='income'?'in':'out')+')">'+sg+'Rp'+N(t.amount)+'</b><button type="button" data-qc="undo" data-id="'+t.id+'">'+(confirmId===t.id?'Yakin?':'Hapus')+'</button></div>'}).join(''):'<div class="qc-hint">Belum ada catatan lewat Catat Cepat.</div>';
 $('#qccount').textContent=all+' catatan tersimpan lewat Catat Cepat';
}
function open(o){
 build();close(true);
 st={text:(o&&o.text)||'',items:[],locks:{},prevN:0,per:'all'};
 ov=document.createElement('div');ov.className='qc-ov';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Catat Cepat');
 var ex=['beli bakso 15rb dari bulan kemarin','di transfer duit minggu lalu 100rb','gajian 5jt','isi bensin 30rb pake dana','kopi 18rb kemarin','tarik tunai 500rb'];
 ov.innerHTML='<div class="qc-sh"><div class="qc-hd"><b>⚡ Catat Cepat</b><button type="button" class="qc-x" data-qc="close" aria-label="Tutup">✕</button></div><div class="qc-bd">'+
 '<textarea id="qcin" class="qc-in" rows="2" enterkeyhint="send" autocomplete="off" autocapitalize="sentences" placeholder="Ketik bebas, mis. beli bakso 15rb dari bulan kemarin"></textarea>'+
 '<div class="qc-ex">'+ex.map(function(e){return '<button type="button" data-qc="ex" data-t="'+esc(e)+'">'+esc(e)+'</button>'}).join('')+'</div>'+
 '<div id="qcpv"></div><button type="button" id="qcsave" class="qc-save" data-qc="save" disabled>Simpan ⚡</button>'+
 '<div class="qc-sec"><h4>🕘 Baru dicatat</h4><div id="qcrec"></div></div>'+
 '<div class="qc-sec"><h4>📊 Excel &amp; WhatsApp</h4><div class="qc-hint" id="qccount"></div><div class="qc-row2"><select id="qcper" aria-label="Periode">'+Object.keys(PER).map(function(k){return '<option value="'+k+'">'+PER[k]+'</option>'}).join('')+'</select><input id="qcwa" inputmode="tel" placeholder="No. WA tujuan (opsional)" value="'+esc((S.settings&&S.settings.qcWa)||'')+'"></div><div class="qc-xr"><button type="button" data-qc="xls">📥 Unduh Excel</button><button type="button" class="wa" data-qc="wa">💬 Kirim ke WhatsApp</button></div></div>'+
 '</div></div>';
 document.body.appendChild(ov);document.body.style.overflow='hidden';
 var ta=$('#qcin');ta.value=st.text;
 if(st.text)parseNow();
 renderPv();renderRecent();
 ov.addEventListener('click',onClick);ov.addEventListener('input',onInput);ov.addEventListener('change',onChange);ov.addEventListener('keydown',onKey);
 try{var fo=window.fpo;}catch(e){}
 setTimeout(function(){try{ta.focus()}catch(e){}},60);
}
function close(silent){if(ov){ov.remove();ov=null;document.body.style.overflow=''}st=null}
function onKey(e){
 if(e.key==='Escape'){close();return}
 if(e.key==='Enter'&&!e.shiftKey&&e.target.id==='qcin'){e.preventDefault();save()}
}
function onInput(e){
 var t=e.target;
 if(t.id==='qcin'){st.text=t.value;parseNow();renderPv();return}
 if(t.id==='qcwa'){S.settings.qcWa=t.value;try{localStorage.setItem('vfqc_wa',t.value)}catch(x){}return}
 if(t.dataset.f==='amount'){var d=t.value.replace(/\D/g,'');t.value=d?N(+d):'';lock(t,'amount',+d||0);var it=t.closest('.qc-it'),i=+it.dataset.i;st.items[i].amount=+d||0;var a=it.querySelector('.qc-amt');a.textContent=(st.items[i].type==='income'?'+':st.items[i].type==='expense'?'−':'⇄ ')+'Rp'+N(+d||0);$('#qcsave').disabled=!st.items.some(function(x){return x.amount>0})}
 else if(t.dataset.f==='note'){lock(t,'note',t.value)}
}
function lock(t,k,v){var i=+t.closest('.qc-it').dataset.i;(st.locks[i]=st.locks[i]||{})[k]=v;st.items[i][k]=v}
function onChange(e){
 var t=e.target;
 if(t.id==='qcper'){st.per=t.value;return}
 if(t.id==='qcwa'){try{save_wa(t.value)}catch(x){}return}
 var f=t.dataset.f;if(!f)return;
 var i=+t.closest('.qc-it').dataset.i,it=st.items[i];
 if(f==='date'){if(t.value){lock(t,'date',t.value);it.dateLabel=fdate(t.value);it.future=t.value>E.isoOf(new Date());renderPv()}}
 else if(f==='category'||f==='wallet'||f==='toWallet'){lock(t,f,t.value);renderPv()}
}
function save_wa(v){S.settings.qcWa=v;persist()}
function onClick(e){
 if(e.target===ov){close();return}
 var b=e.target.closest('[data-qc]');if(!b)return;
 var k=b.dataset.qc;
 if(k==='close')close();
 else if(k==='ex'){var ta=$('#qcin');ta.value=b.dataset.t;st.text=ta.value;st.locks={};parseNow();renderPv();ta.focus()}
 else if(k==='save')save();
 else if(k==='ty'){var it=st.items[+b.closest('.qc-it').dataset.i],ty=b.dataset.v;if(it.type===ty)return;
  var i=+b.closest('.qc-it').dataset.i;it.type=ty;(st.locks[i]=st.locks[i]||{}).type=ty;
  if(ty==='transfer'){it.category='Transfer';if(it.toWallet===it.wallet||!it.toWallet){var o=S.wallets.filter(function(w){return w!==it.wallet});it.toWallet=o[0]||it.wallet}}
  else{var cc=E.chooseCategory(it.note||'',ty,ctx());it.category=cc.name;it.why.category=cc.why;if(st.locks[i])delete st.locks[i].category}
  renderPv()}
 else if(k==='rm'){var j=+b.dataset.i;st.items.splice(j,1);st.locks={};st.prevN=-1;renderPv()}
 else if(k==='undo'){var id=+b.dataset.id;if(confirmId===id){S.transactions=S.transactions.filter(function(t){return t.id!==id});confirmId=null;persist();toastX('Catatan dihapus');if(ov)renderRecent()}else{confirmId=id;renderRecent();setTimeout(function(){if(confirmId===id){confirmId=null;if(ov)renderRecent()}},4000)}}
 else if(k==='xls')exportXls();
 else if(k==='wa')shareWA();
}
function persist(){try{window.save()}catch(e){}}
function save(){
 if(!st)return;
 var ok=st.items.filter(function(i){return i.amount>0});
 if(!ok.length){toastX('Jumlahnya belum terbaca. Tulis misalnya 15rb.');return}
 for(var q=0;q<ok.length;q++){if(ok[q].type==='transfer'&&ok[q].wallet===ok[q].toWallet){toastX('Dompet asal dan tujuan harus berbeda.');return}}
 var now=Date.now(),arr=ok.map(function(it,i){
  var tx={id:uid(),scope:'personal',type:it.type,amount:Math.round(it.amount),category:it.type==='transfer'?'Transfer':it.category,wallet:it.wallet||S.wallets[0],note:it.note||'',photos:[],party:'',chk:'1',isoDate:it.date,date:fd(it.date),qc:1,qcRaw:it.raw,qcAt:now+i};
  if(it.type==='transfer')tx.toWallet=it.toWallet;
  try{if(typeof bkc==='function')tx.book=bkc()}catch(e){}
  return tx});
 S.transactions.unshift.apply(S.transactions,arr.reverse());
 st.text='';st.items=[];st.locks={};st.prevN=0;
 var ta=$('#qcin');if(ta){ta.value='';}
 persist();
 toastX('⚡ '+ok.length+' catatan tersimpan'+(ok.length===1?': '+(ok[0].note||ok[0].category)+' Rp'+N(ok[0].amount):''));
 if(ov){renderPv();renderRecent();try{ta.focus()}catch(e){}}
}

/* ---------------- sambungan ke tampilan ---------------- */
function barHtml(){
 var w=false;try{w=S.settings.mode==='wanita'}catch(e){}
 var ic=w&&typeof ik==='function'?ik('bolt',34):'⚡';
 return '<button type="button" class="qc-card" data-a="qcopen" aria-label="Catat Cepat"><span class="qe">'+ic+'</span><span class="qt"><b>Catat Cepat <em>✦</em></b><span class="qin">beli bakso 15rb dari bulan kemarin<u></u></span></span><span class="qx"><i>Excel</i><i>WA</i></span></button>';
}
window.VFQC={open:open,close:close,parse:function(t){return E.parse(t,ctx())},buildXlsx:buildXlsx,qcRows:qcRows,bar:barHtml,_engine:E};
if(typeof A!=='undefined'){
 A.qcopen=function(){try{if(typeof fpo!=='undefined')fpo=0}catch(e){}open()};
}
/* Pria: Beranda */
if(typeof V!=='undefined'&&V.home){
 var _vh=V.home;
 V.home=function(){var h=_vh();try{if(S.settings.mode==='wanita')return h}catch(e){}
  if(h.indexOf('qc-card')>-1)return h;
  var i=h.indexOf('class="c hero"');
  if(i>-1){var s=h.lastIndexOf('<section',i),j=h.indexOf('</section>',i);if(s>-1&&j>-1)return h.slice(0,j+10)+barHtml()+h.slice(j+10)}
  return barHtml()+h};
}
/* Wanita: Buku utama */
if(typeof fHome==='function'){
 var _fh=fHome;
 fHome=function(){var h=_fh();if(h.indexOf('qc-card')>-1)return h;
  var k='<button class="fsimp"',i=h.indexOf(k);
  if(i>-1)return h.slice(0,i)+barHtml()+h.slice(i);
  return h.replace('<div class="fbody">','<div class="fbody">'+barHtml())};
}
try{var _w=localStorage.getItem('vfqc_wa');if(_w&&S.settings&&!S.settings.qcWa)S.settings.qcWa=_w}catch(e){}
if(typeof A!=='undefined'){A.epad=function(){S.settings.padHide=S.settings.padHide?0:1;eRender()}}
document.addEventListener('click',function(e){try{var d=e.target.closest&&e.target.closest('#E .ed');if(!d||!S.settings.padHide)return;if(e.target.closest('#enote')||e.target.closest('.hb'))return;S.settings.padHide=0;eRender()}catch(x){}});
/* Judul header (Pria): nama "Financial Diary" + ikon yang bisa diganti */
var DI=['💰','📒','📖','📔','💼','🏦','💳','🪙','💵','🐷','🎯','📊','📈','🔒','🛡️','⭐','🔥','🚀','👑','💎','🌟','🍀','🦁','🐯','🦅','🏆','⚡','🌿','🌊','🎓','🏠','🚗','✈️','🎮','☕','🧠','❤️','💙','💚','🖤'];
var inSet=0;
var FONTS=[['Bawaan',''],['Klasik (serif)','Georgia,"Times New Roman",serif'],['Mono','ui-monospace,"JetBrains Mono",Menlo,Consolas,monospace'],['Bulat','ui-rounded,"Nunito","Quicksand","Varela Round",system-ui,sans-serif'],['Tulisan tangan','"Brush Script MT","Segoe Script","Comic Sans MS",cursive'],['Tebal','Impact,"Arial Black",system-ui,sans-serif'],['Elegan','"Palatino Linotype",Palatino,"Book Antiqua",serif']];
var COLS=['#f0b84a','#b8ff3c','#4fd1a5','#38bdf8','#8b5cf6','#f472b6','#ff7b6b','#ffffff','#111111'];
function clearTS(h){['color','font-family','background','-webkit-text-fill-color','-webkit-background-clip','background-clip'].forEach(function(k){h.style.removeProperty(k)})}
function applyTS(h){var c=S.settings.diaryColor,f=S.settings.diaryFont;clearTS(h);
 if(c){h.style.setProperty('background','none','important');h.style.setProperty('-webkit-text-fill-color',c,'important');h.style.setProperty('color',c,'important')}
 if(f)h.style.setProperty('font-family',f,'important')}
function curIcon(){try{return (S.settings&&S.settings.diaryIcon)||'💰'}catch(e){return '💰'}}
function setTitle(){try{var h=document.querySelector('header h1');if(!h)return;var pria=S.settings.mode==='pria',want=pria?'Financial Diary':'Mindvesta Finance';inSet=1;
 if(h.textContent!==want)h.textContent=want;
 if(pria){if(h.getAttribute('data-vfi')!==curIcon())h.setAttribute('data-vfi',curIcon());h.style.cursor='pointer';applyTS(h);h.setAttribute('title','Ketuk untuk ganti ikon, warna & font');h.setAttribute('role','button');h.tabIndex=0}
 else{h.style.cursor='';clearTS(h);h.removeAttribute('title');h.removeAttribute('role');h.removeAttribute('tabindex')}
 inSet=0}catch(e){inSet=0}}
function iconSheet(){
 build();var o=document.createElement('div');o.className='qc-ov';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
 var cc=S.settings.diaryColor||'',cf=S.settings.diaryFont||'';
 o.innerHTML='<div class="qc-sh"><div class="qc-hd"><b>Tampilan judul</b><button type="button" class="qc-x" data-ic="x" aria-label="Tutup">✕</button></div><div class="qc-bd">'+
 '<div class="qc-pv" id="qcpvt">Financial Diary</div>'+
 '<h4 style="margin:10px 0 6px;font-size:13px">Ikon</h4><div class="qc-ig">'+DI.map(function(e){return '<button type="button" data-ic="'+e+'" class="'+(e===curIcon()?'on':'')+'">'+e+'</button>'}).join('')+'</div><div class="qc-row2" style="margin-top:8px"><input id="qcic" maxlength="8" placeholder="Emoji sendiri…"><button type="button" class="qc-save" style="margin:0;padding:9px" data-ic="custom">Pakai ikon</button></div>'+
 '<h4 style="margin:14px 0 6px;font-size:13px">Warna</h4><div class="qc-cols"><button type="button" data-co="" class="'+(cc?'':'on')+'" style="background:linear-gradient(135deg,#b8a64a,#2f8f6a)" aria-label="Warna bawaan"></button>'+COLS.map(function(c){return '<button type="button" data-co="'+c+'" class="'+(c===cc?'on':'')+'" style="background:'+c+'" aria-label="'+c+'"></button>'}).join('')+'<input type="color" id="qcco" value="'+(cc||'#f0b84a')+'" aria-label="Warna bebas"></div>'+
 '<h4 style="margin:14px 0 6px;font-size:13px">Font</h4><div class="qc-fonts">'+FONTS.map(function(f){return '<button type="button" data-fo="'+esc(f[1])+'" class="'+(f[1]===cf?'on':'')+'" style="font-family:'+(f[1]||'inherit').replace(/"/g,"'")+'">'+f[0]+'</button>'}).join('')+'</div>'+
 '<button type="button" class="qc-save" data-ic="x">Selesai</button></div></div>';
 document.body.appendChild(o);
 function prev(){var t=o.querySelector('#qcpvt'),c=S.settings.diaryColor,f=S.settings.diaryFont;t.style.color=c||'';t.style.fontFamily=f||'';t.setAttribute('data-i',curIcon())}
 function mark(){o.querySelectorAll('.qc-ig button').forEach(function(b){b.classList.toggle('on',b.dataset.ic===curIcon())});o.querySelectorAll('[data-co]').forEach(function(b){b.classList.toggle('on',b.dataset.co===(S.settings.diaryColor||''))});o.querySelectorAll('[data-fo]').forEach(function(b){b.classList.toggle('on',b.dataset.fo===(S.settings.diaryFont||''))});prev()}
 function done(){persist();setTitle();mark()}
 function pick(v){v=String(v||'').trim();if(!v)return;try{v=window.Intl&&Intl.Segmenter?Array.from(new Intl.Segmenter().segment(v)).slice(0,2).map(function(x){return x.segment}).join(''):Array.from(v).slice(0,2).join('')}catch(e){}S.settings.diaryIcon=v;done()}
 o.onclick=function(e){if(e.target===o)return o.remove();
  var b=e.target.closest('button');if(!b)return;
  if(b.dataset.co!==undefined){if(b.dataset.co)S.settings.diaryColor=b.dataset.co;else delete S.settings.diaryColor;done();return}
  if(b.dataset.fo!==undefined){if(b.dataset.fo)S.settings.diaryFont=b.dataset.fo;else delete S.settings.diaryFont;done();return}
  var k=b.dataset.ic;if(k===undefined)return;if(k==='x')o.remove();else if(k==='custom')pick(o.querySelector('#qcic').value);else pick(k)};
 o.querySelector('#qcco').oninput=function(e){S.settings.diaryColor=e.target.value;done()};
 prev();
}
document.addEventListener('click',function(e){var h=e.target.closest&&e.target.closest('header h1');if(h&&S.settings.mode==='pria')iconSheet()});
document.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&document.activeElement&&document.activeElement.matches&&document.activeElement.matches('header h1')&&S.settings.mode==='pria'){e.preventDefault();iconSheet()}});
if(typeof render==='function'){var _r=render;render=function(){var r=_r.apply(this,arguments);setTitle();return r}}
try{var hh=document.querySelector('header h1');if(hh)new MutationObserver(function(){if(!inSet)setTitle()}).observe(hh,{attributes:true,attributeFilter:['data-vfi'],childList:true,characterData:true,subtree:true})}catch(e){}
setTitle();
build();
})();

