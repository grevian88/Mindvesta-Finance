
(function(){
const LAY='<i class="bl bl-b"></i><i class="bl bl-i"></i><i class="bl bl-p"></i><i class="bl bl-d"></i>';
const svg=b=>'url("data:image/svg+xml,'+encodeURIComponent(b)+'")';
const PATS={
 dots:['Titik',svg("<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22'><circle cx='4' cy='4' r='1.8'/></svg>")],
 grid:['Kisi',svg("<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><path d='M32 0H0V32' fill='none' stroke='black' stroke-width='1'/></svg>")],
 diag:['Diagonal',svg("<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><path d='M-2 2l4-4M0 16L16 0M14 18l4-4' stroke='black' stroke-width='1.6'/></svg>")],
 wave:['Gelombang',svg("<svg xmlns='http://www.w3.org/2000/svg' width='48' height='16'><path d='M0 8q6-8 12 0t12 0 12 0 12 0' fill='none' stroke='black' stroke-width='1.6'/></svg>")],
 zig:['Zigzag',svg("<svg xmlns='http://www.w3.org/2000/svg' width='24' height='12'><path d='M0 10l6-8 6 8 6-8 6 8' fill='none' stroke='black' stroke-width='1.6'/></svg>")],
 plus:['Plus',svg("<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'><path d='M14 8v12M8 14h12' stroke='black' stroke-width='1.6'/></svg>")],
 ring:['Lingkaran',svg("<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><circle cx='20' cy='20' r='13' fill='none' stroke='black' stroke-width='1.4'/></svg>")]
};
const DEF={k:'grad',c1:'#0d1412',c2:'#1b4d42',c3:'',ang:135,px:30,py:20,css:'',pat:'none',po:14,img:'',blur:0,dim:30,ca:88};
const P=(n,t,o)=>({n,t,...o});
const PRE=[
 ['Gelap',[
  P('Aurora','dark',{k:'css',css:'radial-gradient(60% 50% at 18% 18%,#2fd1a566,transparent),radial-gradient(55% 50% at 88% 28%,#4a7dff55,transparent),radial-gradient(70% 60% at 50% 105%,#f0b84a33,transparent),#09100e',dim:0}),
  P('Malam Emas','dark',{k:'grad',c1:'#0d1412',c2:'#2b2008',ang:160,dim:0}),
  P('Samudra','dark',{k:'grad',c1:'#06141f',c2:'#0b3a53',c3:'#0f6a7a',ang:170,dim:0}),
  P('Senja','dark',{k:'grad',c1:'#1b1030',c2:'#5a2a4a',c3:'#c9703a',ang:165,dim:0}),
  P('Hutan','dark',{k:'grad',c1:'#07130d',c2:'#1f3d2a',ang:150,pat:'diag',po:7,dim:0}),
  P('Magma','dark',{k:'grad',c1:'#120808',c2:'#4a1410',c3:'#a33a14',ang:180,dim:0}),
  P('Nebula','dark',{k:'css',css:'radial-gradient(50% 45% at 25% 25%,#8a4dff66,transparent),radial-gradient(45% 45% at 80% 70%,#ff4d9a44,transparent),radial-gradient(60% 60% at 60% 10%,#2d6bff44,transparent),#0b0818',dim:0}),
  P('Karbon','dark',{k:'solid',c1:'#101213',pat:'grid',po:10,dim:0}),
  P('Bokeh Emas','dark',{k:'css',css:'radial-gradient(18% 18% at 20% 25%,#f0b84a55,transparent),radial-gradient(22% 22% at 75% 20%,#f0b84a33,transparent),radial-gradient(26% 26% at 60% 75%,#f0b84a44,transparent),radial-gradient(14% 14% at 15% 80%,#f0b84a33,transparent),#0d1412',dim:0})
 ]],
 ['Terang',[
  P('Pagi','light',{k:'grad',c1:'#fdf6e3',c2:'#f3d9a4',ang:160,dim:0}),
  P('Mint','light',{k:'grad',c1:'#eaf7f1',c2:'#c6efe0',ang:150,dim:0}),
  P('Langit','light',{k:'grad',c1:'#eaf3ff',c2:'#cfe3ff',ang:170,dim:0}),
  P('Sakura','light',{k:'grad',c1:'#fff0f4',c2:'#ffd6e2',ang:150,dim:0}),
  P('Kertas','light',{k:'solid',c1:'#f4f1ea',pat:'dots',po:10,dim:0}),
  P('Pastel Mesh','light',{k:'css',css:'radial-gradient(55% 50% at 15% 15%,#ffd0e055,transparent),radial-gradient(50% 50% at 85% 25%,#c9e3ff99,transparent),radial-gradient(60% 55% at 50% 100%,#d6f5dc99,transparent),#f7f5fb',dim:0})
 ]],
 ['Pola',[
  P('Titik Hijau','dark',{k:'solid',c1:'#0d1f1a',pat:'dots',po:16,dim:0}),
  P('Gelombang','dark',{k:'grad',c1:'#0a1b2b',c2:'#0d3b45',ang:140,pat:'wave',po:12,dim:0}),
  P('Zigzag Emas','dark',{k:'solid',c1:'#16110a',pat:'zig',po:14,dim:0}),
  P('Plus Biru','dark',{k:'solid',c1:'#0b1420',pat:'plus',po:14,dim:0}),
  P('Lingkaran','light',{k:'grad',c1:'#f1f6f4',c2:'#dcebe5',ang:140,pat:'ring',po:9,dim:0}),
  P('Kisi Terang','light',{k:'solid',c1:'#f5f7f6',pat:'grid',po:9,dim:0})
 ]]
];
const base=b=>{const c=[b.c1,b.c2].concat(b.c3?[b.c3]:[]).join(',');
 if(b.k==='solid'||b.k==='img')return b.c1;
 if(b.k==='grad')return `linear-gradient(${b.ang}deg,${c})`;
 if(b.k==='rad')return `radial-gradient(circle at ${b.px}% ${b.py}%,${c})`;
 return b.css||b.c1};
const bgBase=b=>b.k==='css'?b.css:base(b);
function paint(el,b){
  if(!el)return;
  el.dataset.k=b.k;el.dataset.p=b.pat||'none';
  const s=el.style;
  s.setProperty('--bgbase',bgBase(b));
  s.setProperty('--bgimg',b.img?`url("${b.img}")`:'none');
  s.setProperty('--bgblur',(b.blur||0)+'px');
  s.setProperty('--bgdim',(b.dim||0)/100);
  s.setProperty('--bgpo',(b.po||0)/100);
  s.setProperty('--bgpat',(PATS[b.pat]||[0,'none'])[1]);
}
const cur=()=>S.settings.bg;
function applyBg(){
  const R=document.documentElement,L=document.getElementById('bgl');if(!L)return;
  const b=cur(),on=!!b&&S.settings.mode!=='wanita';
  R.classList.toggle('hasbg',on);
  if(!L.firstChild)L.innerHTML=LAY;
  if(on){paint(L,b);R.style.setProperty('--cda',(b.ca??88)+'%')}else R.style.removeProperty('--cda');
  const pv=document.getElementById('kpv');if(pv){if(!pv.firstChild)pv.insertAdjacentHTML('afterbegin',LAY);paint(pv,b||{...DEF,k:'solid',c1:getComputedStyle(R).getPropertyValue('--bg')||'#0d1412',dim:0,pat:'none'});pv.style.setProperty('--cda',(b?b.ca??88:100)+'%')}
}
let qt;const qsave=()=>{clearTimeout(qt);qt=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Penyimpanan penuh. Kurangi ukuran gambar atau hapus kreasi.')}},300)};
const ens=()=>{if(!S.settings.bg)S.settings.bg={...DEF,k:'grad'};return S.settings.bg};
const tileSt=b=>b.k==='img'&&b.img?`background:url('${b.img}') center/cover`:`background:${bgBase(b)}`;
const tilePat=b=>b.pat&&b.pat!=='none'?`<i style="position:absolute;inset:0;background:#fff;opacity:${(b.po||10)/100*1.4};-webkit-mask-image:${PATS[b.pat][1]};mask-image:${PATS[b.pat][1]}"></i>`:'';
const tile=(b,name,act,i,on,del)=>`<div style="position:relative"><button class="kt2 ${on?'on':''}" data-a="${act}" data-i="${i}" style="${tileSt(b)}" aria-label="${esc(name)}">${tilePat(b)}<span>${esc(name)}</span></button>${del?`<button class="kt2 x" data-a="bgdel" data-i="${i}" aria-label="Hapus" style="position:absolute;top:3px;right:3px;width:22px;height:22px;border-radius:50%;border:0;background:#000b;color:#fff;height:22px">✕</button>`:''}</div>`;
const sl=(f,l,min,max,v,u='')=>`<label class="kr"><span>${l}</span><input type="range" data-bgf="${f}" data-u="${u}" min="${min}" max="${max}" value="${v}"><b data-o="${f}">${v}${u}</b></label>`;
const cp=(f,l,v)=>`<label>${l}<input type="color" data-bgf="${f}" value="${v||'#000000'}"></label>`;
const chips=(act,opts,val)=>`<div class="chips">${opts.map(([k,l])=>`<button class="chip ${val===k?'on':''}" data-a="${act}" data-i="${k}">${l}</button>`).join('')}</div>`;
function kust(){
  const b=cur(),e=b||{...DEF,k:'grad'};
  const pres=PRE.map(([g,L])=>`<div class="kh">${g}</div><div class="kg">${L.map((p,j)=>tile({...DEF,...p},p.n,'bgpre',g+'|'+j,b&&b.id===g+j)).join('')}</div>`).join('');
  const own=(S.settings.bgs||[]);
  const ed=`
  <div class="kh">Jenis latar</div>${chips('bgk',[['solid','Polos'],['grad','Gradasi'],['rad','Radial'],['img','Gambar']],e.k==='css'?'':e.k)}
  ${e.k==='css'?'<small style="margin:8px 0">Preset mesh. Pilih jenis lain di atas untuk membuat gradasi sendiri.</small>':''}
  ${e.k!=='css'?`<div class="kcl">${cp('c1',e.k==='img'?'Warna dasar':'Warna 1',e.c1)}${e.k==='solid'||e.k==='img'?'':cp('c2','Warna 2',e.c2)}${e.k==='solid'||e.k==='img'?'':(e.c3?cp('c3','Warna 3',e.c3)+'<button class="chip" data-a="bgc3x">✕ hapus</button>':'<button class="chip" data-a="bgc3">+ warna ke-3</button>')}</div>`:''}
  ${e.k==='grad'?sl('ang','Sudut',0,360,e.ang,'°'):''}
  ${e.k==='rad'?sl('px','Posisi X',0,100,e.px,'%')+sl('py','Posisi Y',0,100,e.py,'%'):''}
  ${e.k==='img'?`<div class="kh">Gambar sendiri</div>
   <div class="kdz" id="kdz">${e.img?'Gambar terpasang ✓ — seret gambar lain ke sini untuk mengganti':'Seret gambar ke sini, atau pakai tombol di bawah'}</div>
   <div class="krow"><button class="b p" data-a="bgup">📁 Unggah dari galeri</button><button class="b" data-a="bgcam">📷 Ambil foto</button>${e.img?'<button class="b" data-a="bgrm">Hapus gambar</button>':''}</div>
   <small style="margin-top:6px">Gambar otomatis dikecilkan (maks. 1280 px) agar hemat penyimpanan. Data tetap di perangkat ini.</small>
   <input type="file" id="bgf" accept="image/*" hidden><input type="file" id="bgc" accept="image/*" capture="environment" hidden>
   ${sl('blur','Blur',0,24,e.blur,'px')}`:''}
  <div class="kh">Pola tambahan</div>${chips('bgp',[['none','Tanpa'],...Object.entries(PATS).map(([k,v])=>[k,v[0]])],e.pat||'none')}
  ${e.pat&&e.pat!=='none'?sl('po','Kekuatan pola',3,40,e.po,'%'):''}
  <div class="kh">Penyesuaian</div>
  ${sl('dim','Redupkan',0,90,e.dim,'%')}
  ${sl('ca','Kartu solid',30,100,e.ca??88,'%')}
  <div class="krow"><button class="b p" data-a="bgsave">＋ Simpan kreasi ini</button><button class="b" data-a="bgclr">Reset ke standar</button></div>`;
  return bk('Kustomisasi')+`
  <section class="c"><div class="kpv" id="kpv"><div class="kt">Mindvesta Finance</div><div class="kc"><span>Saldo bulan ini</span><b>Rp 1.250.000</b></div></div>
   <small style="margin-top:8px">Pratinjau langsung — perubahan otomatis tersimpan.</small></section>
  <section class="c"><h3>Latar belakang</h3>
   <div class="kg"><div><button class="kt2 ${b?'':'on'}" data-a="bgclr" style="background:linear-gradient(135deg,#0d1412,#16201d)"><span>Standar</span></button></div></div>
   ${pres}</section>
  <section class="c"><h3>Buat sendiri</h3>${ed}</section>
  <section class="c"><h3>Kreasi saya</h3>${own.length?`<div class="kg">${own.map((o,i)=>tile(o.spec,o.name,'bguse',i,false,true)).join('')}</div>`:'<small>Belum ada. Atur latar di atas lalu tekan “Simpan kreasi ini”.</small>'}</section>
  <section class="c"><h3>Tema</h3><div class="chips">${[['auto','Otomatis'],['dark','Gelap'],['light','Terang']].map(([k,l])=>`<button class="chip ${S.settings.theme===k?'on':''}" data-a="theme" data-i="${k}">${l}</button>`).join('')}</div></section>
  <section class="c"><h3>Warna aksen</h3><div class="chips">${AC.map(c=>`<button class="chip" data-a="accent" data-i="${c}" style="background:${c};border-color:${c};color:#1a1305;width:44px;text-align:center" aria-label="Warna ${c}">${(S.settings.accent||AC[0])===c?'✓':'●'}</button>`).join('')}</div>
   <div class="kcl" style="margin-top:10px">${cp('accent','Warna aksen sendiri',S.settings.accent||AC[0])}</div></section>
  <section class="c"><h3>Ikon kategori</h3><small style="margin-bottom:8px">Ketuk kategori, lalu ketik satu emoji sebagai ikonnya.</small><div class="chips">${[...S.catExp,...S.catInc].map(c=>`<button class="chip" data-a="ico" data-i="${esc(c)}">${esc(S.icons[c]||'•')} ${esc(c)}</button>`).join('')}</div></section>`;
}
tema=kust;SV.tema=kust;
// actions
const setPre=i=>{const[g,j]=i.split('|'),p=PRE.find(x=>x[0]===g)[1][+j];S.settings.bg={...DEF,...p,id:g+j};delete S.settings.bg.n;S.settings.theme=p.t;save()};
Object.assign(A,{
 bgpre:setPre,
 bgclr(){S.settings.bg=null;save()},
 bgk(k){const b=ens();b.k=k;b.id='';if(k==='img'&&!b.c1)b.c1='#0d1412';save()},
 bgp(k){ens().pat=k;save()},
 bgc3(){const b=ens();b.c3='#ffb347';save()},bgc3x(){ens().c3='';save()},
 bgrm(){const b=ens();b.img='';save()},
 bgup(){document.getElementById('bgf').click()},bgcam(){document.getElementById('bgc').click()},
 bgsave(){const b=cur();if(!b)return toast('Pilih atau buat latar dulu.');const n=prompt('Nama kreasi','Kreasi '+((S.settings.bgs||[]).length+1));if(n===null)return;
  S.settings.bgs=S.settings.bgs||[];if(S.settings.bgs.length>=12)return toast('Maksimal 12 kreasi. Hapus salah satu dulu.');
  S.settings.bgs.push({id:Date.now(),name:(n.trim()||'Kreasi').slice(0,24),spec:JSON.parse(JSON.stringify(b))});
  try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){S.settings.bgs.pop();return toast('Penyimpanan penuh. Kreasi tidak tersimpan.')}save();toast('Kreasi disimpan')},
 bguse(i){const o=S.settings.bgs[+i];if(!o)return;S.settings.bg=JSON.parse(JSON.stringify(o.spec));save()},
 bgdel(i){const o=S.settings.bgs[+i];if(o&&confirm('Hapus kreasi "'+o.name+'"?')){S.settings.bgs.splice(+i,1);save()}}
});
// image upload
function fileToBg(f){
  if(!f||!/^image\//.test(f.type))return toast('Pilih file gambar.');
  const im=new Image(),u=URL.createObjectURL(f);
  im.onload=()=>{
    const m=1280,k=Math.min(1,m/Math.max(im.width,im.height)),c=document.createElement('canvas');
    c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);
    let q=.78,d=c.toDataURL('image/jpeg',q);while(d.length>900000&&q>.3){q-=.12;d=c.toDataURL('image/jpeg',q)}
    const b=ens();b.k='img';b.img=d;b.id='';if(!b.dim)b.dim=25;b.pat=b.pat||'none';
    try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Gambar terlalu besar untuk penyimpanan perangkat.');b.img='';return}
    save();toast('Gambar terpasang');
  };
  im.onerror=()=>{URL.revokeObjectURL(u);toast('Gambar tidak bisa dibaca.')};
  im.src=u;
}
document.addEventListener('change',e=>{const t=e.target;if(t.id==='bgf'||t.id==='bgc'){fileToBg(t.files[0]);t.value=''}});
document.addEventListener('dragover',e=>{const z=e.target.closest&&e.target.closest('#kdz');if(z){e.preventDefault();z.classList.add('over')}});
document.addEventListener('dragleave',e=>{const z=e.target.closest&&e.target.closest('#kdz');if(z)z.classList.remove('over')});
document.addEventListener('drop',e=>{const z=e.target.closest&&e.target.closest('#kdz');if(z){e.preventDefault();z.classList.remove('over');fileToBg(e.dataTransfer.files[0])}});
// live sliders / colors
document.addEventListener('input',e=>{
  const t=e.target,f=t.dataset&&t.dataset.bgf;if(!f)return;
  if(f==='accent'){S.settings.accent=t.value;document.documentElement.style.setProperty('--ac',t.value);qsave();return}
  const b=ens();
  if(t.type==='range'){b[f]=+t.value;const o=document.querySelector(`[data-o="${f}"]`);if(o)o.textContent=t.value+(t.dataset.u||'')}
  else{b[f]=t.value;if(b.k==='css'){b.k='grad'}}
  b.id='';applyBg();qsave();
});
// hook render
const _r2=render;render=function(){_r2();applyBg()};
applyBg();
})();
