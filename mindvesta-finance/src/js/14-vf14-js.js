
(function(){
'use strict';
if(window.__vf14)return;window.__vf14=1;
var isW=function(){try{return S.settings.mode==='wanita'}catch(e){return false}};
var sIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
var searchBar=function(){return '<button type="button" class="vfx-sb" data-vfs-open="1" aria-label="Cari fitur">'+sIcon+'<span>Cari fitur… (mis. “transaksi”, “anggaran”, “utang”)</span><kbd>Ctrl K</kbd></button>'};
var TL=[
['smstmt','🏦','Rekening koran','PDF/CSV/gambar'],
 ['smquick','⚡','Catat cepat','“kopi 18rb”'],['smsplit','🍻','Split bill','Patungan'],['smkantong','🎯','Kantong','Target & wishlist'],
 ['smpaste','📋','Tempel mutasi','Dari m-banking'],['smxfer','🔁','Pindah saldo','Antar dompet'],['smjajan','💸','Batas jajan','Maskot & streak'],
 ['smlencana','🏅','Lencana','FOMO & cerita'],['smroast','🔥','Roast','Wrapped bulanan'],['smberkas','📄','Berkas mutasi','Kelola impor']];
var tiles=function(l){return '<div class="vfx-g">'+l.map(function(t){return '<button type="button" class="vfx-t" data-a="'+t[0]+'"><i>'+t[1]+'</i>'+t[2]+'<small>'+t[3]+'</small></button>'}).join('')+'</div>'};
var toSimple='<button type="button" class="b p" data-gs="1" style="width:100%;margin-top:10px">Pindah ke Mode Simpel (tampilan ringkas)</button>';

/* ---- halaman (dipakai Pria lewat tab Pengaturan & Wanita lewat halaman X) ---- */
var H=window.VFSMX&&VFSMX.html;
SV.smhub=function(){return bk('Fitur Mode Simpel')+'<section class="c"><h3>✨ Fitur Mode Simpel</h3><small style="margin-bottom:10px">Semua fitur Mode Simpel bisa dipakai langsung di tampilan Detail.</small>'+tiles(TL)+toSimple+'</section>'};
SV.smkantong=function(){return bk('Kantong & Wishlist')+H.kantong()};
SV.smjajan=function(){return bk('Batas jajan & streak')+H.jajan()};
SV.smlencana=function(){return bk('Lencana & cerita bulanan')+H.lencana()};
SV.smberkas=function(){return bk('Berkas mutasi')+H.berkas()};
Object.assign(XT,{smhub:'Fitur Mode Simpel',smkantong:'Kantong & Wishlist',smjajan:'Batas jajan & streak',smlencana:'Lencana & cerita',smberkas:'Berkas mutasi'});

/* ---- aksi ---- */
var go=function(k){if(isW()){fsub='x:'+k;render();scrollTo(0,0)}else{tab='more';sub=k;render();scrollTo(0,0)}};
['smhub','smkantong','smjajan','smlencana','smberkas'].forEach(function(k){A[k]=function(){go(k)}});
A.vflang=function(){if(window.VFC)VFC.open()};
A.fsrch=function(){if(window.VFSearch)VFSearch.open()};
A.fireopen=function(){try{FIRETracker.open()}catch(e){console.warn('fire',e)}};
A.smgo=function(k){try{if(document.body.classList.contains('sm')){S.settings.ui='detail';save()}}catch(e){}go(k)};
Object.assign(A,{
 smstmt:function(){VFSMX.stmt()},smpaste:function(){VFSMX.paste()},
 smquick:function(){VFSMX.quick()},smsplit:function(){VFSMX.split()},smxfer:function(){VFSMX.xfer()},
 smkantongadd:function(){VFSMX.kantongAdd()},smkantongfill:function(i){VFSMX.kantongFill(i)},smjajanset:function(){VFSMX.jajan()},
 smmon:function(i){VFSMX.mon(i);render()},smdelfile:function(i){VFSMX.delFile(i)},
 smroast:function(){if(window.VFR&&VFR.ropen)VFR.ropen()}
});

/* ---- Pria: Beranda (tombol cari + kartu fitur Simpel) & Pengaturan ---- */
var smxo=0,smxT=0;
var smxIdle=function(){clearTimeout(smxT);smxT=0;if(!smxo)return;smxT=setTimeout(function(){smxT=0;if(!smxo)return;smxo=0;if(!isW()&&document.getElementById('v')&&tab==='home'&&!sub)render()},30000)};
document.addEventListener('pointerdown',function(e){if(smxo&&e.target.closest&&e.target.closest('.smx-c'))smxIdle()},true);
A.smtog=function(){smxo=smxo?0:1;smxIdle();render()};A.smclose=function(){smxo=0;smxIdle();render()};
var MAS='<svg class="smx-mas" viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="59" rx="15" ry="3" fill="#0003"/><circle cx="32" cy="33" r="24" fill="#ffd45e" stroke="#c98a14" stroke-width="3"/><circle cx="32" cy="33" r="17" fill="none" stroke="#f3b22d" stroke-width="2" stroke-dasharray="3 4"/><circle cx="24" cy="31" r="3.2" fill="#3b2a10"/><circle cx="40" cy="31" r="3.2" fill="#3b2a10"/><circle cx="25" cy="30" r="1" fill="#fff"/><circle cx="41" cy="30" r="1" fill="#fff"/><path d="M26 39q6 6 12 0" stroke="#3b2a10" stroke-width="2.6" fill="none" stroke-linecap="round"/><ellipse cx="19" cy="38" rx="4" ry="2.5" fill="#ff9db5"/><ellipse cx="45" cy="38" rx="4" ry="2.5" fill="#ff9db5"/><path d="M32 9c0-5 5-8 10-6-1 5-5 8-10 6z" fill="#5fcf80" stroke="#2f8f4e" stroke-width="2"/></svg>';
var mkBtn=function(){return '<button type="button" class="smx-c smx-h" data-a="smtog" aria-expanded="'+(smxo?'true':'false')+'" aria-label="Fitur Mode Simpel"><span class="sx-sp"><i>✨</i><u>✦</u><em>✧</em></span><span class="sx-tx">Mode Simpel</span><span class="sx-ch">'+(smxo?'▴':'▾')+'</span></button>'};
var mkCard=function(){
 if(!smxo)return '';
 return '<section class="smx-c smx-p"><div class="smx-top">'+MAS+'<div class="smx-tx"><b>✨ Mode Simpel</b><small>Mutasi bank, split bill, target tabungan &amp; lainnya, langsung di tampilan Detail.</small></div><button type="button" class="smx-x" data-a="smclose" aria-label="Tutup">✕</button></div>'+tiles(TL)+'<button type="button" class="smx-go" data-gs="1"><span>🚀</span><span><b>Pindah ke Mode Simpel</b><small>(tampilan ringkas)</small></span><span class="smx-chev">›</span></button><div class="smx-ft">Tertutup otomatis jika 30 detik tidak dipakai</div></section>'};
var _vh=V.home;
V.home=function(){var h=_vh();if(isW())return h;
 var card=mkCard();
 var key='<section class="c" style="border-color:var(--ac)"><h3>✨ Mode Simpel</h3>',i=h.indexOf(key);
 if(i>-1){var j=h.indexOf('</section>',i);h=h.slice(0,i)+card+h.slice(j+10)}else h=card+h;
 var diary=bookBar();if(diary&&h.indexOf(diary)===0)h=h.slice(diary.length);return diary+'<div class="fx-row"><button type="button" class="fx-fire" data-a="fireopen" aria-label="Buka F.I.R.E Tracker"><span class="fx-fl">🔥</span><span class="fx-ft">F.I.R.E Tracker</span></button>'+mkBtn()+searchBar()+'</div>'+h};
var _vm=V.more;
V.more=function(){var h=_vm();if(isW())return h;return '<section class="c" style="border-color:var(--ac)"><h3>✨ Fitur Mode Simpel</h3><small style="margin-bottom:10px">Dipakai langsung tanpa pindah mode.</small>'+tiles(TL)+'</section>'+h};

/* ---- Wanita: Buku (tombol cari), jalan pintas, & grup di halaman Fitur ---- */
var _fHome=fHome;
fHome=function(){return _fHome()};
var fqx=0;A.fqtog=function(){fqx=fqx?0:1;render()};
fQS=function(){var L=[['fx:kal','cal','Kalender'],['bul','pie','Anggaran'],['smsplit','cheers','Split bill'],['smquick','bolt','Catat cepat'],['fx:diag','pie','Diagram'],['fx:langg','mail','Langganan'],['fx:jad','bolt','Terjadwal'],['fx:wlt','bank','Utang & Aset'],['fx:trx','book','Foto & CSV'],['smkantong','heart','Kantong'],['fgo:fitur','grid','Semua fitur']];
 return '<div class="fqh"><span>Pintasan</span><button type="button" class="fqt" data-a="fqtog" aria-expanded="'+(fqx?'true':'false')+'">'+(fqx?'Ciutkan ▲':'Perluas ▼')+'</button></div><div class="fqs'+(fqx?'':' fqc')+'">'+L.map(function(x){var p=x[0].split(':');return '<button data-a="'+(p[0]==='fx'||p[0]==='fgo'?p[0]:x[0])+'" data-i="'+(p[1]||'')+'">'+ik(x[1],26)+'<span>'+x[2]+'</span></button>'}).join('')+'</div>'};
if(!FT.__vf14){FT.__vf14=1;FT.splice(FT.length-1,0,['Dari Mode Simpel ✨',[

 ['smstmt','bank','Rekening Koran','Impor mutasi PDF, CSV, gambar','rekening koran mutasi impor pdf csv bank ewallet statement'],


 ['smpaste','book','Tempel Teks Mutasi','Salin dari m-banking lalu tempel','tempel paste teks mutasi m-banking e-statement'],
 ['smquick','bolt','Catat Cepat','Ketik “kopi 18rb” langsung tercatat','catat cepat ketik kalimat kopi natural'],
 ['smsplit','cheers','Split Bill','Patungan & kirim ke WhatsApp','split bill patungan bagi tagihan makan bareng whatsapp'],
 ['smxfer','cash','Pindah Saldo','Pindahkan uang antar dompet','pindah saldo transfer antar dompet'],
 ['smkantong','heart','Kantong & Wishlist','Target tabungan dengan tenggat','kantong pocket wishlist target tabungan tenggat impian'],
 ['smjajan','coffee','Batas Jajan & Streak','Bar jajan bulanan + maskot','batas jajan bulanan streak maskot hemat'],
 ['smlencana','gift','Lencana & Cerita','Kalkulator FOMO + lencana','lencana badge fomo cerita bulanan kopi impulsif'],
 ['smroast','cherry','Roast My Spending','Wrapped bulananmu, siap dibagikan','roast wrapped bagikan gambar share'],
 ['smberkas','card','Berkas Mutasi','Kelola & hapus berkas impor','berkas mutasi unggah hapus impor']]])}

/* ---- tombol cari (delegasi, satu listener) ---- */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-vfs-open]');if(b){e.preventDefault();if(window.VFSearch)VFSearch.open()}});

/* ---- lapisan sheet Simpel di atas Mode Detail ---- */
var SMEL=document.getElementById('SM');
if(SMEL){var sync=function(){var b=document.body;b.classList.toggle('smx',!b.classList.contains('sm')&&!!SMEL.querySelector(':scope>.sh,:scope>.ld'))};
 new MutationObserver(sync).observe(SMEL,{childList:true})}
try{if(typeof render==='function')render()}catch(e){console.warn('vf14 render',e)}
})();

/* v15: perilaku ketuk / ketuk dua kali pada tombol cari */
(function(){var t=0;document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#vfs-btn');if(!b)return;
 e.stopImmediatePropagation();e.preventDefault();
 if(!document.body.classList.contains('vfo')){document.body.classList.add('vfo');clearTimeout(window.__vfoT);window.__vfoT=setTimeout(function(){document.body.classList.remove('vfo')},30000);return}
 if(t){clearTimeout(t);t=0;document.body.classList.remove('vfo');return}
 t=setTimeout(function(){t=0;if(window.VFSearch)VFSearch.open()},300)},true)})();

