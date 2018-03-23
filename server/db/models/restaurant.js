const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb://localhost/silverspoonMDB`, { poolSize: 10, autoIndex: false });
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
    timestamp: { type: Date, default: Date.now() },
  }],
});

const RestaurantModel = mongoose.model('restaurants', restaurantSchema);

// console.log(RestaurantModel.find({ id: 5 }));
// module.exports = restaurantModel;
const findById = id => (
  RestaurantModel.find({ id })
);

const getBookingsForDate = (id, date) => (
  findById(id)
    .then(res => (
      res[0].reservations.filter(r =>
        r.date.toISOString()
          .slice(0, r.date.toISOString().indexOf('T')) === date)
        .map(i => ({
          time: i.time,
          party: i.party,
          seats: res[0].seats,
        }))
    ))
    .catch(() => 'No reservations made yet')
);

const getMaxSeats = id => (
  findById(id)
    .then(res => res[0].seats)
);

const findOneAndUpdate = (id, date, time, name, party) => (
  RestaurantModel.findOneAndUpdate({ id }, {
    $push: {
      reservations: {
        date, time, name, party,
      },
    },
  })
    .catch(err => console.error('restaurantError', err)));

const insert = (id, name, seats) => (
  RestaurantModel.create({ id, name, seats })
);

exports.findById = findById;
exports.getBookingsForDate = getBookingsForDate;
exports.getMaxSeats = getMaxSeats;
exports.findOneAndUpdate = findOneAndUpdate;
exports.insert = insert;
exports.mongoose = mongoose;
