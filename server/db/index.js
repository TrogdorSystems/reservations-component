const moment = require('moment-timezone');

require('dotenv').config();
const { Client } = require('pg');

// clients will also use environment variables
// for connection information
const client = new Client({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PORT,
});

client.connect();

client.on('end', () => {
  console.log('pg client end');
});

client.on('error', (error) => {
  console.error('pg client error', error);
});


const bookingsToday = (restaurantId) => {
  const todayStr = moment(new Date()).tz('America/Los_Angeles').format('YYYY-MM-DD');
  return client.query(
    'SELECT COUNT(restaurantid) FROM reservations WHERE restaurantid=$1 AND timestamp=$2',
    [restaurantId, todayStr],
  );
};

const getOpenSeats = ({
  restaurantId, date,
}) => client.query(
  'SELECT time,(MAX(restaurants.seats)-SUM(party)) AS remaining FROM reservations INNER JOIN restaurants ON restaurants.id = reservations.restaurantid WHERE date=$1 AND restaurantid=$2 GROUP BY time',
  [date, restaurantId],
);


const getMaxSeats = restaurantId => client.query(
  'SELECT seats FROM restaurants WHERE id=$1',
  [restaurantId],
);


const genReservationSlots = ({ restaurantId, date }) => Promise.all([
  bookingsToday(restaurantId),
  getOpenSeats({ restaurantId, date }),
  getMaxSeats(restaurantId),
])
  .then((results) => {
    // results[0] has the # bookings made info
    // results[1] has the timeslot & remaining seats info
    // results[2] has the max seats for the restaurant
    // create default reservations array with default values
    const returnedSlots = results[1].rows.map(row => ({
      time: row.time,
      remaining: Number(row.remaining),
    }));

    // if a reservation slot is not in the results, make a default one with
    // max seating availability
    const returnedTimes = results[1].rows.map(slot => slot.time);
    for (let i = 17; i < 22; i += 1) {
      if (!returnedTimes.includes(i)) {
        returnedSlots.push({ time: i, remaining: results[2].rows[0].seats });
      }
    }

    // sort returnedSlots
    returnedSlots.sort((a, b) => (a.time - b.time));

    const output = {
      madeToday: Number(results[0].rows[0].count),
      reservations: returnedSlots,
    };
    return output;
  });


const addReservation = ({
  restaurantId, date, time, name, party,
}) => genReservationSlots({ restaurantId, date })
  .then((slots) => {
    const requestedSlot = slots.reservations.find(item => item.time === time);

    // check max Seats
    if (requestedSlot.remaining >= party) {
      return client.query(
        'INSERT INTO reservations (restaurantid, date, time, name, party) VALUES ($1,$2,$3,$4,$5)',
        [restaurantId, date, time, name, party],
      );
    }
    // console.log('genReservationSlots throws error');
    throw new Error('Restaurant cannot take a party of that size!');
  });


const addRestaurantInfo = ({
  id, name, seats,
}) => client.query(
  'INSERT INTO restaurants (id,name,seats) VALUES ($1,$2,$3)',
  [id, name, seats],
);

module.exports = {
  client,
  bookingsToday,
  getOpenSeats,
  getMaxSeats,
  genReservationSlots,
  addReservation,
  addRestaurantInfo,
};
