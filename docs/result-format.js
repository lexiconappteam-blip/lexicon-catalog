// Shared by the browser and the notification relay.
(()=>{
 const fields=['word','page','column','position'];
 function normalize(input={}){
  const selected=Array.isArray(input.fields)?fields.filter(f=>input.fields.includes(f)):fields.slice();
  const labels=input.labels!==false,lang=input.lang==='en'?'en':'ru';
  return {fields:selected,labels,lang,useSuggestion:input.useSuggestion!==false,includeOriginal:input.includeOriginal!==false,markUncertain:input.markUncertain!==false,suggestionCoordinates:input.suggestionCoordinates!==false,labelOrder:input.labelOrder==='after'?'after':'before',separator:typeof input.separator==='string'?Array.from(input.separator).slice(0,64).join(''):labels?' · ':' '};
 }
 function format(row,input){const options=normalize(input);const names=options.lang==='en'?{page:'page',column:'column',position:'line'}:{page:'страница',column:'колонка',position:'строчка'};
  return options.fields.map(f=>f==='word'||!options.labels?String(row[f]):options.labelOrder==='after'?row[f]+' '+names[f]:names[f]+' '+row[f]).join(options.separator);
 }
 function primaryRows(rows=[]){const seen=new Set();return rows.filter(row=>{const key=String(row.word).normalize('NFC').toUpperCase().replaceAll('Ё','Е').replace(/[\u0300\u0301]/g,'');if(seen.has(key))return false;seen.add(key);return true})}
 function formatRows(rows,input){return primaryRows(rows).map(row=>format(row,input)).filter(Boolean).join('\n')}
 function spoken(text,lang='ru'){return text.replaceAll('/',' ').replace(/###/g,lang==='en'?' three hashes ':' три решётки ').replace(/#/g,lang==='en'?' hash ':' решётка ').replace(/\s+/g,' ').trim()}
 function approximate(query,rows=[],input={}){
  if(!rows.length)return '###';
  rows=primaryRows(rows);
  const options=normalize(input),marker=options.markUncertain?'#':'';if(!options.fields.length)return '';
  if(!options.useSuggestion||!rows.length)return query+marker;
  const selected={...options,separator:marker&&!options.separator.trim()?'/':options.separator,fields:options.fields.filter(f=>options.suggestionCoordinates||f==='word')};
  if(!selected.fields.length)return query+marker;
  return rows.map(row=>{const first=selected.fields[0],marked={...row,[first]:String(row[first])+marker};if(selected.labels)return format(marked,selected);const values=selected.fields.map(field=>format(row,{...selected,fields:[field]}));return values[0]+marker+(values.length>1?selected.separator:'')+values.slice(1).join(selected.separator)}).join('\n')+(options.includeOriginal?' ('+query+')':'');
 }
 globalThis.LexiconFormat={normalize,format,approximate,primaryRows,formatRows,spoken};
})();
