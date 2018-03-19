const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb://${process.env.MONGOHOST}/${process.env.MONGODATABASE}`);
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

console.time(findById(3000).then(res => res))

const getBookingsForDate = (id, date) => (
  findById(id)
    .then(res =>
      (res[0].reservations.filter(r => r.date.toISOString().slice(0, r.date.toISOString().indexOf('T')) === date)
        .map(i => ({
          time: i.time,
          party: i.party,
          seats: res[0].seats,
        }))))
    .catch(() => 'No reservations made yet')
);

const getMaxSeats = id => (
  findById(id)
    .then(res => res[0].seats)
);
// getOpenSeats(3000, '2018-3-18')
//   .then(res => console.log(res));
// findById(3000).then(res => console.log(res[0].reservations))
//   .then(res => console.log(res));

exports.findById = findById;
exports.getBookingsForDate = getBookingsForDate;
exports.getMaxSeats = getMaxSeats;
exports.mongoose = mongoose;
// exports.getTimesandReservationsforDate = getTimesandReservationsforDate;
