(function(){
function starP(x,y,r){var p=[];for(var i=0;i<10;i++){var R=i%2?r*.45:r,t=-Math.PI/2+i*Math.PI/5;p.push((x+R*Math.cos(t)).toFixed(1)+','+(y+R*Math.sin(t)).toFixed(1))}return 'M'+p.join(' L')+'Z'}
var $=function(s){return document.querySelector(s)},NS='http://www.w3.org/2000/svg',B=window.BELARUS,C=window.CASES,SRC=window.SRC;
var KEY='sled5',st={done:{},desk:[],stage:{},seen:{},reach:{},mapOpened:false},seq=0,zt=0,fromBoard=false,drag=null,PT={},pinch=null,moved=false,busy=false,view='room',cur=null,modalOpen=false,mapVB=null;
try{localStorage.removeItem('sled3');localStorage.removeItem('sled4');localStorage.removeItem(KEY)}catch(e){}
function save(){}
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;function setRM(){document.documentElement.classList.toggle('rm',RM)}
setRM();
function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function OD(d){var m=/^Весна (\d{4})$/.exec(d);return m?'весной '+m[1]:'на '+d}
var CN={slutsk:'Слуцк',novogrudok:'Новогрудок',minsk:'Минск'};
// ---- помещение
var r=7;function rnd(){r=(r*9301+49297)%233280;return r/233280}
var sh=$('#shelves'),cols=['#6b5a3e','#4d5238','#8a7650','#3f3a2c','#a08c62','#5a4632'];
for(var row=0;row<4;row++){var y=85+row*100;el('rect',{x:300,y:y+88,width:640,height:10,fill:'#51402F'},sh);var x=306;while(x<930){var w=8+rnd()*14,h=58+rnd()*26;el('rect',{x:x,y:y+88-h,width:w,height:h,fill:cols[Math.floor(rnd()*6)],stroke:'#1c1610','stroke-width':1},sh);if(rnd()<.4)el('rect',{x:x+1,y:y+88-h+10,width:w-2,height:9,fill:'#D7C8A7',opacity:.75},sh);x+=w+1.5}}
var fl=$('#floor');for(var i=-16;i<34;i++)el('line',{x1:i*130-40,y1:2100,x2:i*100+300,y2:760},fl);
var wt=$('#wallt');for(var i=0;i<40;i++)el('rect',{x:rnd()*1600,y:rnd()*760,width:2+rnd()*60,height:1.5,fill:'#000'},wt);
var cd=$('#cabd'),dn=['СЛУЦК','НОВОГРУДОК','МИНСК'];for(var i=0;i<3;i++){var g=el('g',{class:'dw'},cd);el('rect',{x:60,y:330+i*140,width:220,height:120,fill:'#7a6044',stroke:'#2a2018','stroke-width':3},g);el('rect',{x:78,y:362+i*140,width:184,height:30,fill:'#c9a14a',stroke:'#2a2018','stroke-width':2},g);var t=el('text',{x:170,y:383+i*140,'text-anchor':'middle','font-size':14,'font-weight':700,fill:'#2a2018'},g);t.textContent=dn[i];el('rect',{x:66,y:336+i*140,width:208,height:108,fill:'none',stroke:'#a07f58','stroke-width':1.5,opacity:.55},g);el('rect',{x:136,y:418+i*140,width:68,height:11,rx:5.5,fill:'#8a6a2a',stroke:'#2a2018','stroke-width':1.5},g);el('rect',{x:140,y:420+i*140,width:60,height:5,rx:2.5,fill:'#E0B46E'},g)}
// мини-карта на стене
var mg=$('#mapg');el('path',{d:B.d,fill:'#a99a72',stroke:'#4a3d28','stroke-width':3},mg);el('path',{d:B.rivers,fill:'none',stroke:'#6f8f90','stroke-width':1.5,'clip-path':'none',opacity:.6},mg);
for(var k in B.o)el('circle',{cx:B.o[k][0],cy:B.o[k][1],r:12,fill:'#8D2927'},mg);
// ---- камера
var CAM={room:'translate(0px,0px) scale(1)',cab:'translate(494px,-513px) scale(1.8)',map:'translate(-1822px,-139px) scale(1.9)',board:'translate(-1280px,-460px) scale(2)',desk:'translate(-180px,-530px) scale(1.4)'};
function cam(n,cb){$('#cam').style.transform=CAM[n];view=n;quest();var q=++seq;if(cb)setTimeout(function(){if(q===seq)cb()},RM?0:800)}
function lock(f){if(busy)return;busy=true;f();setTimeout(function(){busy=false},RM?50:900)}
function ov(id,on){var o=$(id);if(on){o.style.display='flex';requestAnimationFrame(function(){requestAnimationFrame(function(){o.classList.add('show')})})}else{o.classList.remove('show');setTimeout(function(){if(!o.classList.contains('show'))o.style.display='none'},RM?0:460)}}
function quest(){var n=Object.keys(st.done).length,t;
 if(n===3)t='Дело восстановлено. Откройте нить памяти, карту или журнал, чтобы пересмотреть найденное.';
 else if(view!=='room')t='Вы рассматриваете предмет. Нажмите ✕ в углу, чтобы вернуться в помещение.';
 else if(!st.desk.length)t='Шаг 1. Откройте картотеку слева и выберите историю: проследите, как память о событии дошла до наших дней.';
 else if(st.desk.some(function(i){return !st.done[i]}))t='Шаг 2. На столе лежит папка. Нажмите на неё и пройдите пять этапов: от события до сегодняшнего дня.';
 else t='Дело изучено. Откройте «Нить памяти» или карту, затем возьмите следующее дело из картотеки.';
 $('#quest').innerHTML='<small>ЧТО ДЕЛАТЬ</small>'+t;$('#prog').textContent='Исследовано: '+n+' из 3 дел'}
// ---- подсказки и параллакс
var tip=$('#tip');document.addEventListener('mousemove',function(e){var h=e.target.closest&&e.target.closest('[data-tip]'),rc=$('#stage').getBoundingClientRect();
 if(h&&!modalOpen){tip.textContent=h.getAttribute('data-tip');tip.style.left=(e.clientX-rc.left+14)+'px';tip.style.top=(e.clientY-rc.top+14)+'px';tip.style.opacity=1}else tip.style.opacity=0;
 if(!RM&&view==='room')$('#room').style.transform='translate('+((e.clientX/innerWidth-.5)*-10)+'px,'+((e.clientY/innerHeight-.5)*-6)+'px) scale(1.02)'});
function hot(id,f){var n=$('#'+id);n.onclick=function(){if(view!=='room'||modalOpen)return;lock(f)};n.addEventListener('keydown',function(e){if(e.key==='Enter')n.onclick()})}
hot('cab',function(){cam('cab',function(){fillFold();ov('#drawer',true)})});
hot('map',function(){cam('map',function(){showMap()})});
hot('board',function(){cam('board',function(){showBoard()})});
hot('note',function(){showLog()});
hot('quiz',function(){if(window.QUIZ)window.QUIZ.open()});
hot('faces',function(){if(window.FACES)window.FACES.open()});
// ---- закрытие: ✕, фон, Esc
function closeLb(){var l=$('#lb');l.classList.remove('show','z');setTimeout(function(){if(!l.classList.contains('show'))l.style.display='none'},RM?0:350)}
document.addEventListener('click',function(e){var t=e.target;if(t.matches&&t.matches('figure img')){var l=$('#lb');var li=$('#lbi');li.onerror=function(){li.onerror=null;li.src=t.src};li.src=t.dataset.full||t.src;l.style.display='flex';requestAnimationFrame(function(){requestAnimationFrame(function(){l.classList.add('show')})})}});
$('#lbi').onclick=function(e){e.stopPropagation();$('#lb').classList.toggle('z')};$('#lb').onclick=closeLb;$('#lbx').onclick=closeLb;
function closeAll(){if($('#lb').classList.contains('show')){closeLb();return}if(fromBoard&&cur){fromBoard=false;cur=null;fseq++;ov('#film',false);showBoard();return}fromBoard=false;fseq++;ov('#film',false);modalOpen=false;cur=null;ov('#panel',false);ov('#drawer',false);if(view!=='room')cam('room');quest()}
$('#mx').onclick=closeAll;
$('#panel').onclick=function(e){if(e.target===this)closeAll()};$('#drawer').onclick=function(e){if(e.target===this)closeAll()};
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});
// ---- модальное окно
function modal(title,dots,body,foot,wide){$('#mt').textContent=title;$('#md').innerHTML=dots||'';$('#mb').innerHTML=body;$('#mf').innerHTML=foot||'';$('#mod').className='modal'+(wide?' wide':'');modalOpen=true;ov('#panel',true);var b=$('#mb');b.scrollTop=0;setTimeout(hint,80)}
function hint(){var b=$('#mb');$('#sh').style.opacity=(b.scrollHeight-b.clientHeight>20&&b.scrollTop<b.scrollHeight-b.clientHeight-20)?1:0}
$('#mb').addEventListener('scroll',hint);$('#mb').tabIndex=0
function stat(s){return s==='ok'?'<span class="ok">подтверждено источником</span>':s==='note'?'<span class="ok">вывод проекта</span>':'<span class="ck">оценки расходятся</span>'}
function links(a){return a.map(function(k){return '<a href="'+SRC[k].u+'" target="_blank" rel="noopener">'+SRC[k].n+'</a>'}).join('; ')}
function byId(id){return C.filter(function(c){return c.id===id})[0]}
// ---- картотека
function fillFold(){var f=$('#fold');f.innerHTML='<button class="x drx" id="dx" title="Закрыть">✕</button>';C.forEach(function(c){var d=document.createElement('div');d.innerHTML='<b>'+c.title+'</b><small>'+c.period+' · '+c.type+'</small><small>'+c.desc+'</small><small><b>'+(st.done[c.id]?'✔ Исследовано':'Не исследовано')+'</b></small><small>Нажмите, чтобы взять папку на стол</small>';d.onclick=function(){pull(c)};f.appendChild(d)});$('#dx').onclick=closeAll}
function pull(c){if(busy)return;fromBoard=false;modalOpen=false;ov('#drawer',false);ov('#panel',false);busy=false;lock(function(){if(st.desk.indexOf(c.id)<0)st.desk.push(c.id);save();deskDraw(c.id);cam('desk',function(){if(st.seen[c.id])openCase(c);else{st.seen[c.id]=1;save();film(c,function(){openCase(c)})}})})}
function deskDraw(nw){var d=$('#desk');d.innerHTML='';st.desk.forEach(function(id,i){var g=el('g',{class:'hot','data-tip':byId(id).title,tabindex:0},d),rt=el('rect',{x:560+i*130,y:652+i*5,width:120,height:56,fill:'#b89a62',stroke:'#2a2018','stroke-width':3,transform:'rotate('+(i*3-3)+' '+(620+i*130)+' 680)'},g);el('rect',{x:560+i*130,y:642+i*5,width:48,height:10,fill:'#b89a62',stroke:'#2a2018','stroke-width':2,transform:'rotate('+(i*3-3)+' '+(620+i*130)+' 680)'},g);
 var t=el('text',{x:572+i*130,y:684+i*5,'font-size':10,fill:'#2a2018'},g);t.textContent=CN[byId(id).map].toUpperCase();
 g.onclick=function(){if(view==='desk'&&!modalOpen)openCase(byId(id));else if(view==='room'&&!modalOpen&&!busy)lock(function(){cam('desk',function(){openCase(byId(id))})})}})}
// ---- сюжетные вставки
var fseq=0;
function film(c,cb){var S=c.film,i=0,q=++fseq,done=false,tm;
 function end(){if(done)return;done=true;clearTimeout(tm);ov('#film',false);if(q===fseq)setTimeout(function(){if(q===fseq)cb()},RM?0:450)}
 function show(){if(done||q!==fseq)return;if(i>=S.length)return end();var s=S[i++];$('#fc').innerHTML='<div class="sc"><div class="k">'+s[0]+'</div><div class="t">'+s[1]+'</div></div>';var u=$('#fp u'),n=i;u.style.transition='none';u.style.width=(n-1)/S.length*100+'%';requestAnimationFrame(function(){requestAnimationFrame(function(){u.style.transition='width '+(RM?0:3.4)+'s linear';u.style.width=n/S.length*100+'%'})});clearTimeout(tm);tm=setTimeout(show,RM?1500:3600)}
 $('#fs').onclick=end;$('#fx').onclick=end;$('#fc').onclick=show;ov('#film',true);show()}
// ---- мини-карта маршрута в документе
function routeMap(c){var r=c.route;if(!r)return '';var s='',L='';
 if(r.kind==='list')return '<div class="rmap"><b>Места, названные в источниках</b><ul>'+r.items.map(function(x){return '<li><i style="background:#8D2927"></i>'+x+'</li>'}).join('')+'</ul><small>'+r.legend+'</small></div>';
 if(r.kind==='local'){var u=r.u,W=r.hw*2*u,H=r.hh*2*u,X=function(dx){return W/2+dx*u},Y=function(dy){return H/2-dy*u};
  s+='<rect width="'+W+'" height="'+H+'" fill="#cdbd96"/>';
  if(r.road)s+='<path d="M'+X(0)+','+Y(0)+' L'+X(r.road[1])+','+Y(r.road[2])+'" stroke="#7a5a2c" stroke-width="3" stroke-dasharray="7 3" fill="none"/><text x="'+(X(r.road[1])-6)+'" y="'+(Y(r.road[2])+14)+'" text-anchor="end" font-size="9" fill="#5a4632">'+r.road[0]+'</text>';
  if(r.tunnel)s+='<circle cx="'+X(0)+'" cy="'+Y(0)+'" r="'+(r.tunnel*u)+'" fill="#8D2927" opacity=".3" stroke="#8D2927"/>';
  r.pts.forEach(function(p){var x=X(p[1]),y=Y(p[2]);if(p[3]!=='town')s+='<path d="M'+X(0)+','+Y(0)+' L'+x+','+y+'" stroke="'+p[3]+'" stroke-width="3" stroke-dasharray="6 4" fill="none" class="mv"/>';s+='<circle cx="'+x+'" cy="'+y+'" r="'+(p[3]==='town'?6:5)+'" fill="'+(p[3]==='town'?'#2a2418':p[3])+'" stroke="#f1e8d0" stroke-width="2"/><text x="'+(x+8)+'" y="'+(y-7)+'" font-size="9.5" font-weight="700" fill="#2a2418">'+p[0]+'</text>';if(p[3]!=='town')L+='<li><i style="background:'+p[3]+'"></i>'+p[0]+'</li>'});
  if(r.u===12)s+='<path d="M10,'+(H-12)+' H'+(10+5*u)+'" stroke="#2a2418" stroke-width="3"/><text x="10" y="'+(H-17)+'" font-size="9">5 км</text>';
  s='<svg viewBox="0 0 '+W+' '+H+'">'+s+'</svg>'}
 else{var R=window.RAIL,Pj=function(lo,la){return [Math.round((lo-23)*B.k*Math.cos(53.7*Math.PI/180)),Math.round((56.3-la)*B.k)]},hs=window.POL.map(function(c){return c.d}).join('')+B.d;
  s+='<rect x="-1150" y="200" width="1960" height="480" fill="#a69a7a"/>';window.POL.forEach(function(c){s+='<path d="'+c.d+'" fill="'+(c.n==='Germany'?'#4a3a2a':/Poland|Lithuania|Latvia|Estonia/.test(c.n)?'#8a7757':'#b6a368')+'"/>'});
  s+='<path d="'+B.d+'" fill="#8a7757"/><path d="M-1200,150H900V720H-1200Z'+hs+'" fill="#8fa6a8" fill-rule="evenodd"/><path d="'+hs+'" fill="none" stroke="#2a2018" stroke-width="1.8" stroke-linejoin="round"/>';
  var rp=R.map(function(q){return Pj(q[1],q[2])}),rd='M'+rp.map(function(q){return q.join(',')}).join(' L');
  s+='<path d="'+rd+'" stroke="#1a140c" stroke-width="9" fill="none" stroke-linejoin="round"/><path d="'+rd+'" stroke="#eee6cf" stroke-width="4" stroke-dasharray="3 10" fill="none"/>';
  R.forEach(function(q,k){var p=rp[k];s+=(k===1||k===3||k===6?'<path d="'+starP(p[0],p[1],20)+'" fill="#E0B46E" stroke="#1a140c" stroke-width="3" stroke-linejoin="round"/>':'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(k===0?10:7)+'" fill="'+(k===0?'#8D2927':'#eee6cf')+'" stroke="#1a140c" stroke-width="3"/>')+'<text x="'+p[0]+'" y="'+(p[1]+(k%2?34:-16))+'" font-size="26" font-weight="700" text-anchor="middle" fill="#f1e8d0" style="paint-order:stroke;stroke:#1a140c;stroke-width:5px">'+q[0]+'</text>'});
  var tr=Pj(r.pts.trost[0],r.pts.trost[1]);s+='<path d="M'+(tr[0]-9)+','+tr[1]+' l9,-9 l9,9 l-9,9Z" fill="#1a140c" stroke="#f1e8d0" stroke-width="2"/><text x="'+(tr[0]+18)+'" y="'+(tr[1]+30)+'" font-size="20" font-weight="700" fill="#f1e8d0" style="paint-order:stroke;stroke:#1a140c;stroke-width:4px">Малый Тростенец</text>';
  s='<svg viewBox="-1150 200 1960 480">'+s+'</svg>';L+='<li><i style="background:#4a3a2a"></i>Германия</li><li><i style="background:#8a7757"></i>оккупированные территории (ноябрь 1941 г.)</li>';r.notes.forEach(function(n){L+='<li><i style="background:#2b2b25"></i>'+n[0]+' · '+stat(n[1])+' · '+links([n[2]])+'</li>'})}
 return '<div class="rmap"><b>Схема: куда вели и везли</b>'+s+'<ul>'+L+'</ul><small>'+r.legend+'</small></div>'}
// ---- дело
var N=window.STAGES;
function openCase(c){cur=c;st.stage[c.id]=Math.min(st.stage[c.id]||0,4);render()}
function fig(f,cap){return '<figure><img src="img/'+f+'.jpg" data-full="img/'+f+'-full.jpg" onerror="this.onerror=null;this.src=\'img/placeholder.jpg\'" title="Нажмите, чтобы увеличить" alt=""><figcaption>'+cap+'</figcaption></figure>'}
function ph(c,im){return '<div class="gal">'+im.f.map(function(f,k){return fig(f,im.c[k])}).join('')+'</div>'}
function chain(c,s){return '<div class="ch">'+c.chain.map(function(n,i){return (i?'<u class="'+(i<=s?'d':'')+'"></u>':'')+'<span class="'+(i<=s?'d':'')+'">'+n+'</span>'}).join('')+'</div>'}
function render(){if(!cur)return;var c=cur,s=Math.max(0,Math.min(4,st.stage[c.id]|0)),S;st.stage[c.id]=s;st.reach=st.reach||{};st.reach[c.id]=Math.max(st.reach[c.id]===undefined?-1:st.reach[c.id],s);S=c.stages[s],h='<div class="sheet"><p>'+S.lead+'</p>';
 var list='<p><b>Нажмите на лист, чтобы прочитать и открыть источник:</b></p>'+S.items.map(function(f,i){return '<span class="chip" data-f="'+i+'">'+f[0]+'</span>'}).join('')+'<div id="det"></div>';
 h+=S.img?'<div class="two">'+ph(c,S.img)+'<div>'+list+'</div></div>':list;if(s===1)h+=routeMap(c);
 if(s===0)h+='<p><button class="sec" id="tomap">ПОКАЗАТЬ НА КАРТЕ</button> <button class="sec" id="rf">▶ СЮЖЕТНАЯ ВСТАВКА</button></p>';
 h+='</div>';
 modal(c.short+' · '+N[s],chain(c,s)+'<div class="dots">Этап '+(s+1)+' из 5</div>',h,'<button class="sec" id="pv" style="visibility:'+(s?'visible':'hidden')+'">← НАЗАД</button><button class="sec" id="lt">ЗАКРЫТЬ, ВЕРНУСЬ ПОЗЖЕ</button><button id="nx">'+(s===4?'К НИТИ ПАМЯТИ':'ДАЛЕЕ →')+'</button>');
 $('#pv').onclick=function(){if(cur!==c||s<1)return;st.stage[c.id]=s-1;save();render()};$('#lt').onclick=closeAll;$('#nx').onclick=function(){if(cur!==c)return;if(s<4){st.stage[c.id]=s+1;save();render()}else finish(c)};
 [].forEach.call(document.querySelectorAll('[data-f]'),function(n){n.onclick=function(){[].forEach.call(document.querySelectorAll('.chip'),function(x){x.classList.remove('on')});n.classList.add('on');var f=S.items[n.dataset.f];$('#det').innerHTML='<div class="sheet"><p><b>'+f[0]+'.</b> '+f[1]+'</p><p>'+stat(f[2])+(f[3].length?' · Источники: '+links(f[3]):'')+'</p></div>';hint()}});
 var f0=document.querySelector('[data-f="0"]');if(f0)f0.onclick();
 var tm=$('#tomap');if(tm)tm.onclick=function(){showMap(c.map)};var rf=$('#rf');if(rf)rf.onclick=function(){film(c,function(){})};hint()}
function finish(c){fromBoard=false;st.done[c.id]=1;save();modalOpen=false;ov('#panel',false);busy=false;lock(function(){cam('board',function(){showBoard()})})}
// ---- карта
function proj(c){return B.cities[c]}
function showMap(focus,pre){st.mapOpened=true;var K=B.k*Math.cos(53.7*Math.PI/180),P=function(lo,la){return [Math.round((lo-23)*K),Math.round((56.3-la)*B.k)]},TL=window.TL,PLs=window.PL,cur=0,sel=null,
 MAJ=/^(Минск|Брест|Гродно|Витебск|Гомель|Могилёв|Слуцк|Новогрудок|Киев)$/,
 ix=function(id){for(var i=0;i<TL.length;i++)if(TL[i].id===id)return i;return -1},
 FL='M0,-15C7,-7 9,-1 5,6C3,10 -3,10 -5,6C-9,-1 -3,-7 0,-15Z',
 flame=function(x,y,s){return '<g transform="translate('+x+','+y+') scale('+s+')"><path d="'+FL+'" fill="#d9531e" stroke="#7a2a0e" stroke-width="1"/><path d="M0,-6C3,-2 3,2 0,5C-3,2 -3,-2 0,-6Z" fill="#ffd36a"/></g>'},
 cross=function(x,y,c){return '<path d="M'+(x-7)+','+(y-7)+'L'+(x+7)+','+(y+7)+'M'+(x+7)+','+(y-7)+'L'+(x-7)+','+(y+7)+'" stroke="'+(c||'#1a140c')+'" stroke-width="3" stroke-linecap="round"/>'},
 allD=window.POL.map(function(c){return c.d}).join(''),
 h='<div class="mp2"><div class="mrow"><div class="mw"><svg id="msv" class="mapsv" viewBox="-800 -340 2080 1325" preserveAspectRatio="xMidYMid slice"><defs><clipPath id="cp"><path d="'+B.d+'"/></clipPath><marker id="ak" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto"><path d="M0,0L10,5L0,10Z" fill="#111"/></marker><marker id="ar" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto"><path d="M0,0L10,5L0,10Z" fill="#c0261c"/></marker></defs>';
 h+='<rect x="-3000" y="-1500" width="6000" height="4500" fill="#8fa6a8"/><defs><path id="landp" d="'+allD+B.d+'"/></defs><use href="#landp" fill="#a69a7a"/><g id="ovl"></g><g id="al"></g><path d="'+B.d+'" fill="#f1e8d0" fill-opacity=".22"/>';
 h+='<g clip-path="url(#cp)"><path d="'+B.lakes+'" fill="#7f9a9a"/><path d="'+B.rivers+'" fill="none" stroke="#6f8f90" stroke-width="1.4"/><path d="'+B.roads+'" fill="none" stroke="#7a5a2c" stroke-width="1.2" opacity=".7"/></g><path d="'+allD+'" fill="none" stroke="#eadfc2" stroke-opacity=".6" stroke-width="1.4" stroke-linejoin="round"/><path d="'+B.d+'" fill="none" stroke="#1a140c" stroke-width="3" stroke-linejoin="round"/>';
 [["ГЕРМАНИЯ",10.3,51.3,34],["ПОЛЬША",19.6,52.0,26],["Балтийское море",19.0,57.4,26],["Чёрное море",33.5,43.8,26],["Беларусь",27.6,55.55,26]].forEach(function(l){var p=P(l[1],l[2]),sea=l[0].indexOf('море')>0||l[0]==='Беларусь';h+='<text x="'+p[0]+'" y="'+p[1]+'" font-size="'+l[3]+'" font-weight="700" text-anchor="middle" fill="'+(sea?'#2f4a50':'#f1e8d0')+'" style="paint-order:stroke;stroke:'+(sea?'#e8f0ee':'#2a2418')+';stroke-width:'+(l[3]/9)+'px;pointer-events:none"'+(l[0].indexOf('море')>0?' font-style="italic"':'')+'>'+l[0]+'</text>'});
 h+='<g id="dyn"></g></svg><div class="zb"><button id="zi">+</button><button id="zo" title="Вся карта">−</button><button id="zh" title="К Беларуси">⌂</button></div><div class="lg" id="lg"><div class="lgb" id="lgb"></div><button id="lgt" class="sec" title="Легенда">Легенда ▶</button></div></div><div class="as" id="as"></div></div><div class="tlb"><button id="tlp" class="sec">◀</button><div class="tls">'+TL.map(function(t,i){return '<div class="tk" data-i="'+i+'"><i></i><span>'+t.d+'</span><em>'+t.title+'</em></div>'}).join('')+'</div><button id="tln" class="sec">▶</button></div></div>';
 modal('Карта: Беларусь в 1941–1944 гг.','',h,'',true);
 mapVB=[-800,-340,2080,1325];
 function st8(p){var i=cur;if(p.ty==='b'){var a2=ix(p.from),b2=ix(p.to);return i<a2?'before':i<=b2?'on':'after'}if(p.ty==='v')return i>=ix(p.at)?'gone':'alive';if(p.ty==='f')return i<=1?'on':'after';var a=ix(p.from),b=ix(p.to);return i<a?'before':i<b?'on':i===b&&p.ty==='g'?'on':'gone'}
 function cst(c){var d=TL[cur].iso;return d<c[3]?'до оккупации':d>=c[4]?'освобождён':'оккупирован'}
 function legend(){var cs=window.CITY,g=function(s){return cs.filter(function(c){return cst(c)===s}).map(function(c){return c[0]}).join(', ')||'—'};
  $('#lgb').innerHTML='<b>Легенда</b><p><i class="sw" style="background:#33281d"></i>зона Третьего рейха и оккупированные земли</p><p><i class="sw" style="background:#b6a368"></i>зона СССР</p><p><i class="sw" style="background:#7b7a5a"></i>союзники рейха (Румыния до 23.08.1944, Венгрия, Финляндия, Словакия)</p><p><i class="sw" style="background:none;border-top:3px dashed #8D2927;height:0"></i>линия фронта (приблизительно)</p><p>🔥 бои (номер — в списке справа)</p><p><b>⟶</b> чёрная стрелка — наступление Третьего рейха; <b style="color:#c0261c">⟶</b> красная — наступление СССР (освобождение)</p><p>● красная точка — деревня; ⊗ тёмная с крестом — уничтожена</p><p>◆ лагерь · ■ гетто · ⬢ крепость</p><p>★ столица государства (республики)</p><b>Города '+OD(TL[cur].d)+'</b><p><b>Под оккупацией:</b> '+g('оккупирован')+'</p><p><b>Освобождены:</b> '+g('освобождён')+'</p><p><b>Ещё не заняты:</b> '+g('до оккупации')+'</p>'}
 function draw(){if(!$('#ovl')||!$('#dyn')||!$('#as'))return;var T=TL[cur],pts=T.front.map(function(q){return P(q[0],q[1])}),f=pts[0],l=pts[pts.length-1],ln=pts.map(function(q){return q.join(',')}).join(' L'),rom=T.iso>='1944-08-23',
  pr='L'+ln+' L'+l[0]+',2900 ';
  $('#ovl').innerHTML='<clipPath id="cR"><path d="M-2600,-1700 L'+f[0]+',-1700 '+pr+'L-2600,2900Z"/></clipPath><clipPath id="cS"><path d="M3600,-1700 L'+f[0]+',-1700 '+pr+'L3600,2900Z"/></clipPath><g clip-path="url(#cR)"><use href="#landp" fill="#33281d" fill-opacity=".68"/></g><g clip-path="url(#cS)"><use href="#landp" fill="#c9b574" fill-opacity=".55"/></g>';
  var al='';window.POL.forEach(function(c){if(c.r==='ally'||c.r==='neu'){var col=c.n==='Romania'&&rom?'#b6a368':c.r==='ally'?'#7b7a5a':'#9a8f78';al+='<path d="'+c.d+'" fill="'+col+'" fill-opacity=".5" stroke="#2a2018" stroke-width="2" stroke-dasharray="7 4"/>'}});
  [["РУМЫНИЯ"+(rom?" (с 23.08.1944 против рейха)":" (союзник рейха)"),25.5,46.0,20],["ВЕНГРИЯ (союзник)",19.5,47.2,16],["ФИНЛЯНДИЯ (союзник)",26.5,62.2,16],["СЛОВАКИЯ (союзник)",19.5,48.7,12]].forEach(function(t){var p=P(t[1],t[2]);al+='<text x="'+p[0]+'" y="'+p[1]+'" font-size="'+t[3]+'" font-weight="700" text-anchor="middle" fill="#f1e8d0" style="paint-order:stroke;stroke:#2a2418;stroke-width:3px;pointer-events:none">'+t[0]+'</text>'});
  $('#al').innerHTML=al;
  var d='<path d="M'+ln+'" fill="none" stroke="#8D2927" stroke-width="5" stroke-dasharray="16 7"/>';
  pts.forEach(function(q,k){if(k%2===0)d+=flame(q[0],q[1]-4,.85)});(window.ARR[T.id]||[]).forEach(function(r){var qq=r.p.map(function(z){return P(z[0],z[1])});d+='<path d="M'+qq.map(function(z){return z.join(',')}).join(' L')+'" fill="none" stroke="'+(r.c==='k'?'#111':'#c0261c')+'" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#'+(r.c==='k'?'ak':'ar')+')" opacity=".92"/>'});
  T.battles.forEach(function(b,n){var B2=window.BT[b],q=P(B2.lon,B2.lat);d+='<g class="bt" data-b="'+b+'">'+flame(q[0],q[1]-6,1.7)+'<circle cx="'+(q[0]+14)+'" cy="'+(q[1]-18)+'" r="11" fill="#f1e8d0" stroke="#2a2018" stroke-width="2"/><text x="'+(q[0]+14)+'" y="'+(q[1]-13)+'" font-size="14" font-weight="700" text-anchor="middle" fill="#2a2018">'+(n+1)+'</text></g>'});
  if(cur>=ix('nov41')){var rp=window.RAIL.map(function(r){return P(r[1],r[2])}),rd='M'+rp.map(function(q){return q.join(',')}).join(' L');d+='<path d="'+rd+'" stroke="#1a140c" stroke-width="8" fill="none"/><path d="'+rd+'" stroke="#eee6cf" stroke-width="3.5" stroke-dasharray="3 9" fill="none"/>';window.RAIL.forEach(function(r,k){if(k===1||k===3)return;var q=rp[k];d+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="5" fill="#eee6cf" stroke="#1a140c" stroke-width="2"/>';if(k<4)d+='<text x="'+q[0]+'" y="'+(q[1]+(k%2?26:-12))+'" font-size="17" text-anchor="middle" fill="#f1e8d0" style="paint-order:stroke;stroke:#1a140c;stroke-width:3px">'+r[0]+'</text>'})}
  window.CITY.forEach(function(c,i){var q=P(c[1],c[2]),cs=/^(Слуцк|Новогрудок|Минск)$/.test(c[0]),oc=cst(c)==='оккупирован';d+='<g class="cc'+(MAJ.test(c[0])?'':' mn')+'" data-c="'+i+'">'+(window.CAPN.indexOf(c[0])>=0?'<path d="'+starP(q[0],q[1],17)+'" fill="'+(oc?'#33281d':'#E0B46E')+'" stroke="'+(oc?'#E0B46E':'#33281d')+'" stroke-width="2.5" stroke-linejoin="round"/>':'<circle cx="'+q[0]+'" cy="'+q[1]+'" r="'+(cs?9:6)+'" fill="'+(oc?'#33281d':'#f1e8d0')+'" stroke="'+(oc?'#e8dcc0':'#33281d')+'" stroke-width="2.5"/>')+'<text x="'+(q[0]+13)+'" y="'+(q[1]+5)+'" font-size="'+(cs?22:17)+'">'+c[0]+'</text></g>'});
  window.CAP.forEach(function(c,i){var q=P(c[1],c[2]);d+='<g class="kp" data-k="'+i+'"><path d="'+starP(q[0],q[1],17)+'" fill="#E0B46E" stroke="#33281d" stroke-width="2.5" stroke-linejoin="round"/><text x="'+(q[0]+20)+'" y="'+(q[1]+6)+'" font-size="24" font-weight="700" fill="#f1e8d0" style="paint-order:stroke;stroke:#1a140c;stroke-width:4px">'+c[0]+'</text></g>'});
  PLs.forEach(function(p){var s=st8(p);if(s==='before'&&p.ty!=='b')return;var q=P(p.lon,p.lat);q=[q[0]+(p.dx||0),q[1]+(p.dy||0)];var g='<g class="oc'+(sel===p.id?' sl':'')+(p.ty==='b'?' bl':'')+'" data-p="'+p.id+'">';if(p.ty==='b')g+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="9" fill="#8D2927" stroke="#f1e8d0" stroke-width="2.5"/>'+(s==='on'?flame(q[0],q[1]-14,1.6):'');
   if(p.ty==='v')g+=s==='gone'?'<circle cx="'+q[0]+'" cy="'+q[1]+'" r="6" fill="#1a140c"/>'+cross(q[0],q[1],'#f1e8d0'):'<circle cx="'+q[0]+'" cy="'+q[1]+'" r="4.5" fill="#c0392b" stroke="#f1e8d0" stroke-width="1.5"/>';
   if(p.ty==='c')g+='<path d="M'+q[0]+','+(q[1]-10)+' L'+(q[0]+10)+','+q[1]+' L'+q[0]+','+(q[1]+10)+' L'+(q[0]-10)+','+q[1]+'Z" fill="#1a140c" stroke="#f1e8d0" stroke-width="2"/>'+(s==='gone'?cross(q[0],q[1],'#f1e8d0'):'');
   if(p.ty==='g')g+='<rect x="'+(q[0]-7)+'" y="'+(q[1]-7)+'" width="14" height="14" fill="'+(s==='gone'?'#1a140c':'#f1e8d0')+'" stroke="#1a140c" stroke-width="2.5"/>'+(s==='gone'?cross(q[0],q[1],'#f1e8d0'):'');
   if(p.ty==='f'){var hx=[];for(var u=0;u<6;u++)hx.push((q[0]+11*Math.cos(u*Math.PI/3)).toFixed(1)+','+(q[1]+11*Math.sin(u*Math.PI/3)).toFixed(1));g+='<path d="M'+hx.join(' L')+'Z" fill="#8D2927" stroke="#f1e8d0" stroke-width="2"/><circle cx="'+q[0]+'" cy="'+q[1]+'" r="3" fill="#f1e8d0"/>'}
   if(sel===p.id)g+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="16" fill="none" stroke="#E0B46E" stroke-width="3"/>';d+=g+'<text x="'+(q[0]+14)+'" y="'+(q[1]+4)+'" font-size="14" fill="#f1e8d0" style="paint-order:stroke;stroke:#1a140c;stroke-width:3px">'+p.n+'</text></g>'});
  $('#dyn').innerHTML=d;[].forEach.call(document.querySelectorAll('.tk'),function(n){n.classList.toggle('on',+n.dataset.i===cur)});legend();
  var on=PLs.filter(function(p){return p.ty==='v'&&st8(p)==='gone'}).map(function(p){return p.n});
  if(!sel)$('#as').innerHTML='<h3>'+T.d+' — '+T.title+'</h3><p>'+T.text+'</p>'+(T.ph?fig(T.ph[0],T.ph[1]):'')+(T.battles.length?'<b>Бои и сражения:</b><ol>'+T.battles.map(function(b){var B2=window.BT[b];return '<li><b>'+B2.n+'</b> ('+B2.w+'): '+B2.t+' <a href="'+window.WIKI(B2.wk)+'" target="_blank" rel="noopener">Википедия</a></li>'}).join('')+'</ol>':'')+(on.length?'<p><b>Уничтожены (крестик):</b> '+on.join(', ')+'.</p>':'')+'<p><small>Красная пунктирная линия — приблизительный ход фронта. Нажмите на значок, город или огонь, чтобы узнать подробности. Колесо мыши — масштаб, перетаскивание — сдвиг. Подписи мелких объектов появляются при приближении.</small></p>'}
 function info(html){if(!$('#as'))return;$('#as').innerHTML=html+'<p><button class="sec" id="bk">← К дате</button></p>';$('#bk').onclick=function(){sel=null;draw()}}
 function obj(id){var p=PLs.filter(function(x){return x.id===id})[0],s=st8(p),tn={v:'Деревня',c:'Лагерь',g:'Гетто',f:'Крепость',b:'Город'}[p.ty];sel=id;draw();var t=s==='gone'?(p.gone||p.after):s==='on'?(p.on||p.alive):s==='after'?(p.after||''):(p.alive||p.before||'');
  info('<h3>'+(s==='gone'&&p.ty==='v'?'✝ ':'')+p.n+'</h3><p><i>'+tn+' · '+OD(TL[cur].d)+': '+({alive:'существует',gone:p.ty==='v'?'уничтожена':'прекратило существование',on:p.ty==='f'||p.ty==='b'?'бои':'действует',after:p.ty==='b'?'после битвы':'после боёв',before:'в тылу'}[s]||'')+'</i></p><p>'+t+'</p>'+(p.ph?fig(p.ph,p.phc):'')+(p.approx?'<p><small>Положение на карте приблизительное.</small></p>':'')+'<p>Источники: '+(p.src?links(p.src):'<a href="'+window.WIKI(p.wk)+'" target="_blank" rel="noopener">Википедия</a>')+'</p>')}
 function city(i){var c=window.CITY[i],cs=C.filter(function(x){return CN[x.map]===c[0]})[0];sel=null;draw();info('<h3>'+c[0]+'</h3><p>'+c[5]+'</p><p>'+(/^\d/.test(TL[cur].d)?'На '+TL[cur].d+':':'Весной '+TL[cur].d.slice(-4)+':')+' <b>'+cst(c)+'</b>.</p><p>Оккупация: '+c[3].split('-').reverse().join('.')+'; освобождение: '+c[4].split('-').reverse().join('.')+'.</p>'+(c[6]?fig(c[6],c[7]):'')+'<p><a href="'+window.WIKI(c[0])+'" target="_blank" rel="noopener">Википедия: '+c[0]+'</a></p>'+(cs?'<p><button id="oc">ОТКРЫТЬ ДЕЛО →</button></p>':''));if(cs)$('#oc').onclick=function(){pull(cs)};var q=P(c[1],c[2]);if($('#msv'))zoom(q[0]-190,q[1]-150,380,300)}
 function cap(i){var c=window.CAP[i];sel=null;draw();info('<h3>★ '+c[0]+'</h3><p>'+c[3]+'</p><p><a href="'+window.WIKI(c[0])+'" target="_blank" rel="noopener">Википедия: '+c[0]+'</a></p>')}
 function bat(id){var B2=window.BT[id];sel=null;info('<h3>'+B2.n+'</h3><p>'+B2.w+'</p><p>'+B2.t+'</p><p><a href="'+window.WIKI(B2.wk)+'" target="_blank" rel="noopener">Википедия</a></p>')}
 function set(i){cur=Math.max(0,Math.min(TL.length-1,i));sel=null;draw()}
 var sv=$('#msv');wireMap(sv);sv.addEventListener('click',function(e){if(moved)return;var g=e.target.closest&&e.target.closest('[data-p],[data-c],[data-b],[data-k]');if(!g)return;if(g.dataset.k){cap(+g.dataset.k);return}if(g.dataset.p)obj(g.dataset.p);else if(g.dataset.c)city(+g.dataset.c);else bat(g.dataset.b)});
 [].forEach.call(document.querySelectorAll('.tk'),function(n){n.onclick=function(){set(+n.dataset.i)}});$('#tlp').onclick=function(){set(cur-1)};$('#tln').onclick=function(){set(cur+1)};
 $('#lgt').onclick=function(){var l=$('#lg');l.classList.toggle('op');$('#lgt').textContent=l.classList.contains('op')?'Легенда ◀':'Легенда ▶'};
 $('#zi').onclick=function(){var v=mapVB;zoom(v[0]+v[2]*.2,v[1]+v[3]*.2,v[2]*.6,v[3]*.6)};$('#zo').onclick=function(){zoom(-1440,-420,3200,2040)};$('#zh').onclick=function(){zoom(-800,-340,2080,1325)};
 var f0=focus==='minsk'?'nov41':focus==='slutsk'?'oct41':focus==='novogrudok'?'sep43':null;set(f0?ix(f0):0);if(pre){if(pre.date)set(ix(pre.date));if(pre.obj)setTimeout(function(){try{obj(pre.obj)}catch(e){}},RM?0:500)}
 if(focus){var nm={slutsk:'Слуцк',novogrudok:'Новогрудок',minsk:'Минск'}[focus];setTimeout(function(){for(var i=0;i<window.CITY.length;i++)if(window.CITY[i][0]===nm){city(i);break}},400)}}

function setVB(v){v[0]=Math.max(-1500,Math.min(1800-v[2],v[0]));v[1]=Math.max(-800,Math.min(1960-v[3],v[1]));mapVB=v;var s=$('#msv');if(s){s.setAttribute('viewBox',v.join(' '));s.classList.toggle('zin',v[2]<1100)}}
function pt(sv,e){try{var p=sv.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(sv.getScreenCTM().inverse())}catch(x){return{x:mapVB[0]+mapVB[2]/2,y:mapVB[1]+mapVB[3]/2}}}
function wireMap(sv){sv.addEventListener('wheel',function(e){e.preventDefault();zt++;var v=mapVB,f=e.deltaY<0?.85:1/.85,w=Math.min(3300,Math.max(110,v[2]*f)),k=w/v[2],p=pt(sv,e);setVB([p.x-(p.x-v[0])*k,p.y-(p.y-v[1])*k,w,v[3]*k])},{passive:false});sv.addEventListener('pointerdown',function(e){PT[e.pointerId]={x:e.clientX,y:e.clientY};pinch=null;var m=sv.getScreenCTM?sv.getScreenCTM():null;drag={x:e.clientX,y:e.clientY,v:mapVB.slice(),a:m&&m.a?m.a:1};moved=false});sv.style.cursor='grab'}
document.addEventListener('pointermove',function(e){if(PT[e.pointerId]){PT[e.pointerId].x=e.clientX;PT[e.pointerId].y=e.clientY}var ks=Object.keys(PT);if(ks.length>=2){var sv2=$('#msv');if(!sv2)return;var a=PT[ks[0]],b=PT[ks[1]],dd=Math.hypot(a.x-b.x,a.y-b.y),mx=(a.x+b.x)/2,my=(a.y+b.y)/2;if(!pinch){pinch={d:dd,v:mapVB.slice(),c:pt(sv2,{clientX:mx,clientY:my})}}else if(pinch.d>0){var k=Math.max(110/pinch.v[2],Math.min(3300/pinch.v[2],pinch.d/dd)),w=pinch.v[2]*k,c=pinch.c;moved=true;zt++;drag=null;setVB([c.x-(c.x-pinch.v[0])*k,c.y-(c.y-pinch.v[1])*k,w,pinch.v[3]*k])}return}if(!drag)return;var dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>5){var s=$('#msv');if(!s){drag=null;return}moved=true;zt++;s.style.cursor='grabbing';setVB([drag.v[0]-dx/drag.a,drag.v[1]-dy/drag.a,drag.v[2],drag.v[3]])}});
function pend(e){delete PT[e.pointerId];pinch=null}document.addEventListener('pointercancel',pend);document.addEventListener('pointerup',function(e){pend(e);drag=null;var s=$('#msv');if(s)s.style.cursor='grab';setTimeout(function(){moved=false},0)});
function zoom(x,y,w,h){var my=++zt,v=mapVB.slice(),t0=performance.now(),sv=$('#msv'),d=RM?1:700;function f(t){if(my!==zt)return;var k=Math.min(1,(t-t0)/d);k=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;mapVB=[0,1,2,3].map(function(i){return v[i]+([x,y,w,h][i]-v[i])*k});if(sv){sv.setAttribute('viewBox',mapVB.join(' '));sv.classList.toggle('zin',mapVB[2]<1100)}if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
// ---- нить памяти
function showBoard(){var all=Object.keys(st.done).length===3,h='<div class="bd"><svg viewBox="0 0 100 100" preserveAspectRatio="none">',cards='',d=0;
 C.forEach(function(c,i){var y0=2+i*33,ok=st.done[c.id];cards+='<div class="rl" style="top:'+y0+'%">'+c.title+'</div>';
  if(ok)h+='<path class="tl" pathLength="1" style="transition-delay:'+(.5+i*.7)+'s" d="M'+(3+8.5)+','+(y0+17)+' L'+(3+4*19.5+8.5)+','+(y0+17)+'"/>';
  c.chain.forEach(function(n,j){cards+='<div class="bc'+(ok?' cl':' gh')+'"'+(ok?' data-c="'+c.id+'" data-j="'+j+'" title="Открыть этап"':'')+' style="left:'+(3+j*19.5)+'%;top:'+(y0+7)+'%;transition-delay:'+(d++*.08)+'s"><b>'+window.STAGES[j]+'</b>'+(ok?n:'')+'</div>'})});
 h+='</svg>'+cards+'</div>'+(all?'<p style="text-align:center"><b>'+window.FINAL+'</b></p>':'<p style="text-align:center"><small>Нажмите на этап изученной истории, чтобы вернуться к нему. Нить соединяет этапы только после изучения. Откройте картотеку и пройдите остальные истории.</small></p>');
 modal('Нить памяти','Как свидетельство прошло путь от события до сегодняшнего читателя. Изучено: '+Object.keys(st.done).length+' из 3',h,'<span></span><button class="sec" id="cl">✕ ЗАКРЫТЬ</button>',true);$('#cl').onclick=closeAll;
 setTimeout(function(){[].forEach.call(document.querySelectorAll('.bc,.tl'),function(n){n.classList.add('in')})},60);
 [].forEach.call(document.querySelectorAll('.bc[data-c]'),function(n){n.onclick=function(){fromBoard=true;cur=byId(n.dataset.c);st.stage[cur.id]=+n.dataset.j;save();render()}})}
// ---- журнал
function showLog(){modal('Журнал исследователя','',C.map(function(c){return '<p><b>'+c.short+'</b> — '+(st.done[c.id]?'исследовано. Источники: '+links(c.src):'не исследовано')+(st.desk.indexOf(c.id)>=0?' <a href="#" data-o="'+c.id+'">открыть папку</a>':'')+'</p>'}).join(''),'<button class="sec" id="rs">Сбросить прогресс</button><button class="sec" id="cl">✕ ЗАКРЫТЬ</button>');
 $('#cl').onclick=closeAll;$('#rs').onclick=function(){if(confirm(window.T?window.T('Сбросить весь прогресс?'):'Сбросить весь прогресс?')){st={done:{},desk:[],stage:{},seen:{},reach:{},mapOpened:false};save();deskDraw();closeAll()}};
 [].forEach.call(document.querySelectorAll('[data-o]'),function(a){a.onclick=function(e){e.preventDefault();pull(byId(a.dataset.o))}})}
// ---- пыль и вступление
var cv=$('#dust'),cx=cv.getContext('2d'),P=[];function rs(){cv.width=cv.clientWidth;cv.height=cv.clientHeight}rs();addEventListener('resize',rs);
for(var i=0;i<50;i++)P.push({x:Math.random(),y:Math.random(),v:.00004+Math.random()*.00008,r:.7+Math.random()*1.5});
(function loop(){cx.clearRect(0,0,cv.width,cv.height);if(!RM)P.forEach(function(p){p.y-=p.v;p.x+=Math.sin(p.y*20)*.0002;if(p.y<.2)p.y=.95;cx.fillStyle='rgba(224,180,110,'+Math.max(0,.55-Math.abs(p.x-.4)*1.2)+')';cx.beginPath();cx.arc(p.x*cv.width,p.y*cv.height,p.r,0,7);cx.fill()});requestAnimationFrame(loop)})();
var it=$('#intro');function enter(){it.style.opacity=0;it.style.pointerEvents='none';setTimeout(function(){it.style.display='none'},1200)}
setTimeout(function(){it.classList.add('dim')},500);setTimeout(function(){it.classList.add('on')},1300);$('#enter').onclick=enter;$('#skip').onclick=enter;
$('#ab').onclick=function(){if(modalOpen)return;modal('О проекте «СЛЕД»','',window.ABOUT,'<span></span><button class="sec" id="cl">✕ ЗАКРЫТЬ</button>');$('#cl').onclick=closeAll};
function openStage(id,s){var c=byId(id);if(!c)return;fromBoard=false;cur=c;if(st.desk.indexOf(id)<0){st.desk.push(id);save();deskDraw()}st.stage[id]=s;render()}
function openMap(pre){closeAll();setTimeout(function(){lock(function(){cam('map',function(){showMap(null,pre)})})},RM?0:120)}
window.SLED={$:$,modal:modal,close:closeAll,openStage:openStage,openMap:openMap};
Object.defineProperty(window.SLED,'st',{get:function(){return st}});
deskDraw();quest();
})();
