import * as express from 'express'
import * as webpack from 'webpack';
import * as path from 'path';
import * as morgan from 'morgan';
import * as fs from 'fs';
const app = express();

if (process.env['NODE_ENV'] === 'local') {
  const config = require('../webpack/dev.webpack.js')
  const compiler = webpack(config)
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath
  }))
  app.use(require('webpack-hot-middleware')(compiler));
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, '../dist/')))
app.listen(3000)
console.log('started')