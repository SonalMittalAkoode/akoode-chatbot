const { test } = require('node:test');
const assert = require('node:assert/strict');
const { cleanUserMetadata } = require('./onboarding');

test('legacy sessions and all optional identity combinations remain valid', () => {
  assert.equal(cleanUserMetadata(undefined), undefined);
  for (const identity of [{}, { name: 'Visitor' }, { email: 'visitor@example.com' }, { name: 'Visitor', email: 'visitor@example.com' }, { email: '' }]) {
    assert.equal(cleanUserMetadata({ ...identity, privacyConsent: true }).privacyConsent, true);
  }
});
test('metadata requires consent and validates supplied email and source', () => {
  for (const value of [null, {}, { privacyConsent: false }, { privacyConsent: true, email: 'invalid' }, { privacyConsent: true, acquisitionSource: 'unknown' }, { privacyConsent: true, name: 'x'.repeat(121) }]) assert.throws(() => cleanUserMetadata(value));
});
test('metadata is bounded, whitelisted and keeps Other only for that source', () => {
  const result = cleanUserMetadata({ privacyConsent: true, name: ' Visitor ', acquisitionSource: 'google', acquisitionSourceOther: 'stale', secret: 'drop' });
  assert.deepEqual(result, { privacyConsent: true, name: 'Visitor', acquisitionSource: 'google' });
  assert.equal(cleanUserMetadata({ privacyConsent: true, acquisitionSource: 'other', acquisitionSourceOther: ' Newsletter ' }).acquisitionSourceOther, 'Newsletter');
});
