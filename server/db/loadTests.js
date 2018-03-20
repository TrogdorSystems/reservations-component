const restaurantModel = require('./models/restaurant');
const postgresClient = require('../postgres/index');
const Promise = require('bluebird');

const done = () => {
  restaurantModel.mongoose.disconnect();
  postgresClient.client.end();
};

const testMongoFindById = () => {
  const promises = [];
  console.time('Mongo select by id');
  for (let i = 0; i < 10000; i += 1) {
    promises.push(restaurantModel.findById(Math.floor(Math.random() * 10e6)));
  }
  return Promise.all(promises)
    .then(() => console.timeEnd('Mongo select by id'));
};

const testPostgres = () => {
  const promises = [];
  console.time('postgres select id');
  for (let i = 0; i < 10000; i += 1) {
    promises.push(postgresClient.client.query(
      'SELECT * FROM restaurants WHERE id=$1',
      [Math.floor(Math.random() * 10e6)],
    ));
  }
  return Promise.all(promises)
    .then(() => console.timeEnd('postgres select id'));
};

const compareById = () => Promise.all([testMongoFindById(), testPostgres()]);


const getMongoBookingsForDate = () => {
  console.time('Mongo get bookings for date');
  const promises = [];
  for (let i = 0; i < 10000; i += 1) {
    promises.push(restaurantModel.getBookingsForDate(Math.floor(Math.random() * 10e6), '2018-03-21'));
  }
  return Promise.all(promises)
    .then(() => console.timeEnd('Mongo get bookings for date'));
};

const getPostgresBookingsForDate = () => {
  console.time('Postgres bookings for date');
  const promises = [];
  for (let i = 0; i < 10000; i += 1) {
    promises.push(postgresClient.getOpenSeats({ restaurantId: (Math.floor(Math.random() * 10e6)), date: '2018-03-21' }));
  }
  return Promise.all(promises)
    .then(() => console.timeEnd('Postgres bookings for date'));
};


const runAllTests = () => Promise.all([
  compareById(),
  getMongoBookingsForDate(),
  getPostgresBookingsForDate(),
])
  .then(() => done());

runAllTests();
