const pathResolve = require('path').resolve;
const url = require('url');
require('dotenv').config();

const publicPath = process.env.PUBLIC_PATH_DEV || '/kholobok-biz/';
const host = process.env.DEV_HOST || 'localhost';
const port = parseInt(process.env.DEV_PORT) || 8040;
const openBrowser = process.env.DEV_OPEN === 'true';

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
  },
});
