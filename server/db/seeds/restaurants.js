const faker = require('faker');
const moment = require('moment-timezone');
const momentRandom = require('moment-random');

const pastDate = new Date(2018, 3, 29);
const futureDate = new Date(2018, 6, 29);
const limit = faker.random.number({ min: 20, max: 60 });

const restaurant = () => ({
  name: faker.company.companyName(),
  limit: faker.random.number({ min: 20, max: 60 }),
});
const reservation = () => ({
  date: moment(new Date()).tz('America/Los_Angeles'),
  time: momentRandom(pastDate, futureDate),
  name: faker.name.findName(),
  party: Math.min(limit, 1 + Math.floor(10 * Math.random())),
});

exports.seed = knex => (
  knex('address').del()
    .then(() => {
      const restaurants = [];
      for (let i = 0; i < 10000; i += 1) {
        restaurants.push(restaurant);
      }
      knex('restaurants').insert(restaurant);
    })
    .then(() => {
      let reservations = [];
      for (let i = 0; i < 10000; i += 1) {
        reservations.push(reservation);
      }
      knex('reservations').insert(reservations);
      reservations = [];
    })
);
