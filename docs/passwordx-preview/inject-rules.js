/* Shared Inject phrase and case rules for the browser and the result relay. */
(() => {
 const slots = /\{(?:слово|word)\}/giu;
 const cases = {nomn:1, gent:2, datv:4, accs:8, ablt:16, loct:32};
 const normalize = value => value.normalize('NFC').toUpperCase().replaceAll('Ё','Е');
 const tokens = value => [...value.matchAll(/[\p{L}\p{N}]+(?:[-‐‑][\p{L}\p{N}]+)*/gu)];

 function settings(input = {}) {
  const template = typeof input?.template === 'string' ? input.template.trim().slice(0, 120) : '';
  const inputCase = input?.case;
  return {template, case: inputCase === 'off' || Object.hasOwn(cases, inputCase) ? inputCase : 'auto'};
 }

 function validTemplate(template) {
  if (!template) return true;
  const parts = template.split(slots);
  return parts.length === 2 && parts.every(part => !/[{}]/.test(part));
 }

 function extract(value, template) {
  if (!template || !validTemplate(template)) return value;
  const [prefix, suffix] = template.split(slots).map(part => tokens(part).map(match => normalize(match[0])));
  const parts = tokens(value);
  const same = (match, word) => !!match && normalize(match[0]) === word;
  if (!prefix.every((word, i) => same(parts[i], word))) return value;
  if (!suffix.every((word, i) => same(parts[parts.length - suffix.length + i], word))) return value;
  if (parts.length <= prefix.length + suffix.length) return '';
  const first = parts[prefix.length];
  const last = parts[parts.length - suffix.length - 1];
  return value.slice(first.index, last.index + last[0].length);
 }

 function resolve(query, inputCase, index) {
  const word = normalize(query).replace(/[‐‑]/g, '-');
  const unchanged = {query, ambiguous:false};
  if (!index || inputCase === 'off' || !/^[А-Я]+(?:-[А-Я]+)*$/.test(word) || word.length > 80) return unchanged;
  if (inputCase === 'auto' && Object.hasOwn(index.heads, word)) return unchanged;
  const mask = cases[inputCase] || 63;
  const candidates = new Set();
  for (let i = word.length; i >= 0; i--) {
   const ending = word.slice(i);
   for (const [replacement, rule] of index.endings[ending] || []) {
    const head = word.slice(0, i) + replacement;
    const paradigm = index.paradigms[index.heads[head]];
    if (paradigm && (paradigm[rule] & mask)) candidates.add(head);
   }
  }
  if (candidates.size > 1) return {query, ambiguous:true};
  if (candidates.size === 1) return {query:[...candidates][0], ambiguous:false};
  return unchanged;
 }

 globalThis.LexiconInjectRules = {settings, validTemplate, extract, resolve};
})();
