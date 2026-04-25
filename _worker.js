export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 拡張子があるファイルはそのまま返す
    if (url.pathname.match(/\.[a-zA-Z0-9]+$/)) {
      return env.ASSETS.fetch(request);
    }

    // SPA: /admin /mypage /room などはindex.htmlを返す
    const indexRequest = new Request(new URL('/', url).toString(), request);
    const response = await env.ASSETS.fetch(indexRequest);

    // CSPヘッダーを付与（インラインスクリプトを許可）
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://challenges.cloudflare.com https://fonts.googleapis.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: blob:; " +
      "connect-src 'self' https://xfwbuldrqywdeshmctkk.supabase.co wss://realtime.supabase.co wss://*.supabase.co https://0.peerjs.com https://challenges.cloudflare.com; " +
      "media-src 'self' blob:; " +
      "worker-src blob:; " +
      "frame-src https://challenges.cloudflare.com;"
    );
    newHeaders.set('X-Content-Type-Options', 'nosniff');
    newHeaders.set('X-Frame-Options', 'SAMEORIGIN');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
