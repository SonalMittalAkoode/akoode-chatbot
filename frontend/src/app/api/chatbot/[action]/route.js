// code done by sonal: same-origin gateway; credentials and session token never reach browser JavaScript.
import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
export const runtime = 'nodejs';
const COOKIE = 'akoode_chat_session';
async function proxy(request, context) {
  const { action } = await context.params;
  const method = request.method;
  if (!({ session: ['GET', 'POST', 'PATCH', 'DELETE'], message: ['POST'], lead: ['POST'] }[action] || []).includes(method)) return NextResponse.json({ message: 'Not found.' }, { status: 404 });
  if (method !== 'GET' && request.headers.get('origin') !== request.nextUrl.origin) return NextResponse.json({ message: 'Invalid request origin.' }, { status: 403 });
  const backendUrl = process.env.CHATBOT_BACKEND_URL || (process.env.VERCEL === '1' ? 'https://api.akoode.com/chatbot' : '');
  if (!backendUrl || !process.env.CHATBOT_PROXY_SECRET) return NextResponse.json({ message: 'Chat is not available yet. Please contact the Akoode team.' }, { status: 503 });
  try {
    const destination = new URL(backendUrl);
    if (process.env.VERCEL === '1' && (destination.protocol !== 'https:' || /^(localhost|127\.|\[::1\])/.test(destination.hostname))) {
      console.error('[chatbot] Configure CHATBOT_BACKEND_URL with the deployed HTTPS backend, not localhost.');
      return NextResponse.json({ message: 'Chat is temporarily unavailable. Please contact the Akoode team.' }, { status: 503 });
    }
    let body;
    if (method === 'POST' || method === 'PATCH') {
      if (!request.headers.get('content-type')?.startsWith('application/json')) return NextResponse.json({ message: 'JSON required.' }, { status: 415 });
      // Bound the stream itself, including requests without Content-Length.
      const reader = request.body?.getReader();
      let size = 0; const parts = [];
      if (reader) while (true) {
        const { done, value } = await reader.read(); if (done) break;
        size += value.length;
        if (size > 12000) { await reader.cancel(); return NextResponse.json({ message: 'Message too large.' }, { status: 413 }); }
        parts.push(Buffer.from(value));
      }
      body = JSON.stringify(JSON.parse(Buffer.concat(parts).toString('utf8')));
    }
    const token = request.cookies.get(COOKIE)?.value;
    const upstream = await fetch(`${backendUrl.replace(/\/$/, '')}/${action}`, {
      method, cache: 'no-store', signal: AbortSignal.timeout(45000),
      headers: { 'Content-Type': 'application/json', 'x-chatbot-secret': process.env.CHATBOT_PROXY_SECRET,
        // Configure the deployment ingress to overwrite this header; otherwise all visitors share the safe global limit.
        'x-chatbot-client': createHash('sha256').update(process.env.CHATBOT_TRUST_CLIENT_IP === 'true' ? (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'global') : 'global').digest('hex'),
        ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body,
    });
    if (!upstream.ok) console.error(`[chatbot] ${method} ${action}: backend returned HTTP ${upstream.status}.`);
    if (upstream.status === 404) return NextResponse.json({ message: 'Chat is temporarily unavailable. Please contact the Akoode team.' }, { status: 503 });
    const data = await upstream.json();
    const response = NextResponse.json(action === 'session' && method === 'POST' && upstream.ok ? { started: true } : data, { status: upstream.status, headers: { 'Cache-Control': 'no-store' } });
    if (upstream.headers.has('retry-after')) response.headers.set('Retry-After', upstream.headers.get('retry-after'));
    if (action === 'session' && method === 'POST' && upstream.ok) response.cookies.set(COOKIE, data.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api/chatbot', maxAge: 86400 });
    if (action === 'session' && method === 'DELETE' && upstream.ok) response.cookies.set(COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api/chatbot', maxAge: 0 });
    return response;
  } catch (error) {
    // Log only diagnostic codes, never credentials, cookies or visitor messages.
    const code = error.cause?.code || error.code || error.name || 'UNKNOWN';
    console.error(`[chatbot] ${method} ${action} failed (${code}). Check backend availability and CHATBOT_BACKEND_URL.`);
    return NextResponse.json({ message: 'Chat is temporarily unavailable. Please retry or contact the Akoode team.' }, { status: 503 });
  }
}
export { proxy as GET, proxy as POST, proxy as DELETE, proxy as PATCH };
