'use strict';
const caseDialog=document.getElementById('case-dialog');
const caseContent=document.getElementById('case-content');
const videoDialog=document.getElementById('video-dialog');
const imageDialog=document.getElementById('image-dialog');
const player=document.getElementById('player');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const toggle=document.getElementById('motion-toggle');
let previewsEnabled=!reduce.matches&&!navigator.connection?.saveData;
let activePreview=null;
const visiblePreviews=new Map(),watchedPreviews=new WeakSet(),carouselUpdates=new Map();
const opener=new WeakMap();
let playerItems=[],playerIndex=0;
function pausePreview(v){v.pause();v.classList.remove('is-playing');if(v.hasAttribute('src')){v.removeAttribute('src');v.load();}}
function choosePreview(){
 const modal=[...document.querySelectorAll('dialog[open]')].at(-1);
 const next=previewsEnabled&&!document.hidden&&(!modal||modal===caseDialog)?[...visiblePreviews].find(([v,ratio])=>v.isConnected&&ratio>.65&&(!modal||modal.contains(v)))?.[0]:null;
 if(next===activePreview)return;
 if(activePreview)pausePreview(activePreview);activePreview=next;
 if(next){next.muted=true;next.src=next.dataset.preview;next.play().then(()=>{if(activePreview===next)next.classList.add('is-playing');else pausePreview(next);}).catch(()=>{});}
}
const previewObserver=new IntersectionObserver(entries=>{entries.forEach(e=>visiblePreviews.set(e.target,e.intersectionRatio));choosePreview();},{threshold:[0,.65,.9]});
function initPreviews(){
 for(const v of visiblePreviews.keys())if(!v.isConnected){pausePreview(v);previewObserver.unobserve(v);visiblePreviews.delete(v);}
 document.querySelectorAll('[data-preview]').forEach(v=>{if(!watchedPreviews.has(v)){watchedPreviews.add(v);previewObserver.observe(v);}});choosePreview();
}
function updateToggle(){toggle.setAttribute('aria-pressed',String(previewsEnabled));toggle.textContent=previewsEnabled?'Пауза превью  Ⅱ':'Включить превью  ▶';}
function initCarousels(){
 for(const c of carouselUpdates.keys())if(!c.isConnected)carouselUpdates.delete(c);
 document.querySelectorAll('[data-carousel]').forEach(c=>{
  if(carouselUpdates.has(c))return;
  const track=c.querySelector('.carousel-track'),slides=[...track.children];
  const prev=c.querySelector('[data-step="-1"]'),next=c.querySelector('[data-step="1"]'),count=c.querySelector('[data-carousel-count]');
  const choices=[...c.querySelectorAll('[data-select-work]')];
  let index=0;
  const offset=s=>s.offsetLeft-slides[0].offsetLeft;
  function update(){index=slides.reduce((best,s,i)=>Math.abs(offset(s)-track.scrollLeft)<Math.abs(offset(slides[best])-track.scrollLeft)?i:best,0);count.textContent=(index+1)+' / '+slides.length;prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-3;c.querySelector('.carousel-controls').hidden=slides.length<2;choices.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));const choice=choices[index];if(choice){const list=choice.parentElement;if(list.scrollWidth>list.clientWidth){const left=choice.offsetLeft-choices[0].offsetLeft;if(left<list.scrollLeft||left+choice.offsetWidth>list.scrollLeft+list.clientWidth)list.scrollTo({left,behavior:reduce.matches?'instant':'smooth'});}}}
  function go(i){track.scrollTo({left:offset(slides[Math.max(0,Math.min(slides.length-1,i))]),behavior:reduce.matches?'instant':'smooth'});}
  prev.addEventListener('click',()=>go(index-1));next.addEventListener('click',()=>go(index+1));
  choices.forEach((button,i)=>button.addEventListener('click',()=>go(i)));
  track.addEventListener('scroll',()=>{update();choosePreview();},{passive:true});
  track.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();go(e.key==='Home'?0:e.key==='End'?slides.length-1:index+(e.key==='ArrowLeft'?-1:1));}});
  carouselUpdates.set(c,update);update();
 });
}
function show(dialog,trigger){opener.set(dialog,trigger||document.activeElement);if(!dialog.open)dialog.showModal();choosePreview();}
function loadPlayer(index){
 playerIndex=Math.max(0,Math.min(playerItems.length-1,index));const button=playerItems[playerIndex];
 opener.set(videoDialog,button);
 button.closest('[data-screening]')?.querySelector('[data-select-work="'+playerIndex+'"]')?.click();
 document.getElementById('video-title').textContent=button.dataset.title;
 document.getElementById('video-error').hidden=true;
 const navigation=document.querySelector('.player-navigation');navigation.hidden=playerItems.length<2;
 document.getElementById('player-position').textContent=(playerIndex+1)+' / '+playerItems.length;
 navigation.querySelector('[data-player-step="-1"]').disabled=playerIndex===0;
 navigation.querySelector('[data-player-step="1"]').disabled=playerIndex===playerItems.length-1;
 player.pause();player.poster=button.querySelector('.work-frame img:not(.ambient)')?.src||'';
 player.src=button.dataset.src;player.load();player.play().catch(()=>{});
}
function openCase(id,trigger){
 const template=document.getElementById('case-'+id);if(!template)return;
 if(caseDialog.open)caseContent.querySelectorAll('video').forEach(pausePreview);
 caseContent.replaceChildren(template.content.cloneNode(true));show(caseDialog,trigger);caseDialog.scrollTop=0;initCarousels();initPreviews();
}
document.addEventListener('click',e=>{
 const close=e.target.closest('[data-close]');if(close){document.getElementById(close.dataset.close).close();return;}
 const step=e.target.closest('[data-player-step]');if(step){loadPlayer(playerIndex+Number(step.dataset.playerStep));return;}
 const c=e.target.closest('[data-case]');if(c){openCase(c.dataset.case,c);return;}
 const v=e.target.closest('[data-video]');if(v){playerItems=[...(v.closest('[data-carousel]')?.querySelectorAll('[data-video]')||[v])];show(videoDialog,v);loadPlayer(playerItems.indexOf(v));return;}
 const img=e.target.closest('[data-image]');if(img){document.getElementById('large-image').src=img.dataset.image;document.getElementById('large-image').alt=img.dataset.title;document.getElementById('image-title').textContent=img.dataset.title;show(imageDialog,img);return;}
 const jump=e.target.closest('[data-case-jump]');if(jump){const target=document.getElementById(jump.dataset.caseJump);target?.focus({preventScroll:true});target?.scrollIntoView({block:'start',behavior:reduce.matches?'instant':'smooth'});}
});
document.querySelectorAll('dialog').forEach(d=>{
 d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});
 d.addEventListener('close',()=>{if(d===videoDialog){player.pause();player.removeAttribute('src');player.load();}if(d===imageDialog)document.getElementById('large-image').removeAttribute('src');if(d===caseDialog){caseContent.replaceChildren();initPreviews();initCarousels();}const target=opener.get(d);if(target?.isConnected)target.focus({preventScroll:true});choosePreview();});
});
player.addEventListener('error',()=>{if(player.hasAttribute('src'))document.getElementById('video-error').hidden=false;});
toggle.addEventListener('click',()=>{previewsEnabled=!previewsEnabled;updateToggle();choosePreview();});
reduce.addEventListener('change',()=>{previewsEnabled=!reduce.matches&&!navigator.connection?.saveData;updateToggle();choosePreview();});
document.addEventListener('visibilitychange',choosePreview);
window.addEventListener('resize',()=>carouselUpdates.forEach(update=>update()));
updateToggle();initCarousels();initPreviews();

// Public case URLs retain the original client links after regrouping.
(() => {
 const aliases={
  'business-ai-channel':'nikolay-khlebinskiy','brazil-conference':'hash-hedge',
  'ai-host':'ai','azu':'ai','animated-short':'ai',
  'animated-series':'ai','fruit-drama':'ai','digital-character':'hash-hedge',
  'company-promo':'hash-hedge','website-banner':'hash-hedge','vertical-campaign':'hash-hedge',
  'english-project-one':'editing','english-project-two':'editing',
  'product-guide':'hash-hedge','trading-explainer':'editing',
  'fedos':'editing','finance-video':'editing','new-year-video':'editing','match-tv':'projects',
  'mamina-nedelka':'ai','ai-stories':'ai','headliners':'ai','lara-trader':'ai',
  'alexey-gasilin':'editing','media-production':'nikolay-khlebinskiy','cyberspot':'projects'
 };
 function followHash(){
  let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
  id=aliases[id]||id;
  if(document.getElementById('case-'+id)){openCase(id);history.replaceState(null,'','#'+id);}
  else if(aliases[location.hash.slice(1)])document.getElementById(id)?.scrollIntoView();
 }
 document.addEventListener('click',e=>{const button=e.target.closest('[data-case]');if(button)history.replaceState(null,'','#'+button.dataset.case);});
 caseDialog.addEventListener('close',()=>{if(!caseDialog.open&&document.getElementById('case-'+location.hash.slice(1)))history.replaceState(null,'','#projects');});
 document.querySelectorAll('video').forEach(v=>v.addEventListener('contextmenu',e=>e.preventDefault()));
 window.addEventListener('hashchange',followHash);
 followHash();
})();
