const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  name: String,
  seats: Number,
  reservations: [{
    date: Date,
    time: Number,
    name: String,
    party: Number,
    timestamp: Date.now,
  }],
});

const restaurantModel = mongoose.model('Restaurant', restaurantSchema);


module.exports = restaurantModel;
