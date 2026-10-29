/* Keep search readable in Safari and embedded mobile browsers while editing. */
(()=>{
 const root=document.documentElement,query=document.getElementById('query'),catalog=document.getElementById('book-query');
 const views={search:document.getElementById('search-view'),books:document.getElementById('books-view')};
 const viewport=window.visualViewport;let baseline=innerHeight,opened=null,scrollBefore=0,frame,focusedField=null,hadKeyboard=false;
 function update(){
  const touch=matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0;
  const mobile=innerWidth<=700||(touch&&innerWidth<=1100);
  const field=document.activeElement;
  if(field!==focusedField){focusedField=field;hadKeyboard=false}
  const editing=field?.matches('input:not([type=checkbox]):not([type=radio]):not([type=button]),textarea')&&!field.readOnly&&!field.disabled;
  if(!editing&&!opened)baseline=Math.max(innerHeight,root.clientHeight);
  const height=viewport?.height||innerHeight,top=viewport?.offsetTop||0;
  const keyboard=Math.max(baseline,innerHeight,root.clientHeight)-height>120;
  // Hide navigation as soon as a touch user starts typing, including before
  // viewport resize and while an embedded browser still reports a zoomed scale.
  if(keyboard)hadKeyboard=true;
  const hideNavigation=mobile&&editing&&(keyboard||touch&&!hadKeyboard);
  const canPin=mobile&&editing&&keyboard&&(!viewport||Math.abs(viewport.scale-1)<.05);
  const active=canPin&&field===query&&!views.search.hidden?'search':canPin&&field===catalog&&!views.books.hidden?'books':null;
  if(active&&!opened)scrollBefore=window.scrollY;
  root.style.setProperty('--visible-height',height+'px');root.style.setProperty('--visible-top',top+'px');
  root.classList.toggle('mobile-editing',!!hideNavigation);
  root.classList.toggle('keyboard-open',active==='search');root.classList.toggle('catalog-keyboard-open',active==='books');
  document.getElementById('keyboard-done').hidden=!(hideNavigation&&field===query);
  document.getElementById('catalog-keyboard-done').hidden=!(hideNavigation&&field===catalog);
  if(opened&&!active&&!views[opened].hidden)window.scrollTo(0,scrollBefore);
  opened=active;
 }
 function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(update)}
 viewport?.addEventListener('resize',schedule);viewport?.addEventListener('scroll',schedule);
 window.addEventListener('resize',schedule);window.addEventListener('orientationchange',()=>{baseline=innerHeight;schedule()});
 document.addEventListener('pointerdown',e=>{if(e.target.matches('input,textarea')){hadKeyboard=false;schedule()}});
 document.addEventListener('focusin',schedule);document.addEventListener('focusout',schedule);
 document.getElementById('keyboard-done').onclick=()=>query.blur();
 document.getElementById('catalog-keyboard-done').onclick=()=>catalog.blur();
 document.addEventListener('keydown',e=>{if(e.key!=='Enter'||!root.classList.contains('mobile-editing'))return;if(document.activeElement===catalog||document.activeElement===query&&document.getElementById('suggestions').hidden){e.preventDefault();document.activeElement.blur()}});
 for(const view of Object.values(views))new MutationObserver(schedule).observe(view,{attributes:true,attributeFilter:['hidden']});
 new MutationObserver(schedule).observe(query,{attributes:true,attributeFilter:['readonly']});update();
})();
