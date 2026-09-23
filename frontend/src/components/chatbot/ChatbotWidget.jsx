"use client";
// code done by sonal: accessible conversational lead capture, no contact form on launch.
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bot, MessageCircle, X, Send, RotateCcw, ArrowUpRight, BookOpen, Sparkles, ChevronRight, ChevronUp, CalendarDays } from 'lucide-react';
import styles from './ChatbotWidget.module.css';
// code done by sonal: begin with a friendly name question before suggesting project topics.
const greeting = { role: 'assistant', content: "Hi, I'm Akoode's AI assistant. What should I call you?", quickReplies: [] };
// code done by sonal: use real indexed titles, safe URLs and compact expandable reading cards.
function RelatedPages({ cards = [], sources = [] }) {
  const seen = new Set();
  const pages = (cards.length ? cards : sources.map(url => ({ url }))).flatMap(card => {
    try {
      const url = new URL(card.url);
      if (url.protocol !== 'https:' || !['akoode.com', 'www.akoode.com'].includes(url.hostname) || seen.has(url.href)) return [];
      seen.add(url.href);
      const title = card.title || decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() || 'Akoode Technologies').replace(/-/g, ' ');
      return [{ ...card, url: url.href, title, category: card.category || 'Explore Akoode' }];
    } catch { return []; }
  });
  if (!pages.length) return null;
  const renderPage = page => <a key={page.url} className={styles.sourceCard} href={page.url} target="_blank" rel="noopener noreferrer" aria-label={`${page.title} (opens in a new tab)`}>
    <span className={styles.sourceIcon}><BookOpen size={16} aria-hidden="true" /></span>
    <span className={styles.sourceText}><span className={styles.sourceCategory}>{page.category} · akoode.com</span><span className={styles.sourceTitle}>{page.title}</span></span>
    <ArrowUpRight size={16} className={styles.sourceArrow} aria-hidden="true" />
  </a>;
  return <div className={styles.sources}>
    <span className={styles.sourceHeading}>Our work ? Case studies</span>
    {pages.slice(0, 2).map(renderPage)}
    {pages.length > 2 && <details className={styles.moreSources}><summary>View {pages.length - 2} more related {pages.length - 2 === 1 ? 'page' : 'pages'}</summary>{pages.slice(2).map(renderPage)}</details>}
  </div>;
}
const labels = { fullName: 'Full name', email: 'Email', company: 'Company', phone: 'Phone (optional)', requirement: 'Project requirement', service: 'Service of interest', budget: 'Budget (optional)', timeline: 'Timeline (optional)' };
// code done by sonal: direct Calendly booking is available independently of AI and lead capture.
function FounderBooking() {
  return <aside className={styles.founderCard} aria-label="Schedule a meeting with our founder">
    <div className={styles.founderProfile}>
      <Image src="/aboutUs/akhil.webp" alt="Akhil, founder of Akoode" width={44} height={44} className={styles.founderPhoto} />
      <div><strong>Talk directly with our founder</strong><p>Discuss your idea, AI roadmap or next project.</p></div>
    </div>
    <a className={styles.bookingButton} href="https://calendly.com/akhil-akoode/" target="_blank" rel="noopener noreferrer" aria-label="Reserve your slot with our founder on Calendly (opens in a new tab)"><CalendarDays size={15} aria-hidden="true" />Reserve your slot<ArrowUpRight size={15} aria-hidden="true" /></a>
    <span className={styles.bookingNote}>Choose a time on Calendly · Opens in a new tab</span>
  </aside>;
}
async function api(action, method = 'GET', body) {
  const response = await fetch(`/api/chatbot/${action}`, { method, headers: { 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const data = await response.json();
  if (!response.ok) { const error = new Error(data.message || 'Please try again.'); error.status = response.status; throw error; }
  return data;
}
export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [messages, setMessages] = useState([greeting]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState({});
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // code done by sonal: prevent double-click sends and retain a failed shortcut for retry.
  const [failedMessage, setFailedMessage] = useState(null);
  const sending = useRef(false);
  const input = useRef(null); const log = useRef(null); const launcher = useRef(null); const panel = useRef(null);
  useEffect(() => { if (open) input.current?.focus(); }, [open, accepted, busy]);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, busy, ready]);
  function close() { setOpen(false); launcher.current?.focus(); }
  async function start() {
    setBusy(true); setError('');
    try {
      let data;
      try { data = await api('session'); }
      catch (e) { if (e.status !== 401) throw e; await api('session', 'POST', { source: `${location.origin}${location.pathname}` }); }
      setMessages(data?.messages?.length ? [greeting, ...data.messages] : [greeting]);
      setDraft(data?.draft || {}); setReady(Boolean(data?.ready)); setSubmitted(Boolean(data?.submitted)); setAccepted(true);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  async function sendMessage(value, suggestion = false, retryId = null) {
    const message = value.trim(); if (!message || busy || sending.current || submitted) return;
    const messageId = retryId || crypto.randomUUID();
    sending.current = true; setBusy(true); setIsReplying(true); setError(''); setFailedMessage(null);
    setMessages(previous => retryId
      ? previous.map(item => item.id === retryId ? { ...item, failed: false } : item)
      : [...previous, { id: messageId, role: 'user', content: message }]);
    if (!suggestion && !retryId) setText('');
    try {
      const data = await api('message', 'POST', { message });
      setMessages(previous => [...previous, { role: 'assistant', content: data.reply, sources: data.sources, sourceCards: data.sourceCards, quickReplies: data.quickReplies, caseStudiesRequested: data.caseStudiesRequested, career: data.career }]);
      setDraft(data.draft); setReady(data.ready); setConsent(false);
    } catch (e) {
      setMessages(previous => previous.map(item => item.id === messageId ? { ...item, failed: true } : item));
      setError(e.message); setFailedMessage({ message, suggestion, id: messageId });
    }
    finally { sending.current = false; setBusy(false); setIsReplying(false); }
  }
  function send(event) {
    event.preventDefault(); sendMessage(text);
  }
  async function submitLead() {
    if (!consent || busy) return; setBusy(true); setError('');
    try { const data = await api('lead', 'POST', { consent: true }); setSubmitted(true); setMessages(previous => [...previous, { role: 'assistant', content: data.message }]); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  async function reset() {
    setBusy(true); setError('');
    try { await api('session', 'DELETE'); setAccepted(false); setMessages([greeting]); setDraft({}); setReady(false); setConsent(false); setSubmitted(false); setText(''); setFailedMessage(null); }
    catch (e) { if (e.status === 401) setAccepted(false); else setError(e.message); }
    finally { setBusy(false); }
  }
  function keyboard(event) {
    if (event.key === 'Escape') close();
    if (event.key !== 'Tab') return;
    const elements = panel.current?.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),textarea:not(:disabled)');
    if (!elements?.length) return;
    const first = elements[0]; const last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  return <div className={styles.root}>
    {open && <section ref={panel} className={styles.panel} role="dialog" aria-label="Akoode AI assistant" onKeyDown={keyboard}>
      <header className={styles.header}>
        <div className={styles.headerIdentity}>
          <span className={styles.brandAvatar} aria-hidden="true"><Bot size={21} /></span>
          <div><strong>Akoode Assistant</strong><span className={styles.headerStatus}><i aria-hidden="true" />Your AI guide</span></div>
        </div>
        <div className={styles.actions}>
          {accepted && <button type="button" onClick={reset} disabled={busy} aria-label="Clear conversation and start again" title="Clear conversation"><RotateCcw size={18} /></button>}
          <button autoFocus type="button" onClick={close} aria-label="Close chat"><X size={22} /></button>
        </div>
      </header>
      {!accepted ? <div className={styles.intro}>
        <MessageCircle size={36} /><h2>What can we help you build?</h2>
        <p>Explore Akoode’s services and discuss your project with our AI assistant.</p>
        <p className={styles.notice}>Your messages are processed by our AI provider and stored for up to 24 hours. Only share information needed for your enquiry, never passwords or confidential documents. We’ll ask before sharing your contact details and conversation with our sales team.</p>
        <button className={styles.primary} type="button" onClick={start} disabled={busy}>{busy ? 'Connecting…' : 'Agree & start chat'}</button>
        <Link href="/privacy-policy">Privacy policy</Link>
        {/* code done by sonal: visitors can book without starting a chat or sharing lead details. */}
        <FounderBooking />
      </div> : <>
        <div ref={log} className={styles.log} role="log" aria-live="polite" aria-relevant="additions">
          {messages.map((message, index) => <div key={index} className={`${styles.message} ${message.role === 'user' ? styles.visitor : styles.assistant}`}>
            <span className={styles.role}>{message.role === 'user' ? 'You' : 'Akoode AI'}</span><p>{message.content}</p>
            {message.failed && <span className={styles.deliveryStatus}>Not sent</span>}
            {/* code done by sonal: readable page cards replace numbered source links. */}
            {/* code done by sonal: show only requested case studies, including for restored conversations. */}
            {message.role === 'assistant' && message.caseStudiesRequested && <><RelatedPages cards={message.sourceCards} /><Link className={styles.quickButton} href="/case-studies">Browse our case studies<ArrowUpRight size={14} aria-hidden="true" /></Link></>}
            {message.role === 'assistant' && message.career && <Link className={styles.quickButton} href="/career">View careers &amp; apply<ArrowUpRight size={14} aria-hidden="true" /></Link>}
          </div>)}
          {messages.length === 1 && !busy && <div className={styles.starterActions} aria-label="Explore with Akoode">
            {[
              { label: 'Discuss your idea', message: 'I would like to discuss a project idea.', icon: MessageCircle },
              { label: 'Explore AI capabilities', message: 'Tell me about Akoode’s AI capabilities.', icon: Sparkles },
              { label: 'Learn about our services', message: 'What services does Akoode offer?', icon: BookOpen },
              { label: 'Talk to our team', message: 'I would like to talk to the Akoode team.', icon: CalendarDays },
            ].map(({ label, message, icon: Icon }) => <button key={label} type="button" className={styles.starterAction} onClick={() => sendMessage(message, true)}><Icon size={16} aria-hidden="true" /><span>{label}</span><ChevronRight size={15} aria-hidden="true" /></button>)}
          </div>}
          {/* code done by sonal: only the newest reply offers actions; clicks use the normal chat API. */}
          {!submitted && !ready && messages.at(-1)?.role === 'assistant' && messages.at(-1)?.quickReplies?.length > 0 && <div className={styles.quickReplies} aria-label="Suggested replies">
            <span className={styles.quickHeading}><Sparkles size={13} aria-hidden="true" /> Keep exploring, or type your own reply</span>
            <div className={styles.quickGrid}>{messages.at(-1).quickReplies.map(item => <button key={item.message} type="button" className={styles.quickButton} disabled={busy} title={item.message} onClick={() => sendMessage(item.message, true)}>{item.label}<ChevronRight size={14} aria-hidden="true" /></button>)}</div>
          </div>}
          {isReplying && <div className={styles.typingIndicator} role="status">
            <span className={styles.srOnly}>Akoode AI is typing</span>
            <span className={styles.typingAvatar} aria-hidden="true"><Bot size={18} strokeWidth={1.8} /></span>
            <span className={styles.typingBubble} aria-hidden="true"><span /><span /><span /></span>
          </div>}
          {busy && !isReplying && <p className={styles.notice} role="status">Working on your request…</p>}
          {ready && !submitted && <div className={styles.review}>
            <strong>Review your enquiry</strong>
            <dl>{Object.entries(labels).map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{/* code done by sonal: make accepted contact preferences visible during review. */}{key === 'company' && draft.companyStatus === 'individual' ? 'Individual (no company)' : ['company', 'phone'].includes(key) && draft[`${key}Status`] === 'declined' ? 'Not shared (your choice)' : draft[key] || 'Not provided'}</dd></div>)}</dl>
            <p>Need to change something? Tell me in the chat before sending.</p>
            <label><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} /> I agree to share these details and this conversation with Akoode by email so the team can contact me about my project.</label>
            <button type="button" className={styles.primary} disabled={!consent || busy} onClick={submitLead}>Send to the Akoode team</button>
          </div>}
        </div>
        {/* code done by sonal: keep scheduling accessible during chat and after lead submission. */}
        {!messages.at(-1)?.career && <div className={styles.bookingDock}><FounderBooking /></div>}
        {!submitted && <form className={styles.composer} onSubmit={send}>
          <label className={styles.srOnly} htmlFor="akoode-chat-message">Your message</label>
          <textarea id="akoode-chat-message" ref={input} value={text} onChange={e => setText(e.target.value)} maxLength={2000} rows={2} disabled={busy} placeholder="Tell us what you have in mind…" onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); if (text.trim()) send(e); } }} />
          <button type="submit" disabled={busy || !text.trim()} aria-label="Send message"><Send size={20} /></button>
        </form>}
        <p className={styles.footer}>AI can make mistakes. <Link href="/contact-us">Contact our team</Link> · <Link href="/privacy-policy">Privacy</Link></p>
      </>}
      {error && <div className={styles.error} role="alert">{error} {failedMessage && <button className={styles.retry} type="button" disabled={busy} onClick={() => sendMessage(failedMessage.message, failedMessage.suggestion, failedMessage.id)}>Retry message</button>} <Link href="/contact-us">Contact Akoode</Link></div>}
    </section>}
    <div className={styles.launcherWrap}>
      {!open && <span className={styles.launcherHint}>Hi! Need help?<br />I’m here.</span>}
      <button ref={launcher} className={styles.launcher} type="button" aria-expanded={open} aria-label={open ? 'Close Akoode chat' : 'Chat with Akoode'} onClick={() => open ? close() : setOpen(true)}>
        <span className={styles.launcherAvatar} aria-hidden="true"><Bot size={23} /><i /></span>
        <span className={styles.launcherCopy}><strong>Chat with Akoode</strong><span>Get instant answers</span></span>
        <ChevronUp size={17} className={open ? styles.launcherChevronOpen : undefined} aria-hidden="true" />
      </button>
    </div>
  </div>;
}
