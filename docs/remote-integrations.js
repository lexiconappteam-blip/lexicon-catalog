/* Independent six-digit output and automatic server-side Inject source. */
(()=>{
 const $=id=>document.getElementById(id),storage='lexicon.web.remote.v1';
 let capabilityRevision=0,sourceRevision=0;
 let cfg={passwordx:false,background:false},cap={},t=k=>k,context=()=>({}),saving=Promise.resolve(),capabilitiesReady=Promise.resolve(),modeSync=Promise.resolve();
 try{cfg={...cfg,...JSON.parse(localStorage.getItem(storage)||'{}')}}catch{}
 const save=()=>localStorage.setItem(storage,JSON.stringify(cfg));
 const status=(id,key)=>{$(id).textContent=key?t(key):'';$(id).hidden=!key};
 function refresh(){
  $('passwordx-active').checked=cfg.passwordx===true;
  $('passwordx-url').value=cap.passwordx_configured?LexiconRelay.passwordUrl():'';$('passwordx-copy').disabled=!$('passwordx-url').value;
  $('passwordx-connect').hidden=!!$('passwordx-url').value;
 }
 function refreshCapabilities(){
  const generation=++capabilityRevision;
  capabilitiesReady=LexiconRelay.configuration().then(config=>{
   if(generation!==capabilityRevision)return cap;
   cap=config;refresh();
   status('passwordx-status',cap.passwordx_configured?'':'remoteUnavailable');
   status('inject-background-status',cap.background_configured?'':'injectForegroundOnly');
   return cap;
  }).catch(()=>{if(generation!==capabilityRevision)return cap;cap={};refresh();status('passwordx-status','remoteUnavailable');status('inject-background-status','injectBackgroundConnectionFailed');return null});
  return capabilitiesReady;
 }
 const enabled=()=>cap.passwordx_configured===true&&cfg.passwordx===true;
 async function sync({explicit=false}={}){
  const generation=++sourceRevision;
  await capabilitiesReady;
  if(generation!==sourceRevision)return false;
  if(!cap.background_configured||!cfg.background&&!explicit)return;
  if(!cfg.background&&!LexiconRelay.apiDetails())return;
  const source={enabled:cfg.background===true,...context()};
  if(source.enabled&&!/^[A-Za-z0-9_-]{1,120}$/.test(source.inject_id||'')){status('inject-background-status','injectNeedId');return false}
  saving=saving.catch(()=>{}).then(async()=>{
   if(generation!==sourceRevision)return false;
   try{await LexiconRelay.connect({watch:false});if(generation!==sourceRevision)return false;await LexiconRelay.updateSource(source);if(generation===sourceRevision)status('inject-background-status','');return true}
   catch{if(generation===sourceRevision)status('inject-background-status','remoteSaveFailed');return false}
  });return saving;
 }
 window.LexiconRemote={getPreset:()=>({passwordx:cfg.passwordx===true,passwordxSuggestion:cfg.passwordxSuggestion===true}),applySuggestion(value){
  cfg.passwordxSuggestion=value===true;save();$('passwordx-use-suggestion').checked=cfg.passwordxSuggestion;
 },applyPreset(value={}){
  cfg.passwordx=value.passwordx===true;
  cfg.passwordxSuggestion=value.passwordxSuggestion===true;
  save();$('passwordx-use-suggestion').checked=cfg.passwordxSuggestion;refresh();
 },enabled,sync,useSuggestion:()=>cfg.passwordxSuggestion===true,setInjectActive(active){if(!active&&!cfg.background)return modeSync;cfg.background=active===true;save();modeSync=sync({explicit:true});return modeSync},init(translate,getContext){t=translate;context=getContext;refresh();
  refreshCapabilities();window.addEventListener('online',()=>{refreshCapabilities().then(value=>{if(value?.background_configured&&(cfg.background||LexiconRelay.apiDetails()))sync({explicit:true})})});
  const suggestion=$('passwordx-use-suggestion');
  suggestion.checked=cfg.passwordxSuggestion===true;
  suggestion.onchange=async()=>{
   cfg.passwordxSuggestion=suggestion.checked;
   save();
   await sync();
   if(enabled())await LexiconRelay.publishCurrent({silent:true});
  };
  const getLink=$('passwordx-connect'),toggle=$('passwordx-active'),copyButton=$('passwordx-copy');
  const showStatus=message=>{
   $('passwordx-status').textContent=message;
   $('passwordx-status').hidden=!message;
  };
  async function enablePassword(copy){
   const old=cfg.passwordx;
   getLink.disabled=true;toggle.disabled=true;
   const ready=(async()=>{
    await capabilitiesReady;
    if(!cap.passwordx_configured){
     cap=await LexiconRelay.configuration();
     refresh();
    }
    if(!cap.passwordx_configured)throw Error('unavailable');
    await LexiconRelay.connect({watch:false});
    cfg.passwordx=true;save();refresh();
    return LexiconRelay.passwordUrl();
   })();
   try{
    if(copy)await LexiconRelay.copyLink(ready,'passwordx-url',copyButton,showStatus);
    else{await ready;showStatus('')}
    await sync();
    await LexiconRelay.publishCurrent();
   }catch(error){
    cfg.passwordx=old;save();refresh();
    showStatus(error.message==='unavailable'?t('remoteUnavailable'):LexiconRelay.connectionError(error));
   }finally{getLink.disabled=false;toggle.disabled=false}
  }
  getLink.onclick=()=>enablePassword(true);
  toggle.onchange=async()=>{
   if(toggle.checked){await enablePassword(false);return}
   cfg.passwordx=false;toggle.disabled=true;
   try{
    await LexiconRelay.clearPassword();
    if(await sync()===false)throw Error('source');
    save();showStatus('');
   }catch{
    cfg.passwordx=true;showStatus(t('remoteSaveFailed'));
   }finally{toggle.disabled=false;refresh()}
  };
  copyButton.onclick=()=>LexiconRelay.copyLink(LexiconRelay.passwordUrl(),'passwordx-url',copyButton,showStatus);
  window.addEventListener('lexicon:relay-connected',refresh);
  for(const event of ['lexicon:format-changed','lexicon:api-config'])window.addEventListener(event,()=>sync());
 }};
})();
