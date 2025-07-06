const webpack = require('webpack');
const path = require('path');
require('dotenv').config();

const buildOutputDir = process.env.BUILD_OUTPUT_DIR || 'kholobok-biz';
const publicPathDev = process.env.PUBLIC_PATH_DEV || '/kholobok-biz/';

module.exports = () => ({
  output: {
    path: path.resolve(__dirname, `../${buildOutputDir}`),
    filename: '[name].js',
    publicPath: publicPathDev,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
