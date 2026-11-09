/* Independent six-digit output and automatic server-side Inject source. */
(()=>{
 const $=id=>document.getElementById(id),storage='lexicon.web.remote.v1';
 let cfg={passwordx:false,background:false},cap={},t=k=>k,context=()=>({}),saving=Promise.resolve(),capabilitiesReady=Promise.resolve(),modeSync=Promise.resolve();
 try{cfg={...cfg,...JSON.parse(localStorage.getItem(storage)||'{}')}}catch{}
 const save=()=>localStorage.setItem(storage,JSON.stringify(cfg));
 const status=(id,key)=>{$(id).textContent=key?t(key):'';$(id).hidden=!key};
 function refresh(){
  $('passwordx-active').disabled=!cap.passwordx_configured;$('passwordx-active').checked=enabled();
  $('passwordx-connect').disabled=!cap.passwordx_configured;
  $('passwordx-url').value=cap.passwordx_configured?LexiconRelay.passwordUrl():'';$('passwordx-copy').disabled=!$('passwordx-url').value;
 }
 const enabled=()=>cap.passwordx_configured===true&&cfg.passwordx===true;
 async function sync({explicit=false}={}){
  await capabilitiesReady;
  if(!cap.background_configured||!cfg.background&&!explicit)return;
  if(!cfg.background&&!LexiconRelay.apiDetails())return;
  const source={enabled:cfg.background===true,...context()};
  if(source.enabled&&!/^[A-Za-z0-9_-]{1,120}$/.test(source.inject_id||'')){status('inject-background-status','injectNeedId');return false}
  saving=saving.catch(()=>{}).then(async()=>{
   try{await LexiconRelay.connect({watch:false});await LexiconRelay.updateSource(source);status('inject-background-status',source.enabled?'remoteSaved':'');return true}
   catch{status('inject-background-status','remoteSaveFailed');return false}
  });return saving;
 }
 window.LexiconRemote={enabled,sync,setInjectActive(active){if(!active&&!cfg.background)return modeSync;cfg.background=active===true;save();modeSync=sync({explicit:true});return modeSync},init(translate,getContext){t=translate;context=getContext;refresh();
  capabilitiesReady=LexiconRelay.configuration().then(config=>{cap=config;refresh();if(!cap.passwordx_configured)status('passwordx-status','remoteUnavailable');if(!cap.background_configured)status('inject-background-status','remoteUnavailable')}).catch(()=>{status('passwordx-status','remoteUnavailable');status('inject-background-status','remoteUnavailable')});
  $('passwordx-connect').onclick=async()=>{try{await LexiconRelay.connect({watch:false});cfg.passwordx=true;save();refresh();await LexiconRelay.publishCurrent();await sync();status('passwordx-status','passwordxHelp')}catch{status('passwordx-status','remoteSaveFailed')}};
  $('passwordx-active').onchange=async()=>{const old=cfg.passwordx;try{cfg.passwordx=$('passwordx-active').checked;if(cfg.passwordx)await LexiconRelay.connect({watch:false});if(cfg.passwordx)await LexiconRelay.publishCurrent();else await LexiconRelay.clearPassword();const ok=await sync();if(ok===false)throw Error('source');save()}catch{cfg.passwordx=old;status('passwordx-status','remoteSaveFailed')}refresh()};
  $('passwordx-copy').onclick=async()=>{try{const value=$('passwordx-url').value;if(window.LexiconAndroid)LexiconAndroid.copyText(value);else await navigator.clipboard.writeText(value);LexiconToast(t('copied'),$('passwordx-copy'))}catch{$('passwordx-url').focus();$('passwordx-url').select()}};
  window.addEventListener('lexicon:relay-connected',refresh);
  for(const event of ['lexicon:format-changed','lexicon:api-config'])window.addEventListener(event,()=>sync());
 }};
})();
