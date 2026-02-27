/**
 * Simple rule‑based parser to convert free‑text consent into a machine‑readable policy object.
 * Returns an object with: version, purposes[], recipients[], retentionDays, expiry (ISO|null),
 * dataCategories[], allowedOperations[], rawText, explain (matches found).
 */
const KNOWN_PURPOSES = [
  'marketing',
  'analytics',
  'research',
  'service',
  'personalization',
  'billing',
  'fraud prevention',
];
const RECIPIENT_KEYWORDS = [
  'partners',
  'third parties',
  'vendors',
  'service providers',
  'our affiliates',
  'affiliates',
];
const DATA_KEYWORDS = {
  contact_information: ['contact', 'email', 'phone', 'telephone', 'mobile'],
  health_data: ['health', 'medical', 'medical records'],
  financial_data: ['financial', 'bank', 'card', 'credit', 'payment'],
  identifiers: ['id', 'identifier', 'national id', 'ssn'],
  location: ['location', 'gps', 'address'],
  personal_data: ['personal data', 'personal information'],
};
const OPERATIONS = ['collect', 'store', 'share', 'process', 'analyze', 'use'];

function toISO(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function extractRetentionDays(text) {
  const m = text.match(
    /retain(?:ed|ing)? (?:for )?(\d+)\s*(years|year|months|month|days|day)/i
  );
  if (!m) return null;
  const n = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  if (unit.startsWith('year')) return n * 365;
  if (unit.startsWith('month')) return Math.round(n * 30.4375);
  return n;
}

function extractExpiry(text) {
  const isoMatch = text.match(/expires on (\d{4}-\d{2}-\d{2})/i);
  if (isoMatch) return toISO(isoMatch[1]);
  const untilMatch = text.match(/until (\d{4}-\d{2}-\d{2})/i);
  if (untilMatch) return toISO(untilMatch[1]);
  const naturalMatch = text.match(
    /expires on ([A-Za-z]+ \d{1,2},\s*\d{4})/i
  );
  if (naturalMatch) return toISO(naturalMatch[1]);
  return null;
}

function escapeRegex(str) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * return true if a negation word appears in the window immediately preceding
 * index `pos` in `text`.
 */
function isNegatedBefore(text, pos) {
  const window = text.slice(Math.max(0, pos - 50), pos).toLowerCase();
  return /\b(?:not|no|never|don't|do not)\b/.test(window);
}

/**
 * scan `text` for keywords, ignoring any occurrences preceded by negation.
 */
function findKeywords(text, keywords) {
  const found = new Set();
  for (const k of keywords) {
    const re = new RegExp(`\\b${escapeRegex(k)}\\b`, 'gi');
    let m;
    while ((m = re.exec(text)) !== null) {
      if (isNegatedBefore(text, m.index)) {
        continue;
      }
      found.add(k.toLowerCase());
    }
  }
  return Array.from(found);
}

/**
 * remove any element from `arr` if the raw consent string contains an explicit
 * negation targeting that term (“not for X”, “do not X”, etc.).
 */
function removeNegated(arr, raw) {
  return arr.filter((k) => {
    const re = new RegExp(`\\bnot(?:\\s+for)?\\s+${escapeRegex(k)}\\b`, 'i');
    return !re.test(raw);
  });
}

function mapDataCategories(text) {
  const found = [];
  for (const [cat, keys] of Object.entries(DATA_KEYWORDS)) {
    for (const k of keys) {
      const re = new RegExp(`\\b${escapeRegex(k)}\\b`, 'i');
      if (re.test(text)) {
        found.push(cat);
        break;
      }
    }
  }
  return Array.from(new Set(found));
}

function parseConsent(text = '', options = {}) {
  const raw = (text || '').trim();
  const lowered = raw.toLowerCase();

  // initial pass over known purpose keywords
  let purposes = findKeywords(lowered, KNOWN_PURPOSES);

  // also look for "for … purposes" clauses and analyse each segment properly
  const forMatch =
    raw.match(/for (?:the )?purpose(?:s)? of ([^.]+)\.?/i) ||
    raw.match(/for ([a-zA-Z ,&]+)(?:\.|;|$)/i);
  if (forMatch && forMatch[1]) {
    const phrase = forMatch[1].toLowerCase();
    const segments = phrase.split(/,|and|&/).map((s) => s.trim()).filter(Boolean);
    for (const seg of segments) {
      const found = findKeywords(seg, KNOWN_PURPOSES);
      for (const f of found) {
        if (!purposes.includes(f)) purposes.push(f);
      }
    }
  }

  // perform negation cleanup
  purposes = removeNegated(purposes, raw);

  let recipients = findKeywords(lowered, RECIPIENT_KEYWORDS);
  recipients = removeNegated(recipients, raw);

  const retentionDays = extractRetentionDays(raw);
  const expiry = extractExpiry(raw);
  const dataCategories = mapDataCategories(raw);

  let allowedOperations = findKeywords(lowered, OPERATIONS);
  allowedOperations = removeNegated(allowedOperations, raw);

  const explain = {
    matchedPurposes: purposes,
    matchedRecipients: recipients,
    matchedDataCategories: dataCategories,
    matchedOperations: allowedOperations,
    retentionDays,
    expiry,
  };

  return {
    version: options.version || 1,
    purposes,
    recipients,
    retentionDays: retentionDays === null ? null : retentionDays,
    expiry,
    dataCategories,
    allowedOperations,
    rawText: raw,
    explain,
  };
}

module.exports = { parseConsent };