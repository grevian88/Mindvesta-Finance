
/* Mindvesta Finance — kartu "Developer" di Pengaturan (Pria, Wanita, Simpel). Teks statis, tidak diterjemahkan (data-no-i18n). */
(function(){
 'use strict';
 var DEVS=[
  {id:'01',name:'Aisyah Putri Salsabila',role:'Product vision · Design · Development'},
  {id:'02',name:'Shakeel Grevian',role:'Product development · Engineering'}
 ];
 function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
 window.MVDEV=function(){
  return '<section class="mvdev-sec" data-no-i18n="1" aria-label="Developer Mindvesta Finance">'
   +'<h3 class="mvdev-t">Developer Mindvesta Finance</h3>'
   +DEVS.map(function(d,i){
     return '<div class="mvdev-card"><span class="mvdev-id">DEVELOPER ID · '+d.id+'</span>'
      +'<b class="mvdev-n">'+(i+1)+'. Developer : '+esc(d.name)+'</b>'
      +'<span class="mvdev-r">'+esc(d.role)+'</span></div>';
    }).join('')
   +'</section>';
 };
 // Pengaturan Mode Pria/Detail dan "Pengaturan Lengkap" Mode Wanita
 if(typeof V!=='undefined'&&V&&typeof V.more==='function'&&!V.more.__mvdev){
  var old=V.more;
  var wrapped=function(){return old.apply(this,arguments)+window.MVDEV()};
  wrapped.__mvdev=true;wrapped.__vfp10=old.__vfp10;wrapped.__vfrac=old.__vfrac;
  V.more=wrapped;
 }
})();
