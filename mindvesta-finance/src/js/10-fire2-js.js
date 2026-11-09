
const FIRETracker=(function(){
'use strict';
const SK='vf_fire2',NS='http://www.w3.org/2000/svg';
const MODES={
 chill:{e:'🏕️',n:'Chill Mode',s:'Lean F.I.R.E',x:.7,a:'#2ec4a0',b:'#9be15d',v:'Hidup minimalis & campervan life. Target dihitung dari <b>70%</b> pengeluaranmu sekarang.'},
 side:{e:'☕',n:'Side-Quest Mode',s:'Barista F.I.R.E',x:.5,a:'#ffa94d',b:'#ff6b9d',v:'Pensiun dari stres, tetap kerja santai (buka kafe, freelance desain). Dana cukup <b>50%</b> pengeluaran, sisanya dari side-quest.'},
 sultan:{e:'👑',n:'Sultan Mode',s:'Fat F.I.R.E',x:2.5,a:'#b388ff',b:'#ffd166',v:'Pensiun elit, traveling kelas bisnis, belanja tanpa lihat harga. Target <b>200–300%</b> pengeluaranmu sekarang.'}
};
const LV=['Rebahan Pemula 🐣','Budak Korporat Sejati 💼','Mulai Ngirit 🪙','Pejuang Reksa Dana 📈','Si Paling Konsisten 🔥','Mesin Uang Nyala 💸','Hampir Merdeka 🚀','Calon Sultan 🏝️','Boss Level 😎','Merdeka Finansial 👑'];
const FD=[
 {k:'age',l:'Usia sekarang 🎂',u:'th',t:'n',min:15,max:89,st:1},
 {k:'ret_age',l:'Target usia pensiun 🏖️',u:'th',t:'n',min:16,max:90,st:1},
 {k:'assets',l:'Aset saat ini 🏦',u:'Rp',t:'m',max:1e13,sm:5e9},
 {k:'monthly',l:'Investasi bulanan 📈',u:'Rp',t:'m',max:1e11,sm:5e7},
 {k:'exp',l:'Pengeluaran bulanan 🛒',u:'Rp',t:'m',max:1e11,sm:5e7},
 {k:'ret',l:'Asumsi return / tahun 🚀',u:'%',t:'p',min:0,max:30,st:.5},
 {k:'infl',l:'Inflasi / tahun 🔥',u:'%',t:'p',min:0,max:25,st:.5},
 {k:'swr',l:'Safe Withdrawal Rate 🛡️',u:'%',t:'p',min:2.5,max:6,st:.25}
];
const F={};FD.forEach(f=>F[f.k]=f);
const DEF={mode:'chill',sx:2.5,age:25,ret_age:45,assets:0,monthly:0,exp:5e6,ret:8,infl:3.5,swr:4};
const nf=new Intl.NumberFormat('id-ID',{maximumFractionDigits:0}),cf=new Intl.NumberFormat('id-ID',{maximumFractionDigits:2});
const R=n=>{n=Math.min(Math.max(+n||0,-1e18),1e18);const a=Math.abs(n);return 'Rp '+(a>=1e12?cf.format(n/1e12)+' T':a>=1e9?cf.format(n/1e9)+(window.VFC&&VFC.en?' B':' M'):a>=1e6?cf.format(n/1e6)+(window.VFC&&VFC.en?' M':' jt'):nf.format(n))};
const num=(v,lo,hi,d)=>{v=+v;return Number.isFinite(v)?Math.min(hi,Math.max(lo,v)):d};
const dur=m=>{const y=Math.floor(m/12),o=m%12;return ((y?y+' th ':'')+(o?o+' bln':'')).trim()||'< 1 bln'};
let st,root,pill,built=false,raf=0,t1=0,dirty=false,lastFocus=null,cur=null;
const N={},hints={},ti={},sl={};
/* dicek SEGERA saat dimuat: bila data aplikasi sudah dihapus, buang sisa pengaturan F.I.R.E juga */
try{if(localStorage.getItem(KEY)===null)localStorage.removeItem(SK)}catch(e){}

/* ---------- sanitasi: semua input dipaksa masuk batas aman ---------- */
function fix(s){
 if(!MODES[s.mode])s.mode='chill';
 s.sx=[2,2.5,3].includes(+s.sx)?+s.sx:2.5;
 s.age=Math.round(num(s.age,15,89,DEF.age));
 s.ret_age=Math.round(num(s.ret_age,s.age+1,90,Math.min(90,s.age+20)));
 s.assets=Math.round(num(s.assets,0,1e13,0));
 s.monthly=Math.round(num(s.monthly,0,1e11,0));
 s.exp=Math.round(num(s.exp,0,1e11,DEF.exp));
 s.ret=Math.round(num(s.ret,0,30,DEF.ret)*10)/10;
 s.infl=Math.round(num(s.infl,0,25,DEF.infl)*10)/10;
 s.swr=Math.round(num(s.swr,2.5,6,DEF.swr)*100)/100;
 return s}

/* ---------- mesin kalkulasi tunggal untuk ketiga mode ---------- */
function calc(s){
 const mult=s.mode==='sultan'?s.sx:MODES[s.mode].x,n=s.ret_age-s.age,
  rm=Math.pow(1+s.ret/100,1/12)-1,fi=Math.pow(1+s.infl/100,1/12),
  T0=s.exp*mult*12/(s.swr/100),Tn=T0*Math.pow(1+s.infl/100,n),H=(100-s.age)*12;
 let a=s.assets,tFI=T0>0&&a>=T0?0:null;const pts=[{a:a,g:T0}];
 for(let m=1;m<=H;m++){a=Math.min(a*(1+rm)+s.monthly,1e18);
  if(tFI===null&&T0>0&&a>=T0*Math.pow(fi,m))tFI=m;
  if(m%12===0)pts.push({a:a,g:T0*Math.pow(fi,m)})}
 const N12=n*12,g=Math.pow(1+rm,N12),af=rm>1e-9?(g-1)/rm:N12,proj=pts[n].a;
 return{T0,Tn,proj,pts,tFI,n,mult,real:(1+s.ret/100)/(1+s.infl/100)-1,pct:T0>0?Math.min(100,s.assets/T0*100):0,need:Math.max(0,(Tn-proj)/af)}}

/* ---------- penyimpanan (key kecil real-time + mirror ke data utama saat idle) ---------- */
/* Modul TIDAK menulis data utama aplikasi (KEY). S.fire2 hanya referensi in-memory supaya ikut ekspor cadangan;
   key kecil SK ditulis hanya bila ada perubahan (dirty), jadi hapus-data/impor aplikasi tidak bisa tertimpa. */
function flush(){clearTimeout(t1);if(!st||!dirty)return;dirty=false;try{localStorage.setItem(SK,JSON.stringify(st))}catch(e){}}
function persist(){st.ts=Date.now();dirty=true;try{S.fire2=st}catch(e){}clearTimeout(t1);t1=setTimeout(flush,120)}
function sync(){try{const m=S.fire2;if(m!==st){if(m&&typeof m==='object')st=fix(Object.assign({},DEF,m));S.fire2=st}}catch(e){}}
function pullApp(){try{const f=window.VFR&&window.VFR.fire&&window.VFR.fire(0);if(!f)return false;
 st.assets=f.inv;if(f.exp)st.exp=f.exp;st.monthly=f.con;fix(st);return !!(f.inv||f.exp)}catch(e){return false}}
function init(){let o=null,m=null,k=null;try{k=localStorage.getItem(KEY)}catch(e){}
 try{o=JSON.parse(localStorage.getItem(SK)||'null')}catch(e){}try{m=S.fire2}catch(e){}
 if(!o||typeof o!=='object'||(m&&typeof m==='object'&&(+m.ts||0)>(+o.ts||0)))o=m;
 const fresh=!o||typeof o!=='object';st=fix(Object.assign({},DEF,fresh?{}:o));if(fresh)pullApp();try{S.fire2=st}catch(e){}}

/* ---------- builder DOM aman (textContent saja, tanpa innerHTML untuk data) ---------- */
function h(t,a,k){const e=t.slice(0,2)==='s:'?document.createElementNS(NS,t.slice(2)):document.createElement(t);
 for(const x in a){const v=a[x];if(x==='text')e.textContent=v;else e.setAttribute(x==='cls'?'class':x,v)}
 (k||[]).forEach(c=>c&&e.append(c));return e}
const toSl=(f,v)=>f.t==='m'?Math.round(1000*Math.sqrt(Math.min(v,f.sm)/f.sm)):v;
const fromSl=(f,s)=>{if(f.t!=='m')return s;const r=f.sm*Math.pow(s/1000,2),p=r<1e7?1e5:r<1e9?1e6:1e7;return Math.round(r/p)*p};
const disp=(f,v)=>f.t==='m'?R(v):f.t==='p'?v+'%':v+' th';

function build(){
 root=h('div',{id:'FIRE',role:'dialog','aria-modal':'true','aria-label':'F.I.R.E Tracker'});
 const w=h('div',{cls:'fe-w'});
 w.append(h('div',{cls:'fe-top'},[h('h2',{text:'🔥 F.I.R.E Tracker'}),h('button',{cls:'fe-x',type:'button','data-act':'close','aria-label':'Tutup',text:'✕'})]));
 const mb=h('div',{cls:'fe-modes',role:'group','aria-label':'Pilih mode F.I.R.E'});
 Object.keys(MODES).forEach(k=>{const m=MODES[k];N['m_'+k]=h('button',{type:'button','data-m':k},[h('b',{text:m.e}),document.createTextNode(m.n)]);mb.append(N['m_'+k])});
 N.vibe=h('p',{cls:'fe-v'});N.sx=h('div',{cls:'fe-sx'});
 [2,2.5,3].forEach(x=>{N.sx.append(h('button',{type:'button','data-sx':x,text:Math.round(x*100)+'%'}))});
 w.append(h('section',{cls:'fe-g'},[mb,h('div',{style:'height:10px'}),N.vibe,N.sx]));
 /* gauge RPG */
 N.s1=h('s:stop',{offset:'0'});N.s2=h('s:stop',{offset:'1'});N.arc=h('s:circle',{cls:'fe-arc',cx:100,cy:100,r:82,stroke:'url(#feG)',transform:'rotate(-90 100 100)'});
 N.arc.style.strokeDasharray='515.22';N.kg=h('s:g',{cls:'fe-kg'},[h('s:circle',{cls:'fe-kn',cx:100,cy:18,r:9})]);
 N.gw=h('div',{cls:'fe-gw'},[h('s:svg',{viewBox:'0 0 200 200',cls:'fe-gs','aria-hidden':'true'},[
  h('s:defs',{},[h('s:linearGradient',{id:'feG',x1:0,y1:0,x2:1,y2:1},[N.s1,N.s2])]),h('s:circle',{cls:'fe-tr',cx:100,cy:100,r:82}),N.arc,N.kg]),
  h('div',{cls:'fe-gc'},[N.pct=h('div',{cls:'fe-pct'}),N.lv=h('div',{cls:'fe-lv'})])]);
 N.lt=h('div',{cls:'fe-lt'});N.xpb=h('i');N.xpl=h('span');N.xpr=h('span');
 w.append(h('section',{cls:'fe-g'},[N.gw,N.lt,h('div',{cls:'fe-xp',role:'progressbar','aria-label':'XP menuju level berikutnya'},[N.xpb]),h('div',{cls:'fe-xt'},[N.xpl,N.xpr])]));
 /* statistik */
 const stat=(id,t)=>{N[id+'v']=h('strong');N[id+'s']=h('span');return h('div',{cls:'fe-s'},[h('small',{text:t}),N[id+'v'],N[id+'s']])};
 N.vd=h('div',{cls:'fe-vd',role:'status'});
 w.append(h('section',{cls:'fe-g fe-st'},[stat('tg','Target Dana Rebahan 🏖️'),stat('pj','Proyeksi Mesin Uang 💸'),stat('tm','Sisa Waktu Nge-budak Korporat ⏳'),N.vd]));
 /* input: slider + kotak teks tersinkron */
 const box=h('section',{cls:'fe-g'});
 FD.forEach(f=>{
  ti[f.k]=h('input',{cls:'fe-t',type:'text',inputmode:f.t==='m'?'numeric':'decimal',autocomplete:'off','data-k':f.k,'aria-label':f.l});
  sl[f.k]=h('input',{cls:'fe-s2',type:'range','data-k':f.k,'aria-label':f.l+' (slider)',min:f.t==='m'?0:f.min,max:f.t==='m'?1000:f.max,step:f.t==='m'?1:f.st});
  hints[f.k]=h('div',{cls:'fe-h','aria-live':'polite'});
  box.append(h('div',{cls:'fe-r'},[h('div',{cls:'fe-l'},[h('span',{text:f.l}),h('label',{cls:'fe-iw'},[h('span',{text:f.u}),ti[f.k]])]),sl[f.k],hints[f.k]]))});
 N.note=h('div',{cls:'fe-h'});
 box.append(N.note,h('div',{cls:'fe-ac'},[h('button',{type:'button','data-act':'pull',cls:'p',text:'🔄 Tarik dari data app'}),h('button',{type:'button','data-act':'reset',text:'↺ Reset'})]));
 w.append(box);
 /* grafik SVG interaktif */
 N.area=h('s:path',{fill:'var(--fa)',opacity:'.22'});N.line=h('s:path',{fill:'none',stroke:'var(--fa)','stroke-width':2.5,'stroke-linejoin':'round'});
 N.tgt=h('s:path',{fill:'none',stroke:'var(--f-ac)','stroke-width':1.8,'stroke-dasharray':'5 4'});
 N.rl=h('s:line',{y1:14,y2:172,stroke:'var(--f-mu)','stroke-dasharray':'2 3'});N.rt=h('s:text',{y:11,'text-anchor':'middle',text:'Pensiun'});
 N.fi=h('s:circle',{r:6,fill:'#ffc83d',stroke:'#fff','stroke-width':2});N.ymax=h('s:text',{x:10,y:11});
 N.ax=[0,1,2,3].map(()=>h('s:text',{y:190,'text-anchor':'middle'}));
 N.cv=h('s:line',{y1:14,y2:172,stroke:'var(--f-tx)',opacity:'.5'});N.cd=h('s:circle',{r:5,fill:'var(--fa)',stroke:'#fff','stroke-width':2});
 N.tb=h('s:rect',{width:132,height:44,rx:8,fill:'var(--f-cd)',stroke:'var(--fa)'});N.t1=h('s:text',{});N.t2=h('s:text',{});N.t3=h('s:text',{});
 N.tip=h('s:g',{visibility:'hidden'},[N.cv,N.cd,N.tb,N.t1,N.t2,N.t3]);
 N.hit=h('s:rect',{x:0,y:0,width:340,height:200,fill:'transparent'});
 N.cs=h('s:svg',{viewBox:'0 0 340 200',cls:'fe-ct',role:'img','aria-label':'Grafik proyeksi pertumbuhan aset per tahun'},[N.area,N.tgt,N.line,N.rl,N.rt,N.fi,N.ymax].concat(N.ax,[N.tip,N.hit]));
 const lg=h('div',{cls:'fe-lg'},[h('span',{},[h('i',{style:'background:var(--fa)'}),document.createTextNode('Asetmu')]),h('span',{},[h('i',{style:'background:var(--f-ac)'}),document.createTextNode('Target (naik ikut inflasi)')])]);
 w.append(h('section',{cls:'fe-g'},[h('div',{cls:'fe-l',style:'margin-bottom:8px'},[h('span',{text:'Grafik Pertumbuhan Aset 📊'})]),N.cs,lg]));
 root.append(w);document.body.append(root);

 root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.m){st.mode=b.dataset.m;fix(st);persist();paint()}
  else if(b.dataset.sx){st.sx=+b.dataset.sx;fix(st);persist();paint()}
  else if(b.dataset.act==='close')close();
  else if(b.dataset.act==='reset'){st=fix(Object.assign({},DEF,{mode:st.mode}));clearHints();N.note.textContent='Balik ke pengaturan awal.';persist();paint()}
  else if(b.dataset.act==='pull'){const ok=pullApp();clearHints();N.note.textContent=ok?'Aset & pengeluaran ditarik dari data aplikasi ✅':'Belum ada data aset/transaksi untuk ditarik.';persist();paint()}});
 root.addEventListener('input',e=>{const t=e.target,k=t.dataset&&t.dataset.k;if(!k)return;const f=F[k];let v;
  if(t.type==='range')v=fromSl(f,+t.value);
  else{const r=String(t.value).trim();if(f.t==='m'){const d=r.replace(/\D/g,'');if(d===''&&r!=='')return;v=d===''?0:Number(d.slice(0,15))}else{v=parseFloat(r.replace(',','.').replace(/[^0-9.\-]/g,''));if(!Number.isFinite(v))return}}
  const before=Object.assign({},st);st[k]=v;fix(st);N.note.textContent='';
  FD.forEach(x=>{hints[x.k].textContent=x.k===k?(st[k]!==v?'Disesuaikan ke '+disp(x,st[k])+' (batas aman)':''):(st[x.k]!==before[x.k]?'Ikut disesuaikan otomatis':'')});
  persist();paint()});
 root.addEventListener('focusout',()=>setTimeout(paint,0));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('on'))close()});
 const at=e=>{const r=N.cs.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*340;tip(x)};
 N.hit.addEventListener('pointermove',at);N.hit.addEventListener('pointerdown',at);
 N.hit.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')N.tip.setAttribute('visibility','hidden')});
 built=true}
const clearHints=()=>FD.forEach(f=>hints[f.k].textContent='');

/* ---------- render (hanya set textContent/atribut pada node yang sudah ada) ---------- */
function tip(px){if(!cur)return;const Y=cur.Y,i=Math.max(0,Math.min(Y,Math.round((px-10)/320*Y))),p=cur.c.pts[i],x=10+i/Y*320,y=cur.yp(p.a);
 N.cv.setAttribute('x1',x);N.cv.setAttribute('x2',x);N.cd.setAttribute('cx',x);N.cd.setAttribute('cy',y);
 const bx=x>200?x-140:x+8;N.tb.setAttribute('x',bx);N.tb.setAttribute('y',20);
 [[N.t1,'Usia '+(st.age+i)+' th',32],[N.t2,'Aset '+R(p.a),43],[N.t3,'Target '+R(p.g),54]].forEach(r=>{r[0].setAttribute('x',bx+8);r[0].setAttribute('y',r[2]);r[0].textContent=r[1]});
 N.tip.setAttribute('visibility','visible')}
function paint(){if(raf||!built)return;raf=requestAnimationFrame(draw)}
function draw(){raf=0;if(!built)return;const c=calc(st),M=MODES[st.mode],ae=document.activeElement,pc=c.pct;
 root.dataset.mode=st.mode;root.style.setProperty('--fa',M.a);root.style.setProperty('--fb',M.b);
 Object.keys(MODES).forEach(k=>N['m_'+k].classList.toggle('on',k===st.mode));
 N.vibe.innerHTML=M.v;/* teks statis dari konstanta kode, bukan input pengguna */
 N.sx.hidden=st.mode!=='sultan';[].forEach.call(N.sx.children,b=>b.classList.toggle('on',+b.dataset.sx===st.sx));
 FD.forEach(f=>{const v=st[f.k];if(ae!==ti[f.k])ti[f.k].value=f.t==='m'?nf.format(v):String(v);
  if(ae!==sl[f.k]){sl[f.k].value=toSl(f,v);}sl[f.k].style.setProperty('--p',(sl[f.k].value-sl[f.k].min)/(sl[f.k].max-sl[f.k].min)*100+'%')});
 /* gauge: merah → hijau → emas */
 const gold=pc>=100,hue=Math.min(120,pc*1.2),lv=Math.min(9,Math.floor(pc/10)),xp=gold?100:(pc%10)*10;
 N.s1.style.stopColor=gold?'#ffd54a':'hsl('+Math.max(0,hue-35)+' 90% 56%)';N.s2.style.stopColor=gold?'#ff9f1c':'hsl('+hue+' 85% 48%)';
 N.arc.style.strokeDashoffset=515.22*(1-pc/100);N.kg.style.transform='rotate('+pc*3.6+'deg)';N.gw.classList.toggle('gold',gold);
 N.pct.textContent=pc.toFixed(1)+'%';N.lv.textContent='Lv.'+(lv+1);N.lt.textContent=LV[lv];N.xpb.style.width=xp+'%';
 N.xpl.textContent='XP '+Math.round(xp*10)+' / 1.000';N.xpr.textContent=lv<9?'Next: '+LV[lv+1]:'Level maksimal!';
 /* statistik */
 N.tgv.textContent=R(c.T0);N.tgs.textContent=Math.round(c.mult*100)+'% pengeluaran · nilai di usia '+st.ret_age+': '+R(c.Tn);
 N.pjv.textContent=R(c.proj);N.pjs.textContent='Cair ±'+R(c.proj*st.swr/100/12)+'/bln saat pensiun (SWR '+st.swr+'%) · return riil '+(c.real*100).toFixed(2)+'%/th';
 const ya=c.tFI==null?null:st.age+Math.ceil(c.tFI/12);
 if(c.T0<=0){N.tmv.textContent='—';N.tms.textContent='Isi pengeluaran bulanan dulu ya.'}
 else if(c.tFI===0){N.tmv.textContent='Udah bebas 🎉';N.tms.textContent='Asetmu sudah menutup target.'}
 else if(c.tFI==null){N.tmv.textContent='> '+(100-st.age)+' th';N.tms.textContent='Belum kekejar sampai usia 100. Naikin investasi!'}
 else{const d=ya-st.ret_age;N.tmv.textContent=dur(c.tFI);N.tms.textContent='Bebas di usia '+ya+' · '+(d<=0?Math.abs(d)+' th lebih cepat dari target':d+' th lewat dari target')}
 if(c.T0<=0){N.vd.className='fe-vd';N.vd.textContent='Isi pengeluaran bulananmu biar targetnya bisa dihitung.'}
 else if(gold){N.vd.className='fe-vd gold';N.vd.textContent='🎉 Level maksimal! Asetmu udah nutup target. Tinggal pilih: resign atau lanjut main.'}
 else if(c.proj>=c.Tn){N.vd.className='fe-vd';N.vd.textContent='Aman jaya 😎 Di usia '+st.ret_age+' asetmu diproyeksi '+R(c.proj)+', di atas target '+R(c.Tn)+'.'}
 else{N.vd.className='fe-vd warn';N.vd.textContent='Masih kurang '+R(c.Tn-c.proj)+' di usia '+st.ret_age+'. Naikin investasi jadi ±'+R(st.monthly+c.need)+'/bln atau geser usia pensiun.'}
 /* grafik */
 const Y=Math.max(2,Math.min(100-st.age,c.tFI==null?c.n:Math.max(c.n,Math.ceil(c.tFI/12)+2)));let mx=1;
 for(let i=0;i<=Y;i++)mx=Math.max(mx,c.pts[i].a,c.pts[i].g);mx*=1.1;
 const X=i=>+(10+i/Y*320).toFixed(1),yp=v=>+(172-Math.min(v,mx)/mx*158).toFixed(1);
 let l='',g='';for(let i=0;i<=Y;i++){l+=(i?'L':'M')+X(i)+','+yp(c.pts[i].a);g+=(i?'L':'M')+X(i)+','+yp(c.pts[i].g)}
 N.line.setAttribute('d',l);N.tgt.setAttribute('d',g);N.area.setAttribute('d',l+'L'+X(Y)+',172L10,172Z');
 N.rl.setAttribute('x1',X(c.n));N.rl.setAttribute('x2',X(c.n));N.rt.setAttribute('x',Math.min(310,Math.max(30,X(c.n))));
 const fy=c.tFI==null?null:c.tFI/12;
 if(fy!=null&&fy<=Y){N.fi.setAttribute('cx',+(10+fy/Y*320).toFixed(1));N.fi.setAttribute('cy',yp(c.T0*Math.pow(1+st.infl/100,fy)));N.fi.setAttribute('visibility','visible')}else N.fi.setAttribute('visibility','hidden');
 N.ymax.textContent=R(mx/1.1);N.ax.forEach((t,j)=>{const i=Math.round(Y*j/3);t.setAttribute('text-anchor',j===0?'start':j===3?'end':'middle');t.setAttribute('x',X(i));t.textContent=(st.age+i)+' th'});
 N.tip.setAttribute('visibility','hidden');cur={c:c,Y:Y,yp:yp}}

/* ---------- buka / tutup ---------- */
function theme(){return document.body.classList.contains('sm')?'simpel':(typeof S==='object'&&S&&S.settings&&S.settings.mode==='wanita')?'wanita':'pria'}
function open(){if(!st)init();else sync();if(!built)build();lastFocus=document.activeElement;root.dataset.th=theme();root.classList.add('on');
 document.body.style.overflow='hidden';if(pill)pill.hidden=true;root.scrollTop=0;draw();const x=root.querySelector('.fe-x');if(x)x.focus()}
function close(){if(!root)return;root.classList.remove('on');document.body.style.overflow='';if(pill)pill.hidden=false;flush();
 if(lastFocus&&lastFocus.focus&&document.contains(lastFocus))try{lastFocus.focus()}catch(e){}}
/* kartu ringkas untuk Beranda mode Pria (hanya angka hasil hitung + teks statis) */
function card(){if(!st)init();else sync();const c=calc(st),M=MODES[st.mode];
 return '<section class="c f27-card"><h3>🔥 F.I.R.E Tracker <span class="f27-chip">'+M.e+' '+M.n+'</span></h3><div class="f27-big">'+c.pct.toFixed(1)+'%<small style="font-size:13px;font-weight:600"> menuju Dana Rebahan 🏖️</small></div><div class="bar" style="margin:8px 0"><i style="width:'+Math.max(c.pct,1).toFixed(1)+'%"></i></div><small style="display:block;margin-bottom:10px">Target '+esc(R(c.T0))+' · Proyeksi '+esc(R(c.proj))+'</small><button class="b p" data-a="firetr">Buka kalkulator & grafik</button></section>'}

try{pill=h('button',{cls:'fe-pill',type:'button','aria-label':'Buka F.I.R.E Tracker',text:'🔥 F.I.R.E'});pill.addEventListener('click',open);document.body.append(pill);
 if(typeof A==='object'&&A)A.firetr=open;
 window.addEventListener('pagehide',flush)}catch(e){}
return{open:open,close:close,card:card,calc:calc}
})();
