"use client";
import { useEffect, useRef, useState } from 'react';
import styles from './ChatbotWidget.module.css';

export const onboardingStorageKey = 'akoode_chat_onboarding';
const sources = [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['google', 'Google'], ['friend_recommendation', 'Friend Recommendation'], ['other', 'Other']];

export default function ChatOnboarding({ onComplete, step, setStep, details, setDetails }) {
  const [error, setError] = useState('');
  const heading = useRef(null);
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(onboardingStorageKey));
      if (saved?.complete && saved.userMetadata?.privacyConsent === true) onComplete(saved.userMetadata);
    } catch { /* Storage may be unavailable; in-memory state still works. */ }
  }, [onComplete]);
  useEffect(() => { heading.current?.focus(); }, [step]);
  function update(key, value) { setDetails(previous => ({ ...previous, [key]: value })); }
  function go(next) { setError(''); setStep(next); }
  function finish(skip = false) {
    if (!details.consentAccepted) return;
    const userMetadata = {
      ...(details.name.trim() && { name: details.name.trim() }),
      ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim()) && { email: details.email.trim() }),
      privacyConsent: true,
      acquisitionSource: skip ? 'skipped' : details.source || 'skipped',
      ...(!skip && details.source === 'other' && details.sourceOther.trim() && { acquisitionSourceOther: details.sourceOther.trim() }),
    };
    try { sessionStorage.setItem(onboardingStorageKey, JSON.stringify({ complete: true, userMetadata })); } catch { /* Keep working without storage. */ }
    onComplete(userMetadata);
  }
  function next(event) {
    event.preventDefault();
    if (step === 'user-details') {
      if (details.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) {
        setError('Please enter a valid email address, or leave it blank.');
        return;
      }
      go('consent');
    } else if (step === 'consent' && details.consentAccepted) go('source');
    else if (step === 'source') finish();
  }
  return <form className={`${styles.intro} ${styles.onboarding}`} onSubmit={next} noValidate>
    <span className={styles.notice}>Step {step === 'user-details' ? 1 : step === 'consent' ? 2 : 3} of 3</span>
    <h2 ref={heading} tabIndex={-1}>{step === 'user-details' ? 'Before we get started' : step === 'consent' ? 'Before we continue' : 'Where did you find us?'}</h2>
    {step === 'user-details' && <>
      <p>Tell us a little about yourself. You can skip these details if you prefer.</p>
      <label className={styles.onboardingField} htmlFor="akoode-chat-name">Name
        <input id="akoode-chat-name" autoComplete="name" placeholder="Enter your name" maxLength={120} value={details.name} onChange={e => update('name', e.target.value)} />
      </label>
      <label className={styles.onboardingField} htmlFor="akoode-chat-email">Email
        <input id="akoode-chat-email" type="email" autoComplete="email" placeholder="Enter your email" maxLength={254} value={details.email} aria-invalid={Boolean(error)} aria-describedby={error ? 'akoode-email-error' : undefined} onChange={e => { update('email', e.target.value); setError(''); }} />
      </label>
      {error && <p id="akoode-email-error" className={styles.onboardingError} role="alert">{error}</p>}
    </>}
    {step === 'consent' && <>
      <p>Your messages may be processed by our AI provider and stored temporarily to provide the chatbot experience. Please review and accept our Privacy Policy before continuing.</p>
      <div className={styles.onboardingChoice}>
        <input id="akoode-chat-privacy" type="checkbox" checked={details.consentAccepted} onChange={e => update('consentAccepted', e.target.checked)} required />
        <label htmlFor="akoode-chat-privacy">I accept the <a href="https://www.akoode.com/privacy-policy" target="_blank" rel="noopener noreferrer">Terms &amp; Privacy Policy</a></label>
      </div>
    </>}
    {step === 'source' && <>
      <fieldset className={styles.onboardingSources}>
        <legend className={styles.srOnly}>Where did you find us?</legend>
        {sources.map(([value, label]) => <label key={value} className={`${styles.starterAction} ${styles.onboardingChoice}`}>
          <input type="radio" name="akoode-chat-source" value={value} checked={details.source === value} onChange={() => update('source', value)} />{label}
        </label>)}
      </fieldset>
      {details.source === 'other' && <label className={styles.onboardingField} htmlFor="akoode-chat-source-other">Please specify
        <input id="akoode-chat-source-other" placeholder="Please specify" maxLength={200} value={details.sourceOther} onChange={e => update('sourceOther', e.target.value)} />
      </label>}
    </>}
    <button type="submit" className={styles.primary} disabled={step === 'consent' && !details.consentAccepted}>Continue</button>
    {step === 'user-details' && <button type="button" className={styles.onboardingTextButton} onClick={() => go('consent')}>Skip for now</button>}
    {step === 'source' && <button type="button" className={styles.onboardingTextButton} onClick={() => finish(true)}>Skip</button>}
    {step !== 'user-details' && <button type="button" className={styles.onboardingTextButton} onClick={() => go(step === 'consent' ? 'user-details' : 'consent')}>&larr; Back</button>}
  </form>;
}
