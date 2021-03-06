const express = require('express');
const bodyParser = require('body-parser');
const graffiti = require('@risingstack/graffiti');
const schema = require('./models/schema');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

const isDeveloping = process.env.NODE_ENV !== 'production';
const PORT = isDeveloping ? 3001 : process.env.PORT;
let config;

mongoose.connect(process.env.DB_CONNECT || process.env.DB_CONNECT);
mongoose.Promise = global.Promise;

if (isDeveloping) {
  config = require('./webpack.config');

  const compiler = webpack(config);
  app.use(express.static('public'));
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
    },
  }));
} else {
  config = require('./webpack.production.config');

  app.use(express.static(path.resolve(__dirname, 'dist/')));
  app.get('*', (req, res) => {
    res.sendFile(
      fs.readFileSync(
        path.join(__dirname, '../dist/index.html')
      )
    );
  });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => res.sendFile('public/index.html'));

app.use(graffiti.express({
  schema,
}));

app.listen(PORT, () => console.log(`Now listening on PORT ${PORT}`));
