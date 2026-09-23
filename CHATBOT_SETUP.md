<!-- code done by sonal: implementation map, setup, operations and verification. -->
# Akoode AI chatbot

## Existing project and minimal integration

The website uses Next.js 16 / React 19 in `frontend/src/app`, with shared widgets in `frontend/src/components`. The backend uses Express (`backend/index.js`), Mongoose models, route modules and SendGrid mail helpers. Existing enquiry schemas and admin pages are unchanged.

Only two existing source files integrate the chatbot:

- `backend/index.js`: mounts `/chatbot` and starts the notification retry worker.
- `frontend/src/components/DeferredLayoutWidgets.jsx`: dynamically loads the widget on public pages, alongside WhatsApp. Admin routes retain their existing visibility rule.

All new code is marked `code done by sonal`. Existing dependency and lockfile changes are not part of this feature. No new npm dependencies are required. New server-only settings were appended to the existing ignored local `.env` files without overwriting existing settings.

## Architecture

Website widget → same-origin Next.js API → authenticated Express chatbot routes → MongoDB text retrieval over website chunks → Google Gemini structured response → visitor review/consent → MongoDB lead/outbox → SendGrid.

The RAG implementation uses MongoDB weighted full-text retrieval, so a separate vector database or embedding service is not required for this MVP. It retrieves six website passages, retains the full bounded conversation, supplies source URLs, rejects source links outside retrieved passages and falls back to contacting the team when nothing matches. It does not train a model on company content. Model grounding instructions reduce invented claims but still require representative acceptance testing; retrieval is lexical and may miss synonyms.

## Configuration

Merge `backend/chatbot/config.example.env` into `backend/.env` and `frontend/chatbot.config.example.env` into the frontend environment. Preserve the rest of your existing configuration.

Backend needs existing `MONGODB_URL`, `PORT`, `JWT_SECRET`, `SITE_URL`, plus:

| Setting | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Server-only AI credential |
| `CHATBOT_AI_MODEL` | Structured-output-capable model; local default `gemini-2.5-flash` |
| `CHATBOT_SITE_URL` | Canonical public website origin, `https://www.akoode.com` or `https://akoode.com` |
| `CHATBOT_PROXY_SECRET` | Random shared secret, minimum 32 characters; same value in frontend server environment |
| `CHATBOT_LEAD_EMAIL` | Designated sales recipient; configured as `info@akoode.com` |
| `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL` | Existing SendGrid credential and verified sender |
| `CHATBOT_LEAD_RETENTION_DAYS` | Database lead retention, default 90 days, maximum 365 |
| `CHATBOT_CRAWL_MAX_PAGES` | Safety ceiling, default 10,000; exceeding it fails explicitly |

Frontend server needs `CHATBOT_BACKEND_URL` (local example `http://127.0.0.1:5000/chatbot`) and the shared secret. Never prefix these secrets with `NEXT_PUBLIC_`. Set `CHATBOT_TRUST_CLIENT_IP=true` only behind an ingress that overwrites `x-forwarded-for`. The default shares a conservative global request limit instead of trusting spoofable IP headers.

Restart both development processes after configuration changes. The original backend imports SendGrid at startup, so its existing SendGrid settings are required even before the chatbot is used.

## Build and refresh website knowledge

From `backend`:

```powershell
node scripts/refreshChatbotKnowledge.js
```

The crawler discovers sitemap indexes and follows public same-origin links, including services, solutions, industries, technologies, case studies, blogs, About and FAQs. It honors robots exclusions and `noindex`, strips navigation/scripts/forms, rejects external/private/query-string URLs, bounds downloads and uses fetch timeouts. Only public published website content is indexed; unpublished local changes must be published before this public-site crawler sees them.

An index generation becomes active only after the entire discovered crawl completes. A failed crawl preserves the previous active generation. The refresh prints pages, chunks and skipped counts. Review skipped pages against robots/noindex exclusions; content inaccessible on the website cannot be indexed. A process crash leaves a two-minute expiring crawl lock. Run one refresher at a time. The immediately previous generation is retained for in-flight retrievals; older generations are removed on subsequent successful refreshes.

Run this command after publishing content, or schedule it daily with your deployment scheduler/Windows Task Scheduler. No unauthenticated refresh endpoint is exposed.

## PDF requirements coverage

| Requirement | Implementation |
| --- | --- |
| Crawl complete public website, refreshable RAG | `backend/chatbot/crawl.js`, `ai.js`, refresh script |
| Responsive widget, context, follow-up questions | `ChatbotWidget.jsx`, scoped CSS, server-side session history |
| Verified company answers and service recommendations | Retrieved passages, grounding instructions, filtered citations, empty-index fallback |
| Business qualification before contact capture | AI instructions require project context and engagement; no long form on launch |
| Name, email, company, phone, requirement, service | Conversational extraction, validation and visitor review |
| Optional budget/timeline | Never required for lead submission |
| Clear follow-up CTA | Assistant offers team discussion; explicit review/send button |
| Lead email with all fields, summary, transcript, date/source | `email.js`; exact requested subject `New Akoode Website Lead – [Name/Company]` |
| Secure APIs and server-side credentials | Same-origin gateway, secret-authenticated backend, HttpOnly session cookie, rate/size limits |
| Confidentiality | Notice before chat, explicit sales consent, expiring stored data, no transcript console logging |
| Modular future integrations | Separate AI, crawler, session/lead storage, routes and notification adapter |

The AI adapter follows the [Google Gemini generateContent API](https://ai.google.dev/api/generate-content) and [structured-output format](https://ai.google.dev/gemini-api/docs/generate-content/structured-output). The API key travels only in the backend request header, never in URLs or browser code.

## Data and notification behavior

- Session token is random, stored only in an HttpOnly cookie, and hashed in MongoDB. Session access also checks expiry immediately; TTL cleanup may run later.
- Chat sessions expire after 24 hours. The clear-chat button deletes the active session, but intentionally does not withdraw a lead already consented to and submitted.
- Qualified leads have a unique session ID to prevent duplicate records. Before submission, visitors can correct information in the conversation. Lead details and the full transcript are shown/sent only through the explicit consent flow.
- Email uses a persistent outbox. Failed deliveries remain pending with exponential retries; a restart resumes processing. Delivery is at-least-once: a provider success followed by a database failure can cause a duplicate email. The UI accurately says the notification is queued, never falsely claims delivery.
- Monitor `chatbotleads` for `notification: pending/sending`, high `attempts`, and old `createdAt`. There is no public endpoint exposing leads/transcripts.
- The AI provider processes visitor messages; SendGrid processes consented lead emails. MongoDB retention does not delete provider data or emails already received. Align the existing privacy policy, mailbox retention and provider agreements with the actual deployment.
- Deploy over HTTPS, use TLS/private networking for the backend/database, restrict database access and encrypt storage/backups. The app does not configure hosting-level encryption, access policies or provider retention for you.

## Verification

From `backend`:

```powershell
node --test chatbot/chatbot.test.js chatbot/conversation.test.js chatbot/presentation.test.js chatbot/visitorIntent.test.js
```

Tests use a uniquely named disposable local MongoDB database, synthetic contacts, and mocked AI/SendGrid calls. They never send a real email. Coverage includes crawl boundaries, extraction, contact validation, session authorization, history, source filtering, explicit consent, duplicate leads, full email payload, retry behavior, rate limits and expiry.

From `frontend`:

```powershell
node node_modules/eslint/bin/eslint.js src/components/chatbot/ChatbotWidget.jsx src/components/DeferredLayoutWidgets.jsx "src/app/api/chatbot/[action]/route.js"
npm run build
```

Live acceptance still requires: a successful full crawl, an operational AI account/model, a designated lead mailbox with verified SendGrid delivery, and desktop/mobile browser testing. Verify supported and unsupported service/pricing questions, corrections, skipped optional fields, declined consent, expired sessions and outage recovery before release. Do not label unconfigured integrations as production-ready.

## Verification in this workspace (16 September 2026)

- Public website refresh completed: **537 unique pages, 8,963 chunks**, no robots/noindex skips among discovered eligible pages. The knowledge generation is active in the configured local MongoDB; retrieval returned website passages successfully.
- All **21 backend regression tests passed**, with AI and email mocked. Both successful and failed refresh publication paths were tested.
- Targeted frontend ESLint passed. The production Next.js build passed, including the chatbot API route. The pre-existing middleware deprecation and stale Browserslist warnings are unrelated to this feature.
- Live local HTTP checks passed: homepage 200, unauthenticated session 401, foreign-origin POST 403, session creation/restoration/deletion 200, HttpOnly/SameSite cookie, no token exposed in the JSON response.
- Live Gemini connectivity now returns **200 OK**. The actual chatbot adapter also returned a structured, website-grounded answer with source URLs and a qualification follow-up. Earlier invalid-key and project spending-cap errors are resolved in the latest check. The key remains only in the ignored backend environment file; existing Anthropic configuration for other features is unchanged.
- `CHATBOT_LEAD_EMAIL` is configured as **info@akoode.com**. Real SendGrid delivery remains unverified; no real test email was sent.
- The browser runtime reported no available browser, so desktop/mobile visual and interaction QA could not be performed here.


<!-- code done by sonal: conversation-policy update and validation. -->
## Conversation behavior update

`backend/chatbot/conversation.js` enforces DISCOVERY, QUALIFICATION and HANDOFF (lead capture). Session metadata retains known project/industry/features, previously asked topics, the question count and the handoff decision. Existing sessions infer their previous handoff from the transcript when metadata is absent. Lead documents, consent endpoints, security, retrieval, crawler and email delivery architecture are unchanged.

- A broad project, business context and one significant feature/problem are enough for an initial handoff offer. Discovery asks at most three meaningful questions and never repeats a known/previously asked topic.
- Explicit contact/meeting/quotation or stop-asking requests immediately enter handoff. An already stated intention is not reconfirmed; declining a handoff stops sales questions.
- Gemini extracts unsolicited details and maintains an internal project summary. Blank extraction values do not erase previously known information. Contact capture skips known fields and asks one missing required field at a time.
- Replies use concise wording for terse messages, avoid repeated marketing introductions, summarize the project before requesting contact details and accurately describe the email follow-up workflow. No calendar booking is claimed.
- Budget and timeline remain optional. Review and explicit consent/send remain required.

Validation: 21 automated tests passed, including existing consent/security/email/crawler regressions and new conversation scenarios. A live Gemini dialogue confirmed immediate real-estate project handoff, skipping already supplied name/company/email, optional budget/timeline omission, and progression to review without claiming a meeting was scheduled. No live lead email was sent during these checks.


<!-- code done by sonal: contextual quick replies and page-card presentation. -->
## Quick replies and related pages

The widget now offers starter topics and up to four contextual action buttons on the latest assistant message. Gemini proposes query-specific exploration messages; the backend filters/limits them and adds explicit handoff/exploration options when appropriate. Buttons send ordinary chat messages, preserve a typed draft, disable while a request is pending and support retry on failure. Contact capture and the consent review do not show suggestion buttons; nothing auto-fills personal information or submits a lead.

Verified citations appear as page cards using indexed website titles, category labels, reading icons and external-link indicators. Two cards are visible initially, with remaining links under an expandable section. Session-only message metadata preserves cards/actions across reloads; the existing lead transcript schema remains unchanged. Old URL citations can still render using readable path labels.

Validation on 17 September 2026: all 25 backend tests passed; targeted frontend lint passed. Live Gemini/API checks returned real-estate CRM exploration buttons, correctly titled case-study/blog cards, a useful answer to a suggested follow-up, and restored identical metadata after session reload. No lead was submitted in these checks. Browser access was unavailable, so visual desktop/mobile QA remains unverified.


<!-- code done by sonal: direct founder booking option. -->
## Founder scheduling

The chatbot includes a compact founder card using the existing `/aboutUs/akhil.webp` image, with a **Reserve your slot** link to `https://calendly.com/akhil-akoode/`. It opens in a new tab before chat consent, throughout the conversation, and after lead submission. Visitors can book directly without completing the email lead flow. The link does not append contact details or conversation content.

The assistant explains this external scheduling option while retaining consent-based email follow-up. The application does not receive Calendly booking confirmations or availability, and must never claim a meeting has been booked. Existing review and consent requirements for email leads remain unchanged.


<!-- code done by sonal: individual enquiries and contact opt-outs. -->
## Individual enquiries and phone preferences

Company/phone preferences now distinguish unknown information from an explicit opt-out. Visitors without a company can continue as individuals; visitors who decline a phone number can continue with email follow-up. These choices persist in the draft and apply consistently to subsequent questions, review readiness, session restoration and consent-based submission. A later explicitly supplied company or phone can replace the earlier choice. Email is still required for email follow-up.

The review and lead email show `Individual (no company)` and `Not shared (visitor declined)` rather than fabricated contact information. Contextual buttons allow visitors to select `I'm an individual` or `Skip phone number`. A field refusal does not cancel the overall handoff.

Validation: all 29 backend tests and targeted frontend lint passed. A live frontend/API/Gemini conversation using both reported phrases reached review and retained its email-only readiness after reload. Consent is still required before submitting; no real lead was submitted during testing.


<!-- code done by sonal: name-first greetings, opt-in portfolio cards and career routing. -->
## Conversation presentation and visitor routing

New chats start by asking what to call the visitor. A name-only response is extracted and greeted naturally before discussing their project; known names are reused in handoff transitions and never invented. Ordinary responses are limited to short, point-to-point answers unless the visitor requests detail.

Automatic source cards and the repeated `Explore this topic` section are removed. Only an explicit request for Akoode's work/portfolio/case studies enables case-study cards for that turn. Retrieval prioritizes indexed case-study pages for these requests, while normal answers continue using RAG internally. A link to `/case-studies` lets the visitor browse the portfolio; blog articles are not presented as completed client work. Subsequent ordinary responses do not repeat the cards.

Job seekers receive a short response directing them to `/career` and a `View careers & apply` link. They are not qualified as sales leads, do not receive sales quick replies, and the founder booking dock is hidden for that response. Requests to build recruitment/job-portal products remain business enquiries. The career/portfolio display flags persist across chat reloads.

Validation: 34 backend regression tests and targeted frontend lint passed, including name-only introduction, explicit portfolio requests, non-repeating cards, career routing and distinguishing recruitment product work from job applications.

<!-- code done by sonal: clarify the visitor's platform and optional connections before normal handoff. -->
The chatbot now asks whether a project needs a website, mobile app, or both instead of assuming a website from a business description. It then asks about additional connections and optional AI help in everyday language, with matching quick-reply buttons. Existing requirements such as salon bookings and online payments stay in the enquiry. These choices use the existing session conversation object; no database migration is needed. Direct requests to speak to the team still bypass discovery, and normal discovery stays limited to three questions. Declining optional AI or connections does not decline the team handoff.
