(()=>{
 const base='https://lexicon-result-relay.lexicon-result-relay.workers.dev';
 const $=id=>document.getElementById(id);let t=k=>k,current=()=>[],query=()=>'',connection,active=false,last='',pending=null,outgoing=Promise.resolve(),subscriptionPending=null,pushReady=false;
 try{connection=JSON.parse(localStorage.getItem('lexicon.web.relay'));active=JSON.parse(localStorage.getItem('lexicon.web.relayActive'))===true}catch{}
 function valid(c){try{const u=new URL(c.read_url);return /^[a-f0-9-]{36}$/.test(c.channel)&&/^[A-Za-z0-9_-]{43}$/.test(c.write_token)&&u.origin===base&&u.pathname==='/v1/channels/'+c.channel+'/latest'&&/^[A-Za-z0-9_-]{43}$/.test(u.searchParams.get('key'))}catch{return false}}
 if(!valid(connection)){connection=null;active=false}
 const ios=()=>!window.LexiconAndroid&&(/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1));
 const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const usesPush=()=>ios();
 const canPush=()=>isSecureContext&&'Notification'in window&&'serviceWorker'in navigator&&'PushManager'in window&&(!ios()||standalone());
 function save(){try{localStorage.setItem('lexicon.web.relay',JSON.stringify(connection));localStorage.setItem('lexicon.web.relayActive',JSON.stringify(active))}catch{}}
 function refresh(message){if(!$('relay-connect'))return;$('relay-active').checked=active;$('relay-active').disabled=!connection;$('relay-connect').hidden=!!connection;$('relay-watch').hidden=false;$('relay-copy-url').disabled=!connection;$('relay-read-url').value=connection?.read_url||'';$('relay-status').textContent=message||'';$('relay-status').hidden=!message}
 async function api(path,options={}){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);try{const response=await fetch(base+path,{...options,headers:{'Content-Type':'application/json',...(connection?{Authorization:'Bearer '+connection.write_token}:{}),...options.headers},cache:'no-store',referrerPolicy:'no-referrer',signal:controller.signal});if(!response.ok)throw Error(response.status===429?'limit':'relay');return await response.json()}finally{clearTimeout(timer)}}
 async function connect({watch=true}={}){if(connection){if(watch)active=true;save();refresh();return connection}if(pending)return pending;
  pending=(async()=>{const c=await api('/v1/connect',{method:'POST'});if(!valid(c))throw Error('relay');connection=c;active=watch;save();refresh();window.dispatchEvent(new Event('lexicon:relay-connected'));return c})();try{return await pending}finally{pending=null}
 }
 const path=kind=>'/v1/channels/'+connection.channel+'/'+kind;
 const pushWanted=()=>ios()&&window.LexiconResults?.wantsNotifications()===true;
 const transportEnabled=()=>active||window.LexiconApi?.ownEnabled()||pushWanted();
 async function enqueue(payload){
  if(!transportEnabled())return false;if(pushWanted())try{await subscribe()}catch{refresh(t('relayFailed'));return false}if(!connection)return false;const signature=JSON.stringify(payload);
  outgoing=outgoing.catch(()=>false).then(async()=>{
   if(!transportEnabled())return false;if(!payload.test&&last===signature)return true;
   try{const actual={...payload,watch_enabled:payload.watch_enabled&&active,notifications_enabled:payload.notifications_enabled&&pushWanted()};const response=await api(path('result'),{method:'POST',body:JSON.stringify(actual)});if(actual.notifications_enabled&&(actual.test||!actual.silent)&&!response.duplicate&&!(response.push_delivered>0)){pushReady=false;window.LexiconResults?.refresh(t('notificationFailed'));throw Error('push')}if(actual.notifications_enabled&&response.push_delivered>0)window.LexiconResults?.refresh();if(!payload.test)last=signature;refresh();return true}catch{refresh(t('relayFailed'));return false}
  });return outgoing;
 }
 async function publish(rows,{test=false,silent=false}={}){
  if(!rows.length)return false;const format=window.LexiconResultFormat('impaler'),notification_format=window.LexiconResultFormat('notification');if(!format.fields.length&&!notification_format.fields.length&&!(window.LexiconApi?.ownEnabled()&&window.LexiconResultFormat('api').fields.length))return false;
  const results=rows.map(({word,page,column,position})=>({word,page,column,position}));return enqueue({results,test,format,notification_format,silent,notifications_enabled:pushWanted(),api_format:window.LexiconResultFormat('api'),api_enabled:window.LexiconApi?.ownEnabled()===true,watch_enabled:active});
 }
 async function publishUnknown(value,suggestions=window.LexiconApproximateResults?.()||[],options={}){const text=String(value).replace(/[\x00-\x1f\x7f]/g,' ').trim().slice(0,512);if(!text)return false;return enqueue({results:[],unmatched:true,query:text,suggested_results:suggestions,silent:options.silent===true,notify_unmatched:pushWanted(),notifications_enabled:pushWanted(),notification_format:window.LexiconResultFormat('notification'),format:window.LexiconResultFormat('impaler'),api_format:window.LexiconResultFormat('api'),api_enabled:window.LexiconApi?.ownEnabled()===true,watch_enabled:active})}
 const publishCurrent=(options={})=>current().length?publish(current(),options):query()?publishUnknown(query(),window.LexiconApproximateResults?.()||[],options):false;
 async function subscribe({force=false}={}){if(force)pushReady=false;if(pushReady)return true;if(subscriptionPending)return subscriptionPending;
  subscriptionPending=(async()=>{if(!canPush()||Notification.permission!=='granted')throw Error('permission');await connect({watch:false});const config=await api('/v1/config');if(!config.push_configured)throw Error('relay');
   let timer;let registration;try{registration=await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('worker')),10000)})])}finally{clearTimeout(timer)}
   let sub=await registration.pushManager.getSubscription();const bytes=Uint8Array.from(atob(config.public_key.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0));
   if(sub&&sub.options.applicationServerKey&&Array.from(new Uint8Array(sub.options.applicationServerKey)).join()!==Array.from(bytes).join()){await sub.unsubscribe();sub=null}
   if(!sub)sub=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:bytes});await api(path('subscription'),{method:'POST',body:JSON.stringify(sub.toJSON())});pushReady=true;return true})();
  try{return await subscriptionPending}finally{subscriptionPending=null}
 }

 async function unsubscribe(){pushReady=false;let failure;try{if(connection)await api(path('subscription'),{method:'DELETE'})}catch(e){failure=e}const reg=await navigator.serviceWorker?.getRegistration();const sub=await reg?.pushManager?.getSubscription();if(sub)await sub.unsubscribe();if(failure)throw failure}
 window.LexiconRelay={connect,apiDetails:()=>connection?{get_url:connection.read_url.replace('/latest?','/output?'),input_url:connection.read_url.replace('/latest?','/input?'),post_url:base+path('input'),write_token:connection.write_token}:null,canPush,usesPush,publish,publishUnknown,subscribe,unsubscribe,refresh,
  init(translate,rows,unmatchedQuery=()=>'' ){t=translate;current=rows;query=unmatchedQuery;refresh();
   $('relay-connect').onclick=async()=>{const button=$('relay-connect');button.disabled=true;try{await connect();await publishCurrent()}catch(e){refresh(t(e.message==='limit'?'relayLimit':'relayFailed'))}finally{button.disabled=false}};
   $('relay-active').onchange=async()=>{active=$('relay-active').checked;last='';save();if(!active)window.dispatchEvent(new Event('lexicon:relay-disabled'));else await publishCurrent();refresh()};
   $('relay-copy-url').onclick=async()=>{try{if(window.LexiconAndroid)window.LexiconAndroid.copyText(connection.read_url);else await navigator.clipboard.writeText(connection.read_url);refresh();window.LexiconToast(t('copied'),$('relay-copy-url'))}catch{const input=$('relay-read-url');input.type='text';input.focus();input.select();refresh(t('relayCopyManually'))}};
   window.addEventListener('online',()=>publishCurrent());window.addEventListener('lexicon:format-changed',event=>{if(event.detail?.target&&!['impaler','notification','api'].includes(event.detail.target))return;last='';publishCurrent({silent:true})});
  }
 };
})();
