/* Fail closed: browser speech synthesis cannot verify a private headphone route. */
(()=>{
 const $=id=>document.getElementById(id),key='lexicon.web.speech';let prefs={enabled:false,repeats:1,gap:5},last='',t=k=>k;
 try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&typeof saved==='object')prefs={enabled:saved.enabled===true,repeats:Math.round(Math.min(5,Math.max(1,Number(saved.repeats)||1))),gap:Math.round(Math.min(30,Math.max(1,Number(saved.gap)||5)))}}catch{}
 const bridge=()=>window.LexiconAndroid,supported=()=>!!bridge()?.speakPrivateResult&&!!bridge()?.privateSpeechStatus;
 const code=()=>supported()?bridge().privateSpeechStatus():'browser';
 const save=()=>{try{localStorage.setItem(key,JSON.stringify(prefs))}catch{}};
 function refresh(status=code()){
  $('speech-enabled').disabled=!supported();$('speech-enabled').checked=supported()&&prefs.enabled;
  $('speech-repeats').value=prefs.repeats;$('speech-gap').value=prefs.gap;
  $('speech-test').disabled=!supported()||!prefs.enabled;$('speech-stop').disabled=!supported();
  $('speech-status').textContent=t({browser:'speechBrowser',loading:'speechLoading',voice_missing:'speechVoiceMissing',headphones_required:'speechHeadphones',route_unverified:'speechRoute',error:'speechError',unavailable:'speechUnavailable',ready:'speechReady'}[status]||'speechError');
 }
 function stop(){last='';bridge()?.stopPrivateSpeech?.()}
 function speak(rows,book,test=false){
  if(!supported()||!prefs.enabled||!rows.length)return false;
  const text=rows.map(row=>window.LexiconFormat.format(row,window.LexiconResultFormat('speech'))).filter(Boolean).join('. ');
  if(!text)return false;const signature=JSON.stringify([book,text]);if(!test&&last===signature)return true;
  if(code()!=='ready'){refresh();return false}
  const accepted=bridge().speakPrivateResult(text,prefs.repeats,prefs.gap)===true;
  if(accepted&&!test)last=signature;refresh();return accepted;
 }
 window.LexiconSpeech={receive:speak,cancel:stop,init(translate){t=translate;
  $('speech-enabled').onchange=()=>{prefs.enabled=$('speech-enabled').checked;stop();save();refresh()};
  $('speech-repeats').onchange=()=>{prefs.repeats=Math.round(Math.min(5,Math.max(1,Number($('speech-repeats').value)||1)));stop();save();refresh()};
  $('speech-gap').onchange=()=>{prefs.gap=Math.round(Math.min(30,Math.max(1,Number($('speech-gap').value)||5)));stop();save();refresh()};
  $('speech-test').onclick=()=>speak([{word:'ПАПА',page:402,column:3,position:1}],'test',true);
  $('speech-stop').onclick=stop;window.addEventListener('lexicon:speech-status',event=>{if(event.detail!=='ready')stop();refresh(event.detail)});
  window.addEventListener('lexicon:format-changed',()=>{stop();refresh()});window.addEventListener('pagehide',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});refresh();
 }};
})();
