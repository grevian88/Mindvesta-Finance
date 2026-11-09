
(function(){
'use strict';
/* ====== util ====== */
const nf=n=>new Intl.NumberFormat('id-ID').format(Math.round(n||0));
const R0=n=>'Rp '+nf(n);
const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const rng=seed=>{let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}};
const dim=m=>{const[y,o]=m.split('-').map(Number);return new Date(y,o,0).getDate()};
const mode=()=>S.settings.mode;

/* =========================================================
   1) MODE PRIA — F.I.R.E TRACKER + PORTOFOLIO
   ========================================================= */
const INV=['Tabungan/Deposito','Emas','Saham/Reksa Dana','Kripto'];
const fcfg=()=>Object.assign({swr:4,ret:7,infl:3,exp:0,contrib:0,cash:0,ci:[]},S.fire||{});
function last3(){const n=iso().slice(0,7),r=[];
  for(let i=1;i<=3;i++){const m=sm(n,-i),a=S.transactions.filter(t=>td(t).startsWith(m)),inc=sum(a,'income'),all=sum(a,'expense'),liv=sum(a.filter(t=>t.category!=='Tabungan & Target'&&t.category!=='Pembayaran Utang'),'expense');if(inc>0||all>0)r.push([inc,liv,all])}
  return r}
function fire(extra){
  const c=fcfg(),M=last3(),avg=i=>M.length?M.reduce((s,x)=>s+x[i],0)/M.length:0;
  const exp=c.exp||Math.round(avg(1)),con=(c.contrib||Math.max(0,Math.round(avg(0)-avg(2))))+(extra||0);
  const inv=S.assets.filter(a=>INV.includes(a.type)).reduce((s,a)=>s+(+a.value||0),0)+(c.cash?Math.max(0,cash()):0);
  const T=exp*12*100/Math.max(.5,c.swr),real=(1+c.ret/100)/(1+c.infl/100)-1,r=Math.pow(1+real,1/12)-1;
  let b=inv,n=0;if(T>0)while(b<T&&n<1200){b=b*(1+r)+con;n++}
  return{c,exp,con,inv,T,n:T>0&&b>=T?n:null,pct:T?Math.min(100,inv/T*100):0,passive:inv*c.swr/100/12}}
const fireCard=()=>'';
const _vh=V.home;
V.home=()=>{const h=_vh();if(mode()!=='pria')return h;const i=h.indexOf('class="c hero"'),j=i<0?-1:h.indexOf('</section>',i);return j<0?fireCard()+h:h.slice(0,j+10)+fireCard()+h.slice(j+10)};

/* =========================================================
   2) MODE WANITA — GIRL MATH + VISION BOARD
   ========================================================= */
const GM_E=['👜','👟','✈️','💄','📱','🏠','💍','🎧','🧴','🎀'];
function gmCalc(s){
  const P=s.price,D=Math.round(P*s.disc/100),F=Math.max(0,P-D-s.vou),saved=P-F,W=Math.max(1,s.wears);
  const inc=+S.advice.income||avgInc(),sp=spentBy(iso().slice(0,7))['Belanja Pribadi']||0,bl=S.budgets['Belanja Pribadi'];
  const sisa=bl?bl-sp:null,cpw=F/W,r=rng(hash(s.name+P+s.disc));
  const pick=a=>a[Math.floor(r()*a.length)];
  const L=[];
  if(saved>0)L.push(`💸 Kamu <b>menghemat ${R0(saved)}</b>. Uang yang tidak keluar itu ibarat uang masuk, ya kan?`);
  if(s.disc>=50)L.push(pick(['🎀 Diskon '+s.disc+'% itu praktis <b>gratis separuh</b>.','✨ Harga hampir setengah, tinggal setengah lagi yang “dibayar”.']));
  else if(s.disc>=20)L.push('🛍️ Diskon '+s.disc+'% — secara girl math, ini “bayar sebagian doang”.');
  L.push(`👠 Cost per wear: <b>${R0(cpw)}</b> kalau dipakai ${nf(W)}×. Makin sering dipakai, makin “gratis”.`);
  L.push(`🗓️ Setara <b>${R0(F/365)}</b> per hari selama setahun.`);
  L.push(`☕ Setara <b>${(F/25000).toFixed(1)} gelas kopi</b> (asumsi Rp 25.000/gelas).`);
  if(F===0&&P>0)L.push('🎁 Bayarnya Rp 0 → secara girl math, ini <b>gratis!</b>');
  const pct=inc?F/inc*100:0;
  let v='ok',vt='✅ Girl math approved',vs='Masuk akal untuk dibeli.';
  const over=sisa!=null&&F>sisa,big=pct>15;
  if(over||big||(cpw>50000&&W<20)){v='no';vt='😭 Dompetmu nangis';vs=over?'Melebihi sisa anggaran Belanja Pribadi bulan ini.':big?'Lebih dari 15% pemasukan bulananmu.':'Terlalu mahal per pemakaian.'}
  else if(pct>5||(sisa!=null&&F>sisa*.6)||cpw>15000){v='wait';vt='⏳ Tahan 24 jam dulu';vs='Masih wajar, tapi tidur dulu satu malam. Kalau besok masih mau, beli!'}
  const real=[];
  real.push(`Harga bayar: <b>${R0(F)}</b>`+(inc?` · ${pct.toFixed(1)}% dari pemasukan bulanan`:''));
  if(sisa!=null)real.push(`Sisa anggaran Belanja Pribadi: ${R0(sisa)} → setelah beli: <b style="color:${sisa-F<0?'#c0284f':'#12805c'}">${sisa-F<0?'−':''}${R0(Math.abs(sisa-F))}</b>`);
  return{F,saved,L,v,vt,vs,real}}
function gmMonthSaved(){const m=iso().slice(0,7);return (S.gm||[]).filter(x=>String(x.d).startsWith(m)).reduce((s,x)=>s+(+x.s||0),0)}
function gmOpen(){
  let o=document.getElementById('f27gm');if(o)o.remove();
  o=document.createElement('div');o.id='f27gm';o.className='f27-ov';document.body.append(o);
  const st={name:'',price:0,disc:0,vou:0,wears:30};
  const vision=()=>S.goals.length?`<div class="gmc"><b>🌸 Vision Board</b><div class="vb" style="margin-top:8px">${S.goals.slice(0,8).map((g,i)=>{const p=g.target?Math.min(100,Math.round(g.current/g.target*100)):0;return `<button class="vt" data-gx="goal" data-i="${g.id}"><b>${GM_E[hash(g.name)%GM_E.length]}</b><span>${esc(g.name)}</span><small>${R0(g.current)} / ${R0(g.target)}</small><div class="bar"><i style="width:${p}%"></i></div></button>`}).join('')}</div></div>`:'';
  o.innerHTML=`<div class="gm"><div class="gmh"><button data-gx="close" aria-label="Tutup">‹</button>Girl Math ✨</div>
  <div class="gmsub">Validasi belanja dengan cara yang menyenangkan. Total “hemat” bulan ini: <b>${R0(gmMonthSaved())}</b></div>
  <div class="gmc"><label>Nama barang (opsional)</label><input id="gm-n" placeholder="Contoh: Tas mini" maxlength="40" autocomplete="off">
   <div class="g2c"><div><label>Harga normal (Rp)</label><input id="gm-p" data-m inputmode="numeric" placeholder="0" autocomplete="off"></div><div><label>Diskon (%)</label><input id="gm-d" inputmode="decimal" placeholder="0" autocomplete="off"></div>
   <div><label>Voucher / cashback (Rp)</label><input id="gm-v" data-m inputmode="numeric" placeholder="0" autocomplete="off"></div><div><label>Dipakai berapa kali?</label><input id="gm-w" inputmode="numeric" value="30" autocomplete="off"></div></div></div>
  <div id="gm-res"></div>${vision()}</div>`;
  const res=o.querySelector('#gm-res');let cur=null;
  const upd=()=>{const g=id=>o.querySelector('#'+id).value;st.name=g('gm-n').trim();st.price=num(g('gm-p'));st.disc=Math.min(100,Math.max(0,parseFloat(g('gm-d').replace(',','.'))||0));st.vou=num(g('gm-v'));st.wears=Math.max(1,parseInt(g('gm-w'),10)||1);
    if(!st.price){res.innerHTML='<div class="gmc"><small style="color:#a0708a">Isi harga barang, nanti kami validasi dengan girl math ✨</small></div>';cur=null;return}
    cur=gmCalc(st);
    res.innerHTML=`<div class="gmv ${cur.v}">${cur.vt}<small>${cur.vs}</small></div><div class="gmc">${cur.L.map(x=>`<div class="gml">${x}</div>`).join('')}</div><div class="gmc"><b>Cek realita 🧾</b>${cur.real.map(x=>`<div class="gml">${x}</div>`).join('')}<div class="gmb"><button class="p" data-gx="buy">Catat pengeluaran</button><button data-gx="wish">Simpan ke Wishlist</button></div></div>`};
  o.addEventListener('input',upd);
  o.addEventListener('click',e=>{const b=e.target.closest('[data-gx]');if(!b)return;const k=b.dataset.gx;
    const done=()=>{o.remove();document.body.style.overflow=''};
    if(k==='close')done();
    else if(k==='goal'){done();A.goaledit(b.dataset.i)}
    else if(k==='wish'&&cur){S.goals.push({id:Date.now(),name:st.name||'Wishlist',target:cur.F,current:0});done();save();toast('Masuk Vision Board 🌸')}
    else if(k==='buy'&&cur){S.gm=(S.gm||[]).concat({d:iso(),n:st.name,s:cur.saved}).slice(-300);const F=cur.F,nm=st.name,ct=S.catExp.includes('Belanja Pribadi')?'Belanja Pribadi':null;done();save();eOpen(null,ct);E.expr=String(F);E.note=nm;const ni=document.getElementById('enote');if(ni)ni.value=nm;eRender()}});
  document.body.style.overflow='hidden';upd();setTimeout(()=>{const n=o.querySelector('#gm-n');n&&n.focus()},60)}
A.gmath=()=>gmOpen();
/* tombol di Fitur & pintasan Buku (hanya mode Wanita) */
if(typeof FT!=='undefined'&&!FT[0][1].some(x=>x[0]==='gmath'))FT[0][1].unshift(['gmath','cherry','Girl Math ✨','Validasi belanja + Vision Board','girl math belanja diskon wishlist vision board validasi cost per wear']);
if(typeof fQS==='function'){const _q=fQS;fQS=function(){const h=_q(),i=h.lastIndexOf('</div>');return i<0?h:h.slice(0,i)+`<button data-a="gmath" data-i="">${ik('cherry',26)}<span>Girl Math</span></button>`+h.slice(i)}}

/* =========================================================
   3) MODE SIMPEL — ROAST MY SPENDING + WRAPPED (shareable)
   ========================================================= */
const SAVC='Tabungan & Target',IMP=['Gengsi/FOMO','Impulsive Buying','Self-Reward/Healing','PayLater Billing'];
const COFR=/\b(kopi|ngopi|starbucks|janji jiwa|kenangan|fore|tomoro|latte|cafe|boba)\b/i,DELR=/gofood|grabfood|shopeefood|go-food|food delivery/i;
const tb=()=>S.transactions.filter(t=>bkOf(t)===bkc());
const rpct=(c,E,m$)=>{const all=c.length<=3,r=c.map(([k,v])=>v/E*100),f=r.map(Math.floor);if(all){let l=100-f.reduce((a,b)=>a+b,0);r.map((v,i)=>[v-f[i],i]).sort((a,b)=>b[0]-a[0]).forEach(([_,i])=>{if(l>0){f[i]++;l--}})}else r.forEach((v,i)=>f[i]=Math.round(v));return c.map(([k,v],i)=>[k,f[i],m$(v)])};
function rdata(per,spicy,hide){
  const T=tb(),ym=iso().slice(0,7);let a,label,span;
  if(per==='7d'){const s0=ad(iso(),-6);a=T.filter(t=>td(t)>=s0&&td(t)<=iso());label='7 hari terakhir';span=[...Array(7)].map((_,i)=>ad(s0,i))}
  else{const m=per==='prev'?sm(ym,-1):ym,n=per==='prev'?dim(m):new Date().getDate();a=T.filter(t=>td(t).startsWith(m));label=ml(m);span=[...Array(n)].map((_,i)=>`${m}-${String(i+1).padStart(2,'0')}`)}
  const ex=a.filter(t=>t.type==='expense'&&t.category!==SAVC),E=ex.reduce((s,t)=>s+(+t.amount||0),0),inc=a.filter(t=>t.type==='income').reduce((s,t)=>s+(+t.amount||0),0);
  const m$=v=>hide?'Rp •••':R0(v),by={};ex.forEach(t=>by[t.category]=(by[t.category]||0)+(+t.amount||0));
  const cats=Object.entries(by).sort((x,y)=>y[1]-x[1]),cof=ex.filter(t=>COFR.test(t.note||'')||/kopi/i.test(t.category)),cofS=cof.reduce((s,t)=>s+t.amount,0);
  const del=ex.filter(t=>DELR.test(t.note||'')),imp=IMP.reduce((s,k)=>s+(by[k]||0),0),impP=E?imp/E*100:0;
  const small=ex.filter(t=>t.amount<20000).length,wkE=ex.filter(t=>{const[y,mo,d]=td(t).split('-').map(Number),g=new Date(y,mo-1,d).getDay();return g===0||g===6}).reduce((s,t)=>s+t.amount,0);
  const first=T.reduce((m,t)=>{const d=td(t);return d&&(!m||d<m)?d:m},''),days=new Set(ex.map(td)),noSp=span.filter(d=>first&&d>=first&&!days.has(d)&&d<=iso()).length,big=[...ex].sort((x,y)=>y.amount-x.amount)[0];
  const net=inc-E,saved=a.filter(t=>t.type==='expense'&&t.category===SAVC).reduce((s,t)=>s+t.amount,0);
  const rate=inc>0?Math.max(-1,Math.min(1,net/inc)):0;
  let score=E?Math.round(Math.max(5,Math.min(99,60+rate*40-Math.min(25,impP*.8)+Math.min(10,noSp*2)-Math.min(10,E?cofS/E*50:0)))):null;
  let P=['🙂','Anak Rantau Biasa Aja','Pengeluaranmu stabil. Belum ada drama… belum.'];
  if(!E)P=['👻','Hantu Dompet','Belum ada pengeluaran tercatat. Dompetmu masih suci, atau kamu lupa nyatet? 👀'];
  else if(cof.length>=8||(cof.length>=3&&cofS/E>.12))P=['☕','Sultan Kopi Kenangan','Kafein itu bukan kepribadian, tapi pengeluaranmu bilang lain.'];
  else if(del.length>=6)P=['🛵','Presiden GoFood','Kakimu sehat, tapi kamu setia menunggu abang driver.'];
  else if(impP>=25)P=['🛍️','Raja Checkout Tengah Malam','Keranjang kuning adalah love language-mu.'];
  else if(inc>0&&net<0&&E>inc*1.2)P=['🕳️','Pejuang Tanggal Tua','Pengeluaran melampaui pemasukan. Saatnya rem tangan, bukan rem mendadak.'];
  else if(rate>=.3)P=['😎','Si Paling Hemat','Dompetmu aman. Teman-temanmu yang waswas kamu pelit 😌'];
  if(!E){const ghostCfg=RC();P[0]=ghostCfg.ghost;P[1]=ghostCfg.ghostTitle||'Hantu Dompet';}
  const r=rng(hash(per+label+(big?big.id:'0')+E)),pk=(m,s)=>spicy?s:m;
  const F=[];
  if(cof.length>=2)F.push({w:Math.min(10,cof.length+2),t:pk(`${cof.length}× ngopi = ${m$(cofS)}. Barista udah hafal ordermu 🥹`,`${cof.length}× ngopi = ${m$(cofS)}. Barista hafal namamu, tabunganmu lupa jalan pulang ☕`)});
  if(cats[0])F.push({w:8,t:pk(`${cats[0][0]} jadi pos terbesar (${Math.round(cats[0][1]/E*100)}%). Setia banget ya.`,`${cats[0][0]} nyedot ${Math.round(cats[0][1]/E*100)}% pengeluaranmu. Hubungan paling serius tahun ini.`)});
  if(small>=5)F.push({w:Math.min(9,small/2),t:pk(`${small} transaksi receh (<Rp20rb). Receh kalau numpuk bisa jadi gunung.`,`${small} transaksi receh. Kecil-kecil cabe rawit, dompet jebol pelan-pelan 🌶️`)});
  if(E&&ex.length>=6&&wkE/E>.45)F.push({w:7,t:pk(`${Math.round(wkE/E*100)}% pengeluaran terjadi di weekend.`,`${Math.round(wkE/E*100)}% duit habis di weekend. Senin kerja buat bayar Sabtu.`)});
  if(del.length>=3)F.push({w:Math.min(9,del.length+2),t:pk(`${del.length}× pesan makanan online. Ongkirnya lumayan lho.`,`${del.length}× delivery. Ongkirnya udah bisa jadi dana darurat mini 🛵`)});
  if(impP>15)F.push({w:9,t:pk(`${Math.round(impP)}% pengeluaran masuk kategori impulsif/FOMO.`,`${Math.round(impP)}% pengeluaran = FOMO & checkout impulsif. Jari lebih cepat dari logika.`)});
  if(noSp>0)F.push({w:5+(noSp>=3?1:0),t:`${noSp} hari tanpa pengeluaran. Respect 🫡`});else if(E)F.push({w:6,t:pk('Belum ada hari tanpa jajan. Coba satu hari saja?','0 hari tanpa jajan. Dompetmu butuh healing juga, bukan cuma kamu.')});
  if(E&&inc>0&&net<0)F.push({w:10,t:pk(`Defisit ${m$(-net)}. Tenang, masih bisa dikejar.`,`Defisit ${m$(-net)}. Katanya “investasi pengalaman”… yang balik modalnya kapan?`)});
  else if(E&&inc>0)F.push({w:4,t:pk(`Masih surplus ${m$(net)}. Jaga ya!`,`Masih surplus ${m$(net)}. Awas, FOMO lagi ngintip dari balik toko.`)});
  if(big)F.push({w:5,t:pk(`Pengeluaran terbesar: ${(big.note||big.category).slice(0,28)} (${m$(big.amount)}).`,`Satu transaksi “${(big.note||big.category).slice(0,28)}” ${m$(big.amount)} — satu transaksi, satu pelajaran.`)});
  F.forEach(f=>f.k=f.w+r()*3);F.sort((x,y)=>y.k-x.k);const lines=F.slice(0,3).map(f=>f.t);
  const tips=[];
  if(cof.length>=4)tips.push(`Kurangi ngopi 2×/minggu → hemat ±${m$(Math.round(cofS/cof.length*8/500)*500)} / bulan.`);
  if(cats[0])tips.push(`Pasang batas bulanan untuk ${cats[0][0]} di tab Anggaran.`);
  if(noSp<2)tips.push('Tantang diri: 2 hari tanpa jajan minggu ini.');
  if(inc>0&&net<0)tips.push('Target bulan depan: balik ke surplus dulu.');
  tips.push('Sisihkan dulu 10% di awal bulan, jajan belakangan.');
  const s=[];
  s.push({emo:P[0],kicker:'ROAST '+label.toUpperCase(),title:P[1],big:score==null?'—':`Skor Dompet ${score}/100`,sc:score,lines:[P[2]]});
  if(E){
    s.push({emo:'📊',kicker:label.toUpperCase(),title:'Top Pengeluaran',bars:rpct(cats.slice(0,3),E,m$),lines:[`Total keluar ${m$(E)} · ${ex.length} transaksi`+(saved?` · menabung ${m$(saved)}`:'')]});
    s.push({emo:'🔥',kicker:spicy?'MODE PEDAS':'MODE LEMBUT',title:'Roast-nya',lines:lines.length?lines:['Datanya masih sedikit. Catat lebih banyak biar roast-nya makin akurat 😆']});
    s.push({emo:'🎯',kicker:'MISI BERIKUTNYA',title:'Biar Naik Level',lines:tips.slice(0,3)})}
  return{label,score,persona:P,slides:s,hue:hash(P[1])%360}}
const rtext=d=>d.slides.map(s=>[s.emo+' '+s.title,s.big,...(s.bars||[]).map(b=>`• ${b[0]} ${b[1]}% (${b[2]})`),...(s.lines||[])].filter(Boolean).join('\n')).join('\n\n')+'\n\n#RoastMySpending · Mindvesta Finance';
const RT=[['auto','Otomatis',0,'#fff'],['neon','Neon',['#1b0f3b','#5b21b6','#06b6d4'],'#fff'],['gold','Emas',['#0b0b0b','#3a2a08','#d9a520'],'#fff'],['candy','Permen',['#ffd9ec','#ff9ccb','#c9a8ff'],'#3b0a2a'],['mint','Mint',['#dcfff1','#86e5c0','#32b093'],'#05302a'],['sunset','Senja',['#2a0845','#d6336c','#ff9a3c'],'#fff'],['ocean','Samudra',['#04122e','#0b5cad','#35d0ba'],'#fff'],['paper','Kertas',['#fbf3e4','#f2e0bd','#e7c98f'],'#33260f'],['custom','Kustom',0,'#fff']];
const hx=v=>/^#[0-9a-f]{6}$/i.test(v)?v:'';
const RG=[['👻','Hantu'],['🪩','Club'],['🎧','DJ'],['🕺','Party'],['🍸','Martini'],['🍹','Koktail'],['🍺','Bir'],['🥂','Cheers'],['🥃','Whisky'],['🍷','Wine']];
const RC=()=>{const r=(S.settings&&S.settings.roast)||{};return{th:RT.some(t=>t[0]===r.th)?r.th:'auto',c1:hx(r.c1)||'#7c3aed',c2:hx(r.c2)||'#06b6d4',pat:['none','dots','lines','circles'].includes(r.pat)?r.pat:'circles',nm:String(r.nm||'').slice(0,24),ghost:String(r.ghost||'👻').slice(0,8),ghostTitle:String(r.ghostTitle||'Hantu Dompet').slice(0,28)}};
const lum=h=>{const n=parseInt(h.slice(1),16),f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(n>>16&255)+.7152*f(n>>8&255)+.0722*f(n&255)};
const mixc=(a,b)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round((v+B[i])/2).toString(16).padStart(2,'0')).join('')};
function rth(cf,hue){if(cf.th==='custom'){const m=mixc(cf.c1,cf.c2);return{c:[cf.c1,m,cf.c2],ink:lum(m)>.4?'#1b1020':'#fff'}}
  const t=RT.find(z=>z[0]===cf.th);if(t&&t[2])return{c:t[2],ink:t[3]};return{c:[`hsl(${hue} 70% 14%)`,`hsl(${hue} 65% 30%)`,`hsl(${(hue+40)%360} 80% 50%)`],ink:'#fff'}}
const rIco=k=>{let e='🏷️';try{e=(window.VFK&&VFK.catEmoji(k))||e}catch(x){}return e==='pump'?'⛽':e};
function rcanvas(sl,hue,i=0,n=1,label=''){
  const W=1080,H=1920,M=80,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),cf=RC(),T=rth(cf,hue),ink=T.ink,dk=ink==='#fff';
  const F='system-ui,-apple-system,"Segoe UI",Roboto,"Apple Color Emoji","Noto Color Emoji",sans-serif',fnt=(s,w)=>x.font=`${w} ${s}px ${F}`;
  const rr=(a,b,w,h,r)=>{x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()};
  const al=(v,fn)=>{x.globalAlpha=v;fn();x.globalAlpha=1};
  const wr=(t,s,w,mx)=>{fnt(s,w);const o=[];let ln='';for(const wd of String(t).split(/\s+/)){const tt=ln?ln+' '+wd:wd;if(x.measureText(tt).width>mx&&ln){o.push(ln);ln=wd}else ln=tt}if(ln)o.push(ln);return o};
  const fit=(t,s,mn,w,mx,ml)=>{let z=s,L=wr(t,z,w,mx);while((L.length>ml||L.some(l=>x.measureText(l).width>mx))&&z>mn){z-=4;L=wr(t,z,w,mx)}return{z,L}};
  const card=(a,b,w,h)=>{al(dk?.14:.09,()=>{x.fillStyle=ink;rr(a,b,w,h,36);x.fill()});al(dk?.28:.16,()=>{x.strokeStyle=ink;x.lineWidth=3;rr(a,b,w,h,36);x.stroke()})};
  const g=x.createLinearGradient(0,0,W*.7,H);g.addColorStop(0,T.c[0]);g.addColorStop(.55,T.c[1]);g.addColorStop(1,T.c[2]);x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle=ink;x.strokeStyle=ink;
  if(cf.pat==='circles')al(.07,()=>{[[930,200,330],[100,1560,300],[980,1250,150]].forEach(([a,b,r])=>{x.beginPath();x.arc(a,b,r,0,7);x.fill()})});
  else if(cf.pat==='dots')al(.1,()=>{for(let a=40;a<W;a+=60)for(let b=40;b<H;b+=60){x.beginPath();x.arc(a,b,4,0,7);x.fill()}});
  else if(cf.pat==='lines')al(.07,()=>{x.lineWidth=6;for(let a=-H;a<W;a+=90){x.beginPath();x.moveTo(a,0);x.lineTo(a+H*.6,H);x.stroke()}});
  x.textBaseline='alphabetic';x.textAlign='left';
  al(dk?.16:.1,()=>{rr(M,72,360,72,36);x.fill()});fnt(34,800);x.fillText('💰 Mindvesta Finance',M+28,119);
  x.textAlign='right';al(.8,()=>x.fillText(`${i+1}/${n}`,W-M,119));x.textAlign='left';
  fnt(34,800);al(.85,()=>{try{x.letterSpacing='4px'}catch(e){}x.fillText(String(sl.kicker||'').toUpperCase(),M,215);try{x.letterSpacing='0px'}catch(e){}});
  const ft=H-150;let y=270;const MX=W-2*M;
  if(sl.sc!==undefined){
    card(W/2-215,y,430,430);fnt(230,400);x.textAlign='center';x.fillText(sl.emo,W/2,y+305);y+=500;
    const t=fit(sl.title,112,56,900,MX,2);fnt(t.z,900);t.L.forEach(l=>{x.fillText(l,W/2,y+t.z);y+=t.z*1.1});y+=30;
    const cy=y+230,sc=sl.sc==null?0:sl.sc;x.lineCap='round';x.lineWidth=46;al(.18,()=>{x.beginPath();x.arc(W/2,cy,185,0,7);x.stroke()});
    if(sc>0)x.beginPath(),x.arc(W/2,cy,185,-Math.PI/2,-Math.PI/2+Math.PI*2*sc/100),x.stroke();
    fnt(150,900);x.fillText(sl.sc==null?'—':String(sc),W/2,cy+38);fnt(34,700);al(.75,()=>x.fillText('dari 100',W/2,cy+92));
    const vd=sl.sc==null?'Belum ada data':sc>=75?'💚 Dompet Sehat':sc>=50?'🟡 Perlu Dirawat':'🔴 Zona Merah';fnt(46,800);const vw=x.measureText(vd).width+80;al(dk?.16:.1,()=>{rr(W/2-vw/2,cy+250,vw,86,43);x.fill()});x.fillText(vd,W/2,cy+308);y=cy+390;
    const q=fit((sl.lines||[''])[0],46,32,500,MX-70,4);fnt(q.z,500);const h=q.L.length*q.z*1.35+60;if(y+h<ft-10){card(M,y,MX,h);q.L.forEach((l,k)=>x.fillText(l,W/2,y+30+q.z*1.05+k*q.z*1.35))}
  }else{
    const t=fit(sl.title,104,60,800,MX,2);fnt(t.z,900);x.fillText(sl.emo,M,y+110);y+=150;t.L.forEach(l=>{x.fillText(l,M,y+t.z);y+=t.z*1.1});y+=40;
    if(sl.bars){const med=['🥇','🥈','🥉'];sl.bars.forEach((b,k)=>{card(M,y,MX,230);fnt(56,400);x.fillText(med[k]+rIco(b[0]),M+34,y+82);const nm=fit(b[0],48,28,800,MX-420,1);fnt(nm.z,800);x.fillText(nm.L[0],M+210,y+80);x.textAlign='right';fnt(66,900);x.fillText(b[1]+'%',W-M-34,y+84);x.textAlign='left';
      al(.2,()=>{rr(M+34,y+118,MX-68,30,15);x.fill()});rr(M+34,y+118,Math.max(30,(MX-68)*b[1]/100),30,15);x.fill();fnt(38,600);al(.85,()=>x.fillText(b[2],M+34,y+196));y+=260})}
    const L=sl.lines||[],mis=/MISI/.test(sl.kicker||'');let z=50;const meas=s=>L.map(l=>wr(l,s,600,MX-190).length*s*1.32+64);while(meas(z).reduce((a,b)=>a+b+26,0)>ft-y-20&&z>30)z-=2;
    L.forEach((l,k)=>{const W2=wr(l,z,600,MX-190),h=W2.length*z*1.32+64;card(M,y,MX,h);x.fillStyle=ink;al(dk?.2:.14,()=>{x.beginPath();x.arc(M+70,y+h/2,36,0,7);x.fill()});fnt(40,400);x.textAlign='center';x.fillText(sl.bars?'💬':mis?'🎯':['🔥','😂','🫠','💸'][k%4],M+70,y+h/2+14);x.textAlign='left';fnt(z,600);W2.forEach((s,j)=>x.fillText(s,M+140,y+32+z*1.05+j*z*1.32));y+=h+26})}
  x.textAlign='left';fnt(36,900);x.fillText('#RoastMySpending',M,ft+48);fnt(30,600);al(.8,()=>{x.fillText(label,M,ft+96);x.textAlign='right';x.fillText(cf.nm||'Mindvesta Finance',W-M,ft+48)});return c}
function ropen(){
  let o=document.getElementById('f27ro');if(o)o.remove();
  const opener=document.activeElement,pov=document.body.style.overflow;
  o=document.createElement('div');o.id='f27ro';o.className='f27-ov';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label','Roast My Spending');o.tabIndex=-1;document.body.append(o);document.body.style.overflow='hidden';
  const st={per:'month',spicy:0,hide:1,i:0,cu:0};let d;
  const close=()=>{document.removeEventListener('keydown',kd);o.remove();document.body.style.overflow=pov;try{opener&&opener.focus&&opener.focus()}catch(e){}};
  const kd=e=>{if(!document.body.contains(o)){document.removeEventListener('keydown',kd);return}if(e.key==='Escape'){close()}else if(e.target.tagName!=='INPUT'&&e.key==='ArrowRight'&&st.i<d.slides.length-1){st.i++;draw()}else if(e.target.tagName!=='INPUT'&&e.key==='ArrowLeft'&&st.i>0){st.i--;draw()}};
  document.addEventListener('keydown',kd);
  const sv=p=>{S.settings.roast=Object.assign({},S.settings.roast,p);try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Penyimpanan penuh, tema belum tersimpan.')}};
  const mk=()=>{const cv=rcanvas(d.slides[st.i],d.hue,st.i,d.slides.length,d.label);cv.className='rcv';cv.id='rcv';cv.setAttribute('role','img');cv.setAttribute('aria-label',rtext({slides:[d.slides[st.i]]}));return cv};
  const paint=()=>{const old=o.querySelector('#rcv');if(old)old.replaceWith(mk())};
  const draw=()=>{d=rdata(st.per,st.spicy,st.hide);st.i=Math.min(st.i,d.slides.length-1);const cf=RC(),B=(k,v,t,on)=>`<button data-r="${k}"${v!==undefined?` data-v="${v}"`:''} class="${on?'on':''}" aria-pressed="${!!on}">${t}</button>`;
    const sw=RT.map(t=>{const T=t[0]==='custom'?rth(cf,0):t[2]?{c:t[2]}:{c:['#1b1b2f','#5b2a86','#e85d75']};return `<button class="sw${cf.th===t[0]?' on':''}" data-r="th" data-v="${t[0]}" aria-label="Tema ${t[1]}" title="${t[1]}" style="background:linear-gradient(135deg,${T.c[0]},${T.c[1]},${T.c[2]})"></button>`}).join('');
    o.innerHTML=`<div class="ro"><div class="op">${B('per','month','Bulan ini',st.per==='month')}${B('per','prev','Bulan lalu',st.per==='prev')}${B('per','7d','7 hari',st.per==='7d')}${B('spicy',undefined,'🌶️ Pedas',st.spicy)}${B('hide',undefined,'🙈 Sembunyikan nominal',st.hide)}</div>
    <div class="rth" role="group" aria-label="Tema kartu">${sw}${B('cust',undefined,'🎨 Kustom',st.cu)}</div>
    ${st.cu?`<div class="rcu"><label>Warna 1<input type="color" data-ri="c1" value="${cf.c1}"></label><label>Warna 2<input type="color" data-ri="c2" value="${cf.c2}"></label><div class="op">${[['circles','Bulat'],['dots','Titik'],['lines','Garis'],['none','Polos']].map(p=>B('pat',p[0],p[1],cf.pat===p[0])).join('')}</div><input data-ri="nm" maxlength="24" placeholder="Namamu di kartu (opsional)" value="${esc(cf.nm)}"><section class="rg"><b>Ikon Hantu Dompet</b><small>Pilih ikon untuk kartu saat belum ada pengeluaran.</small><div class="rg-grid">${RG.map(([em,n])=>`<button type="button" data-r="ghost" data-v="${em}" class="${cf.ghost===em?'on':''}" aria-label="Pilih ikon ${n}" title="${n}"><span>${em}</span><small>${n}</small></button>`).join('')}</div><label class="rg-custom">Emoji kustom<input data-ri="ghost" maxlength="8" inputmode="text" autocomplete="off" placeholder="Contoh: 🪩" value="${RG.some(x=>x[0]===cf.ghost)?'':esc(cf.ghost)}"></label><label class="rg-custom">Tulisan / nama Hantu Dompet<input data-ri="ghostTitle" maxlength="28" autocomplete="off" placeholder="Hantu Dompet" value="${cf.ghostTitle==='Hantu Dompet'?'':esc(cf.ghostTitle)}"></label><small class="rg-note">Ikon dan tulisan kustom akan tampil di kartu, teks salinan, serta gambar Roast yang dibagikan.</small></section></div>`:''}
    <div class="rcw"><span id="rcv"></span></div>
    ${d.slides.length>1?`<div class="ct" role="group" aria-label="Navigasi kartu"><button type="button" class="n" data-r="prev" aria-label="Kartu sebelumnya"${st.i?'':' disabled'}>‹</button><div class="dots" role="group" aria-label="Pilih kartu">${d.slides.map((_,j)=>`<button type="button" class="rdot ${j===st.i?'on':''}" data-r="go" data-v="${j}" aria-label="Tampilkan kartu ${j+1}" aria-current="${j===st.i?'step':'false'}"></button>`).join('')}</div><button type="button" class="n" data-r="next" aria-label="Kartu berikutnya"${st.i<d.slides.length-1?'':' disabled'}>›</button></div>`:''}
    <div class="ac"><button data-r="img">📸 Bagikan gambar</button><button class="g" data-r="txt">📋 Salin teks</button><button class="g" data-r="x">Tutup</button></div></div>`;paint()};
  o.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.ri;if(!k)return;let v=e.target.value;
    if(k==='nm'){v=v.slice(0,24);sv({nm:v});return}
    if(k==='ghostTitle'){v=v.replace(/[\r\n\t]/g,' ').slice(0,28);sv({ghostTitle:v});d=rdata(st.per,st.spicy,st.hide);paint();return}
    if(k==='ghost'){v=v.trim().slice(0,8);if(v&&!/\p{Extended_Pictographic}/u.test(v))return;sv({ghost:v||'👻'});d=rdata(st.per,st.spicy,st.hide);paint();return}
    if((k==='c1'||k==='c2')&&hx(v)){sv({[k]:v,th:'custom'});paint()}
  });
  let tx=null;o.addEventListener('touchstart',e=>{tx=e.target.closest('.rcw')?e.touches[0].clientX:null},{passive:true});
  o.addEventListener('touchend',e=>{if(tx==null)return;const dx=e.changedTouches[0].clientX-tx;tx=null;if(Math.abs(dx)>60){st.i=Math.max(0,Math.min(d.slides.length-1,st.i+(dx<0?1:-1)));draw()}},{passive:true});
  o.addEventListener('click',async e=>{const b=e.target.closest('[data-r]');if(!b){if(e.target===o)close();return}const k=b.dataset.r,v=b.dataset.v;
    if(k==='per'){st.per=v;st.i=0}else if(k==='spicy')st.spicy=st.spicy?0:1;else if(k==='hide')st.hide=st.hide?0:1;else if(k==='prev')st.i=Math.max(0,st.i-1);else if(k==='next')st.i=Math.min(d.slides.length-1,st.i+1);
    else if(k==='go')st.i=+v;else if(k==='th'){sv({th:v});if(v==='custom')st.cu=1}else if(k==='cust')st.cu=st.cu?0:1;else if(k==='pat')sv({pat:v});else if(k==='ghost')sv({ghost:v});else if(k==='x')return close();
    else if(k==='txt'){const t=rtext(d);try{await navigator.clipboard.writeText(t)}catch(x){const ta=document.createElement('textarea');ta.value=t;document.body.append(ta);ta.select();try{document.execCommand('copy')}catch(y){}ta.remove()}return toast('Teks tersalin — tinggal tempel 🔥')}
    else if(k==='img'){const cv=rcanvas(d.slides[st.i],d.hue,st.i,d.slides.length,d.label);cv.toBlob(async bl=>{if(!bl)return toast('Gagal membuat gambar.');const f=new File([bl],'roast-my-spending.png',{type:'image/png'});
      try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'Roast My Spending',text:'#RoastMySpending'});return}}catch(x){if(x&&x.name==='AbortError')return}
      const a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download=f.name;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800);toast('Gambar disimpan ke unduhan 📸')},'image/png');return}
    draw();if(k!=='go'&&k!=='prev'&&k!=='next'){const f=o.querySelector('[aria-pressed="true"]');}});
  draw();o.focus()}
window.VFR={rdata,rcanvas,rtext,fire,gmCalc,ropen};
/* sisipkan kartu Roast ke Beranda & Cerita Mode Simpel (render internal Simpel tidak lewat window.render → pakai MutationObserver) */
const SM=document.getElementById('SM');
if(SM){const inject=()=>{const w=SM.querySelector(':scope>.w');if(!w||w.querySelector('.f27-rb'))return;
    const anchor=w.querySelector('.g3')||w.querySelector('.hero');if(!anchor||(!w.querySelector('.g3')&&!w.querySelector('.bd2')))return;
    anchor.insertAdjacentHTML('afterend','<button class="f27-rb" data-roast="1"><span class="e">🔥</span><span><b>Roast My Spending</b><small>Wrapped bulananmu, siap di-screenshot</small></span><span class="go">›</span></button>')};
  new MutationObserver(inject).observe(SM,{childList:true});inject()}
document.addEventListener('click',e=>{if(e.target.closest('[data-roast]'))ropen()});
render();/* render ulang agar kartu F.I.R.E & tombol baru langsung tampil */
})();
