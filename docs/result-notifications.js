// Result notifications are opt-in and separate from maintenance/news notices.
(()=>{
 const storage='lexicon.web.resultNotifications';
 const $=id=>document.getElementById(id);
 let enabled=false,t=k=>k,last=null,permissionPending;
 try{enabled=JSON.parse(localStorage.getItem(storage))===true}catch{}
 const native=()=>window.LexiconAndroid;
 const ios=()=>/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 const supported=()=>!!native()?.showResultNotification||(ios()?window.LexiconRelay?.canPush():isSecureContext&&'Notification' in window);
 function permission(){try{return native()?.resultNotificationPermission?.()||(supported()?Notification.permission:'denied')}catch{return 'denied'}}
 function persist(value){enabled=value;try{localStorage.setItem(storage,JSON.stringify(value))}catch{}}
 const text=row=>window.LexiconFormat.format(row,window.LexiconResultFormat());
 function refresh(message){
  const toggle=$('result-notifications');if(!toggle)return;
  const allowed=supported();toggle.disabled=!allowed;toggle.checked=enabled&&permission()==='granted';
  $('test-result-notification').disabled=!toggle.checked||!window.LexiconResultFormat().fields.length;
  const messageText=message||(!allowed?t('notificationUnavailable'):enabled&&permission()!=='granted'?t('notificationDenied'):'');$('result-notification-status').textContent=messageText;$('result-notification-status').hidden=!messageText;
 }
 async function requestPermission(){
  if(native()?.requestResultNotifications){
   return new Promise(resolve=>{const timeout=setTimeout(()=>{permissionPending=null;resolve('denied')},30000);permissionPending=status=>{clearTimeout(timeout);permissionPending=null;resolve(status)};native().requestResultNotifications()});
  }
  const status=await Notification.requestPermission();if(status==='granted'&&ios())await window.LexiconRelay.subscribe();return status;
 }
 window.addEventListener('lexicon:notification-permission',e=>permissionPending?.(e.detail?'granted':'denied'));
 async function show(row,test=false,rows=[row]){
  if(!enabled||permission()!=='granted')return false;
  if(ios())return window.LexiconRelay.publish(rows,{test});
  const title='Lexicon';
  const body=rows.map(text).join('\n');if(!body)return false;
  if(native()?.showResultNotification)return native().showResultNotification(title,body)===true;
  const registration=await navigator.serviceWorker?.getRegistration();
  if(!enabled)return false;
  if(registration)await registration.showNotification(title,{body,tag:'lexicon-result',icon:new URL('Icon-192.png',document.baseURI).href});
  else new Notification(title,{body,tag:'lexicon-result'});
  return true;
 }
 window.LexiconResults={text,refresh,
  init(translate){t=translate;refresh();
   $('result-notifications').onchange=async()=>{
    if(!$('result-notifications').checked){persist(false);last=null;native()?.cancelResultNotification?.();if(ios())try{await window.LexiconRelay.unsubscribe()}catch{refresh(t('notificationFailed'))}const reg=await navigator.serviceWorker?.getRegistration();for(const n of await reg?.getNotifications({tag:'lexicon-result'})||[])n.close();refresh();return}
    $('result-notifications').disabled=true;
    try{persist(await requestPermission()==='granted');refresh(enabled?undefined:t('notificationDenied'))}catch{persist(false);refresh(t('notificationFailed'))}
   };
   $('test-result-notification').onclick=async()=>{try{refresh(t(await show({word:'ТЮТЕЛЬКА',page:655,column:2,position:3},true)?'notificationTestSent':'notificationDenied'))}catch{refresh(t('notificationFailed'))}};
   window.addEventListener('focus',()=>refresh());window.addEventListener('lexicon:format-changed',()=>refresh());window.addEventListener('lexicon:relay-disabled',()=>{if(ios()){persist(false);last=null;refresh()}});
  },
  async notify(rows,book){if(!rows.length)return;void window.LexiconRelay?.publish(rows);if(!enabled||ios())return;const signature=JSON.stringify([book,rows.map(text)]);if(last===signature)return;try{if(await show(rows[0],false,rows))last=signature;else refresh(t('notificationDenied'))}catch{refresh(t('notificationFailed'))}}
 };
})();
