
(function(){
const orig=txForm;
const SV=(p,w=34)=>`<svg viewBox="0 0 48 48" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const IC={
 bank:SV('<path d="M5 18L24 7l19 11z"/><path d="M8 40h32M5 44h38M11 21v15M20 21v15M28 21v15M37 21v15"/>',40),
 cal:SV('<rect x="7" y="9" width="34" height="32" rx="4"/><path d="M7 19h34M15 5v8M33 5v8"/><circle cx="31" cy="30" r="3.5" fill="currentColor"/>',40),
 per:SV('<circle cx="24" cy="15" r="8"/><path d="M8 42c0-9 7-14 16-14s16 5 16 14z"/>',40),
 note:SV('<path d="M6 12h26M6 22h26M6 32h14"/><path d="M42 26l-14 14-5 1 1-5 14-14z"/>',40),
 sch:SV('<rect x="6" y="9" width="30" height="30" rx="4"/><path d="M6 18h30M13 5v8M29 5v8"/><circle cx="36" cy="36" r="8" fill="var(--cd)"/><path d="M41 33a6 6 0 1 0 1 5M41 28v5h-5"/>',40),
 cam:'<svg viewBox="0 0 48 48" width="32" height="32"><path d="M5 14h10l3-5h12l3 5h10v28H5z" fill="currentColor"/><circle cx="24" cy="27" r="8" fill="var(--cd)"/><circle cx="24" cy="27" r="4.5" fill="currentColor"/></svg>',
 fol:SV('<path d="M4 10h14l4 5h22v27H4z"/><path d="M4 18h40"/>',32),
 pump:'<svg viewBox="0 0 40 40" width="30" height="30"><rect x="9" y="6" width="17" height="28" rx="2" fill="#e53935" stroke="#7b1b16" stroke-width="2"/><rect x="12" y="10" width="11" height="8" fill="#ffd9d6" stroke="#7b1b16" stroke-width="1.5"/><path d="M26 14h3q3 0 3 3v10q0 3 3 3t3-3V15l-4-4" fill="none" stroke="#7b1b16" stroke-width="2.5" stroke-linecap="round"/><path d="M6 36h23" stroke="#7b1b16" stroke-width="3" stroke-linecap="round"/></svg>',
 calc:'<svg viewBox="0 0 48 48" width="44" height="44"><rect x="5" y="4" width="38" height="38" rx="5" fill="#6d7a8a"/><rect x="9" y="8" width="13" height="13" rx="2" fill="#9fb1c4"/><rect x="26" y="8" width="13" height="13" rx="2" fill="#4a5a6c"/><path d="M12 14h7M31 11l5 6M36 11l-5 6" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M15 26v8M11 30h8" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="35" cy="34" r="10" fill="#f44336"/><path d="M30 32h10M30 37h10" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>',
 dots:'<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',
 star:'<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7z"/></svg>',
 starOn:'<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7z"/></svg>',
 back:'<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H5M11 5l-7 7 7 7"/></svg>'
};
const nf=n=>new Intl.NumberFormat('id-ID',{maximumFractionDigits:0}).format(Math.round(n||0));
const d8=i=>i?i.slice(8)+'/'+i.slice(5,7)+'/'+i.slice(2,4):'';
const nz=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const KWI=[[/bahan bakar|bensin|bbm|pertalite|pertamax|solar|spbu/,'pump'],[/kopi|ngopi|jajan|snack|cafe|boba|camilan|minum|teh|jus/,'☕'],[/makan|nasi|lunch|dinner|sarap|resto|warteg|bakso|ayam|mie|sate|food/,'🍽️'],[/belanja dapur|dapur|sayur|pasar|sembako|beras|grocer/,'🛒'],[/belanja|shop|baju|pakaian|sepatu|tas /,'🛍️'],[/listrik|pln|token/,'💡'],[/air |pdam/,'🚰'],[/pulsa|internet|wifi|kuota|paket data/,'📱'],[/transport|ojek|grab|gojek|bus|kereta|tol|parkir|angkot|taksi|krl|mrt/,'🚌'],[/service|servis|kendaraan|motor|mobil|bengkel|oli/,'🔧'],[/sewa|cicil|kos|rumah|kontrak|kpr/,'🏠'],[/tagihan|bill|iuran/,'🧾'],[/sehat|obat|dokter|apotek|klinik|rumah sakit|medis/,'💊'],[/pendidik|sekolah|kuliah|kursus|buku|spp/,'🎓'],[/hiburan|rekreasi|film|nonton|game|netflix|wisata|liburan|konser/,'🎬'],[/keluarga|anak|bayi|susu|popok/,'👨‍👩‍👧'],[/asuransi|bpjs/,'🛡️'],[/donasi|zakat|sedekah|infaq|amal/,'🤲'],[/perawatan|salon|cukur|barber|skincare|spa/,'💈'],[/operasional|usaha|bisnis|modal/,'💼'],[/utang|hutang|pinjam|pinjol|kredit/,'💳'],[/gaji|salary|upah/,'💰'],[/penjualan|omset|jualan|dagang/,'🏪'],[/sampingan|freelance|proyek|lembur/,'🧑‍💻'],[/bonus|thr|hadiah|kado/,'🎁'],[/investasi|aset|saham|emas|reksa|crypto|kripto/,'📈'],[/dividen|bunga|deposito/,'🏦'],[/pengembalian|refund|cashback/,'↩️'],[/gym|olahraga|fitness|futsal/,'🏋️'],[/hewan|kucing|anjing|pet/,'🐾'],[/rokok/,'🚬'],[/laundry|cuci/,'🧺'],[/tabung/,'🐷'],[/lain/,'📦']];
const KWR=KWI.map(([r,e])=>[new RegExp('(?:^|[^a-z0-9])(?:'+r.source+')'),e]);
const wst=(c,x)=>nz(c).split(/[^a-z0-9]+/).some(w=>w.startsWith(x))||nz(c).startsWith(x);
const autoIcon=c=>{const x=nz(c)+' ';for(const[r,e]of KWR)if(r.test(x))return e;return '🏷️'};
const catEmoji=c=>(S.icons&&S.icons[c]&&S.icons[c]!=='•')?S.icons[c]:autoIcon(c);
const catIcon=c=>{const e=catEmoji(c);return e==='pump'||/^(⛽)$/.test(e)||autoIcon(c)==='pump'&&!(S.icons&&S.icons[c])?IC.pump:esc(e)};
const ALIAS=[[/\b(nasi|makan|lunch|dinner|sarapan|warteg|bakso|ayam|mie\b|sate\b|resto)/,/makan/,'Makanan'],[/\b(kopi|ngopi|jajan|snack|boba|cafe|camilan)/,/kopi|jajan/,'Kopi & Jajan'],[/\b(bensin|bbm|pertalite|pertamax|solar|ojek|grab|gojek|parkir|tol\b|bus\b|kereta|taksi|krl|mrt|angkot)/,/transport|bahan bakar/,'Transportasi'],[/\b(sayur|pasar|beras|sembako|minyak|telur)/,/dapur/,'Belanja Dapur'],[/\b(baju|sepatu|tas\b|celana|kaos|fashion)/,/belanja pribadi|belanja/,'Belanja Pribadi'],[/\b(listrik|token|pln)/,/listrik/,'Listrik Rumah'],[/\b(pulsa|wifi|kuota|internet)/,/pulsa|internet/,'Pulsa & Internet'],[/\b(obat|dokter|apotek|klinik|rs)\b/,/sehat/,'Kesehatan'],[/\b(spp|kuliah|kursus|sekolah|buku)/,/pendidik/,'Pendidikan'],[/\b(netflix|nonton|game|wisata|liburan|konser|film)/,/hibur/,'Hiburan'],[/\b(zakat|sedekah|infaq|amal)/,/donasi/,'Donasi / Zakat'],[/\b(bengkel|oli\b|servis|service|ban\b)/,/service/,'Service Kendaraan'],[/\b(salon|barber|cukur|skincare|spa\b)/,/perawatan/,'Perawatan Diri'],[/\b(gaji|salary|upah)/,/gaji/,'Gaji'],[/\b(thr|bonus)/,/bonus/,'Bonus & THR'],[/\b(freelance|lembur|proyek)/,/sampingan/,'Penghasilan Sampingan'],[/\b(dividen|bunga)/,/dividen/,'Dividen/Bunga'],[/\b(cicilan|kos\b|kontrak|kpr|sewa)/,/sewa/,'Sewa / Cicilan'],[/\b(utang|hutang|pinjol|pinjam)/,/utang/,'Pembayaran Utang']];
const titleCase=x=>x.trim().replace(/\s+/g,' ').replace(/(^|\s)(\S)/g,(m,a,b)=>a+b.toUpperCase());

window.VFK={nz,autoIcon,catEmoji,ALIAS};
window.txForm=function(t){
  if(S.settings&&S.settings.mode==='wanita')return orig(t);
  const n=!t;
  const o0=t||{};
  const E={id:o0.id,type:o0.type||'expense',amt:o0.amount?String(o0.amount):'',cat:o0.category||'',ct:'',w:o0.wallet||S.wallets[0],to:o0.toWallet||S.wallets[1]||S.wallets[0],date:o0.isoDate||(t?td(t):'')||iso(),party:o0.party||'',note:o0.note||'',chk:(o0.chk||'1')==='1',rep:false,star:false,ph:t?(t.photos||(t.photo?[t.photo]:[])).slice():[],menu:false};
  const topCat=ty=>{const L=cats(ty),c={};S.transactions.filter(x=>x.type===ty).forEach(x=>c[x.category]=(c[x.category]||0)+1);return [...L].sort((a,b)=>(c[b]||0)-(c[a]||0))[0]||''};
  if(!E.cat&&E.type!=='transfer')E.cat=topCat(E.type);
  E.ct=E.cat;
  const resolve=(txt)=>{
    const ty=E.type==='income'?'income':'expense',L=cats(ty),raw=String(txt||'').trim(),x=nz(raw);
    if(!raw)return{name:'',isNew:false,why:'Ketik untuk mencari atau buat kategori sendiri',emoji:'🏷️'};
    let m=L.find(c=>nz(c)===x);if(m)return{name:m,isNew:false,why:'Kategori tersedia',emoji:catEmoji(m),ok:1};
    m=L.find(c=>nz(c).startsWith(x))||L.find(c=>wst(c,x));
    if(m)return{name:m,isNew:false,why:`“${raw}” cocok dengan ${m}`,emoji:catEmoji(m),ok:1};
    for(const[tr,tg,lb]of ALIAS){if(tr.test(x)){m=L.find(c=>tg.test(nz(c)));if(m)return{name:m,isNew:false,why:`“${raw}” dikenali sebagai ${m}`,emoji:catEmoji(m),ok:1}}}
    const nm=titleCase(raw),em=autoIcon(nm);
    return{name:nm,isNew:true,why:`Kategori baru “${nm}” akan dibuat dengan ikon otomatis`,emoji:em==='pump'?'⛽':em};
  };
  const suggest=txt=>{
    const ty=E.type==='income'?'income':'expense',L=cats(ty),x=nz(txt),out=[],seen=new Set();
    const add=(name,why)=>{if(!seen.has(name)){seen.add(name);out.push({name,why})}};
    if(!x){const c={};S.transactions.filter(t=>t.type===ty).forEach(t=>c[t.category]=(c[t.category]||0)+1);[...L].sort((a,b)=>(c[b]||0)-(c[a]||0)).forEach(n=>add(n,c[n]?'Sering dipakai':''));return out}
    L.filter(c=>nz(c).startsWith(x)).forEach(c=>add(c,'Nama cocok'));
    L.filter(c=>wst(c,x)).forEach(c=>add(c,'Nama cocok'));
    for(const[tr,tg,lb]of ALIAS){if(tr.test(x)){L.filter(c=>tg.test(nz(c))).forEach(c=>add(c,`“${txt.trim()}” termasuk ${c}`))}}
    return out;
  };
  const root=document.createElement('div');root.id='PT';
  const old=document.getElementById('PT');if(old)old.remove();
  document.body.append(root);document.body.style.overflow='hidden';
  const q=s=>root.querySelector(s);
  const val=()=>{const s=E.amt;if(/[+\-*/x]/.test(s.replace(/^-/,''))){try{return Math.min(999999999999999,Math.max(0,ev(s.replace(/\.(?=\d{3}(?!\d))/g,'').replace(/,/g,'.'))))}catch(e){return 0}}return num(s)};
  const remain=()=>{const a=val(),b=bal(E.w);return E.type==='income'?b+a:b-a};
  const title=()=>(n?'Baru ':'Ubah ')+({expense:'pengeluaran',income:'pemasukan',transfer:'pemindahan'}[E.type]);
  const close=()=>{root.remove();document.body.style.overflow=''};
  function paint(){
    const tr=E.type==='transfer';
    const disp=/[+\-*/x]/.test(E.amt.replace(/^-/,''))?E.amt:(E.amt?nf(num(E.amt)):'');
    root.innerHTML=`<div class="pt-ph ${E.type==='income'?'pt-inc':tr?'pt-trf':''}">
<div class="pt-tb"><button data-k="back" aria-label="Kembali">${IC.back}</button><h1>${title()}</h1><button data-k="star" aria-label="Favorit">${E.star?IC.starOn:IC.star}</button><button data-k="menu" aria-label="Menu" style="width:36px">${IC.dots}</button></div>
${E.menu?`<div class="pt-mn">${['expense','income','transfer'].filter(x=>n||x===E.type||x!=='transfer'&&t.type!=='transfer').map(x=>`<button data-k="ty" data-v="${x}">${{expense:'Pengeluaran',income:'Pemasukan',transfer:'Pindah saldo'}[x]}</button>`).join('')}${n?'':'<button class="pt-rd" data-k="del">Hapus</button>'}</div>`:''}
<div class="pt-bd">
<div class="pt-cd">
 <div class="pt-r1"><div class="pt-nv"><label>Nilai</label><input id="pa" inputmode="decimal" autocomplete="off" value="${esc(disp)}" placeholder="0"><span>Rp</span></div>
 <div class="pt-ns">Nilai sisa:<br><span id="pr">Rp ${nf(remain())}</span></div><button class="pt-calc" data-k="calc" aria-label="Hitung">${IC.calc}</button></div>
 ${tr?'':`<div class="pt-r2"><div class="pt-ci" id="pci">${catIcon(resolve(E.ct).name||E.ct)}</div><div class="pt-bk pt-cb"><input id="pc" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="Cari atau ketik kategori" value="${esc(E.ct)}"><div class="pt-dd" id="pdd" hidden></div></div></div><div class="pt-hint" id="phint"></div>`}
 <div class="pt-r3"><span class="pt-tl">Total:</span><span class="pt-tv" id="pt">Rp ${nf(val())}</span><button class="pt-plus" data-k="more" aria-label="Simpan dan tambah lagi">+</button></div>
</div>
<div class="pt-cd">
 <div class="pt-ln">${IC.bank}<div class="pt-bk"><select id="pw">${S.wallets.map(w=>`<option${w===E.w?' selected':''}>${esc(w)}</option>`).join('')}</select></div></div>
 ${tr?`<div class="pt-ln"><span style="width:40px;text-align:center;font-size:22px">→</span><div class="pt-bk"><select id="pto">${S.wallets.map(w=>`<option${w===E.to?' selected':''}>${esc(w)}</option>`).join('')}</select></div></div>`:''}
 <div class="pt-ln">${IC.cal}<div class="pt-bk pt-dt"><div class="pt-dv" style="display:flex;align-items:center;justify-content:center">${d8(E.date)}</div><input type="date" id="pd" value="${E.date}"></div></div>
 <div class="pt-ln">${IC.per}<div class="pt-ol"><input id="pp" placeholder="${tr?'Catatan lain':E.type==='income'?'Dari (Opsional)':'Kepada (Opsional)'}" value="${esc(E.party)}"></div></div>
 <div class="pt-ln">${IC.note}<div class="pt-ol"><input id="pn" placeholder="Catatan (Opsional)" value="${esc(E.note)}"></div></div>
 <div class="pt-sw"><span>Dicentang</span><button class="pt-tg ${E.chk?'pt-on':''}" data-k="chk" aria-label="Dicentang"><i></i></button></div>
</div>
${E.type==='expense'&&n?`<div class="pt-cd"><div class="pt-sw pt-s2">${IC.sch}<span class="pt-t">Pengeluaran terjadwal</span><button class="pt-tg ${E.rep?'pt-on':''}" data-k="rep" aria-label="Terjadwal"><i></i></button></div></div>`:''}
<div class="pt-ab"><button data-k="cam">${IC.cam}<span>KAMERA</span></button><button data-k="gal">${IC.fol}<span>LAMPIRKAN</span></button></div>
${E.ph.length?`<div class="pt-pv">${E.ph.map((p,i)=>`<span><img src="${p}" alt="Foto ${i+1}"><b data-k="px" data-v="${i}">×</b></span>`).join('')}</div>`:''}
</div>
<div class="pt-ft"><button class="pt-bt" data-k="back">BATAL</button><button class="pt-sp" data-k="save">SIMPAN</button></div>
</div>`;
    hint();
  }
  function hint(){
    const h=q('#phint');if(!h)return;const r=resolve(E.ct);
    h.className='pt-hint'+(r.isNew?' pt-new':r.ok?' pt-ok':'');
    h.innerHTML=(r.name?`<span>${r.isNew?'＋':'✓'}</span> `:'')+esc(r.why);
    const ci=q('#pci');if(ci)ci.innerHTML=catIcon(r.isNew?r.name:(r.name||E.ct));
    if(r.isNew&&ci)ci.innerHTML=r.emoji==='pump'||r.emoji==='⛽'?IC.pump:esc(r.emoji);
  }
  function showDD(){
    const d=q('#pdd');if(!d)return;const L=suggest(E.ct),r=resolve(E.ct);
    let h=L.slice(0,40).map(c=>`<button type="button" data-k="pick" data-v="${esc(c.name)}"><span class="pt-di">${catIcon(c.name)}</span><span class="pt-dx"><b>${esc(c.name)}</b>${c.why?`<small>${esc(c.why)}</small>`:''}</span></button>`).join('');
    if(r.isNew)h+=`<button type="button" class="pt-nw" data-k="pick" data-v="${esc(r.name)}"><span class="pt-di">${r.emoji==='pump'||r.emoji==='⛽'?IC.pump:esc(r.emoji)}</span><span class="pt-dx"><b>Buat “${esc(r.name)}”</b><small>Kategori baru, ikon otomatis</small></span></button>`;
    d.innerHTML=h;d.hidden=!h;
  }
  function hideDD(){const d=q('#pdd');if(d)d.hidden=true}
  function sync(){
    const g=s=>q(s);
    if(g('#pa'))E.amt=g('#pa').value;
    if(g('#pp'))E.party=g('#pp').value;if(g('#pn'))E.note=g('#pn').value;
  }
  function live(){const a=q('#pa');E.amt=a.value.replace(/[^0-9+\-*/x.,]/g,'');q('#pr').textContent='Rp '+nf(remain());q('#pt').textContent='Rp '+nf(val())}
  function settle(){const a=q('#pa');if(!a)return;if(/[+\-*/x]/.test(E.amt.replace(/^-/,''))){E.amt=String(val())}a.value=E.amt?nf(num(E.amt)):''}
  function build(){
    const a=val(),tr=E.type==='transfer';
    if(a<=0){toast('Isi jumlah lebih dari 0.');return null}
    if(!E.w){toast('Pilih dompet.');return null}
    if(tr&&E.w===E.to){toast('Pilih dua dompet yang berbeda.');return null}
    if(!tr&&!E.cat){toast('Pilih kategori dulu.');return null}
    return {...(t||{}),book:t?t.book:bkc(),id:E.id||Date.now(),scope:(t&&t.scope)||'personal',type:E.type,amount:a,category:tr?'Transfer':E.cat,wallet:E.w,note:E.note.trim(),photo:undefined,photos:E.ph.slice(),party:E.party.trim(),chk:E.chk?'1':'0',isoDate:E.date,date:fd(E.date)};
  }
  function commit(again){
    sync();settle();
    const rs=E.type==='transfer'?null:resolve(E.ct);if(rs)E.cat=rs.name;
    const o=build();if(!o)return;
    if(rs&&rs.isNew){const ty=E.type==='income'?'catInc':'catExp';if(!S[ty].some(c=>nz(c)===nz(rs.name)))S[ty].push(rs.name);S.icons=S.icons||{};S.icons[rs.name]=rs.emoji==='pump'?'⛽':rs.emoji}
    if(E.type==='transfer')o.toWallet=E.to;else delete o.toWallet;
    if(n&&E.rep&&E.type==='expense')S.sched.push({id:Date.now()+1,name:o.note||o.category,amount:o.amount,category:o.category,wallet:o.wallet,every:1,dom:+E.date.slice(8),next:addM(E.date,1,+E.date.slice(8)),remind:3});
    if(n)S.transactions.unshift(o);else{const i=S.transactions.findIndex(x=>x.id===t.id);if(i>=0)S.transactions[i]=o}
    if(again&&!n){close();save();toast('Tersimpan, lanjut catat lagi');window.txForm();return}
    if(again){E.id=undefined;E.amt='';E.note='';E.party='';E.ph=[];E.rep=false;save();paint();toast('Tersimpan, lanjut catat lagi');return}
    close();save();toast('Tersimpan');
  }
  const addPhotos=async files=>{for(const f of files){if(E.ph.length>=6){toast('Maksimal 6 foto per transaksi.');break}const d=await epack(f);if(d)E.ph.push(d)}sync();paint()};
  const pick=cam=>{const x=document.createElement('input');x.type='file';x.accept='image/*';if(cam)x.setAttribute('capture','environment');else x.multiple=true;x.style.display='none';document.body.append(x);x.onchange=()=>{addPhotos([...x.files]);x.remove()};x.addEventListener('cancel',()=>x.remove());x.click()};
  root.addEventListener('input',e=>{if(e.target.id==='pa')live();else if(e.target.id==='pc'){E.ct=e.target.value;hint();showDD()}});
  root.addEventListener('focusin',e=>{if(e.target.id==='pc'){e.target.select();showDD()}});
  root.addEventListener('focusout',e=>{if(e.target.id==='pc')setTimeout(()=>{hideDD();const r=resolve(E.ct);if(r.ok&&r.name){E.ct=r.name;const c=q('#pc');if(c)c.value=r.name;hint()}},220)});
  root.addEventListener('keydown',e=>{if(e.target.id==='pc'&&e.key==='Enter'){e.preventDefault();const r=resolve(E.ct);E.ct=r.name||E.ct;e.target.value=E.ct;hideDD();hint();e.target.blur()}});
  root.addEventListener('mousedown',e=>{if(e.target.closest('.pt-dd'))e.preventDefault()});
  root.addEventListener('focusout',e=>{if(e.target.id==='pa'){settle();live()}});
  root.addEventListener('change',e=>{const i=e.target.id;
    if(i==='pw'){E.w=e.target.value;q('#pr').textContent='Rp '+nf(remain())}
    else if(i==='pto')E.to=e.target.value;
    else if(i==='pd'&&e.target.value){E.date=e.target.value;q('.pt-dv').textContent=d8(E.date)}
  });
  root.addEventListener('click',e=>{
    const b=e.target.closest('[data-k]');
    if(!e.target.closest('.pt-cb'))hideDD();
    if(E.menu&&!(b&&b.dataset.k==='ty'||b&&b.dataset.k==='del')&&!(b&&b.dataset.k==='menu')){E.menu=false;sync();paint();if(!b)return}
    if(!b)return;const k=b.dataset.k;
    if(k==='back')close();
    else if(k==='save')commit(false);
    else if(k==='more')commit(true);
    else if(k==='star'){E.star=!E.star;sync();paint()}
    else if(k==='menu'){E.menu=!E.menu;sync();paint()}
    else if(k==='ty'){sync();E.type=b.dataset.v;E.menu=false;if(E.type!=='transfer'){E.cat=topCat(E.type);E.ct=E.cat}if(E.type==='transfer'&&E.to===E.w)E.to=S.wallets.find(w=>w!==E.w)||E.w;paint()}
    else if(k==='del'){if(confirm('Hapus data ini?')){S.transactions=S.transactions.filter(x=>x.id!==t.id);close();save();toast('Dihapus')}}
    else if(k==='chk'){sync();E.chk=!E.chk;paint()}
    else if(k==='rep'){sync();E.rep=!E.rep;paint()}
    else if(k==='pick'){E.ct=b.dataset.v;const c=q('#pc');if(c)c.value=E.ct;hideDD();hint()}
    else if(k==='calc'){settle();live();q('#pa').focus()}
    else if(k==='cam')pick(true);
    else if(k==='gal')pick(false);
    else if(k==='px'){sync();E.ph.splice(+b.dataset.v,1);paint()}
  });
  paint();
  if(n)setTimeout(()=>{const a=q('#pa');a&&a.focus()},50);
};
})();
