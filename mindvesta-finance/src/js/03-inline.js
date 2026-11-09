
const $=s=>document.querySelector(s),KEY='vitalfinance_data';
const INC=['Gaji','Penjualan/Omset','Penghasilan Sampingan','Bonus & THR','Investasi/Aset','Sewa Properti','Dividen/Bunga','Pengembalian Dana','Lainnya - Pemasukan'];
const EXP=['Makanan','Kopi & Jajan','Transportasi','Belanja Pribadi','Belanja Dapur','Tagihan','Listrik Rumah','Sewa / Cicilan Rumah','Pulsa & Internet Pribadi','Kesehatan','Pendidikan','Hiburan & Rekreasi','Kebutuhan Keluarga','Asuransi','Donasi / Zakat','Service Kendaraan','Perawatan Diri','Operasional Usaha','Pembayaran Utang','Lainnya'];
const ASSET=['Tabungan/Deposito','Emas','Properti','Kendaraan','Saham/Reksa Dana','Kripto','Bisnis','Lainnya'];
const rp=n=>window.VFC&&VFC.on?VFC.money(+n||0):'Rp '+new Intl.NumberFormat('id-ID',{maximumFractionDigits:0}).format(Math.round(+n||0));
const num=v=>Math.min(+String(v||'').replace(/[^0-9]/g,'').slice(0,15)||0,999999999999999);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iso=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const fd=i=>{const[y,m,d]=i.split('-').map(Number);return new Date(y,m-1,d,12).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})};
const ml=k=>{const[y,m]=k.split('-').map(Number);return new Date(y,m-1,1).toLocaleDateString('id-ID',{month:'long',year:'numeric'})};
const sm=(m,n)=>{const[y,o]=m.split('-').map(Number);return iso(new Date(y,o-1+n,1)).slice(0,7)};
const col=c=>`hsl(${[...String(c)].reduce((h,x)=>(h*31+x.charCodeAt(0))>>>0,7)%360} 50% 42%)`;
const IDM={jan:0,feb:1,mar:2,apr:3,mei:4,jun:5,jul:6,agu:7,sep:8,okt:9,nov:10,des:11};
const td=t=>{if(t.isoDate)return t.isoDate;let p=new Date(t.date);if(isNaN(p)){const m=String(t.date||'').match(/(\d{1,2})\s+([A-Za-z]{3})[a-z]*\.?\s+(\d{4})/),k=m&&IDM[m[2].toLowerCase()];if(m&&k!==undefined)p=new Date(+m[3],k,+m[1])}return isNaN(p)?'':iso(p)};

let hm=0,dsel=0,pend=[],gw='*',sub='',S,tab='home',month=iso().slice(0,7),q='',ft='all',tt;
function load(o){
  S=Object.assign({transactions:[],wallets:['Kas Tunai','Rekening Bank','E-Wallet'],walletOpeningBalances:{},budgets:{},assets:[],activeDebts:[],goals:[],settings:{theme:'auto'},advice:{income:0,fixed:{}},onboarded:false},o&&typeof o==='object'?o:{});
  ['transactions','assets','activeDebts','goals','subs','sched','bp'].forEach(k=>{if(!Array.isArray(S[k]))S[k]=[]});
  ['walletOpeningBalances','budgets','settings'].forEach(k=>{if(!S[k]||typeof S[k]!=='object'||Array.isArray(S[k]))S[k]={}});
  if(!Array.isArray(S.wallets)||!S.wallets.length)S.wallets=['Kas Tunai','Rekening Bank','E-Wallet'];
  if(!S.advice||typeof S.advice!=='object')S.advice={income:0,fixed:{}};if(!S.advice.fixed||typeof S.advice.fixed!=='object')S.advice.fixed={};
  ['transactions','assets','activeDebts','goals','subs','sched','bp'].forEach(k=>{S[k]=S[k].filter(x=>x&&typeof x==='object'&&!Array.isArray(x))});
  const _fx=v=>{v=typeof v==='number'?v:parseFloat(v);return isFinite(v)?Math.max(-1e15,Math.min(1e15,v)):0};
  S.transactions.forEach(t=>{t.amount=Math.abs(_fx(t.amount))});
  ['assets','activeDebts','goals','subs','sched','bp'].forEach(k=>S[k].forEach(o=>Object.keys(o).forEach(f=>{const v=o[f];if(typeof v==='number'&&(!isFinite(v)||Math.abs(v)>1e15))o[f]=_fx(v)})));
  ['walletOpeningBalances','budgets'].forEach(k=>Object.keys(S[k]).forEach(f=>{const v=S[k][f];if(typeof v==='number'||v===null)S[k][f]=_fx(v)}));
  S.transactions.forEach(t=>{const a=+t.amount;t.amount=Number.isFinite(a)?Math.max(-999999999999999,Math.min(999999999999999,a)):0});
  if(S.settings.mode&&S.settings.mode!=='pria'&&S.settings.mode!=='wanita')delete S.settings.mode;
  S.icons=S.icons&&typeof S.icons==='object'?S.icons:{};
  S.catInc=Array.isArray(S.catInc)?S.catInc:[...INC];
  S.catExp=Array.isArray(S.catExp)?S.catExp:[...new Set([...EXP,...(Array.isArray(S.categories)?S.categories:[]).filter(c=>!INC.includes(c)&&!['Retur Penjualan','Setoran Modal Pemilik','Prive / Penarikan Pemilik','Pendapatan Lain Bisnis'].includes(c))])];
}
try{load(JSON.parse(localStorage.getItem(KEY)||'null'))}catch(e){load(null)}
function save(){try{const j=JSON.stringify(S);localStorage.setItem(KEY,j);window.__unsaved=false;if(j.length>4.2e6&&!window.__qw){window.__qw=1;toast('Penyimpanan hampir penuh ('+Math.round(j.length/5e4)+'%). Ekspor cadangan & kurangi foto.')}}catch(e){window.__unsaved=true;toast('Penyimpanan penuh! Data belum tersimpan permanen. Ekspor cadangan sekarang.')}render()}
window.addEventListener('beforeunload',e=>{if(window.__unsaved){e.preventDefault();e.returnValue=''}});
const stg=()=>{try{const p=Math.round((localStorage.getItem(KEY)||'').length/5e4);return `<small style="display:block;margin-bottom:10px">Penyimpanan terpakai ±${p}% dari ±5 MB${p>80?' · hampir penuh, ekspor cadangan lalu kurangi foto':''}</small>`}catch(e){return ''}};
function toast(m){const t=$('#ts');t.textContent=m;t.className='on';clearTimeout(tt);tt=setTimeout(()=>t.className='',2600)}

try{['Service Kendaraan','Perawatan Diri'].forEach(c=>{if(!S.catExp.includes(c))S.catExp.push(c)})}catch(e){}
const cats=ty=>ty==='income'?S.catInc:S.catExp;
const BKON=()=>S.settings.mode==='pria'&&typeof bkc==='function';
const TX=()=>BKON()?S.transactions.filter(t=>bkOf(t)===bkc()):S.transactions;
const inM=m=>TX().filter(t=>td(t).startsWith(m));
const sum=(a,ty)=>a.filter(t=>t.type===ty).reduce((s,t)=>s+(+t.amount||0),0);
function bal(w){let b=+S.walletOpeningBalances[w]||0;S.transactions.forEach(t=>{const a=+t.amount||0;if(t.type==='income'&&t.wallet===w)b+=a;else if(t.type==='expense'&&t.wallet===w)b-=a;else if(t.type==='transfer'){if(t.wallet===w)b-=a;if(t.toWallet===w)b+=a}});return b}
const cash=()=>S.wallets.reduce((s,w)=>s+bal(w),0);
const assets=()=>S.assets.reduce((s,x)=>s+(+x.value||0),0);
const debts=()=>S.activeDebts.filter(d=>d.dir!=='owed').reduce((s,d)=>s+(+d.principal||0),0);
const owedMe=()=>S.activeDebts.filter(d=>d.dir==='owed').reduce((s,d)=>s+(+d.principal||0),0);
function spentBy(m){const by={};inM(m).filter(t=>t.type==='expense').forEach(t=>by[t.category]=(by[t.category]||0)+(+t.amount||0));return by}
const days=iso=>{const[y,m,d]=iso.split('-').map(Number);return Math.round((new Date(y,m-1,d)-new Date(new Date().setHours(0,0,0,0)))/864e5)};
const addM=(i,n,dom)=>{const[y,m,d]=i.split('-').map(Number);const x=new Date(y,m-1+n,1);x.setDate(Math.min(dom||d,new Date(x.getFullYear(),x.getMonth()+1,0).getDate()));return iso(x)};


const NEEDS=[
{k:'sewa',n:'Sewa / tempat tinggal',p:.25,a:400000,c:['Sewa / Cicilan Rumah']},
{k:'makan',n:'Makanan',p:.22,a:450000,c:['Makanan','Belanja Dapur','Kopi & Jajan']},
{k:'listrik',n:'Listrik',p:.04,a:50000,c:['Listrik Rumah']},
{k:'transport',n:'Transportasi',p:.08,a:150000,c:['Transportasi']},
{k:'service',n:'Service kendaraan',p:.03,a:40000,c:['Service Kendaraan']},
{k:'internet',n:'Paket internet',p:.03,a:50000,c:['Pulsa & Internet Pribadi']},
{k:'diri',n:'Perawatan diri',p:.02,a:30000,c:['Perawatan Diri']}];
const r3=v=>Math.round(v/1000)*1000;
function avgInc(){const v=[0,1,2].map(i=>sum(inM(sm(iso().slice(0,7),-i)),'income')).filter(x=>x>0);return v.length?Math.round(v.reduce((a,b)=>a+b)/v.length):0}
function advice(){
  const inc=+S.advice.income||0,F=S.advice.fixed;
  const it=NEEDS.map(n=>({...n,fx:+F[n.k]||0,min:Math.max(r3(inc*n.p),n.a)}));
  const need=it.map(i=>i.fx||i.min),tot=need.reduce((a,b)=>a+b,0),sv=inc-tot;
  if(sv>=0)return{it:it.map((i,j)=>({...i,v:need[j]})),sv,tot,mode:'save'};
  const rest=Math.max(0,inc-it.reduce((s,i)=>s+i.fx,0)),ms=it.filter(i=>!i.fx).reduce((s,i)=>s+i.min,0)||1;
  return{it:it.map(i=>({...i,v:i.fx||r3(rest*i.min/ms)})),sv:0,tot,mode:'max',short:tot-inc};
}
function payoff(D,b){
  const L=D.map(d=>({p:+d.principal,r:(+d.interest||0)/1200,m:+d.installmentAmount||0}));let n=0,bunga=0;
  if(b<=0)return{n:0,ok:false,bunga:0};
  while(L.some(x=>x.p>1)&&n<600){n++;let k=b;
    L.forEach(x=>{if(x.p>0){const i=x.p*x.r;x.p+=i;bunga+=i}});
    L.forEach(x=>{if(x.p>0){const a=Math.min(x.p,x.m,k);x.p-=a;k-=a}});
    [...L].filter(x=>x.p>0).sort((a,c)=>c.r-a.r||a.p-c.p).forEach(x=>{const a=Math.min(x.p,k);x.p-=a;k-=a})}
  return{n,ok:!L.some(x=>x.p>1),bunga};
}
const kv=(l,v,c)=>`<div class="h" style="margin:0;font-weight:500;padding:3px 0"><span>${l}</span><span class="am ${c||''}">${v}</span></div>`;
function adviceCard(){
  const inc=+S.advice.income||0,btn=`<button class="b s p" data-a="advset">${inc?'Ubah':'Atur gaji'}</button>`;
  if(!inc)return `<section class="c"><h3>Mode saran ${btn}</h3><small>Masukkan gaji bulanan. Aplikasi menghitung batas minimal sewa, makanan, listrik, transportasi, service kendaraan, internet, dan perawatan diri, lalu sisanya untuk ditabung.</small></section>`;
  const r=advice(),by=spentBy(month),dm=new Date(+month.slice(0,4),+month.slice(5),0).getDate();
  return `<section class="c"><h3>Mode saran · gaji ${rp(inc)} ${btn}</h3>
  <div class="h" style="margin:0"><small>${r.mode==='save'?'Batas minimal':'Batas maksimal'}</small><small>per bulan · per hari</small></div>
  ${r.it.map(i=>{const a=i.c.reduce((s,c)=>s+(by[c]||0),0);return `<div style="padding:6px 0;border-top:1px solid var(--ln)"><div class="h" style="margin:0;font-weight:500"><span>${i.n}${i.fx?' (biaya Anda)':''}</span><span class="am">${rp(i.v)} · ${rp(i.v/dm)}</span></div><small class="${a>i.v?'out':''}">Terpakai di bulan terpilih: ${rp(a)}</small></div>`}).join('')}
  <div style="padding:8px 0;border-top:1px solid var(--ln)"><div class="h" style="margin:0"><span>Bisa ditabung</span><span class="am ${r.mode==='save'?'in':'out'}">${rp(r.sv)}${r.mode==='save'?' ('+Math.round(r.sv/inc*100)+'%)':''}</span></div>
  <small>${r.mode==='save'?(r.sv<inc*.1?'Tabungan masih di bawah 10% gaji. Tekan pos terbesar bila bisa.':'Angka di atas adalah batas minimal. Belanja lebih rendah berarti tabungan lebih besar.'):'Gaji tidak cukup untuk kebutuhan minimal (kurang '+rp(r.short)+'). Angka di atas adalah batas maksimal tiap pos agar total tidak melebihi gaji, sehingga tidak ada ruang menabung.'}</small></div>
  <div class="row" style="margin-top:8px"><button class="b" data-a="advapply">Jadikan anggaran bulanan</button></div></section>`;
}
function debtAdviceCard(){
  const D=S.activeDebts.filter(d=>d.principal>0&&d.dir!=='owed');if(!D.length)return '';
  const inc=+S.advice.income||avgInc(),now=iso().slice(0,7);
  const ex=[0,1,2].map(i=>inM(sm(now,-i)).filter(t=>t.type==='expense'&&t.category!=='Pembayaran Utang').reduce((s,t)=>s+(+t.amount||0),0)).filter(x=>x>0);
  const live=ex.length?Math.round(ex.reduce((x,y)=>x+y)/ex.length):(+S.advice.income?advice().tot:0);
  const inst=D.reduce((s,d)=>s+(+d.installmentAmount||0),0),debt=D.reduce((s,d)=>s+d.principal,0),room=inc-live;
  const liq=S.assets.filter(a=>a.type==='Tabungan/Deposito').reduce((s,a)=>s+(+a.value||0),0),usable=Math.max(0,cash()+liq-live);
  const head=`<section class="c"><h3>Saran pelunasan utang</h3>`;
  if(!inc)return head+'<small>Isi gaji di Mode saran (tab Anggaran) atau catat pemasukan agar perhitungan bisa dibuat.</small></section>';
  const s=payoff(D,room);let lo=0,hi=debt*2;for(let i=0;i<40;i++){const m=(lo+hi)/2,o=payoff(D,m);o.ok&&o.n<=24?hi=m:lo=m}
  const need=Math.max(inst,Math.ceil(hi/1000)*1000),order=[...D].sort((a,b)=>(+b.interest||0)-(+a.interest||0)||a.principal-b.principal);
  const verdict=room<inst?`Kekurangan ${rp(inst-Math.max(0,room))} per bulan hanya untuk membayar cicilan wajib. Naikkan pemasukan atau turunkan biaya hidup, dan jangan menambah utang baru.`
    :s.ok?`Dengan ${rp(room)} per bulan, semua utang lunas dalam ${s.n} bulan (±${(s.n/12).toFixed(1)} tahun) dengan total bunga ±${rp(s.bunga)}.`
    :'Dana per bulan belum cukup melunasi utang (bunga lebih besar dari pembayaran). Tambah pemasukan atau kurangi biaya hidup.';
  return head+kv('Pemasukan / bulan',rp(inc))+kv('Biaya hidup / bulan',rp(live))+`<small style="margin-bottom:4px">${ex.length?'Rata-rata pengeluaran 3 bulan terakhir, tidak termasuk bayar utang.':'Belum ada riwayat pengeluaran, memakai batas minimal Mode saran.'}</small>`+kv('Cicilan wajib / bulan',rp(inst))+kv('Dana tersedia untuk utang / bulan',rp(room),room<0?'out':'in')+
  `<div style="border-top:1px solid var(--ln);margin-top:6px;padding-top:6px">`+kv('Total utang',rp(debt),'out')+kv('Kas + tabungan yang aman dipakai',rp(usable))+kv('Kekurangan untuk lunas sekarang',rp(Math.max(0,debt-usable)),'out')+`<small>Dana aman = kas + deposito dikurangi biaya hidup 1 bulan.</small></div>
  <div class="al c" style="margin-top:10px;border-left:4px solid var(--ac)">${verdict}</div>
  <small style="margin-top:8px">Target lunas 24 bulan: butuh ${rp(need)} per bulan, kekurangan ${rp(Math.max(0,need-room))} per bulan.</small>
  <small style="margin-top:8px">Urutan bayar ekstra (bunga tertinggi dulu): ${order.map((d,i)=>`${i+1}. ${esc(d.title)}`).join(' · ')}</small></section>`;
}

const IC={home:'M3 11l9-8 9 8M5 10v10h14V10',trx:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',bud:'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8a4 4 0 100 8 4 4 0 000-8z',wlt:'M6 3h12l4 6-10 12L2 9zM2 9h20',more:'M5 12h.01M12 12h.01M19 12h.01'};
const TABS={home:'Beranda',trx:'Transaksi',bud:'Anggaran',wlt:'Aset & Utang',more:'Pengaturan'};
const bookBar=()=>{if(!BKON())return '';const cur=bkc(),all=books().slice().sort((a,b)=>a===cur?-1:b===cur?1:0);return `<section class="vf-diary-panel" aria-label="Kelola Financial Diary">
 <div class="vf-diary-select">
  <div class="vf-diary-head"><div class="vf-diary-heading"><span class="vf-diary-heading-icon">📚</span><span><small>PILIHAN DIARY</small><b>Kelola Diary</b></span></div><span class="vf-diary-count">${all.length} ${all.length===1?'buku':'buku'}</span></div>
  <div class="vf-diary-books" aria-label="Pilih diary">${all.map(b=>`<button class="vf-diary-book ${b===cur?'active':''}" data-a="fbk" data-i="${esc(b)}"${b===cur?' aria-current="page"':''}><span class="vf-diary-book-icon">📒</span><span class="vf-diary-book-name">${esc(b)}</span>${b===cur?'<span class="vf-diary-current">AKTIF</span>':''}</button>`).join('')}</div>
 </div>
 <div class="vf-diary-actions"><button class="vf-diary-action vf-diary-new" data-a="fnewbk"><span class="vf-diary-action-icon">＋</span><span>Diary baru</span></button><button class="vf-diary-action" data-a="frename" aria-label="Ubah nama atau hapus diary"><span class="vf-diary-action-icon">✎</span><span>Ubah / Hapus</span></button><button class="vf-diary-action" data-a="fdupbk" aria-label="Duplikat diary"><span class="vf-diary-action-icon">⧉</span><span>Duplikat</span></button></div>
 </section>`};
const mnav=()=>hm?'':`<div class="mn"><button data-a="mp" aria-label="Bulan sebelumnya">‹</button><b>${ml(month)}</b><button data-a="mx" aria-label="Bulan berikutnya">›</button></div>`;
const row=t=>{const tr=t.type==='transfer',c=t.type==='income'?'in':tr?'tf':'out',sg=t.type==='income'?'+':tr?'':'−';return `<button class="r" data-a="edit" data-i="${t.id}"><span class="dot" style="background:${col(t.category)}">${esc(S.icons[t.category]||(t.category||'?')[0])}</span><span class="rm"><b>${t.bm?'★ ':''}${pcount(t)?'📎 ':''}${esc(t.note||t.category)}</b><small>${esc(tr?t.wallet+' → '+t.toWallet:t.category+' · '+t.wallet)}</small></span><span class="${c} am">${sg}${rp(t.amount)}</span></button>`};
const sorted=a=>[...a].sort((x,y)=>td(y).localeCompare(td(x))||y.id-x.id);

function onboard(){
  if(S.onboarded)return '';
  const st=[[Object.values(S.walletOpeningBalances).some(v=>+v),'Isi saldo awal dompet & rekening','wallets'],[S.transactions.length>0,'Catat transaksi pertama','add'],[Object.keys(S.budgets).length>0,'Atur batas anggaran bulanan','budadd']];
  if(st.every(s=>s[0])){S.onboarded=true;return ''}
  return `<section class="c"><h3>Mulai dalam 3 langkah <button class="b s" data-a="skip">Sembunyikan</button></h3>${st.map((s,i)=>`<button class="st ${s[0]?'ok':''}" data-a="${s[2]}"><i>${s[0]?'✓':i+1}</i><span>${s[1]}</span></button>`).join('')}</section>`;
}
function chart(){
  const d=[];for(let i=5;i>=0;i--){const m=sm(iso().slice(0,7),-i),a=inM(m);d.push([m,sum(a,'income'),sum(a,'expense')])}
  const mx=Math.max(1,...d.flatMap(x=>[x[1],x[2]]));
  return `<svg viewBox="0 0 312 130" width="100%" role="img" aria-label="Diagram pemasukan dan pengeluaran 6 bulan">${d.map((x,i)=>{const X=i*52+10,h1=x[1]/mx*90,h2=x[2]/mx*90;return `<rect x="${X}" y="${100-h1}" width="18" height="${h1}" rx="4" fill="var(--in)"/><rect x="${X+21}" y="${100-h2}" width="18" height="${h2}" rx="4" fill="var(--out)"/><text x="${X+19}" y="118" text-anchor="middle">${new Date(+x[0].slice(0,4),+x[0].slice(5)-1,1).toLocaleDateString('id-ID',{month:'short'})}</text>`}).join('')}</svg><small><span class="in">■</span> Pemasukan &nbsp;<span class="out">■</span> Pengeluaran</small>`;
}
function home(){
  const X=embed(),a=inM(month),i=sum(a,'income'),o=sum(a,'expense'),n=i-o,by=Object.entries(spentBy(month)).sort((x,y)=>y[1]-x[1]).slice(0,5);
  const al=[];
  Object.entries(S.budgets).forEach(([c,l])=>{const s=spentBy(month)[c]||0;if(l&&s>=l*.8&&month===iso().slice(0,7))al.push(`<section class="c al ${s>l?'x':''}">${s>l?'Anggaran':'Hampir habis:'} <b>${esc(c)}</b> ${s>l?'terlampaui '+rp(s-l):'terpakai '+Math.round(s/l*100)+'%'}</section>`)});
  S.activeDebts.filter(d=>d.principal>0&&d.dueISO&&days(d.dueISO)<=7).forEach(d=>{const k=days(d.dueISO);al.push(`<section class="c al ${k<0?'x':''}">Utang <b>${esc(d.title)}</b> ${k<0?'terlambat '+-k+' hari':k===0?'jatuh tempo hari ini':'jatuh tempo '+k+' hari lagi'}</section>`)});
  al.push(...dueAlerts());
  return bookBar()+onboard()+`<section class="c hero"><small>Kekayaan bersih (kas + aset − utang)</small><h2>${rp(cash()+assets()+owedMe()-debts())}</h2><p>Kas ${rp(cash())} · Aset ${rp(assets())} · Utang ${rp(debts())}</p><div class="hm" style="height:10px">${(Math.max(0,cash())+Math.max(0,assets())+Math.max(0,debts()))>0?`<i style="flex:${Math.max(0,cash())};background:var(--in)"></i><i style="flex:${Math.max(0,assets())};background:var(--ac)"></i><i style="flex:${Math.max(0,debts())};background:var(--out)"></i>`:`<i style="flex:1;background:var(--ln,rgba(128,128,128,.25))"></i>`}</div><small>Hijau kas · kuning aset · merah utang</small></section>`+al.join('')+mnav()+
  `<section class="g2"><div class="c"><small>Pemasukan</small><b class="in">${rp(i)}</b></div><div class="c"><small>Pengeluaran</small><b class="out">${rp(o)}</b></div></section>
  ${gauge(i,o,n)}
  ${walletCard()}
  ${trend()}${last7()}<section class="c"><h3>Arus kas 6 bulan</h3>${chart()}</section>
  <section class="c"><h3>Pengeluaran terbesar</h3>${by.length?by.map(([c,v])=>`<div><div class="h" style="margin:0;font-weight:500"><span>${esc(c)}</span><span class="am">${rp(v)}</span></div><div class="bar"><i style="width:${v/o*100}%;background:${col(c)}"></i></div></div>`).join(''):'<p class="em">Belum ada pengeluaran bulan ini.</p>'}</section>
  <section class="c"><h3>Terbaru <button class="b s" data-a="tab" data-i="trx">Lihat semua</button></h3>${S.transactions.length?sorted(S.transactions).slice(0,5).map(row).join(''):'<p class="em">Belum ada transaksi. Tekan tombol + untuk mencatat yang pertama.</p>'}</section>${X}`;
}
function listHTML(){
  let a=inM(month);
  if(ft==='bm')a=a.filter(t=>t.bm);else if(ft==='ph')a=a.filter(t=>pcount(t));else if(ft!=='all')a=a.filter(t=>t.type===ft);
  if(q)a=a.filter(t=>(t.note+' '+t.category+' '+t.wallet).toLowerCase().includes(q.toLowerCase()));
  if(!a.length)return '<p class="em">Tidak ada transaksi yang cocok.</p>';
  let last='';return sorted(a).map(t=>{const d=td(t),h=d!==last?`<p class="dh">${fd(d)}</p>`:'';last=d;return h+row(t)}).join('');
}
function trx(){
  const a=inM(month);
  return bookBar()+mnav()+`<section class="g2"><div class="c"><small>Masuk</small><b class="in">${rp(sum(a,'income'))}</b></div><div class="c"><small>Keluar</small><b class="out">${rp(sum(a,'expense'))}</b></div></section>
  ${photoSave()}${assetGraph()}<input id="q" type="search" placeholder="Cari catatan, kategori, dompet" value="${esc(q)}">
  <div class="chips">${[['all','Semua'],['income','Masuk'],['expense','Keluar'],['transfer','Pindah'],['bm','★ Ditandai'],['ph','📎 Foto']].map(([k,l])=>`<button class="chip ${ft===k?'on':''}" data-a="ft" data-i="${k}">${l}</button>`).join('')}</div>
  <section class="c" id="tl">${listHTML()}</section>
  <div class="row"><button class="b" data-a="csv">Ekspor CSV bulan ini</button></div>`;
}
function bud(){
  const by=spentBy(month),B=Object.entries(S.budgets),tb=B.reduce((s,x)=>s+(+x[1]||0),0),ts=B.reduce((s,x)=>s+(by[x[0]]||0),0),now=iso().slice(0,7)===month;
  const left=new Date(+month.slice(0,4),+month.slice(5),0).getDate()-new Date().getDate()+1;
  return mnav()+adviceCard()+bpCard()+`<section class="c"><h3>Anggaran bulanan <button class="b s p" data-a="budadd">+ Tambah</button></h3>${B.length?`<small>Terpakai ${rp(ts)} dari ${rp(tb)}${now&&tb>ts&&left>0?' · aman dipakai ±'+rp((tb-ts)/left)+' per hari':''}</small>`+B.map(([c,l])=>{const s=by[c]||0,p=l?s/l*100:0;return `<button class="r" style="display:block" data-a="budedit" data-i="${esc(c)}"><div class="h" style="margin:0;font-weight:500"><span>${esc(c)}</span><span class="am ${s>l?'out':''}">${rp(s)} / ${rp(l)}</span></div><div class="bar ${p>100?'ov':p>=80?'w8':''}"><i style="width:${Math.min(100,p)}%"></i></div><small>${s>l?'Lebih '+rp(s-l):'Sisa '+rp(l-s)}</small></button>`}).join(''):'<p class="em">Belum ada anggaran. Tetapkan batas per kategori agar pengeluaran terkendali.</p>'}</section>
  <section class="c"><h3>Target tabungan <button class="b s p" data-a="goaladd">+ Tambah</button></h3>${S.goals.length?S.goals.map(g=>{const p=g.target?Math.min(100,g.current/g.target*100):0;return `<div style="padding:8px 0"><div class="h" style="margin:0;font-weight:500"><span>${esc(g.name)}</span><span class="am">${Math.round(p)}%</span></div><div class="bar"><i style="width:${p}%"></i></div><div class="h" style="margin:0"><small>${rp(g.current)} / ${rp(g.target)}</small><span><button class="b s" data-a="goalfund" data-i="${g.id}">+ Dana</button> <button class="b s" data-a="goaledit" data-i="${g.id}">Ubah</button></span></div></div>`}).join(''):'<p class="em">Belum ada target. Contoh: Dana darurat, liburan, DP rumah.</p>'}</section>`;
}
let wt='utang';
const ICS={smile:'<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2.5 4 2.5S16 14 16 14M9 9.5h.01M15 9.5h.01"/>',happy:'<circle cx="12" cy="12" r="9"/><path d="M8 13c1 3.2 7 3.2 8 0M9 9h.01M15 9h.01"/>',sparkle:'<path d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',person:'<circle cx="12" cy="8" r="4"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/>',yoga:'<circle cx="12" cy="5" r="2"/><path d="M12 8v5M7 21l5-8 5 8M5 12l7 1 7-1"/>',stand:'<circle cx="12" cy="4.5" r="2"/><path d="M12 7v7M6 10l6 1 6-1M9 21l3-7 3 7"/>'};
const ICN=[['smile','Senyum'],['happy','Ceria'],['sparkle','Berkilau'],['person','Orang'],['yoga','Tenang'],['stand','Berdiri']];
const hue=c=>[...String(c)].reduce((h,x)=>(h*31+x.charCodeAt(0))>>>0,7)%360;
const av=(n,ic)=>{const h=hue(n),k=ICS[ic]?ic:Object.keys(ICS)[h%6];return `<span style="width:54px;height:54px;border-radius:14px;background:hsl(${h} 75% 55%/.16);display:grid;place-items:center;flex:none"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="hsl(${h} 70% 55%)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICS[k]}</svg></span>`};
const ILL='<svg viewBox="0 0 120 90" width="112" aria-hidden="true"><rect x="6" y="50" width="64" height="32" rx="8" fill="#fff" opacity=".85"/><rect x="18" y="38" width="64" height="32" rx="8" fill="#fff" opacity=".55"/><circle cx="88" cy="38" r="24" fill="var(--ac)"/><circle cx="88" cy="38" r="17" fill="none" stroke="#1a1305" stroke-width="2" opacity=".4"/><text x="88" y="44" text-anchor="middle" style="fill:#1a1305;font-size:16px;font-weight:800">Rp</text><path d="M26 18h28M48 12l6 6-6 6" stroke="var(--ac)" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const drow=d=>{const o=+d.orig||d.principal,pc=d.principal>0?(o>0?Math.max(0,Math.round((o-d.principal)/o*100)):0):100,c=pc>=50?'#34c759':pc>=30?'#ffcc00':'#ff3b30',ow=d.dir==='owed',k=d.dueISO&&d.principal>0?days(d.dueISO):null;
  return `<div class="dr"><div style="display:flex;align-items:center;gap:12px">${av(d.title,d.ico)}<div style="flex:1;min-width:0"><b style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(d.title)}</b><span class="am ${ow?'in':'out'}" style="font-size:17px">${d.principal>0?(ow?'':'−')+rp(d.principal):'Lunas'}</span></div><small style="align-self:flex-end">${pc}%</small><div class="vb" title="${pc}% terbayar"><i style="height:${Math.max(pc,6)}%;background:${c}"></i></div></div>${d.installmentAmount||k!==null?`<small style="margin-top:6px">${d.installmentAmount?'Cicilan '+rp(d.installmentAmount):''}${d.installmentAmount&&k!==null?' · ':''}${k!==null?'Jatuh tempo '+fd(d.dueISO)+(k<0?' (terlambat)':k<=7?' ('+k+' hari lagi)':''):''}</small>`:''}<div class="row" style="margin-top:8px"><button class="b s" data-a="debtpay" data-i="${d.id}"${d.principal>0?'':' disabled'}>${ow?'Terima':'Bayar'}</button><button class="b s" data-a="debtedit" data-i="${d.id}">Ubah</button></div></div>`};
function wlt(){const net=cash()+assets()+owedMe()-debts(),plus=wt==='akun'?'assetadd':wt==='utang'?'debtadd':'';
  const hd=`<section class="c dbn"><h2>Lacak utang dan pinjaman Anda</h2>${ILL}</section><section class="c" style="padding-bottom:0"><div style="display:flex;justify-content:space-between;align-items:flex-start"><span style="width:40px"></span><div style="text-align:center"><small>Saldo keseluruhan</small><b style="font-size:28px;display:block;font-variant-numeric:tabular-nums">${rp(net)}</b></div>${plus?`<button class="b s p" data-a="${plus}" aria-label="Tambah" style="width:40px;text-align:center">+</button>`:'<span style="width:40px"></span>'}</div><div class="tb">${[['akun','Akun'],['utang','Utang'],['total','Total']].map(([k,l])=>`<button class="${wt===k?'on':''}" data-a="wt" data-i="${k}">${l}</button>`).join('')}</div></section><div class="s3"><button class="c" data-a="wt" data-i="akun"><small>Total aset</small><b class="in">${rp(assets())}</b></button><button class="c" data-a="wt" data-i="utang"><small>Sisa utang</small><b class="out">${rp(debts())}</b></button><button class="c" data-a="wt" data-i="utang"><small>Berutang kepada saya</small><b class="in">${rp(owedMe())}</b></button></div>`;
  const L1=S.activeDebts.filter(d=>d.dir!=='owed'),L2=S.activeDebts.filter(d=>d.dir==='owed'),em='<p class="em">Belum ada data. Tekan + untuk menambah.</p>';
  if(wt==='akun')return hd+`<div class="pl"><span>Total aset</span><b class="in">${rp(assets())}</b></div>`+(S.assets.length?S.assets.map(x=>`<button class="dr" style="display:flex;gap:12px;align-items:center;text-align:left" data-a="assetedit" data-i="${x.id}">${av(x.name,'')}<span class="rm"><b>${esc(x.name)}</b><small>${esc(x.type)}</small></span><span class="am in">${rp(x.value)}</span></button>`).join(''):'<p class="em">Catat emas, properti, kendaraan, investasi, atau tabungan Anda.</p>');
  if(wt==='total'){const it=[['Kas',Math.max(0,cash()),'#34c759'],['Aset',assets(),'#ffcc00'],['Piutang',owedMe(),'#3f8cff']];
    return hd+`<section class="c">${donut(it,['Saldo keseluruhan',rp(net)])}</section>`+it.map(x=>`<div class="pl"><span><i style="display:inline-block;width:12px;height:12px;border-radius:4px;background:${x[2]};margin-right:8px"></i>${x[0]}</span><b class="in">${rp(x[1])}</b></div>`).join('')+`<div class="pl"><span>Saya berutang</span><b class="out">−${rp(debts())}</b></div>`}
  return hd+`<div class="pl"><span>Saya berutang</span><b class="out">−${rp(debts())}</b></div>${L1.map(drow).join('')||em}<div class="pl"><span>Berutang kepada saya</span><b class="in">${rp(owedMe())}</b></div>${L2.map(drow).join('')||em}<section class="c"><div class="h" style="margin:0"><small>Posisi bersih</small><b class="am ${owedMe()-debts()<0?'out':'in'}">${owedMe()-debts()<0?'−':''}${rp(Math.abs(owedMe()-debts()))}</b></div><div class="hm" style="height:12px"><i style="flex:${debts()||0.001};background:var(--out)"></i><i style="flex:${owedMe()||0.001};background:var(--in)"></i></div><small>Merah utang Anda · hijau piutang Anda</small></section>`+debtAdviceCard()}
function more(){
  hm=1;const TM=tema();hm=0;
  return TM+`<section class="c"><h3>Kategori <button class="b s p" data-a="catadd">+ Tambah</button></h3><small>Pemasukan</small><div class="chips">${S.catInc.map(c=>`<button class="chip" data-a="catdel" data-i="income|${esc(c)}">${esc(c)} ×</button>`).join('')}</div><small style="margin-top:10px">Pengeluaran</small><div class="chips">${S.catExp.map(c=>`<button class="chip" data-a="catdel" data-i="expense|${esc(c)}">${esc(c)} ×</button>`).join('')}</div></section>
  <section class="c"><h3>Tampilan</h3><div class="chips">${[['auto','Otomatis'],['dark','Gelap'],['light','Terang']].map(([k,l])=>`<button class="chip ${S.settings.theme===k?'on':''}" data-a="theme" data-i="${k}">${l}</button>`).join('')}</div></section>
  <section class="c"><h3>Bahasa & mata uang</h3><button class="b" data-vflang="1" data-no-i18n="1">🌐 Language / Bahasa</button><button class="b" data-vflang="1" data-no-i18n="1" style="margin-top:8px">${window.VFC?VFC.CUR[VFC.code][4]+' '+(VFC.lang==='en'?'Currency':'Mata uang')+': '+VFC.code+' ('+VFC.symT+')':'Mata uang'}</button></section>
  <section class="c"><h3>Cadangan data</h3><small style="margin-bottom:10px">Data hanya ada di perangkat ini. Ekspor cadangan secara berkala, terutama sebelum membersihkan data browser.</small>${stg()}<div class="row"><button class="b" data-a="exp">Ekspor JSON</button><button class="b" data-a="imp">Impor JSON</button></div><div class="row" style="margin-top:8px"><button class="b" data-a="csvall">Ekspor semua CSV</button><button class="b d" data-a="clear">Hapus semua</button></div></section>
  <section class="c"><h3>Cara pakai</h3><small>1. Isi saldo awal tiap dompet.<br>2. Tekan + untuk mencatat pemasukan, pengeluaran, atau pindah saldo antar dompet.<br>3. Atur anggaran per kategori di tab Anggaran.<br>4. Catat aset dan utang di tab Aset & Utang agar kekayaan bersih akurat.</small></section>`;
}
let dg='expense',cd=iso();
const PAL=['#f44336','#03a9f4','#4caf50','#ff9800','#ffeb3b','#9c27b0','#009688','#e91e63'],AC=['#f0b84a','#4fd1a5','#4aa3f0','#f06a6a','#b574f0','#ff8f3f'];
const ad=(i,n)=>{const[y,m,d]=i.split('-').map(Number);return iso(new Date(y,m-1,d+n))};
const dn=i=>{const[y,m,d]=i.split('-').map(Number);return new Date(y,m-1,d).getTime()};
const fl=i=>{const[y,m,d]=i.split('-').map(Number);return new Date(y,m-1,d,12).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})};
const bk=t=>hm?`<h2 class="sc">${t}</h2>`:`<div class="bk"><button class="b s" data-a="sub" data-i="" aria-label="Kembali">‹</button>${t}</div>`;
const bycat=ty=>{const by={};inM(month).filter(t=>t.type===ty).forEach(t=>by[t.category]=(by[t.category]||0)+(+t.amount||0));return Object.entries(by).sort((a,b)=>b[1]-a[1])};
const dgc=()=>`<div class="chips">${[['expense','Pengeluaran'],['income','Pemasukan']].map(([k,l])=>`<button class="chip ${dg===k?'on':''}" data-a="dg" data-i="${k}">${l}</button>`).join('')}</div>`;
function occ(m){const r={};[...S.sched,...S.subs.map(x=>({...x,every:x.period==='year'?12:1}))].forEach(x=>{for(let i=0;i<600;i++){const d=addM(x.next,i*(x.every||1));if(d>m+'-31')break;if(d.startsWith(m))(r[d]=r[d]||[]).push(x);if(!x.every)break}});return r}
function donut(it,ct,si){const t=it.reduce((s,x)=>s+x[1],0),R=70,C=2*Math.PI*R;let o=0;
  return `<svg viewBox="0 0 200 200" width="100%" style="max-width:260px;display:block;margin:auto"><circle cx="100" cy="100" r="${R}" fill="none" stroke="var(--ln)" stroke-width="34"/><g transform="rotate(-90 100 100)">${t?it.map((x,i)=>{const l=x[1]/t*C,e=`<circle cx="100" cy="100" r="${R}" fill="none" stroke="${x[2]}" stroke-width="${i===si?46:34}" stroke-dasharray="${Math.max(l-1,0)} ${C-l+1}" stroke-dashoffset="${-o}"/>`;o+=l;return e}).join(''):''}</g><text x="100" y="98" text-anchor="middle" style="fill:var(--tx);font-size:12px;font-weight:700">${esc(ct[0])}</text><text x="100" y="115" text-anchor="middle">${esc(ct[1])}</text></svg>`}
function diag(){const L=bycat(dg),T=L.reduce((s,x)=>s+x[1],0),pv={};
  S.transactions.filter(t=>t.type===dg&&td(t).startsWith(sm(month,-1))).forEach(t=>pv[t.category]=(pv[t.category]||0)+(+t.amount||0));
  const i0=Math.min(dsel,Math.max(0,L.length-1)),sl=L[i0];
  return bk('Diagram')+dgc()+`<section class="c">${T?donut(L.map((x,i)=>[x[0],x[1],PAL[i%8]]),[sl[0],rp(sl[1])+' · '+(sl[1]/T*100).toFixed(1)+'%'],i0)+`<div class="hm" style="height:12px;margin-top:14px">${L.map((x,i)=>`<i style="flex:${x[1]};background:${PAL[i%8]}"></i>`).join('')}</div><small style="text-align:center">Ketuk kategori di bawah untuk menyorot irisan.</small>`:'<p class="em">Belum ada data bulan ini.</p>'}</section><section class="c">${L.map((x,i)=>{const p=pv[x[0]],dl=p?Math.round((x[1]-p)/p*100):null;return `<button class="r" data-a="dsel" data-i="${i}" style="${i===i0?'background:var(--bg);border-radius:10px;padding-left:6px':''}"><i style="width:22px;height:22px;border-radius:6px;background:${PAL[i%8]};flex:none"></i><span class="rm"><b>${esc(x[0])}</b><small class="${dl===null?'':(dg==='expense')===(dl>0)?'out':'in'}">${dl===null?'Baru bulan ini':(dl>0?'▲ ':dl<0?'▼ ':'= ')+Math.abs(dl)+'% dari bulan lalu'}</small></span><small>${Math.round(x[1]/T*100)}%</small><span class="am">${rp(x[1])}</span></button>`}).join('')}<div class="h" style="justify-content:flex-end;margin:8px 0 0">Total: <span class="am ${dg==='expense'?'out':'in'}">${rp(T)}</span></div></section>`}
function kal(){const[y,m]=month.split('-').map(Number),f=(new Date(y,m-1,1).getDay()+6)%7,n=new Date(y,m,0).getDate(),oc=occ(month),ex=[];
  for(let d=1;d<=n;d++)ex.push(sum(TX().filter(t=>td(t)===`${month}-${String(d).padStart(2,'0')}`),'expense'));
  const mx=Math.max(1,...ex);
  let c=['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(x=>`<div class="hd">${x}</div>`).join('')+'<span></span>'.repeat(f);
  for(let d=1;d<=n;d++){const k=`${month}-${String(d).padStart(2,'0')}`,a=TX().filter(t=>td(t)===k),i=sum(a,'income'),o=ex[d-1],net=i-o,v=Math.abs(net);
    c+=`<button class="${k===cd?'sel':''}" data-a="cd" data-i="${k}" style="background:${k===cd?'':o?`color-mix(in srgb,var(--out) ${Math.round(o/mx*38)}%,transparent)`:''};${k===iso()?'outline:2px solid var(--ac)':''}"><div>${d}</div><div style="font-size:8px;line-height:10px;min-height:10px">${i?'<span class="in">●</span>':''}${o?'<span class="out">●</span>':''}${oc[k]?'<span class="out">▼</span>':''}</div><small class="${net<0?'out':'in'}">${net?(v>=1e6?(v/1e6).toFixed(1)+(window.VFC&&VFC.on?'M':'jt'):v>=1e3?Math.round(v/1e3)+'k':v):''}</small></button>`}
  const a=TX().filter(t=>td(t)===cd),i=sum(a,'income'),o=sum(a,'expense'),T=ex.reduce((x,y)=>x+y,0);
  return bk('Kalender')+mnav()+`<section class="c"><div class="cal">${c}</div><small style="margin-top:8px">Warna merah makin pekat = pengeluaran harian makin besar · ▼ jadwal · garis aksen = hari ini</small><div class="hm"><i style="flex:${i||0.001};background:var(--in)"></i><i style="flex:${T||0.001};background:var(--out)"></i></div></section><section class="c"><h3>${fl(cd)} <span class="am ${i-o<0?'out':'in'}">${rp(i-o)}</span></h3><small>Pemasukan ${rp(i)} · Pengeluaran ${rp(o)}</small>${a.map(row).join('')||'<p class="em">Tidak ada transaksi di tanggal ini.</p>'}${(occ(cd.slice(0,7))[cd]||[]).map(x=>`<small class="out">▼ Terjadwal: ${esc(x.name)} ${rp(x.amount)}</small>`).join('')}</section>`}
function ring(){const ms=[...new Set(S.transactions.map(t=>td(t).slice(0,7)).filter(Boolean))].sort().reverse(),D=ms.map(m=>{const a=inM(m);return[m,sum(a,'income'),sum(a,'expense')]}),best=[...D].sort((a,b)=>(b[1]-b[2])-(a[1]-a[2]))[0];
  return bk('Ringkasan')+(best?`<section class="c"><small>Bulan terbaik</small><b class="${best[1]-best[2]<0?'out':'in'}" style="font-size:18px">${ml(best[0])} · ${rp(best[1]-best[2])}</b></section>`:'')+(D.length?D.map(([m,i,o])=>{const r=i?Math.round((i-o)/i*100):null;return `<button class="c" style="display:flex;gap:12px;align-items:center;width:100%" data-a="gm" data-i="${m}"><div style="width:80px;flex:none">${donut([['',i,'var(--in)'],['',o,'var(--out)']],['',''])}</div><div style="flex:1"><b>${ml(m)}</b>${kv('Pemasukan',rp(i),'in')}${kv('Pengeluaran',rp(o),'out')}${kv('Total',rp(i-o),i-o<0?'out':'in')}<div class="hm"><i style="flex:${i||0.001};background:var(--in)"></i><i style="flex:${o||0.001};background:var(--out)"></i></div><small>${r===null?'Tanpa pemasukan':r>=0?'Tabungan '+r+'% dari pemasukan':'Defisit '+-r+'% dari pemasukan'}</small></div></button>`}).join(''):'<p class="em">Belum ada transaksi.</p>')}
function langg(){const now=iso(),ev=[];
  S.subs.forEach(x=>{const e=x.period==='year'?12:1;{const dom=+x.next.slice(8);while(x.next<now)x.next=addM(x.next,e,dom)}for(let i=0;i<14;i++){const d=addM(x.next,i*e);if(d>addM(now,12))break;ev.push([d,+x.amount])}});
  const mo=[...Array(8)].map((_,i)=>{const m=sm(now.slice(0,7),i);return[m,ev.filter(e=>e[0].startsWith(m)).reduce((s,e)=>s+e[1],0)]}),mx=Math.max(1,...mo.map(x=>x[1])),w=n=>ev.filter(e=>e[0]<=ad(now,n)).reduce((s,e)=>s+e[1],0),avg=S.subs.reduce((s,x)=>s+x.amount/(x.period==='year'?12:1),0);
  const svg=`<svg viewBox="0 0 320 130" width="100%">${mo.map((x,i)=>{const X=i*39+6,h=x[1]/mx*80;return `<rect x="${X}" y="${100-h}" width="30" height="${Math.max(h,2)}" rx="5" fill="${i?'var(--out)':'var(--ac)'}"/><text x="${X+15}" y="${94-h}" text-anchor="middle">${x[1]?Math.round(x[1]/1000)+'k':''}</text><text x="${X+15}" y="116" text-anchor="middle">${x[0].slice(5)}/${x[0].slice(2,4)}</text>`}).join('')}</svg>`;
  const dn2=S.subs.map((x,i)=>[x.name,x.amount/(x.period==='year'?12:1),PAL[i%8]]);
  return bk('Berlangganan')+`<section class="c">${svg}</section><section class="c">${S.subs.length?donut(dn2,['Per bulan',rp(avg)]):''}${kv('30 hari ke depan','−'+rp(w(30)),'out')}${kv('365 hari ke depan','−'+rp(w(365)),'out')}${kv('Rata-rata bulanan','−'+rp(avg),'out')}<small>Jumlah langganan: ${S.subs.length}</small></section>`+
  S.subs.map((x,j)=>{const e=x.period==='year'?12:1,last=addM(x.next,-e),p=Math.max(0,Math.min(1,(dn(now)-dn(last))/(dn(x.next)-dn(last)))),c=p>.85?'var(--out)':p>.65?'var(--ac)':'var(--in)',k=days(x.next);
    return `<section class="c" style="border-left:5px solid ${PAL[j%8]}"><div class="h" style="margin:0"><b>${esc(x.name)}</b><span class="bdg">${k<=0?'hari ini':k+' hari lagi'}</span></div><div class="h" style="margin:4px 0 0"><small>${fd(last)}</small><small><b>${Math.round(p*100)}%</b></small><small>${fd(x.next)}</small></div><div class="bar"><i style="width:${p*100}%;background:${c}"></i></div><div class="h" style="margin:0"><span><b>${rp(x.amount)}</b> setiap ${e===12?'tahun':'bulan'}<small>${rp(x.amount/e)} / bulan = ${rp(x.amount*12/e)} / tahun</small></span><button class="b s" data-a="subedit" data-i="${x.id}">Ubah</button></div></section>`}).join('')+(S.subs.length?'':'<p class="em">Belum ada langganan. Catat Netflix, Spotify, atau tagihan rutin lain.</p>')+`<button class="b p" data-a="subadd">+ Tambah langganan</button>`}
function jad(){const L=[...S.sched].sort((a,b)=>a.next.localeCompare(b.next)),by={},mm=iso().slice(0,7);
  Object.values(occ(mm)).flat().filter(x=>x.category).forEach(x=>by[x.category]=(by[x.category]||0)+(+x.amount||0));const T=Object.values(by).reduce((a,b)=>a+b,0),B=Object.entries(by);
  const o1={...occ(mm),...occ(sm(mm,1))},st=[...Array(30)].map((_,i)=>{const k=ad(iso(),i);return[k,(o1[k]||[]).reduce((s,x)=>s+(+x.amount||0),0)]}),mx=Math.max(1,...st.map(x=>x[1]));
  return bk('Pembayaran terjadwal dan berulang')+`<section class="c"><h3>30 hari ke depan <span class="am out">${rp(st.reduce((s,x)=>s+x[1],0))}</span></h3><svg viewBox="0 0 320 90" width="100%">${st.map((x,i)=>{const h=x[1]/mx*50;return `<rect x="${i*10.5+1}" y="${60-h}" width="8" height="${Math.max(h,2)}" rx="3" fill="${x[1]?'var(--out)':'var(--ln)'}"/>${i%5===0?`<text x="${i*10.5+5}" y="78" text-anchor="middle">${x[0].slice(8)}</text>`:''}`}).join('')}</svg></section><section class="c"><h3>Terjadwal bulan ini <span class="am out">${rp(T)}</span></h3>${T?donut(B.map(([c,v],i)=>[c,v,PAL[i%8]]),['Bulan ini',rp(T)]):''}${B.map(([c,v],i)=>`<div class="h" style="margin:0;font-weight:500"><span>${esc(c)}</span><span class="am">${rp(v)} · ${Math.round(v/T*100)}%</span></div><div class="bar"><i style="width:${v/T*100}%;background:${PAL[i%8]}"></i></div>`).join('')||'<p class="em">Belum ada jadwal bulan ini.</p>'}</section><button class="b p" data-a="schedadd">+ Tambah pembayaran</button>`+
  L.map(x=>{const k=days(x.next);return `<section class="c" style="border-left:5px solid ${col(x.category)}"><div class="h" style="margin:0"><small>${fl(x.next)}</small><span class="bdg">${k<0?'terlambat '+-k+' hari':k===0?'hari ini':k+' hari lagi'}</span></div><div class="r" style="border:0"><span class="dot" style="background:${col(x.category)}">${esc(S.icons[x.category]||x.category[0])}</span><span class="rm"><b>${esc(x.name)}</b><small>${esc(x.category)} · ${esc(x.wallet)}</small></span><span class="am out">${rp(x.amount)}</span></div><small>🔁 ${x.every?'Setiap '+x.every+' bulan':'Satu kali'}</small>${x.remind?`<small>🔔 ${x.remind} hari sebelumnya</small>`:''}<div class="row" style="margin-top:8px"><button class="b s" data-a="schedpay" data-i="${x.id}">Catat bayar</button><button class="b s" data-a="schededit" data-i="${x.id}">Ubah</button></div></section>`}).join('')}
function wawas(){const[y,m]=month.split('-').map(Number),n=new Date(y,m,0).getDate(),d=Array(n).fill(0),wd=Array(7).fill(0);
  inM(month).filter(t=>t.type===dg).forEach(t=>{const v=+t.amount||0,i=+td(t).slice(8)-1;d[i]+=v;wd[(new Date(y,m-1,i+1).getDay()+6)%7]+=v});
  const mx=Math.max(1,...d),T=d.reduce((a,b)=>a+b,0),L=bycat(dg),cl=dg==='expense'?'var(--out)':'var(--in)',wm=Math.max(1,...wd);let c=0;const cum=d.map(v=>c+=v),bl=dg==='expense'?Object.values(S.budgets).reduce((a,b)=>a+(+b||0),0):0,cm=Math.max(1,T,bl),P=cum.map((v,i)=>`${i*(300/Math.max(1,n-1))+10},${95-v/cm*80}`).join('L');
  return bk('Wawasan')+mnav()+dgc()+`<section class="c"><h3>Per hari <span class="am">${rp(T/n)} / hari</span></h3><svg viewBox="0 0 ${n*10} 100" width="100%" preserveAspectRatio="none" style="height:130px">${d.map((v,i)=>`<rect x="${i*10+1}" y="${95-v/mx*90}" width="8" height="${Math.max(v/mx*90,1)}" fill="${cl}" rx="2"/>`).join('')}</svg>${T?`<small>Tertinggi ${rp(mx)} pada tanggal ${d.indexOf(mx)+1}</small>`:''}</section><section class="c"><h3>Akumulasi bulan ini <span class="am">${rp(T)}</span></h3><svg viewBox="0 0 320 110" width="100%"><path d="M${P}L310,95L10,95Z" fill="${cl}" opacity=".18"/><path d="M${P}" fill="none" stroke="${cl}" stroke-width="2.5" stroke-linejoin="round"/>${bl?`<line x1="10" x2="310" y1="${95-bl/cm*80}" y2="${95-bl/cm*80}" stroke="var(--ac)" stroke-dasharray="5 4"/><text x="310" y="${90-bl/cm*80}" text-anchor="end">Anggaran ${rp(bl)}</text>`:''}</svg></section><section class="c"><h3>Per hari dalam seminggu</h3><svg viewBox="0 0 320 100" width="100%">${wd.map((v,i)=>{const h=v/wm*60;return `<rect x="${i*45+8}" y="${75-h}" width="30" height="${Math.max(h,2)}" rx="6" fill="${v===wm&&v?'var(--ac)':cl}"/><text x="${i*45+23}" y="92" text-anchor="middle">${['Sen','Sel','Rab','Kam','Jum','Sab','Min'][i]}</text>`}).join('')}</svg></section><section class="c"><h3>Per kategori</h3>${L.map(([c,v],i)=>`<div class="h" style="margin:0;font-weight:500"><span>${esc(S.icons[c]||'')} ${esc(c)}</span><span class="am">${rp(v)} · ${Math.round(v/T*100)}%</span></div><div class="bar"><i style="width:${v/T*100}%;background:${PAL[i%8]}"></i></div>`).join('')||'<p class="em">Belum ada data.</p>'}</section>`}
function tema(){const ic=Object.entries(S.icons);return bk('Kustomisasi')+`<section class="c"><div style="height:74px;border-radius:14px;background:linear-gradient(135deg,var(--ac),var(--in));display:flex;align-items:flex-end;padding:10px 14px;color:#1a1305;font-weight:800;font-size:17px">Mindvesta Finance<span style="margin-left:auto;font-size:22px">${ic.slice(0,4).map(x=>x[1]).join(' ')}</span></div></section><section class="c"><h3>Tema</h3><div class="chips">${[['auto','Otomatis'],['dark','Gelap'],['light','Terang']].map(([k,l])=>`<button class="chip ${S.settings.theme===k?'on':''}" data-a="theme" data-i="${k}">${l}</button>`).join('')}</div></section><section class="c"><h3>Warna aksen</h3><div class="chips">${AC.map(c=>`<button class="chip" data-a="accent" data-i="${c}" style="background:${c};border-color:${c};color:#1a1305;width:44px;text-align:center" aria-label="Warna ${c}">${(S.settings.accent||AC[0])===c?'✓':'●'}</button>`).join('')}</div></section><section class="c"><h3>Ikon kategori</h3><small style="margin-bottom:8px">Ketuk kategori, lalu ketik satu emoji sebagai ikonnya.</small><div class="chips">${[...S.catExp,...S.catInc].map(c=>`<button class="chip" data-a="ico" data-i="${esc(c)}">${esc(S.icons[c]||'•')} ${esc(c)}</button>`).join('')}</div></section>`}
const GR=[['#7c4dff','#3f8cff'],['#00b894','#0a8f6a'],['#ff7a59','#e0457b'],['#f0b84a','#d9822b'],['#26a69a','#1565c0'],['#ab47bc','#6a1b9a']];
const gauge=(i,o,n)=>{const p=i>0?Math.max(0,Math.min(100,n/i*100)):0;return `<section class="c" style="display:flex;gap:16px;align-items:center"><div style="width:88px;height:88px;border-radius:50%;background:conic-gradient(${n<0?'var(--out)':'var(--in)'} ${p*3.6}deg,var(--ln) 0);display:grid;place-items:center;flex:none"><div style="width:64px;height:64px;border-radius:50%;background:var(--cd);display:grid;place-items:center;font-weight:800;font-size:17px">${Math.round(p)}%</div></div><div><small>Sisa bulan ini</small><b style="font-size:23px" class="${n<0?'out':'in'}">${rp(n)}</b><small>${i>0?(n>=0?'Ditabung '+Math.round(n/i*100)+'% dari pemasukan':'Defisit '+Math.round(-n/i*100)+'% dari pemasukan'):'Belum ada pemasukan bulan ini'}</small></div></section>`};
function walletCard(){const B=S.wallets.map(w=>bal(w)),T=B.reduce((a,b)=>a+Math.max(0,b),0)||1,m=inM(month);
  return `<h2 class="sc">Dompet & rekening</h2><section class="c"><div class="h" style="margin:0"><small>Total saldo kas</small><b class="am">${rp(cash())}</b></div><div class="hm" style="height:12px">${S.wallets.map((w,i)=>`<i style="flex:${Math.max(0,B[i])||0.001};background:${GR[i%6][0]}"></i>`).join('')}</div></section><div class="wl">${S.wallets.map((w,i)=>{const a=m.filter(t=>t.wallet===w),last=S.transactions.filter(t=>t.wallet===w).map(t=>td(t)).sort().pop();return `<button class="wc" data-a="walletedit" data-i="${esc(w)}" style="background:linear-gradient(135deg,${GR[i%6][0]},${GR[i%6][1]})"><small>${esc(w)}</small><b class="v">${rp(B[i])}</b><small>${Math.round(Math.max(0,B[i])/T*100)}% dari kas</small><small>▲ ${rp(sum(a,'income'))}</small><small>▼ ${rp(sum(a,'expense'))}</small><small>${last?'Terakhir dipakai '+fd(last):'Belum dipakai'}</small></button>`}).join('')}<button class="wc add" data-a="walletadd" aria-label="Tambah dompet"><span style="font-size:30px">+<small style="display:block;font-size:12px">Dompet baru</small></span></button></div>`}
const embed=()=>{hm=1;try{return [diag,kal,ring,langg,jad,wawas].map(f=>f()).join('')}finally{hm=0}};
function last7(){const d=[...Array(7)].map((_,i)=>{const k=ad(iso(),i-6);return[k,sum(TX().filter(t=>td(t)===k),'expense')]}),mx=Math.max(1,...d.map(x=>x[1]));
  return `<section class="c"><h3>Pengeluaran · 7 hari terakhir</h3><svg viewBox="0 0 320 120" width="100%">${d.map((x,i)=>{const X=i*45+8,h=x[1]/mx*70;return `<rect x="${X}" y="${90-h}" width="30" height="${Math.max(h,2)}" rx="5" fill="var(--out)"/><text x="${X+15}" y="${84-h}" text-anchor="middle">${x[1]?Math.round(x[1]/1000)+'k':''}</text><text x="${X+15}" y="108" text-anchor="middle">${x[0].slice(8)}/${x[0].slice(5,7)}</text>`}).join('')}</svg></section>`}
function dueAlerts(){const r=[];
  S.sched.forEach(x=>{const k=days(x.next);if(k<=(x.remind||0))r.push(`<section class="c al ${k<0?'x':''}">Terjadwal <b>${esc(x.name)}</b> ${rp(x.amount)} ${k<0?'terlambat '+-k+' hari':k===0?'jatuh tempo hari ini':k+' hari lagi'}</section>`)});
  S.subs.forEach(x=>{const k=days(x.next);if(k>=0&&k<=3)r.push(`<section class="c al">Langganan <b>${esc(x.name)}</b> ${rp(x.amount)} ${k===0?'ditagih hari ini':k+' hari lagi'}</section>`)});return r}
const SV={diag,kal,ring,langg,jad,wawas,tema};
const subForm=x=>simple(x?'Ubah langganan':'Langganan baru',[{k:'name',l:'Nama',v:x?.name,p:'Contoh: Netflix'},{k:'amount',l:'Biaya (Rp)',t:'money',v:x?.amount},{k:'period',l:'Ditagih',t:'seg',o:[['month','Tiap bulan'],['year','Tiap tahun']],v:x?.period||'month'},{k:'next',l:'Tagihan berikutnya',t:'date',v:x?.next||iso()}],x,'subs',(d,i)=>d.name.trim()&&d.amount&&d.next?{id:i?.id||Date.now(),name:d.name.trim(),amount:d.amount,period:d.period,next:d.next}:'Isi nama, biaya, dan tanggal.');
const schedForm=x=>simple(x?'Ubah jadwal':'Pembayaran terjadwal',[{k:'name',l:'Nama',v:x?.name},{k:'amount',l:'Jumlah (Rp)',t:'money',v:x?.amount},{k:'category',l:'Kategori',t:'select',o:S.catExp,v:x?.category},{k:'wallet',l:'Dompet',t:'select',o:S.wallets,v:x?.wallet},{k:'every',l:'Ulangi tiap (bulan), 0 = satu kali',t:'number',v:x?.every??1},{k:'next',l:'Tanggal',t:'date',v:x?.next||iso()},{k:'remind',l:'Ingatkan (hari sebelumnya)',t:'number',v:x?.remind??3}],x,'sched',(d,i)=>d.name.trim()&&d.amount&&d.next?{id:i?.id||Date.now(),name:d.name.trim(),amount:d.amount,category:d.category,wallet:d.wallet,every:Math.max(0,Math.round(d.every)||0),dom:+d.next.slice(8),next:d.next,remind:Math.max(0,Math.round(d.remind)||0)}:'Isi nama, jumlah, dan tanggal.');
function lb(src){const d=document.createElement('div');d.setAttribute('style','position:fixed;inset:0;z-index:30;background:#000d;display:grid;place-items:center;padding:16px');d.innerHTML=`<img src="${src}" alt="Foto" style="max-width:100%;max-height:100%;border-radius:12px">`;d.onclick=()=>d.remove();document.body.appendChild(d)}
function nsr(t){const fm=document.querySelector('#sh form');if(!fm)return;
  const a=fm.querySelector('[name=amount]'),box=document.createElement('small'),act=fm.querySelector('.row');box.style.marginTop='4px';a.parentNode.appendChild(box);
  const u=()=>{const ty=(fm.querySelector('[name=type]:checked')||{}).value,c=fm.elements.category.value,l=S.budgets[c];const own=t&&t.type==='expense'&&t.category===c&&td(t).startsWith(month)?(+t.amount||0):0;box.textContent=ty==='expense'&&l?'Nilai sisa anggaran '+c+': '+rp(l-((spentBy(month)[c]||0)-own)-num(a.value)):''};
  fm.addEventListener('input',u);fm.addEventListener('change',u);setTimeout(u);
  const ex=document.createElement('div'),pv=document.createElement('div'),inp=document.createElement('input');
  ex.className='row fl';ex.innerHTML='<button type="button" class="b" id="cam">📷 Kamera</button><button type="button" class="b" id="att">📎 Lampirkan</button>';
  act.before(pv,ex);inp.type='file';inp.accept='image/*';inp.hidden=true;fm.append(inp);
  if(t){const xr=document.createElement('div');xr.className='row fl';xr.innerHTML=`<button type="button" class="b" id="cp">⧉ Salin</button><button type="button" class="b" id="bm">${t.bm?'★ Ditandai':'☆ Tandai'}</button>`;act.before(xr);
    fm.querySelector('#cp').onclick=()=>{S.transactions.unshift({...t,id:Date.now(),isoDate:iso(),date:fd(iso()),bm:false});closeSheet();save();toast('Transaksi disalin ke hari ini')};
    fm.querySelector('#bm').onclick=()=>{t.bm=!t.bm;save();fm.querySelector('#bm').textContent=t.bm?'★ Ditandai':'☆ Tandai';toast(t.bm?'Transaksi ditandai':'Tanda dihapus')}}
  const show=()=>{pv.innerHTML=`<small>Foto (${pend.length}/6)</small>`+(pend.length?`<div style="display:flex;gap:8px;overflow-x:auto;padding:6px 0 10px">${pend.map((p,i)=>`<div style="position:relative;flex:none"><img data-v="${i}" src="${p}" alt="Foto ${i+1}" style="height:104px;border-radius:10px;border:1px solid var(--ln);display:block"><button type="button" data-rm="${i}" aria-label="Hapus foto" style="position:absolute;top:4px;right:4px;width:26px;height:26px;border-radius:7px;background:#000a;color:#fff;text-align:center;line-height:26px">×</button></div>`).join('')}</div>`:'');
    pv.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{pend.splice(+b.dataset.rm,1);show()});pv.querySelectorAll('[data-v]').forEach(im=>im.onclick=()=>lb(pend[+im.dataset.v]))};show();
  const pack=f=>new Promise(r=>{const im=new Image();im.onload=()=>{const k=Math.min(1,640/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(im.src);r(c.toDataURL('image/jpeg',.55))};im.onerror=()=>r('');im.src=URL.createObjectURL(f)});
  const pick=c=>{c?inp.setAttribute('capture','environment'):inp.removeAttribute('capture');inp.multiple=!c;inp.click()};
  fm.querySelector('#cam').onclick=()=>pick(1);fm.querySelector('#att').onclick=()=>pick(0);
  inp.onchange=async()=>{for(const f of [...inp.files]){if(pend.length>=6){toast('Maksimal 6 foto per transaksi.');break}const d=await pack(f);if(d)pend.push(d)}inp.value='';show()}}
const pl=t=>t.photos&&t.photos.length?t.photos:(t.photo?[t.photo]:[]),pcount=t=>pl(t).length;
const shn=v=>{const a=Math.abs(v);return(v<0?'−':'')+(a>=1e6?(a/1e6).toFixed(1)+(window.VFC&&VFC.en?'M':'jt'):a>=1e3?Math.round(a/1e3)+'k':a)};
const balAt=(w,e)=>{let b=+S.walletOpeningBalances[w]||0;S.transactions.forEach(t=>{const d=td(t);if(!d||d>e)return;const a=+t.amount||0;if(t.type==='income'&&t.wallet===w)b+=a;else if(t.type==='expense'&&t.wallet===w)b-=a;else if(t.type==='transfer'){if(t.wallet===w)b-=a;if(t.toWallet===w)b+=a}});return b};
function photoSave(){const P=sorted(S.transactions).flatMap(t=>pl(t).map(p=>[t,p])),kb=Math.round(P.reduce((s,x)=>s+x[1].length,0)*.75/1024),pc=Math.min(100,kb/4500*100);
  return `<section class="c"><div class="tt">Simpan <em>Foto</em></div><small>Foto struk atau makanan tersimpan bersama transaksinya.</small>${P.length?`<div class="wl" style="padding-top:12px">${P.slice(0,12).map(([t,p])=>`<button class="pol" data-a="edit" data-i="${t.id}"><img src="${p}" alt="Foto ${esc(t.category)}"><span>${esc(t.note||t.category)}</span><b>${rp(t.amount)}</b></button>`).join('')}</div><div class="bar ${pc>85?'ov':pc>60?'w8':''}"><i style="width:${pc}%"></i></div><small>${P.length} foto · ±${kb} KB dari ±4.500 KB penyimpanan perangkat</small>`:'<p class="em">Belum ada foto. Buka transaksi lalu tekan Kamera atau Lampirkan.</p>'}</section>`}
function assetGraph(){const w=S.wallets.includes(gw)?gw:'*',W=w==='*'?S.wallets:[w],ms=[-4,-3,-2,-1,0,1,2].map(n=>sm(month,n)),V=ms.map(m=>W.reduce((s,x)=>s+balAt(x,m+'-31'),0)),mn=Math.min(...V),r=Math.max(...V)-mn||1,P=V.map((v,i)=>[24+i*(272/6),115-(v-mn)/r*70]),L=P.map(p=>p.join(',')).join('L');
  const by={};inM(month).filter(t=>t.type==='expense'&&W.includes(t.wallet)).forEach(t=>by[t.category]=(by[t.category]||0)+(+t.amount||0));const T=Object.values(by).reduce((a,b)=>a+b,0),C=Object.entries(by).sort((a,b)=>b[1]-a[1]),BC=['#ff6b5e','#ff9a4d','#ffc83d','#f2e600','#a6e22e'],dl=V[4]-V[3];
  return `<section class="c"><div class="tt">Grafik <em>Aset</em></div><div class="chips" style="margin:8px 0">${[['*','Semua'],...S.wallets.map(x=>[x,x])].map(([k,l])=>`<button class="chip ${w===k?'on':''}" data-a="gw" data-i="${esc(k)}">${esc(l)}</button>`).join('')}</div><div style="background:linear-gradient(135deg,#4a4a4a,#2a2a2a);color:#fff;border-radius:14px 14px 0 0;padding:12px 14px;display:flex;justify-content:space-between;align-items:center"><b>${w==='*'?'Semua dompet':esc(w)}</b><span style="font-size:12px;opacity:.85">${ml(month)}</span></div><div style="background:var(--bg);border-radius:0 0 14px 14px;padding:6px 4px 2px"><svg viewBox="0 0 320 150" width="100%" role="img" aria-label="Grafik saldo ${esc(w)}"><defs><linearGradient id="ag" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--tx)" stop-opacity=".18"/><stop offset="1" stop-color="var(--tx)" stop-opacity="0"/></linearGradient></defs><path d="M${L}L${P[6][0]},128L${P[0][0]},128Z" fill="url(#ag)"/><line x1="${P[4][0]}" x2="${P[4][0]}" y1="18" y2="128" stroke="var(--ac)" stroke-dasharray="3 3"/><path d="M${L}" fill="none" stroke="var(--tx)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${P.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="${i===4?6:4}" fill="var(--bg)" stroke="${i===4?'var(--ac)':'var(--tx)'}" stroke-width="2.5"/><text x="${p[0]}" y="${p[1]-11}" text-anchor="middle" style="${i===4?'fill:var(--tx);font-weight:800;font-size:11px':''}">${shn(V[i])}</text><text x="${p[0]}" y="144" text-anchor="middle" style="${i===4?'fill:var(--ac);font-weight:700':''}">${new Date(+ms[i].slice(0,4),+ms[i].slice(5)-1,1).toLocaleDateString('id-ID',{month:'short'})}</text>`).join('')}</svg></div>
  <div class="h" style="margin:12px 0 2px"><small>Saldo akhir ${ml(month)}</small><b class="am ${V[4]<0?'out':'in'}">${rp(V[4])}</b></div><small class="${dl<0?'out':'in'}">${dl>=0?'▲ naik ':'▼ turun '}${rp(Math.abs(dl))} dari bulan lalu</small>
  <div class="h" style="margin:12px 0 4px;padding:8px 10px;background:var(--bg);border-radius:10px"><span>Pengeluaran</span><span class="am out">${rp(T)}</span></div>${C.slice(0,8).map(([c,v],i)=>`<div class="r" style="border:0;padding:7px 4px"><span style="min-width:46px;text-align:center;border-radius:7px;padding:3px 0;font-size:12px;font-weight:800;color:#1a1305;background:${BC[Math.min(i,4)]}">${Math.round(v/T*100)}%</span><span class="rm"><b>${esc(c)}</b></span><span class="am out">${rp(v)}</span></div>`).join('')||'<p class="em">Tidak ada pengeluaran di bulan ini.</p>'}</section>`}
function bpCard(){const now=iso(),y=now.slice(0,4),w0=ad(now,-((new Date().getDay()+6)%7)),w1=ad(w0,6);
  const it=S.bp.map(b=>{const[a,z]=b.per==='week'?[w0,w1]:[y+'-01-01',y+'-12-31'],sp=S.transactions.filter(t=>t.type==='expense'&&td(t)>=a&&td(t)<=z&&(b.cat==='Semua kategori'||t.category===b.cat)).reduce((x,t)=>x+(+t.amount||0),0);return{b,a,z,sp}});
  return `<section class="c"><h3>Anggaran mingguan & tahunan <button class="b s p" data-a="bpadd">+ Tambah</button></h3>${it.map(({b,a,z,sp})=>{const p=sp/b.limit*100;return `<button class="r" style="display:block" data-a="bpedit" data-i="${b.id}"><div class="h" style="margin:0;font-weight:500"><span>${esc(b.cat)} · ${b.per==='week'?'mingguan':'tahunan'}</span><span class="am ${sp>b.limit?'out':''}">${rp(sp)} / ${rp(b.limit)}</span></div><div class="bar ${p>100?'ov':p>=80?'w8':''}"><i style="width:${Math.min(100,p)}%"></i></div><small>${fd(a)} – ${fd(z)} · ${sp>b.limit?'Lebih '+rp(sp-b.limit):'Nilai sisa '+rp(b.limit-sp)}</small></button>`}).join('')||'<p class="em">Belum ada anggaran mingguan atau tahunan.</p>'}</section>`}
const bpForm=x=>simple(x?'Ubah anggaran':'Anggaran mingguan / tahunan',[{k:'cat',l:'Kategori',t:'select',o:['Semua kategori',...S.catExp],v:x?.cat},{k:'per',l:'Periode',t:'seg',o:[['week','Mingguan'],['year','Tahunan']],v:x?.per||'week'},{k:'limit',l:'Batas (Rp)',t:'money',v:x?.limit}],x,'bp',(d,i)=>d.limit?{id:i?.id||Date.now(),cat:d.cat,per:d.per,limit:d.limit}:'Isi batas anggaran.');
function trend(){const now=iso().slice(0,7),op=S.wallets.reduce((s,w)=>s+(+S.walletOpeningBalances[w]||0),0),P=[];
  for(let i=6;i>=0;i--){const e=sm(now,-i)+'-31';P.push(op+S.transactions.filter(t=>td(t)&&td(t)<=e).reduce((s,t)=>s+(t.type==='income'?+t.amount:t.type==='expense'?-t.amount:0),0))}
  const mn=Math.min(...P),r=Math.max(...P)-mn||1,pt=P.map((v,i)=>[i*50+10,100-(v-mn)/r*75]),L=pt.map(p=>p.join(',')).join('L');
  return `<section class="c"><h3>Saldo kas 7 bulan <span class="am">${rp(P[6])}</span></h3><svg viewBox="0 0 320 130" width="100%"><path d="M${L}L310,100L10,100Z" fill="var(--in)" opacity=".2"/><path d="M${L}" fill="none" stroke="var(--in)" stroke-width="2.5" stroke-linejoin="round"/>${pt.map((p,i)=>`<text x="${p[0]}" y="118" text-anchor="middle">${sm(now,i-6).slice(5)}</text>`).join('')}</svg></section>`}
const V={home,trx,bud,wlt,more};
function render(){
  $('#v').innerHTML=tab==='more'&&sub?SV[sub]():V[tab]();
  $('#nav').innerHTML=Object.keys(TABS).map(k=>`<button class="${tab===k?'on':''}" data-a="tab" data-i="${k}"${tab===k?' aria-current="page"':''}><svg viewBox="0 0 24 24"><path d="${IC[k]}"/></svg>${k==='wlt'?'Aset & Utang':TABS[k]}</button>`).join('');
  $('#fab').hidden=tab==='more'&&!sub;document.documentElement.style.setProperty('--ac',S.settings.accent||'#f0b84a');
  const t=S.settings.theme,dk=t==='dark'||(t==='auto'&&!matchMedia('(prefers-color-scheme: light)').matches);
  document.documentElement.dataset.t=dk?'dark':'light';
}

const opts=(o,v)=>o.map(x=>{const[a,b]=Array.isArray(x)?x:[x,x];return `<option value="${esc(a)}"${a==v?' selected':''}>${esc(b)}</option>`}).join('');
function closeSheet(){$('#sh').innerHTML=''}
function sheet(title,F,ok,del,delMsg){
  const e=$('#sh');
  const fld=f=>{const v=f.v??'';let c;
    if(f.t==='seg')c=`<div class="seg">${f.o.map(([a,b])=>`<label><input type="radio" name="${f.k}" value="${a}"${a==v?' checked':''}><span>${b}</span></label>`).join('')}</div>`;
    else if(f.t==='select')c=`<select name="${f.k}">${opts(f.o,v)}</select>`;
    else if(f.t==='money')c=`<input name="${f.k}" data-m inputmode="numeric" autocomplete="off" placeholder="0" value="${v?new Intl.NumberFormat('id-ID').format(v):''}">`;
    else c=`<input name="${f.k}" type="${f.t||'text'}" value="${esc(v)}"${f.t==='number'?' step="any" inputmode="decimal"':''}${f.p?` placeholder="${f.p}"`:''}>`;
    return `<div class="fl"${f.s?` data-s="${f.s}"`:''}${f.h?` data-h="${f.h}"`:''}><label>${f.l}</label>${c}</div>`};
  e.innerHTML=`<div class="bd" id="cx"></div><form class="sh" role="dialog" aria-label="${esc(title)}"><h3>${esc(title)}</h3>${F.map(fld).join('')}<div class="row"><button class="b p">Simpan</button>${del?'<button type="button" class="b d" id="dl">Hapus</button>':''}<button type="button" class="b" id="cn">Batal</button></div></form>`;
  const fm=e.querySelector('form');
  const upd=()=>{const ty=(fm.querySelector('[name=type]:checked')||{}).value;
    fm.querySelectorAll('[data-s]').forEach(x=>x.hidden=x.dataset.s!==ty);
    fm.querySelectorAll('[data-h]').forEach(x=>x.hidden=x.dataset.h===ty);
    const c=fm.querySelector('[name=category]');if(c&&ty&&ty!=='transfer'){const l=cats(ty);c.innerHTML=opts(l,l.includes(c.value)?c.value:l[0])}};
  fm.addEventListener('change',upd);upd();
  e.querySelector('#cx').onclick=e.querySelector('#cn').onclick=closeSheet;
  if(del)e.querySelector('#dl').onclick=()=>{if(confirm(delMsg||'Hapus data ini?')){if(del()===false)return;closeSheet();save();toast('Dihapus')}};
  fm.onsubmit=ev=>{ev.preventDefault();const d={};F.forEach(f=>{const x=fm.elements[f.k];d[f.k]=f.t==='money'?num(x.value):f.t==='number'?+x.value:x.value});const err=ok(d);if(err)return toast(err);closeSheet();save();toast('Tersimpan')};
}

function txForm(t){
  const n=!t;pend=t?(t.photos||(t.photo?[t.photo]:[])).slice():[];t=t||{type:'expense',isoDate:iso(),wallet:S.wallets[0],category:S.catExp[0]};
  sheet(n?'Catat transaksi':'Ubah transaksi',[
    {k:'type',l:'Jenis',t:'seg',o:[['expense','Keluar'],['income','Masuk'],['transfer','Pindah']],v:t.type},
    {k:'amount',l:'Jumlah (Rp)',t:'money',v:t.amount},
    {k:'category',l:'Kategori',t:'select',o:cats(t.type==='income'?'income':'expense'),v:t.category,h:'transfer'},
    {k:'wallet',l:t.type==='transfer'?'Dari dompet':'Dompet / rekening',t:'select',o:S.wallets,v:t.wallet},
    {k:'toWallet',l:'Ke dompet',t:'select',o:S.wallets,v:t.toWallet||S.wallets[1]||S.wallets[0],s:'transfer'},
    {k:'isoDate',l:'Tanggal',t:'date',v:td(t)||iso()},
    {k:'note',l:'Catatan (opsional)',v:t.note,p:'Contoh: makan siang, gaji Oktober'},{k:'party',l:'Kepada / dari (opsional)',v:t.party},{k:'chk',l:'Dicentang',t:'seg',o:[['1','Ya'],['0','Belum']],v:t.chk||'1'},{k:'rep',l:'Pengeluaran terjadwal',t:'seg',o:[['0','Tidak'],['1','Ulangi tiap bulan']],v:'0',h:'income'}
  ],d=>{
    if(!d.amount)return 'Isi jumlah lebih dari 0.';
    if(!d.isoDate)return 'Pilih tanggal.';
    if(d.type==='transfer'&&d.wallet===d.toWallet)return 'Pilih dua dompet yang berbeda.';
    const o={...t,id:t.id||Date.now(),scope:t.scope||'personal',type:d.type,amount:d.amount,category:d.type==='transfer'?'Transfer':d.category,wallet:d.wallet,note:d.note.trim(),photo:undefined,photos:pend,party:d.party.trim(),chk:d.chk,isoDate:d.isoDate,date:fd(d.isoDate)};
    if(d.type==='transfer')o.toWallet=d.toWallet;else delete o.toWallet;
    if(n&&d.rep==='1'&&d.type==='expense')S.sched.push({id:Date.now()+1,name:d.note.trim()||d.category,amount:d.amount,category:d.category,wallet:d.wallet,every:1,dom:+d.isoDate.slice(8),next:addM(d.isoDate,1,+d.isoDate.slice(8)),remind:3});
    if(n)S.transactions.unshift(o);else S.transactions[S.transactions.findIndex(x=>x.id===t.id)]=o;
  },n?null:()=>{S.transactions=S.transactions.filter(x=>x.id!==t.id)});nsr(n?null:t);
}
function simple(title,F,item,list,build){const n=!item;sheet(title,F,d=>{const e=build(d,item);if(typeof e==='string')return e;if(n)S[list].push(e);else Object.assign(item,e)},n?null:()=>{S[list]=S[list].filter(x=>x!==item)})}
const find=(l,i)=>S[l].find(x=>x.id==i);

const A={
  gw(i){gw=i;render()},
  wt(i){wt=i;render()},
  dsel(i){dsel=+i;render()},
  bpadd(){bpForm()},bpedit(i){bpForm(find('bp',i))},
  sub(i){sub=i;render();scrollTo(0,0)},dg(i){dg=i;render()},cd(i){cd=i;render()},
  gm(m){month=m;tab='trx';sub='';render();scrollTo(0,0)},
  subadd(){subForm()},subedit(i){subForm(find('subs',i))},
  schedadd(){schedForm()},schededit(i){schedForm(find('sched',i))},
  schedpay(i){const x=find('sched',i);S.transactions.unshift({id:Date.now(),scope:'personal',type:'expense',amount:x.amount,category:x.category,wallet:x.wallet,note:x.name,isoDate:x.next,date:fd(x.next),chk:'1'});if(x.every)x.next=addM(x.next,x.every,x.dom);else S.sched=S.sched.filter(y=>y!==x);save();toast('Dicatat sebagai pengeluaran')},
  accent(i){S.settings.accent=i;save()},
  ico(c){sheet('Ikon "'+c+'"',[{k:'v',l:'Satu emoji (kosongkan untuk menghapus)',v:S.icons[c]||''}],d=>{const v=d.v.trim();if(v)S.icons[c]=(window.Intl&&Intl.Segmenter?[...new Intl.Segmenter().segment(v)].slice(0,2).map(x=>x.segment).join(''):[...v].slice(0,2).join(''));else delete S.icons[c]})},
  tab(i){tab=i;sub='';render();scrollTo(0,0)},
  add(){txForm()},edit(i){txForm(find('transactions',i))},
  mp(){month=sm(month,-1);render()},mx(){month=sm(month,1);render()},
  ft(i){ft=i;render()},skip(){S.onboarded=true;save()},
  wallets(){tab='home';sub='';render();scrollTo(0,0);toast('Ketuk dompet untuk mengisi saldo awal')},
  budadd(){tab='bud';render();budForm()},budedit(i){budForm(i)},
  goaladd(){goalForm()},goaledit(i){goalForm(find('goals',i))},
  goalfund(i){const g=find('goals',i);sheet('Tambah dana: '+g.name,[{k:'a',l:'Jumlah (Rp)',t:'money'}],d=>{if(!d.a)return 'Isi jumlah.';g.current=(+g.current||0)+d.a})},
  assetadd(){assetForm()},assetedit(i){assetForm(find('assets',i))},
  debtadd(){debtForm()},debtedit(i){debtForm(find('activeDebts',i))},
  debtpay(i){const d=find('activeDebts',i);sheet('Bayar: '+d.title,[{k:'a',l:'Jumlah dibayar (Rp)',t:'money',v:Math.min(d.installmentAmount||d.principal,d.principal)},{k:'w',l:'Dari dompet',t:'select',o:S.wallets},{k:'t',l:'Tanggal',t:'date',v:iso()}],x=>{
    if(!x.a)return 'Isi jumlah.';const a=Math.min(x.a,d.principal);
    S.transactions.unshift({id:Date.now(),scope:'personal',type:d.dir==='owed'?'income':'expense',amount:a,category:d.dir==='owed'?'Pengembalian Dana':'Pembayaran Utang',wallet:x.w,note:'Bayar utang: '+d.title,isoDate:x.t,date:fd(x.t)});
    if(!d.orig)d.orig=d.principal;d.principal=Math.max(0,d.principal-a);if(d.dueISO&&d.principal>0){d.dom=d.dom||+d.dueISO.slice(8);d.dueISO=addM(d.dueISO,d.frequencyMonths||1,d.dom);d.dueDate=fd(d.dueISO)}})},
  advset(){const A=S.advice;sheet('Gaji & biaya tetap',[{k:'income',l:'Gaji / pemasukan per bulan (Rp)',t:'money',v:A.income||avgInc()},...NEEDS.map(n=>({k:n.k,l:n.n+': biaya Anda saat ini (kosongkan jika belum tahu)',t:'money',v:A.fixed[n.k]}))],d=>{if(!d.income)return 'Isi gaji bulanan.';S.advice={income:d.income,fixed:{}};NEEDS.forEach(n=>{if(d[n.k])S.advice.fixed[n.k]=d[n.k]})})},
  advapply(){advice().it.forEach(i=>{if(i.v>0)S.budgets[i.c[0]]=i.v});save();toast('Anggaran bulanan diperbarui dari saran')},
  walletadd(){walletForm()},walletedit(i){walletForm(i)},
  catadd(){sheet('Tambah kategori',[{k:'type',l:'Jenis',t:'seg',o:[['expense','Pengeluaran'],['income','Pemasukan']],v:'expense'},{k:'n',l:'Nama kategori'}],d=>{const n=d.n.trim();if(!n)return 'Isi nama kategori.';const l=cats(d.type);if(l.includes(n))return 'Kategori sudah ada.';l.push(n)})},
  catdel(i){const[ty,c]=i.split('|');if(confirm(`Hapus kategori "${c}"? Transaksi lama tetap tersimpan.`)){S[ty==='income'?'catInc':'catExp']=cats(ty).filter(x=>x!==c);save()}},
  theme(i){S.settings.theme=i;save()},
  exp(){dl(JSON.stringify(S,null,1),'mindvesta-cadangan-'+iso()+'.json','application/json')},
  imp(){$('#imp').click()},
  csv(){csv(inM(month),'mindvesta-'+month)},csvall(){csv(sorted(S.transactions),'mindvesta-semua')},
  clear(){if(confirm('Hapus SEMUA data di perangkat ini? Tindakan ini tidak bisa dibatalkan.')&&confirm('Yakin? Pastikan Anda sudah mengekspor cadangan.')){try{localStorage.removeItem(KEY)}catch(e){}location.reload()}}
};
function budForm(c){
  const e=!!c,free=S.catExp.filter(x=>!(x in S.budgets)||x===c);
  if(!free.length)return toast('Semua kategori sudah punya anggaran.');
  sheet(e?'Ubah anggaran':'Tambah anggaran',[{k:'c',l:'Kategori',t:'select',o:free,v:c},{k:'a',l:'Batas per bulan (Rp)',t:'money',v:S.budgets[c]}],d=>{if(!d.a)return 'Isi batas anggaran.';if(e&&d.c!==c)delete S.budgets[c];S.budgets[d.c]=d.a},e?()=>{delete S.budgets[c]}:null);
}
const goalForm=g=>simple(g?'Ubah target':'Target tabungan baru',[{k:'name',l:'Nama target',v:g?.name,p:'Contoh: Dana darurat'},{k:'target',l:'Nominal target (Rp)',t:'money',v:g?.target},{k:'current',l:'Sudah terkumpul (Rp)',t:'money',v:g?.current}],g,'goals',(d,i)=>d.name.trim()&&d.target?{id:i?.id||Date.now(),name:d.name.trim(),target:d.target,current:d.current}:'Isi nama dan target.');
const assetForm=x=>simple(x?'Ubah aset':'Aset baru',[{k:'name',l:'Nama aset',v:x?.name,p:'Contoh: Emas 10 gram'},{k:'type',l:'Jenis',t:'select',o:ASSET,v:x?.type},{k:'value',l:'Nilai saat ini (Rp)',t:'money',v:x?.value}],x,'assets',(d,i)=>d.name.trim()?{id:i?.id||Date.now(),name:d.name.trim(),type:d.type,value:d.value}:'Isi nama aset.');
const debtForm=x=>simple(x?'Ubah utang':'Utang baru',[{k:'kind',l:'Jenis',t:'seg',o:[['owe','Saya berutang'],['owed','Berutang kepada saya']],v:x?.dir||'owe'},{k:'title',l:'Nama utang / nama orang',v:x?.title,p:'Contoh: KPR, Andi'},{k:'ico',l:'Ikon',t:'select',o:ICN,v:x?.ico},{k:'principal',l:'Sisa utang (Rp)',t:'money',v:x?.principal},{k:'inst',l:'Cicilan per periode (Rp)',t:'money',v:x?.installmentAmount},{k:'freq',l:'Dibayar setiap (bulan)',t:'number',v:x?.frequencyMonths||1},{k:'int',l:'Bunga per tahun (%), isi 0 jika tanpa bunga',t:'number',v:x?.interest||0},{k:'due',l:'Jatuh tempo berikutnya',t:'date',v:x?.dueISO||iso()}],x,'activeDebts',(d,i)=>d.title.trim()&&d.principal?{...(i||{}),id:i?.id||Date.now(),orig:Math.max(+(i&&i.orig)||0,d.principal),ico:d.ico,dir:d.kind,title:d.title.trim(),principal:d.principal,installmentAmount:d.inst,frequencyMonths:Math.max(1,Math.round(d.freq)||1),dueISO:d.due,dom:d.due?+d.due.slice(8):0,dueDate:d.due?fd(d.due):'',interest:Math.max(0,d.int||0),admin:i?.admin||0}:'Isi nama dan sisa utang.');
function walletForm(w){
  const e=!!w;sheet(e?'Ubah dompet':'Dompet baru',[{k:'n',l:'Nama',v:w},{k:'o',l:'Saldo awal (Rp)',t:'money',v:e?S.walletOpeningBalances[w]:0}],d=>{
    const n=d.n.trim();if(!n)return 'Isi nama dompet.';if(n!==w&&S.wallets.includes(n))return 'Nama sudah dipakai.';
    if(e&&n!==w){S.wallets[S.wallets.indexOf(w)]=n;delete S.walletOpeningBalances[w];S.transactions.forEach(t=>{if(t.wallet===w)t.wallet=n;if(t.toWallet===w)t.toWallet=n});S.sched.forEach(x=>{if(x.wallet===w)x.wallet=n})}else if(!e)S.wallets.push(n);
    S.walletOpeningBalances[n]=d.o},
  e&&S.wallets.length>1?()=>{if(S.transactions.some(t=>t.wallet===w||t.toWallet===w)||S.sched.some(x=>x.wallet===w)){toast('Dompet masih dipakai transaksi atau jadwal.');return false}S.wallets=S.wallets.filter(x=>x!==w);delete S.walletOpeningBalances[w]}:null);
}
function dl(text,name,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);toast('File disimpan ke unduhan')}
function csv(a,n){if(!a.length)return toast('Belum ada transaksi untuk diekspor.');const q=v=>`"${String(v??'').replace(/"/g,'""')}"`;dl('\ufeff'+[(window.VFC&&VFC.on?VFC.t('Tanggal,Jenis,Kategori,Dompet,Ke Dompet,Jumlah,Catatan'):'Tanggal,Jenis,Kategori,Dompet,Ke Dompet,Jumlah,Catatan'),...a.map(t=>[td(t),t.type,t.category,t.wallet,t.toWallet||'',t.amount,t.note].map(q).join(','))].join('\n'),n+'.csv','text/csv')}

document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b&&A[b.dataset.a])A[b.dataset.a](b.dataset.i)});
document.addEventListener('input',e=>{const t=e.target;if(t.dataset&&t.dataset.m!==undefined){const n=num(t.value);t.value=n?new Intl.NumberFormat('id-ID').format(n):''}if(t.id==='q'){q=t.value;$('#tl').innerHTML=listHTML()}});
$('#imp').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!o||!Array.isArray(o.transactions))throw 0;if(confirm('Ganti semua data saat ini dengan isi cadangan?')){load(o);save();toast('Cadangan dipulihkan')}}catch(x){toast('File cadangan tidak valid.')}e.target.value=''};r.readAsText(f)};
matchMedia('(prefers-color-scheme: light)').addEventListener?.('change',render);
render();
