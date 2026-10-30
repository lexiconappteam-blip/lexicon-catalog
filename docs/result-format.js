// Shared by the browser and the notification relay.
(()=>{
 const fields=['word','page','column','position'];
 function normalize(input={}){
  const selected=Array.isArray(input.fields)?fields.filter(f=>input.fields.includes(f)):fields.slice();
  const labels=input.labels!==false,lang=input.lang==='en'?'en':'ru';
  return {fields:selected,labels,lang,separator:[' ',' · '].includes(input.separator)?input.separator:labels?' · ':' '};
 }
 function format(row,input){const options=normalize(input);const names=options.lang==='en'?{page:'page',column:'column',position:'entry'}:{page:'страница',column:'колонка',position:'статья'};
  return options.fields.map(f=>f==='word'||!options.labels?String(row[f]):names[f]+' '+row[f]).join(options.separator);
 }
 globalThis.LexiconFormat={normalize,format};
})();
