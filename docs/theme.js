/* Apply before styles load to avoid a bright flash on restored dark screens. */
(()=>{
 const storageKey='lexicon.web.theme',media=matchMedia('(prefers-color-scheme: dark)');
 let choice='system';try{choice=JSON.parse(localStorage.getItem(storageKey))||'system'}catch{}
 if(!['system','light','dark'].includes(choice))choice='system';
 function apply(){
  const dark=choice==='dark'||choice==='system'&&media.matches;
  document.documentElement.dataset.theme=dark?'dark':'light';document.documentElement.style.colorScheme=dark?'dark':'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#171c1a':'#f5f5f1');
  try{window.LexiconAndroid?.applyTheme?.(dark)}catch{}
 }
 window.LexiconTheme={get:()=>choice,set:value=>{if(!['system','light','dark'].includes(value))return;choice=value;try{localStorage.setItem(storageKey,JSON.stringify(choice))}catch{}apply()}};
 media.addEventListener('change',apply);apply();
})();
