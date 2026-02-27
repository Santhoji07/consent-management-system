const { parseConsent } = require('./parseConsent');

test('parses marketing/analytics, recipients and retention', () => {
  const text = `I consent to the processing of my contact information (email, phone) for marketing and analytics. Data may be shared with partners and third parties. Retain for 2 years.`;
  const p = parseConsent(text);
  expect(p.purposes).toEqual(expect.arrayContaining(['marketing', 'analytics']));
  expect(p.recipients).toEqual(expect.arrayContaining(['partners', 'third parties']));
  expect(p.dataCategories).toEqual(expect.arrayContaining(['contact_information']));
  expect(p.retentionDays).toBe(730);
  expect(p.rawText).toContain('I consent');
});

test('parses research purpose and explicit expiry date', () => {
  const text = `I agree to research use only, not for marketing. Consent expires on 2025-12-31.`;
  const p = parseConsent(text);
  expect(p.purposes).toEqual(expect.arrayContaining(['research']));
  expect(p.purposes).not.toEqual(expect.arrayContaining(['marketing']));
  expect(p.expiry).toBeTruthy();
  expect(p.expiry.startsWith('2025-12-31')).toBe(true);
});

test('handles minimal/empty text gracefully', () => {
  const p = parseConsent('');
  expect(p.purposes).toEqual([]);
  expect(p.recipients).toEqual([]);
  expect(p.dataCategories).toEqual([]);
  expect(p.retentionDays).toBeNull();
});

test('ignores negated keywords', () => {
  const text = `Do not share with third parties and not use analytics.`;
  const p = parseConsent(text);
  expect(p.recipients).not.toContain('third parties');
  expect(p.purposes).not.toContain('analytics');
});