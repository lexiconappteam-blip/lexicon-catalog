/* Five user-built presets. Credentials stay in their existing integration settings. */
(() => {
 const count = 5;
 const groups = ['search', 'formats', 'speech', 'connections'];
 const $ = id => document.getElementById(id);
 const text = (ru, en) => document.documentElement.lang === 'en' ? en : ru;
 const clone = value => JSON.parse(JSON.stringify(value));
 const context = () => window.LexiconPresetContext;
 const currentScope = () => 'local';
 const object = value => value && typeof value === 'object' && !Array.isArray(value);
 let scope = currentScope(), revision = 0, active = -1, editor = 0, applying = false;
 let applied=-1, restoreTask=Promise.resolve(), restoreRevision=0;
 let slots = Array(count).fill(null), configPanel='search', inEditor=false;
 let baseConnections=null,connectionsMode='base',connectionQueue=Promise.resolve(),connectionsLoading=false;
 let lastView=$('presets-view').hidden?($('settings-view').hidden?'books':'settings'):'presets';
 const baseKey=()=>storageKey()+'.base-connections';
 function storeBase(value){baseConnections=clone(value);localStorage.setItem(baseKey(),JSON.stringify(baseConnections))}
 function loadBase(){try{baseConnections=JSON.parse(localStorage.getItem(baseKey()))}catch{baseConnections=null}if(!object(baseConnections))storeBase(context().snapshot().connections)}
 function resolvedConnections(preset){return clone(preset?.connectionsMode==='custom'?preset.settings.connections:baseConnections)}
 function applyConnections(value){const generation=revision;connectionQueue=connectionQueue.catch(()=>{}).then(async()=>{if(generation!==revision)return false;connectionsLoading=true;try{return await context().applyConnections(clone(value))}finally{connectionsLoading=false}});return connectionQueue}
 async function restoreActive(){
  const request=++restoreRevision,generation=revision;applied=-1;render();
  restoreTask=restoreTask.catch(()=>{}).then(async()=>{
   await context().ready();await window.LexiconAccount?.ready();await window.LexiconAccount?.settingsReady();await connectionQueue;
   if(request!==restoreRevision||generation!==revision||applying||!slots[active])return;
   if(context().state().view==='settings'||context().state().view==='presets')return;
   const index=active,preset=slots[index],settings=clone(preset.settings);settings.connections=resolvedConnections(preset);settings.search.injectRules=settings.connections.inject?.rules||settings.search.injectRules;
   applying=true;render();
   try{const accepted=await context().apply(settings,preset.sections,{restore:true});if(accepted&&request===restoreRevision&&generation===revision&&index===active)applied=index}
   catch(error){status(error.message||text('Не удалось восстановить пресет.','Could not restore preset.'))}
   finally{applying=false;render()}
  });return restoreTask;
 }
 function connectionOrigin(){
  $('preset-connections-origin').hidden=!inEditor||configPanel!=='integrations';
  $('preset-connections-label').textContent=connectionsMode==='base'?text('Из базовых настроек','From basic settings'):text('Свои подключения для P','Custom connections for P')+(editor+1);
  $('preset-connections-reset').hidden=connectionsMode==='base';
 }
 function markConnectionEdit(event){if(!applying&&!connectionsLoading&&inEditor&&$('settings-panel-integrations').contains(event.target)){connectionsMode='custom';connectionOrigin();dirty()}}
 $('settings-panel-integrations').addEventListener('input',markConnectionEdit);$('settings-panel-integrations').addEventListener('change',markConnectionEdit);
 function changedConnections(){if(connectionsLoading||applying)return;if(inEditor){connectionsMode='custom';connectionOrigin();dirty()}else if(lastView==='settings')queueMicrotask(()=>{if(lastView==='settings'&&!connectionsLoading)storeBase(context().snapshot().connections)})}
 window.addEventListener('lexicon:api-config',changedConnections);
 $('settings-panel-integrations').addEventListener('change',()=>{if(lastView==='settings')changedConnections()});
 $('settings-panel-general').addEventListener('change',event=>{if(event.target.id==='result-notifications')changedConnections()});
 window.addEventListener('pagehide',()=>{if(lastView==='settings'&&!connectionsLoading)storeBase(context().snapshot().connections)});
 $('preset-connections-reset').onclick=async()=>{if(applying)return;await applyConnections(baseConnections);connectionsMode='base';connectionOrigin();dirty()};
 const homes=new Map();
 for(const id of ['settings-panel-result','settings-panel-integrations']){const node=$(id),anchor=document.createComment(id);node.before(anchor);homes.set(id,{node,anchor,label:node.getAttribute('aria-labelledby')})}
 function placePanel(){
  connectionOrigin();
  for(const {node,anchor,label} of homes.values()){anchor.after(node);node.setAttribute('aria-labelledby',label)}
  if(inEditor){
   document.querySelectorAll('[data-preset-panel]').forEach(button=>{button.setAttribute('aria-selected',String(button.dataset.presetPanel===configPanel));button.tabIndex=button.dataset.presetPanel===configPanel?0:-1});
   $('preset-search-controls').hidden=configPanel!=='search';
   const item=homes.get('settings-panel-'+configPanel);
   if(item){$('preset-config-host').append(item.node);item.node.hidden=false;item.node.setAttribute('aria-labelledby','preset-panel-'+configPanel)}
  }else{
   const selected=document.querySelector('[data-settings-tab][aria-selected=true]')?.dataset.settingsTab||'general';
   for(const [id,{node}] of homes)node.hidden=id!=='settings-panel-'+selected;
  }
 }
 function updateSource(){
  const mode=$('preset-mode').value;
  for(const button of document.querySelectorAll('[data-preset-mode]')){const selected=button.dataset.presetMode===mode;button.setAttribute('aria-checked',String(selected));button.tabIndex=selected?0:-1}
  $('preset-api-choice').hidden=mode!=='api';
 }
 function fillApiSources(value=$('preset-source').value){
  const sources=context().searchOptions().sources;$('preset-api-options').replaceChildren();
  $('preset-source').value=sources.some(item=>item.id===value)?value:sources[0]?.id||'';
  $('preset-api-empty').hidden=sources.length>0;
  for(const item of sources){const button=document.createElement('button');button.type='button';button.textContent=item.name;button.dataset.presetApi=item.id;button.setAttribute('role','radio');button.setAttribute('aria-checked',String(item.id===$('preset-source').value));button.tabIndex=item.id===$('preset-source').value?0:-1;button.onclick=()=>{$('preset-source').value=item.id;fillApiSources(item.id);dirty()};$('preset-api-options').append(button)}
 }
 function fillSearch(){
  const current=slots[editor]?.settings.search||context().snapshot().search;
  $('preset-mode').value=current.mode;fillApiSources(current.source);updateSource();
 }
 for(const button of document.querySelectorAll('[data-preset-mode]'))button.onclick=()=>{$('preset-mode').value=button.dataset.presetMode;updateSource();fillApiSources();dirty()};
 function radioKeys(event,selector){if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;const buttons=[...event.currentTarget.querySelectorAll(selector)],index=buttons.indexOf(document.activeElement);if(index<0)return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(['ArrowLeft','ArrowUp'].includes(event.key)?-1:1)+buttons.length)%buttons.length;buttons[next].click();event.currentTarget.querySelectorAll(selector)[next]?.focus()}
 $('preset-mode-switch').onkeydown=event=>radioKeys(event,'[data-preset-mode]');$('preset-api-options').onkeydown=event=>radioKeys(event,'[data-preset-api]');
 function dirty(){if(inEditor)$('preset-dirty').hidden=false}
 window.addEventListener('lexicon:view-changed',event=>{
  const next=event.detail.view,previous=lastView;lastView=next;
  inEditor=next==='presets';
  if(previous!==next&&!applying){
   if(previous==='settings')storeBase(context().snapshot().connections);
   if(next==='settings')applyConnections(baseConnections);
   else if(next==='presets'){connectionsMode=slots[editor]?.connectionsMode||'base';applyConnections(resolvedConnections(slots[editor]))}
   else if(previous==='settings'||previous==='presets')applyConnections(resolvedConnections(slots[active]));
  }
  placePanel();if(inEditor)fillSearch();render();
  if(next==='search'&&!applying&&previous!==next)restoreActive();
 });
 for(const button of document.querySelectorAll('[data-preset-panel]')){button.id='preset-panel-'+button.dataset.presetPanel;button.onclick=()=>{configPanel=button.dataset.presetPanel;placePanel()}}
 $('presets-view').addEventListener('input',dirty);$('presets-view').addEventListener('change',dirty);
 document.querySelector('.preset-config-tabs').onkeydown=event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;const buttons=[...document.querySelectorAll('[data-preset-panel]:not(:disabled)')],at=buttons.indexOf(document.activeElement);if(at<0)return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(at+(event.key==='ArrowLeft'?-1:1)+buttons.length)%buttons.length;buttons[next].click();buttons[next].focus()};
 const storageKey = () => 'lexicon.web.presets.' + scope;

 function normalize(value) {
  if (!object(value) || !object(value.settings) || !Array.isArray(value.sections) || typeof value.name !== 'string') return null;
  const sections = groups.filter(group => value.sections?.includes(group) && object(value.settings[group]));
  if (!sections.length) return null;
  if (sections.includes('search') && !['manual', 'inject', 'api'].includes(value.settings.search.mode)) return null;
  if(object(value.settings.search))delete value.settings.search.book;
  const defaults=context().snapshot();
  return {name: value.name.trim().slice(0, 48), connectionsMode:value.connectionsMode==='base'?'base':'custom', sections:[...groups], settings:Object.fromEntries(groups.map(group=>[group,clone(sections.includes(group)?value.settings[group]:defaults[group])]))};
 }

 function load() {
  slots = Array(count).fill(null);active = -1;editor = 0;
  try {
   const saved = JSON.parse(localStorage.getItem(storageKey()));
   slots = Array.from({length: count}, (_, index) => normalize(saved?.slots?.[index]));
   if (Number.isInteger(saved?.active) && slots[saved.active]) active = saved.active;
   editor = active >= 0 ? active : 0;
   if(saved&&saved.version!==3)localStorage.setItem(storageKey(),JSON.stringify({version:3,slots,active}));
  } catch {}
 }

 function persist(nextSlots, nextActive) {
  try {
   localStorage.setItem(storageKey(), JSON.stringify({version: 3, slots: nextSlots, active: nextActive}));
  } catch {
   status(text('Не удалось сохранить пресет. Проверьте свободное место в браузере.', 'Could not save the preset. Check browser storage.'));
   return false;
  }
  slots = nextSlots;active = nextActive;
  return true;
 }

 function status(message = '') {
  $('preset-status').textContent = message;
  $('preset-status').hidden = !message;
 }

 function render() {
  document.querySelectorAll('[data-preset-slot]').forEach(button => {
   const index = Number(button.dataset.presetSlot), saved = slots[index];
   const selected = button.closest('#preset-editor') ? editor === index : active === index && applied === index;
   button.setAttribute('aria-pressed', String(selected));
   button.classList.toggle('is-empty', !saved);
   button.disabled = applying;
   button.title = saved?.name || text('Пустой пресет', 'Empty preset');
   button.setAttribute('aria-label', 'P' + (index + 1) + ' · ' + button.title);
  });
  document.querySelectorAll('[data-preset-caption]').forEach(node => {
   node.textContent = active < 0 ? '' : slots[active]?.name || 'P' + (active + 1);
   node.hidden = active < 0;
  });
  const connectionContext=$('preset-connection-context');
  if(connectionContext){connectionContext.hidden=inEditor;connectionContext.textContent=text('Базовые подключения для пресетов.','Basic connections for presets.')}
  connectionOrigin();
  $('preset-save').disabled = applying;
  $('preset-clear').disabled = applying || !slots[editor];
 }

 function fillEditor() {
  const saved = slots[editor];
  connectionsMode=saved?.connectionsMode||'base';
  $('preset-name').value = saved?.name || '';
  $('preset-name').placeholder = text('Название пресета ', 'Preset name ') + (editor + 1);
  $('preset-editor-slot').textContent = 'P' + (editor + 1);
  placePanel();render();
 }

 async function choose(index) {
  if (applying) return;
  ++restoreRevision;
  await connectionQueue;
  if(lastView==='settings')storeBase(context().snapshot().connections);
  editor = index;fillEditor();status();
  const preset = slots[index];
  if (!preset) {
   context().edit();
   await applyConnections(baseConnections);
   $('preset-name').focus();
   return;
  }
  const generation = revision;
  applying = true;render();
  try {
   const settings=clone(preset.settings);settings.connections=resolvedConnections(preset);settings.search.injectRules=settings.connections.inject?.rules||settings.search.injectRules;
   const accepted = await context().apply(settings, preset.sections);
   if (generation !== revision || !accepted) return;
   if (persist(slots, index)) {
    applied=index;
    fillSearch();$('preset-dirty').hidden=true;render();
    window.LexiconToast(text('Применён пресет ', 'Applied preset ') + 'P' + (index + 1));
   }
  } catch (error) {
   if (generation === revision) {
    status(error.message || text('Не удалось применить пресет.', 'Could not apply preset.'));
    window.LexiconToast($('preset-status').textContent);
   }
  } finally {
   applying = false;render();
  }
 }

 async function save() {
  if(applying)return;
  await connectionQueue;
  const sections = [...groups];
  const snapshot = context().snapshot(), previousSearch=JSON.stringify(snapshot.search);
  snapshot.search={...snapshot.search,mode:$('preset-mode').value,source:$('preset-source').value};
  if(connectionsMode==='base')snapshot.connections=clone(baseConnections);
  else if(JSON.stringify(snapshot.connections)===JSON.stringify(baseConnections))connectionsMode='base';
  const preset = {connectionsMode,name: $('preset-name').value.trim().slice(0, 48) || 'P' + (editor + 1), sections,
   settings: Object.fromEntries(sections.map(group => [group, clone(snapshot[group])]))};
  const generation=revision;
  if(sections.includes('search')&&JSON.stringify(snapshot.search)!==previousSearch){
   applying=true;render();
   try{if(!await context().apply(clone(preset.settings),sections)||generation!==revision)return}
   catch(error){status(error.message||text('Не удалось применить настройки.','Could not apply settings.'));return}
   finally{applying=false;render()}
  }
  const next = [...slots];next[editor] = preset;
  if (!persist(next, editor)) return;
  applied=editor;
  fillEditor();$('preset-dirty').hidden=true;status(text('Сохранено', 'Saved'));
  window.LexiconToast(text('Пресет сохранён', 'Preset saved'), $('preset-save'));
 }

 for (const host of document.querySelectorAll('[data-preset-switch]')) {
  host.setAttribute('role', 'group');
  host.setAttribute('aria-label', text('Пресеты настроек', 'Settings presets'));
  for (let index = 0; index < count; index++) {
   const button = document.createElement('button');
   button.type = 'button';button.textContent = 'P' + (index + 1);button.dataset.presetSlot = index;
   button.onclick = () => choose(index);
   host.append(button);
  }
 }
 $('preset-save').onclick = save;
 $('preset-clear').onclick = () => {
  if (!slots[editor] || !window.confirm(text('Очистить пресет ', 'Clear preset ') + 'P' + (editor + 1) + '?')) return;
  const next = [...slots];next[editor] = null;
  if (persist(next, active === editor ? -1 : active)) {fillEditor();status(text('Пресет очищен', 'Preset cleared'))}
 };
 window.addEventListener('lexicon:account-changed', () => {
  if (scope === currentScope()) return;
  scope = currentScope();revision++;applied=-1;load();loadBase();fillEditor();status();restoreActive();
 });
 window.addEventListener('storage', event => {
  if (event.key !== storageKey()) return;
  revision++;
  const selected = active, editing = editor;
  load();active = slots[selected] ? selected : -1;editor = editing;
  if (!$('preset-editor').contains(document.activeElement)) fillEditor();else render();
 });
 for(const id of ['manual-mode','inject-mode','api-mode'])$(id).addEventListener('click',()=>queueMicrotask(()=>{if(!applying&&slots[active]&&context().snapshot().search.mode!==slots[active].settings.search.mode){applied=-1;render()}}));
 window.addEventListener('lexicon:book-selected',()=>{if(!applying)restoreActive()});
 window.addEventListener('lexicon:api-config',()=>{if(inEditor)fillApiSources()});
 load();loadBase();fillEditor();
 if(!$('presets-view').hidden){inEditor=true;placePanel();fillSearch()}
 applyConnections(lastView==='settings'?baseConnections:resolvedConnections(slots[active]));
 restoreActive();
})();
