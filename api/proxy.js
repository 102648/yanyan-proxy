export const config = {
  runtime: 'edge',
};

const TARGET_BASE = 'https://max.brother99.top';

export default async function handler(request) {
  const url = new URL(request.url);
  const targetUrl = TARGET_BASE + url.pathname + url.search;

  const headers = new Headers(request.headers);
  headers.set('Host', 'max.brother99.top');
  headers.delete('cf-connecting-ip');
  headers.delete('x-real-ip');
  headers.delete('x-forwarded-for');

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD'
        ? request.body
        : undefined,redirect: 'follow',
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', '*');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: responseHeaders });
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'proxy_error', message: error.message }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
