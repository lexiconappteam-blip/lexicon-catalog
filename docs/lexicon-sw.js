const CACHE="lexicon-0b628cc3bf04",FILES=["./theme.js?v=3ef7e6d78bbb", "./style.css?v=8ca17ac0db8c", "./search-worker.js?v=c8c14c57a45f", "./result-format.js?v=395535a7b84e", "./app.js?v=715808db0fb2", "./portable-config.js?v=fd98e5b9a960", "./apple-touch-icon.png", "./keyboard.js?v=d89eaf721192", "./dictionary.json?v=61ddc5f9672ed1e6", "./index.html", "./search-engine.js?v=366225dc697b", "./Icon-192.png", "./result-relay.js?v=f2442f5111df", "./icon.svg", "./result-notifications.js?v=94f8d8848d0e", "./manifest.webmanifest", "./portable.js?v=9e54481aa1a4", "./Icon-512.png"];self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('lexicon-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>e.request.mode==='navigate'?caches.match(new URL('index.html',self.registration.scope)):caches.match(e.request).then(hit=>hit||caches.match(e.request,{ignoreSearch:true}))))});self.addEventListener('push',event=>{event.waitUntil((async()=>{
 let data={};try{data=event.data?.json()||{}}catch{}
 const title=typeof data.title==='string'?data.title.slice(0,128):'Lexicon';
 const body=typeof data.body==='string'?data.body.slice(0,1500):'';
 let target=new URL('./',self.registration.scope);try{const u=new URL(data.url);if(u.origin===target.origin&&u.pathname.startsWith(new URL(self.registration.scope).pathname))target=u}catch{}
 await self.registration.showNotification(title,{body,tag:'lexicon-result',icon:new URL('Icon-192.png',self.registration.scope).href,data:{url:target.href}});
})())});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil((async()=>{
 const scope=new URL(self.registration.scope);let target=scope.href;
 try{const u=new URL(event.notification.data?.url);if(u.origin===scope.origin&&u.pathname.startsWith(scope.pathname))target=u.href}catch{}
 const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
 for(const client of windows){if(new URL(client.url).origin===scope.origin){await client.navigate(target);await client.focus();return}}
 await self.clients.openWindow(target);
})())});
;self.addEventListener('activate',e=>e.waitUntil(self.clients.matchAll({type:'window'}).then(cs=>Promise.all(cs.map(c=>c.navigate(c.url))))));