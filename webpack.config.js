const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;

module.exports = {
  mode: 'production',
  entry: {
    renderer: {
      import: './src_renderer/index.js',
      filename: 'index.js',
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'src_renderer/index.html',
          to: 'index.html',
        },
      ],
    }),
    new VueLoaderPlugin(),
  ],
  output: {
    path: path.resolve(__dirname, 'build_renderer'),
    assetModuleFilename: 'resource/[hash][ext][query]',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(svg|eot|ttf|woff|woff2)$/i,
        type: 'asset',
      },
      {
        test: /\.(vue)$/,
        loader: 'vue-loader',
      },
    ],
  },
};

