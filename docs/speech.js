/* Native headphones are verified by Android. Web output needs explicit session opt-in. */
(()=>{
 const $=id=>document.getElementById(id),key='lexicon.web.speech';let prefs={enabled:false,repeats:1,gap:5,rate:1,headphonesOnly:true},last='',t=k=>k;
 let armed=false,sessionConsent=false,primed=false,generation=0,timer,startTimer,current,statusOverride='';
 const repeatCount=value=>{const count=Number(value);return Number.isFinite(count)?Math.min(2147483647,Math.max(1,Math.trunc(count))):1};
 try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&typeof saved==='object')prefs={headphonesOnly:saved.headphonesOnly!==false,enabled:saved.enabled===true,repeats:repeatCount(saved.repeats),gap:Math.round(Math.min(30,Math.max(1,Number(saved.gap)||5))),rate:Math.min(2,Math.max(.5,Number(saved.rate)||1))}}catch{}
 const bridge=()=>window.LexiconAndroid,native=()=>!!bridge()?.speakPrivateResult&&!!bridge()?.privateSpeechStatus;
 const web=()=>!!window.speechSynthesis&&typeof window.SpeechSynthesisUtterance==='function';
 const supported=()=>native()||web(),requested=()=>prefs.enabled&&(native()||armed),enabled=()=>requested()&&(native()||!prefs.headphonesOnly);
 const voice=()=>{const voices=(window.speechSynthesis?.getVoices()||[]).filter(v=>/^ru(?:[-_]|$)/i.test(v.lang));return voices.find(v=>v.localService)||voices.find(v=>v.default)||voices[0]};
 const code=()=>native()?bridge().privateSpeechStatus():!web()?'unavailable':statusOverride||(!requested()?'web_idle':prefs.headphonesOnly?'web_headphones':!primed?'web_tap':'web_ready');
 const save=()=>{try{localStorage.setItem(key,JSON.stringify(prefs))}catch{}};
 function refresh(status=code()){
  $('speech-headphones-only').checked=native()||prefs.headphonesOnly;$('speech-headphones-only').disabled=native()||!requested();
  $('speech-enabled').disabled=!supported();$('speech-enabled').checked=supported()&&requested();
  $('speech-rate').value=prefs.rate;$('speech-rate-value').textContent=prefs.rate+'×';$('speech-rate').disabled=native()&&!bridge()?.speakPrivateResultAtRate;$('speech-repeats').value=prefs.repeats;$('speech-gap').value=prefs.gap;$('speech-repeat-less').disabled=prefs.repeats<=1;$('speech-repeat-more').disabled=prefs.repeats>=2147483647;
  $('speech-test').disabled=!supported()||!enabled();$('speech-stop').disabled=!supported();
  $('speech-only-note').textContent=!native()&&prefs.headphonesOnly?'':t(native()?'speechOnly':'speechWebNote');
  $('speech-status').textContent=t({web_headphones:'speechHeadphonesWeb',web_idle:'speechWebIdle',web_ready:'speechWebReady',web_voice_missing:'speechWebVoiceMissing',web_tap:'speechWebTap',web_paused:'speechWebPaused',loading:'speechLoading',voice_missing:'speechVoiceMissing',headphones_required:'speechHeadphones',route_unverified:'speechRoute',error:'speechError',unavailable:'speechUnavailable',ready:'speechReady'}[status]||'speechError');
 }
 function stop(){statusOverride='';generation++;clearTimeout(timer);clearTimeout(startTimer);timer=null;startTimer=null;last='';current=null;if(native())bridge().stopPrivateSpeech?.();else if(web())window.speechSynthesis.cancel()}
 function disarm(){stop();if(!native()){armed=false;sessionConsent=false;primed=false;statusOverride=prefs.enabled?'web_paused':''}else statusOverride='';refresh()}
 function webSpeak(text,signature,test){
  const selected=voice();
  stop();const id=generation;let remaining=prefs.repeats;
  const play=()=>{
   if(id!==generation||!enabled()||document.hidden)return;
   const utterance=new SpeechSynthesisUtterance(text);current=utterance;utterance.lang=selected?.lang||'ru-RU';if(selected)utterance.voice=selected;utterance.rate=prefs.rate;
   utterance.onstart=()=>{if(id!==generation)return;clearTimeout(startTimer);primed=true;statusOverride='';refresh()};
   utterance.onend=()=>{if(id!==generation)return;clearTimeout(startTimer);primed=true;current=null;statusOverride='';if(--remaining>0)timer=setTimeout(play,prefs.gap*1000);refresh()};
   utterance.onerror=event=>{if(id!==generation)return;stop();if(event.error==='not-allowed')primed=false;statusOverride=event.error==='not-allowed'?'web_tap':['voice-unavailable','language-unavailable'].includes(event.error)?'web_voice_missing':'error';refresh();if(!test)window.LexiconToast?.($('speech-status').textContent)};
   try{startTimer=setTimeout(()=>{if(id!==generation||current!==utterance)return;stop();primed=false;statusOverride='web_tap';refresh();if(!test)window.LexiconToast?.(t('speechWebTap'))},10000);window.speechSynthesis.resume();window.speechSynthesis.speak(utterance);return true}catch{stop();statusOverride='web_tap';refresh();return false}
  };
  statusOverride='loading';const accepted=play();if(accepted&&!test)last=signature;refresh();return accepted===true;
 }
 function speak(rows,book,test=false){
  if(!supported()||!enabled()||!rows.length)return false;
  const text=rows.map(row=>window.LexiconFormat.format(row,window.LexiconResultFormat('speech'))).filter(Boolean).join('. ');
  return speakText(text,book,test);
 }
 function speakText(text,book,test=false){
  if(!supported()||!enabled()||!text)return false;const signature=JSON.stringify([book,text]);if(!test&&last===signature)return true;
  if(!native())return webSpeak(text,signature,test);
  if(code()!=='ready'){refresh();return false}
  const accepted=(bridge().speakPrivateResultAtRate?bridge().speakPrivateResultAtRate(text,prefs.repeats,prefs.gap,prefs.rate):bridge().speakPrivateResult(text,prefs.repeats,prefs.gap))===true;
  if(accepted&&!test)last=signature;refresh();return accepted;
 }
 window.LexiconSpeech={receive:speak,receiveUnknown:(query,rows,book)=>speakText(window.LexiconFormat.approximate(query,rows,window.LexiconResultFormat('speech')),book),cancel:stop,refresh,init(translate){t=translate;
  $('speech-enabled').onchange=()=>{
   const wanted=$('speech-enabled').checked;stop();statusOverride='';
   if(wanted&&!native())armed=prefs.headphonesOnly||sessionConsent||window.confirm(t('speechWebConfirm'));else if(!wanted){armed=false;primed=false};
   prefs.enabled=wanted&&(native()||armed);save();refresh();
  };
  $('speech-headphones-only').onchange=()=>{
   const wanted=$('speech-headphones-only').checked;
   if(native()){refresh();return}
   if(!wanted&&!window.confirm(t('speechHeadphonesOverride'))){refresh();return}
   stop();prefs.headphonesOnly=wanted;primed=false;sessionConsent=!wanted;save();refresh();
  };
  $('speech-rate').oninput=()=>{$('speech-rate-value').textContent=$('speech-rate').value+'×'};
  $('speech-rate').onchange=()=>{prefs.rate=Math.min(2,Math.max(.5,Number($('speech-rate').value)||1));stop();save();refresh()};
  $('speech-repeats').onchange=()=>{prefs.repeats=repeatCount($('speech-repeats').value);stop();save();refresh()};
  for(const [id,step] of [['speech-repeat-less',-1],['speech-repeat-more',1]])$(id).onclick=()=>{$('speech-repeats').value=repeatCount(prefs.repeats+step);$('speech-repeats').dispatchEvent(new Event('change'))};
  $('speech-gap').onchange=()=>{prefs.gap=Math.round(Math.min(30,Math.max(1,Number($('speech-gap').value)||5)));stop();save();refresh()};
  $('speech-test').onclick=()=>{statusOverride='';speak([{word:'ПАПА',page:402,column:3,position:1}],'test',true)};
  $('speech-stop').onclick=()=>{stop();refresh()};window.addEventListener('lexicon:speech-status',event=>{if(event.detail!=='ready')stop();refresh(event.detail)});
  window.addEventListener('lexicon:format-changed',()=>{stop();refresh()});window.addEventListener('pagehide',disarm);document.addEventListener('visibilitychange',()=>{if(document.hidden)disarm()});
  window.speechSynthesis?.addEventListener?.('voiceschanged',()=>refresh());
  navigator.mediaDevices?.addEventListener?.('devicechange',()=>{if(!native())disarm()});refresh();
 }};
})();
