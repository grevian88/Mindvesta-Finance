
(function(){
'use strict';
const $=(q,r=document)=>r.querySelector(q);
function eyeToggle(card,title){
 if(!card||card.dataset.vfp12Ready)return; card.dataset.vfp12Ready='1';
 const head=card.querySelector('.hdr')||card.firstElementChild;
 const body=card.querySelector('.body')||card.children[1];
 if(!body)return;
 const btn=document.createElement('button');btn.type='button';btn.className='vfp12-toggle';
 btn.innerHTML='<span>'+title+'</span><span class="vfp12-eye" aria-hidden="true">🙈</span>';
 btn.setAttribute('aria-expanded','false');body.classList.add('vfp12-panel');body.hidden=true;
 btn.addEventListener('click',()=>{body.hidden=!body.hidden;btn.setAttribute('aria-expanded',String(!body.hidden));btn.querySelector('.vfp12-eye').textContent=body.hidden?'🙈':'👁️';});
 if(head&&head.parentNode===card)head.replaceWith(btn);else card.insertBefore(btn,body);
}
function placeInvoice(){
 const card=$('#impCard');if(!card)return;
 const wrap=card.closest('.w');if(wrap&&card.parentNode===wrap&&wrap.lastElementChild!==card)wrap.appendChild(card);
 eyeToggle(card,'📥 Impor invoice yang sudah ada');
}
function setupRate(){
 const root=$('#vfrac');if(!root||$('#vfp12-rate-import',root))return;
 const form=$('.rcform',root);if(!form)return;
 const card=document.createElement('section');card.id='vfp12-rate-import';card.className='vfp12-rate-import';
 card.innerHTML='<button type="button" class="vfp12-toggle" aria-expanded="false"><span>📥 Impor Rate card yang sudah ada</span><span class="vfp12-eye" aria-hidden="true">🙈</span></button><div class="vfp12-panel" hidden><p>Upload rate card PDF, JPG, atau PNG. Teks dan daftar layanan akan dibaca untuk membantu mengisi data rate card. Periksa hasil sebelum menerapkan.</p><div class="vfp12-actions"><label>📂 Pilih file<input id="vfp12-rate-file" type="file" accept="application/pdf,.pdf,image/jpeg,image/png" hidden></label><label>📷 Foto<input id="vfp12-rate-camera" type="file" accept="image/*" capture="environment" hidden></label><button type="button" id="vfp12-rate-clear">Hapus file & hasil</button></div><textarea id="vfp12-rate-text" placeholder="Hasil pembacaan dokumen akan muncul di sini untuk diperiksa…"></textarea><div class="vfp12-actions"><button type="button" id="vfp12-rate-apply">Gunakan data terbaca</button></div><div class="vfp12-status" id="vfp12-rate-status">File diproses sementara di perangkat. Hasil tidak disimpan sebagai berkas unggahan.</div></div>';
 form.appendChild(card);
 const toggle=$('.vfp12-toggle',card),panel=$('.vfp12-panel',card);
 toggle.addEventListener('click',()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));$('.vfp12-eye',toggle).textContent=panel.hidden?'🙈':'👁️';});
 const text=$('#vfp12-rate-text'),status=$('#vfp12-rate-status');
 async function loadFile(f){
  if(!f)return; text.value='';status.textContent='Membaca '+f.name+'…';
  try{
   let out='';
   if(f.type==='application/pdf'||/\.pdf$/i.test(f.name)){
    if(!window.pdfjsLib)await new Promise((ok,no)=>{const x=document.createElement('script');x.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';x.onload=ok;x.onerror=no;document.head.appendChild(x)});
    const pdf=await window.pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;
    for(let n=1;n<=pdf.numPages;n++){const page=await pdf.getPage(n),c=await page.getTextContent();out+=c.items.map(x=>x.str).join(' ')+'\n';}
    if(!out.trim())throw Error('PDF tidak memiliki teks digital. Simpan sebagai gambar atau gunakan OCR pada foto/scan.');
   }else{
    if(!window.Tesseract)await new Promise((ok,no)=>{const x=document.createElement('script');x.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';x.onload=ok;x.onerror=no;document.head.appendChild(x)});
    const r=await window.Tesseract.recognize(f,'ind+eng');out=r.data.text||'';
   }
   text.value=out.trim();status.textContent='Pembacaan selesai. Periksa nama layanan dan harga sebelum menerapkan.';
  }catch(e){status.textContent='Gagal membaca file: '+(e.message||e);}
  finally{const a=$('#vfp12-rate-file'),b=$('#vfp12-rate-camera');if(a)a.value='';if(b)b.value='';}
 }
 $('#vfp12-rate-file').addEventListener('change',e=>loadFile(e.target.files[0]));
 $('#vfp12-rate-camera').addEventListener('change',e=>loadFile(e.target.files[0]));
 $('#vfp12-rate-clear').addEventListener('click',()=>{text.value='';status.textContent='File dan hasil pembacaan dihapus dari form sementara.';});
 $('#vfp12-rate-apply').addEventListener('click',()=>{
  const lines=text.value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const parsed=[];
  for(const line of lines){
   const m=line.match(/^(.{2,}?)\s+(?:Rp\s*)?([\d.,]+)\s*$/i);
   if(!m)continue;
   const n=Number(m[2].replace(/\\./g,'').replace(/,(?=\\d{1,2}$)/,'.').replace(/,/g,''));
   if(Number.isFinite(n)&&n>=0)parsed.push({name:m[1].replace(/[•|–—-]+$/,'').trim(),price:n});
  }
  if(!parsed.length){status.textContent='Belum menemukan baris layanan dengan format nama layanan diikuti harga. Edit teks hasil baca agar tiap layanan dan harga berada pada satu baris.';return;}
  // Transfer values into the existing service editor through its visible controls.
  const list=$('#rSvcList',root);
  if(!list){status.textContent='Editor layanan belum tersedia. Buka tab layanan lalu coba lagi.';return;}
  let rows=[...list.children];
  while(rows.length<parsed.length){const add=[...root.querySelectorAll('button')].find(b=>/tambah layanan|tambah jasa|add service/i.test(b.textContent));if(!add)break;add.click();rows=[...list.children];}
  rows.slice(0,parsed.length).forEach((row,i)=>{
   const fields=[...row.querySelectorAll('input,textarea')];
   const name=fields.find(x=>/nama|layanan/i.test(x.placeholder||x.getAttribute('aria-label')||''));
   const price=fields.find(x=>/harga|price/i.test(x.placeholder||x.getAttribute('aria-label')||''));
   if(name){name.value=parsed[i].name;name.dispatchEvent(new Event('input',{bubbles:true}));name.dispatchEvent(new Event('change',{bubbles:true}));}
   if(price){price.value=String(parsed[i].price);price.dispatchEvent(new Event('input',{bubbles:true}));price.dispatchEvent(new Event('change',{bubbles:true}));}
  });
  status.textContent=parsed.length+' layanan terdeteksi. Periksa kembali field yang terisi; simpan rate card jika sudah benar.';
 });
}
function run(){placeInvoice();setupRate();}
const mo=new MutationObserver(run);mo.observe(document.documentElement,{childList:true,subtree:true});run();
window.addEventListener('beforeunload',()=>{const a=$('#fimp'),b=$('#fcam'),c=$('#vfp12-rate-file'),d=$('#vfp12-rate-camera');[a,b,c,d].forEach(x=>{if(x)x.value=''});const t=$('#vfp12-rate-text');if(t)t.value='';});
})();
