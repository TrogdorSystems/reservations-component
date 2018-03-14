const path = require('path');
const express = require('express');
const morgan = require('morgan');
// const webpack = require('webpack');
// const webpackDevMiddleware = require('webpack-dev-middleware');
const cors = require('cors');

const restaurantsRouter = require('./routers/restaurants');
const reservationsRouter = require('./routers/reservations');
// const config = require('../webpack.config.js');

const app = express();
// const compiler = webpack(config);

// middleware
// app.use(webpackDevMiddleware(compiler, {
//   publicPath: config.output.publicPath,
// }));
app.use(cors());
app.use(morgan('dev'));

app.options('*', cors());
app.use('/', express.static(path.join(__dirname, '../client/dist')));
app.use('/restaurants', restaurantsRouter);
app.use('/reservations', reservationsRouter);

module.exports = app;
