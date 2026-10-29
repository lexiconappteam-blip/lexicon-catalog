/* Static/mobile transport: local dictionary, direct read-only Inject API. */
(()=>{
 if(window.LexiconAndroid?.legacyPreferences){try{const old=JSON.parse(window.LexiconAndroid.legacyPreferences());for(const name of ['history','historyOn','language'])if(localStorage.getItem('lexicon.web.'+name)===null&&old[name]!==undefined)localStorage.setItem('lexicon.web.'+name,JSON.stringify(old[name]))}catch{}}
 const config=window.LEXICON_PORTABLE,network=window.fetch.bind(window);let pending;
 const normalize=s=>String(s).normalize('NFC').toUpperCase().replaceAll('Ё','Е').replace(/[\u0300\u0301]/g,'').trim();
 function distance(a,b,cap=2){if(Math.abs(a.length-b.length)>cap)return cap+1;let prev=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){const row=Array(b.length+1).fill(cap+1);row[0]=i;for(let j=Math.max(1,i-cap);j<=Math.min(b.length,i+cap);j++)row[j]=Math.min(row[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]!==b[j-1]));if(Math.min(...row)>cap)return cap+1;prev=row}return prev[b.length]}
 async function dictionary(){if(!pending)pending=network(new URL('dictionary.json',document.baseURI)).then(r=>{if(!r.ok)throw Error('Dictionary unavailable');return r.json()}).then(x=>{const groups=new Map();for(const [word,pdf,col,pos] of x.rows){const k=normalize(word);if(!groups.has(k))groups.set(k,[]);groups.get(k).push({word,page:pdf+10,page_pdf:pdf,column:col,position:pos})}return {...x,groups,keys:[...groups.keys()].sort()}}).catch(e=>{pending=null;throw e});return pending}
 const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
 window.fetch=async(input,options={})=>{const url=new URL(typeof input==='string'?input:input.url,location.href);if(url.origin!==location.origin||!url.pathname.startsWith('/api/'))return network(input,options);if(options.signal?.aborted)throw new DOMException('Aborted','AbortError');
  if(url.pathname==='/api/inject/status')return json({configured:!!config.injectUrl,poll_seconds:5});
  if(url.pathname==='/api/inject/latest'){
   const id=url.searchParams.get('id')||'';if(!/^[a-zA-Z0-9_-]{1,120}$/.test(id))return json({error:'Укажите корректный ID Inject'},400);
   if(!config.injectUrl)return json({error:'Inject не настроен'},503);
   const timeout=new AbortController();const timer=setTimeout(()=>timeout.abort(),12000);const abort=()=>timeout.abort();options.signal?.addEventListener('abort',abort,{once:true});
   try{const address=config.injectUrl.replace('{id}',encodeURIComponent(id));const response=await network(address,{signal:timeout.signal,cache:'no-store',headers:{Accept:'application/json'}});if(!response.ok)return json({error:'Inject временно недоступен'},502);let value=await response.json();for(const part of config.injectField.split('.').filter(Boolean))value=value[part];if(value==null||value==='')return json({word:'',event:null});if(typeof value!=='string'||value.trim().length>80)return json({error:'Некорректный ответ Inject'},502);const word=value.trim();return json({word,event:word})}catch(e){if(options.signal?.aborted)throw e;return json({error:'Нет связи с Inject. Повторяем подключение.'},502)}finally{clearTimeout(timer);options.signal?.removeEventListener('abort',abort)}
  }
  const data=await dictionary();if(options.signal?.aborted)throw new DOMException('Aborted','AbortError');
  if(url.pathname==='/api/health')return json({status:'ok',revision:data.revision,entries:data.rows.length});
  if(url.pathname==='/api/dictionaries')return json({dictionaries:[{id:'default',name:'Толковый словарь',entries:data.rows.length,revision:data.revision,data_status:'under_review',page_offset:10}]});
  if(url.pathname==='/api/search'){
   const q=url.searchParams.get('q')||'',key=normalize(q),limit=Number(url.searchParams.get('limit')||12);if(q.length>80||!Number.isInteger(limit)||limit<1||limit>30)return json({error:'Некорректный запрос'},400);if((url.searchParams.get('dictionary')||'default')!=='default')return json({error:'Книга не найдена'},404);
   const result={query:q,normalized:key,revision:data.revision,matches:[],suggestions:[],corrections:[],mode:'empty'};if(!key)return json(result);result.matches=data.groups.get(key)||[];let low=0,high=data.keys.length;while(low<high){const mid=(low+high)>>1;if(data.keys[mid]<key)low=mid+1;else high=mid}for(let i=low;i<data.keys.length&&result.suggestions.length<limit&&data.keys[i].startsWith(key);i++)result.suggestions.push(data.groups.get(data.keys[i])[0].word);result.mode=result.matches.length?'exact':result.suggestions.length?'prefix':'missing';if(result.mode==='missing'&&key.length>=3){const scored=[];for(const candidate of data.keys){if(Math.abs(key.length-candidate.length)>2)continue;const d=distance(key,candidate);if(d<=2)scored.push([d,candidate])}scored.sort((a,b)=>a[0]-b[0]||(a[1]<b[1]?-1:a[1]>b[1]?1:0));result.corrections=scored.slice(0,6).map(x=>data.groups.get(x[1])[0].word);if(scored.length)result.mode='approximate'}return json(result)
  }
  return json({error:'Not found'},404);
 };
 if(!window.LexiconAndroid&&'serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
