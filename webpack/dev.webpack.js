const webpack = require('webpack');
const path = require('path');

module.exports = {
  cache: true,
  entry: {
    bundle: ['webpack-hot-middleware/client', path.join(__dirname, '../built/app.js')]
  },
  output: {
    path: path.resolve(__dirname, '../dist/assets'),
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  module: {
    loaders: [
      {
        test: /\.js(x?)$/,
        loader: 'babel-loader?cacheDirectory=true&presets[]=react-hmre',
        include: [path.resolve(__dirname, '../built')],
      },
      {
        test: /(\.styl$)|(\.css$)/,
        loader: 'style-loader!css-loader!autoprefixer-loader!stylus-loader'
      }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.css', '.styl']
  },
};