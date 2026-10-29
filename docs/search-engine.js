/* Dictionary-only suggestions: never silently replace an uncertain input. */
(()=>{
 const normalize=s=>String(s).normalize('NFC').toUpperCase().replaceAll('Ё','Е').replace(/[\u0300\u0301]/g,'').trim();
 const terms=s=>normalize(s).match(/[А-ЯA-Z]+(?:[-‐‑–—][А-ЯA-Z]+)*/g)?.map(x=>x.replace(/[‐‑–—]/g,'-'))||[];
 function distance(a,b,cap=2){
  if(Math.abs(a.length-b.length)>cap)return cap+1;
  let before=null,prev=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){
   const row=Array(b.length+1).fill(cap+1);row[0]=i;
   for(let j=Math.max(1,i-cap);j<=Math.min(b.length,i+cap);j++){
    row[j]=Math.min(row[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]!==b[j-1]));
    if(before&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])row[j]=Math.min(row[j],before[j-2]+1);
   }
   before=prev;prev=row;
  }
  return prev[b.length];
 }
 function search(data,query,limit=12){
  const raw=normalize(query),words=terms(query);
  // Spaces may split a single word. Never concatenate across sentence punctuation.
  const q=/^[А-ЯA-Z\s\-‐‑–—«»"'“”.,!?;:()]+$/.test(raw)?normalize(raw.replace(/^[^А-ЯA-Z]+|[^А-ЯA-Z]+$/g,'').replace(/[‐‑–—]/g,'-').replace(/\s+/g,'')):raw;
  const result={query,normalized:q,revision:data.revision,matches:[],suggestions:[],corrections:[],mode:raw?'missing':'empty'};
  if(!raw)return result;
  const single=/^[А-ЯA-Z]+(?:-[А-ЯA-Z]+)*$/.test(q)&&q.length<=80;
  if(single)result.matches=data.groups.get(q)||[];
  let low=0,high=data.keys.length;
  while(low<high){const mid=(low+high)>>1;if(data.keys[mid]<q)low=mid+1;else high=mid}
  if(single)for(let i=low;i<data.keys.length&&result.suggestions.length<limit&&data.keys[i].startsWith(q);i++)result.suggestions.push(data.groups.get(data.keys[i])[0].word);
  // For a sentence, suggest only dictionary words actually present in it.
  if(!result.matches.length&&(!single||words.length>1))for(const w of [...new Set(words)].slice(0,24))if(data.groups.has(w))result.corrections.push(data.groups.get(w)[0].word);
  if(single&&q.length>=2&&q.length<=32&&result.suggestions.length<limit){
   const memo=new Map(),measure=s=>{if(!memo.has(s))memo.set(s,distance(q,s,cap));return memo.get(s)};
   const cap=q.length<6?1:2,scored=[];
   for(const candidate of data.keys){
    if(candidate===q||candidate.startsWith(q)||candidate.length<2)continue;
    const full=measure(candidate);let d=full;
    // Fuzzy completion also works before the user has finished typing the word.
    if(q.length>=3)for(let n=Math.max(2,q.length-cap);n<=Math.min(candidate.length,q.length+cap);n++)d=Math.min(d,measure(candidate.slice(0,n)));
    if(d<=cap)scored.push([d,full<=cap?0:1,Math.abs(candidate.length-q.length),candidate]);
   }
   scored.sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]||(a[3]<b[3]?-1:1));
   for(const x of scored){const word=data.groups.get(x[3])[0].word;if(!result.corrections.includes(word))result.corrections.push(word);if(result.corrections.length>=limit-result.suggestions.length)break}
  }
  result.corrections=result.corrections.slice(0,Math.max(0,limit-result.suggestions.length));
  result.mode=result.matches.length?'exact':result.suggestions.length?'prefix':result.corrections.length?'approximate':'missing';
  return result;
 }
 globalThis.LexiconSearch={normalize,distance,search};
})();
