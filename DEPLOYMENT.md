# Chatbot deployment

The frontend project is `akoode-chatbot` on Vercel, with root directory `frontend`.
Website content continues to come from `https://api.akoode.com` through the frontend
`/backend-api/:path*` rewrite. Do not allow localhost in production CSP.

Production frontend public URLs:

- NEXT_PUBLIC_API_URL=https://akoode-chatbot.vercel.app/backend-api/
- NEXT_PUBLIC_FRONTEND_API_URL=https://akoode-chatbot.vercel.app/backend-api/frontend/
- NEXT_PUBLIC_ADMIN_API_URL=https://akoode-chatbot.vercel.app/backend-api/admin/

Changing NEXT_PUBLIC variables requires a new build; changing environment settings alone
does not replace values already compiled into browser JavaScript.

## Chatbot backend

Deploy `backend` as an Express Vercel project. `app.js` exports the existing chatbot router
and reuses MongoDB connections. `index.js` remains the existing long-running website server.
The backend deployment must be reachable by the frontend server. Its chatbot endpoints
require CHATBOT_PROXY_SECRET; do not put this secret in a NEXT_PUBLIC variable.

Set backend environment variables securely:

- MONGODB_URL: Atlas connection for the dedicated akoode_chatbot database
- CHATBOT_PROXY_SECRET: identical to the frontend proxy secret
- GEMINI_API_KEY and CHATBOT_AI_MODEL
- CHATBOT_SITE_URL=https://www.akoode.com
- CHATBOT_LEAD_EMAIL, SENDGRID_API_KEY, SENDGRID_FROM_EMAIL

Set frontend CHATBOT_BACKEND_URL to the deployed backend HTTPS URL plus `/chatbot`.
The existing api.akoode.com host did not contain the chatbot routes when checked.
The temporary frontend setting pointing there is not a working chatbot deployment.

Atlas Cluster0 already contains the public knowledge index (537 pages, 8,963 chunks),
chatbot indexes, and a database-scoped runtime user. Credentials are in ignored
backend/.env.atlas for secure environment setup; never commit or print this file.
Atlas currently permits the workstation IP only. Configure the authorized Vercel
network access before deploying; do not silently expand access to all IPs.

Email outbox work uses Vercel waitUntil during successful chatbot requests. Failed
notifications stay queued and retry on later chatbot requests; unlike the long-running
server this entry point has no perpetual timer. For retries without site traffic,
configure an authenticated scheduled worker before relying on unattended delivery.

## Verification and remaining deployment blockers

- Deployment guards: 3 tests passed.
- Backend suites: 37 tests passed.
- Local browser: onboarding, personalized greeting, and full reset passed.
- Local Vercel backend entry against Atlas + real Gemini: create, answer, restore, delete passed.
- Vercel deployment dpl_5DoCSZkNWPqqeQjV8xbz4NEAc43n was BLOCKED with TEAM_ACCESS_REQUIRED:
  the commit author needs permission to deploy to the M2 Method project.
- Public deployment verification is pending that permission and Atlas network access.

After deployment, verify website API requests return JSON without CSP/CORS errors;
then run onboarding, message submission, close/reopen, and full reset in the live
browser. Confirm browser bundles no longer request localhost:5000.
