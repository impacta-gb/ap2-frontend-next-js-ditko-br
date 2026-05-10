import { NextRequest } from 'next/server';

const TARGET_BASE =
  process.env.API_ITEM_URL ||
  process.env.NEXT_PUBLIC_API_ITEM_URL ||
  'http://localhost:8001';

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
]);

function buildForwardHeaders(request: NextRequest): Headers {
  const headers = new Headers();

  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (!HOP_BY_HOP_HEADERS.has(lowerKey)) {
      headers.set(key, value);
    }
  });

  return headers;
}

function buildResponseHeaders(response: Response): Headers {
  const headers = new Headers();

  response.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (!HOP_BY_HOP_HEADERS.has(lowerKey)) {
      headers.set(key, value);
    }
  });

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return headers;
}

async function proxy(request: NextRequest, path: string[]) {
  const query = request.nextUrl.search || '';
  const normalizedBase = TARGET_BASE.replace(/\/$/, '');
  const routePath = path.join('/');
  const targetUrl = `${normalizedBase}/${routePath}${query}`;

  const body = ['GET', 'HEAD'].includes(request.method)
    ? undefined
    : await request.text();

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: buildForwardHeaders(request),
    body,
    cache: 'no-store',
  });

  return new Response(response.body, {
    status: response.status,
    headers: buildResponseHeaders(response),
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxy(request, path || []);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxy(request, path || []);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxy(request, path || []);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxy(request, path || []);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxy(request, path || []);
}
