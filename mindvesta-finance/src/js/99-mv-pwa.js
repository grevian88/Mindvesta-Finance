
/* Mindvesta Finance — registrasi service worker (hanya di http/https; di file:// dilewati) */
(function(){
 'use strict';
 if(!('serviceWorker' in navigator)||!/^https?:$/.test(location.protocol))return;
 window.addEventListener('load',function(){
  navigator.serviceWorker.register('sw.js').then(function(reg){
   reg.addEventListener('updatefound',function(){
    var w=reg.installing;if(!w)return;
    w.addEventListener('statechange',function(){
     if(w.state==='installed'&&navigator.serviceWorker.controller)
      console.info('[Mindvesta] Versi baru siap — akan aktif saat aplikasi dibuka ulang.');
    });
   });
  }).catch(function(e){console.warn('[Mindvesta] service worker gagal:',e&&e.message)});
 });
})();
