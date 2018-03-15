const faker = require('faker');
const Promise = require('bluebird');
const moment = require('moment-timezone');
const momentRandom = require('moment-random');

const pastDate = new Date(2018, 3, 29);
const futureDate = new Date(2018, 6, 29);
const limit = faker.random.number({ min: 20, max: 60 });

const reservation = knex => (
  knex('reservations').insert({
    date: moment(new Date()).tz('America/Los_Angeles'),
    time: momentRandom(futureDate, pastDate).format('YYYY-MM-DD'),
    name: faker.name.findName(),
    party: Math.min(limit, 1 + Math.floor(10 * Math.random())),
  })
);

const insert = (knex) => {
  const reservations = [];
  for (let i = 0; i < 15000; i += 1) {
    reservations.push(reservation(knex));
  }
  return Promise.all(reservations);
};

exports.seed = (knex) => {
  let curr = 0;
  const done = `seeded ${curr}!`;
  return knex('reservations')
    .del()
    .then(() => {
      const myFunc = (knex) => {
        return new Promise((resolve) => {
          resolve(insert(knex));
        }).then(() => {
          curr++;
          if (curr < 100) {
            return myFunc(knex);
          }
          return done;
        });
      };
      return myFunc(knex);
    });
};
// Deletes ALL existing entries
