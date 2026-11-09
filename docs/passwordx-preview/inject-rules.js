/* Shared Inject normalization for the browser and the result relay. */
(() => {
 const normalize = value => value.normalize('NFC').toUpperCase().replaceAll('Ё','Е');

 function settings(input) {
  return {enabled: typeof input?.enabled === 'boolean' ? input.enabled : input?.case !== 'off'};
 }

 function prepare(value, options, index) {
  if (!settings(options).enabled) return {query:value, ambiguous:false};

  const words = [...value.matchAll(/[\p{L}\p{N}]+(?:[-‐‑][\p{L}\p{N}]+)*/gu)];
  const firstWord = normalize(words[0]?.[0] || '');
  const imagePrefix = firstWord === 'КАРТИНКА' || firstWord === 'КАРТИНКИ';
  const lastWord = words.at(-1);
  const query = imagePrefix
   ? (words.length > 1 ? value.slice(words[1].index, lastWord.index + lastWord[0].length) : '')
   : value;
  const unchanged = {query, ambiguous:false};
  const word = normalize(query).replace(/[‐‑]/g, '-');
  if (!index || !/^[А-Я]+(?:-[А-Я]+)*$/.test(word) || word.length > 80) return unchanged;

  const exact = Object.hasOwn(index.heads, word);
  if (exact && !imagePrefix) return unchanged;

  const candidates = new Set();
  const genitives = new Set();
  for (let i = word.length; i >= 0; i--) {
   for (const [replacement, rule] of index.endings[word.slice(i)] || []) {
    const head = word.slice(0, i) + replacement;
    const mask = index.paradigms[index.heads[head]]?.[rule] || 0;
    if (mask) candidates.add(head);
    if (mask & 2) genitives.add(head);
   }
  }

  // «Картинки чего?» gives the genitive priority when the form allows it.
  const preferGenitive = imagePrefix && genitives.size > 0;
  if (exact && !preferGenitive) return unchanged;
  const matches = preferGenitive ? genitives : candidates;
  if (matches.size > 1) return {query, ambiguous:true};
  if (matches.size === 1) return {query:[...matches][0], ambiguous:false};
  return unchanged;
 }

 globalThis.LexiconInjectRules = {settings, prepare};
})();
