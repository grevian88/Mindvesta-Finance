
(function(){
const K=window.VFK||{nz:s=>String(s||'').toLowerCase(),autoIcon:()=>'🏷️',catEmoji:()=>'🏷️',ALIAS:[]};
const R=document.getElementById('SM');
const rp=n=>window.VFC&&VFC.on?VFC.money(Math.abs(n||0)):'Rp '+new Intl.NumberFormat('id-ID',{maximumFractionDigits:0}).format(Math.round(Math.abs(n||0)));
const rps=n=>(Math.round(n||0)<0?'-':'')+rp(n),fmt=n=>(+n>0)?new Intl.NumberFormat('id-ID').format(Math.round(+n)):'',mnum=s=>+String(s==null?'':s).replace(/\D/g,'').slice(0,13)||0;
const TD=t=>typeof td==='function'?td(t):(t.isoDate||'');
const TB=()=>S.transactions.filter(t=>bkOf(t)===bkc());
const mshift=(m,n)=>{const[y,o]=m.split('-').map(Number);return iso(new Date(y,o-1+n,1)).slice(0,7)};
/* Format nominal otomatis: 1000 -> 1.000, 100000 -> 100.000 (caret tetap di tempatnya). Berlaku untuk semua input[data-money] di Mode Simpel */
R.addEventListener('input',ev=>{const t=ev.target;if(!t||!t.matches||!t.matches('input[data-money]'))return;const old=t.value,pos=t.selectionStart==null?old.length:t.selectionStart,before=old.slice(0,pos).replace(/\D/g,'').length,d=old.replace(/\D/g,'').replace(/^0+(?=\d)/,'').slice(0,13),nv=d?new Intl.NumberFormat('id-ID').format(+d):'';if(nv!==old){t.value=nv;let c=0,i=0;while(i<nv.length&&c<before){if(/\d/.test(nv[i]))c++;i++}try{t.setSelectionRange(i,i)}catch(x){}}},true);
const MI=(k,ph,v,x)=>`<input data-k="${k}" data-money inputmode="numeric" autocomplete="off" placeholder="${ph}" value="${fmt(v)}"${x||''}>`;
const MON={jan:1,feb:2,mar:3,apr:4,mei:5,may:5,jun:6,jul:7,agu:8,aug:8,ags:8,sep:9,okt:10,oct:10,nov:11,des:12,dec:12};
const ISO=(y,m,d)=>`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const num=s=>{s=String(s).replace(/[^\d.,]/g,'');if(!s)return 0;const m=s.match(/[.,](\d{1,2})$/);if(m&&m[1].length===2&&/[.,]\d{3}/.test(s.slice(0,-3))||m&&m[1].length===2&&!/[.,]/.test(s.slice(0,-3)))s=s.slice(0,-3);return +s.replace(/[.,]/g,'')||0};
function _dateIn(t,y){let m;
 if(m=t.match(/\b(20\d\d)-(\d{2})-(\d{2})\b/))return ISO(+m[1],+m[2],+m[3]);
 if(m=t.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4}|\d{2})\b/)){let Y=+m[3];if(Y<100)Y+=2000;return ISO(Y,+m[2],+m[1])}
 if(m=t.match(/(\d{1,2})\s*([a-z]{3})[a-z]*\.?,?\s*(\d{4})/i)){const k=MON[m[2].toLowerCase()];if(k)return ISO(+m[3],k,+m[1])}
 if(m=t.match(/^\s*(\d{2})\/(\d{2})\b(?!\/)/))return ISO(y,+m[2],+m[1]);return ''}
const dateIn=(t,y)=>{const r=_dateIn(t,y);if(!r)return '';const[Y,M,D]=r.split('-').map(Number),d=new Date(Y,M-1,D);return d.getFullYear()===Y&&d.getMonth()===M-1&&d.getDate()===D?r:''};
const BANKK=[[/\b(kopi|ngopi|starbucks|janji jiwa)\b/,/kopi|jajan/],[/gaji|payroll|salary/,/gaji/,'in'],[/bunga|interest/,/dividen|bunga/,'in'],[/pajak|\badm|biaya|\bfee\b/,/tagihan/],[/tarik tunai|atm/,/lainnya$/],[/indomaret|alfamart|superindo|hypermart|pasar|sayur/,/dapur/],[/gopay|\bovo\b|\bdana\b|shopee|tokopedia|lazada|tiktok|blibli/,/belanja pribadi/],[/\bpln\b|listrik/,/listrik/],[/telkomsel|indosat|\bxl\b|smartfren|indihome|biznet|pulsa/,/pulsa/],[/grab|gojek|\bkai\b|\btol\b|parkir|pertamina|\bshell\b|bensin|transjakarta|\bmrt\b/,/transport/],[/netflix|spotify|\bsteam\b|youtube|cinema|\bxxi\b/,/hibur/],[/kopi|starbucks|janji jiwa|kfc|mcd|resto|food|makan|bakso|warung/,/makan/],[/apotek|klinik|rs |hospital|kimia farma/,/sehat/],[/bpjs|asuransi/,/asuransi/]];
function cat(desc,ty){const L=cats(ty),x=K.nz(desc);
 for(const[r,t,d]of BANKK){if(r.test(x)){const m=L.find(c=>t.test(K.nz(c)));if(m)return m}}
 for(const[tr,tg]of K.ALIAS){if(tr.test(x)){const m=L.find(c=>tg.test(K.nz(c)));if(m)return m}}
 return L.find(c=>/lainnya/i.test(c))||L[L.length-1]}

const DT=/\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b|^\d{2}\/\d{2}\b|\b\d{1,2}\s*[a-z]{3}[a-z]*\.?,?\s*\d{4}\b/ig;
const LB=(()=>{try{new RegExp('(?<!a)b');return '(?<![\\w/])'}catch(e){return '(?:^|[^\\w/])'}})();
const AM=new RegExp(LB+'([+\\-−–]?)\\s*(rp\\.?)?\\s*(\\d{1,3}(?:[.,]\\d{3})+(?:[.,]\\d{1,2})?|\\d+[.,]\\d{2}|[1-9]\\d{3,7})(?![\\w/])(?:\\s*(DB|CR|DR)(?![A-Za-z]))?','gi');
const amounts=ln=>{const c=ln.replace(DT,' '),o=[],csvy=(ln.replace(/\d[.,]\d/g,'').match(/[,;\t]/g)||[]).length>=2;for(const m of c.matchAll(AM)){const bare=!/[.,]/.test(m[3]);if(bare&&!m[1]&&!m[2]&&!m[4]&&!csvy)continue;o.push({v:num(m[3]),sg:/[\-−–]/.test(m[1])?'-':m[1]==='+'?'+':'',mk:(m[4]||'').toUpperCase(),rp:!!m[2]})}return o.filter(a=>a.v>0)};
const clean=ln=>ln.replace(DT,' ').replace(AM,' ').replace(/\b(DB|CR|DR)\b/gi,' ').replace(/\s*[,;|]\s*/g,' ').replace(/\s0+(?=\s|$)/g,' ').replace(/\s+/g,' ').trim().slice(0,60);
const OUTK=/\b(db|dr|debit|keluar|transfer ke|tarik|bayar|pembayaran|pembelian|biaya|admin|pajak|qris)\b/i,INK=/\b(cr|kredit|masuk|diterima|terima|gaji|bunga|setoran|refund|cashback|transfer dari|dari)\b/i;
const VX=()=>window.VFX&&VFX.ready;
function parseStmt(text){const a=parseStmt0(VX()?VFX.stripHints(text):text);if(!VX())return a;try{return VFX.pickBetter(a,VFX.parseStmt(text,{cat}))}catch(e){console.warn('VFX.parseStmt',e);return a}}
async function parseStmtA(text,onTick){const a=parseStmt0(VX()?VFX.stripHints(text):text);if(!VX())return a;try{return VFX.pickBetter(a,await VFX.parseStmtAsync(text,{cat,onTick}))}catch(e){console.warn('VFX.parseStmtAsync',e);return a}}
function parseStmt0(text){
 const L=String(text).split(/\r?\n/).map(s=>s.replace(/\s+/g,' ').trim()).filter(Boolean),out=[];
 let y=new Date().getFullYear();const pm=text.match(/(?:periode|period)[^\n]*?(20\d\d)/i);if(pm)y=+pm[1];
 const det=t=>[[/gopay|go-pay/i,'GoPay'],[/\bovo\b/i,'OVO'],[/\bdana\b/i,'DANA'],[/shopeepay/i,'ShopeePay'],[/seabank|sea bank/i,'SeaBank'],[/jago/i,'Jago'],[/\bblu\b/i,'blu'],[/jenius/i,'Jenius'],[/\bbca\b/i,'BCA'],[/mandiri/i,'Mandiri'],[/\bbri\b/i,'BRI'],[/\bbni\b/i,'BNI']].find(x=>x[0].test(t))?.[1]||'Bank';
 const hd=text.slice(0,300),bank=det(hd)!=='Bank'?det(hd):det(text);
 const g=re=>{const m=text.match(re);return m?num(m[1]):null};
 const sa=g(/saldo awal[^\d\n]*([\d.,]+)/i),ea=g(/saldo akhir[^\d\n]*([\d.,]+)/i);let pb=sa,prev=null;
 const mkR=(d,desc,a,ty,flag)=>{const t=ty==='income'?'income':'expense',c=cat(desc,t);const r={id:out.length,date:d,desc:desc||'Mutasi',amount:a,type:t,cat:c,on:1,flag:flag||(/lainnya/i.test(c)?'cek kategori':'')};out.push(r);return r};
 for(const ln of L){
  if(/saldo (awal|akhir)|^halaman|^page \d/i.test(ln))continue;
  const d=dateIn(ln,y),am=amounts(ln);
  if(d&&am.length){
   const hasBal=am.length>=2,a=hasBal?am[am.length-2]:am[0],b=hasBal?am[am.length-1].v:null;let ty='',flag='';
   if(b!=null&&pb!=null&&Math.abs(Math.abs(b-pb)-a.v)<=1)ty=b>pb?'income':'expense';
   else if(a.sg)ty=a.sg==='+'?'income':'expense';
   else if(a.mk)ty=a.mk==='CR'?'income':'expense';
   else{const o=OUTK.test(ln),i=INK.test(ln);ty=i&&!o?'income':o&&!i?'expense':'expense';flag=(o===i)?'cek arah':''}
   if(b!=null)pb=b;
   prev=mkR(d,clean(ln),a.v,ty,flag)}
  else if(prev&&!d&&!am.length&&ln.length<50&&prev.desc.length<45){prev.desc=(prev.desc+' '+ln).slice(0,60);prev.cat=cat(prev.desc,prev.type==='income'?'income':'expense');prev.flag=/lainnya/i.test(prev.cat)?'cek kategori':prev.flag==='cek arah'?prev.flag:''}
 }
 let loose=0;
 if(!out.length){loose=1;let cur='',buf=[];for(const ln of L){const d=dateIn(ln,y),am=amounts(ln);
  if(d&&!am.length){cur=d;buf=[];continue}
  if(am.length&&!/saldo|total belanja|limit/i.test(ln)){const a=am[0],tx=ln.replace(DT,' ').replace(AM,' ').replace(/\s+/g,' ').trim(),desc=[...buf.slice(-2),tx].filter(Boolean).join(' ').slice(0,60);
   let ty=a.sg?(a.sg==='+'?'income':'expense'):OUTK.test(desc+ln)&&!INK.test(desc+ln)?'expense':INK.test(desc+ln)&&!OUTK.test(desc+ln)?'income':'expense';
   mkR(d||cur||iso(),desc,a.v,ty,(a.sg||OUTK.test(desc+ln)||INK.test(desc+ln))?(d||cur?'':'cek tanggal'):'cek arah');buf=[]}
  else if(ln.length>2&&ln.length<70&&!d)buf.push(ln)}}
 const inn=out.filter(r=>r.type==='income').reduce((s,r)=>s+r.amount,0),exp=out.filter(r=>r.type==='expense').reduce((s,r)=>s+r.amount,0);
 const recon=sa!=null&&ea!=null&&out.length?{ok:Math.abs(sa+inn-exp-ea)<=1,diff:sa+inn-exp-ea}:null;
 return{bank,rows:out,recon,loose}}
function quick(s){
 let qty=1,t=String(s).trim().replace(/\brp\.?\s*(?=\d)/ig,''),best=null;
 t=t.replace(/(^|\s)(\d{1,2})\s*[x×]\s+/i,(m,a,n)=>{qty=+n||1;return a}).replace(/\s+[x×]\s*(\d{1,2})\s*$/i,(m,n)=>{qty=+n||1;return ''});
 for(const m of t.matchAll(/(\d{1,3}(?:\.\d{3})+|\d+(?:[.,]\d+)?)\s*(rb|ribu|k|jt|juta)?(?![\w])/gi)){const u=(m[2]||'').toLowerCase(),raw=m[1];let v;
  if(/^\d{1,3}(\.\d{3})+$/.test(raw))v=+raw.replace(/\./g,'');else{v=parseFloat(raw.replace(',','.'));v=/jt|juta/.test(u)?v*1e6:u?v*1e3:v}
  const sc=(u?2:0)+(v>=100?1:0);if(!best||sc>best.sc||sc===best.sc&&v>best.v)best={m:m[0],v:Math.round(v),sc}}
 const a=(best?best.v:0)*qty,ty=/\b(gaji|terima|masuk|dapat|dikasih|bonus|jual|untung|cashback)\b/i.test(t)?'income':'expense';
 const d=new Date();if(/kemarin/i.test(t))d.setDate(d.getDate()-1);
 const desc=t.replace(best?best.m:'','').replace(/\b(kemarin|tadi|hari ini)\b/ig,'').replace(/\s+/g,' ').trim()||(ty==='income'?'Pemasukan':'Pengeluaran');
 return{amount:a,type:ty,desc,cat:cat(desc,ty==='income'?'income':'expense'),date:iso(d)}}
const nid=()=>{const n=Math.max(Date.now(),(nid.l||0)+1);nid.l=n;return n};
const mk=o=>({id:nid(),book:bkc(),scope:'personal',type:o.type,amount:o.amount,category:o.cat,wallet:o.wallet||S.wallets[0],note:o.note||o.desc||'',photos:[],party:o.party||'',chk:'1',isoDate:o.date,date:fd(o.date),...(o.x||{})});
const dedupe=o=>TB().some(t=>t.src&&t.h===o.h);
// loaders
const lib=u=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=()=>no(new Error('Butuh internet untuk memuat mesin pembaca (sekali saja).'));document.head.append(s)});
const busy=t=>{let e=document.getElementById('smld');if(!t){e&&e.remove();return}if(!e){e=document.createElement('div');e.id='smld';e.className='ld';R.append(e)}e.textContent=t};
async function prep(f){const u=URL.createObjectURL(f),im=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>{URL.revokeObjectURL(u);no(new Error('Gambar tidak bisa dibuka.'))};i.src=u}),k=im.width<1200?1200/im.width:im.width>2400?2400/im.width:1,c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);const x=c.getContext('2d');x.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);const d=x.getImageData(0,0,c.width,c.height),p=d.data;let sm=0;for(let i=0;i<p.length;i+=4){const g=.299*p[i]+.587*p[i+1]+.114*p[i+2];p[i]=g;sm+=g}const inv=sm/(p.length/4)<115;for(let i=0;i<p.length;i+=4){let g=inv?255-p[i]:p[i];g=Math.max(0,Math.min(255,(g-128)*1.35+128));p[i]=p[i+1]=p[i+2]=g}x.putImageData(d,0,0);return c}
async function ocr(f){if(window.VFX&&VFX.ready){try{const t=await VFX.ocr(f,{busy,lib});if(t&&String(t).trim())return t}catch(e){console.warn('VFX.ocr → fallback',e)}}busy('Menyiapkan gambar…');const c=await prep(f);if(!window.Tesseract)await lib('https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js');busy('Membaca gambar… 📖');const w=await Tesseract.createWorker('ind+eng',1,{...(window.VFX&&VFX.tessOptions?VFX.tessOptions():{}),logger:m=>m.status==='recognizing text'&&busy('Membaca gambar… '+Math.round(m.progress*100)+'%')});try{await w.setParameters({tessedit_pageseg_mode:'6',preserve_interword_spaces:'1'});return(await w.recognize(c)).data.text}finally{await w.terminate()}}
async function pdf(f){if(window.VFX&&VFX.ready){try{const t=await VFX.pdf(f,{busy,lib,askPw});if(t&&String(t).trim())return t}catch(e){if(/Dibatalkan|Password salah/.test(e&&e.message||''))throw e;console.warn('VFX.pdf → fallback',e)}}busy('Membuka PDF…');if(window.VFX&&VFX.pdfInit){await VFX.pdfInit({lib},{mainThread:true})}else if(!window.pdfjsLib){await lib('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'}
 const data=new Uint8Array(await f.arrayBuffer());let pw;let doc;
 for(let i=0;i<3;i++){try{doc=await pdfjsLib.getDocument({data:data.slice(),password:pw}).promise;break}catch(e){if(e.name==='PasswordException'){busy();pw=await askPw();if(pw===null)throw new Error('Dibatalkan');busy('Membuka PDF…')}else throw e}}
 if(!doc)throw new Error('Password salah.');let txt='';
 for(let p=1;p<=doc.numPages;p++){const c=await(await doc.getPage(p)).getTextContent(),ls={};const ys=[];c.items.forEach(i=>{if(!i.str||!i.str.trim())return;const y=i.transform[5];let k=ys.find(v=>Math.abs(v-y)<=2.5);if(k===undefined){k=y;ys.push(y)}(ls[k]=ls[k]||[]).push([i.transform[4],i.str])});txt+=Object.keys(ls).sort((a,b)=>b-a).map(y=>ls[y].sort((a,b)=>a[0]-b[0]).map(x=>x[1]).join(' ')).join('\n')+'\n'}
 return txt}
const ocrFix=t=>String(t).split(/\r?\n/).map(l=>l
 .replace(/(\d)[Oo](?=[\d.,Oo]|\b)/g,'$10').replace(/(\d)[Oo](?=[\d.,Oo]|\b)/g,'$10').replace(/([.,])[Oo](?=\d)/g,'$10').replace(/(\d[.,])[Oo]{3}\b/g,'$1000')
 .replace(/(\d)\s+([.,])\s*(\d{3})\b/g,'$1$2$3').replace(/(\d[.,])\s+(\d{3})\b/g,'$1$2')
 .replace(/([A-Za-z]{2}.*?\s)(\d{1,3}) (\d{3})$/,'$1$2.$3').replace(/^((?:total|jumlah|grand total|tunai|cash|kembali|bayar)\b[^\d]*)(\d{1,3}) (\d{3})$/i,'$1$2.$3')).join('\n');
const askPw=()=>new Promise(ok=>{const e=sheet('<h2>PDF terkunci 🔒</h2><div class="mu">Masukkan password (BCA biasanya tanggal lahir DDMMYYYY)</div><input data-k="pw" type="password" autocomplete="off" autofocus><button class="pb" data-k="ok">Buka</button><button class="gh" data-k="no">Batal</button>');const go=()=>{const v=e.querySelector('[data-k=pw]').value;e.remove();ok(v)};e.onclick=ev=>{const k=ev.target.dataset.k;if(ev.target===e||k==='no'){e.remove();ok(null)}else if(k==='ok')go()};e.addEventListener('keydown',ev=>{if(ev.key==='Enter'){ev.preventDefault();go()}})});
async function readFile(f){if(/pdf/i.test(f.type)||/\.pdf$/i.test(f.name))return pdf(f);if(/^image\//.test(f.type))return ocrFix(await ocr(f));return f.text()}
// UI
const bookBarS=()=>{const cur=bkc(),on='background:var(--ac);color:var(--onac)';return `<div style="display:flex;gap:6px;overflow-x:auto;padding:0 0 10px;align-items:center">${books().map(b=>`<button class="ch" data-s="bk" data-i="${esc(b)}" style="white-space:nowrap;${b===cur?on:''}">📒 ${esc(b)}</button>`).join('')}<button class="ch" data-s="bknew" style="white-space:nowrap">＋ Diary</button><button class="ch" data-s="bkedit" style="white-space:nowrap">✎ Ubah/Hapus</button><button class="ch" data-s="bkdup" style="white-space:nowrap">⧉ Duplikat</button></div>`};
function bkSheet(mode){const o=bkc(),isE=mode==='edit',isD=mode==='dup';
 const e=sheet(`<h2>${isE?'Ubah diary ✎':isD?'Duplikat diary ⧉':'Diary baru 📒'}</h2><input data-k="n" placeholder="Nama buku" maxlength="30" value="${esc(isE?o:isD?o+' (salinan)':'')}" autofocus>${isD?'<select data-k="cp"><option value="1">Salin transaksi</option><option value="0">Buku kosong</option></select>':''}<button class="pb" data-k="ok">Simpan</button>${isE&&books().length>1?'<button class="gh" data-k="del" style="color:#ff7a7a">🗑 Hapus buku</button>':''}`);
 e.onclick=async ev=>{if(ev.target===e)return e.remove();const k=ev.target.dataset.k;if(!k)return;const b=books();
  if(k==='ok'){const n=e.querySelector('[data-k=n]').value.trim();if(!n)return toast('Isi nama buku.');if(isE&&n===o){e.remove();return}if(b.includes(n))return toast('Nama buku sudah dipakai.');
   S.transactions.forEach(t=>{if(!t.book)t.book=b[0]});
   if(isE){b[b.indexOf(o)]=n;S.transactions.forEach(t=>{if(t.book===o)t.book=n})}
   else{if(isD&&e.querySelector('[data-k=cp]').value==='1'){let id=Date.now();S.transactions.unshift(...S.transactions.filter(t=>t.book===o).map(t=>({...JSON.parse(JSON.stringify(t)),id:id++,book:n})))}b.push(n)}
   S.settings.cb=n;e.remove();save();toast(isE?'Buku diubah ✅':isD?'Buku diduplikat ✅':'Buku dibuat ✅')}
  else if(k==='del'){S.transactions.forEach(t=>{if(!t.book)t.book=b[0]});const n=S.transactions.filter(t=>t.book===o).length;if(await ask('Hapus buku?',`${o}\n${n} transaksi di buku ini ikut terhapus.`,['Hapus','Batal'])===0){S.transactions=S.transactions.filter(t=>t.book!==o);b.splice(b.indexOf(o),1);S.settings.cb=b[0];e.remove();save();toast('Buku dihapus')}}}}
R.addEventListener('click',ev=>{const b=ev.target.closest('[data-s]');if(!b)return;const s=b.dataset.s;if(s==='bk'){S.settings.cb=b.dataset.i;save()}else if(s==='bknew')bkSheet('new');else if(s==='bkdup')bkSheet('dup');else if(s==='bkedit')bkSheet('edit')});
function txItem(t){const tr=t.type==='transfer',inc=t.type==='income',ti=tr?`Pindah: ${t.wallet} → ${t.toWallet||'?'}`:(t.note||t.category),d=t.date||(TD(t)?fd(TD(t)):'');
 return `<button class="it${tr?' xf':''}" data-s="tx" data-i="${t.id}"><span class="ic" style="background:hsl(${tint(tr?'transfer':t.category)} 80% 60%/.2)">${esc(tr?'🔁':K.catEmoji(t.category))}</span><div><b>${esc(ti)}</b><small>${esc(tr?'Transfer':t.category)} · ${esc(d)}${!tr&&t.wallet?' · '+esc(t.wallet):''}</small></div><span class="a ${inc?'n':tr?'':'o'}">${inc?'+':tr?'':'-'}${rp(t.amount)}</span></button>`}
let tab='home',smon=iso().slice(0,7);const U=new Proxy({},{get:(_,k)=>S.settings[k],set:(_,k,v)=>{S.settings[k]=v;return true}});
const catOpts=(ty,v)=>{const L=cats(ty);return (v&&!L.includes(v)?[v,...L]:L).map(c=>`<option${c===v?' selected':''}>${esc(c)}</option>`).join('')};
const SAV='Tabungan & Target';
/* ===== Mode Simpel: nama pengguna + rasio pengeluaran (data sama dengan Mode Detail: S.transactions per buku) ===== */
const L2=(id,en)=>(window.VFC&&VFC.en)?en:id;
const greet=hr=>{const un=String(U.uname||'').trim(),g=hr<11?'selamat pagi':hr<15?'selamat siang':hr<18?'selamat sore':'selamat malam';
 return `<h1>Hai, ${g}${un?` <button class="unm" data-s="uname" data-no-i18n="1" aria-label="${esc(L2('Ganti nama','Change name'))}">${esc(un)}</button>`:''} ${PW()?'🌸':'👋'}</h1><div class="mu mu-greet"><span>Uangmu, tanpa ribet.</span>${un?'':`<button class="ch unadd" data-s="uname" data-no-i18n="1">＋ ${L2('Tambah nama','Add name')}</button>`}</div>`};
function nameSheet(){const cur=String(U.uname||'').trim();
 const e=sheet(`<div data-no-i18n="1"><h2>${L2('Nama kamu 👋','Your name 👋')}</h2><div class="mu">${L2('Dipakai untuk sapaan di beranda. Bisa diganti atau dimatikan kapan saja.','Used for the greeting on Home. Change it or turn it off anytime.')}</div><input data-k="n" maxlength="24" autocomplete="given-name" placeholder="${L2('Mis. Budi','E.g. Budi')}" value="${esc(cur)}" autofocus style="margin-top:10px"><button class="pb" data-k="ok">${L2('Simpan','Save')}</button>${cur?`<button class="gh" data-k="off">${L2('Tanpa nama (jangan tampilkan)',"No name (don't show)")}</button>`:''}</div>`);
 const inp=e.querySelector('[data-k=n]'),done=v=>{U.uname=v;e.remove();save();toast(v?L2('Nama disimpan ✅','Name saved ✅'):L2('Sapaan tanpa nama ✅','Greeting without name ✅'))};
 inp.onkeydown=ev=>{if(ev.key==='Enter'){ev.preventDefault();done(inp.value.replace(/\s+/g,' ').trim().slice(0,24))}};
 e.onclick=ev=>{if(ev.target===e)return e.remove();const k=ev.target.dataset.k;if(k==='ok')done(inp.value.replace(/\s+/g,' ').trim().slice(0,24));else if(k==='off')done('')}}

/* rasio = total pengeluaran ÷ total pemasukan bulan itu (semua kategori, semua dompet, buku aktif) */
const mstat=ym=>{let i=0,o=0;TB().forEach(t=>{if(!TD(t).startsWith(ym))return;if(t.type==='income')i+=+t.amount||0;else if(t.type==='expense')o+=+t.amount||0});return{i,o,r:i>0?o/i:null}};
const rtier=x=>x.r==null?(x.o>0?{c:['#ff2e57','#ff8095'],e:'⚠️',n:L2('Tanpa pemasukan','No income')}:{c:['#7d7da0','#b4b4d0'],e:'💤',n:L2('Belum ada data','No data yet')})
 :x.r<.5?{c:['#19c37d','#7cf5c4'],e:'😎',n:L2('Sangat hemat','Very frugal')}
 :x.r<.7?{c:['#7fd61f','#d4ff5a'],e:'😊',n:L2('Sehat','Healthy')}
 :x.r<.9?{c:['#ffa410','#ffd23f'],e:'😅',n:L2('Waspada','Careful')}
 :x.r<1?{c:['#ff6a2b','#ffa05a'],e:'😰',n:L2('Hampir habis','Almost out')}
 :{c:['#ff2e57','#ff8095'],e:'😭',n:L2('Boros','Overspending')};
const rring=(x,t,uid)=>{const R0=46,C=2*Math.PI*R0,f=x.r==null?(x.o>0?1:0):Math.min(x.r,1),o=C*(1-f),a=2*Math.PI*f,kx=60+R0*Math.cos(a),ky=60+R0*Math.sin(a);
 return `<svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.c[0]}"/><stop offset="1" stop-color="${t.c[1]}"/></linearGradient></defs><circle cx="60" cy="60" r="${R0}" fill="none" stroke="var(--cd2)" stroke-width="12"/>${f>0?`<circle class="arc" cx="60" cy="60" r="${R0}" fill="none" stroke="url(#${uid})" stroke-width="12" stroke-linecap="round" style="--c:${C.toFixed(2)};--o:${o.toFixed(2)}"/><g class="kg" style="--a:${(f*360).toFixed(1)}deg"><circle cx="${kx.toFixed(2)}" cy="${ky.toFixed(2)}" r="4.6" fill="#fff" stroke="${t.c[0]}" stroke-width="2.6"/></g>`:''}</svg>`};
const rctr=x=>{const pc=x.r==null?null:Math.round(x.r*100),txt=pc==null?'—':(pc>999?'999+':pc)+'%';
 return `<div class="rctr${txt.length>=4?' sm':''}"><b>${txt}</b><small>${x.r!=null?L2('terpakai','used'):(x.o>0?L2('tanpa pemasukan','no income'):L2('belum ada data','no data'))}</small></div>`};
const ratioCard=ym=>{const x=mstat(ym),pv=mstat(mshift(ym,-1)),t=rtier(x),sig=ym+'|'+x.i+'|'+x.o,an=window.__rgSig!==sig;window.__rgSig=sig;
 let ft;if(x.r!=null&&pv.r!=null){const d=Math.round(x.r*100)-Math.round(pv.r*100);ft=d===0?`<span class="rdl">＝ ${L2('sama','same')}</span><small>${L2('dari bulan lalu','vs last month')}</small>`:`<span class="rdl ${d>0?'up':'dn'}">${d>0?'▲':'▼'} ${Math.abs(d)} ${L2('poin','pts')}</span><small>${L2('dari bulan lalu','vs last month')}</small>`}
 else ft=x.o>0?`<small>${L2('Keluar','Out')} ${rp(x.o)}</small>`:`<small>${L2('Catat pemasukan & pengeluaran','Log income & expenses')}</small>`;
 return `<button class="rcard${x.r!=null&&x.r>=1?' hot':''}" data-s="ratio" data-no-i18n="1" style="--rc:${t.c[0]}" aria-label="${esc(L2('Rasio pengeluaran','Expense ratio'))}"><div class="rch">${L2('Rasio pengeluaran','Expense ratio')}</div><div class="rring${an?' an':''}">${rring(x,t,'rgH')}${rctr(x)}</div>${x.r==null?'':`<span class="rtag" style="background:linear-gradient(90deg,${t.c[0]},${t.c[1]})">${t.e} ${t.n}</span>`}<div class="rft">${ft}</div></button>`};
function ratioSheet(){
 const ym=iso().slice(0,7),x=mstat(ym),pv=mstat(mshift(ym,-1)),t=rtier(x),left=x.i-x.o,ML=(m,o)=>new Date(+m.slice(0,4),+m.slice(5,7)-1,1).toLocaleDateString('id-ID',o);
 const by={};TB().forEach(q=>{if(q.type==='expense'&&TD(q).startsWith(ym)){const k=q.category||L2('Lainnya','Other');by[k]=(by[k]||0)+(+q.amount||0)}});
 const cats=Object.entries(by).sort((a,b)=>b[1]-a[1]),rest=cats.slice(5).reduce((a,c)=>a+c[1],0),
  PALR=['#7c5cff','#ff5c8a','#ffb020','#19c37d','#38bdf8'],
  rows=[...cats.slice(0,5).map(([k,v],ix)=>({k,v,e:K.catEmoji(k)==='pump'?'⛽':K.catEmoji(k),c:PALR[ix%5]})),...(rest?[{k:L2('Lainnya','Other'),v:rest,e:'🧩',c:'var(--mu)'}]:[])];
 const topN=rows[0]?rows[0].k:'',pc=x.r==null?0:Math.round(x.r*100);
 const ins=x.i<=0&&x.o<=0?L2('Belum ada transaksi bulan ini. Catat pemasukan & pengeluaran supaya rasionya muncul.','No transactions this month yet. Log income & expenses to see your ratio.')
  :x.i<=0?L2('Ada pengeluaran tapi belum ada pemasukan tercatat bulan ini. Catat pemasukanmu supaya rasio bisa dihitung.','There are expenses but no income logged this month. Log your income so the ratio can be calculated.')
  :x.r<.5?L2(`Mantap! Baru ${pc}% pemasukan yang terpakai. Sisa ${rp(left)} bisa langsung ditabung.`,`Awesome! Only ${pc}% of your income is used. The remaining ${rp(left)} can go straight to savings.`)
  :x.r<.7?L2(`Sehat. ${pc}% pemasukan terpakai, sisa ${rp(left)}. Pertahankan ritmenya.`,`Healthy. ${pc}% of income used, ${rp(left)} left. Keep this pace.`)
  :x.r<.9?L2(`Mulai ketat: ${pc}% pemasukan terpakai, sisa ${rp(left)}. Pantau pos terbesar (${topN}).`,`Getting tight: ${pc}% used, ${rp(left)} left. Watch your biggest item (${topN}).`)
  :x.r<1?L2(`Hampir habis: ${pc}% terpakai, sisa ${rp(left)}. Rem dulu sampai akhir bulan.`,`Almost out: ${pc}% used, ${rp(left)} left. Ease off until month end.`)
  :L2(`Pengeluaran melebihi pemasukan sebesar ${rp(-left)}. Kurangi pos terbesar (${topN}) atau tambah pemasukan.`,`Spending exceeds income by ${rp(-left)}. Cut your biggest item (${topN}) or add income.`);
 const six=[...Array(6)].map((_,k)=>{const m=mshift(ym,k-5),q=mstat(m);return{m,q,t:rtier(q),cur:k===5}});
 const pts=x.r!=null&&pv.r!=null?Math.round(x.r*100)-Math.round(pv.r*100):null;
 const e=sheet(`<div class="rsh" data-no-i18n="1" style="--rc:${t.c[0]}"><h2>${L2('Rasio pengeluaran 📊','Expense ratio 📊')}</h2><div class="mu">${esc(ML(ym,{month:'long',year:'numeric'}))} · ${esc(bkc())}</div>
 <div class="rbig rring an">${rring(x,t,'rgS')}${rctr(x)}</div>
 <div style="text-align:center"><span class="rtag lg" style="background:linear-gradient(90deg,${t.c[0]},${t.c[1]})">${t.e} ${t.n}</span>${pts!=null?`<div class="mu" style="margin-top:8px">${pts===0?L2('Sama dengan bulan lalu','Same as last month'):`<b class="${pts>0?'up':'dn'}" style="color:${pts>0?'var(--bad,#ff6b81)':'var(--ok,#5cf2b0)'}">${pts>0?'▲':'▼'} ${Math.abs(pts)} ${L2('poin','pts')}</b> ${L2('dari bulan lalu','vs last month')} (${Math.round(pv.r*100)}%)`}</div>`:''}</div>
 <div class="rtri"><div>${L2('Pemasukan','Income')}<b style="color:var(--ok,#5cf2b0)">${rp(x.i)}</b></div><div>${L2('Pengeluaran','Expenses')}<b style="color:var(--bad,#ff6b81)">${rp(x.o)}</b></div><div>${left>=0?L2('Sisa','Left'):L2('Defisit','Deficit')}<b>${left<0?'−':''}${rp(left)}</b></div></div>
 <div class="rins">${t.e} ${esc(ins)}</div>
 <div class="rsec">${L2('Skala rasio','Ratio scale')}</div><div class="rmeter"><b class="mk" style="left:${x.r==null?(x.o>0?100:0):Math.min(x.r,1)*100}%"></b></div><div class="rscale"><span>0%</span><span>50%</span><span>70%</span><span>90%</span><span>100%+</span></div>
 <div class="rsec">${L2('Rincian pengeluaran','Expense breakdown')}</div>${rows.length?`<div class="rseg">${rows.map(r=>`<i style="flex:${r.v};background:${r.c}"></i>`).join('')}</div>${rows.map(r=>`<div class="rlg"><span class="dot" style="background:${r.c}"></span><span class="nm">${esc(r.e)} ${esc(r.k)}<small>${x.o?Math.round(r.v/x.o*100):0}% ${L2('dari pengeluaran','of expenses')}${x.i>0?` · ${Math.round(r.v/x.i*100)}% ${L2('dari pemasukan','of income')}`:''}</small></span><span class="am">${rp(r.v)}</span></div>`).join('')}`:`<div class="mu">${L2('Belum ada pengeluaran bulan ini.','No expenses this month yet.')}</div>`}
 <div class="rsec">${L2('Tren 6 bulan','6-month trend')}</div><div class="rtr">${six.map(m=>{const h=m.q.r==null?(m.q.o>0?100:0):Math.min(m.q.r,1.3)/1.3*100;return `<div class="col"><div class="trk"><span class="v" style="bottom:calc(${Math.max(h,3)}% + 4px)${m.cur?';color:var(--tx)':''}">${m.q.r==null?(m.q.o>0?'!':'–'):Math.round(m.q.r*100)+'%'}</span><div class="bx" style="height:${Math.max(h,3)}%;background:linear-gradient(180deg,${m.t.c[1]},${m.t.c[0]});${m.cur?`box-shadow:0 0 0 2px var(--tx),0 6px 16px ${m.t.c[0]}66`:'opacity:.78'}"></div></div><small${m.cur?' style="color:var(--tx);font-weight:800"':''}>${esc(ML(m.m,{month:'short'}))}</small></div>`}).join('')}</div>
 <div class="mu" style="margin-top:12px;font-size:11px">${L2('Dihitung dari semua pemasukan & pengeluaran di buku ini, termasuk yang dicatat lewat Mode Detail. Transfer antar dompet tidak dihitung.','Calculated from all income & expenses in this book, including those logged in Detail Mode. Transfers between wallets are not counted.')}</div>
 <div class="row" style="margin-top:6px"><button class="gh" data-k="hist">${L2('Riwayat ›','History ›')}</button><button class="pb" data-k="x" style="margin-top:8px">${L2('Tutup','Close')}</button></div></div>`);
 e.onclick=ev=>{if(ev.target===e)return e.remove();const k=ev.target.dataset.k;if(k==='x')e.remove();else if(k==='hist'){e.remove();histSheet()}}}
function render(){
 if(!U.seeded)seedCats();
 const ym=iso().slice(0,7),T=TB(),mo=T.filter(t=>TD(t).startsWith(ym)),ino=mo.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0),out=mo.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
 applyTheme();const bal=S.wallets.reduce((s,w)=>s+bal_(w),0),tile=(s,i,t,sm)=>`<button class="tl" data-s="${s}">${ib(i)}${t}<small>${sm}</small></button>`;
 let h='';
 if(tab==='home'){const rec=[...T].sort((a,b)=>TD(b).localeCompare(TD(a))||b.id-a.id).slice(0,30),outJ=mo.filter(t=>t.type==='expense'&&t.category!==SAV).reduce((s,t)=>s+t.amount,0),lim=U.sbud||0,p=lim?outJ/lim:0,m=mood(p),sk=streak();
  const hr=new Date().getHours(),d7=[...Array(7)].map((_,k)=>{const d=new Date();d.setDate(d.getDate()-6+k);return T.filter(t=>t.type==='expense'&&TD(t)===iso(d)).reduce((a,t)=>a+t.amount,0)}),mx=Math.max(1,...d7);
  h=bookBarS()+`<div class="hd"><div>${greet(hr)}</div><div style="display:flex;gap:8px;flex:none"><button class="ibtn" data-vfs-open="1" aria-label="Cari fitur"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></button><button class="ibtn" data-s="theme" aria-label="Tampilan">${ic('palette')}</button></div></div><div class="hero"><svg class="sp" viewBox="0 0 70 28">${d7.map((v,k)=>`<rect x="${k*10+1}" y="${28-Math.max(2,v/mx*26)}" width="7" height="${Math.max(2,v/mx*26)}" rx="2" fill="currentColor"/>`).join('')}</svg><span>Total saldo</span><b>${rps(bal)}</b><div class="row"><div class="pl">Masuk bulan ini<b>${rp(ino)}</b></div><div class="pl">Keluar bulan ini<b>${rp(out)}</b></div></div></div>
  <div class="duo"><div class="bud bv" data-s="bud" style="cursor:pointer"><div class="bvt"><span class="mas">${lim?m[0]:'🐣'}</span><span class="st">🔥 ${sk} hari</span></div><b>${lim?m[1]:'Atur batas jajan bulananmu'}</b><div class="mu">${lim?`${rp(outJ)} dari ${rp(lim)} · sisa ${rp(Math.max(0,lim-outJ))}`:'Ketuk untuk mulai, nanti ada bar & maskot.'}</div>${lim?`<div class="bar" style="height:12px"><i style="width:${Math.min(100,Math.round(p*100))}%;background:${m[2]}"></i></div>`:''}</div>${ratioCard(ym)}</div>
  <div class="g3">${tile('stmt','🏦','Mutasi','Bank & e-wallet')}${tile('add','⚡','Catat cepat','kopi 18rb')}${tile('split','🍻','Split bill','Patungan')}${tile('tab" data-i="pocket','🎯','Target','Kantong')}<button class="tl" data-inv="1" type="button" aria-label="Buat Invoice">${ib('📄',220)}Buat Invoice<small>Cetak &amp; kirim</small></button><button class="tl" data-a="rcardopen" type="button" aria-label="Rate Card">${ib('💳',60)}Rate Card<small>Tarif &amp; layanan</small></button></div>
  <div class="hd" style="align-items:center;margin:18px 0 8px"><h3 style="margin:0">Terbaru</h3>${T.length?'<button class="ch" data-s="hist">Semua ›</button>':''}</div>${rec.length?rec.map(txItem).join(''):'<p class="mu">Belum ada catatan. Catat transaksi pertamamu di sini.</p>'}`}
 if(tab==='pocket'){const P=U.pockets||[];h=`<h1>Target & Wishlist 🎯</h1><div class="mu">Nabung buat hal yang kamu mau banget.</div><button class="pb" data-s="padd">＋ Kantong baru</button><div style="margin-top:12px">${P.length?P.map(p=>{const c=pocketCalc(p);return `<button class="it" data-s="pfill" data-i="${p.id}" style="display:block"><div style="display:flex;gap:10px;align-items:center"><span class="ic">${esc(p.emoji)}</span><div><b>${esc(p.name)}</b><small>${rp(p.saved)} / ${rp(p.target)} · ${c.pct}%</small></div></div><div class="bar"><i style="width:${c.pct}%"></i></div>${p.saved>=p.target?'<div class="n" style="margin-top:6px;font-size:12px">🏆 Target tercapai!</div>':`<div class="mu" style="margin-top:6px">${c.weeks?(c.late?'⚠ Lewat tenggat. ':'')+`Butuh ${rp(c.perWeek)}/minggu (${rp(c.perMonth)}/bulan) · ${c.weeks} minggu lagi`:'Tanpa tenggat'}</div><div class="mu" style="margin-top:4px">💡 Kurangi ngopi 2×/minggu (±${rp(c.coffee)}) → tercapai ${dur(c.faster)} lebih cepat!</div>`}</button>`}).join(''):'<p class="mu">Belum ada kantong. Buat satu: “Dana Konser”, “Ganti HP”, “Healing Bali”…</p>'}</div>`}
 if(tab==='stat'){const mm=smon,M=T.filter(t=>TD(t).startsWith(mm)),mi=M.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0),mx=M.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0),c={};
  M.filter(t=>t.type==='expense').forEach(t=>c[t.category]=(c[t.category]||0)+t.amount);
  const e=Object.entries(c).sort((a,b)=>b[1]-a[1]),cf=M.filter(t=>t.type==='expense'&&(COF.test(t.note||'')||/kopi/i.test(t.category))),cfs=cf.reduce((s,t)=>s+t.amount,0),spots=new Set(cf.map(t=>K.nz(t.note||'').replace(/\d|rp|\./g,'').trim())).size,fo=['Gengsi/FOMO','Impulsive Buying','Self-Reward/Healing','PayLater Billing'].reduce((s,k)=>s+(c[k]||0),0),net=mi-mx,isNow=mm===iso().slice(0,7);
  h=bookBarS()+`<div class="hd" style="align-items:center"><button class="ibtn" data-s="mon" data-i="-1" aria-label="Bulan sebelumnya">‹</button><div style="text-align:center"><h1 style="margin:0;font-size:21px">${esc(typeof ml==='function'?ml(mm):mm)}</h1><div class="mu">Cerita bulananmu</div></div><button class="ibtn" data-s="mon" data-i="1" aria-label="Bulan berikutnya"${isNow?' disabled':''}>›</button></div>
  <div class="hero"><span>Selisih (masuk − keluar)</span><b>${net<0?'-':''}${rp(net)}</b><div class="row"><div class="pl">Masuk<b>${rp(mi)}</b></div><div class="pl">Keluar<b>${rp(mx)}</b></div></div></div>
  <div class="bud"><b>Kalkulator FOMO 🎭</b><div style="margin:6px 0 4px;font-size:15px;font-weight:700;line-height:1.35">${cfs?`Habis ${rp(cfs)} buat ngopi${spots>1?` di ${spots} tempat berbeda`:''} (${cf.length}×).`:'Belum ada pengeluaran ngopi bulan ini 👏'}</div><div class="mu">${fo?`Plus ${rp(fo)} buat kategori healing/FOMO/impulsif/PayLater (${mx?Math.round(fo/mx*100):0}% dari pengeluaran).`:'Kategori impulsif masih bersih.'}</div></div>
  <h3>Lencana 🏅</h3><div class="bd2">${badges().map(b=>`<div class="${b[2]?'':'lk'}"><i>${b[0]}</i>${b[1]}</div>`).join('')}</div><h3>Per kategori</h3>
  ${e.length?e.map(([k,v])=>`<div class="it" style="display:block"><div style="display:flex;gap:8px;justify-content:space-between"><b>${esc(K.catEmoji(k))} ${esc(k)}</b><span class="a">${rp(v)}</span></div><div class="bar"><i style="width:${mx?Math.round(v/mx*100):0}%"></i></div><small>${mx?Math.round(v/mx*100):0}% dari pengeluaran</small></div>`).join(''):'<p class="mu">Belum ada pengeluaran di bulan ini.</p>'}`}
 if(tab==='me'){const st=U.stmts||[];
  h=`<h1>Akun</h1><div class="mu">Dompet, berkas, dan pengaturan.</div>
  <div class="vfp-account-message ${navigator.onLine?'is-online':''}" role="status" aria-live="polite"><b><span class="vfp-msg-dot"></span>${navigator.onLine?'Terhubung ke internet':'Offline'}</b>${navigator.onLine?'Data lokal tetap tersimpan di perangkat. Fitur yang memerlukan layanan online dapat digunakan saat koneksi tersedia.':'Data lokal tetap dapat digunakan. Fitur yang memerlukan layanan online mungkin tidak tersedia.'}</div>
  <div class="hd" style="align-items:center;margin:16px 0 8px"><h3 style="margin:0">Dompet</h3><button class="ch" data-s="wnew">＋ Dompet</button></div>${S.wallets.map((w,i)=>`<button class="it" data-s="wedit" data-i="${i}"><span class="ic">👛</span><div><b>${esc(w)}</b><small>Ketuk untuk ubah</small></div><span class="a ${bal_(w)<0?'o':''}">${rps(bal_(w))}</span></button>`).join('')}
  <button class="gh" data-s="xfer">🔁 Pindah saldo antar dompet</button>
  <h3>Berkas diunggah</h3>${st.length?st.map(s=>`<div class="it"><span class="ic">📄</span><div><b>${esc(s.name)}</b><small>${esc(s.bank)} · ${s.count} transaksi · ${esc(s.at)}</small></div><button class="ch" data-s="del" data-i="${s.id}">🗑 Hapus</button></div>`).join(''):'<p class="mu">Mutasi yang sudah dikategorikan muncul di sini, dan bisa kamu hapus.</p>'}
  <button class="gh" data-s="theme">🎨 Tampilan & tema</button><button class="gh" data-s="bud">💸 Atur batas jajan bulanan</button><button class="gh" data-s="swmode">${PW()?'🧑 Ganti ke Mode Pria':'👩 Ganti ke Mode Wanita'}</button><button class="gh" data-s="detail">↩ Pindah ke Mode Detail</button><button class="gh" data-vflang="1" data-no-i18n="1">🌐 Language / Bahasa · Mata uang / Currency</button>${window.MVDEV?window.MVDEV():''}`}
 R.innerHTML=`<div class="w">${h}</div><div class="nv">${[['home','Beranda'],['pocket','Target']].map(([k,l])=>`<button class="${tab===k?'on':''}" data-s="tab" data-i="${k}">${ic(k==='home'?'home':'target')}${l}</button>`).join('')}<button class="go" data-s="menu" aria-label="Tambah">${ic('plus')}</button>${[['stat','Cerita'],['me','Akun']].map(([k,l])=>`<button class="${tab===k?'on':''}" data-s="tab" data-i="${k}">${ic(k==='stat'?'chart':'user')}${l}</button>`).join('')}</div>`}

const U0=()=>S.settings,SEED=[['Tabungan & Target','🎯'],['Kopi Wangi','☕'],['Self-Reward/Healing','✨'],['Gengsi/FOMO','🎭'],['Impulsive Buying','🛍️'],['PayLater Billing','💳']];
function seedCats(){SEED.forEach(([c,e])=>{if(!S.catExp.includes(c))S.catExp.push(c);S.icons=S.icons||{};if(!S.icons[c])S.icons[c]=e});
 if(!K.ALIAS._s){K.ALIAS._s=1;K.ALIAS.unshift([/\b(kopi|ngopi|starbucks|janji jiwa|kenangan|fore|tomoro|latte|boba|chatime)/,/kopi wangi/],[/\b(paylater|spaylater|kredivo|akulaku)/,/paylater/],[/\b(healing|staycation|massage|self ?reward)/,/healing/],[/\b(racun|checkout|flash ?sale|impuls)/,/impulsive/],[/\b(konser|merch|thrift|sneaker|limited|fomo)/,/gengsi/])}
 BANKK.unshift([/gofood|grabfood|shopeefood|food/,/makan/],[/paylater|spaylater|kredivo|akulaku|cicilan/,/paylater/],[/starbucks|janji jiwa|kenangan|fore coffee|tomoro|kopi|ngopi|latte|boba|chatime/,/kopi wangi/],[/healing|spa |massage|staycation|salon/,/healing/],[/konser|tiket|merch|thrift|sneaker/,/gengsi/]);U0().seeded=1}
const streak=()=>{const D=new Set(TB().map(TD)),d=new Date();let n=0;if(!D.has(iso(d)))d.setDate(d.getDate()-1);while(D.has(iso(d))){n++;d.setDate(d.getDate()-1)}return n};
const mood=p=>p>=1?['😭','Waduh, budget jebol! Tahan dulu ya.','#ff5a5a']:p>=.9?['😰','Hampir habis, rem dulu yuk!','#ff7a5a']:p>=.7?['😅','Mulai tipis nih, hati-hati.','#ffd23f']:p>=.4?['😊','Aman terkendali, lanjut!','#c6ff3d']:['😎','Hemat banget, keren!','#7cf5c4'];
const COF=/\b(kopi|ngopi|starbucks|janji jiwa|kenangan|fore|tomoro|latte|cafe)\b/i;
const badges=()=>{const T=TB(),st=streak(),P=U0().pockets||[];return[['🔥','Streak 3 hari',st>=3],['⚡','Streak 7 hari',st>=7],['👑','Streak 30 hari',st>=30],['🧾','Scan pertama',T.some(t=>t.items||t.src)],['🏦','Impor mutasi',(U0().stmts||[]).length>0],['🎯','Punya target',P.length>0],['🏆','Target tercapai',P.some(p=>p.saved>=p.target)],['📝','50 catatan',T.length>=50]]};
const dur=w=>w<1?Math.max(1,Math.round(w*7))+' hari':Math.round(w)+' minggu';
const avgCof=()=>{const c=TB().filter(t=>t.type==='expense'&&(COF.test(t.note||'')||/kopi wangi/i.test(t.category)));return c.length?Math.round(c.reduce((s,t)=>s+t.amount,0)/c.length/500)*500:25000};
function pocketCalc(p){const rem=Math.max(0,p.target-p.saved),today=new Date(iso()),out={rem,pct:Math.min(100,Math.round(p.saved/p.target*100))};
 if(p.due){const w=Math.max(1,Math.ceil((new Date(p.due)-today)/6048e5));out.weeks=w;out.perWeek=Math.ceil(rem/w/500)*500;out.perMonth=Math.ceil(rem/Math.max(1,w/4.345)/500)*500;out.late=new Date(p.due)<today&&rem>0}
 const e=2*avgCof(),w0=out.perWeek||Math.max(1,rem/12);out.coffee=e;out.faster=rem>0?rem/w0-rem/(w0+e):0;return out}
function splitCalc(o){const P=o.people.filter(Boolean),sh={};P.forEach(n=>sh[n]=0);const its=[];
 String(o.items).split(/\n/).map(x=>x.trim()).filter(Boolean).forEach(l=>{const q=quick(l);if(!q.amount)return;let who=P.filter(n=>new RegExp('(^|[^a-z])'+n.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'([^a-z]|$)').test(l.toLowerCase()));let dn=q.desc;who.forEach(n=>{dn=dn.replace(new RegExp('(^|\\s)'+n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=\\s|$)','ig'),' ')});dn=dn.replace(/\s+/g,' ').trim()||q.desc;if(!who.length)who=P;its.push({n:dn,a:q.amount,who});who.forEach(n=>sh[n]+=q.amount/who.length)});
 const sub=its.reduce((s,i)=>s+i.a,0),sv=sub*(o.svc||0)/100,tx=(sub+sv)*(o.tax||0)/100,dc=Math.min(o.disc||0,sub),tot=sub+sv+tx-dc,res={};
 P.forEach(n=>{const f=sub?sh[n]/sub:0,v=sh[n]+f*(sv+tx-dc);res[n]=o.round?Math.ceil(v/o.round)*o.round:Math.round(v)});
 return{its,sub,sv,tx,dc,tot,res}}
function splitText(o,c){const L=[`🧾 *Split Bill${o.title?' — '+o.title:''}* (${fd(iso())})`,''];c.its.forEach(i=>L.push(`• ${i.n} ${rp(i.a)}${i.who.length<o.people.length?' ('+i.who.join(', ')+')':''}`));L.push('',`Subtotal ${rp(c.sub)}`);if(c.sv)L.push(`Servis ${o.svc}% ${rp(c.sv)}`);if(c.tx)L.push(`Pajak ${o.tax}% ${rp(c.tx)}`);if(c.dc)L.push(`Diskon -${rp(c.dc)}`);L.push(`*Total ${rp(c.tot)}*`,'','💸 *Tagihan:*');Object.entries(c.res).forEach(([n,v])=>L.push(`${n}: *${rp(v)}*`));if(o.pay)L.push('',`Transfer ke: ${o.pay}`);L.push('','Makasih ya! 🙏');return L.join('\n')}
function splitSheet(){const o={title:'',people:['Aku'],items:'',svc:5,tax:10,disc:0,round:0,pay:''};
 const e=sheet(`<h2>Split bill 🍻</h2><input data-k="title" placeholder="Nama acara (mis. Makan Seblak)"><input data-k="people" placeholder="Siapa aja? pisah koma (nama pertama = kamu)" value="Aku, Andi, Budi"><textarea data-k="items" rows="5" placeholder="Satu baris satu pesanan:\nSeblak 35rb andi\nEs teh 8rb budi\n2x Tahu crispy 20rb (tanpa nama = dibagi semua)"></textarea><div class="row"><input data-k="svc" inputmode="decimal" value="5" placeholder="Servis %"><input data-k="tax" inputmode="decimal" value="10" placeholder="Pajak %"><input data-k="disc" data-money inputmode="numeric" autocomplete="off" placeholder="Diskon Rp"></div><select data-k="round"><option value="0">Tanpa pembulatan</option><option value="500">Bulatkan ke 500</option><option value="1000">Bulatkan ke 1.000</option></select><input data-k="pay" placeholder="Transfer ke (mis. BCA 123 a.n. Aku)"><pre id="sp">Isi pesanan dulu…</pre><div class="row"><button class="pb" data-k="cp" style="margin:0">📋 Salin</button><button class="gh" data-k="wa" style="margin:0">WhatsApp</button></div><button class="gh" data-k="me">Catat bagianku sebagai pengeluaran</button>`);
 let last=null;const read=()=>{const g=k=>e.querySelector(`[data-k=${k}]`).value;o.title=g('title').trim();o.people=[...new Set(g('people').split(/[,\n]/).map(x=>x.trim()).filter(Boolean))];o.items=g('items');o.svc=Math.max(0,parseFloat(g('svc').replace(',','.'))||0);o.tax=Math.max(0,parseFloat(g('tax').replace(',','.'))||0);o.disc=mnum(g('disc'));o.round=+g('round');o.pay=g('pay').trim()};
 const upd=()=>{read();last=null;const p=e.querySelector('#sp');if(!o.people.length||!o.items.trim()){p.textContent='Isi nama teman & pesanan dulu…';return}const c=splitCalc(o);if(!c.its.length){p.textContent='Belum ada harga terbaca. Tulis mis. “Seblak 35rb”.';return}last={c,t:splitText(o,c)};p.textContent=last.t};
 e.oninput=upd;e.onchange=upd;
 e.onclick=async ev=>{if(ev.target===e)return e.remove();const k=ev.target.dataset.k;if(!['cp','wa','me'].includes(k))return;upd();if(!last)return toast('Lengkapi dulu pesanannya.');
  if(k==='cp'){try{await navigator.clipboard.writeText(last.t)}catch(x){const t=document.createElement('textarea');t.value=last.t;document.body.append(t);t.select();document.execCommand('copy');t.remove()}toast('Tersalin — tinggal tempel di WhatsApp ✅')}
  if(k==='wa')window.open('https://wa.me/?text='+encodeURIComponent(last.t),'_blank');
  if(k==='me'){const mine=last.c.res[o.people[0]];if(!mine)return;save_([mk({type:'expense',amount:mine,cat:cat(o.title||'makan','expense'),date:iso(),note:'Split bill'+(o.title?' — '+o.title:'')})]);toast('Bagianmu '+rp(mine)+' tercatat ✅')}}}
function pocketSheet(p){const ed=!!p;
 const e=sheet(`<h2>${ed?'Ubah kantong':'Kantong baru'} 🎯</h2><input data-k="name" placeholder="Dana Konser Coldplay 2027" maxlength="40" value="${esc(ed?p.name:'')}"><div>${['🎤','✈️','📱','👟','🎮','🏠','💍','🛵'].map(x=>`<button class="ch" data-k="em" data-v="${x}">${x}</button>`).join('')}</div><input data-k="emo" value="${esc(ed?p.emoji:'🎯')}" maxlength="8" placeholder="Emoji">${MI('target','Target (Rp)',ed?p.target:0)}${ed?'':MI('saved','Sudah terkumpul (opsional)',0)}<div class="mu">Tenggat (opsional)</div><input data-k="due" type="date"${!ed||!p.due||p.due>=iso()?` min="${iso()}"`:''} value="${esc(ed&&p.due||'')}"><button class="pb" data-k="ok">${ed?'Simpan perubahan':'Buat kantong'}</button>`);
 e.onclick=ev=>{if(ev.target===e)return e.remove();const k=ev.target.dataset.k,g=x=>e.querySelector(`[data-k=${x}]`).value;if(k==='em')e.querySelector('[data-k=emo]').value=ev.target.dataset.v;
  if(k==='ok'){const name=g('name').trim(),t=mnum(g('target')),sv=ed?p.saved:mnum(g('saved')),due=g('due'),emo=[...g('emo').trim()].slice(0,3).join('')||'🎯';if(!name)return toast('Kasih nama kantongnya.');if(!(t>0))return toast('Isi target lebih dari 0.');if(due&&due<iso()&&(!ed||due!==p.due))return toast('Tenggat tidak boleh di masa lalu.');
   if(ed){Object.assign(p,{name:name.slice(0,40),emoji:emo,target:t,due})}else(U0().pockets=U0().pockets||[]).push({id:Date.now(),name:name.slice(0,40),emoji:emo,target:t,saved:sv,due,log:[]});
   e.remove();save();toast(ed?'Kantong diperbarui ✅':'Kantong dibuat 🎉')}}}
function fillSheet(p){const c0=pocketCalc(p);
 const e=sheet(`<h2>${esc(p.emoji)} ${esc(p.name)}</h2><div class="mu">Terkumpul ${rp(p.saved)} dari ${rp(p.target)} (${c0.pct}%)${p.due?' · tenggat '+fd(p.due):''}.</div><div class="bar" style="margin:10px 0"><i style="width:${c0.pct}%"></i></div>${MI('a','Jumlah (Rp)',0,' autofocus')}<div class="mu" style="margin-top:6px">Ambil/isi dari dompet?</div><select data-k="w"><option value="">Tidak — hanya penanda tabungan</option>${S.wallets.map(w=>`<option>${esc(w)}</option>`).join('')}</select><div class="row"><button class="pb" data-k="in" style="margin:8px 0 0">＋ Isi</button><button class="gh" data-k="out" style="margin:8px 0 0">− Ambil</button></div><div class="mu" style="margin-top:8px">Kalau memilih dompet: “Isi” tercatat sebagai pengeluaran ${esc(SAV)}, “Ambil” sebagai pemasukan, sehingga saldo dompet ikut berubah.</div><button class="gh" data-k="edit">✏️ Ubah kantong</button><button class="gh" data-k="del" style="color:#ff7a7a">🗑 Hapus kantong</button>`);
 e.onclick=async ev=>{if(ev.target===e)return e.remove();const k=ev.target.dataset.k;if(!k)return;const a=mnum(e.querySelector('[data-k=a]').value),w=e.querySelector('[data-k=w]').value;
  if(k==='edit'){e.remove();return pocketSheet(p)}
  if(k==='in'||k==='out'){if(!(a>0))return toast('Isi jumlahnya dulu.');if(k==='out'&&a>p.saved)return toast('Melebihi isi kantong ('+rp(p.saved)+').');
   const was=p.saved>=p.target;p.saved+=k==='in'?a:-a;p.log=(p.log||[]).concat({d:iso(),a:k==='in'?a:-a}).slice(-60);
   if(w){let ct=SAV,ty='expense';if(k==='in'){if(!S.catExp.includes(SAV)){S.catExp.push(SAV);S.icons=S.icons||{};S.icons[SAV]='🎯'}}else{ty='income';ct=S.catInc.find(x=>/lainnya/i.test(x))||S.catInc[0]}
    S.transactions.unshift(mk({type:ty,amount:a,cat:ct,date:iso(),wallet:w,note:(k==='in'?'Isi kantong — ':'Ambil dari kantong — ')+p.name}))}
   e.remove();save();toast(k==='in'&&!was&&p.saved>=p.target?'TARGET TERCAPAI! 🏆':'Tersimpan ✅')}
  if(k==='del'&&await ask('Hapus kantong?',p.name+'\n(Catatan dompet yang sudah dibuat tidak ikut terhapus.)',['Hapus','Batal'])===0){U0().pockets=U0().pockets.filter(x=>x!==p);e.remove();save()}}}
function budSheet(){const e=sheet(`<h2>Batas jajan bulanan 💸</h2><div class="mu">Pengeluaran kategori “${esc(SAV)}” tidak dihitung sebagai jajan.</div>${MI('b','Mis. 3.000.000',U0().sbud||0,' autofocus')}<button class="pb" data-k="ok">Simpan</button>${U0().sbud?'<button class="gh" data-k="off">Matikan batas</button>':''}`);e.onclick=ev=>{if(ev.target===e)return e.remove();const k=ev.target.dataset.k;if(k==='ok'){U0().sbud=mnum(e.querySelector('[data-k=b]').value);e.remove();save();toast('Batas disimpan ✅')}else if(k==='off'){U0().sbud=0;e.remove();save()}}}

const SVGI=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICN={scan:SVGI('<path d="M6 3h12v18l-2.2-1.6L13.5 21l-1.5-1.6L10.500 21 8.200 19.400 6 21z"/><path d="M9.500 8h5M9.500 12h5"/>'),bank:SVGI('<path d="M3 10l9-6 9 6M5.500 10v8M9.800 10v8M14.200 10v8M18.500 10v8M3 20.500h18"/>'),phone:SVGI('<rect x="7" y="2.500" width="10" height="19" rx="2.800"/><path d="M10.500 18.500h3"/>'),bolt:SVGI('<path d="M13 2L4.500 13.500H11L10 22l8.500-11.500H12.500z"/>'),split:SVGI('<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.500"/><path d="M2.500 19c.6-3.200 2.900-5 5.500-5s4.900 1.800 5.500 5M15 14.200c2.600-.4 5 1 5.600 4.600"/>'),target:SVGI('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.200"/>'),home:SVGI('<path d="M4 11l8-7 8 7M6 9.500V20h12V9.500M10 20v-5h4v5"/>'),chart:SVGI('<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>'),user:SVGI('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.200 4.200-6 8-6s7 1.800 8 6"/>'),plus:SVGI('<path d="M12 5v14M5 12h14"/>'),swap:SVGI('<path d="M4 8h13l-3-3M20 16H7l3 3"/>'),palette:SVGI('<path d="M12 3a9 9 0 100 18c1.500 0 2-1 1.400-2-.6-1 0-2.200 1.200-2.200H17a4 4 0 004-4c0-5-4-9.800-9-9.800z"/><circle cx="7.500" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.500" r="1"/>'),market:SVGI('<path d="M4 8h16l-1.4 12H5.4L4 8z"/><path d="M8 8V6a4 4 0 018 0v2"/>'),invoice:SVGI('<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h5M9 12h7M9 16h7"/>'),card:SVGI('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 10h18M7 15h4"/>')};
const EM2={'🔁':'swap','🧾':'scan','🏦':'bank','📱':'phone','⚡':'bolt','🍻':'split','🎯':'target','🛍️':'market','🛍':'market','📄':'invoice','💳':'card'},HR={'🔁':-20,'🧾':0,'🏦':40,'📱':-50,'⚡':90,'🍻':150,'🎯':-110,'🛍️':25,'🛍':25,'📄':220,'💳':60};
const ib=(e,hr)=>PW()?`<i class="ib cu">${CU2[e]||e}</i>`:`<i class="ib" style="--hr:${hr??HR[e]??0}deg">${ICN[EM2[e]]||e}</i>`;
const tint=c=>{let h=0;for(const ch of String(c))h=(h*31+ch.charCodeAt(0))%360;return h};
const TH={neon:{n:'Neon Campus',d:'Mahasiswa · gelap + lime',bg:'#0a0a14',cd:'#15152a',cd2:'#222240',tx:'#f4f4ff',mu:'#9b9bb8',ac:'#b8ff3c',ac2:'#4df0ff',onac:'#0a0a14',ok:'#5cf2b0',bad:'#ff6b81',onh:'#0a0a14',hero:'linear-gradient(135deg,#b8ff3c,#4df0ff 55%,#7a8cff)'},
 pastel:{n:'Pastel Dream',d:'Aesthetic · lilac terang',bg:'#f5f0ff',cd:'#ffffff',cd2:'#ece4ff',tx:'#241b3a',mu:'#7d7396',ac:'#8b5cf6',ac2:'#f472b6',onac:'#ffffff',ok:'#0f9d76',bad:'#e5484d',onh:'#2a1a4a',hero:'linear-gradient(135deg,#c4b5fd,#f9a8d4 55%,#fdba9b)'},
 sunset:{n:'Sunset Hustle',d:'Pekerja · gelap + oranye',bg:'#130d0b',cd:'#211613',cd2:'#33221c',tx:'#fff4ee',mu:'#b39a8f',ac:'#ff8a3d',ac2:'#ff4f8b',onac:'#1a0c05',ok:'#7be0a8',bad:'#ff6b6b',onh:'#ffffff',hero:'linear-gradient(135deg,#ff8a3d,#ff4f8b 55%,#8a4dff)'},
 office:{n:'Clean Office',d:'Kantoran · biru terang',bg:'#f1f4fa',cd:'#ffffff',cd2:'#e6ecf7',tx:'#0f1a33',mu:'#68748f',ac:'#2f5bff',ac2:'#00c2ff',onac:'#ffffff',ok:'#0a9d6c',bad:'#e5484d',onh:'#ffffff',hero:'linear-gradient(135deg,#2f5bff,#6a5cff 50%,#00c2ff)'}};
const PW=()=>S.settings.mode==='wanita',DEF=()=>PW()?'pink':'neon';
TH.pink={pk:1,n:'Pink Manis',d:'Permen · pink cerah',bg:'#fff0f6',cd:'#ffffff',cd2:'#ffe1ee',tx:'#4a2437',mu:'#a0708a',ac:'#ff5c9d',ac2:'#ffa8cf',onac:'#ffffff',ok:'#12a37f',bad:'#e5446d',onh:'#ffffff',hero:'linear-gradient(135deg,#ff5c9d,#ff8fc0 55%,#ffc2dd)'};
TH.berry={pk:1,n:'Strawberry Milk',d:'Susu stroberi · lembut',bg:'#fff6f8',cd:'#ffffff',cd2:'#ffe8ee',tx:'#5a2a3a',mu:'#b0788a',ac:'#e83e8c',ac2:'#ff9aab',onac:'#ffffff',ok:'#12a37f',bad:'#d6335f',onh:'#ffffff',hero:'linear-gradient(135deg,#f0589c,#ff8da1 55%,#ffd0dc)'};
TH.night={pk:1,n:'Bubblegum Night',d:'Malam · pink neon',bg:'#2a1020',cd:'#3b1830',cd2:'#512344',tx:'#ffeaf3',mu:'#d9a3bd',ac:'#ff6eb4',ac2:'#c58bff',onac:'#2a1020',ok:'#6af0c0',bad:'#ff7a9c',onh:'#2a1020',hero:'linear-gradient(135deg,#ff6eb4,#ff9ad0 55%,#c58bff)'};
const CU={home:'🏡',target:'🎀',plus:'🍓',chart:'🍭',user:'🐰',palette:'🎨'},CU2={'🔁':'🔄','🧾':'🧸','🏦':'🐷','📱':'💌','⚡':'✨','🍻':'🧋','🎯':'🌸','📄':'📒','💳':'💝'};
const ic=n=>PW()?`<span class="cu">${CU[n]}</span>`:ICN[n];
const lum=h=>{const n=parseInt(h.slice(1),16);return(.299*(n>>16&255)+.587*(n>>8&255)+.114*(n&255))/255};
function applyTheme(){const c=U.sm=U.sm||{},t=(TH[c.t]&&!!TH[c.t].pk===PW()?TH[c.t]:null)||TH[DEF()],st=R.style,v={...t};
 if(c.ac&&/^#[0-9a-f]{6}$/i.test(c.ac)){v.ac=c.ac;v.ac2='color-mix(in srgb,'+c.ac+' 50%,#6af0ff)';v.onac=lum(c.ac)>.6?'#10131a':'#ffffff';v.hero=`linear-gradient(135deg,${c.ac},${v.ac2})`;v.onh=v.onac}
 ['bg','cd','cd2','tx','mu','ac','ac2','onac','ok','bad','onh','hero'].forEach(k=>st.setProperty('--'+k,v[k]));
 st.setProperty('--rs',{sharp:.35,round:1,pill:1.4}[c.r]??1);st.setProperty('--ff',{round:'ui-rounded,"Nunito","Quicksand","Segoe UI",system-ui,sans-serif',mono:'ui-monospace,"JetBrains Mono",Menlo,monospace'}[c.f]||'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif');
 R.dataset.bgs=c.b||'plain';R.dataset.cs=c.cs||'solid';const m=document.querySelector('meta[name=theme-color]');if(m&&document.body.classList.contains('sm'))m.content=v.bg}
function themeSheet(){const e=sheet('');const box=e.firstChild,qs=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(x){}},c=()=>U.sm=U.sm||{};
 const ch=(k,l,cur)=>`<button class="ch" data-k="${k}" data-v="${l[0]}" style="${cur===l[0]?'background:var(--ac);color:var(--onac)':''}">${l[1]}</button>`;
 const draw=()=>{const o=c();box.innerHTML=`<h2>Tampilan 🎨</h2><div class="mu">Pilih tema, lalu racik sendiri.</div><div class="tm" style="margin-top:10px">${Object.entries(TH).filter(([k,t])=>PW()?t.pk:!t.pk).map(([k,t])=>`<button class="${(TH[o.t]&&!!TH[o.t].pk===PW()?o.t:DEF())===k?'on':''}" data-k="t" data-v="${k}"><i style="background:${t.hero}"></i><b>${t.n}</b><br><span class="mu">${t.d}</span></button>`).join('')}</div>
 <div class="kh mu" style="margin:14px 0 4px">Warna aksen</div><div>${(PW()?['#ff5c9d','#e83e8c','#ff7eb6','#ff8fa3','#d946ef','#c084fc','#fb7185','#f472b6']:['#b8ff3c','#8b5cf6','#ff8a3d','#2f5bff','#ff4f8b','#14b8a6','#facc15','#ef4444']).map(x=>`<button class="sw ${o.ac===x?'on':''}" data-k="ac" data-v="${x}" style="background:${x}" aria-label="${x}"></button>`).join('')}<input type="color" data-k="acc" value="${o.ac||'#b8ff3c'}" style="width:44px;height:34px;padding:2px;display:inline-block;vertical-align:middle"><button class="ch" data-k="ac" data-v="">Bawaan tema</button></div>
 <div class="mu" style="margin:12px 0 4px">Latar</div>${[['plain','Polos'],['dots','Titik'],['grid','Kisi'],['glow','Glow']].map(x=>ch('b',x,o.b||'plain')).join('')}
 <div class="mu" style="margin:12px 0 4px">Gaya kartu</div>${[['solid','Solid'],['glass','Kaca'],['line','Garis']].map(x=>ch('cs',x,o.cs||'solid')).join('')}
 <div class="mu" style="margin:12px 0 4px">Sudut</div>${[['sharp','Tajam'],['round','Bulat'],['pill','Pil']].map(x=>ch('r',x,o.r||'round')).join('')}
 <div class="mu" style="margin:12px 0 4px">Font</div>${[['','Normal'],['round','Rounded'],['mono','Mono']].map(x=>ch('f',x,o.f||'')).join('')}
 <button class="gh" data-k="reset">↺ Kembalikan ke tema awal</button><button class="pb" data-k="done">Selesai</button>`};
 draw();
 e.oninput=ev=>{if(ev.target.dataset.k==='acc'){c().ac=ev.target.value;applyTheme();qs()}};
 e.onclick=ev=>{if(ev.target===e)return e.remove();const b=ev.target.closest('[data-k]');if(!b)return;const k=b.dataset.k,v=b.dataset.v,o=c();
  if(k==='done'){e.remove();save();return}if(k==='acc')return;
  if(k==='reset'){U.sm={t:o.t||DEF()}}else if(k==='t'){o.t=v;o.ac=''}else o[k]=v;
  applyTheme();qs();draw()}}
const bal_=w=>typeof bal==='function'?bal(w):0;
const sheet=h=>{const e=document.createElement('div');e.className='sh';e.innerHTML='<div>'+h+'</div>';e.onclick=ev=>{if(ev.target===e)e.remove()};R.append(e);setTimeout(()=>{const f=e.querySelector('[autofocus]');if(f)try{f.focus()}catch(x){}},40);return e};
function save_(arr,extra){S.transactions.unshift(...arr);if(extra)(U.stmts=U.stmts||[]).unshift(extra);save()}

const ask=(title,msg,btns)=>new Promise(ok=>{const e=sheet(`<h2>${esc(title)}</h2><div class="mu" style="white-space:pre-line;margin:6px 0 12px">${esc(msg)}</div>${btns.map((b,i)=>`<button class="${i===0?'pb':'gh'}" data-q="${i}">${esc(b)}</button>`).join('')}`);e.onclick=ev=>{const q=ev.target.dataset.q;if(q!=null){e.remove();ok(+q)}else if(ev.target===e){e.remove();ok(-1)}}});
function reviewStmt(p,name){
 if(!p.rows.length)return toast('Tidak ada transaksi terbaca. Coba PDF aslinya atau “Tempel teks mutasi”.');
 const w0=S.wallets.find(w=>K.nz(w).includes(K.nz(p.bank)))||S.wallets[0];
 const row=r=>`<div class="rv" data-r="${r.id}"><input type="checkbox" data-k="on" ${r.on?'checked':''}><div><input data-k="desc" value="${esc(r.desc)}" maxlength="60" style="font-size:13px;padding:8px;margin:0 0 4px"><input type="date" data-k="date" value="${r.date}" style="padding:4px;font-size:12px;width:auto;margin:0"> ${r.flag?`<span class="ch" style="background:color-mix(in srgb,#ffb020 28%,var(--cd2))">⚠ ${esc(r.flag)}</span>`:''}</div><input inputmode="numeric" data-money autocomplete="off" data-k="amt" value="${fmt(r.amount)}" style="font-size:13px;padding:8px;margin:0"><span></span><select data-k="ty"><option value="expense"${r.type==='expense'?' selected':''}>Keluar</option><option value="income"${r.type==='income'?' selected':''}>Masuk</option></select><select data-k="cat">${catOpts(r.type,r.cat)}</select></div>`;
 const e=sheet('');const box=e.firstChild;
 const draw=()=>{const on=p.rows.filter(r=>r.on),i=on.filter(r=>r.type==='income').reduce((s,r)=>s+r.amount,0),o=on.filter(r=>r.type==='expense').reduce((s,r)=>s+r.amount,0);
  box.innerHTML=`<h2>${esc(p.bank)} · ${p.rows.length} transaksi</h2><div class="mu">Masuk <b class="n">${rp(i)}</b> · Keluar <b class="o">${rp(o)}</b></div>${p.recon?`<div class="ch" style="background:${p.recon.ok?'color-mix(in srgb,#10c27a 30%,var(--cd2))':'color-mix(in srgb,#ff5a5a 30%,var(--cd2))'}">${p.recon.ok?'✓ Cocok dengan saldo awal & akhir':'⚠ Selisih '+rp(p.recon.diff)+' dari saldo akhir — cek baris bertanda'}</div>`:''}${p.loose?'<div class="ch" style="background:color-mix(in srgb,#ffb020 28%,var(--cd2))">Format screenshot: cek tiap baris dengan teliti</div>':''}
  <select data-k="wal">${S.wallets.map(w=>`<option${w===(p.w||w0)?' selected':''}>${esc(w)}</option>`).join('')}<option value="__new"${p.w==='__new'?' selected':''}>＋ Dompet baru: ${esc(p.bank)}</option></select>
  <div class="row" style="margin:6px 0"><button class="ch" data-k="all">Pilih semua</button><button class="ch" data-k="none">Kosongkan</button></div><div id="rl">${p.rows.map(row).join('')}</div><button class="pb" data-k="ok">Simpan ${on.length} transaksi</button>`};
 draw();
 const rowOf=t=>p.rows[+t.closest('[data-r]').dataset.r];
 e.onchange=ev=>{const t=ev.target,k=t.dataset.k;if(k==='wal'){p.w=t.value;return}if(!k||!t.closest('[data-r]'))return;const r=rowOf(t);
  if(k==='on')r.on=t.checked;else if(k==='cat'){r.cat=t.value;r.cm=1}else if(k==='date'){if(t.value)r.date=t.value}
  else if(k==='desc'){r.desc=t.value.trim().slice(0,60)||'Mutasi';if(r.cm)return;const nc=cat(r.desc,r.type);if(nc===r.cat)return;r.cat=nc;r.flag=/lainnya/i.test(nc)?'cek kategori':''}
  else if(k==='amt'){const v=mnum(t.value);if(v>0)r.amount=v;else t.value=fmt(r.amount)}
  else if(k==='ty'){r.type=t.value;r.cat=cat(r.desc,r.type);r.cm=0;r.flag=''}
  const y=box.scrollTop;draw();box.scrollTop=y};
 e.onclick=async ev=>{if(ev.target===e)return e.remove();const k=ev.target.dataset.k;
  if(k==='all'||k==='none'){p.rows.forEach(r=>r.on=k==='all');const y=box.scrollTop;draw();box.scrollTop=y}
  if(k!=='ok')return;let w=p.w||w0;if(w==='__new'){w=p.bank;let n=2;while(S.wallets.includes(w))w=p.bank+' '+n++}
  const id=Date.now(),arr=[];let dup=0;
  p.rows.filter(r=>r.on&&r.amount>0).forEach(r=>{r.h=r.date+'|'+r.amount+'|'+r.type+'|'+K.nz(r.desc).slice(0,20);if(dedupe(r)){dup++;return}arr.push(mk({...r,wallet:w,note:r.desc,x:{src:id,h:r.h}}))});
  if(!arr.length){if(dup)e.remove();return toast(dup?'Semua transaksi sudah pernah dicatat, tidak ada yang ditambah.':'Tidak ada baris yang dipilih.')}
  if(!S.wallets.includes(w))S.wallets.push(w);
  save_(arr,{id,name,bank:p.bank,count:arr.length,at:fd(iso())});e.remove();toast(`${arr.length} transaksi tersimpan${dup?` · ${dup} duplikat dilewati`:''}. Berkas bisa dihapus di tab Akun.`)}}
function txSheet(t){
 if(!t&&window.VFQC&&VFQC.open)return VFQC.open();
 if(t&&t.type==='transfer')return xferView(t);
 const isNew=!t,v=t?{type:t.type==='income'?'income':'expense',amount:t.amount,desc:t.note||'',cat:t.category,date:TD(t)||iso(),w:t.wallet}:{type:'expense',amount:0,desc:'',cat:cats('expense')[0],date:iso(),w:S.wallets[0]},T={};
 const e=sheet('');const box=e.firstChild,g=k=>box.querySelector(`[data-k=${k}]`);
 const WL=S.wallets.includes(v.w)||!v.w?S.wallets:[v.w,...S.wallets];
 box.innerHTML=`<h2>${isNew?'Catat cepat ⚡':'Ubah catatan'}</h2>${isNew?'<input data-k="q" placeholder="kopi 18rb · gaji 5jt · 2x bakso 15000 kemarin" autofocus autocomplete="off">':''}<div class="row"><button class="gh" data-k="ty" data-v="expense">Keluar</button><button class="gh" data-k="ty" data-v="income">Masuk</button></div>${MI('amt','Jumlah (Rp)',v.amount,isNew?'':' autofocus')}<input data-k="desc" placeholder="Catatan" value="${esc(v.desc)}" maxlength="80"><select data-k="cat"></select><input data-k="date" type="date" value="${v.date}"><select data-k="w">${WL.map(w=>`<option${w===v.w?' selected':''}>${esc(w)}</option>`).join('')}</select><button class="pb" data-k="ok">Simpan</button>${isNew?'':'<button class="gh" data-k="del" style="color:#ff7a7a">🗑 Hapus catatan</button>'}`;
 const tyBtn=()=>box.querySelectorAll('[data-k=ty]').forEach(b=>{b.style.cssText=b.dataset.v===v.type?'background:var(--ac);color:var(--onac)':''}),catSel=()=>{g('cat').innerHTML=catOpts(v.type,v.cat)};
 catSel();tyBtn();
 e.oninput=ev=>{const k=ev.target.dataset.k,val=ev.target.value;
  if(k==='q'){const raw=val.trim(),q=quick(raw);
   if(!T.amt){v.amount=raw?q.amount:0;g('amt').value=fmt(v.amount)}
   if(!T.ty){v.type=q.type;tyBtn()}
   if(!T.desc){v.desc=raw?q.desc:'';g('desc').value=v.desc}
   if(!T.cat){v.cat=cat(v.desc,v.type);catSel()}
   if(!T.date)g('date').value=v.date=q.date}
  else if(k==='amt'){T.amt=1;v.amount=mnum(val)}
  else if(k==='desc'){T.desc=1;v.desc=val;if(isNew&&!T.cat){v.cat=cat(v.desc,v.type);catSel()}}};
 e.onchange=ev=>{const k=ev.target.dataset.k,val=ev.target.value;if(k==='cat'){T.cat=1;v.cat=val}else if(k==='date'){if(val)v.date=val}else if(k==='w')v.w=val};
 e.onclick=async ev=>{if(ev.target===e)return e.remove();const b=ev.target.closest('[data-k]');if(!b)return;const k=b.dataset.k;
  if(k==='ty'){T.ty=1;v.type=b.dataset.v;if(!T.cat)v.cat=cat(v.desc,v.type);else if(!cats(v.type).includes(v.cat))v.cat=cats(v.type)[0];tyBtn();catSel()}
  else if(k==='ok'){v.amount=mnum(g('amt').value);v.date=g('date').value||v.date;v.w=g('w').value;v.cat=g('cat').value||v.cat;v.desc=g('desc').value.trim();if(!(v.amount>0))return toast('Isi jumlahnya dulu.');if(!cats(v.type).includes(v.cat)&&!(t&&v.cat===t.category&&t.type===v.type))v.cat=cats(v.type)[0];
   if(isNew)save_([mk({type:v.type,amount:v.amount,cat:v.cat,date:v.date,wallet:v.w,note:v.desc})]);else{Object.assign(t,{type:v.type,amount:v.amount,category:v.cat,isoDate:v.date,date:fd(v.date),wallet:v.w,note:v.desc});save()}e.remove();toast('Tersimpan ✅')}
  else if(k==='del'){const c=await ask('Hapus catatan ini?',`${t.note||t.category} · ${rp(t.amount)}`,['Hapus','Batal']);if(c===0){S.transactions=S.transactions.filter(x=>x.id!==t.id);e.remove();save();toast('Dihapus')}}}}
function xferView(t){const e=sheet(`<h2>Pindah saldo 🔁</h2><div class="it xf" style="margin-top:8px"><span class="ic">🔁</span><div><b>${esc(t.wallet)} → ${esc(t.toWallet||'?')}</b><small>${esc(t.date||'')}${t.note?' · '+esc(t.note):''}</small></div><span class="a">${rp(t.amount)}</span></div><div class="mu">Untuk mengubah, hapus lalu buat pindah saldo baru.</div><button class="gh" data-k="del" style="color:#ff7a7a">🗑 Hapus catatan</button>`);
 e.onclick=async ev=>{if(ev.target===e)return e.remove();if(ev.target.dataset.k!=='del')return;const c=await ask('Hapus pindah saldo ini?',`${t.wallet} → ${t.toWallet||'?'} · ${rp(t.amount)}`,['Hapus','Batal']);if(c===0){S.transactions=S.transactions.filter(x=>x.id!==t.id);e.remove();save();toast('Dihapus')}}}
function xferSheet(){if(S.wallets.length<2)return toast('Butuh minimal 2 dompet. Tambah dompet dulu di tab Akun.');
 const e=sheet(`<h2>Pindah saldo 🔁</h2><div class="mu">Dari dompet</div><select data-k="f">${S.wallets.map(w=>`<option>${esc(w)}</option>`).join('')}</select><div class="mu">Ke dompet</div><select data-k="t">${S.wallets.map((w,i)=>`<option${i===1?' selected':''}>${esc(w)}</option>`).join('')}</select>${MI('a','Jumlah (Rp)',0,' autofocus')}<input data-k="d" type="date" value="${iso()}"><input data-k="n" placeholder="Catatan (opsional)" maxlength="80"><button class="pb" data-k="ok">Pindahkan</button>`);
 e.onclick=ev=>{if(ev.target===e)return e.remove();if(ev.target.dataset.k!=='ok')return;const g=k=>e.querySelector(`[data-k=${k}]`).value,f=g('f'),to=g('t'),a=mnum(g('a')),d=g('d')||iso();
  if(f===to)return toast('Pilih dua dompet yang berbeda.');if(!(a>0))return toast('Isi jumlahnya dulu.');
  save_([mk({type:'transfer',amount:a,cat:'Transfer',date:d,wallet:f,note:g('n').trim()||'Pindah saldo',x:{toWallet:to}})]);e.remove();toast('Saldo dipindah ✅')}}
function walletSheet(idx){const w=idx==null?null:S.wallets[idx],isE=w!=null;
 const e=sheet(`<h2>${isE?'Ubah dompet':'Dompet baru'} 👛</h2><input data-k="n" placeholder="Nama dompet (mis. BCA, GoPay)" value="${esc(w||'')}" maxlength="30" autofocus><div class="mu">Saldo awal (Rp)</div>${MI('o','0',isE?S.walletOpeningBalances[w]:0)}<button class="pb" data-k="ok">Simpan</button>${isE&&S.wallets.length>1?'<button class="gh" data-k="del" style="color:#ff7a7a">🗑 Hapus dompet</button>':''}`);
 e.onclick=async ev=>{if(ev.target===e)return e.remove();const k=ev.target.dataset.k;if(!k)return;
  if(k==='ok'){const n=e.querySelector('[data-k=n]').value.trim(),o=mnum(e.querySelector('[data-k=o]').value);if(!n)return toast('Isi nama dompet.');if(n!==w&&S.wallets.includes(n))return toast('Nama dompet sudah dipakai.');
   if(isE&&n!==w){S.wallets[S.wallets.indexOf(w)]=n;delete S.walletOpeningBalances[w];S.transactions.forEach(t=>{if(t.wallet===w)t.wallet=n;if(t.toWallet===w)t.toWallet=n});S.sched.forEach(x=>{if(x.wallet===w)x.wallet=n})}else if(!isE)S.wallets.push(n);
   S.walletOpeningBalances[n]=o;e.remove();save();toast('Dompet tersimpan ✅')}
  else if(k==='del'){if(S.transactions.some(t=>t.wallet===w||t.toWallet===w)||S.sched.some(x=>x.wallet===w))return toast('Dompet ini masih dipakai transaksi atau jadwal, tidak bisa dihapus.');const c=await ask('Hapus dompet?',w,['Hapus','Batal']);if(c===0){S.wallets=S.wallets.filter(x=>x!==w);delete S.walletOpeningBalances[w];e.remove();save();toast('Dompet dihapus')}}}}
function histSheet(){const st={q:'',ty:'all',m:'all'};let lim=60;
 const months=[...new Set(TB().map(t=>TD(t).slice(0,7)).filter(Boolean))].sort().reverse();
 const e=sheet(`<h2>Semua riwayat 📜</h2><input data-k="q" placeholder="Cari catatan, kategori, dompet…" autocomplete="off"><div class="row"><select data-k="m"><option value="all">Semua bulan</option>${months.map(m=>`<option value="${m}">${esc(typeof ml==='function'?ml(m):m)}</option>`).join('')}</select><select data-k="ty"><option value="all">Semua jenis</option><option value="expense">Keluar</option><option value="income">Masuk</option><option value="transfer">Pindah</option></select></div><div class="mu" id="hs" style="margin:8px 0"></div><div id="hl"></div>`);
 const list=()=>{const q=K.nz(st.q.trim()),A=TB().filter(t=>(st.ty==='all'||t.type===st.ty)&&(st.m==='all'||TD(t).startsWith(st.m))&&(!q||K.nz((t.note||'')+' '+(t.category||'')+' '+(t.wallet||'')+' '+(t.toWallet||'')).includes(q))).sort((a,b)=>TD(b).localeCompare(TD(a))||b.id-a.id),
  inn=A.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0),out=A.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  e.querySelector('#hs').innerHTML=`${A.length} catatan · Masuk <b class="n">${rp(inn)}</b> · Keluar <b class="o">${rp(out)}</b>`;
  e.querySelector('#hl').innerHTML=A.length?A.slice(0,lim).map(txItem).join('')+(A.length>lim?'<button class="gh" data-k="more">Tampilkan lebih banyak</button>':''):'<p class="mu">Tidak ada catatan yang cocok.</p>'};
 e.oninput=ev=>{if(ev.target.dataset.k==='q'){st.q=ev.target.value;lim=60;list()}};
 e.onchange=ev=>{const k=ev.target.dataset.k;if(k==='m'||k==='ty'){st[k]=ev.target.value;lim=60;list()}};
 e.onclick=ev=>{if(ev.target===e)return e.remove();if(ev.target.dataset.k==='more'){lim+=60;list()}};list()}
function menu(){const e=sheet(`<h2>Mau ngapain? ✨</h2><div class="grid"><button class="tl" data-s="stmt">${ib("🏦")}Rekening koran</button><button class="tl" data-s="add">${ib("⚡")}Catat cepat</button><button class="tl" data-s="split">${ib("🍻")}Split bill</button><button class="tl" data-s="xfer">${ib("🔁")}Pindah saldo</button></div><button class="gh" data-s="paste">📋 Tempel teks mutasi</button>`);e.onclick=ev=>{if(ev.target===e)e.remove()}}
function pick(kind){if(kind!=='stmt')return;const i=document.createElement('input');i.type='file';i.accept='.pdf,.csv,.txt';i.onchange=async()=>{const f=i.files[0];i.onchange=null;if(!f)return;const run=VX()?VFX.exclusive:(fn=>fn().then(v=>({value:v})));const res=await run(async()=>{try{const t=await readFile(f);if(!String(t).trim()){busy();return toast('Tidak ada teks terbaca. Periksa file yang dipilih.')}busy('Menganalisis mutasi… 🧮');const out=await parseStmtA(t,()=>busy('Menganalisis mutasi… 🧮'));busy('Memasukkan data… 💾');await new Promise(r=>setTimeout(r,0));busy();reviewStmt(out,f.name)}catch(er){busy();toast(er.message||'Gagal membaca berkas.')}});if(res&&res.busy)toast('Masih memproses berkas sebelumnya…')};i.click()}
function paste(){const e=sheet(`<h2>Tempel teks mutasi 📋</h2><div class="mu">Salin teks dari m-BCA / SeaBank / e-statement lalu tempel.</div><textarea id="pt" rows="8" style="width:100%;background:var(--cd2);border:0;border-radius:14px;color:var(--tx);padding:12px;margin-top:8px"></textarea><button class="pb" id="pg">Baca & kategorikan</button>`);e.querySelector('#pg').onclick=async()=>{const t=e.querySelector('#pt').value;if(!t.trim())return toast('Tempel teksnya dulu.');e.remove();busy('Menganalisis data… 🧮');try{const p=await parseStmtA(t,()=>busy('Menganalisis data… 🧮'));busy();reviewStmt(p,'Teks tempelan')}catch(er){busy();toast(er.message||'Gagal membaca teks.')}};e.onclick=ev=>{if(ev.target===e)e.remove()}}
R.addEventListener('click',ev=>{const b=ev.target.closest('[data-s]');if(!b)return;const a=b.dataset.s,i=b.dataset.i,cl=()=>document.querySelectorAll('#SM .sh').forEach(x=>x.remove());
 if(a==='split'){cl();splitSheet()}else if(a==='padd'){pocketSheet()}else if(a==='hist'){histSheet()}else if(a==='wnew'){walletSheet()}else if(a==='wedit'){walletSheet(+i)}else if(a==='xfer'){cl();xferSheet()}else if(a==='mon'){const nx=mshift(smon,+i);if(nx<=iso().slice(0,7)){smon=nx;render()}}else if(a==='swmode'){const nm=PW()?'pria':'wanita';if(typeof A!=='undefined'&&A.setmode)A.setmode(nm);else{S.settings.mode=nm;save()}}else if(a==='pfill'){const p=(U.pockets||[]).find(x=>x.id==i);if(p)fillSheet(p)}else if(a==='bud'){budSheet()}else if(a==='ratio'){ratioSheet()}else if(a==='uname'){nameSheet()}else if(a==='theme'){cl();themeSheet()}});
R.addEventListener('click',async ev=>{const b=ev.target.closest('[data-s]');if(!b)return;const s=b.dataset.s,i=b.dataset.i;
 const cl=()=>document.querySelectorAll('#SM .sh').forEach(x=>x.remove());
 if(s==='tab'){tab=i;render();R.scrollTop=0}else if(s==='menu')menu();else if(s==='stmt'){cl();pick('stmt')}else if(s==='add'){cl();txSheet(null)}else if(s==='paste'){cl();paste()}
 else if(s==='detail'){U.ui='detail';save()}
 else if(s==='del'){const f=(U.stmts||[]).find(x=>x.id==i);if(!f)return;const n=S.transactions.filter(t=>t.src==f.id).length;
  const c=await ask('Hapus berkas ini?',`${f.name}\n${n} transaksi dari berkas ini sudah tercatat.`,n?['Hapus berkas saja (transaksi tetap)','Hapus berkas + transaksinya','Batal']:['Hapus berkas','Batal']);
  if(n&&c===1)S.transactions=S.transactions.filter(t=>t.src!=f.id);if(c===0||(n&&c===1)){U.stmts=U.stmts.filter(x=>x.id!=f.id);save();toast(n&&c===1?'Berkas dan transaksinya dihapus':'Berkas dihapus')}}
 else if(s==='tx'){const t=S.transactions.find(x=>x.id==i);if(t)txSheet(t)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const x=[...document.querySelectorAll('#SM .sh')].pop();if(x)x.remove()}});
// mode wiring
const _r=render,prev=window.render;
let _mk;window.render=function(){const k0=S.settings.mode+'|'+S.settings.ui;if(_mk!==undefined&&k0!==_mk){const pt=document.getElementById('PT');if(pt)pt.remove();document.body.style.overflow='';closeSheet();document.querySelectorAll('#SM .sh').forEach(x=>x.remove())}_mk=k0;prev();const on=!!S.settings.mode&&S.settings.ui==='simple';document.body.classList.toggle('sm',on);document.body.classList.toggle('smw',on&&PW());if(on)_r()};
const _m=V.more;V.more=()=>{let h=_m();if(S.settings.mode==='wanita')return h;return h+`<section class="c"><h3>Gaya tampilan Pria</h3><small style="margin-bottom:10px">Detail = tampilan lengkap saat ini. Simpel = ringkas, ada impor rekening koran.</small><div class="chips"><button class="chip on" aria-pressed="true">Detail</button><button class="chip" id="gosimple">Simpel ✨</button></div></section>`};
document.addEventListener('click',e=>{if(e.target.closest('#gosimple,[data-gs]')){seedCats();S.settings.ui='simple';tab='home';save()}});
const _vh=V.home;V.home=()=>(S.settings.mode==='wanita'?'':`<section class="c" style="border-color:var(--ac)"><h3>✨ Mode Simpel</h3><small style="margin-bottom:10px">Tampilan ringkas ala Gen Z: mutasi bank/e-wallet, target tabungan, split bill, streak & lencana.</small><button class="b p" data-gs="1" style="width:100%">Coba Mode Simpel</button></section>`)+_vh();
A.gs=()=>{seedCats();S.settings.ui='simple';tab='home';save()};
/* ===== VFSMX: fitur Mode Simpel yang bisa dipakai langsung dari Mode Detail (Pria & Wanita) ===== */
const cl0=()=>document.querySelectorAll('#SM .sh').forEach(x=>x.remove());
const jajanInfo=()=>{const ym=iso().slice(0,7),mo=TB().filter(t=>TD(t).startsWith(ym)),outJ=mo.filter(t=>t.type==='expense'&&t.category!==SAV).reduce((s,t)=>s+t.amount,0),lim=U.sbud||0,p=lim?outJ/lim:0;return{outJ,lim,p,m:mood(p),sk:streak()}};
const bar2=(pc,col)=>`<div class="hm" style="height:10px"><i style="flex:${Math.max(pc,1)};background:${col}"></i><i style="flex:${Math.max(100-pc,.001)};background:var(--ln)"></i></div>`;
const hJajan=()=>{const j=jajanInfo(),pc=Math.min(100,Math.round(j.p*100));
 return `<section class="c"><h3><span>${j.lim?j.m[0]:'🐣'} Batas jajan bulanan</span><span class="chip">🔥 ${j.sk} hari</span></h3>${j.lim?`<b>${esc(j.m[1])}</b><small style="margin:4px 0 8px">${rp(j.outJ)} dari ${rp(j.lim)} · sisa ${rp(Math.max(0,j.lim-j.outJ))}</small>${bar2(pc,j.m[2])}`:`<small style="margin-bottom:8px">Atur batas jajan, nanti ada bar & maskot yang mengingatkan. Pengeluaran kategori “${esc(SAV)}” tidak dihitung sebagai jajan.</small>`}<div class="row" style="margin-top:10px"><button class="b p" data-a="smjajanset">${j.lim?'Ubah batas':'Atur batas jajan'}</button></div><small style="margin-top:10px">Streak = jumlah hari berturut-turut kamu mencatat transaksi.</small></section>`};
const hKantong=()=>{const P=U.pockets||[];
 return `<section class="c"><h3><span>🎯 Kantong & Wishlist</span><button class="b s p" data-a="smkantongadd">+ Kantong</button></h3><small>Nabung buat hal yang kamu mau banget: “Dana Konser”, “Ganti HP”, “Healing Bali”…</small></section>`+
 (P.length?P.map(p=>{const c=pocketCalc(p);return `<button class="c smx-pk" data-a="smkantongfill" data-i="${p.id}"><div class="smx-r"><span class="smx-e">${esc(p.emoji)}</span><div><b>${esc(p.name)}</b><small>${rp(p.saved)} / ${rp(p.target)} · ${c.pct}%</small></div></div>${bar2(c.pct,'var(--in)')}${p.saved>=p.target?'<small class="in">🏆 Target tercapai!</small>':`<small>${c.weeks?(c.late?'⚠ Lewat tenggat. ':'')+`Butuh ${rp(c.perWeek)}/minggu (${rp(c.perMonth)}/bulan) · ${c.weeks} minggu lagi`:'Tanpa tenggat'}</small><small style="margin-top:4px">💡 Kurangi ngopi 2×/minggu (±${rp(c.coffee)}) → tercapai ${dur(c.faster)} lebih cepat!</small>`}</button>`}).join(''):`<section class="c"><small>Belum ada kantong. Buat satu dengan tombol “+ Kantong”.</small></section>`)};
const hLencana=()=>{const T=TB(),mm=smon,M=T.filter(t=>TD(t).startsWith(mm)),mi=M.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0),mx=M.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0),c={};
 M.filter(t=>t.type==='expense').forEach(t=>c[t.category]=(c[t.category]||0)+t.amount);
 const e=Object.entries(c).sort((a,b)=>b[1]-a[1]),cf=M.filter(t=>t.type==='expense'&&(COF.test(t.note||'')||/kopi/i.test(t.category))),cfs=cf.reduce((s,t)=>s+t.amount,0),spots=new Set(cf.map(t=>K.nz(t.note||'').replace(/\d|rp|\./g,'').trim())).size,fo=['Gengsi/FOMO','Impulsive Buying','Self-Reward/Healing','PayLater Billing'].reduce((s,k)=>s+(c[k]||0),0),net=mi-mx,isNow=mm===iso().slice(0,7);
 return `<section class="c hero"><small>Cerita bulanan · ${esc(ml(mm))}</small><h2 class="${net<0?'out':'in'}">${net<0?'-':''}${rp(net)}</h2><p>Selisih masuk − keluar · Masuk ${rp(mi)} · Keluar ${rp(mx)}</p><div class="row" style="margin-top:10px"><button class="b" data-a="smmon" data-i="-1">‹ Bulan lalu</button><button class="b" data-a="smmon" data-i="1"${isNow?' disabled':''}>Bulan depan ›</button></div></section>
 <section class="c"><h3>Kalkulator FOMO 🎭</h3><b style="font-size:15px;line-height:1.35;display:block">${cfs?`Habis ${rp(cfs)} buat ngopi${spots>1?` di ${spots} tempat berbeda`:''} (${cf.length}×).`:'Belum ada pengeluaran ngopi bulan ini 👏'}</b><small style="margin-top:6px">${fo?`Plus ${rp(fo)} buat kategori healing/FOMO/impulsif/PayLater (${mx?Math.round(fo/mx*100):0}% dari pengeluaran).`:'Kategori impulsif (Gengsi/FOMO, Impulsive Buying, Self-Reward, PayLater) masih kosong. Catat pakai kategori itu dan hasilnya muncul di sini.'}</small></section>
 <section class="c"><h3>Lencana</h3><div class="smx-bd">${badges().map(b=>`<div class="${b[2]?'':'lk'}"><i>${b[0]}</i>${esc(b[1])}</div>`).join('')}</div></section>
 <button class="c smx-roast" data-roast="1"><span class="smx-e">🔥</span><span><b>Roast My Spending</b><small>Wrapped bulananmu, siap di-screenshot</small></span></button>
 <section class="c"><h3>Per kategori</h3>${e.length?e.map(([k,v])=>`<div style="margin-bottom:10px"><div class="smx-r2"><b>${esc(K.catEmoji(k))} ${esc(k)}</b><span>${rp(v)}</span></div>${bar2(mx?Math.round(v/mx*100):0,'var(--ac)')}<small>${mx?Math.round(v/mx*100):0}% dari pengeluaran</small></div>`).join(''):'<small>Belum ada pengeluaran di bulan ini.</small>'}</section>`};
const hBerkas=()=>{const st=U.stmts||[];
 return `<section class="c"><h3>📄 Berkas mutasi diunggah</h3><small style="margin-bottom:10px">Mutasi yang sudah dibaca & dikategorikan muncul di sini. Berkas bisa dihapus, dengan atau tanpa transaksinya.</small><div class="row"><button class="b p" data-a="smstmt">Rekening koran</button><button class="b" data-a="smpaste">Tempel teks</button></div></section>`+
 (st.length?st.map(s=>`<section class="c smx-r2"><div><b>${esc(s.name)}</b><small>${esc(s.bank)} · ${s.count} transaksi · ${esc(s.at)}</small></div><button class="b s d" data-a="smdelfile" data-i="${s.id}">🗑 Hapus</button></section>`).join(''):'<section class="c"><small>Belum ada berkas. Impor rekening koran atau tempel teks mutasi dulu.</small></section>')};
window.VFSMX={
 stmt(){cl0();pick('stmt')},paste(){cl0();paste()},quick(){cl0();txSheet(null)},split(){cl0();splitSheet()},xfer(){cl0();xferSheet()},
 kantongAdd(){pocketSheet()},kantongFill(i){const p=(U.pockets||[]).find(x=>x.id==i);if(p)fillSheet(p)},jajan(){budSheet()},
 mon(i){const nx=mshift(smon,+i);if(nx<=iso().slice(0,7))smon=nx},
 async delFile(i){const f=(U.stmts||[]).find(x=>x.id==i);if(!f)return;const n=S.transactions.filter(t=>t.src==f.id).length;
  const c=await ask('Hapus berkas ini?',`${f.name}\n${n} transaksi dari berkas ini sudah tercatat.`,n?['Hapus berkas saja (transaksi tetap)','Hapus berkas + transaksinya','Batal']:['Hapus berkas','Batal']);
  if(n&&c===1)S.transactions=S.transactions.filter(t=>t.src!=f.id);
  if(c===0||(n&&c===1)){U.stmts=U.stmts.filter(x=>x.id!=f.id);save();toast(n&&c===1?'Berkas dan transaksinya dihapus':'Berkas dihapus')}},
 html:{jajan:hJajan,kantong:hKantong,lencana:hLencana,berkas:hBerkas}};
window.VFS={ocrFix,reviewStmt,parseStmt,quick,splitCalc,splitText,pocketCalc,streak,seedCats};
applyTheme();window.render();
})();
