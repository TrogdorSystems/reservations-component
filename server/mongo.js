const mongoose = require('mongoose');
require('dotenv').config();
const restaurant = require('./db/models/restaurant');

mongoose.connect(`mongodb://${process.env.MONGOHOST}/${process.env.MONGODATABASE}`);

