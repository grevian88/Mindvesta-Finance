
(function(){
 'use strict';
 if(window.__vfp10) return;
 window.__vfp10=true;
 window.addEventListener('online',function(){var e=document.querySelector('.vfp-account-message');if(e){e.classList.add('is-online');e.innerHTML='<b><span class="vfp-msg-dot"></span>Terhubung ke internet</b>Data lokal tetap tersimpan di perangkat. Fitur yang memerlukan layanan online dapat digunakan saat koneksi tersedia.';}});
 window.addEventListener('offline',function(){var e=document.querySelector('.vfp-account-message');if(e){e.classList.remove('is-online');e.innerHTML='<b><span class="vfp-msg-dot"></span>Offline</b>Data lokal tetap dapat digunakan. Fitur yang memerlukan layanan online mungkin tidak tersedia.';}});
 var KEY_SAFE='vitalfinance_data';
 function isObj(v){return !!v && typeof v==='object' && !Array.isArray(v)}
 function cleanNum(v,def){var n=Number(v);return Number.isFinite(n)&&Math.abs(n)<1e15?n:def}
 function sanitizeAll(){
  try{
   if(typeof S==='undefined'||!isObj(S))return;
   ['transactions','assets','activeDebts','goals','subs','sched','bp','gm'].forEach(function(k){
    if(!Array.isArray(S[k]))S[k]=[];
    S[k]=S[k].filter(function(x){return isObj(x)});
   });
   ['ficons','icons','settings','advice','walletOpeningBalances','budgets'].forEach(function(k){if(!isObj(S[k]))S[k]={};});
   if(!isObj(S.advice.fixed))S.advice.fixed={};
   ['catInc','catExp'].forEach(function(k){
    if(!Array.isArray(S[k]))S[k]=[];
    S[k]=S[k].filter(function(x){return typeof x==='string'&&x.trim()&&x.length<60;});
    S[k]=S[k].filter(function(x,i,a){return a.indexOf(x)===i;});
   });
   if(!S.catInc.length)S.catInc=['Gaji','Lainnya - Pemasukan'];
   if(!S.catExp.length)S.catExp=['Makanan','Transportasi','Lainnya'];
   [S.icons,S.ficons].forEach(function(o){Object.keys(o).forEach(function(k){if(typeof o[k]!=='string'||o[k].length>16)delete o[k];});});
   Object.keys(S.walletOpeningBalances).forEach(function(k){S.walletOpeningBalances[k]=cleanNum(S.walletOpeningBalances[k],0);});
   Object.keys(S.budgets).forEach(function(k){var n=cleanNum(S.budgets[k],0);if(n<0)delete S.budgets[k];else S.budgets[k]=n;});
   if(Array.isArray(S.settings.books)){
    S.settings.books=S.settings.books.filter(function(b,i,a){return typeof b==='string'&&b.trim()&&b.length<60&&a.indexOf(b)===i;});
    if(!S.settings.books.length)S.settings.books=['Financial Diary'];
    if(!S.settings.books.includes(S.settings.cb))S.settings.cb=S.settings.books[0];
   }
   S.transactions.forEach(function(t){
    if(!t.id)t.id='vfp-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
    if(t.amount!==undefined){var n=cleanNum(t.amount,NaN);if(Number.isFinite(n))t.amount=n;else t.amount=0;}
    if(!t.isoDate&&t.date){var d=new Date(t.date);if(!isNaN(d))t.isoDate=d.toISOString().slice(0,10);}
   });
  }catch(e){console.warn('[vfp10] sanitize skipped safely',e);}
 }
 sanitizeAll();
 // Preserve synchronous persistence and the app's existing failure notification.
 if(typeof window.save==='function'&&!window.save.__vfp10){
  var originalSave=window.save;
  var wrappedSave=function(){
   try{
    var j=JSON.stringify(S);
    localStorage.setItem(KEY_SAFE,j);
    window.__unsaved=false;
    if(j.length>4.2e6&&!window.__qw){window.__qw=1;try{toast('Penyimpanan hampir penuh. Ekspor cadangan di Pengaturan.')}catch(e){}}
   }catch(e){window.__unsaved=true;try{toast('Penyimpanan gagal. Ekspor cadangan sekarang.')}catch(x){}}
   try{if(typeof window.render==='function')window.render();}catch(e){console.warn('[vfp10] render',e);}
  };
  wrappedSave.__vfp10=true;
  window.save=wrappedSave;
 }
 function addMeta(name,content){if(document.querySelector('meta[name="'+name+'"]'))return;var m=document.createElement('meta');m.name=name;m.content=content;document.head.appendChild(m);}
 addMeta('mobile-web-app-capable','yes');addMeta('apple-mobile-web-app-capable','yes');addMeta('apple-mobile-web-app-status-bar-style','black-translucent');addMeta('apple-mobile-web-app-title','Mindvesta Finance');addMeta('description','Mindvesta Finance — kelola keuangan pribadi dengan mudah.');
 function syncOnline(){document.body.classList.toggle('vfp-offline',!navigator.onLine);}
 window.addEventListener('online',syncOnline);window.addEventListener('offline',syncOnline);syncOnline();
 function syncThemeColor(){try{var m=document.querySelector('meta[name="theme-color"]');if(!m)return;if(document.body.classList.contains('fm'))m.content='#ee6495';else if(document.body.classList.contains('sm'))m.content='#0a0a14';else m.content=document.documentElement.dataset.t==='light'?'#edf2f0':'#0d1412';}catch(e){}}
 if(typeof window.render==='function'&&!window.render.__vfp10){var oldRender=window.render;var newRender=function(){var r=oldRender.apply(this,arguments);syncThemeColor();return r;};newRender.__vfp10=true;window.render=newRender;}
 syncThemeColor();
 try{
  if(typeof V!=='undefined'&&V&&typeof V.more==='function'&&!V.more.__vfp10){var oldMore=V.more;var moreV10=function(){return oldMore.apply(this,arguments)+'<section class="c" style="border-color:var(--ac)"><h3>🔍 Pemeriksaan Integritas Data</h3><small>Periksa struktur transaksi tanpa mengubah data.</small><div class="row"><button class="b p" data-a="vfpCheck">Cek sekarang</button></div></section>';};moreV10.__vfp10=true;V.more=moreV10;}
  if(typeof A!=='undefined'&&A){A.vfpCheck=function(){try{var total=0,issues=[];(S.transactions||[]).forEach(function(t,i){total++;if(!t.id)issues.push('Transaksi #'+(i+1)+' tanpa ID');if(typeof t.amount!=='number'||!Number.isFinite(t.amount))issues.push('Transaksi #'+(i+1)+' nominal tidak valid');if(!t.isoDate)issues.push('Transaksi #'+(i+1)+' tanpa tanggal');if(!t.wallet)issues.push('Transaksi #'+(i+1)+' tanpa dompet');});alert('Total: '+total+' transaksi.\n'+(issues.length?'Temuan: '+issues.length+'\n'+issues.slice(0,10).join('\n'):'✅ Struktur transaksi tampak sehat.'));}catch(e){alert('Pemeriksaan gagal: '+e.message);}};}
 }catch(e){console.warn('[vfp10] integrity tool',e);}
 var skip=document.getElementById('vfp-skip');if(skip)skip.addEventListener('click',function(){var main=document.getElementById('v');if(main){main.tabIndex=-1;main.focus({preventScroll:false});}});
 var lockCount=0,savedY=0;
 window.vfpLock=function(){if(lockCount++===0){savedY=window.scrollY||window.pageYOffset||0;document.body.style.top=(-savedY)+'px';document.body.classList.add('vfp-lock');}};
 window.vfpUnlock=function(){if(lockCount>0&&--lockCount===0){document.body.classList.remove('vfp-lock');document.body.style.top='';window.scrollTo(0,savedY);}};
 console.info('[VFP] v10 refinements loaded');
})();
