(()=>{
 const base=window.LEXICON_PORTABLE?.relayUrl||'https://lexicon-result-relay.lexicon-result-relay.workers.dev';
 const $=id=>document.getElementById(id);let t=k=>k,current=()=>[],query=()=>'',connection,active=false,last='',pending=null,outgoing=Promise.resolve(),subscriptionPending=null,pushReady=false;
 try{connection=JSON.parse(localStorage.getItem('lexicon.web.relay'));active=JSON.parse(localStorage.getItem('lexicon.web.relayActive'))===true}catch{}
 function valid(c){try{const u=new URL(c.read_url);return /^[a-f0-9-]{36}$/.test(c.channel)&&/^[A-Za-z0-9_-]{43}$/.test(c.write_token)&&u.origin===base&&u.pathname==='/v1/channels/'+c.channel+'/latest'&&/^[A-Za-z0-9_-]{43}$/.test(u.searchParams.get('key'))}catch{return false}}
 if(!valid(connection)){connection=null;active=false}
 const ios=()=>!window.LexiconAndroid&&(/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1));
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const usesPush=()=>ios();
 const canPush=()=>isSecureContext&&'Notification'in window&&'serviceWorker'in navigator&&'PushManager'in window&&(!ios()||standalone());
 function save(){try{localStorage.setItem('lexicon.web.relay',JSON.stringify(connection));localStorage.setItem('lexicon.web.relayActive',JSON.stringify(active))}catch{}}
 function refresh(message){if(!$('relay-connect'))return;$('relay-active').checked=active;$('relay-connect').hidden=!!connection;$('relay-watch').hidden=false;$('relay-copy-url').disabled=!connection;$('relay-read-url').value=connection?.read_url||'';$('relay-status').textContent=message||'';$('relay-status').hidden=!message}
 async function api(path,options={}){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);try{const response=await fetch(base+path,{...options,headers:{'Content-Type':'application/json',...(connection?{Authorization:'Bearer '+connection.write_token}:{}),...options.headers},cache:'no-store',referrerPolicy:'no-referrer',signal:controller.signal});if(!response.ok)throw Error(response.status===429?'limit':'relay');return await response.json()}finally{clearTimeout(timer)}}
 async function connect({watch=true}={}){
  if(!connection){
   if(!pending){
    pending=(async()=>{
     const result=await api('/v1/connect',{method:'POST'});
     if(!valid(result))throw Error('relay');
     connection=result;
     save();
     window.dispatchEvent(new Event('lexicon:relay-connected'));
    })().finally(()=>{pending=null});
   }
   await pending;
  }
  if(watch)active=true;
  save();refresh();
  return connection;
 }
 const connectionError=error=>t(error?.message==='limit'?'relayLimit':'relayFailed');
 async function copyLink(value,inputId,anchor,showStatus){
  const link=Promise.resolve(value);
  let clipboardWrite;
  // Safari needs the clipboard call during the click, even if the URL is still loading.
  if(!window.LexiconAndroid&&window.ClipboardItem&&navigator.clipboard?.write){
   try{
    const content=link.then(url=>new Blob([url],{type:'text/plain'}));
    void content.catch(()=>{});
    clipboardWrite=navigator.clipboard.write([new ClipboardItem({'text/plain':content})])
     .then(()=>true,()=>false);
   }catch{}
  }
  const url=await link;
  if(!url)return false;
  try{
   if(window.LexiconAndroid)window.LexiconAndroid.copyText(url);
   else if(!await clipboardWrite)await navigator.clipboard.writeText(url);
  }catch{
   const input=$(inputId);
   input.focus();input.select();
   showStatus(t('relayCopyManually'));
   return false;
  }
  showStatus(t('relayCopied'));
  window.LexiconToast(t('relayCopied'),anchor);
  return true;
 }
 const path=kind=>'/v1/channels/'+connection.channel+'/'+kind;
 const pushWanted=()=>ios()&&window.LexiconResults?.wantsNotifications()===true;
 const transportEnabled=()=>active||window.LexiconApi?.ownEnabled()||window.LexiconRemote?.enabled()||pushWanted();
 async function enqueue(payload){
  if(!transportEnabled())return false;
  let notificationReady=true;
  if(pushWanted())try{await subscribe()}catch(e){notificationReady=false;window.LexiconResults?.refresh(notificationError(e))}
  // Push permission/subscription errors must not block independent result outputs.
  if(!connection)return false;
  outgoing=outgoing.catch(()=>false).then(async()=>{
   if(!transportEnabled())return false;
   const actual={...payload,watch_enabled:payload.watch_enabled&&active,notifications_enabled:payload.notifications_enabled&&pushWanted()&&notificationReady};
   if(!actual.watch_enabled&&!actual.api_enabled&&!actual.passwordx_enabled&&!actual.notifications_enabled)return false;
   const signature=JSON.stringify(actual);
   if(!payload.test&&last===signature)return true;
   try{
    const response=await api(path('result'),{method:'POST',body:JSON.stringify(actual)});
    let pushFailed=false;
    if(actual.notifications_enabled&&(actual.test||!actual.silent)&&!response.duplicate&&!(response.push_delivered>0)){
     pushFailed=true;pushReady=false;const detail=response.errors?.[0];
     window.LexiconResults?.refresh(t(response.push_status==='no_subscription'?'notificationNoSubscription':'notificationPushRejected')+(detail?' ('+detail+')':''));
    }else if(actual.notifications_enabled&&response.push_delivered>0)window.LexiconResults?.refresh(t('notificationPushAccepted'));
    if(!payload.test&&!pushFailed)last=signature;
    refresh();return !pushFailed||actual.watch_enabled||actual.api_enabled||actual.passwordx_enabled;
   }catch{refresh(t('relayFailed'));return false}
  });return outgoing;
 }
 async function publish(rows,{test=false,silent=false}={}){
  if(!rows.length)return false;const format=window.LexiconResultFormat('impaler'),notification_format=window.LexiconResultFormat('notification');if(!window.LexiconRemote?.enabled()&&!format.fields.length&&!notification_format.fields.length&&!(window.LexiconApi?.ownEnabled()&&window.LexiconResultFormat('api').fields.length))return false;
  const results=rows.map(({word,page,column,position})=>({word,page,column,position}));return enqueue({results,test,format,notification_format,silent,notifications_enabled:pushWanted(),api_format:window.LexiconResultFormat('api'),api_enabled:window.LexiconApi?.ownEnabled()===true,passwordx_enabled:window.LexiconRemote?.enabled()===true,passwordx_use_suggestion:window.LexiconRemote?.useSuggestion?.()===true,watch_enabled:active});
 }
 async function publishUnknown(value,suggestions=window.LexiconApproximateResults?.()||[],options={}){const text=String(value).replace(/[\x00-\x1f\x7f]/g,' ').trim().slice(0,512);if(!text)return false;return enqueue({results:[],unmatched:true,query:text,suggested_results:suggestions,silent:options.silent===true,notify_unmatched:pushWanted(),notifications_enabled:pushWanted(),notification_format:window.LexiconResultFormat('notification'),format:window.LexiconResultFormat('impaler'),api_format:window.LexiconResultFormat('api'),api_enabled:window.LexiconApi?.ownEnabled()===true,passwordx_enabled:window.LexiconRemote?.enabled()===true,passwordx_use_suggestion:window.LexiconRemote?.useSuggestion?.()===true,watch_enabled:active})}
 const publishCurrent=(options={})=>current().length?publish(current(),options):query()?publishUnknown(query(),window.LexiconApproximateResults?.()||[],options):false;
 function notificationError(error){const key={permission:'notificationDenied',connection:'notificationConnectionFailed',config:'notificationServerFailed',worker:'notificationWorkerFailed',device:'notificationSubscribeFailed',register:'notificationRegisterFailed'}[error?.notificationStage]||'notificationFailed';return t(key)}
 async function subscribe({force=false}={}){if(force)pushReady=false;if(pushReady)return true;if(subscriptionPending)return subscriptionPending;
  subscriptionPending=(async()=>{let stage='permission';try{
   if(!canPush()||Notification.permission!=='granted')throw Error('permission');stage='connection';await connect({watch:false});stage='config';const config=await api('/v1/config');if(!config.push_configured)throw Error('relay');
   stage='worker';let timer,registration;try{registration=await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('worker')),10000)})])}finally{clearTimeout(timer)}
   stage='device';let sub=await registration.pushManager.getSubscription();const bytes=Uint8Array.from(atob(config.public_key.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0));
   if(sub&&sub.options.applicationServerKey&&Array.from(new Uint8Array(sub.options.applicationServerKey)).join()!==Array.from(bytes).join()){await sub.unsubscribe();sub=null}
   if(!sub)sub=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:bytes});
   stage='register';await api(path('subscription'),{method:'POST',body:JSON.stringify({...sub.toJSON(),notification_format:window.LexiconResultFormat('notification')})});pushReady=true;return true;
  }catch(error){error.notificationStage=stage;throw error}})();
  try{return await subscriptionPending}finally{subscriptionPending=null}
 }

 async function unsubscribe(){pushReady=false;const results=await Promise.allSettled([
  (async()=>{const reg=await navigator.serviceWorker?.getRegistration();const sub=await reg?.pushManager?.getSubscription();if(sub)await sub.unsubscribe()})(),
  connection?api(path('subscription'),{method:'DELETE'}):Promise.resolve()
 ]);const failed=results.find(r=>r.status==='rejected');if(failed)throw failed.reason}

 window.LexiconRelay={connect,copyLink,connectionError,notificationError,notificationStatus:()=>connection?api(path("notification-status")):Promise.resolve(null),configuration:()=>api('/v1/config'),passwordUrl:()=>connection?.read_url.replace('/latest?','/passwordx?')||'',publishCurrent,clearPassword:()=>connection?api(path("passwordx"),{method:"DELETE"}):Promise.resolve(),updateSource:source=>api(path('source'),{method:'POST',body:JSON.stringify({...source,watch_enabled:active,api_enabled:window.LexiconApi?.ownEnabled()===true,passwordx_enabled:window.LexiconRemote?.enabled()===true,passwordx_use_suggestion:window.LexiconRemote?.useSuggestion?.()===true,notifications_enabled:pushWanted(),notification_format:window.LexiconResultFormat('notification'),format:window.LexiconResultFormat('impaler'),api_format:window.LexiconResultFormat('api')})}),apiDetails:()=>connection?{get_url:connection.read_url.replace('/latest?','/output?'),input_url:connection.read_url.replace('/latest?','/input?'),post_url:base+path('input'),write_token:connection.write_token}:null,canPush,usesPush,publish,publishUnknown,subscribe,unsubscribe,refresh,
  init(translate,rows,unmatchedQuery=()=>'' ){t=translate;current=rows;query=unmatchedQuery;refresh();
   const switchWatch=$('relay-active'),getLink=$('relay-connect'),copyButton=$('relay-copy-url');
   async function enableWatch(copy){
    getLink.disabled=true;switchWatch.disabled=true;
    const ready=connect();
    try{
     if(copy)await copyLink(ready.then(channel=>channel.read_url),'relay-read-url',copyButton,refresh);
     else await ready;
     const message=$('relay-status').textContent;
     await window.LexiconRemote?.sync();
     await publishCurrent();
     if(message)refresh(message);
    }catch(error){refresh(connectionError(error))}
    finally{getLink.disabled=false;switchWatch.disabled=false}
   }
   getLink.onclick=()=>enableWatch(true);
   switchWatch.onchange=async()=>{
    if(switchWatch.checked){await enableWatch(false);return}
    active=false;last='';save();refresh();
    window.dispatchEvent(new Event('lexicon:relay-disabled'));
    await window.LexiconRemote?.sync();
   };
   copyButton.onclick=()=>copyLink(connection?.read_url,'relay-read-url',copyButton,refresh);
   window.addEventListener('online',()=>publishCurrent());window.addEventListener('lexicon:format-changed',event=>{if(event.detail?.target&&!['impaler','notification','api'].includes(event.detail.target))return;last='';publishCurrent({silent:true})});
  }
 };
})();
