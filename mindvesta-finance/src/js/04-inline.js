
/* ===== MODE PRIA / WANITA ===== */
const PU='#6d5a8a';
const IL={
gift:'<rect x="8" y="22" width="32" height="18" rx="3" fill="#7ec3f0"/><rect x="6" y="15" width="36" height="8" rx="3" fill="#f27ea0"/><path d="M24 15c-2-7-10-7-9-3 .6 3 5 3 9 3zM24 15c2-7 10-7 9-3-.6 3-5 3-9 3z" fill="#f27ea0"/><path d="M24 36c-5-3-7-6-5-8 2-1.5 4 0 5 2 1-2 3-3.5 5-2 2 2 0 5-5 8z" fill="#ffd1dc"/>',
bus:'<rect x="9" y="7" width="30" height="31" rx="5" fill="#f7d67a"/><rect x="13" y="11" width="22" height="11" rx="2" fill="#bfe3f7"/><path d="M13 27h22"/><circle cx="16" cy="32" r="2" fill="#6d5a8a"/><circle cx="32" cy="32" r="2" fill="#6d5a8a"/><path d="M14 38v4M34 38v4"/>',
beauty:'<path d="M12 6l8 22M22 6l-8 22"/><circle cx="12" cy="34" r="4" fill="#f27ea0"/><circle cx="22" cy="34" r="4" fill="#f27ea0"/><rect x="29" y="6" width="12" height="34" rx="3" fill="#cdb4e8"/><path d="M29 14h5M29 20h5M29 26h5M29 32h5"/>',
burger:'<path d="M8 22c0-8 7-12 16-12s16 4 16 12z" fill="#f2b04e"/><path d="M6 27h36" stroke="#7cc68b" stroke-width="4"/><rect x="8" y="30" width="32" height="4" rx="2" fill="#c0674a"/><path d="M8 36h32c0 4-3 6-6 6H14c-3 0-6-2-6-6z" fill="#f2b04e"/>',
house:'<path d="M10 22v18h28V22" fill="#fff1d6"/><path d="M5 25L24 8l19 17z" fill="#f2a15e"/><rect x="20" y="28" width="8" height="12" fill="#f27ea0"/>',
phone:'<rect x="13" y="5" width="22" height="38" rx="4" fill="#9fb4d9"/><rect x="16" y="9" width="16" height="26" rx="1" fill="#e5f1fb"/><circle cx="24" cy="39" r="1.5" fill="#6d5a8a"/>',
tax:'<circle cx="24" cy="14" r="9" fill="#f7c85c"/><path d="M24 9v10M27 11c-1-1.5-6-1.5-6 1.5s6 2 6 5-5 3-6 1.5"/><path d="M4 32h9l10 4h9c3 0 3 4 0 4H16l-3-2" fill="#ffd9c0"/><path d="M4 30v12"/>',
cheers:'<path d="M8 8h14l-2 12c-.6 4-9.4 4-10 0z" fill="#f7d67a"/><path d="M26 8h14l-2 12c-.6 4-9.4 4-10 0z" fill="#f7d67a"/><path d="M15 24v14M11 40h8M33 24v14M29 40h8"/>',
clothes:'<path d="M6 10h36"/><path d="M13 10l-6 18h12z" fill="#7ec3f0"/><path d="M33 10l-6 22h14z" fill="#f27ea0"/><path d="M8 36h.01M14 36h.01M30 38h.01M36 38h.01"/>',
glasses:'<rect x="4" y="17" width="17" height="13" rx="4" fill="#e0556f"/><rect x="27" y="17" width="17" height="13" rx="4" fill="#4aa3d8"/><path d="M21 22h6M4 21L2 14M44 21l2-7"/>',
table:'<path d="M13 22v-5h9v5z" fill="#f2a15e"/><path d="M17 17c-4-2-4-6-1-8 1 3 1 5 1 8zM17 17c1-3 5-5 8-3-1 3-4 4-8 3z" fill="#7cc68b"/><rect x="6" y="22" width="36" height="5" rx="2" fill="#e0a56a"/><path d="M11 27l-3 13M37 27l3 13M11 34h26"/><path d="M29 22v-5h8v5z" fill="#bfe3f7"/>',
medis:'<rect x="6" y="16" width="36" height="24" rx="4" fill="#f27ea0"/><path d="M18 16v-4h12v4"/><path d="M24 22v12M18 28h12" stroke="#fff"/>',
car:'<path d="M5 30l4-10c1-3 3-4 6-4h18c3 0 5 1 6 4l4 10v8H5z" fill="#f27ea0"/><path d="M12 21h24l2 7H10z" fill="#bfe3f7"/><circle cx="13" cy="34" r="3" fill="#fff1d6"/><circle cx="35" cy="34" r="3" fill="#fff1d6"/>',
monitor:'<rect x="5" y="8" width="38" height="26" rx="3" fill="#bfe3f7"/><path d="M5 28h38M18 40h12M24 34v6"/><circle cx="24" cy="18" r="4" fill="#fff"/>',
grad:'<path d="M24 10L4 20l20 10 20-10z" fill="#6d5a8a"/><path d="M12 25v8c0 3 6 6 12 6s12-3 12-6v-8" fill="#8a77ad"/><path d="M42 21v10" stroke="#f27ea0"/>',
baby:'<circle cx="24" cy="26" r="14" fill="#ffe3d0"/><path d="M20 12c2-4 7-4 8 0"/><circle cx="19" cy="26" r="1.2" fill="#6d5a8a"/><circle cx="29" cy="26" r="1.2" fill="#6d5a8a"/><path d="M21 32c2 2 4 2 6 0"/>',
travel:'<path d="M6 22c0-9 8-14 17-14s17 5 17 14z" fill="#7ec3f0"/><path d="M24 22v16"/><path d="M4 41h40" stroke="#f2a15e" stroke-width="4"/>',
book:'<path d="M5 10h16c2 0 3 2 3 2v28s-1-2-3-2H5z" fill="#fff1d6"/><path d="M43 10H27c-2 0-3 2-3 2v28s1-2 3-2h16z" fill="#f7d67a"/><path d="M29 34l10-14 3 2-10 14-4 1z" fill="#f27ea0"/>',
wallet:'<rect x="6" y="9" width="36" height="14" rx="4" fill="#7ec3f0"/><rect x="6" y="16" width="36" height="12" rx="3" fill="#f27ea0"/><rect x="6" y="25" width="36" height="14" rx="3" fill="#f7d67a"/>',
pie:'<circle cx="24" cy="24" r="12" stroke="#f27ea0" stroke-width="9" stroke-dasharray="22 54"/><circle cx="24" cy="24" r="12" stroke="#f7d67a" stroke-width="9" stroke-dasharray="18 58" stroke-dashoffset="-22"/><circle cx="24" cy="24" r="12" stroke="#7cc68b" stroke-width="9" stroke-dasharray="17 59" stroke-dashoffset="-40"/><circle cx="24" cy="24" r="12" stroke="#7ec3f0" stroke-width="9" stroke-dasharray="18 58" stroke-dashoffset="-57"/>',
more:'<rect x="6" y="8" width="36" height="32" rx="4" fill="#c58fa1"/><path d="M16 24h.01M24 24h.01M32 24h.01" stroke="#fff" stroke-width="4"/>',
mail:'<rect x="8" y="14" width="32" height="20" rx="9" fill="#9fb4d9"/><path d="M24 34v8M16 42h16"/><rect x="14" y="19" width="11" height="6" fill="#f27ea0"/>',
eye:'<path d="M3 24c5-9 13-13 21-13s16 4 21 13c-5 9-13 13-21 13S8 33 3 24z" fill="#9fd0e8"/><circle cx="24" cy="24" r="8" fill="#4aa3d8"/><circle cx="24" cy="24" r="3" fill="#6d5a8a"/>',
cal:'<rect x="6" y="10" width="36" height="32" rx="4" fill="#7ec3f0"/><rect x="6" y="10" width="36" height="9" fill="#9b6fc0"/><path d="M14 6v8M34 6v8M14 26h4M22 26h4M30 26h4M14 33h4M22 33h4M30 33h4" stroke="#fff"/>',
card:'<rect x="5" y="11" width="38" height="26" rx="4" fill="#7ec3f0"/><circle cx="19" cy="24" r="7" fill="#f27ea0"/><circle cx="28" cy="24" r="7" fill="#f7d67a" fill-opacity=".9"/>',
cash:'<rect x="4" y="12" width="40" height="24" rx="3" fill="#8fd1a0"/><circle cx="24" cy="24" r="6" fill="#e5f6ea"/><path d="M9 18h.01M39 30h.01"/>',
bank:'<rect x="6" y="14" width="15" height="28" fill="#9fb4d9"/><rect x="23" y="24" width="18" height="18" fill="#f2a1b5"/><path d="M10 20h.01M16 20h.01M10 27h.01M16 27h.01M10 34h.01M16 34h.01M29 30h.01M35 30h.01M29 36h.01M35 36h.01"/><path d="M12 14V8h3v6"/>',
person:'<circle cx="21" cy="14" r="8" fill="#ffe3d0"/><path d="M6 40c0-9 6-14 15-14s15 5 15 14z" fill="#7ec3f0"/><circle cx="37" cy="36" r="7" fill="#f7c85c"/>',
bag:'<path d="M18 9h12l-3 6c8 4 11 10 11 17 0 6-5 8-14 8S10 38 10 32c0-7 3-13 11-17z" fill="#f7d67a"/><path d="M24 22v14M27 25c-1-1.5-6-1.5-6 1.3s6 1.8 6 4.4-5 2.8-6 1.3"/>',
rice:'<path d="M8 24h32c0 9-6 15-16 15S8 33 8 24z" fill="#7ec3f0"/><path d="M12 24c2-8 6-10 12-10s10 2 12 10z" fill="#fff"/><path d="M30 8l-6 12M35 10l-6 12"/>',
coffee:'<path d="M9 16h24v12c0 6-5 10-12 10S9 34 9 28z" fill="#fff1d6"/><path d="M33 19h3c4 0 4 8 0 8h-3"/><path d="M15 6c-2 2 2 4 0 7M23 6c-2 2 2 4 0 7"/>',
fish:'<path d="M5 24c6-9 18-9 24 0-6 9-18 9-24 0z" fill="#9fb4d9"/><path d="M29 24l11-8v16z" fill="#7ec3f0"/><circle cx="13" cy="22" r="1.5" fill="#6d5a8a"/>',
icecream:'<path d="M14 22h20l-10 20z" fill="#f2c27a"/><circle cx="24" cy="15" r="9" fill="#f9b8c8"/>',
bread:'<path d="M7 20c0-6 8-10 17-10s17 4 17 10v18H7z" fill="#f2c27a"/><path d="M16 20v8M24 20v8M32 20v8"/>',
fries:'<path d="M11 18h26l-3 22H14z" fill="#e0556f"/><path d="M16 18v-8M22 18V7M28 18V9M33 18v-7" stroke="#f7c85c" stroke-width="3"/>',
pizza:'<path d="M5 12c13-4 25-4 38 0L24 42z" fill="#f2c27a"/><circle cx="19" cy="18" r="3" fill="#e0556f"/><circle cx="28" cy="22" r="3" fill="#e0556f"/>',
sushi:'<ellipse cx="24" cy="27" rx="14" ry="10" fill="#fff"/><ellipse cx="24" cy="22" rx="14" ry="8" fill="#f27ea0"/>',
cherry:'<circle cx="15" cy="33" r="8" fill="#e0556f"/><circle cx="33" cy="33" r="8" fill="#e0556f"/><path d="M15 25c2-8 8-14 15-15M33 25c0-6-2-10-3-15"/>',
bolt:'<path d="M27 4L10 26h12l-3 18 19-24H26z" fill="#f7d67a"/>',
heart:'<path d="M24 40C6 28 8 12 18 12c4 0 6 3 6 5 0-2 2-5 6-5 10 0 12 16-6 28z" fill="#f27ea0"/>',
plane:'<path d="M4 26l38-16-10 30-10-10-8 6v-10z" fill="#bfe3f7"/>',
shop:'<path d="M8 18h32l-3 22H11z" fill="#f2a15e"/><path d="M16 18l4-10M32 18l-4-10"/>',
drop:'<path d="M24 6C16 18 12 24 12 30a12 12 0 0024 0c0-6-4-12-12-24z" fill="#7ec3f0"/>',
grid:'<rect x="6" y="6" width="16" height="16" rx="4" fill="#f27ea0"/><rect x="26" y="6" width="16" height="16" rx="4" fill="#7ec3f0"/><rect x="6" y="26" width="16" height="16" rx="4" fill="#f7d67a"/><rect x="26" y="26" width="16" height="16" rx="4" fill="#8fd1a0"/>',
bike:'<circle cx="11" cy="32" r="8" fill="#fff1d6"/><circle cx="37" cy="32" r="8" fill="#fff1d6"/><path d="M11 32l8-16h11l7 16M19 16l9 16"/>'
};
const ICK=['burger','rice','coffee','fish','icecream','bread','fries','pizza','sushi','cherry','bus','car','bike','plane','house','phone','bolt','drop','shop','clothes','glasses','beauty','medis','grad','baby','gift','heart','tax','cheers','table','wallet','pie'];
const ik=(k,s=40)=>`<svg viewBox="0 0 48 48" width="${s}" height="${s}" fill="none" stroke="${PU}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IL[k]||IL.table}</svg>`;
const GL={
search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/>',
ud:'<path d="M8 9l4-4 4 4M8 15l4 4 4-4"/>',
x:'<path d="M5 5l14 14M19 5L5 19"/>',
ok:'<path d="M4 12l5 5L20 6"/>',
back:'<path d="M15 5l-7 7 7 7"/>',
dots:'<path d="M12 5h.01M12 12h.01M12 19h.01" stroke-width="3"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
bs:'<path d="M21 5H9l-6 7 6 7h12z"/><path d="M13 9l6 6M19 9l-6 6"/>',
up:'<path d="M6 14l6-6 6 6"/>',dn:'<path d="M6 10l6 6 6-6"/>',
cart:'<path d="M3 4h3l2.5 10h9L20 7H7" fill="currentColor"/><circle cx="9.5" cy="19" r="1.6" fill="currentColor"/><circle cx="17" cy="19" r="1.6" fill="currentColor"/>',
dollar:'<circle cx="12" cy="12" r="9" fill="currentColor" stroke="none"/><path d="M12 6v12M15 9c-1-1.5-6-1.5-6 1.2s6 1.6 6 4.2-5 2.7-6 1.2" stroke="#ee6495"/>',
wal:'<path d="M4 7h14a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2z" fill="currentColor"/><path d="M4 7l12-3v3"/><circle cx="16" cy="13.5" r="1.3" fill="#ee6495" stroke="none"/>',
bank:'<path d="M3 9l9-5 9 5z" fill="currentColor"/><path d="M5.5 11v7M9.5 11v7M14.5 11v7M18.5 11v7M3 20h18"/>',
bld:'<rect x="5" y="3" width="10" height="18" fill="currentColor"/><rect x="15" y="9" width="5" height="12" fill="currentColor"/>',
sort:'<path d="M4 7h16M4 12h11M4 17h6"/>',
dl:'<path d="M5 12h14M13 6l6 6-6 6" />'
};
const gl=(k,s=22)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${GL[k]}</svg>`;
const KW=[[/makan|dapur|diet/i,'burger'],[/kopi|jajan/i,'coffee'],[/transport|lalu/i,'bus'],[/pakaian|belanja/i,'clothes'],[/pajak|tagihan|utang/i,'tax'],[/listrik/i,'bolt'],[/sewa|rumah|perumahan/i,'house'],[/pulsa|internet|komunik/i,'phone'],[/sehat|medis|asuransi/i,'medis'],[/didik/i,'grad'],[/hibur|rekreasi/i,'glasses'],[/keluarga/i,'baby'],[/donasi|zakat|sosial/i,'cheers'],[/kendaraan|service|mobil/i,'car'],[/perawatan|cantik/i,'beauty'],[/usaha|operasional|jual|omset/i,'shop'],[/gaji/i,'wallet'],[/bonus|thr|hadiah|kembali/i,'gift'],[/invest|aset|dividen|bunga/i,'pie'],[/harian|lainnya/i,'table']];
const FI=()=>S.ficons||(S.ficons={});
const ckey=c=>FI()[c]||(KW.find(k=>k[0].test(c))||[0,ICK[hue(c)%ICK.length]])[1];
const SLC=['#f44336','#e91e63','#9c27b0','#673ab7','#3f51b5','#2196f3','#03a9f4','#00bcd4','#009688','#4caf50','#8bc34a','#cddc39'];
const DS=['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
const dl2=k=>{const[y,m,d]=k.split('-').map(Number);return DS[new Date(y,m-1,d).getDay()]+', '+d+'/'+m};
const books=()=>{let b=S.settings.books;if(!Array.isArray(b)||!b.length)b=S.settings.books=['Financial Diary'];const k=b.indexOf('buku bawaan');if(k>-1){if(b.includes('Financial Diary'))b.splice(k,1);else b[k]='Financial Diary';(S.transactions||[]).forEach(t=>{if(t.book==='buku bawaan')t.book='Financial Diary'});if(S.settings.cb==='buku bawaan')S.settings.cb='Financial Diary'}return b};
const bkc=()=>{const b=books();return b.includes(S.settings.cb)?S.settings.cb:b[0]};
const bkOf=t=>t.book||books()[0];
const fM=m=>inM(m).filter(t=>bkOf(t)===bkc());
const m$=v=>S.settings.hide?'••••':rp(v);
const hs=s=>String(s??'').split(/(#[^\s#]+)/).map((p,i)=>i%2?`<span class="hs">${esc(p)}</span>`:esc(p)).join('');
let fpo=0,fpT=0,fpA=0,ftab='buku',fsub='',fq='',fs=0,fcl=0,fall=0,fan='expense',E=null,Dt=null,NC=null,pko=0;

/* ---------- Buku ---------- */
function fList(){
  const all=sorted(fM(month));let a=all;
  if(fq)a=a.filter(t=>(t.note+' '+t.category+' '+t.wallet).toLowerCase().includes(fq.toLowerCase()));
  if(!fall)a=a.slice(0,25);
  if(!a.length)return '<p class="em2">Belum ada transaksi. Tekan pensil untuk mencatat.</p>';
  const ex={};all.filter(t=>t.type==='expense').forEach(t=>ex[td(t)]=(ex[td(t)]||0)+(+t.amount||0));
  let last='',h='';
  a.forEach(t=>{const d=td(t);if(d!==last){if(last)h+='</div>';h+=`<div class="fg"><div class="fd"><span>▾ &nbsp;${dl2(d)}</span><span>Pengeluaran:${m$(ex[d]||0)}</span></div>`;last=d}
    const tr=t.type==='transfer',c=t.type==='income'?'gn':tr?'':'rd',sg=t.type==='income'?'+':tr?'':'-';
    h+=`<button class="fr" data-a="fdet" data-i="${t.id}"><span class="ft">${ik(tr?'card':ckey(t.category),40)}</span><span class="fx"><b>${esc(tr?'transfer':t.category)}</b><i>${t.note?hs(t.note):'diri sendiri'}${t.party?' · '+esc(t.party):''}${pl(t).length?' · '+pl(t).length+' foto':''}${t.chk==='0'?' · belum dicentang':''}</i></span><span class="fam ${c}">${sg}${m$(t.amount)}<i>${esc(tr?t.wallet+'→'+t.toWallet:t.wallet)}</i></span></button>`});
  return h+'</div>';
}
function fHome(){
  const a=fM(month),i=sum(a,'income'),o=sum(a,'expense'),n=i-o,[y,mm]=month.split('-'),nd=new Date(+y,+mm,0).getDate(),bs=books(),cur=bkc(),BI=['book','baby','travel','car','house'];
  const by={};a.filter(t=>t.type==='expense').forEach(t=>by[t.category]=(by[t.category]||0)+(+t.amount||0));
  const dly=Array.from({length:nd},(_,j)=>sum(a.filter(t=>td(t)===`${month}-${String(j+1).padStart(2,'0')}`),'expense')),mx=Math.max(1,...dly);
  const pts=dly.map((v,j)=>`${(j*130/Math.max(1,nd-1)).toFixed(1)},${(34-v/mx*30).toFixed(1)}`).join('L');
  const B=Object.entries(S.budgets),tb=B.reduce((s,x)=>s+(+x[1]||0),0),ts=B.reduce((s,x)=>s+(by[x[0]]||0),0),pc=tb?Math.round(ts/tb*100):0;
  const nowm=iso().slice(0,7),left=month===nowm?nd-new Date().getDate()+1:month>nowm?nd:0;
  const bud=B.length?`<button class="fc fbd" data-a="bul" style="padding:12px 16px 14px"><div class="fbt"><span style="position:absolute;left:-4px;top:-18px">${ik('pie',64)}</span><b style="margin-left:60px">Bulanan</b><span class="fbadge rd" style="font-size:11px;padding:1px 8px">${B.length} anggaran</span><span class="fbadge rd" style="font-size:11px;padding:1px 8px">${left} hari lagi</span><span class="fbadge rd" style="font-size:11px;padding:1px 8px">Jatah/hari ${left?shn(Math.max(0,(tb-ts)/left)):'0'}</span></div><div class="fbr"><i style="width:${Math.max(Math.min(100,pc),pc?24:0)}%"></i><span><span style="color:#fff">${rp(ts)}</span><span style="color:${pc>50?'#fff':'#555'}">${pc}%</span><span>${rp(tb)}</span></span></div></button><div class="fdots"><i></i><i></i><i></i></div>`
    :`<button class="fc fbd" data-a="budadd" style="color:#ee6495;font-weight:700;text-align:center!important">+ Atur anggaran bulanan</button>`;
  const goals=S.goals.map((g,j)=>{const p=g.target?Math.min(100,Math.round(g.current/g.target*100)):0;return `<button class="fgl" data-a="goaledit" data-i="${g.id}"><div class="gi">${ik(['car','monitor','grad','house','plane'][j%5],44)}</div><span>${esc(g.name)}</span><div class="fbr"><i style="width:${Math.max(p,12)}%"></i><span style="justify-content:center"><span style="color:${p>45?'#fff':'#555'}">${p}%</span></span></div></button>`}).join('');
  return `<div class="fh"><div class="fr1"><button class="fic" data-a="fsrch" aria-label="Cari">${gl('search',24)}</button><span style="flex:1"></span><button class="fic" data-a="fcl" aria-label="Ciutkan">${gl('ud',22)}</button><button class="fpill" data-a="fall">${ik('card',28)}Detail</button><button class="fic" data-a="fmonth" aria-label="Pilih bulan">${ik('cal',30)}</button></div>
  <div class="ftl" data-a="frename">${esc(cur)}</div>
  <div class="fbs">${bs.map((b,j)=>`<button class="fbk ${b===cur?'on':''}" data-a="fbk" data-i="${esc(b)}">${ik(BI[j%5],40)}<span>${esc(b)}</span></button>`).join('')}<button class="fbk" data-a="fnewbk"><span style="font-size:30px;line-height:40px">🌷</span><span>Diary baru</span></button><button class="fbk" data-a="fdupbk"><span style="font-size:30px;line-height:40px">⧉</span><span>Duplikat</span></button></div></div>
  <div class="fbody">
  ${fs?`<div class="fs"><input id="fsq" type="search" placeholder="Cari catatan, kategori, dompet" value="${esc(fq)}"></div>`:''}
  <button class="fsimp" data-a="gs"><span class="fsi">🧸</span><span><b>Mode Simpel ✨</b><small>Mutasi · target · split bill</small></span><span class="fgo">›</span></button>
  <div class="fc fsum">
   <div class="fmn"><button data-a="mp" aria-label="Bulan sebelumnya">‹</button><b data-a="fmonth">${+mm}/${y} <span style="color:#ee6495;font-size:12px">▼</span></b><button data-a="mx" aria-label="Bulan berikutnya">›</button><span style="flex:1"></span><button data-a="fhide" style="padding:0 0 0 12px">${ik('eye',40)}</button></div>
   <div class="fsr"><div><span class="fbadge ${n<0?'rd':''}">${n<0?'Boros nih':'Rajin menabung'}</span><div class="fbig ${n<0?'rd':''}">${m$(n)}</div></div><div style="text-align:right"><svg viewBox="0 0 130 38" width="130" height="38" fill="none" stroke="#ff8fb8" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M${pts}"/></svg><div class="fgr">Rata-rata masuk per hari<br><b>${m$(i/nd)}</b></div></div></div>
   <div class="fro"><span>Pengeluaran <b class="rd">${m$(o)}</b></span><span>Penghasilan <b class="gn">${m$(i)}</b></span></div></div>
  ${fQS()}${fAl()}<button class="fcol" data-a="fcl">${fcl?'Perluas':'Ciutkan'} <span style="font-size:11px">${fcl?'▼':'▲'}</span></button>
  ${fcl?'':bud+`<div class="fgs">${goals}<button class="fgl add" data-a="goaladd">+ Tujuan<br>tabungan</button></div>`}
  <div id="flst">${fList()}</div></div>`;
}


/* ---------- Fitur (semua fitur mode Pria) ---------- */
const PEN='<svg viewBox="0 0 48 48" width="44" height="44"><path d="M10 36l22-24 6 5-22 24-9 3z" fill="#ee6495" stroke="#6d5a8a" stroke-width="2.2" stroke-linejoin="round"/><path d="M30 14l6 5" stroke="#6d5a8a" stroke-width="2.2"/></svg>';
const XT={home:'Ringkasan Lengkap',trx:'Semua Transaksi',bud:'Anggaran & Saran',wlt:'Aset & Utang',more:'Pengaturan Lengkap',diag:'Diagram',kal:'Kalender',ring:'Ringkasan Bulanan',langg:'Langganan',jad:'Pembayaran Terjadwal',wawas:'Wawasan',tema:'Kustomisasi'};
const FT=[
['Catat & Riwayat',[['fadd','pencil','Catat Transaksi','Pengeluaran, pemasukan, pindah saldo','tambah catat input struk foto'],['fx:trx','book','Semua Transaksi','Cari, filter, foto, ekspor CSV','riwayat cari filter ditandai foto csv grafik aset'],['fx:kal','cal','Kalender','Lihat transaksi per tanggal','kalender tanggal harian'],['fx:jad','bolt','Pembayaran Terjadwal','Tagihan berulang & pengingat','jadwal berulang tagihan pengingat cicilan'],['fx:langg','mail','Langganan','Netflix, dll per bulan/tahun','langganan subscription bulanan tahunan']]],
['Anggaran & Target',[['bul','pie','Anggaran Bulanan','Terpakai vs batas tiap kategori','anggaran budget batas bulanan'],['fx:bud','tax','Mode Saran & Anggaran','Saran dari gaji, mingguan, tahunan, target','saran gaji mingguan tahunan target tabungan kebutuhan'],['goaladd','car','Target Tabungan Baru','Buat tujuan menabung','target tujuan tabungan dana darurat']]],
['Aset, Utang & Dompet',[['fgo:dompet','wallet','Dompet & Rekening','Saldo tiap dompet','dompet rekening saldo kas bank'],['fx:wlt','bank','Aset, Utang & Piutang','Pelunasan utang, total kekayaan','utang piutang aset pelunasan kekayaan emas properti'],['debtadd','tax','Tambah Utang','Catat utang / piutang','utang pinjaman cicilan'],['assetadd','house','Tambah Aset','Emas, properti, investasi','aset emas properti saham']]],
['Analisis',[['fgo:analisis','pie','Analisis Kategori & Tren','Donat, tren harian','analisis donat tren kategori'],['fx:diag','pie','Diagram','Diagram pengeluaran / pemasukan','diagram grafik donat'],['fx:wawas','eye','Wawasan','Per hari, akumulasi, hari tersibuk','wawasan insight akumulasi'],['fx:ring','table','Ringkasan Bulanan','Bulan terbaik & perbandingan','ringkasan bulan terbaik'],['fx:home','grid','Ringkasan Lengkap','Kekayaan bersih, peringatan, arus kas','beranda kekayaan bersih peringatan arus kas']]],
['Pengaturan',[['fx:tema','glasses','Kustomisasi','Ikon emoji & warna','tema ikon emoji aksen warna'],['ncat','cherry','Kategori Baru','Tambah kategori + ikon','kategori baru ikon'],['fx:more','medis','Pengaturan Lengkap','Hapus kategori, cadangan, cara pakai','pengaturan kategori hapus cadangan ekspor impor cara pakai'],['gs','cherry','Mode Simpel ✨','Ringkas & imut: mutasi, split bill','simpel simple mutasi split bill target lencana'],['pick','glasses','Ganti Mode','Pria / Wanita','mode pria wanita tampilan']]]];
let fqf='';
function fGrid(){
  const q=fqf.trim().toLowerCase();let h='';
  FT.forEach(([g,L])=>{const l=L.filter(x=>!q||(x[2]+' '+x[3]+' '+x[4]+' '+g).toLowerCase().includes(q));if(!l.length)return;
    h+=`<div class="fgh">${g}</div><div class="fgt">${l.map(([a,ic,t,d])=>{const[ac,ar]=a.split(':');return `<button class="fti" data-a="${ac==='fx'||ac==='fgo'?ac:a}" data-i="${ar||''}">${ic==='pencil'?'<svg viewBox="0 0 48 48" width="40" height="40"><path d="M10 36l22-24 6 5-22 24-9 3z" fill="#ee6495" stroke="#6d5a8a" stroke-width="2.2" stroke-linejoin="round"/></svg>':ik(ic,40)}<b>${t}</b><span>${d}</span></button>`}).join('')}</div>`});
  return h||'<p class="em2">Tidak ada fitur yang cocok. Coba kata lain, misalnya "utang" atau "kalender".</p>';
}
function fFitur(){
  return `<div class="fdh"><div class="fr1"><button class="fic" data-a="fgo" data-i="buku">${ik('book',30)}</button></div><h1 style="margin-bottom:10px">Fitur</h1><input id="fqf" type="search" placeholder="Cari fitur: utang, kalender, cadangan..." value="${esc(fqf)}" style="border-radius:16px;border:0"></div><div style="padding:6px 14px 0" id="fgrid">${fGrid()}</div>`;
}
function fX(k){
  let body;
  if(V[k]){hm=0;body=V[k]()}
  else{hm=1;try{body=(['diag','kal','wawas'].includes(k)?`<div class="mn"><button data-a="mp" aria-label="Bulan sebelumnya">‹</button><b>${ml(month)}</b><button data-a="mx" aria-label="Bulan berikutnya">›</button></div>`:'')+SV[k]()}finally{hm=0}}
  return `<div class="fbh"><button class="fic" data-a="fback" aria-label="Kembali">${gl('back',24)}</button><span style="flex:1;margin-left:10px">${XT[k]||k}</span><button class="fic" data-a="fgo" data-i="fitur" aria-label="Semua fitur">${ik('grid',28)}</button></div><div class="xm">${body}</div>`;
}
function fQS(){
  return `<div class="fqs">${[['fx:kal','cal','Kalender'],['bul','pie','Anggaran'],['fx:diag','pie','Diagram'],['fx:langg','mail','Langganan'],['fx:jad','bolt','Terjadwal'],['fx:wlt','bank','Utang & Aset'],['fx:trx','book','Foto & CSV'],['fgo:fitur','grid','Semua fitur']].map(([a,ic,l])=>{const[ac,ar]=a.split(':');return `<button data-a="${ac==='fx'||ac==='fgo'?ac:a}" data-i="${ar||''}">${ik(ic,26)}<span>${l}</span></button>`}).join('')}</div>`;
}
function fAl(){
  const by=spentBy(month),r=[];
  if(month===iso().slice(0,7))Object.entries(S.budgets).forEach(([c,l])=>{const s=by[c]||0;if(l&&s>=l*.8)r.push(`<section class="c al ${s>l?'x':''}">${s>l?'Anggaran':'Hampir habis:'} <b>${esc(c)}</b> ${s>l?'terlampaui '+rp(s-l):'terpakai '+Math.round(s/l*100)+'%'}</section>`)});
  S.activeDebts.filter(d=>d.principal>0&&d.dueISO&&days(d.dueISO)<=7).forEach(d=>{const k=days(d.dueISO);r.push(`<section class="c al ${k<0?'x':''}">Utang <b>${esc(d.title)}</b> ${k<0?'terlambat '+-k+' hari':k===0?'jatuh tempo hari ini':'jatuh tempo '+k+' hari lagi'}</section>`)});
  return r.concat(dueAlerts()).join('');
}

/* ---------- Dompet ---------- */
const wg=w=>/kredit|credit|visa|master|card|kartu/i.test(w)?'k':/kas|tunai|cash|dompet/i.test(w)?'t':'d';
function fWal(){
  const B=S.wallets.map(w=>[w,bal(w)]),pos=B.reduce((s,x)=>s+Math.max(0,x[1]),0),neg=B.reduce((s,x)=>s+Math.max(0,-x[1]),0),A=pos+assets()+owedMe(),H=neg+debts();
  const G=[['k','Kartu Kredit','card'],['t','Tunai','cash'],['d','Kartu Deposit','bank']].map(([k,l,ic])=>{const L=B.filter(x=>wg(x[0])===k);if(!L.length)return '';const sm2=L.reduce((s,x)=>s+(k==='k'?Math.max(0,-x[1]):Math.max(0,x[1])),0);
    return `<div class="fwg"><div class="gh"><span>${l}</span><span>${k==='k'?'Hutang':'Aset'}: ${m$(sm2)}</span></div>${L.map(([w,v])=>`<button class="fwr" data-a="walletedit" data-i="${esc(w)}">${ik(ic,52)}<span class="nm">${esc(w)}</span><span class="am2">${v<0?'-':''}${m$(Math.abs(v))}<i>${window.VFC?VFC.code:'IDR'}(1.0)</i></span></button>`).join('')}</div>`}).join('');
  const AS=S.assets.length?`<div class="fwg"><div class="gh"><span>Aset Lain</span><span>Aset: ${m$(assets())}</span></div>${S.assets.map(x=>`<button class="fwr" data-a="assetedit" data-i="${x.id}">${ik('pie',52)}<span class="nm">${esc(x.name)}<i style="display:block;font-style:normal;font-size:12px;color:#9a9299">${esc(x.type)}</i></span><span class="am2">${m$(x.value)}</span></button>`).join('')}</div>`:'';
  const DB=S.activeDebts.length?`<div class="fwg"><div class="gh"><span>Utang & Piutang</span><span>Hutang: ${m$(debts())}</span></div>${S.activeDebts.map(d=>`<button class="fwr" data-a="debtedit" data-i="${d.id}">${ik('tax',52)}<span class="nm">${esc(d.title)}</span><span class="am2 ${d.dir==='owed'?'gn':'rd'}">${d.dir==='owed'?'':'-'}${m$(d.principal)}<i>${d.dir==='owed'?'Piutang':'Utang'}</i></span></button>`).join('')}</div>`:'';
  return `<div class="fdh"><div class="fr1"><button class="fic" data-a="fgo" data-i="buku">${ik('book',30)}</button><span style="flex:1"></span><button class="fic" data-a="fhide">${S.settings.hide?'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M3 12c4-7 14-7 18 0-4 7-14 7-18 0zM4 4l16 16"/></svg>':'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M3 12c4-7 14-7 18 0-4 7-14 7-18 0z"/><circle cx="12" cy="12" r="3"/></svg>'}</button><button class="fic" data-a="walletadd" aria-label="Tambah dompet">${gl('dollar',26)}</button><button class="fic" data-a="debtadd" aria-label="Tambah utang">${gl('sort',24)}</button></div>
  <h1>Dompet</h1><div style="font-size:14px;opacity:.9">Aset Bersih</div><div class="big">${m$(A-H)}</div><div class="sm"><div>Aset<b>${m$(A)}</b></div><div>Hutang<b>${m$(H)}</b></div></div></div>${G}${AS}${DB}
  <div style="display:flex;gap:10px;margin:14px"><button class="b" style="flex:1;color:#ee6495;border-color:#f3cbd9" data-a="walletadd">+ Dompet</button><button class="b" style="flex:1;color:#ee6495;border-color:#f3cbd9" data-a="assetadd">+ Aset</button></div>`;
}

/* ---------- Analisis ---------- */
function fdonut(L,title,sub){
  const T=L.reduce((s,x)=>s+x[1],0);if(!T)return '<p class="em2">Belum ada data bulan ini.</p>';
  const cx=140,cy=140,R=92,r=56,rm=(R+r)/2,C=2*Math.PI*rm;let acc=0,arcs='',lab='',bub='';
  L.forEach((x,j)=>{const f=x[1]/T,l=f*C,col=SLC[j%SLC.length],mid=(acc+f/2)*2*Math.PI;
    arcs+=`<circle cx="${cx}" cy="${cy}" r="${rm}" fill="none" stroke="${col}" stroke-width="${R-r}" stroke-dasharray="${Math.max(l,0)} ${C-l}" stroke-dashoffset="${-acc*C}" transform="rotate(0 ${cx} ${cy})"/>`;
    const p=Math.round(f*100);
    if(p>=4)lab+=`<text x="${cx+(rm-9)*Math.cos(mid)}" y="${cy+(rm-9)*Math.sin(mid)+4}" text-anchor="middle" style="fill:#fff;font-size:12px;font-weight:700">${p}%</text>`;
    else if(p>=2)lab+=`<text x="${cx+(rm-9)*Math.cos(mid)}" y="${cy+(rm-9)*Math.sin(mid)+3}" text-anchor="middle" style="fill:#fff;font-size:10px;font-weight:700">${p}%</text>`;
    if(f>=.015){const bx=cx+(R+7)*Math.cos(mid),by=cy+(R+7)*Math.sin(mid);bub+=`<g style="filter:drop-shadow(0 2px 3px #0004)"><circle cx="${bx}" cy="${by}" r="17" fill="#fff" stroke="${col}" stroke-width="2.5"/><svg x="${bx-12}" y="${by-12}" width="24" height="24" viewBox="0 0 48 48" fill="none" stroke="${PU}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${IL[x[2]]||IL.table}</svg></g>`}
    acc+=f});
  return `<svg viewBox="0 0 280 280" width="100%" style="max-width:340px;display:block;margin:6px auto 0" role="img" aria-label="Diagram">${arcs}${lab}<text x="${cx}" y="${cy-4}" text-anchor="middle" style="fill:#444;font-size:13px">${esc(title)}</text><text x="${cx}" y="${cy+16}" text-anchor="middle" style="fill:#33303a;font-size:14px">${S.settings.hide?'••••':sub}</text>${bub}</svg>`;
}
function fTren(){
  const a=fM(month),[y,mm]=month.split('-'),nd=new Date(+y,+mm,0).getDate(),I=[],O=[];
  for(let d=1;d<=nd;d++){const k=`${month}-${String(d).padStart(2,'0')}`,x=a.filter(t=>td(t)===k);I.push(sum(x,'income'));O.push(sum(x,'expense'))}
  const mx=Math.max(1,...I,...O),p=Math.pow(10,Math.floor(Math.log10(mx))),N=Math.ceil(mx/p)*p;
  const X=j=>40+j*(310/Math.max(1,nd-1)),Y=v=>196-v/N*186,ln=A=>A.map((v,j)=>`${X(j).toFixed(1)},${Y(v).toFixed(1)}`).join('L');
  let g='';[0,.5,1].forEach(f=>g+=`<path d="M40 ${Y(N*f)}H350" stroke="#fff" stroke-opacity=".28"/><text x="36" y="${Y(N*f)+4}" text-anchor="end" style="fill:#fff;font-size:10px">${new Intl.NumberFormat('id-ID').format(Math.round(N*f))}</text>`);
  for(let j=0;j<nd;j++)g+=`<path d="M${X(j)} 10V196" stroke="#fff" stroke-opacity=".12"/>`;
  for(let d=1;d<=nd;d+=5)g+=`<text x="${X(d-1)}" y="214" text-anchor="middle" style="fill:#fff;font-size:10px;font-weight:700">${d}/${+mm}</text>`;
  const pv=sm(month,-1),pnd=new Date(+pv.slice(0,4),+pv.slice(5),0).getDate(),pi=sum(fM(pv),'income')/pnd,po=sum(fM(pv),'expense')/pnd,ai=sum(a,'income')/nd,ao=sum(a,'expense')/nd;
  const ch=(c,p0)=>p0?` ${c>=p0?'+':''}${((c-p0)/p0*100).toFixed(1)}%`:'';
  const rows=[];for(let d=nd;d>=1;d--)if(I[d-1]||O[d-1])rows.push([d,I[d-1],O[d-1]]);
  return `<div class="fh2"><div class="fr1"><button class="fic" data-a="fgo" data-i="buku">${ik('book',30)}</button><div class="tt2"><button data-a="mp" style="color:#fff">${gl('back',18)}</button><span data-a="fmonth">${+mm}/${y} ▾</span><button data-a="mx" style="color:#fff;transform:scaleX(-1)">${gl('back',18)}</button></div><span style="width:38px"></span></div>${fTabs()}
  <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:10px;font-size:12px;font-weight:700"><span style="background:#ffffff30;border-radius:99px;padding:6px 12px;white-space:nowrap;color:#a8f5a8">▬ Penghasilan ${shn(ai)}/hr${ch(ai,pi)}</span><span style="background:#ffffff26;border-radius:99px;padding:6px 12px;white-space:nowrap;color:#ffd0dc">▬ Pengeluaran ${shn(ao)}/hr${ch(ao,po)}</span></div></div>
  <div class="ftc"><svg viewBox="0 0 360 222">${g}<path d="M${ln(O)}L${X(nd-1)},196L40,196Z" fill="#fff" fill-opacity=".2"/><path d="M${ln(O)}" fill="none" stroke="#ffd0dc" stroke-width="1.5"/><path d="M${ln(I)}" fill="none" stroke="#7ef08a" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/></svg></div>
  <div class="ftb h"><span>Tanggal</span><span>Penghasilan</span><span>Pengeluaran</span><span>Total</span></div>
  <div class="ftb gr"><span style="display:flex;align-items:center;gap:8px;color:#4aa3a8"><b style="font-size:30px;color:#4aa3a8;line-height:1">Σ</b> Total</span><span>${m$(sum(a,'income'))}</span><span>${m$(sum(a,'expense'))}</span><span class="${sum(a,'income')-sum(a,'expense')<0?'rd':'gn'}" style="font-weight:700">${m$(sum(a,'income')-sum(a,'expense'))}</span></div>
  ${rows.map(([d,i,o])=>`<div class="ftb gr"><span style="display:flex;align-items:center;gap:8px;color:#33303a">${ik('cal',40)}${d}/${+mm}</span><span>${m$(i)}</span><span>${m$(o)}</span><span class="${i-o<0?'rd':'gn'}" style="font-weight:700">${i-o<0?'-':''}${m$(Math.abs(i-o))}</span></div>`).join('')||'<p class="em2">Belum ada transaksi.</p>'}`;
}
const fTabs=()=>`<div class="ftabs">${[['expense','cart','Pengeluaran'],['income','dollar','Penghasilan'],['akun','wal','Akun'],['tren','bank','Tren'],['aset','bld','Aset']].map(([k,ic,l])=>`<button data-a="fan" data-i="${k}" class="${fan===k?'on':''}">${gl(ic,22)}${fan===k?l:''}</button>`).join('')}</div>`;
function fAn(){
  if(fan==='tren')return fTren();
  const [y,mm]=month.split('-');let L=[],tt='Pengeluaran',add='';
  if(fan==='expense'||fan==='income'){tt=fan==='expense'?'Pengeluaran':'Penghasilan';const by={};fM(month).filter(t=>t.type===fan).forEach(t=>by[t.category]=(by[t.category]||0)+(+t.amount||0));L=Object.entries(by).sort((a,b)=>b[1]-a[1]).map(([c,v])=>[c,v,ckey(c)])}
  else if(fan==='akun'){tt='Akun';L=S.wallets.map(w=>[w,Math.max(0,bal(w)),wg(w)==='k'?'card':wg(w)==='t'?'cash':'bank']).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1])}
  else{tt='Aset';L=S.assets.map(x=>[x.name,+x.value||0,ckey(x.type)]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]);add='<button class="fch" data-a="assetadd" style="margin-top:8px">+ Aset</button>'}
  const T=L.reduce((s,x)=>s+x[1],0);
  return `<div class="fh2"><div class="fr1"><button class="fic" data-a="fgo" data-i="buku">${ik('book',30)}</button><div class="tt2"><button data-a="mp" style="color:#fff">${gl('back',18)}</button><span data-a="fmonth">${+mm}/${y} ▾</span><button data-a="mx" style="color:#fff;transform:scaleX(-1)">${gl('back',18)}</button></div><span style="width:38px"></span></div>${fTabs()}</div>
  <div class="fchip">Oleh Kategori <span style="color:#ee6495;font-size:11px">▼</span></div>${fdonut(L,tt,rp(T))}${add}
  <div style="border-top:1px solid #f3eaee;margin-top:8px;padding-top:6px">${L.map(x=>`<${fan==='expense'||fan==='income'?'button class="fli bt" data-a="fcat" data-i="'+esc(x[0])+'"':'div class="fli"'}><span>${ik(x[2],38)}</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(x[0])}</span><span>${Math.round(x[1]/T*100)}%</span><span>${m$(x[1])}</span></${fan==='expense'||fan==='income'?'button':'div'}>`).join('')}</div>`;
}

/* ---------- Bulanan ---------- */
function fBul(){
  const [y,mm]=month.split('-'),nd=new Date(+y,+mm,0).getDate(),by={};
  fM(month).filter(t=>t.type==='expense').forEach(t=>by[t.category]=(by[t.category]||0)+(+t.amount||0));
  const B=Object.entries(S.budgets),tb=B.reduce((s,x)=>s+(+x[1]||0),0),ts=B.reduce((s,x)=>s+(by[x[0]]||0),0),pc=tb?Math.round(ts/tb*100):0,nowm=iso().slice(0,7),left=month===nowm?nd-new Date().getDate()+1:month>nowm?nd:0;
  const R=46,C=2*Math.PI*R;
  return `<div class="fbh"><button class="fic" data-a="fback">${gl('x',24)}</button><span>Bulanan</span><button class="fic" data-a="budadd" aria-label="Tambah anggaran">${gl('dots',22)}</button></div>
  <div class="fbc"><h3>Bulanan <span>Bulanan</span></h3><p>Periode Total:1/${+mm}/${y}-Permanen</p><div class="ri">${ik('pie',46)}Anggaran </div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin:22px 4px 0;color:#ee6495;font-size:20px"><button data-a="mp">‹</button><span style="color:#444;font-size:15px">1/${+mm}/${y} - ${nd}/${+mm}/${y}</span><button data-a="mx">›</button></div>
  <div class="fdn"><svg viewBox="0 0 120 120" width="132" height="132"><circle cx="60" cy="60" r="${R}" fill="none" stroke="#fde0ea" stroke-width="18"/><circle cx="60" cy="60" r="${R}" fill="none" stroke="#ee6495" stroke-width="18" stroke-dasharray="${Math.min(1,tb?ts/tb:0)*C} ${C}" transform="rotate(-90 60 60)" stroke-linecap="butt"/></svg><b>${pc}%</b></div>
  <div class="fbm">${m$(ts).replace('Rp ','')} / ${m$(tb).replace('Rp ','')}</div><div class="fbb"><span>${left} hari lagi</span><span>Jatah/hari ${left?shn(Math.max(0,(tb-ts)/left)):'0'}</span></div></div>
  <div class="fkh">${ik('pie',26)}Kategori (${B.length})<em>OR</em></div><div class="fkl">${B.map(([c,l])=>{const s=by[c]||0,p=l?Math.round(s/l*100):0,rem=l-s;return `<button class="fkr" data-a="budedit" data-i="${esc(c)}"><span class="nm">${ik(ckey(c),40)}<span>${esc(c)}<i>${new Intl.NumberFormat('en-US').format(l)}</i></span></span><div class="fbr"><i style="width:${Math.max(Math.min(100,p),s?22:0)}%"></i><span><span style="color:#fff">${rp(s)}</span><span style="color:${p>55?'#fff':'#555'}">${p}%</span><span style="color:${rem<0?'#e5383b':'#555'}">${rem<0?'-':''}${rp(Math.abs(rem))}</span></span></div><span class="fcn">▸</span></button>`}).join('')||'<p class="em2">Belum ada anggaran. Tekan ⋮ untuk menambah.</p>'}</div><div style="height:30px"></div>`;
}

/* ---------- Kategori baru ---------- */
function fNew(){
  return `<div class="fbh"><button class="fic" data-a="fback">${gl('back',24)}</button><span style="flex:1;margin-left:10px">Kategori Baru</span><button class="fic" data-a="nsave" aria-label="Simpan">${gl('ok',24)}</button></div>
  <div class="fnc"><div class="fnn">${ik(NC.i,58)}<input id="ncn" placeholder="Nama Kategori" value="${esc(NC.n)}" autocomplete="off"></div>
  <div style="display:flex;justify-content:space-between;padding:10px 14px;color:#8a8f99;font-size:15px"><span>Grup Kategori</span><span style="color:#ee6495">${gl('sort',20)}</span></div>
  <div style="display:flex;gap:8px;padding:0 0 10px"><button class="fch" data-a="nty" data-i="expense" style="${NC.t==='expense'?'':'background:#fdeef3;color:#ee6495'}">${NC.t==='expense'?gl('ok',16):''} Belum Dikelompokkan</button><button class="fch" data-a="nty" data-i="income" style="margin:0;${NC.t==='income'?'':'background:#fdeef3;color:#ee6495'}">Pemasukan</button></div>
  <div class="fgp">Makanan</div><div class="fng">${ICK.slice(0,10).map(k=>`<button class="${NC.i===k?'on':''}" data-a="nic" data-i="${k}">${ik(k,48)}</button>`).join('')}</div>
  <div class="fgp">Lainnya</div><div class="fng">${ICK.slice(10).map(k=>`<button class="${NC.i===k?'on':''}" data-a="nic" data-i="${k}">${ik(k,48)}</button>`).join('')}</div></div>`;
}

/* ---------- Lebih ---------- */
function fMore(){
  const it=[['ncat','pie','Kategori Baru','Tambah kategori & ikon'],['goaladd','car','Tujuan Tabungan','Tambah target tabungan'],['walletadd','cash','Dompet Baru','Tambah dompet / rekening'],['debtadd','tax','Utang Baru','Catat utang & piutang'],['budadd','pie','Anggaran Baru','Batas pengeluaran bulanan'],['fnewbk','book','Buku Baru','Pisahkan catatan per buku'],['fhide','eye',S.settings.hide?'Tampilkan Jumlah':'Sembunyikan Jumlah',''],['exp','bank','Ekspor JSON','Cadangan data'],['imp','mail','Impor JSON','Pulihkan dari cadangan'],['csv','table','Ekspor CSV','Transaksi bulan ini'],['pick','glasses','Ganti Mode Tampilan','Mode saat ini: Wanita'],['clear','medis','Hapus Semua Data',''],['vflang','mail','Language / Bahasa','Indonesia · English · Mata uang']];
  return `<div class="fdh"><div class="fr1"><button class="fic" data-a="fgo" data-i="buku">${ik('book',30)}</button></div><h1 style="margin-bottom:6px">Lebih</h1><div style="font-size:13px;opacity:.9">Data tersimpan di perangkat ini · offline</div></div><div class="fml"><button data-gs="1" style="background:linear-gradient(135deg,#fff0f6,#ffe0ee)"><span class="ft" style="font-size:30px;line-height:34px">🎀</span><span><b style="font-weight:600">Mode Simpel ✨</b><small>Ringkas & imut: mutasi, target, split bill</small></span></button>${it.map(([a,ic,l,s])=>`<button data-a="${a}"><span class="ft">${ik(ic,34)}</span><span><b style="font-weight:600">${l}</b>${s?`<small>${s}</small>`:''}</span></button>`).join('')}</div>${window.MVDEV?window.MVDEV():''}<div style="height:20px"></div>`;
}

/* ---------- Transaksi: entri ---------- */
const fe=s=>s?s.replace(/\d+(\.\d*)?/g,m=>{const[i,d]=m.split('.'),en=window.VFC&&VFC.en;return i.replace(/\B(?=(\d{3})+(?!\d))/g,en?',':'.')+(d!==undefined?(en?'.':',')+d:'')}).replace(/x/g,'×').replace(/\//g,'÷'):'0';
const ev=s=>{const x=s.replace(/x/g,'*').replace(/[+\-*/.]+$/,'').replace(/(^|[^0-9.])0+(?=[0-9])/g,'$1');if(!x||/[^0-9.+\-*/]/.test(x))return 0;try{const r=Function('"use strict";return ('+x+')')();return isFinite(r)?Math.round(r):0}catch(e){return 0}};
function eOpen(t,cat){E=t?{id:t.id,type:t.type,cat:t.category,expr:String(t.amount),note:t.note||'',date:td(t)||iso(),w:t.wallet,to:t.toWallet||S.wallets[1]||S.wallets[0],tab:'rec',party:t.party||'',chk:t.chk||'1',rep:'0',ph:pl(t).slice(),opt:0}:{type:'expense',cat:cat||null,expr:'',note:'',date:iso(),w:S.wallets[0],to:S.wallets[1]||S.wallets[0],tab:'rec',party:'',chk:'1',rep:'0',ph:[],opt:0};eRender()}
function eRender(){
  const el=$('#E');if(!E){el.innerHTML='';return}
  const nt=$('#enote');if(nt)E.note=nt.value;const pa=$('#eparty');if(pa)E.party=pa.value;
  const tr=E.type==='transfer',L=tr?[]:(E.type==='income'?S.catInc:S.catExp),cnt={};
  S.transactions.filter(t=>t.type===E.type).forEach(t=>cnt[t.category]=(cnt[t.category]||0)+1);
  const rec=[...L].sort((x,y)=>(cnt[y]||0)-(cnt[x]||0)).slice(0,12),list=E.tab==='all'?L:rec;
  const tile=c=>`<button class="et ${E.cat===c?'on':''}" data-a="ecat" data-i="${esc(c)}">${ik(ckey(c),40)}<span>${esc(c)}</span></button>`;
  const TY=[['expense','person','Pengeluaran'],['income','bag','Pemasukan'],['transfer','card','Pindah']];
  const grid=tr?S.wallets.map(w=>`<button class="et ${E.to===w?'on':''}" data-a="eto" data-i="${esc(w)}">${ik(wg(w)==='k'?'card':wg(w)==='t'?'cash':'bank',40)}<span>${esc(w)}</span></button>`).join(''):list.map(tile).join('')+(E.tab==='all'?`<button class="et" data-a="ncat"><span style="font-size:30px;color:#ee6495;line-height:40px">+</span><span>Baru</span></button>`:'');
  const K=(l,c='',a='ek',i=l)=>`<button class="${c}" data-a="${a}" data-i="${i}">${l}</button>`;
  const wl=tr?`${E.w}→${E.to}`:`${E.w}(${window.VFC?VFC.code:'IDR'})`;
  const opt=E.opt?`<div class="eop"><input id="eparty" placeholder="Kepada / dari (opsional)" value="${esc(E.party)}" autocomplete="off"><div class="eoc"><button class="${E.chk==='1'?'on':''}" data-a="echk">${E.chk==='1'?'✓ Dicentang':'Belum dicentang'}</button>${E.type==='expense'&&!E.id?`<button class="${E.rep==='1'?'on':''}" data-a="erep">↻ Ulangi tiap bulan</button>`:''}<button data-a="ecam">Kamera</button><button data-a="egal">Galeri (${E.ph.length}/6)</button></div>${E.ph.length?`<div class="eph">${E.ph.map((p,i)=>`<span><img src="${p}" data-a="ephv" data-i="${i}" alt="Foto ${i+1}"><button data-a="ephx" data-i="${i}" aria-label="Hapus foto">×</button></span>`).join('')}</div>`:''}</div>`:'';
  el.innerHTML=`<div class="eo"><div class="ep"><div class="etop"><button data-a="ex" aria-label="Tutup">${gl('x',24)}</button><div class="ety">${TY.map(([k,ic,l])=>`<button class="${E.type===k?'on':''}" data-a="ety" data-i="${k}">${ik(ic,26)}${E.type===k?l:''}</button>`).join('')}</div><button data-a="esave" aria-label="Simpan">${gl('ok',26)}</button></div>
  ${tr?'<div class="eht" style="margin-top:6px">Pilih dompet tujuan di bawah. Dompet asal diganti lewat tombol kartu.</div>':`<div class="etb"><button class="${E.tab==='rec'?'on':''}" data-a="etab" data-i="rec"><span style="color:#ee6495">✦</span>Direkomendasikan</button><button class="${E.tab==='all'?'on':''}" data-a="etab" data-i="all">${ik('table',22)}Belum Dikelompokkan</button><button data-a="ecur" style="margin-left:auto;background:#fdeef3;color:#ee6495;padding:8px 12px">${window.VFC?VFC.symT:'Rp'}</button></div>${E.tab==='rec'&&!E.nohint?`<div class="eht"><span style="color:#ee6495">✦</span><span>Berdasarkan kebiasaan Anda, kategori yang sering digunakan direkomendasikan</span><button data-a="ehint">${gl('x',14)}</button></div>`:''}`}
  <div class="egr">${grid}</div>
  ${opt}<div class="pad"><div class="hdw"><button class="hd" data-a="epad" aria-label="Sembunyikan atau tampilkan tombol angka" style="flex:1">${gl(S.settings.padHide?'up':'dn',18)}</button><button class="hd hdo" data-a="eopt" aria-label="Opsi lainnya: foto, pihak, ulangi">${E.opt?'▾':'⋯'} Opsi${E.party||E.ph.length||E.rep==='1'||E.chk==='0'?' •':''}</button></div><div class="pg">
  <button class="acc" data-a="ew" aria-label="Ganti dompet" style="grid-column:1">${ik(wg(E.w)==='k'?'card':wg(E.w)==='t'?'cash':'bank',38)}</button>
  <div class="ed" data-closed="${S.settings.padHide?1:0}"><input id="enote" placeholder="Nota" value="${esc(E.note)}" autocomplete="off"><span class="wl2">${esc(wl)}</span><b id="eamt">${fe(E.expr)}</b><button class="hb" data-a="etag" aria-label="Tag">#</button></div>
  <button data-a="eemo" aria-label="Anggota"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="24" r="19" fill="#f7d67a" stroke="${PU}" stroke-width="2"/><path d="M14 20l6 2-6 2M34 20l-6 2 6 2M15 28c3 8 15 8 18 0z" fill="#fff" stroke="${PU}" stroke-width="2" stroke-linejoin="round"/></svg></button>
  <button class="sm" data-a="edate">${E.date===iso()?'TODAY':E.date.slice(8)+'/'+E.date.slice(5,7)}</button>
  <button data-a="esave2" aria-label="Simpan dan tambah lagi"><svg viewBox="0 0 40 40" width="40" height="40"><circle cx="20" cy="20" r="16" fill="#e4f4e6" stroke="#5fae6b" stroke-width="2.5"/><path d="M20 12v16M12 20h16" stroke="#5fae6b" stroke-width="2.5" stroke-linecap="round"/></svg></button>
  <button data-a="esave" aria-label="Simpan"><svg viewBox="0 0 40 40" width="44" height="30"><path d="M5 19l8 8L33 9" fill="none" stroke="#5aa6a8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 33h26" stroke="#5aa6a8" stroke-width="1.5" stroke-dasharray="2 3"/></svg></button>
  <div class="eks" style="display:${S.settings.padHide?'none':'contents'}">${K('x','','ek','x')}${K('7','n')}${K('8','n')}${K('9','n')}${K('/','','ek','/')}${K('4','n')}${K('5','n')}${K('6','n')}${K('-','','ek','-')}${K('1','n')}${K('2','n')}${K('3','n')}${K('+','','ek','+')}<button class="n" data-a="ek" data-i="." aria-label="Desimal">,</button>${K('0','n')}
  <button data-a="ek" data-i="del" aria-label="Hapus"><svg viewBox="0 0 40 40" width="38" height="38"><circle cx="20" cy="20" r="15" fill="#f2829f" stroke="#c4506f" stroke-width="2"/><path d="M14 14l12 12M26 14L14 26" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg></button></div>
  </div></div></div></div>`;
}
function eAmt(){const b=$('#eamt');if(b)b.textContent=fe(E.expr)}
function eSave(keep){
  const nt=$('#enote');if(nt)E.note=nt.value;
  const a=ev(E.expr);if(a<=0)return toast('Isi jumlah lebih dari 0.');
  const tr=E.type==='transfer';
  if(!tr&&!E.cat)return toast('Pilih kategori dulu.');
  if(tr&&E.w===E.to)return toast('Pilih dua dompet yang berbeda.');
  const o={id:E.id||Date.now(),scope:'personal',type:E.type,amount:a,category:tr?'Transfer':E.cat,wallet:E.w,note:E.note.trim(),isoDate:E.date,date:fd(E.date),chk:E.chk,party:(E.party||'').trim(),photos:E.ph.slice(),photo:undefined};if(!E.id)o.book=bkc();
  if(tr)o.toWallet=E.to;
  const ix=E.id?S.transactions.findIndex(x=>x.id===E.id):-1;if(ix>=0){const old=S.transactions[ix];S.transactions[ix]={...old,...o};if(!tr)delete S.transactions[ix].toWallet}else S.transactions.unshift(o);
  if(!E.id&&E.rep==='1'&&E.type==='expense')S.sched.push({id:Date.now()+1,name:o.note||o.category,amount:a,category:E.cat,wallet:E.w,every:1,dom:+E.date.slice(8),next:addM(E.date,1,+E.date.slice(8)),remind:3});
  if(keep){E={...E,id:undefined,expr:'',note:'',ph:[],rep:'0',party:''};save();eRender();toast('Tersimpan, lanjut catat lagi')}else{E=null;$('#E').innerHTML='';save();toast('Tersimpan')}
}
const epack=f=>new Promise(r=>{const im=new Image();im.onload=()=>{const k=Math.min(1,640/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(im.src);r(c.toDataURL('image/jpeg',.55))};im.onerror=()=>r('');im.src=URL.createObjectURL(f)});
const efile=cam=>{const x=document.createElement('input');x.type='file';x.accept='image/*';if(cam)x.setAttribute('capture','environment');else x.multiple=true;x.style.display='none';document.body.append(x);x.onchange=async()=>{for(const f of [...x.files]){if(E.ph.length>=6){toast('Maksimal 6 foto per transaksi.');break}const d=await epack(f);if(d)E.ph.push(d)}x.remove();eRender()};x.addEventListener('cancel',()=>x.remove());x.click()};
const dpick=(type,val,fn)=>{const x=document.createElement('input');x.type=type;x.value=val;x.style.cssText='position:fixed;opacity:0;top:50%;left:50%;width:1px;height:1px';document.body.append(x);x.onchange=()=>{if(x.value)fn(x.value);x.remove()};x.onblur=()=>setTimeout(()=>x.remove(),400);try{x.showPicker?x.showPicker():x.click()}catch(e){x.click()}};

/* ---------- Detail transaksi ---------- */
function dRender(){
  const el=$('#D');if(!Dt){el.innerHTML='';return}
  const t=Dt,tr=t.type==='transfer',tags=(t.note||'').match(/#[^\s#]+/g)||[],dd=td(t).split('-'),tm=t.id>1e12?new Date(t.id):null,ts=tm?[tm.getHours(),tm.getMinutes(),tm.getSeconds()].map(v=>String(v).padStart(2,'0')).join('.'):'00.00.00';
  const sg=t.type==='income'?'+':tr?'':'-',c=t.type==='income'?'#3fa550':tr?'#555':'#e5383b',nt=(t.note||'').replace(/#[^\s#]+/g,'').trim();
  el.innerHTML=`<div class="dm"><div data-a="fdx" style="position:absolute;inset:0"></div><div class="dc" style="position:relative"><div class="dt"><button data-a="fdx" aria-label="Tutup">${gl('x',24)}</button><span style="flex:1"></span><button data-a="fdel" aria-label="Hapus" style="margin-right:16px"><svg viewBox="0 0 24 24" width="24" height="24" fill="#ee6495"><path d="M6 8h12l-1 12H7zM9 4h6l1 2h4v2H4V6h4z"/></svg></button><button data-a="fded" aria-label="Ubah"><svg viewBox="0 0 24 24" width="24" height="24" fill="#ee6495"><path d="M4 17.5V20h2.5L18 8.5 15.5 6zM19.7 6.8a1 1 0 000-1.4l-1.1-1.1a1 1 0 00-1.4 0l-1.1 1.1 2.5 2.5z"/></svg></button></div>
  <div class="di"><div style="display:flex;align-items:center;gap:14px">${ik(tr?'card':ckey(t.category),52)}<b style="font-weight:500;font-size:17px;flex:1">${esc(tr?'transfer':t.category)}</b></div>
  <div style="color:${c};font-weight:700;font-size:20px;margin:6px 0 8px">${sg}${rp(t.amount)}</div>
  <div class="l"><i>Tanggal:</i><span>${+dd[2]}/${+dd[1]}/${dd[0]} ${ts}</span></div><div class="l"><i>Anggota:</i><span>diri sendiri</span></div><div class="l"><i>Akun:</i><span>${esc(t.wallet)}${tr?' → '+esc(t.toWallet):''}</span></div><div class="l"><i>Buku:</i><span>${esc(bkOf(t))}</span></div>${t.party?`<div class="l"><i>Kepada/dari:</i><span>${esc(t.party)}</span></div>`:''}<div class="l"><i>Status:</i><span>${t.chk==='0'?'Belum dicentang':'Dicentang'}</span></div>
  <div class="l ${nt?'':'n'}"><i>Nota:</i><span>${nt?esc(nt):'Bagaimana dengan menulis sesuatu?'}</span></div>${tags.map(g=>`<span class="dtag">${esc(g)} ›</span>`).join('')}${pl(t).length?`<div class="eph" style="padding:4px 0 8px">${pl(t).map((p,i)=>`<span><img src="${p}" data-a="fdph" data-i="${i}" alt="Foto ${i+1}"></span>`).join('')}</div>`:''}
  <svg class="mp" viewBox="0 0 340 150"><rect width="340" height="150" fill="#f3efe4"/><path d="M0 22h340v10H0z" fill="#e8e4d8"/><path d="M0 22h340M0 32h340" stroke="#9a9a9a"/><rect x="132" y="34" width="86" height="100" rx="30" fill="#bddca2"/><rect x="2" y="34" width="120" height="116" fill="#c9e2b0"/><rect x="236" y="34" width="104" height="116" fill="#c9e2b0"/><path d="M130 34v116M222 34v116M20 60h100M20 100h100M240 80h100M240 120h100" stroke="#fff" stroke-width="5"/><circle cx="175" cy="84" r="30" fill="none" stroke="#fff" stroke-width="6"/><rect x="262" y="12" width="26" height="14" rx="3" fill="#3b6fb6"/><text x="275" y="23" text-anchor="middle" style="fill:#fff;font-size:10px;font-weight:700">280</text><path d="M150 54c-5 0-9 4-9 9 0 7 9 17 9 17s9-10 9-17c0-5-4-9-9-9z" transform="translate(0 -18)" fill="#e53935"/><circle cx="150" cy="45" r="3" fill="#fff"/><path d="M150 62v30" stroke="#777" stroke-width="1.5"/></svg><button class="b s" data-a="fdfull" style="width:100%;margin-top:10px;color:#ee6495;border-color:#f3cbd9">Foto, tandai &amp; salin (form lengkap)</button></div></div></div>`;
}

/* ---------- Render utama ---------- */
function fpIdle(){clearTimeout(fpA);fpA=0;if(!fpo)return;fpA=setTimeout(function chk(){fpA=0;if(!fpo)return;if(E||document.querySelector('#sh .bd')){fpA=setTimeout(chk,5000);return}fpo=0;if(ftab==='buku'&&!fsub)render()},30000)}
document.addEventListener('pointerdown',function(e){if(fpo&&e.target.closest&&e.target.closest('.fp'))fpIdle()},true);
function fr(){
  const T={buku:fHome,dompet:fWal,analisis:fAn,fitur:fFitur,lebih:fMore},X=fsub.startsWith('x:'),h=fsub==='bul'?fBul():fsub==='newcat'?fNew():X?fX(fsub.slice(2)):T[ftab]();
  const q=[...books()].length&&S.transactions.length?[...new Set(S.transactions.filter(t=>t.type==='expense').map(t=>t.category))].slice(0,3):[];
  const fab=X&&fsub!=='x:more'?`<div class="fp"><button class="q qcb" data-a="qcopen" aria-label="Catat Cepat">⚡</button><button class="pn" data-a="fadd" data-i="" aria-label="Catat transaksi">${PEN}</button></div>`:ftab==='buku'&&!fsub?`<div class="fp${fpo?'':' fpc'}">${fpo?'<button class="q qcb" data-a="qcopen" aria-label="Catat Cepat">⚡</button>'+[0,1,2].map(j=>`<button class="q" data-a="fadd" data-i="${esc(q[j]||'')}" aria-label="Cepat">${ik(['mail','bus','house'][j],26)}</button>`).join(''):''}<button class="pn" data-a="fpn" data-i="" aria-label="Catat transaksi (ketuk 2x untuk menutup)"><svg viewBox="0 0 48 48" width="44" height="44"><path d="M10 36l22-24 6 5-22 24-9 3z" fill="#ee6495" stroke="#6d5a8a" stroke-width="2.2" stroke-linejoin="round"/><path d="M30 14l6 5" stroke="#6d5a8a" stroke-width="2.2"/></svg></button></div>`:'';
  const nav=fsub&&!X?'':`<div class="fn" role="navigation">${[['buku','Buku','book'],['dompet','Dompet','wallet'],['analisis','Analisis','pie'],['fitur','Fitur','grid'],['lebih','Lebih','more']].map(([k,l,ic])=>`<button data-a="fgo" data-i="${k}" class="${ftab===k?'on':''}">${ik(ic,32)}<span>${l}</span></button>`).join('')}</div>`;
  $('#F').innerHTML=`<div class="fa">${h}</div>${fab}${nav}`;
  if(fs&&fq){const e=$('#fsq');if(e){e.focus();e.setSelectionRange(fq.length,fq.length)}}
}
function pickUI(show){
  const m=S.settings.mode;
  $('#pk').innerHTML=show?`<div class="pk"><div class="pkc"><h2>Pilih Mode Tampilan</h2><p>Data kamu tetap sama. Mode bisa diganti kapan saja.</p><div class="pkg"><button class="pkb pr" data-a="setmode" data-i="pria"><svg viewBox="0 0 48 48" width="64" height="64" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"><circle cx="20" cy="28" r="12"/><path d="M29 19l12-12M31 7h10v10"/></svg><b>Pria</b><small>Tampilan klasik gelap &amp; emas</small></button><button class="pkb wn" data-a="setmode" data-i="wanita"><svg viewBox="0 0 48 48" width="64" height="64" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"><circle cx="24" cy="18" r="12"/><path d="M24 30v14M17 38h14"/></svg><b>Wanita</b><small>Tampilan pink lembut</small></button></div>${m?'<button class="b" data-a="pickx" style="width:100%">Batal</button>':''}</div></div>`:'';
}
const _render=render;
render=function(){
  const m=S.settings.mode,R=document.documentElement,tc=document.querySelector('meta[name=theme-color]');
  document.body.classList.toggle('fm',m==='wanita');R.classList.toggle('fmr',m==='wanita');
  if(m==='wanita'){R.dataset.t='light';R.style.setProperty('--ac','#ee6495');if(tc)tc.content='#ee6495';fr()}
  else{_render();if(tc)tc.content='#0d1412';E=null;Dt=null;$('#E').innerHTML='';$('#D').innerHTML=''}
  pickUI(!m||pko);
};
const _more=V.more;
V.more=()=>{const w=S.settings.mode==='wanita';return `<section class="c"><h3>Mode tampilan</h3><small style="margin-bottom:10px">Sekarang: ${w?'Wanita':'Pria'}. Data tetap sama di kedua mode.</small><div class="row"><button class="b p" data-a="setmode" data-i="${w?'pria':'wanita'}">Pakai mode ${w?'Pria':'Wanita'}</button></div></section>`+_more()};
const _tab=A.tab,_sub=A.sub,_gm=A.gm,_wal=A.wallets,fW=()=>S.settings.mode==='wanita';
Object.assign(A,{
 tab(i){if(fW()){fsub='x:'+i;render();scrollTo(0,0)}else _tab(i)},
 sub(i){if(fW()){fsub=i?'x:'+i:'';render();scrollTo(0,0)}else _sub(i)},
 gm(m){if(fW()){month=m;fsub='x:trx';render();scrollTo(0,0)}else _gm(m)},
 wallets(i){if(fW()){ftab='dompet';fsub='';render();scrollTo(0,0);toast('Ketuk dompet untuk mengisi saldo awal')}else _wal(i)},
 fx(i){fsub='x:'+i;render();scrollTo(0,0)},
 fdfull(){const t=Dt;Dt=null;dRender();txForm(t)},
 pick(){pko=1;render()},pickx(){pko=0;render()},
 setmode(i){pko=0;S.settings.mode=i;ftab='buku';fsub='';save();scrollTo(0,0)},
 fgo(i){ftab=i;fsub='';render();scrollTo(0,0)},fback(){fsub='';render();scrollTo(0,0)},
 fan(i){fan=i;render()},bul(){fsub='bul';render();scrollTo(0,0)},
 fbk(i){S.settings.cb=i;save()},
 fnewbk(){sheet('Diary baru',[{k:'n',l:'Nama diary',p:'Contoh: Usaha, Liburan'}],d=>{const n=d.n.trim();if(!n)return 'Isi nama buku.';if(!books().includes(n))books().push(n);S.settings.cb=n;ftab='buku';fsub=''}) },
 frename(){const o=bkc();sheet('Ubah nama diary',[{k:'n',l:'Nama diary',v:o}],d=>{const n=d.n.trim();if(!n)return 'Isi nama buku.';if(n===o)return;if(books().includes(n))return 'Nama buku sudah dipakai.';const b=books();b[b.indexOf(o)]=n;S.transactions.forEach(t=>{if(t.book===o)t.book=n});S.settings.cb=n},books().length>1?()=>{const b=books();S.transactions.forEach(t=>{if(!t.book)t.book=b[0]});const n=S.transactions.filter(t=>t.book===o).length;if(!confirm('Hapus buku "'+o+'" beserta '+n+' transaksinya? Tindakan ini tidak bisa dibatalkan.'))return false;S.transactions=S.transactions.filter(t=>t.book!==o);b.splice(b.indexOf(o),1);S.settings.cb=b[0]}:null,'Lanjutkan menghapus buku ini?')},
 fdupbk(){const o=bkc();sheet('Duplikat diary',[{k:'n',l:'Nama diary baru',v:o+' (salinan)'},{k:'cp',l:'Isi',t:'seg',o:[['1','Salin transaksi'],['0','Buku kosong']],v:'1'}],d=>{const n=d.n.trim();if(!n)return 'Isi nama buku.';const b=books();if(b.includes(n))return 'Nama buku sudah dipakai.';b.forEach(()=>0);S.transactions.forEach(t=>{if(!t.book)t.book=b[0]});if(d.cp==='1'){let id=Date.now();const c=S.transactions.filter(t=>t.book===o).map(t=>({...JSON.parse(JSON.stringify(t)),id:id++,book:n}));S.transactions.unshift(...c)}b.push(n);S.settings.cb=n})},
 fhide(){S.settings.hide=!S.settings.hide;save()},
 fcl(){fcl=!fcl;render()},fall(){fall=!fall;render();toast(fall?'Menampilkan semua transaksi':'Menampilkan 25 terbaru')},
 fsrch(){fs=!fs;if(!fs)fq='';render();setTimeout(()=>{const e=$('#fsq');if(e)e.focus()})},
 fmonth(){dpick('month',month,v=>{month=v;render()})},
 fadd(i){eOpen(null,i||null)},
 fpn(){fpIdle();if(!fpo){fpo=1;render();fpIdle();return}if(fpT){clearTimeout(fpT);fpT=0;fpo=0;render();return}fpT=setTimeout(()=>{fpT=0;A.fadd('')},300)},
 fdet(i){Dt=find('transactions',i);dRender()},fdx(){Dt=null;dRender()},
 fdel(){if(Dt&&confirm('Hapus transaksi ini?')){const id=Dt.id;S.transactions=S.transactions.filter(x=>x.id!==id);Dt=null;dRender();save();toast('Dihapus')}},
 fded(){const t=Dt;Dt=null;dRender();eOpen(t)},
 ex(){E=null;eRender()},
 eopt(){const p=$('#eparty');if(p)E.party=p.value;E.opt=!E.opt;eRender()},echk(){E.chk=E.chk==='1'?'0':'1';eRender()},erep(){E.rep=E.rep==='1'?'0':'1';eRender()},
 ecam(){efile(1)},egal(){efile(0)},ephx(i){E.ph.splice(+i,1);eRender()},ephv(i){lb(E.ph[+i])},fdph(i){lb(pl(Dt)[+i])},
 fcat(i){ftab='buku';fsub='';fs=1;fq=i;render();scrollTo(0,0)},
 ety(i){E.type=i;E.cat=null;eRender()},etab(i){E.tab=i;eRender()},ecat(i){E.cat=i;eRender()},eto(i){E.to=i;eRender()},ehint(){E.nohint=1;eRender()},
 ew(){const j=S.wallets.indexOf(E.w);E.w=S.wallets[(j+1)%S.wallets.length];eRender();toast('Dompet: '+E.w)},
 ecur(){if(window.VFC)VFC.open()},eemo(){toast('Anggota: diri sendiri')},
 etag(){const t=prompt('Tambah tag (tanpa #)');if(t&&t.trim()){const nt=$('#enote');E.note=((nt?nt.value:E.note)+' #'+t.trim().replace(/\s+/g,'')).trim();eRender()}},
 edate(){dpick('date',E.date,v=>{E.date=v;eRender()})},
 esave(){eSave(0)},esave2(){eSave(1)},
 ek(k){
   if(k==='del'){E.expr=E.expr.slice(0,-1)}
   else if('+-x/'.includes(k)){if(!E.expr&&k!=='-')return;E.expr=/[+\-x/]$/.test(E.expr)?E.expr.slice(0,-1)+k:E.expr+k}
   else if(k==='.'){const last=E.expr.split(/[+\-x/]/).pop();if(last.includes('.'))return;E.expr+=last?'.':'0.'}
   else{const lo=E.expr.split(/[+\-x/]/).pop();E.expr=(lo==='0'&&/\d/.test(k))?E.expr.slice(0,-1)+k:E.expr+k}
   eAmt()},
 ncat(){const ent=E;if(ent){E=null;eRender()}NC={n:'',i:'burger',t:'expense'};ftab='lebih';fsub='newcat';render();scrollTo(0,0)},
 nic(i){NC.n=($('#ncn')||{}).value??NC.n;NC.i=i;render()},nty(i){NC.n=($('#ncn')||{}).value??NC.n;NC.t=i;render()},
 nsave(){const n=(($('#ncn')||{}).value||'').trim();if(!n)return toast('Isi nama kategori.');const l=cats(NC.t);if(l.includes(n))return toast('Kategori sudah ada.');l.push(n);FI()[n]=NC.i;fsub='';ftab='buku';save();toast('Kategori ditambahkan')}
});
document.addEventListener('input',e=>{const t=e.target;if(t.id==='fsq'){fq=t.value;$('#flst').innerHTML=fList()}if(t.id==='ncn'&&NC)NC.n=t.value;if(t.id==='fqf'){fqf=t.value;$('#fgrid').innerHTML=fGrid()}});
S.settings.mode=S.settings.mode;
render();
