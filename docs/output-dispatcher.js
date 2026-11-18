/* Output coordination only: no DOM, storage, timers, formatting or transport state. */
(()=>{
 function create({relay,notifications,speech,api}){
  const copy=rows=>rows.map(row=>({...row}));
  // All sinks run independently, including when another sink throws synchronously.
  const run=jobs=>Promise.all(Object.entries(jobs).map(async([name,send])=>{
   try{return {name,status:'fulfilled',value:await send()}}
   catch(reason){return {name,status:'rejected',reason}}
  }));
  return Object.freeze({
   found(rows,bookId){
    const snapshot=copy(rows);
    return run({
     relay:()=>relay.publish(copy(snapshot)),
     notifications:()=>notifications.notify(copy(snapshot),bookId),
     speech:()=>speech.receive(copy(snapshot),bookId),
     api:()=>api.publish(copy(snapshot)),
    });
   },
   unknown(query,suggestions,bookId){
    const snapshot=copy(suggestions||[]);
    return run({
     relay:()=>relay.publishUnknown(query,copy(snapshot)),
     notifications:()=>notifications.notifyUnknown(query,copy(snapshot),bookId),
     speech:()=>speech.receiveUnknown(query,copy(snapshot),bookId),
     api:()=>api.publishUnknown(query,copy(snapshot)),
    });
   },
  });
 }
 window.LexiconOutputDispatcher=Object.freeze({create});
})();
