const moment = require('moment-timezone');
const restaurant = require('./models/restaurant');

const bookingsToday = (restaurantId, todayStr) => {
  todayStr = todayStr || moment(new Date()).tz('America/Los_Angeles').format('YYYY-MM-DD');
  return restaurant.getBookingsForDate(restaurantId, todayStr);
};
// console.log(bookingsToday(3000));

const getMaxSeats = restaurantId => restaurant.getMaxSeats(restaurantId);

const getOpenSeats = ({
  restaurantId, date,
}) => restaurant.getBookingsForDate(restaurantId, date)
  .then(res => res.reduce((acc, curr) => {
    if (acc[curr.time]) {
      acc[curr.time] += curr.party;
    } else {
      acc[curr.time] = curr.party;
    }
    return acc;
  }, {}))
  .then(seatsBooked => (
    getMaxSeats(restaurantId).then(res => (
      Object.entries(seatsBooked).map(i => ({
        time: Number(i[0]),
        remaining: (res - i[1]),
      }))
    ))
  ))
  .catch((err) => { if (err) throw new Error(err); });

const genReservationSlots = ({ restaurantId, date }) => Promise.all([
  bookingsToday(restaurantId, date),
  getOpenSeats({ restaurantId, date }),
  getMaxSeats(restaurantId),
])
  .then((results) => {
    const returnedSlots = results[1];
    const returnedTimes = results[1].map(slot => slot.time);

    for (let i = 17; i < 22; i += 1) {
      if (!returnedTimes.includes(i)) {
        returnedSlots.push({ time: i, remaining: results[2] });
      }
    }
    returnedSlots.sort((a, b) => (a.time - b.time));
    const output = {
      madeToday: results[0].length,
      reservations: returnedSlots,
    };

    return output;
  }).catch(err => console.log(err));

const addReservation = ({
  restaurantId, date, time, name, party,
}) => genReservationSlots({ restaurantId, date })
  .then((slots) => {
    const requestedSlot = slots.reservations.find(item => item.time === time);
    if (requestedSlot.remaining >= party) {
      restaurant.findOneAndUpdate(restaurantId, date, time, name, party)
        .catch(err => console.error('update error', err));
    } else {
      throw new Error('Restaurant cannot take a party of that size!');
    }
    return slots;
  })
  .catch((err) => { if (err) { throw new Error('Restaurant cannot take a party of that size!!!!!'); } });

const addRestaurantInfo = ({
  id, name, seats,
}) => restaurant.insert(id, name, seats);

module.exports = {
  bookingsToday,
  getOpenSeats,
  getMaxSeats,
  genReservationSlots,
  addReservation,
  addRestaurantInfo,
};
