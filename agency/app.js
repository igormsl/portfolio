const caseDialog=document.getElementById('case-dialog');
const videoDialog=document.getElementById('video-dialog');
const briefDialog=document.getElementById('brief-dialog');
const video=document.getElementById('player');
function openCase(id){const t=document.getElementById('case-'+id);if(!t)return;document.getElementById('case-content').replaceChildren(t.content.cloneNode(true));caseDialog.showModal();caseDialog.scrollTop=0;}
function openVideo(button){document.getElementById('video-title').textContent=button.dataset.title;const url=button.dataset.src;document.getElementById('video-error').hidden=true;document.getElementById('video-fallback').href=url;video.src=url;videoDialog.showModal();video.play().catch(()=>{});}
document.addEventListener('click',async e=>{const c=e.target.closest('[data-case]');if(c)openCase(c.dataset.case);const v=e.target.closest('[data-video]');if(v)openVideo(v);const x=e.target.closest('[data-close]');if(x)document.getElementById(x.dataset.close).close();const b=e.target.closest('[data-brief]');if(b){if(b.dataset.brief)document.getElementById('service-choice').value=b.dataset.brief;briefDialog.showModal();}const f=e.target.closest('[data-filter]');if(f){const area=f.closest('[data-filter-scope]');area.querySelectorAll('[data-filter]').forEach(p=>p.setAttribute('aria-pressed',String(p===f)));let count=0;area.querySelectorAll('[data-category]').forEach(item=>{item.hidden=f.dataset.filter!=='all'&&item.dataset.category!==f.dataset.filter;if(!item.hidden)count++;});area.querySelector('[data-count]').textContent='Показано: '+count;}if(e.target.closest('#copy-brief')){const text='Здравствуйте! Интересует '+document.getElementById('service-choice').value+'. '+document.getElementById('task-text').value;try{await navigator.clipboard.writeText(text);document.getElementById('copy-status').textContent='Текст скопирован. Отправьте его в Telegram.';}catch{document.getElementById('copy-status').textContent='Копирование недоступно. Выделите и скопируйте текст задачи вручную.';}}});
document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});});
videoDialog.addEventListener('close',()=>{video.pause();video.removeAttribute('src');video.load();});
video.addEventListener('error',()=>{if(video.getAttribute('src'))document.getElementById('video-error').hidden=false;});

// Muted, one-at-a-time previews. Full video only starts after an explicit click.
(() => {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),toggle=document.getElementById('motion-toggle');
 let enabled=!reduce.matches&&!navigator.connection?.saveData,active=null,hovered=null;
 const visible=new Map(),watched=new WeakSet();
 const modal=()=>[...document.querySelectorAll('dialog[open]')].at(-1);
 const pause=v=>{v.pause();v.classList.remove('is-playing');if(v.getAttribute('src')){v.removeAttribute('src');v.load();}};
 function label(){toggle.setAttribute('aria-pressed',String(enabled));toggle.textContent=enabled?'Пауза превью  Ⅱ':'Включить превью  ▶';}
 function choose(){
  const dialog=modal();
  const allowed=v=>visible.get(v)>.4&&!v.closest('[hidden]')&&(!dialog||dialog.id==='case-dialog'&&dialog.contains(v));
  let next=null;
  if(enabled&&!document.hidden&&(!dialog||dialog.id==='case-dialog')){
   next=hovered&&allowed(hovered)?hovered:[...visible.keys()].find(v=>v.isConnected&&allowed(v));
  }
  if(active===next)return;if(active)pause(active);active=next;
  if(next){next.muted=true;if(!next.getAttribute('src'))next.src=next.dataset.preview;next.play().then(()=>{if(active===next)next.classList.add('is-playing');else pause(next);}).catch(()=>{next.classList.remove('is-playing');});}
 }
 const observer=new IntersectionObserver(entries=>{for(const e of entries)visible.set(e.target,e.intersectionRatio);choose();},{threshold:[0,.4,.7]});
 function init(){
  for(const v of visible.keys())if(!v.isConnected){pause(v);observer.unobserve(v);visible.delete(v);}
  document.querySelectorAll('[data-preview]').forEach(v=>{if(watched.has(v))return;watched.add(v);observer.observe(v);const button=v.closest('button');if(button){button.addEventListener('pointerenter',()=>{hovered=v;choose();});button.addEventListener('pointerleave',()=>{hovered=null;choose();});button.addEventListener('focus',()=>{hovered=v;choose();});button.addEventListener('blur',()=>{hovered=null;choose();});}});
  document.querySelectorAll('[data-gallery]').forEach(g=>{if(g.dataset.ready)return;g.dataset.ready='true';const track=g.querySelector('.gallery-track'),slides=[...track.children],counter=g.querySelector('[data-gallery-count]');let index=0;
   function update(){index=slides.reduce((best,s,i)=>Math.abs(s.offsetLeft-track.offsetLeft-track.scrollLeft)<Math.abs(slides[best].offsetLeft-track.offsetLeft-track.scrollLeft)?i:best,0);counter.textContent=(index+1)+' / '+slides.length;g.querySelector('[data-slide="-1"]').disabled=track.scrollLeft<2;g.querySelector('[data-slide="1"]').disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-3;}
   const go=step=>{const target=slides[Math.max(0,Math.min(slides.length-1,index+step))];track.scrollTo({left:target.offsetLeft-slides[0].offsetLeft,behavior:reduce.matches?'auto':'smooth'});};
   g.querySelectorAll('[data-slide]').forEach(b=>b.addEventListener('click',()=>go(Number(b.dataset.slide))));track.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();go(e.key==='ArrowLeft'?-1:1);}if(e.key==='Home'||e.key==='End'){e.preventDefault();track.scrollTo({left:e.key==='Home'?0:track.scrollWidth,behavior:'instant'});}});track.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(track);update();
  });choose();
 }
 toggle.addEventListener('click',()=>{enabled=!enabled;label();choose();});reduce.addEventListener('change',()=>{enabled=!reduce.matches&&!navigator.connection?.saveData;label();choose();});document.addEventListener('visibilitychange',choose);
 const mutation=new MutationObserver(()=>init());mutation.observe(document.getElementById('case-content'),{childList:true});
 document.querySelectorAll('dialog').forEach(d=>{new MutationObserver(choose).observe(d,{attributes:true,attributeFilter:['open']});d.addEventListener('close',choose);});
 document.addEventListener('click',e=>{
  const jump=e.target.closest('[data-case-jump]');
  if(jump){const target=document.getElementById(jump.dataset.caseJump);if(target){target.focus({preventScroll:true});target.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'start'});}return;}
  const b=e.target.closest('[data-image]');if(!b)return;const d=document.getElementById('image-dialog'),img=document.getElementById('large-image');img.src=b.dataset.image;img.alt=b.dataset.title;document.getElementById('image-title').textContent=b.dataset.title;d.showModal();choose();
 });
 document.getElementById('image-dialog').addEventListener('click',e=>{if(e.target.id==='image-dialog')e.target.close();});
 label();init();
})();

// Public case URLs retain the original client links after regrouping.
(() => {
 const aliases={
  'business-ai-channel':'nikolay-khlebinskiy','brazil-conference':'hash-hedge',
  'ai-host':'lara-trader','azu':'mamina-nedelka','animated-short':'mamina-nedelka',
  'animated-series':'ai-stories','fruit-drama':'ai-stories','digital-character':'hash-hedge',
  'company-promo':'hash-hedge','website-banner':'hash-hedge','vertical-campaign':'hash-hedge',
  'english-project-one':'lara-trader','english-project-two':'lara-trader',
  'product-guide':'hash-hedge','trading-explainer':'lara-trader',
  'fedos':'editing','finance-video':'editing','new-year-video':'editing','match-tv':'projects'
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
