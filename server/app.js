require('newrelic');
const path = require('path');
const express = require('express');
const morgan = require('morgan')
const cors = require('cors');

const restaurantsRouter = require('./routers/restaurants');
const reservationsRouter = require('./routers/reservations');

const app = express();
app.use(morgan('dev'));

app.use(cors());

app.options('*', cors());
app.use('/', express.static(path.join(__dirname, '../client/dist')));
app.use('/restaurants', restaurantsRouter);
app.use('/reservations', reservationsRouter);

module.exports = app;
