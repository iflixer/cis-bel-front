const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
require('dotenv').config();

const buildOutputDir = process.env.BUILD_OUTPUT_DIR || 'kholobok.biz';
const publicPath = process.env.PUBLIC_PATH || '/';

module.exports = () => ({
  output: {
    path: path.resolve(__dirname, `../${buildOutputDir}`),
    filename: 'js/[name].[hash].js',
    publicPath: publicPath,
  },
  optimization: {
    namedModules: true,
    concatenateModules: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: false,
        sourceMap: false,
        parallel: true,
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
});
