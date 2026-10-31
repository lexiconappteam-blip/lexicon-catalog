const $=id=>document.getElementById(id);
const strings={
  "ru": {
    "workspace": "ВАША БИБЛИОТЕКА",
    "edition": "Личная библиотека для вашего выступления",
    "contactShort": "Связаться с нами ↗",
    "library": "Библиотека",
    "collection": "ВАША КОЛЛЕКЦИЯ",
    "books": "Книги",
    "chooseBook": "Выберите книгу, в которой хотите найти слово.",
    "favorites": "Избранное",
    "quickAccess": "Быстрый доступ",
    "catalog": "Каталог книг",
    "findBook": "Найти книгу в каталоге",
    "newBooks": "Библиотека будет расти",
    "requestNote": "Хотите добавить книгу? Напишите нам.",
    "suggestBook": "Предложить книгу ↗",
    "allBooks": "Все книги",
    "wordSearch": "ПОИСК В КНИГЕ",
    "draft": "База проходит сверку",
    "wordPlaceholder": "Начните вводить слово",
    "equal": "Е и Ё равнозначны при поиске",
    "startTyping": "Начните с первых букв",
    "searchHint": "Выберите подсказку или введите слово целиком.",
    "recent": "НЕДАВНИЕ ЗАПРОСЫ",
    "history": "История",
    "historyNote": "Найденные слова сохраняются на этом устройстве.",
    "clear": "Очистить",
    "personal": "Под ваш сценарий",
    "settings": "Настройки",
    "copySettings": "Формат результата",
    "copyFieldsNote": "Слово → страница → колонка → строчка.",
    "unknownWatchNote": "При опечатке отправится ближайшее слово с координатами, знаком * и исходным вводом. Если варианта нет — исходный ввод с * без координат.",
    "speechTitle": "Озвучивание в наушник",
    "speechEnable": "Озвучивать результат",
    "speechRepeats": "Количество повторов",
    "speechGap": "Пауза между повторами, секунд",
    "speechOnly": "Только в наушниках. Новый запрос отменяет предыдущую озвучку.",
    "speechWebNote": "Звук идёт через системный аудиовыход. Наушники нужно проверить вручную.",
    "speechWebIdle": "Включите озвучивание и нажмите «Проверить». После перезагрузки его нужно включить снова.",
    "speechWebReady": "Озвучивание включено для текущего сеанса.",
    "speechWebVoiceMissing": "Локальный русский голос ещё не доступен. Проверьте голоса синтеза речи в настройках устройства и нажмите «Проверить».",
    "speechWebTap": "Нажмите «Проверить», чтобы разрешить воспроизведение в браузере.",
    "speechWebConfirm": "Браузер не может гарантировать вывод только в наушники. Проверьте системный аудиовыход: при его переключении звук может пойти через динамик. Включить озвучивание для текущего сеанса?",
    "speechLoading": "Подготовка голоса…",
    "speechVoiceMissing": "Установите офлайн-голос русского языка в настройках синтеза речи Android.",
    "speechHeadphones": "Подключите наушники. Динамик телефона не используется.",
    "speechRoute": "Не удалось подтвердить вывод в наушники. Озвучивание остановлено.",
    "speechError": "Озвучивание остановлено. Проверьте голос и подключение наушников.",
    "speechUnavailable": "Синтез речи недоступен на этом устройстве.",
    "speechReady": "Наушники подключены. Перед воспроизведением приложение проверит маршрут звука.",
    "speechStop": "Остановить",
    "formatSpeech": "Озвучивание",
    "speechLabelMode": "Формат озвучивания",
    "speechPlain": "Только слово и числа",
    "speechExplained": "С названиями: страница, колонка, строчка",
    "formatFor": "Настроить для",
    "formatCopy": "Копирование",
    "formatNotification": "Уведомления",
    "formatImpaler": "Impaler",
    "separator": "Разделитель",
    "separatorHint": "Пусто — без разделителя.",
    "preview": "Пример",
    "pickField": "Выберите хотя бы одно поле.",
    "keepHistory": "История поиска",
    "localHistory": "Сохранять найденные слова на этом устройстве",
    "dataNote": "База ещё проходит сверку. В написании слов и координатах возможны ошибки.",
    "footerText": "Ваша личная библиотека",
    "open": "Открыть книгу",
    "favoriteEmpty": "Добавьте книгу в избранное по звёздочке — она появится здесь.",
    "noBooks": "Книги с таким названием не найдены.",
    "category": "СПРАВОЧНОЕ ИЗДАНИЕ",
    "entries": "слов",
    "favoriteAdd": "Добавить книгу в избранное",
    "favoriteRemove": "Убрать книгу из избранного",
    "page": "Страница",
    "column": "Колонка",
    "position": "Строчка",
    "word": "Слово",
    "copy": "Копировать",
    "share": "Поделиться",
    "copied": "Скопировано",
    "copyFail": "Скопируйте выделенный текст: браузер ограничил буфер обмена.",
    "notFound": "Точное совпадение не найдено",
    "try": "Возможно, вы ищете:",
    "prefix": "Выберите слово из подсказок",
    "noHistory": "История пока пуста. Найдите первое слово в книге.",
    "offline": "Нет связи. Проверьте подключение и повторите запрос.",
    "online": "Книга подключена",
    "storageFail": "Браузер не разрешает сохранять настройки.",
    "loadingBooks": "Загружаем книги…",
    "retry": "Повторить",
    "found": "СЛОВО НАЙДЕНО",
    "search": "Поиск",
    "oneBook": "книга",
    "manyBooks": "книг",
    "languageLabel": "Язык",
    "manualMode": "По слову",
    "injectMode": "Через Inject",
    "injectHelp": "Укажите свой ID для получения слова из Inject.",
    "injectId": "Integration ID",
    "checkConnection": "Подключить",
    "startReceive": "Начать приём",
    "stopReceive": "Остановить",
    "injectReady": "Откройте книгу и нажмите «Через Inject».",
    "injectMissing": "Для подключения нужен адрес API Inject. Он пока не указан.",
    "injectWaiting": "Ожидаем слово из Inject…",
    "injectNeedId": "Укажите свой ID Inject в настройках.",
    "injectReceived": "Слово получено из Inject",
    "injectPaused": "Приём остановлен.",
    "injectRetry": "Связь прервалась. Повторяем автоматически…",
    "injectResumeHint": "Приём продолжится, когда вернётесь в приложение.",
    "checkUpdates": "Проверить обновления",
    "downloadUpdate": "Скачать обновление",
    "noUpdates": "Установлена актуальная версия.",
    "updateAvailable": "Доступна новая версия",
    "checkingUpdates": "Проверяем обновления…",
    "injectSetupHint": "Подключите Inject, чтобы получать слова автоматически.",
    "injectConnected": "Подключено. В поиске выберите «Через Inject».",
    "injectSettings": "Настроить Inject →",
    "injectChecking": "Подключаем…",
    "keyboardDone": "Готово",
    "themeLabel": "Тема",
    "themeSystem": "Системная тема",
    "themeLight": "Светлая тема",
    "themeDark": "Тёмная тема",
    "resultNotifications": "Уведомления",
    "notificationTest": "Проверить",
    "notificationDenied": "Разрешите уведомления для Lexicon в настройках устройства или браузера.",
    "notificationUnavailable": "На iPhone откройте Lexicon через значок на главном экране: Safari → Поделиться → На экран «Домой». В этом браузере уведомления недоступны.",
    "notificationFailed": "Не удалось показать уведомление.",
    "notificationTestSent": "Тестовое уведомление отправлено.",
    "relayConnect": "Получить ссылку",
    "relayEnable": "Передавать результат",
    "relayFailed": "Не удалось связаться с сервисом. Повторите подключение.",
    "relayLimit": "Лимит новых подключений на сегодня. Попробуйте завтра.",
    "relayLink": "Ссылка для Impaler",
    "relayCopy": "Скопировать ссылку",
    "relayCopied": "Ссылка скопирована",
    "relayCopyManually": "Скопируйте выделенную ссылку вручную.",
    "relayWatchHint": "Вставьте ссылку в Custom URL в Impaler. Для выбора данных попробуйте поле text.",
    "relayPlaceholder": "Появится после подключения",
    "fieldLabels": "Подписи полей"
  },
  "en": {
    "workspace": "YOUR LIBRARY",
    "edition": "Your library for your performance",
    "contactShort": "Contact us ↗",
    "library": "Library",
    "collection": "YOUR COLLECTION",
    "books": "Books",
    "chooseBook": "Choose a book to find a word in.",
    "favorites": "Favorites",
    "quickAccess": "Quick access",
    "catalog": "Book catalog",
    "findBook": "Find a book in the catalog",
    "newBooks": "More books to come",
    "requestNote": "Have a book in mind? Get in touch.",
    "suggestBook": "Suggest a book ↗",
    "allBooks": "All books",
    "wordSearch": "SEARCH THIS BOOK",
    "draft": "Data under review",
    "wordPlaceholder": "Start typing a word",
    "equal": "Е and Ё are equivalent in search",
    "startTyping": "Start with a few letters",
    "searchHint": "Choose a suggestion or type a complete word.",
    "recent": "RECENT SEARCHES",
    "history": "History",
    "historyNote": "Found words are saved on this device.",
    "clear": "Clear",
    "personal": "Make it yours",
    "settings": "Settings",
    "copySettings": "Result format",
    "copyFieldsNote": "Order: word → book page → column → line. Coordinates come from the selected database.",
    "unknownWatchNote": "A typo sends the closest word with coordinates, *, and original input. With no close match, only the original input with * is sent.",
    "speechTitle": "Private headphone speech",
    "speechEnable": "Speak results",
    "speechRepeats": "Repeats",
    "speechGap": "Pause between repeats, seconds",
    "speechOnly": "Headphones only. A new query cancels previous speech.",
    "speechWebNote": "Sound uses the system audio output. Check your headphones manually.",
    "speechWebIdle": "Enable speech, then tap Test. Enable it again after reloading.",
    "speechWebReady": "Speech is enabled for this session.",
    "speechWebVoiceMissing": "A local Russian voice is not available yet. Check device voice settings and tap Test.",
    "speechWebTap": "Tap Test to allow browser playback.",
    "speechWebConfirm": "The browser cannot guarantee headphones-only output. Check the system audio output: switching it may play sound through the speaker. Enable speech for this session?",
    "speechLoading": "Preparing voice…",
    "speechVoiceMissing": "Install an offline Russian voice in Android text-to-speech settings.",
    "speechHeadphones": "Connect headphones. The phone speaker is not used.",
    "speechRoute": "Headphone routing could not be verified. Speech stopped.",
    "speechError": "Speech stopped. Check the voice and headphone connection.",
    "speechUnavailable": "Text-to-speech is unavailable on this device.",
    "speechReady": "Headphones connected. The audio route is checked before playback.",
    "speechStop": "Stop",
    "formatSpeech": "Speech",
    "speechLabelMode": "Speech format",
    "speechPlain": "Word and numbers only",
    "speechExplained": "With page, column and line labels",
    "formatFor": "Format for",
    "formatCopy": "Copying",
    "formatNotification": "Notifications",
    "formatImpaler": "Impaler",
    "separator": "Separator",
    "separatorHint": "Leave empty for no separator.",
    "preview": "Preview",
    "pickField": "Select at least one field.",
    "keepHistory": "Search history",
    "localHistory": "Save found words on this device",
    "dataNote": "The database is still under review. Words and locations may contain errors.",
    "footerText": "Your personal library",
    "open": "Open book",
    "favoriteEmpty": "Tap the star on a book to keep it here.",
    "noBooks": "No books match this title.",
    "category": "REFERENCE BOOK",
    "entries": "words",
    "favoriteAdd": "Add book to favorites",
    "favoriteRemove": "Remove book from favorites",
    "page": "Page",
    "column": "Column",
    "position": "Line",
    "word": "Word",
    "copy": "Copy",
    "share": "Share",
    "copied": "Copied",
    "copyFail": "Copy the selected text: your browser restricted clipboard access.",
    "notFound": "No exact match",
    "try": "Did you mean:",
    "prefix": "Choose a word from the suggestions",
    "noHistory": "No searches yet. Find your first word in a book.",
    "offline": "Cannot connect. Check your connection and try again.",
    "online": "Book connected",
    "storageFail": "Your browser cannot save preferences.",
    "loadingBooks": "Loading books…",
    "retry": "Retry",
    "found": "WORD FOUND",
    "search": "Search",
    "oneBook": "book",
    "manyBooks": "books",
    "languageLabel": "Language",
    "manualMode": "Manual",
    "injectMode": "Via Inject",
    "injectHelp": "Enter your ID to receive a word from Inject.",
    "injectId": "Integration ID",
    "checkConnection": "Connect",
    "startReceive": "Start receiving",
    "stopReceive": "Stop",
    "injectReady": "Open a book and tap Via Inject.",
    "injectMissing": "The Inject API address has not been configured yet.",
    "injectWaiting": "Waiting for a word from Inject…",
    "injectNeedId": "Enter your Inject ID in Settings.",
    "injectReceived": "Word received from Inject",
    "injectPaused": "Receiving stopped.",
    "injectRetry": "Connection interrupted. Retrying automatically…",
    "injectResumeHint": "Receiving will resume when you return to the app.",
    "checkUpdates": "Check for updates",
    "downloadUpdate": "Download update",
    "noUpdates": "You have the latest version.",
    "updateAvailable": "A new version is available",
    "checkingUpdates": "Checking for updates…",
    "injectSetupHint": "Connect Inject to receive words automatically.",
    "injectConnected": "Connected. Choose Via Inject in Search.",
    "injectSettings": "Inject settings →",
    "injectChecking": "Connecting…",
    "keyboardDone": "Done",
    "themeLabel": "Theme",
    "themeSystem": "System theme",
    "themeLight": "Light theme",
    "themeDark": "Dark theme",
    "resultNotifications": "Notifications",
    "notificationTest": "Test",
    "notificationDenied": "Allow notifications for Lexicon in your device or browser settings.",
    "notificationUnavailable": "On iPhone, open Lexicon from its Home Screen icon: Safari → Share → Add to Home Screen. Notifications are unavailable in this browser.",
    "notificationFailed": "Could not show a notification.",
    "notificationTestSent": "Test notification sent.",
    "relayConnect": "Get URL",
    "relayEnable": "Send result",
    "relayFailed": "Cannot reach the service. Try connecting again.",
    "relayLimit": "New connection limit reached. Try tomorrow.",
    "relayLink": "Impaler URL",
    "relayCopy": "Copy URL",
    "relayCopied": "URL copied",
    "relayCopyManually": "Copy the selected URL manually.",
    "relayWatchHint": "Paste this URL into Custom URL in Impaler. Try text as the data field.",
    "relayPlaceholder": "Available after connecting",
    "fieldLabels": "Field labels"
  }
};
Object.assign(strings.ru,{"apiMode": "Через API", "apiSettings": "Настроить API →", "apiTitle": "API приложения", "apiUse": "Использовать API", "apiOwnHint": "POST передаёт слово в Lexicon, GET получает последний результат.", "apiCreate": "Получить API", "apiName": "Название", "apiField": "Поле JSON", "apiWriteKey": "Ключ записи (Bearer)", "apiCopyKey": "Скопировать ключ", "apiCopyUrl": "Скопировать URL", "apiTest": "Проверить API", "apiFormat": "Формат результата", "apiExternal": "Подключения к другим API", "apiAdd": "＋ Добавить", "apiForeground": "Приём работает на открытом экране поиска в режиме «Через API». Без открытого приложения POST сохраняет слово, но не выполняет поиск.", "apiGetNote": "GET возвращает последний результат в поле value.", "apiPostNote": "POST принимает JSON с полем value. Заголовок Authorization: Bearer и ваш ключ. Проверка отправит слово «ПАПА».", "apiUrlError": "Укажите полный HTTPS-адрес без логина, пароля и фрагмента #.", "apiFieldError": "Проверьте поле JSON. Допустим путь вроде data.word или results.0.word.", "apiBodyError": "Проверьте JSON-тело запроса или токен авторизации.", "apiJsonError": "Сервис вернул не JSON.", "apiResponseLimit": "Ответ API слишком большой.", "apiTimeout": "API не ответил за 12 секунд.", "apiDisabled": "Подключение не включено.", "apiNotConfigured": "Настройте и включите источник API.", "apiNetworkError": "Нет связи с API. Проверьте URL и разрешение CORS на стороне сервиса.", "apiHttp": "Ответ сервера: HTTP", "apiCopyFailed": "Не удалось скопировать. Выделите значение и скопируйте вручную.", "apiReceive": "Получать слово", "apiSend": "Отправлять результат", "apiRequestBody": "Тело POST (JSON)", "apiAuthorization": "Авторизация (необязательно)", "apiBearer": "Bearer-токен — хранится на этом устройстве", "apiRemove": "Удалить", "apiChecking": "Проверка…", "apiTestSent": "Тест отправлен", "apiConnected": "Соединение проверено", "apiWaiting": "Ожидание слова…", "apiNotTested": "Ещё не проверено", "apiSendTestNote": "Проверка отправит пример результата на указанный адрес. Автоматическая отправка — после включения и нового поиска.", "apiReceiveNote": "Из ответа читается указанное поле JSON. Для веб-приложения сервис должен разрешать CORS.", "apiSent": "Результат отправлен", "apiReceived": "Слово получено", "apiReady": "API готов к подключению"});
Object.assign(strings.en,{"apiMode": "Via API", "apiSettings": "Configure API \u2192", "apiTitle": "Application API", "apiUse": "Use API", "apiOwnHint": "POST sends a word to Lexicon; GET reads the latest result.", "apiCreate": "Get API", "apiName": "Name", "apiField": "JSON field", "apiWriteKey": "Write key (Bearer)", "apiCopyKey": "Copy key", "apiCopyUrl": "Copy URL", "apiTest": "Test API", "apiFormat": "Result format", "apiExternal": "Other API connections", "apiAdd": "\uff0b Add", "apiForeground": "Receiving works on the open search screen in Via API mode. With the app closed, POST stores input but does not run a search.", "apiGetNote": "GET returns the latest result in value.", "apiPostNote": "POST accepts JSON with value and Authorization: Bearer plus your key. Test sends \u041f\u0410\u041f\u0410.", "apiUrlError": "Enter a complete HTTPS URL without embedded credentials or a fragment.", "apiFieldError": "Check the JSON field. Paths such as data.word or results.0.word are supported.", "apiBodyError": "Check the JSON request body or token.", "apiJsonError": "The service did not return JSON.", "apiResponseLimit": "API response is too large.", "apiTimeout": "API timed out after 12 seconds.", "apiDisabled": "Connection is disabled.", "apiNotConfigured": "Configure and enable an API source.", "apiNetworkError": "Cannot reach API. Check URL and the service CORS policy.", "apiHttp": "Server response: HTTP", "apiCopyFailed": "Copy failed. Select and copy the value manually.", "apiReceive": "Receive word", "apiSend": "Send result", "apiRequestBody": "POST body (JSON)", "apiAuthorization": "Authorization (optional)", "apiBearer": "Bearer token \u2014 stored on this device", "apiRemove": "Remove", "apiChecking": "Checking\u2026", "apiTestSent": "Test sent", "apiConnected": "Connection checked", "apiWaiting": "Waiting for a word\u2026", "apiNotTested": "Not checked yet", "apiSendTestNote": "Test sends a sample result to this URL. Automatic delivery starts after enabling and a new search.", "apiReceiveNote": "Reads the selected JSON field. Web integrations require CORS support.", "apiSent": "Result sent", "apiReceived": "Word received", "apiReady": "API ready to connect"});
$('theme').value=window.LexiconTheme.get();$('theme').onchange=()=>window.LexiconTheme.set($('theme').value);
Object.assign(strings.ru,{page:'Страница',page_pdf:'Страница PDF',bookPageShort:'В книге'});
Object.assign(strings.en,{page:'Page',page_pdf:'PDF page',bookPageShort:'In book'});
function read(name,fallback){try{return JSON.parse(localStorage.getItem('lexicon.web.'+name))??fallback}catch{return fallback}}
function save(name,value){try{localStorage.setItem('lexicon.web.'+name,JSON.stringify(value));return true}catch{toast(t('storageFail'));return false}}
const key=w=>String(w).normalize('NFC').toUpperCase().replaceAll('Ё','Е').replace(/[\u0300\u0301]/g,'').trim();
let lang=read('language','ru');if(!strings[lang])lang='ru';const t=k=>strings[lang][k]||k;
let recent=read('history',[]);if(!Array.isArray(recent))recent=[];
recent=recent.map(x=>typeof x==='string'?{word:x,book:'default'}:x).filter(x=>x&&typeof x.word==='string'&&typeof x.book==='string').slice(0,100);
let favorites=read('favoriteBooks',[]);if(!Array.isArray(favorites))favorites=[];
let copyFields=read('copyFields',['word','page','column','position']);if(!Array.isArray(copyFields))copyFields=['word','page','column','position'];copyFields=[...new Set(copyFields.map(x=>x==='page_pdf'?'page':x))].filter(x=>['word','page','column','position'].includes(x));save('copyFields',copyFields);
const resultLabels=false;
let resultFormats=read('resultFormats',{});if(!resultFormats||typeof resultFormats!=='object'||Array.isArray(resultFormats))resultFormats={};
for(const target of ['copy','notification','impaler','speech','api']){const saved=resultFormats[target];resultFormats[target]={...window.LexiconFormat.normalize(saved||{fields:copyFields,labels:resultLabels}),...(target==='speech'?{spokenLabels:saved?.spokenLabels===true}: {})}}
let formatTarget='copy';
window.LexiconResultFormat=(target='copy')=>window.LexiconFormat.normalize({...resultFormats[target],labels:target==='speech'&&resultFormats.speech.spokenLabels===true,lang,...(target==='speech'?{separator:' ',labelOrder:'after'}: {})});
let historyOn=read('historyOn',true),books=[],selected=null,data=null,controller=null,serial=0,resultTimer,searchTimer=null,toastTimer,currentView='books',apiMode=false;
function icon(name){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');const u=document.createElementNS(s.namespaceURI,'use');u.setAttribute('href','#i-'+name);s.append(u);s.setAttribute('aria-hidden','true');return s}
function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node}
function toast(text){const node=$('toast');node.textContent=text;node.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.hidden=true,1800)}
window.LexiconToast=toast;
function bookName(id){return books.find(b=>b.id===id)?.name||(id==='default'?'Толковый словарь':id)}
function route(){const params=new URLSearchParams();if(currentView==='search'&&selected){params.set('book',selected.id);const q=$('query').value.trim()||(data?.matches.length?data.query:'');if(q)params.set('q',q)}else if(currentView!=='books')params.set('view',currentView);return location.pathname+(params.size?'?'+params:'')}
function navigate(name,{push=true}={}){if(currentView==='search'&&name!=='search'){clearTimeout(searchTimer);searchTimer=null;controller?.abort();serial++;window.LexiconSpeech?.cancel();}if(name==='search'&&!selected){if(books.length)openBook(books[0].id);else navigate('books',{push});return;}if(currentView==='search'&&data?.matches.length&&selected&&historyOn)remember(data.matches[0].word,selected.id);clearTimeout(resultTimer);currentView=name;document.querySelectorAll('.view').forEach(e=>e.hidden=e.id!==name+'-view');document.querySelectorAll('[data-view]').forEach(b=>{const active=b.dataset.view===(name);b.classList.toggle('active',active);b.setAttribute('aria-current',active?'page':'false')});$('breadcrumb').textContent=name==='search'?t('books')+' / '+bookName(selected?.id):t(name==='books'?'library':name);if(name==='search')renderHistory();if(name!=='search'){pauseInject();window.LexiconApi?.pause()}else{resumeInject();if(apiMode)window.LexiconApi?.resume()};if(push)window.history.pushState(null,'',route());window.scrollTo(0,0)}
function cover(book){const box=el('div','cover');box.setAttribute('aria-hidden','true');box.append(el('span','cover-label',book.name),el('span','cover-letter','А'),el('span','cover-rule'),el('span','cover-bottom','LEXICON'));return box}
function favoriteButton(book){const b=el('button','star-button');const active=favorites.includes(book.id);b.type='button';b.setAttribute('aria-pressed',String(active));b.setAttribute('aria-label',t(active?'favoriteRemove':'favoriteAdd'));b.title=t(active?'favoriteRemove':'favoriteAdd');b.append(icon('star'));b.onclick=()=>{favorites=active?favorites.filter(id=>id!==book.id):[...favorites,book.id];save('favoriteBooks',favorites);renderBooks();renderSelected()};return b}
function openButton(book,compact=false){const b=el('button','open-book');b.type='button';b.setAttribute('aria-label',t('open')+': '+book.name);if(!compact)b.append(el('span','',t('open')));b.append(icon('arrow'));b.onclick=()=>openBook(book.id);return b}
function renderBooks(){const list=$('favorites-list');list.replaceChildren();const fav=books.filter(b=>favorites.includes(b.id));for(const book of fav){const card=el('article','favorite-card');const info=el('div','favorite-info');const title=el('h3');const titleButton=el('button','book-title',book.name);titleButton.onclick=()=>openBook(book.id);title.append(titleButton);info.append(el('span','kicker','LEXICON COLLECTION'),title,el('p','',book.entries.toLocaleString(lang)+' '+t('entries')),openButton(book));card.append(cover(book),info,favoriteButton(book));list.append(card)}if(!fav.length)list.append(el('div','favorite-empty',t('favoriteEmpty')));$('favorites-section').hidden=!fav.length;
 const query=key($('book-query').value);const filtered=books.filter(b=>key(b.name).includes(query));$('book-count').textContent=books.length+' '+t(books.length===1?'oneBook':'manyBooks');$('catalog-count').textContent=filtered.length+' / '+books.length;const catalog=$('catalog-list');catalog.replaceChildren();for(const book of filtered){const card=el('article','book-card');const art=el('div','book-art');const coverButton=el('button','cover-button');coverButton.setAttribute('aria-label',t('open')+': '+book.name);coverButton.append(cover(book));coverButton.onclick=()=>openBook(book.id);art.append(coverButton,favoriteButton(book));const info=el('div','book-info');const title=el('h3');const titleButton=el('button','book-title',book.name);titleButton.onclick=()=>openBook(book.id);title.append(titleButton);const bottom=el('div','card-bottom');bottom.append(el('span','data-note',t('draft')),openButton(book,true));info.append(el('span','category',t('category')),title,el('p','book-meta',book.entries.toLocaleString(lang)+' '+t('entries')),bottom);card.append(art,info);catalog.append(card)}if(!filtered.length)catalog.append(el('div','empty',t('noBooks')))}
function renderSelected(){if(!selected)return;$('selected-title').textContent=selected.name;const old=$('selected-favorite');const next=favoriteButton(selected);next.id='selected-favorite';old.replaceWith(next)}
function openBook(id,{query='',push=true}={}){clearTimeout(searchTimer);searchTimer=null;window.LexiconApi?.stop();apiMode=false;stopInject();injectMode=false;refreshInjectUI();if(query&&!injectMode)manualInputFinished=true;pauseInject();lastInjectEvent=null;suggestionsDismissed=false;const book=books.find(b=>b.id===id);if(!book){toast(t('offline'));return}if(controller)controller.abort();serial++;clearTimeout(resultTimer);selected=book;data=null;$('query').value=query;$('error').hidden=true;$('result-area').replaceChildren();$('suggestions').replaceChildren();$('welcome').hidden=!!query;renderSelected();navigate('search',{push});if(query)search()}
function remember(word,book){if(!historyOn)return;recent=recent.filter(x=>x.book!==book||key(x.word)!==key(word));recent.unshift({word,book});recent=recent.slice(0,100);save('history',recent);renderHistory()}
function renderHistory(){const list=$('history-list');list.replaceChildren();if(!recent.filter(x=>!selected||x.book===selected.id).length)list.append(el('p','empty',t('noHistory')));for(const item of recent.filter(x=>!selected||x.book===selected.id).slice(0,8)){const b=el('button','history-item');const mark=el('span','history-icon');mark.append(icon('history'));const details=el('span','history-details');details.append(el('strong','',item.word),el('small','',bookName(item.book)));b.append(mark,details,icon('arrow'));b.onclick=()=>openBook(item.book,{query:item.word});list.append(b)}}
function formatted(row){return window.LexiconFormat.format(row,window.LexiconResultFormat())}
function formatChanged(target=formatTarget){save('resultFormats',resultFormats);updateCopyPreview();if(data)render(data);window.dispatchEvent(new CustomEvent('lexicon:format-changed',{detail:{target}}))}
function renderFormatSwitch(){const fixed=[['copy',t('formatCopy')],['notification',t('formatNotification')],['impaler','Impaler'],['speech',t('formatSpeech')]],items=[...fixed,...(window.LexiconApi?.outputs()||[]).map(x=>[x.id,x.name])];if(!items.some(([id])=>id===formatTarget))formatTarget='copy';const group=$('format-target');group.replaceChildren();for(const [id,name] of items){const button=el('button','',name);button.type='button';button.id='format-'+id.replace(/[^a-zA-Z0-9_-]/g,'-');button.dataset.format=id;button.setAttribute('role','tab');button.setAttribute('aria-controls','format-editor');group.append(button)}}
function renderCopySettings(){renderFormatSwitch();if(!resultFormats[formatTarget]||typeof resultFormats[formatTarget]!=='object'||!Array.isArray(resultFormats[formatTarget].fields))resultFormats[formatTarget]=window.LexiconFormat.normalize({labels:false});const options=window.LexiconResultFormat(formatTarget),fields=$('copy-fields');document.querySelectorAll('[data-format]').forEach(button=>{const active=button.dataset.format===formatTarget;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1});$('format-editor').setAttribute('aria-labelledby','format-'+formatTarget.replace(/[^a-zA-Z0-9_-]/g,'-'));$('separator-settings').hidden=formatTarget==='speech';$('speech-format-settings').hidden=formatTarget!=='speech';$('speech-labels').checked=resultFormats.speech.spokenLabels===true;renderUncertainSettings(options);fields.replaceChildren();for(const field of ['word','page','column','position']){const label=el('label','copy-option');const input=el('input');input.type='checkbox';input.checked=options.fields.includes(field);input.name=field;input.onchange=()=>{const current=resultFormats[formatTarget];current.fields=input.checked?[...current.fields,field]:current.fields.filter(x=>x!==field);formatChanged()};label.append(el('span','',t(field)),input);fields.append(label)}$('result-separator').value=options.separator;updateCopyPreview()}
function renderUncertainSettings(options){const supported=['impaler','notification','speech','api'].includes(formatTarget)||formatTarget.startsWith('api:');$('uncertain-settings').hidden=!supported;for(const [id,key] of [['suggestion','useSuggestion'],['coordinates','suggestionCoordinates'],['original','includeOriginal']])$('uncertain-'+id).checked=options[key];$('uncertain-coordinates-row').hidden=!options.useSuggestion;$('uncertain-original-row').hidden=!options.useSuggestion;$('uncertain-preview').textContent=window.LexiconFormat.approximate('папаа',[{word:'ПАПА',page:402,column:3,position:1}],options)||'—'}
for(const [id,key] of [['suggestion','useSuggestion'],['coordinates','suggestionCoordinates'],['original','includeOriginal']])$('uncertain-'+id).onchange=()=>{resultFormats[formatTarget][key]=$('uncertain-'+id).checked;formatChanged()};
$('speech-labels').onchange=()=>{resultFormats.speech.spokenLabels=$('speech-labels').checked;formatChanged('speech')};
$('format-target').onclick=event=>{const button=event.target.closest('[data-format]');if(button){formatTarget=button.dataset.format;renderCopySettings()}};
$('format-target').onkeydown=event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;const buttons=[...$('format-target').querySelectorAll('[data-format]')],at=buttons.indexOf(document.activeElement);if(at<0)return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(at+(event.key==='ArrowLeft'?-1:1)+buttons.length)%buttons.length;const target=buttons[next].dataset.format;buttons[next].click();document.querySelector('[data-format="'+target+'"]').focus()};
$('result-separator').oninput=()=>{resultFormats[formatTarget].separator=$('result-separator').value;formatChanged()};
document.querySelectorAll('[data-separator]').forEach(button=>button.onclick=()=>{$('result-separator').value=button.dataset.separator;resultFormats[formatTarget].separator=button.dataset.separator;formatChanged()});
function updateCopyPreview(){const options=window.LexiconResultFormat(formatTarget);$('copy-preview').textContent=window.LexiconFormat.format({word:'ПАПА',page:402,column:3,position:1},options)||'—';$('copy-warning').hidden=!!options.fields.length;renderUncertainSettings(options)}
async function copy(row,query){if(!window.LexiconResultFormat('copy').fields.length){toast(t('pickField'));return}const output=query!==undefined?window.LexiconFormat.approximate(query,[row],window.LexiconResultFormat('copy')):formatted(row);try{if(window.LexiconAndroid)window.LexiconAndroid.copyText(output);else{if(!navigator.clipboard)throw Error();await navigator.clipboard.writeText(output)}toast(t('copied'))}catch{document.querySelector('.manual-copy')?.remove();const text=el('textarea','manual-copy');text.readOnly=true;text.value=output;text.setAttribute('aria-label',t('copy'));$('result-area').append(text);text.focus();text.select();toast(t('copyFail'))}}
function chip(word){const button=el('button','chip',word);button.onclick=()=>{openBook(selected.id,{query:word});$('query').focus({preventScroll:true})};return button}
let suggestionsDismissed=false,activeSuggestion=-1,manualInputFinished=false;
function closeSuggestions(){suggestionsDismissed=true;$('suggestions').hidden=true;$('query').setAttribute('aria-expanded','false');$('query').removeAttribute('aria-activedescendant');activeSuggestion=-1}
function showHistory(){
 if(currentView!=='search')navigate('search');closeSuggestions();$('query').blur();
 requestAnimationFrame(()=>{$('inline-history').scrollIntoView({block:'start',behavior:'auto'});$('inline-history').focus({preventScroll:true})});
}
$('search-history').onclick=showHistory;
function showInjectSettings(){navigate('settings');selectSettingsTab('integrations');requestAnimationFrame(()=>{$('inject-settings').scrollIntoView({block:'center'});$('inject-id').focus({preventScroll:true})})}
$('inject-settings-link').onclick=showInjectSettings;
function renderSuggestions(result){
 const list=$('suggestions');list.replaceChildren();activeSuggestion=-1;$('query').removeAttribute('aria-activedescendant');
 if(result.matches.length){list.hidden=true;$('query').setAttribute('aria-expanded','false');return}
 const exact=new Set(result.suggestions.map(key));
 const options=[...result.suggestions.map(word=>({word,typo:false})),...result.corrections.filter(word=>!exact.has(key(word))).map(word=>({word,typo:true}))].filter(x=>!result.matches.length||key(x.word)!==result.normalized).slice(0,12);
 for(const [i,item] of options.entries()){
  const button=el('button','search-option');button.type='button';button.id='suggestion-'+i;button.setAttribute('role','option');button.setAttribute('aria-selected','false');button.append(icon('search'),el('span','option-word',item.word));
  if(item.typo)button.append(el('small','option-note',lang==='ru'?'Возможный вариант':'Possible match'));
  button.onmousedown=e=>e.preventDefault();button.onclick=()=>{closeSuggestions();$('query').value=item.word;search();if(document.documentElement.classList.contains('keyboard-open'))$('query').blur()};list.append(button);
 }
 list.hidden=suggestionsDismissed||!options.length;$('query').setAttribute('aria-expanded',String(!list.hidden));
}
$('query').addEventListener('keydown',e=>{
 const options=[...$('suggestions').children];if(e.key==='Escape'){closeSuggestions();return}
 if($('suggestions').hidden||!options.length)return;
 if(e.key==='ArrowDown'||e.key==='ArrowUp'){
  e.preventDefault();activeSuggestion=activeSuggestion<0?(e.key==='ArrowDown'?0:options.length-1):(activeSuggestion+(e.key==='ArrowDown'?1:-1)+options.length)%options.length;
  options.forEach((b,i)=>b.setAttribute('aria-selected',String(i===activeSuggestion)));
  $('query').setAttribute('aria-activedescendant',options[activeSuggestion].id);options[activeSuggestion].scrollIntoView({block:'nearest'});
 }else if(e.key==='Enter'&&activeSuggestion>=0){e.preventDefault();options[activeSuggestion].click()}
});
function finishManualInput(){if(injectMode||$('query').readOnly)return;manualInputFinished=true;closeSuggestions()}
function clearManualInput(){if(injectMode||$('query').readOnly)return;manualInputFinished=false;clearTimeout(searchTimer);searchTimer=null;clearTimeout(resultTimer);controller?.abort();serial++;data=null;window.LexiconSpeech?.cancel();$('query').value='';closeSuggestions()}
$('query').addEventListener('blur',finishManualInput);
$('query').addEventListener('lexicon:search-finished',finishManualInput);
document.querySelector('.word-search').addEventListener('pointerdown',e=>{if(e.target.closest('button')||injectMode||$('query').readOnly)return;clearManualInput();if(e.target!==$('query'))$('query').focus({preventScroll:true})});
document.addEventListener('visibilitychange',()=>{if(document.hidden)finishManualInput()});
window.addEventListener('pagehide',finishManualInput);
$('query').addEventListener('focus',()=>{
 if(!injectMode&&(manualInputFinished||data?.matches.length&&key($('query').value)===data.normalized))clearManualInput();
 if(!$('query').value.trim()){closeSuggestions();return}
 suggestionsDismissed=false;if(data)renderSuggestions(data)
});
$('query').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.defaultPrevented&&!injectMode&&data?.matches.length&&$('suggestions').hidden){e.preventDefault();$('query').blur()}});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.search-combobox'))closeSuggestions()});
function render(result){
 $('welcome').hidden=!!result.normalized;renderSuggestions(result);const area=$('result-area');area.replaceChildren();if(!result.normalized)return;
 const uncertain=!result.matches.length&&!!result.approximate?.length,rows=uncertain?result.approximate:result.matches;
 for(const row of rows){
  const card=el('article','result'+(uncertain?' uncertain-result':''));card.append(el('div','result-label',t(uncertain?'approximateMatch':'found')),el('h2','',row.word+(uncertain?'#':'')),el('div','dict',selected?.name||''));
  if(uncertain)card.append(el('p','approximate-input',t('approximateInput')+': «'+result.query+'». '+(lang==='ru'?'Проверьте выбранный вариант.':'Check the suggested word.')));
  const dl=el('dl','location');for(const f of ['page','column','position']){const cell=el('div');cell.append(el('dt','',t(f)),el('dd','',row[f]));dl.append(cell)}card.append(dl);
  const footer=el('div','result-footer'),button=el('button','copy-button');button.append(icon('copy'),el('span','',t('copy')));button.disabled=!window.LexiconResultFormat('copy').fields.length;button.onclick=()=>copy(row,uncertain?result.query:undefined);
  const share=el('button','share-button',t('share'));share.disabled=button.disabled;share.onclick=async()=>{const output=uncertain?window.LexiconFormat.approximate(result.query,[row],window.LexiconResultFormat('copy')):formatted(row);try{if(window.LexiconAndroid)window.LexiconAndroid.shareText(output);else if(navigator.share)await navigator.share({title:'Lexicon',text:output});else await copy(row,uncertain?result.query:undefined)}catch(e){if(e.name!=='AbortError')toast(t('copyFail'))}};footer.append(button,share);card.append(footer);area.append(card);
 }
 if(!rows.length){const empty=el('div','empty');empty.append(el('strong','',t(result.mode==='prefix'?'prefix':'notFound')));if(result.corrections.length)empty.append(el('p','',lang==='ru'?'Выберите подходящее слово из списка под строкой поиска.':'Choose a word from the list below the search field.'));area.append(empty)}
}
async function resolveApproximate(body,book,signal){
 if(!body.normalized)return [];if(body.matches.length){const raw=window.LexiconSearch.normalize(body.query).replace(/[‐‑–—]/g,'-');if(raw===body.normalized)return [];const rows=body.matches;body.matches=[];body.mode='approximate';body.corrections=[rows[0].word,...body.corrections];return rows;}
 const candidates=[...new Set([...body.corrections,...body.suggestions])],q=body.normalized;
 const folded=q.replace(/(.)\1+/g,'$1');const ranked=candidates.map(word=>{const key=window.LexiconSearch.normalize(word);return {word,d:window.LexiconSearch.distance(q,key,2),repeat:key.replace(/(.)\1+/g,'$1')===folded?0:1,length:Math.abs(key.length-q.length)}}).filter(x=>x.d<=2).sort((a,b)=>a.d-b.d||a.repeat-b.repeat||a.length-b.length);
 if(!ranked.length)return [];
 const response=await fetch('/api/search?'+new URLSearchParams({q:ranked[0].word,dictionary:book.id}),{signal});if(!response.ok)return [];const result=await response.json();return result.matches||[];
}
async function search({fromInject=false}={}){clearTimeout(searchTimer);searchTimer=null;window.LexiconSpeech?.cancel();if(!selected)return false;clearTimeout(resultTimer);const q=$('query').value;const request=++serial;const book=selected;controller?.abort();controller=new AbortController();data=null;$('error').hidden=true;window.history.replaceState(null,'',route());if(!q.trim()){$('result-area').replaceChildren();$('suggestions').replaceChildren();$('suggestions').hidden=true;$('query').setAttribute('aria-expanded','false');$('query').removeAttribute('aria-activedescendant');$('welcome').hidden=false;return;}try{const response=await fetch('/api/search?'+new URLSearchParams({q,dictionary:book.id}),{signal:controller.signal});const body=await response.json();if(!response.ok)throw Error();if(request!==serial||book.id!==selected?.id)return;try{body.approximate=await resolveApproximate(body,book,controller.signal)}catch(e){if(e.name==='AbortError')return;body.approximate=[]}if(request!==serial||book.id!==selected?.id)return;data=body;render(body);$('connection').textContent=t('online');if(body.matches.length){const deliver=()=>{if(request!==serial||currentView!=='search')return;remember(body.matches[0].word,book.id);window.LexiconResults.notify(body.matches,book.id);window.LexiconSpeech.receive(body.matches,book.id);window.LexiconApi.publish(body.matches);};if(fromInject)deliver();else resultTimer=setTimeout(deliver,450)}else{const deliverUnknown=()=>{if(request===serial&&currentView==='search'){window.LexiconRelay.publishUnknown(q,body.approximate);window.LexiconApi.publishUnknown(q,body.approximate);window.LexiconResults.notifyUnknown(q,body.approximate,book.id);window.LexiconSpeech.receiveUnknown(q,body.approximate,book.id)}};if(fromInject)deliverUnknown();else resultTimer=setTimeout(deliverUnknown,1000)}}catch(e){if(e.name==='AbortError'||request!==serial)return;$('error').textContent=t('offline');$('error').hidden=false;$('connection').textContent='';return false}}
function language(){document.documentElement.lang=lang;$('language').value=lang;document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));document.querySelectorAll('[data-placeholder]').forEach(e=>e.placeholder=t(e.dataset.placeholder));$('query').ariaLabel=t('search');$('book-query').ariaLabel=t('findBook');$('search-history').ariaLabel=t('history');$('search-history').title=t('history');renderBooks();renderSelected();renderHistory();renderCopySettings();if(typeof refreshInjectUI==='function')refreshInjectUI();window.LexiconResults?.refresh?.();window.LexiconSpeech?.refresh?.();window.LexiconRelay?.refresh?.();if(data)render(data);$('breadcrumb').textContent=currentView==='search'?t('books')+' / '+bookName(selected?.id):t(currentView==='books'?'library':currentView)}
async function loadBooks(){const error=$('catalog-error');error.hidden=true;$('book-count').textContent='…';try{const response=await fetch('/api/dictionaries');if(!response.ok)throw Error();const body=await response.json();books=body.dictionaries;renderBooks();renderHistory();restoreRoute()}catch{error.replaceChildren(el('span','',t('offline')));const retry=el('button','quiet-button',t('retry'));retry.onclick=loadBooks;error.append(retry);error.hidden=false;$('book-count').textContent='—'}}
function restoreRoute(){const params=new URLSearchParams(location.search);const id=params.get('book')||(params.has('q')?'default':null);if(id&&books.some(b=>b.id===id))openBook(id,{query:(params.get('q')||'').slice(0,80),push:false});else navigate(params.get('view')==='history'?'search':['search','settings'].includes(params.get('view'))?params.get('view'):'books',{push:false})}
$('history-enabled').checked=historyOn;
$('history-enabled').onchange=()=>{historyOn=$('history-enabled').checked;save('historyOn',historyOn)};

function scheduleSearch(){clearTimeout(searchTimer);clearTimeout(resultTimer);controller?.abort();serial++;data=null;window.LexiconSpeech?.cancel();if(!$('query').value.trim()){search();return}searchTimer=setTimeout(()=>search(),180)}
$('clear-history').onclick=()=>{recent=[];save('history',recent);renderHistory()};$('book-query').oninput=renderBooks;$('query').oninput=()=>{manualInputFinished=false;suggestionsDismissed=false;scheduleSearch()};$('query').addEventListener('search',()=>{if(!manualInputFinished)scheduleSearch()});$('back-books').onclick=()=>navigate('books');$('language').onchange=()=>{lang=$('language').value;save('language',lang);language();window.dispatchEvent(new Event('lexicon:format-changed'))};document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>navigate(b.dataset.view));document.querySelector('.brand').onclick=e=>{e.preventDefault();navigate('books')};window.addEventListener('popstate',restoreRoute);
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();(()=>{if(currentView!=='search')navigate('books');(currentView==='search'?$('query'):$('book-query')).focus()})()}});
let injectMode=false,injectRunning=false,injectConfigured=false,injectTimer=null,injectSerial=0,injectController=null,lastInjectEvent=null,injectFailures=0;
function refreshInjectUI(){
 $('manual-mode').classList.toggle('active',!injectMode&&!apiMode);$('inject-mode').classList.toggle('active',injectMode);$('manual-mode').setAttribute('aria-pressed',String(!injectMode&&!apiMode));$('inject-mode').setAttribute('aria-pressed',String(injectMode));$('inject-bar').hidden=!injectMode;$('query').readOnly=injectMode||apiMode;$('query').placeholder=apiMode?t('apiWaiting'):injectMode?t('injectWaiting'):t('wordPlaceholder');$('api-mode').classList.toggle('active',apiMode);$('api-mode').setAttribute('aria-pressed',String(apiMode));$('api-bar').hidden=!apiMode;$('inject-toggle').textContent=t(injectRunning?'stopReceive':'startReceive');
 if(!injectRunning)$('inject-status').textContent=t(injectConfigured?'injectReady':'injectMissing');
}
function pauseInject(){injectSerial++;clearTimeout(injectTimer);injectController?.abort()}
function stopInject(){injectRunning=false;pauseInject();if($('inject-toggle'))refreshInjectUI()}
function resumeInject(){if(!injectRunning||!injectMode||document.hidden||currentView!=='search')return;pauseInject();const generation=injectSerial;$('inject-status').textContent=t('injectWaiting');pollInject(generation)}
async function pollInject(generation){
 if(!injectRunning||generation!==injectSerial||document.hidden||currentView!=='search')return;
 const requestController=new AbortController();injectController=requestController;
 let deadline;let delay=5000;
 try{
  const request=async()=>{const response=await fetch('/api/inject/latest?'+new URLSearchParams({id:$('inject-id').value.trim()}),{signal:requestController.signal});return {response,body:await response.json()}};
  const {response,body}=await Promise.race([request(),new Promise((_,reject)=>{deadline=setTimeout(()=>{reject(Error('Inject timeout'));requestController.abort()},15000)})]);
  if(generation!==injectSerial||!injectRunning)return;
  if(!response.ok){const error=Error(body.error||t('offline'));error.permanent=response.status===400;throw error}
  injectFailures=0;
  const checked=new Date().toLocaleTimeString(lang,{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  $('inject-status').textContent=t(body.word?'injectReceived':'injectWaiting')+' · '+checked;
  if(!body.word)lastInjectEvent=null;
  else if(body.event!==lastInjectEvent){
   suggestionsDismissed=false;$('query').value=body.word;
   const found=await search({fromInject:true});
   if(generation===injectSerial&&injectRunning&&found!==false)lastInjectEvent=body.event;
  }
 }catch(error){
  if(generation!==injectSerial||!injectRunning)return;
  if(error.permanent){stopInject();$('inject-status').textContent=error.message;return}
  injectFailures++;$('inject-status').textContent=t('injectRetry');delay=Math.min(30000,5000*Math.pow(2,injectFailures-1));
 }finally{
  clearTimeout(deadline);
  if(injectController===requestController)injectController=null;
  if(injectRunning&&generation===injectSerial&&!document.hidden&&currentView==='search'){
   clearTimeout(injectTimer);injectTimer=setTimeout(()=>pollInject(generation),delay);
  }
 }
}
async function startInject(){
 if(injectRunning){stopInject();$('inject-status').textContent=t('injectPaused');return}
 const id=$('inject-id').value.trim();save('injectId',id);
 if(!id){showInjectSettings();return}
 try{const response=await fetch('/api/inject/status');if(!response.ok)throw Error();const body=await response.json();injectConfigured=body.configured;if(!injectConfigured){refreshInjectUI();return}}
 catch{$('inject-status').textContent=t('offline');return}
 injectRunning=true;lastInjectEvent=null;injectFailures=0;const generation=++injectSerial;refreshInjectUI();$('inject-status').textContent=t('injectWaiting');pollInject(generation)
}
function initInject(){
 $('inject-id').value=String(read('injectId','')).slice(0,120);$('inject-id').onchange=()=>{save('injectId',$('inject-id').value.trim());stopInject()};
 $('manual-mode').onclick=()=>{window.LexiconApi.stop();apiMode=false;stopInject();injectMode=false;refreshInjectUI();$('query').focus()};$('inject-mode').onclick=()=>{window.LexiconApi.stop();apiMode=false;injectMode=true;$('query').blur();refreshInjectUI();if(!injectRunning)startInject();else resumeInject()};$('inject-toggle').onclick=startInject;
 $('inject-check').onclick=async()=>{
  const status=$('inject-config-status'),button=$('inject-check');save('injectId',$('inject-id').value.trim());
  if(!$('inject-id').value.trim()){status.textContent=t('injectNeedId');$('inject-id').focus();return}
  button.disabled=true;button.textContent=t('injectChecking');status.textContent='';
  try{const response=await fetch('/api/inject/status');if(!response.ok)throw Error();const body=await response.json();injectConfigured=body.configured;
   if(!injectConfigured){status.textContent=t('injectMissing');return}
   const latest=await fetch('/api/inject/latest?'+new URLSearchParams({id:$('inject-id').value.trim()}));const payload=await latest.json();status.textContent=latest.ok?t('injectConnected'):payload.error;
  }catch{status.textContent=t('offline')}finally{button.disabled=false;button.textContent=t('checkConnection');refreshInjectUI()}
 };
 document.addEventListener('visibilitychange',()=>{if(document.hidden){pauseInject();if(injectRunning)$('inject-status').textContent=t('injectResumeHint')}else resumeInject()});window.addEventListener('online',resumeInject);window.addEventListener('pageshow',resumeInject);
 fetch('/api/inject/status').then(r=>{if(!r.ok)throw Error();return r.json()}).then(x=>{injectConfigured=x.configured;$('inject-config-status').textContent=injectConfigured?'':t('injectMissing');refreshInjectUI()}).catch(()=>{$('inject-config-status').textContent=t('offline')});refreshInjectUI();
}

function showApiSettings(){navigate('settings');selectSettingsTab('integrations');$('api-settings').open=true;requestAnimationFrame(()=>$('api-settings').scrollIntoView({block:'start'}))}
function refreshApiUI(){const previous=$('api-source').value,sources=window.LexiconApi.sources();$('api-source').replaceChildren();for(const item of sources){const option=el('option','',item.name);option.value=item.id;$('api-source').append(option)}if(sources.some(item=>item.id===previous))$('api-source').value=previous;if(!sources.length){const option=el('option','',t('apiNotConfigured'));option.value='';$('api-source').append(option)}$('api-toggle').textContent=t(window.LexiconApi.isRunning()?'stopReceive':'startReceive')}
$('api-settings-link').onclick=showApiSettings;
$('api-mode').onclick=()=>{stopInject();injectMode=false;apiMode=true;$('query').blur();refreshApiUI();refreshInjectUI();if(!window.LexiconApi.isRunning())window.LexiconApi.start($('api-source').value);else window.LexiconApi.resume()};
$('api-source').onchange=()=>{if(apiMode)window.LexiconApi.start($('api-source').value)};
$('api-toggle').onclick=()=>{if(window.LexiconApi.isRunning())window.LexiconApi.stop();else if(!$('api-source').value)showApiSettings();else window.LexiconApi.start($('api-source').value)};
window.addEventListener('lexicon:api-config',()=>{renderCopySettings();refreshApiUI()});
window.addEventListener('lexicon:api-format',event=>{formatTarget=event.detail.target;navigate('settings');selectSettingsTab('result');renderCopySettings();requestAnimationFrame(()=>$('format-target').scrollIntoView({block:'center'}))});
const installedVersion=window.LexiconAndroid?.version?.()||window.LEXICON_PORTABLE?.version||'0.8.18';$('app-version').textContent='Lexicon '+installedVersion;
$('check-updates').onclick=async()=>{const status=$('update-status');status.textContent=t('checkingUpdates');$('download-update').hidden=true;try{const response=await fetch('https://raw.githubusercontent.com/lexiconappteam-blip/lexicon-catalog/main/app.json',{cache:'no-store'});if(!response.ok)throw Error();const manifest=await response.json();const remote=manifest.android?.version||installedVersion;const newer=remote.split('.').map(Number).reduce((result,v,i)=>result||Math.sign(v-(Number(installedVersion.split('.')[i])||0)),0)>0;status.textContent=newer?t('updateAvailable')+' '+remote:t('noUpdates');if(newer&&window.LexiconAndroid){const url=new URL(manifest.android.url);if(url.protocol==='https:'&&url.hostname==='github.com'){$('download-update').href=url.href;$('download-update').hidden=false}}else if(newer){navigator.serviceWorker?.getRegistration().then(r=>r?.update());status.textContent+=' — '+(lang==='ru'?'обновите страницу.':'reload this page.')}}catch{status.textContent=t('offline')}};
window.LexiconCurrentResults=()=>data?.matches||[];window.LexiconApproximateResults=()=>data?.approximate||[];
Object.assign(strings.ru,{settingsResultTab:'Результат',contactDeveloper:'Связаться с разработчиком',outputDestination:'Куда отправляем',exactMatchTitle:'Точное совпадение',uncertainTitle:'Если слово не найдено',useSuggestionLabel:'Использовать ближайшее слово',suggestionCoordinatesLabel:'Передавать его координаты',includeOriginalLabel:'Добавлять исходный ввод',mandatoryMarker:'# — обязательная отметка неточного совпадения.',approximateMatch:'Неточное совпадение',approximateInput:'Исходный ввод',previewTypo:'Пример: введено «папаа»',speechCoordinatesLabel:'Называть страницу, колонку и строчку',apiSettingsTitle:'Настройки API',settingsGeneral:'Общие',settingsIntegrations:'Интеграции'});
Object.assign(strings.en,{settingsResultTab:'Result',contactDeveloper:'Contact developer',outputDestination:'Output',exactMatchTitle:'Exact match',uncertainTitle:'If the word is not found',useSuggestionLabel:'Use the closest word',suggestionCoordinatesLabel:'Include its coordinates',includeOriginalLabel:'Include original input',mandatoryMarker:'# always marks an uncertain match.',approximateMatch:'Approximate match',approximateInput:'Original input',previewTypo:'Example: input «папаа»',speechCoordinatesLabel:'Say page, column and line labels',apiSettingsTitle:'API settings',settingsGeneral:'General',settingsIntegrations:'Integrations'});
function selectSettingsTab(key,{focus=false}={}){
 if(!['general','result','integrations'].includes(key))key='general';
 document.querySelectorAll('[data-settings-tab]').forEach(button=>{const active=button.dataset.settingsTab===key;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;if(active&&focus)button.focus()});
 document.querySelectorAll('.settings-subpanel').forEach(panel=>panel.hidden=panel.id!=='settings-panel-'+key);
}
$('settings-tabs').onclick=event=>{const button=event.target.closest('[data-settings-tab]');if(button)selectSettingsTab(button.dataset.settingsTab)};
$('settings-tabs').onkeydown=event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;const buttons=[...$('settings-tabs').querySelectorAll('[data-settings-tab]')],at=buttons.indexOf(document.activeElement);if(at<0)return;event.preventDefault();const index=event.key==='Home'?0:event.key==='End'?buttons.length-1:(at+(event.key==='ArrowLeft'?-1:1)+buttons.length)%buttons.length;selectSettingsTab(buttons[index].dataset.settingsTab,{focus:true})};
language();window.LexiconRelay.init(t,()=>data?.matches||[],()=>data?.normalized&&!data.matches.length?data.query:'');window.LexiconApi.init(t,{active:()=>apiMode&&currentView==='search'&&!!selected,receive:async value=>{if(!apiMode||currentView!=='search'||!selected)return false;suggestionsDismissed=false;$('query').value=value;return await search({fromInject:true})},state:refreshApiUI,status:message=>$('api-receive-status').textContent=message});window.LexiconResults.init(t);window.LexiconSpeech.init(t);loadBooks();initInject();
