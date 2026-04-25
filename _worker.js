export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 静的ファイル（.html .css .js など）はそのまま返す
    if (url.pathname.includes('.')) {
      return env.ASSETS.fetch(request);
    }
    
    // それ以外（/admin /mypage など）はindex.htmlを返す
    const indexUrl = new URL('/', url);
    return env.ASSETS.fetch(new Request(indexUrl, request));
  }
};
