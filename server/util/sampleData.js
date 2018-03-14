const faker = require('faker');

const restaurant = () => ({
  name: faker.company.companyName(),
  limit: faker.random.number({ min: 20, max: 60 }),
});

exports.seed = knex => (
  knex('address').del()
    .then(() => {
      for (let i = 0; i < 10000; i += 1) {
        knex('restaurants').insert(restaurant);
      }
    })
);
