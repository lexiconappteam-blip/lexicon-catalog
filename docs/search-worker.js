importScripts('./search-engine.js');
let dictionary,pending,timer;
self.onmessage=({data})=>{
 if(data.init){dictionary=data.init;return}
 if(pending)self.postMessage({id:pending.id,result:null});
 pending=data;clearTimeout(timer);
 timer=setTimeout(()=>{const request=pending;pending=null;self.postMessage({id:request.id,result:LexiconSearch.search(dictionary,request.q,request.limit)})},0);
};
