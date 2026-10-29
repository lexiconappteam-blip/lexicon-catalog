/* Follow the visible viewport instead of putting results behind a mobile keyboard. */
(()=>{
 const root=document.documentElement,view=document.getElementById('search-view'),query=document.getElementById('query'),done=document.getElementById('keyboard-done');
 const viewport=window.visualViewport;let baseline=innerHeight,opened=false,scrollBefore=0,frame;
 function update(){
  const touchLayout=innerWidth<=700||(matchMedia('(pointer: coarse)').matches&&innerWidth<=1100);
  const focused=document.activeElement===query&&!query.readOnly&&!view.hidden;
  if(!focused&&!opened)baseline=Math.max(innerHeight,root.clientHeight);
  const height=viewport?.height||innerHeight,top=viewport?.offsetTop||0;
  const lostHeight=Math.max(baseline,innerHeight,root.clientHeight)-height;
  const active=touchLayout&&focused&&lostHeight>120&&(!viewport||Math.abs(viewport.scale-1)<.05);
  if(active&&!opened)scrollBefore=window.scrollY;
  root.style.setProperty('--visible-height',height+'px');root.style.setProperty('--visible-top',top+'px');
  root.classList.toggle('keyboard-open',active);done.hidden=!active;
  if(opened&&!active&&!view.hidden)window.scrollTo(0,scrollBefore);
  opened=active;
 }
 function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(update)}
 viewport?.addEventListener('resize',schedule);viewport?.addEventListener('scroll',schedule);
 window.addEventListener('resize',schedule);window.addEventListener('orientationchange',()=>{baseline=innerHeight;schedule()});
 query.addEventListener('focus',schedule);query.addEventListener('blur',schedule);
 done.onclick=()=>query.blur();
 query.addEventListener('keydown',e=>{if(e.key==='Enter'&&root.classList.contains('keyboard-open')&&document.getElementById('suggestions').hidden){e.preventDefault();query.blur()}});
 new MutationObserver(schedule).observe(view,{attributes:true,attributeFilter:['hidden']});
 new MutationObserver(schedule).observe(query,{attributes:true,attributeFilter:['readonly']});
 update();
})();
