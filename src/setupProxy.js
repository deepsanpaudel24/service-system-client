const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // app.use(
  //   '/api',
  //   createProxyMiddleware({
  //     target: 'https://service-system-backend.herokuapp.com/',
  //     changeOrigin: true,
  //   })
  // );
  app.use(createProxyMiddleware("/api", { target: "https://service-system-backend.herokuapp.com" }));
};