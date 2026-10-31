/* Native headphones are verified by Android. Web output needs explicit session opt-in. */
(()=>{
 const $=id=>document.getElementById(id),key='lexicon.web.speech';let prefs={enabled:false,repeats:1,gap:5},last='',t=k=>k;
 let armed=false,generation=0,timer,current,statusOverride='';
 try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&typeof saved==='object')prefs={enabled:saved.enabled===true,repeats:Math.round(Math.min(5,Math.max(1,Number(saved.repeats)||1))),gap:Math.round(Math.min(30,Math.max(1,Number(saved.gap)||5)))}}catch{}
 const bridge=()=>window.LexiconAndroid,native=()=>!!bridge()?.speakPrivateResult&&!!bridge()?.privateSpeechStatus;
 const web=()=>!!window.speechSynthesis&&typeof window.SpeechSynthesisUtterance==='function';
 const supported=()=>native()||web(),enabled=()=>prefs.enabled&&(native()||armed);
 const voice=()=>window.speechSynthesis?.getVoices().find(v=>/^ru(?:[-_]|$)/i.test(v.lang)&&v.localService);
 const code=()=>native()?bridge().privateSpeechStatus():!web()?'unavailable':statusOverride||(!armed?'web_idle':!voice()?'web_voice_missing':'web_ready');
 const save=()=>{try{localStorage.setItem(key,JSON.stringify(prefs))}catch{}};
 function refresh(status=code()){
  $('speech-enabled').disabled=!supported();$('speech-enabled').checked=supported()&&enabled();
  $('speech-repeats').value=prefs.repeats;$('speech-gap').value=prefs.gap;
  $('speech-test').disabled=!supported()||!enabled();$('speech-stop').disabled=!supported();
  $('speech-only-note').textContent=t(native()?'speechOnly':'speechWebNote');
  $('speech-status').textContent=t({web_idle:'speechWebIdle',web_ready:'speechWebReady',web_voice_missing:'speechWebVoiceMissing',web_tap:'speechWebTap',loading:'speechLoading',voice_missing:'speechVoiceMissing',headphones_required:'speechHeadphones',route_unverified:'speechRoute',error:'speechError',unavailable:'speechUnavailable',ready:'speechReady'}[status]||'speechError');
 }
 function stop(){generation++;clearTimeout(timer);timer=null;last='';current=null;if(native())bridge().stopPrivateSpeech?.();else if(web())window.speechSynthesis.cancel()}
 function disarm(){stop();if(!native())armed=false;statusOverride='';refresh()}
 function webSpeak(text,signature,test){
  const selected=voice();if(!selected){statusOverride='web_voice_missing';refresh();return false}
  stop();const id=generation;let remaining=prefs.repeats;
  const play=()=>{
   if(id!==generation||!enabled()||document.hidden)return;
   const utterance=new SpeechSynthesisUtterance(text);current=utterance;utterance.lang=selected.lang;utterance.voice=selected;
   utterance.onend=()=>{if(id!==generation)return;current=null;if(--remaining>0)timer=setTimeout(play,prefs.gap*1000)};
   utterance.onerror=event=>{if(id!==generation)return;stop();statusOverride=event.error==='not-allowed'?'web_tap':'error';refresh()};
   try{window.speechSynthesis.resume();window.speechSynthesis.speak(utterance);return true}catch{stop();statusOverride='web_tap';refresh();return false}
  };
  statusOverride='';const accepted=play();if(accepted&&!test)last=signature;refresh();return accepted===true;
 }
 function speak(rows,book,test=false){
  if(!supported()||!enabled()||!rows.length)return false;
  const text=rows.map(row=>window.LexiconFormat.format(row,window.LexiconResultFormat('speech'))).filter(Boolean).join('. ');
  if(!text)return false;const signature=JSON.stringify([book,text]);if(!test&&last===signature)return true;
  if(!native())return webSpeak(text,signature,test);
  if(code()!=='ready'){refresh();return false}
  const accepted=bridge().speakPrivateResult(text,prefs.repeats,prefs.gap)===true;
  if(accepted&&!test)last=signature;refresh();return accepted;
 }
 window.LexiconSpeech={receive:speak,cancel:stop,refresh,init(translate){t=translate;
  $('speech-enabled').onchange=()=>{
   const wanted=$('speech-enabled').checked;stop();statusOverride='';
   if(wanted&&!native())armed=window.confirm(t('speechWebConfirm'));else if(!wanted)armed=false;
   prefs.enabled=wanted&&(native()||armed);save();refresh();
  };
  $('speech-repeats').onchange=()=>{prefs.repeats=Math.round(Math.min(5,Math.max(1,Number($('speech-repeats').value)||1)));stop();save();refresh()};
  $('speech-gap').onchange=()=>{prefs.gap=Math.round(Math.min(30,Math.max(1,Number($('speech-gap').value)||5)));stop();save();refresh()};
  $('speech-test').onclick=()=>{statusOverride='';speak([{word:'ПАПА',page:402,column:3,position:1}],'test',true)};
  $('speech-stop').onclick=stop;window.addEventListener('lexicon:speech-status',event=>{if(event.detail!=='ready')stop();refresh(event.detail)});
  window.addEventListener('lexicon:format-changed',()=>{stop();refresh()});window.addEventListener('pagehide',disarm);document.addEventListener('visibilitychange',()=>{if(document.hidden)disarm()});
  window.speechSynthesis?.addEventListener?.('voiceschanged',()=>refresh());
  navigator.mediaDevices?.addEventListener?.('devicechange',()=>{if(!native())disarm()});refresh();
 }};
})();
