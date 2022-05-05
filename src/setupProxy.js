const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/malenia',
    createProxyMiddleware({
      // http://bj1.virjar.com
      //target: 'http://192.168.31.135:5810',
      target: 'http://maleniatest.virjar.com:5810',
      changeOrigin: true,
      pathRewrite: {
        "^/malenia": "/malenia"
      }
    })
  );
  app.use(
    '/malenia-doc',
    createProxyMiddleware({
      // http://bj1.virjar.com
      //target: 'http://192.168.31.135:5810',
      target: 'http://maleniatest.virjar.com:5810',
      changeOrigin: true,
      pathRewrite: {
        "^/malenia-doc": "/malenia-doc"
      }
    })
  );
  app.use(
    '/build-in-res',
    createProxyMiddleware({
      // http://bj1.virjar.com
      //target: 'http://192.168.31.135:5810',
      target: 'http://maleniatest.virjar.com:5810',
      changeOrigin: true,
      pathRewrite: {
        "^/build-in-res": "/build-in-res"
      }
    })
  );
  app.use(
    '/yint-stub',
    createProxyMiddleware({
      // http://bj1.virjar.com
      //target: 'http://192.168.31.135:5810',
      target: 'http://maleniatest.virjar.com:5810',
      changeOrigin: true,
      pathRewrite: {
        "^/yint-stub": "/yint-stub"
      }
    })
  );
};
