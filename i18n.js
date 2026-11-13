// Переключатель языка RU/BE/EN: переводит текст на странице по словарю I18N (исходные тексты — русские).
(function(){var LANG='ru',D=window.I18N,busy=false,obs;
function norm(s){var ds=[];s=s.replace(/\b\d{2}\.\d{2}\.\d{4}\b/g,function(x){ds.push(x);return '{d}'}).replace(/\b\d{2}\.\d{4}\b/g,function(x){ds.push(x);return '{m}'});return [s,ds]}
function back(s,ds){var i=0;return s.replace(/\{[dm]\}/g,function(){return ds[i++]||''})}
function ex(k,ds){var t=D[LANG][k];return t===undefined?null:back(t,ds)}
function tr(s){var n=norm(s),k=n[0],ds=n[1],t=ex(k,ds),m;if(t!==null)return t;
 var kk=k;while(/\.$/.test(kk)){kk=kk.slice(0,-1);t=ex(kk,ds);if(t!==null)return t.replace(/\.$/,'')+'.';t=ex(kk+'.',ds);if(t!==null)return t.replace(/\.$/,'')+'.'}
 if(m=s.match(/^(.*?) ·$/)){t=tr(m[1]);if(t!==null)return t+' ·'}
 if(m=s.match(/^Исследовано: (\d) из 3 дел$/))return back(D[LANG]['Исследовано: {n} из 3 дел'].replace('{n}',m[1]),[]);
 if(m=s.match(/^Как свидетельство прошло путь от события до сегодняшнего читателя\. Изучено: (\d) из 3$/))return LANG==='be'?'Як сведчанне прайшло шлях ад падзеі да сённяшняга чытача. Вывучана: '+m[1]+' з 3':'How testimony travelled from the event to today’s reader. Studied: '+m[1]+' of 3';
 if(m=s.match(/^Дата рождения: (.+)$/))return (LANG==='be'?'Дата нараджэння: ':'Date of birth: ')+m[1];
 if(m=s.match(/^Википедия: (.+)$/)){var a=tr('Википедия'),b=tr(m[1]);return (a||'Википедия')+': '+(b||m[1])}
 if(m=s.match(/^([✝★✔]\s*)(.+)$/)){t=tr(m[2]);return t===null?null:m[1]+t}
 if(m=s.match(/^весной (\d{4}): (.+)$/)){t=tr(m[2]);return (LANG==='be'?'вясной ':'in spring ')+m[1]+': '+(t||m[2])}
 if(m=s.match(/^На (.+):$/)){t=tr(m[1]);return (LANG==='be'?'На ':'On ')+(t||m[1])+':'}
 if(m=s.match(/^Города на (.+)$/)){t=tr(m[1]);return (LANG==='be'?'Гарады на ':'Cities on ')+(t||m[1])}
 if(m=s.match(/^на (.+?): (.+)$/)){t=tr(m[2]);return (LANG==='be'?'на ':'on ')+m[1]+': '+(t||m[2])}
 if(m=s.match(/^\((.+?)\): (.+)$/)){var w=m[1].replace(/^с /,LANG==='be'?'з ':'from '),r=tr(m[2]);return r===null?null:'('+w+'): '+r}
 if(m=s.match(/^(\{d\}|[\d.]+|Весна \d{4}) — (.+)$/)){}
 if(s.indexOf(' · ')>0){var ps=s.split(' · '),o=ps.map(tr);if(o.some(function(x){return x!==null}))return ps.map(function(p,i){return o[i]===null?p:o[i]}).join(' · ')}
 if(m=s.match(/^(.{1,40}?) — (.+)$/)){var l=tr(m[1]),r2=tr(m[2]);if(l!==null||r2!==null)return (l===null?m[1]:l)+' — '+(r2===null?m[2]:r2)}
 if(/^[А-Яа-яЁё]+(, [А-Яа-яЁё]+)+\.?$/.test(s)){var items=s.replace(/\.$/,'').split(', '),oo=items.map(tr);if(oo.every(function(x){return x!==null}))return oo.join(', ')+(/\.$/.test(s)?'.':'')}
 return null}
function T(s){if(LANG==='ru')return s;var r=tr(s.trim().replace(/\s+/g,' '));return r===null?s:r}
window.T=T;window.LANGNOW=function(){return LANG};window.I18NWALK=function(){walk(document.getElementById('stage'))};
function doNode(n){var v=n.nodeValue;if(n.__o===undefined||n.__v!==v){if(!/[А-Яа-яЁё]/.test(v))return;n.__o=v}
 var o=n.__o,out=o;if(LANG!=='ru'){var core=o.trim().replace(/\s+/g,' '),t=tr(core);if(t!==null)out=o.match(/^\s*/)[0]+t+o.match(/\s*$/)[0]}
 if(out!==v)n.nodeValue=out;n.__v=n.nodeValue}
function doAttr(e,a){var v=e.getAttribute(a);if(v===null)return;var k='__o_'+a,w='__v_'+a;if(e[k]===undefined||e[w]!==v){if(!/[А-Яа-яЁё]/.test(v))return;e[k]=v}
 var out=LANG==='ru'?e[k]:T(e[k]);if(out!==v)e.setAttribute(a,out);e[w]=out}
function walk(root){busy=true;var tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),n,l=[];while(n=tw.nextNode()){var p=n.parentNode.nodeName;if(p!=='SCRIPT'&&p!=='STYLE'&&!(n.parentNode.closest&&n.parentNode.closest('[data-nt]')))l.push(n)}l.forEach(doNode);
 [].forEach.call(root.querySelectorAll('[title],[data-tip],[alt]'),function(e){if(e.closest('[data-nt]'))return;['title','data-tip','alt'].forEach(function(a){doAttr(e,a)})});if(obs)obs.takeRecords();busy=false}
var pend=false;function sched(){if(pend||busy)return;pend=true;requestAnimationFrame(function(){pend=false;walk(document.getElementById('stage'))})}
function setLang(l){LANG=l;document.documentElement.lang=l;try{document.dispatchEvent(new CustomEvent('sled-lang',{detail:l}))}catch(e){}[].forEach.call(document.querySelectorAll('#lang button'),function(b){b.classList.toggle('on',b.dataset.l===l)});walk(document.getElementById('stage'))}
document.addEventListener('DOMContentLoaded',function(){var st=document.getElementById('stage');obs=new MutationObserver(sched);obs.observe(st,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['title','data-tip','alt']});
 [].forEach.call(document.querySelectorAll('#lang button'),function(b){b.onclick=function(){setLang(b.dataset.l)}});setLang('ru')});
})();
