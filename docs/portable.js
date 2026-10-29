/* Static/mobile transport: local dictionary, direct read-only Inject API. */
(()=>{
 if(window.LexiconAndroid?.legacyPreferences){try{const old=JSON.parse(window.LexiconAndroid.legacyPreferences());for(const name of ['history','historyOn','language'])if(localStorage.getItem('lexicon.web.'+name)===null&&old[name]!==undefined)localStorage.setItem('lexicon.web.'+name,JSON.stringify(old[name]))}catch{}}
 const config=window.LEXICON_PORTABLE,network=window.fetch.bind(window);let pending;
 const normalize=s=>String(s).normalize('NFC').toUpperCase().replaceAll('Ё','Е').replace(/[\u0300\u0301]/g,'').trim();
 async function dictionary(){if(!pending)pending=network(new URL('dictionary.json?v='+encodeURIComponent(config.dictionaryRevision||config.version),document.baseURI)).then(r=>{if(!r.ok)throw Error('Dictionary unavailable');return r.json()}).then(x=>{const groups=new Map();for(const [word,pdf,col,pos] of x.rows){const k=normalize(word);if(!groups.has(k))groups.set(k,[]);groups.get(k).push({word,page:pdf+10,page_pdf:pdf,column:col,position:pos})}return {...x,groups,keys:[...groups.keys()].sort()}}).catch(e=>{pending=null;throw e});return pending}
 // Keep approximate matching away from the typing/UI thread.
 let searchWorker,workerId=0,workerUnavailable=false;const jobs=new Map();
 async function searchDictionary(data,q,limit,signal){
  if(typeof Worker==='undefined'||workerUnavailable)return window.LexiconSearch.search(data,q,limit);
  if(!searchWorker){
   try{searchWorker=new Worker(new URL('search-worker.js',document.baseURI))}catch{workerUnavailable=true;return window.LexiconSearch.search(data,q,limit)}
   searchWorker.postMessage({init:{revision:data.revision,groups:data.groups,keys:data.keys}});
   searchWorker.onmessage=({data:message})=>{const job=jobs.get(message.id);if(job){jobs.delete(message.id);message.result===null?job.cancel():job.finish(message.result)}};
   searchWorker.onerror=event=>{event.preventDefault();searchWorker?.terminate();searchWorker=null;workerUnavailable=true;for(const job of jobs.values())job.fallback();jobs.clear()};
  }
  if(signal?.aborted)throw new DOMException('Aborted','AbortError');
  return new Promise((resolve,reject)=>{
   const id=++workerId;
   const abort=()=>{jobs.delete(id);reject(new DOMException('Aborted','AbortError'))};
   const finish=result=>{signal?.removeEventListener('abort',abort);resolve(result)};
   jobs.set(id,{finish,cancel:()=>{signal?.removeEventListener('abort',abort);reject(new DOMException('Superseded','AbortError'))},fallback:()=>finish(window.LexiconSearch.search(data,q,limit))});
   signal?.addEventListener('abort',abort,{once:true});searchWorker.postMessage({id,q,limit});
  });
 }
 const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
 window.fetch=async(input,options={})=>{const url=new URL(typeof input==='string'?input:input.url,location.href);if(url.origin!==location.origin||!url.pathname.startsWith('/api/'))return network(input,options);if(options.signal?.aborted)throw new DOMException('Aborted','AbortError');
  if(url.pathname==='/api/inject/status')return json({configured:!!config.injectUrl,poll_seconds:5});
  if(url.pathname==='/api/inject/latest'){
   const id=url.searchParams.get('id')||'';if(!/^[a-zA-Z0-9_-]{1,120}$/.test(id))return json({error:'Укажите корректный ID Inject'},400);
   if(!config.injectUrl)return json({error:'Inject не настроен'},503);
   const timeout=new AbortController();const timer=setTimeout(()=>timeout.abort(),12000);const abort=()=>timeout.abort();options.signal?.addEventListener('abort',abort,{once:true});
   try{const address=config.injectUrl.replace('{id}',encodeURIComponent(id));const response=await network(address,{signal:timeout.signal,cache:'no-store',headers:{Accept:'application/json'}});if(!response.ok)return json({error:'Inject временно недоступен'},502);let value=await response.json();for(const part of config.injectField.split('.').filter(Boolean))value=value[part];if(value==null||value==='')return json({word:'',event:null});if(typeof value!=='string'||value.trim().length>512)return json({error:'Некорректный ответ Inject'},502);const word=value.trim();return json({word,event:word})}catch(e){if(options.signal?.aborted)throw e;return json({error:'Нет связи с Inject. Повторяем подключение.'},502)}finally{clearTimeout(timer);options.signal?.removeEventListener('abort',abort)}
  }
  const data=await dictionary();if(options.signal?.aborted)throw new DOMException('Aborted','AbortError');
  if(url.pathname==='/api/health')return json({status:'ok',revision:data.revision,entries:data.rows.length});
  if(url.pathname==='/api/dictionaries')return json({dictionaries:[{id:'default',name:'Толковый словарь',entries:data.rows.length,revision:data.revision,data_status:'under_review',page_offset:10}]});
  if(url.pathname==='/api/search'){
   const q=url.searchParams.get('q')||'',limit=Number(url.searchParams.get('limit')||12);if(q.length>512||!Number.isInteger(limit)||limit<1||limit>30)return json({error:'Некорректный запрос'},400);if((url.searchParams.get('dictionary')||'default')!=='default')return json({error:'Книга не найдена'},404);
   return json(await searchDictionary(data,q,limit,options.signal));
  }
  return json({error:'Not found'},404);
 };
 if(!window.LexiconAndroid&&'serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
