
(function(){
'use strict';
var INK='#8a4b63';
var E=function(x,y,r){return '<circle cx="'+x+'" cy="'+y+'" r="'+(r||1.6)+'" fill="'+INK+'" stroke="none"/>'};
var B=function(x,y){return '<ellipse cx="'+x+'" cy="'+y+'" rx="2.7" ry="1.7" fill="#ff8fb0" opacity=".7" stroke="none"/>'};
var M=function(x,y){return '<path d="M'+(x-1.7)+' '+y+'q1.7 1.9 3.4 0" stroke-width="1.6"/>'};
var F=function(cx,cy,g){g=g||6;return E(cx-g/2,cy)+E(cx+g/2,cy)+B(cx-g/2-3.2,cy+3.2)+B(cx+g/2+3.2,cy+3.2)+M(cx,cy+2.6)};
var SP=function(x,y,s){s=s||3;var t=s*.32;return '<path d="M'+x+' '+(y-s)+'L'+(x+t)+' '+(y-t)+'L'+(x+s)+' '+y+'L'+(x+t)+' '+(y+t)+'L'+x+' '+(y+s)+'L'+(x-t)+' '+(y+t)+'L'+(x-s)+' '+y+'L'+(x-t)+' '+(y-t)+'Z" fill="#FFD35C" stroke="none"/>'};
var P={pink:'#FFB8CC',rose:'#F57FA3',cream:'#FFF4E2',peach:'#FFD2B2',lav:'#DCCBFF',mint:'#BFEBD3',sky:'#BFE3FA',butter:'#FFE29A',tan:'#EBC9A6'};
var K={
book:'<path d="M5 11c7-2.5 14-1 19 3v26c-5-4-12-5-19-3z" fill="'+P.cream+'"/><path d="M43 11c-7-2.5-14-1-19 3v26c5-4 12-5 19-3z" fill="'+P.pink+'"/><path d="M24 14v26"/>'+F(14,25,5)+'<path d="M35 31l-3.6-3.6c-2-2 0-4.8 2.4-3.8.8.3 1.2 1 1.2 1s.4-.7 1.2-1c2.4-1 4.4 1.8 2.4 3.8z" fill="'+P.rose+'" stroke="none"/>'+SP(38,16,3),
wallet:'<rect x="6" y="14" width="36" height="26" rx="10" fill="'+P.pink+'"/><path d="M6 24c0-6 4-10 10-10h16c6 0 10 4 10 10z" fill="#FFE3EC"/><circle cx="35" cy="31" r="3.6" fill="'+P.butter+'"/>'+F(20,31,6)+SP(38,10,3),
pie:'<circle cx="24" cy="24" r="12.5" stroke="'+P.pink+'" stroke-width="9" stroke-dasharray="17 61.5"/><circle cx="24" cy="24" r="12.5" stroke="'+P.butter+'" stroke-width="9" stroke-dasharray="17 61.5" stroke-dashoffset="-19.6"/><circle cx="24" cy="24" r="12.5" stroke="'+P.mint+'" stroke-width="9" stroke-dasharray="17 61.5" stroke-dashoffset="-39.2"/><circle cx="24" cy="24" r="12.5" stroke="'+P.sky+'" stroke-width="9" stroke-dasharray="17 61.5" stroke-dashoffset="-58.9"/><circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="8"/>'+E(21,23,1.3)+E(27,23,1.3)+M(24,25.5),
grid:'<rect x="6" y="6" width="16" height="16" rx="6" fill="'+P.pink+'"/><rect x="26" y="6" width="16" height="16" rx="6" fill="'+P.sky+'"/><rect x="6" y="26" width="16" height="16" rx="6" fill="'+P.butter+'"/><rect x="26" y="26" width="16" height="16" rx="6" fill="'+P.mint+'"/>'+E(11.5,13,1.3)+E(16.5,13,1.3)+E(31.5,13,1.3)+E(36.5,13,1.3)+E(11.5,33,1.3)+E(16.5,33,1.3)+E(31.5,33,1.3)+E(36.5,33,1.3)+M(14,15.5)+M(34,15.5)+M(14,35.5)+M(34,35.5),
more:'<circle cx="11" cy="13" r="6" fill="'+P.tan+'"/><circle cx="37" cy="13" r="6" fill="'+P.tan+'"/><circle cx="11" cy="13" r="2.6" fill="'+P.pink+'" stroke="none"/><circle cx="37" cy="13" r="2.6" fill="'+P.pink+'" stroke="none"/><circle cx="24" cy="26" r="16" fill="'+P.tan+'"/><ellipse cx="24" cy="31.5" rx="7" ry="5.2" fill="'+P.cream+'"/><ellipse cx="24" cy="29.5" rx="2.4" ry="1.7" fill="'+INK+'" stroke="none"/>'+E(17,23,1.7)+E(31,23,1.7)+B(13.5,28)+B(34.5,28)+'<path d="M24 31v2M21.5 33.5q2.5 2 5 0" stroke-width="1.5"/>',
gift:'<rect x="8" y="22" width="32" height="18" rx="4" fill="'+P.sky+'"/><rect x="6" y="16" width="36" height="8" rx="4" fill="'+P.pink+'"/><path d="M24 16v24" stroke="#fff" stroke-width="4.5"/><path d="M24 16c-2-8-12-8-10.5-3 1 3.5 6.500 3 10.500 3zM24 16c2-8 12-8 10.500-3-1 3.5-6.500 3-10.500 3z" fill="'+P.rose+'"/>'+E(15,31,1.4)+E(19.500,31,1.4)+B(13,34)+B(21.500,34)+SP(40,10,3),
bus:'<rect x="8" y="8" width="32" height="31" rx="8" fill="'+P.butter+'"/><rect x="12" y="12" width="24" height="12" rx="4" fill="'+P.sky+'"/><circle cx="14.500" cy="32" r="2.600" fill="'+P.pink+'"/><circle cx="33.500" cy="32" r="2.600" fill="'+P.pink+'"/>'+E(19,18,1.4)+E(29,18,1.4)+M(24,19.500)+'<path d="M14 39v4M34 39v4"/>',
beauty:'<rect x="8" y="22" width="14" height="19" rx="5" fill="'+P.pink+'"/><rect x="10" y="9" width="10" height="14" rx="3" fill="'+P.rose+'"/>'+E(13,31,1.3)+E(17,31,1.3)+M(15,34)+'<path d="M32 40V19" stroke-width="7" stroke="'+P.lav+'"/><path d="M32 40V19"/><path d="M28.500 19c0-5 3.500-9 3.500-9s3.500 4 3.500 9z" fill="'+P.peach+'"/>'+SP(38,12,3),
burger:'<path d="M7 22c0-9 7-13 17-13s17 4 17 13z" fill="'+P.peach+'"/><path d="M6 27c3 2 5-2 9 0s6-2 9 0 6-2 9 0 4-1 9 0" stroke="#7CCB93" stroke-width="3.5"/><rect x="8" y="30" width="32" height="4.500" rx="2.200" fill="#D98A6C"/><path d="M8 36h32c0 4-3 6-6 6H14c-3 0-6-2-6-6z" fill="'+P.peach+'"/>'+E(18,18,1.4)+E(30,18,1.4)+M(24,19.500)+B(14,20)+B(34,20),
house:'<path d="M10 22v18h28V22" fill="'+P.cream+'"/><path d="M4 25L24 7l20 18z" fill="'+P.pink+'"/><rect x="19.500" y="28" width="9" height="12" rx="4.500" fill="'+P.butter+'"/><circle cx="26" cy="35" r=".9" fill="'+INK+'" stroke="none"/><circle cx="34" cy="14" r="3" fill="'+P.cream+'"/>'+SP(10,14,3),
phone:'<rect x="12" y="4" width="24" height="40" rx="7" fill="'+P.lav+'"/><rect x="15.500" y="9" width="17" height="26" rx="3.500" fill="#F3EBFF"/>'+F(24,21,5)+'<circle cx="24" cy="39.500" r="1.600" fill="'+INK+'" stroke="none"/>',
tax:'<circle cx="24" cy="24" r="17" fill="'+P.butter+'"/><circle cx="24" cy="24" r="12" stroke-dasharray="2 3" stroke-width="1.5"/><path d="M24 15v18M28 19c-1.500-2-8-2-8 1.800s8 2.400 8 6.200-6.500 4-8 1.800"/>',
cheers:'<path d="M7 8h15l-2 13c-.7 4.500-10.300 4.500-11 0z" fill="'+P.butter+'"/><path d="M26 8h15l-2 13c-.7 4.500-10.300 4.500-11 0z" fill="'+P.pink+'"/><path d="M14.500 25v13M10 41h9M33.500 25v13M29 41h9"/>'+SP(24,6,3.500),
clothes:'<path d="M16 8l-9 8 5 5 4-3v22h16V18l4 3 5-5-9-8c-1 3-4 5-8 5s-7-2-8-5z" fill="'+P.pink+'"/>'+F(24,29,6),
glasses:'<circle cx="14" cy="27" r="9" fill="'+P.pink+'" fill-opacity=".8"/><circle cx="34" cy="27" r="9" fill="'+P.sky+'" fill-opacity=".8"/><path d="M23 26q1-2 2 0M5 25L3 17M43 25l2-8"/>'+SP(24,12,3),
table:'<path d="M13 22v-6h10v6z" fill="'+P.peach+'"/><path d="M18 16c-5-2-5-7-1-9 1.500 3 1.500 6 1 9zM18 16c1-4 5-6 9-4-1 4-5 5-9 4z" fill="#8FD3A4"/><rect x="5" y="22" width="38" height="6" rx="3" fill="'+P.tan+'"/><path d="M11 28l-3 13M37 28l3 13"/>',
medis:'<rect x="6" y="15" width="36" height="25" rx="7" fill="'+P.pink+'"/><path d="M17 15v-4a2 2 0 012-2h10a2 2 0 012 2v4"/><path d="M24 21v13M17.500 27.500h13" stroke="#fff" stroke-width="4.500"/>',
car:'<path d="M5 31l4-10c1-3 3-5 6-5h18c3 0 5 2 6 5l4 10v8H5z" fill="'+P.pink+'"/><path d="M12 22h24l2 7H10z" fill="'+P.sky+'"/><circle cx="13" cy="36" r="3.600" fill="'+P.cream+'"/><circle cx="35" cy="36" r="3.600" fill="'+P.cream+'"/>'+E(19,26,1.3)+E(29,26,1.3)+M(24,27)+SP(40,11,3),
monitor:'<rect x="5" y="8" width="38" height="26" rx="6" fill="'+P.sky+'"/><path d="M17 41h14M24 34v7"/>'+F(24,19,7),
grad:'<path d="M24 9L3 19l21 10 21-10z" fill="#B79CE8"/><path d="M12 25v9c0 3.500 6 6 12 6s12-2.500 12-6v-9" fill="'+P.lav+'"/><path d="M43 20v11" stroke="'+P.rose+'" stroke-width="3"/><circle cx="43" cy="33" r="2.500" fill="'+P.rose+'" stroke="none"/>',
baby:'<circle cx="24" cy="26" r="15" fill="#FFE5D2"/><path d="M19 11c2-4 8-4 10 0-3 1-7 1-10 0z" fill="'+P.pink+'"/>'+F(24,27,7),
travel:'<path d="M5 24c0-10 8-16 19-16s19 6 19 16z" fill="'+P.pink+'"/><path d="M24 24v15"/><path d="M14 24c1-6 4-12 10-16M34 24c-1-6-4-12-10-16" stroke-width="1.500"/><path d="M4 41h40" stroke="'+P.butter+'" stroke-width="5"/>'+SP(40,10,3),
mail:'<rect x="6" y="14" width="36" height="22" rx="11" fill="'+P.sky+'"/><path d="M24 36v7M17 43h14"/><rect x="13" y="20" width="12" height="7" rx="2" fill="'+P.pink+'"/>',
eye:'<path d="M3 24c5-9 13-14 21-14s16 5 21 14c-5 9-13 14-21 14S8 33 3 24z" fill="'+P.sky+'"/><circle cx="24" cy="24" r="9" fill="#9AA9F0"/><circle cx="24" cy="24" r="4" fill="'+INK+'" stroke="none"/><circle cx="21.500" cy="21.500" r="1.800" fill="#fff" stroke="none"/>',
cal:'<rect x="6" y="10" width="36" height="32" rx="8" fill="'+P.cream+'"/><path d="M6 20V18a8 8 0 018-8h20a8 8 0 018 8v2z" fill="'+P.pink+'"/><path d="M15 6v8M33 6v8"/><path d="M14 28h.01M24 28h.01M34 28h.01M14 35h.01M24 35h.01" stroke-width="4"/>',
card:'<rect x="4" y="11" width="40" height="27" rx="8" fill="'+P.lav+'"/><path d="M4 19h40" stroke-width="6" stroke="'+INK+'" stroke-opacity=".75"/><rect x="10" y="28" width="12" height="4" rx="2" fill="#fff" stroke="none"/>'+SP(37,30,3),
cash:'<rect x="4" y="12" width="40" height="25" rx="6" fill="'+P.mint+'"/><circle cx="24" cy="24.500" r="7" fill="#F0FFF6"/>'+E(22,23.500,1.2)+E(26,23.500,1.2)+M(24,25.500)+'<path d="M9 18h.01M39 31h.01" stroke-width="3"/>',
bank:'<path d="M5 18L24 6l19 12z" fill="'+P.lav+'"/><path d="M10 21v16M19 21v16M29 21v16M38 21v16" stroke-width="4.500" stroke="'+P.cream+'"/><path d="M10 21v16M19 21v16M29 21v16M38 21v16" stroke-width="0"/><rect x="5" y="38" width="38" height="5" rx="2.500" fill="'+P.pink+'"/>',
person:'<circle cx="24" cy="16" r="9" fill="#FFE5D2"/><path d="M7 42c0-10 7-15 17-15s17 5 17 15z" fill="'+P.sky+'"/>'+F(24,17,6),
bag:'<path d="M17 10h14l-3 6c8 3 12 9 12 16 0 6-6 9-16 9S8 38 8 32c0-7 4-13 12-16z" fill="'+P.butter+'"/><path d="M24 22v14M28 25c-1.500-2-8-2-8 1.500s8 2 8 5-6.500 3-8 1"/>',
rice:'<path d="M6 24h36c0 10-7 16-18 16S6 34 6 24z" fill="'+P.sky+'"/><path d="M10 24c2-9 7-12 14-12s12 3 14 12z" fill="#fff"/><path d="M33 7L26 20M39 10l-7 12"/>'+E(20,31,1.4)+E(28,31,1.4)+M(24,32.500),
coffee:'<path d="M8 16h25v12c0 7-5 11-12.500 11S8 35 8 28z" fill="'+P.cream+'"/><path d="M33 19h3.500c5 0 5 9 0 9H33"/><path d="M14 5c-2 2.500 2 4.500 0 8M22 5c-2 2.500 2 4.500 0 8"/>'+F(20.500,27,6),
fish:'<path d="M5 24c6-10 19-10 25 0-6 10-19 10-25 0z" fill="'+P.sky+'"/><path d="M30 24l12-9v18z" fill="'+P.pink+'"/>'+E(13,22,1.5)+B(16,27),
icecream:'<path d="M13 22h22L24 43z" fill="'+P.tan+'"/><path d="M18 26l6 10M26 26l-4 8" stroke-width="1.300"/><circle cx="24" cy="15" r="10" fill="'+P.pink+'"/>'+E(20.500,14,1.4)+E(27.500,14,1.4)+M(24,16)+SP(38,9,3),
bread:'<path d="M6 20c0-6 8-11 18-11s18 5 18 11v19H6z" fill="'+P.peach+'"/><path d="M15 19v8M24 19v8M33 19v8"/>'+E(18,32,1.4)+E(30,32,1.4)+M(24,33),
fries:'<path d="M10 19h28l-3 22H13z" fill="'+P.rose+'"/><path d="M15 19V8M21 19V5M28 19V7M34 19V10" stroke="'+P.butter+'" stroke-width="3.500"/>'+E(20,28,1.4)+E(28,28,1.4)+M(24,30),
pizza:'<path d="M4 13c14-5 26-5 40 0L24 43z" fill="'+P.butter+'"/><path d="M4 13c14-5 26-5 40 0" stroke="'+P.peach+'" stroke-width="5"/><circle cx="19" cy="21" r="3" fill="'+P.rose+'"/><circle cx="29" cy="24" r="3" fill="'+P.rose+'"/>'+E(22,31,1.2),
sushi:'<ellipse cx="24" cy="28" rx="16" ry="10" fill="#fff"/><path d="M8 26c2-7 9-10 16-10s14 3 16 10c-5 4-27 4-32 0z" fill="'+P.rose+'"/>'+E(19,26,1.3)+E(29,26,1.3)+M(24,27),
cherry:'<circle cx="14" cy="34" r="8.500" fill="'+P.rose+'"/><circle cx="34" cy="34" r="8.500" fill="'+P.rose+'"/><path d="M14 26c2-9 8-15 16-16M34 26c0-6-2-11-4-16"/><path d="M30 10c4-4 10-3 12 0-4 3-9 3-12 0z" fill="#8FD3A4"/><circle cx="11" cy="32" r="1.800" fill="#fff" stroke="none" opacity=".8"/>',
bolt:'<path d="M28 4L9 27h13l-3 17 20-25H26z" fill="'+P.butter+'"/>'+SP(10,10,3),
heart:'<path d="M24 41C5 28 7 11 18 11c4 0 6 3 6 5 0-2 2-5 6-5 11 0 13 17-6 30z" fill="'+P.rose+'"/>'+E(18,22,1.5)+E(30,22,1.5)+M(24,24)+B(14.500,26)+B(33.500,26),
plane:'<path d="M4 27l40-17-11 31-10-10-9 6v-11z" fill="'+P.sky+'"/><path d="M44 10L23 31"/>'+SP(10,12,3),
shop:'<path d="M8 18h32l-3 23H11z" fill="'+P.peach+'"/><path d="M16 18c0-8 16-8 16 0"/>'+E(19,28,1.4)+E(29,28,1.4)+M(24,30)+B(15,31)+B(33,31),
drop:'<path d="M24 5C16 17 11 24 11 31a13 13 0 0026 0c0-7-5-14-13-26z" fill="'+P.sky+'"/>'+E(19.500,31,1.4)+E(28.500,31,1.4)+M(24,33)+'<path d="M17 25q1-4 4-6" stroke="#fff" stroke-width="2"/>',
bike:'<circle cx="11" cy="33" r="8" fill="'+P.cream+'"/><circle cx="37" cy="33" r="8" fill="'+P.cream+'"/><path d="M11 33l8-17h11l7 17M19 16l10 17M16 12h6"/><circle cx="37" cy="33" r="2" fill="'+P.pink+'"/>'
};
var ORIG=null,done=0;
function isW(){try{return S&&S.settings&&S.settings.mode==='wanita'}catch(e){return false}}
function swap(){try{
 if(typeof IL!=='object'||!IL)return;
 if(!ORIG){ORIG={};Object.keys(K).forEach(function(k){ORIG[k]=IL[k]})}
 var w=isW(),src=w?K:ORIG;
 if(done===(w?1:2))return;done=w?1:2;
 Object.keys(K).forEach(function(k){if(src[k]!==undefined)IL[k]=src[k]});
}catch(e){console.warn('vf kawaii',e)}}
window.__vfKawaii=K;
try{var _r=window.render;if(typeof _r==='function'){window.render=function(){swap();return _r.apply(this,arguments)};render=window.render}}catch(e){}
swap();
try{if(typeof render==='function'&&isW())render()}catch(e){}
})();
