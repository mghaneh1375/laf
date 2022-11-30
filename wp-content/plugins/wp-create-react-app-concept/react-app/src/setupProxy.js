const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://dev.citypos.co.uk',
      changeOrigin: true,
      secure: false
    })
  );
};