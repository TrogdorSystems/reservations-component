const faker = require('faker');
const Promise = require('bluebird');

const restaurant = knex => (
  knex('restaurants').insert({
    name: faker.company.companyName(),
    seats: faker.random.number({ min: 20, max: 60 }),
  })
);

const insert = (knex) => {
  const restaurants = [];
  for (let i = 0; i < 15000; i += 1) {
    restaurants.push(restaurant(knex));
  }
  return Promise.all(restaurants);
};

exports.seed = (knex) => {
  let curr = 0;
  const done = `seeded ${curr}!`;
  return knex('restaurants')
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

