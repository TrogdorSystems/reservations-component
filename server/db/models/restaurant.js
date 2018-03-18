const mongoose = require('mongoose');
require('dotenv').config();
const Promise = require('bluebird');

mongoose.connect(`mongodb://${process.env.MONGOHOST}/${process.env.MONGODATABASE}`);
console.log(process.env.MONGOHOST, process.env.MONGODATABASE);
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

const getTimes = restaurantId => (
  findById(restaurantId)
).then(res => res[0].reservations.map(time => time.time));

const getTimesandReservationsforDate = restaurantId => Promise.all([getTimes(restaurantId), findById(restaurantId)]);

getTimesandReservationsforDate(3000)
  .then((res) => {
    return res[1][0].reservations.map(i => i.date === '2018-3-17');
  });

const getOpenSeats = (id, date) => {
  return getTimesandReservationsforDate(id);
}
// getOpenSeats(3000, '2018-3-18')
//   .then(res => console.log(res));
// findById(3000)
//   .then(res => console.log(res));

exports.findById = findById;
