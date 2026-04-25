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

    // 新しいヘッダーを構築
    const newHeaders = new Headers(response.headers);

    // CSPを完全に上書き（Trusted Types無効化）
    newHeaders.set('Content-Security-Policy',
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: *; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' *; " +
      "connect-src *; " +
      "img-src * data: blob:; " +
      "media-src * blob:; " +
      "frame-src *;"
    );

    // Trusted Typesを無効化
    newHeaders.delete('Content-Security-Policy-Report-Only');

    // Permissions Policyを緩和
    newHeaders.set('Permissions-Policy', 'interest-cohort=()');

    // X-Frame-Options
    newHeaders.set('X-Frame-Options', 'SAMEORIGIN');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
