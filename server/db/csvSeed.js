const faker = require('faker');
const moment = require('moment-timezone');
const momentRandom = require('moment-random');
const fs = require('fs');
const { exec } = require('child_process');

const streamResv = fs.createWriteStream('reservation.csv');
const streamRes = fs.createWriteStream('restaurant.csv');

const pastDate = new Date(2018, 3, 29);
const futureDate = new Date(2018, 6, 29);
const limit = faker.random.number({ min: 20, max: 60 });

const writeRestaurant = (i) => {
  let n = i;
  const write = () => {
    let ok = true;
    do {
      n -= 1;
      if (n === 0) {
        streamRes.write(`"${n}","${faker.company.companyName()}","${faker.random.number({ min: 20, max: 60 })}"\n`);
      } else {
        ok = streamRes.write(`"${n}","${faker.company.companyName()}","${faker.random.number({ min: 20, max: 60 })}"\n`);
      }
    } while (n > 0 && ok);
    if (n > 0) {
      streamRes.once('drain', () => write());
    }
  };
  write();
};

const writeReservations = (n) => {
  let i = n;
  const write = () => {
    let ok = true;
    do {
      i -= 1;
      if (i === 0) {
        streamResv.write(`"${i}","${momentRandom(futureDate, pastDate).format('YYYY-MM-DD')}","${Math.floor((Math.random() * (22 - 17))) + 17}", "${faker.name.findName()}","${Math.min(limit, 1 + Math.floor(10 * Math.random()))}"\n`);
        exec('psql -f copySeed.sql silverspoon', (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(res);
          }
        });
      } else {
        ok = streamResv.write(`"${i}","${momentRandom(futureDate, pastDate).format('YYYY-MM-DD')}","${Math.floor((Math.random() * (22 - 17))) + 17}","${faker.name.findName()}","${Math.min(limit, 1 + Math.floor(10 * Math.random()))}"\n`);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      streamResv.once('drain', () => write());
    }
  };
  write();
};

const seed = (n) => {
  writeRestaurant(n);
  writeReservations(n);
};
seed(1e7);
// streamRes.end();
// writeReservations();
// streamResv.end();
