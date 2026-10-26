const CACHE='lexicon-7e84e445766f3875';
const FILES=["index.html", "flutter_bootstrap.js", "flutter.js", "main.dart.js", "sqlite3.wasm", "sqflite_sw.js", "manifest.json", "icons/apple-touch-icon.png", "icons/Icon-192.png", "icons/Icon-512.png", "assets/AssetManifest.bin", "assets/NOTICES", "assets/AssetManifest.bin.json", "assets/FontManifest.json", "assets/shaders/ink_sparkle.frag", "assets/shaders/stretch_effect.frag", "assets/assets/dictionary.sqlite3", "assets/fonts/MaterialIcons-Regular.otf", "assets/fonts/fallback/Roboto-Regular.ttf", "assets/assets/fonts/DejaVuSans.ttf"];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);await cache.addAll(FILES);
 if(!self.registration.active)await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith('lexicon-')&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 event.respondWith((async()=>{
 const cache=await caches.open(CACHE);
 if(request.mode==='navigate')return await cache.match('index.html')||fetch(request);
 const cached=await cache.match(request,{ignoreSearch:true});if(cached)return cached;
 const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response;
 })());
});
