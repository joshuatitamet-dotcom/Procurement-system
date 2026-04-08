const defaultBackendBaseUrl =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000"
    : "https://procurement-system-2.onrender.com";

const BACKEND_BASE_URL = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  defaultBackendBaseUrl
).replace(/\/$/, "");

const BACKEND_TIMEOUT_MS = Number(process.env.BACKEND_TIMEOUT_MS || 30000);

async function proxyRequest(request, { params }) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams?.path || [];
  const targetUrl = new URL(`${BACKEND_BASE_URL}/api/${pathSegments.join("/")}`);
  const incomingUrl = new URL(request.url);

  incomingUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const headers = new Headers(request.headers);
  headers.delete("host");

  const init = {
    method: request.method,
    headers,
    redirect: "follow"
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  try {
    const response = await fetch(targetUrl, {
      ...init,
      signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS)
    });
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    responseHeaders.delete("transfer-encoding");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    const timedOut =
      error?.name === "TimeoutError" ||
      error?.name === "AbortError" ||
      /timed out|timeout/i.test(error?.message || "");

    return Response.json(
      {
        message: timedOut
          ? "Backend request timed out"
          : "Backend request failed",
        backendUrl: BACKEND_BASE_URL,
        timeoutMs: BACKEND_TIMEOUT_MS,
        path: `/api/${pathSegments.join("/")}`,
        error: error.message
      },
      { status: timedOut ? 504 : 502 }
    );
  }
}

export async function GET(request, context) {
  return proxyRequest(request, context);
}

export async function POST(request, context) {
  return proxyRequest(request, context);
}

export async function PUT(request, context) {
  return proxyRequest(request, context);
}

export async function DELETE(request, context) {
  return proxyRequest(request, context);
}

export async function OPTIONS(request, context) {
  return proxyRequest(request, context);
}
