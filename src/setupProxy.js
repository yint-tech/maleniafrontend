const { createProxyMiddleware } = require('http-proxy-middleware');

const target ="http://haproxy.virjar.com:8000/";
//const target ="http://127.0.0.1:5810/";
//const target ="http://maleniatest.virjar.com:5810/";

module.exports = function(app) {
  app.use(
    '/malenia',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      pathRewrite: {
        "^/malenia": "/malenia"
      }
    })
  );
  app.use(
    '/malenia-doc',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      pathRewrite: {
        "^/malenia-doc": "/malenia-doc"
      }
    })
  );
  app.use(
    '/build-in-res',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      pathRewrite: {
        "^/build-in-res": "/build-in-res"
      }
    })
  );
  app.use(
    '/yint-stub',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      pathRewrite: {
        "^/yint-stub": "/yint-stub"
      }
    })
  );
};
