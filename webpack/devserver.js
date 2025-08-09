const pathResolve = require('path').resolve;
const url = require('url');
require('dotenv').config();

const publicPath = process.env.PUBLIC_PATH_DEV || '/kholobok-biz/';
const host = process.env.DEV_HOST || 'localhost';
const port = parseInt(process.env.DEV_PORT) || 8040;
const openBrowser = process.env.DEV_OPEN === 'true';
const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

module.exports = () => ({
  devServer: {
    host: host,
    disableHostCheck: true,
    port: port,
    open: openBrowser,
    historyApiFallback: {
      index: url.parse(publicPath).pathname,
    },
    contentBase: pathResolve('./src/assets'),
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    proxy: {
      '/api/': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
        pathRewrite: {
          '^/api': ''
        },
        onProxyReq: function(proxyReq, req, res) {
          const rewrittenUrl = req.url.replace('/api', '');
          console.log('Proxying request:', req.method, req.url, '-> target:', backendUrl + rewrittenUrl);
        },
        onError: function(err, req, res) {
          console.error('Proxy error:', err.message);
        }
      }
    },
  },
});
