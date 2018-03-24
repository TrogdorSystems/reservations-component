const faker = require('faker');
const momentRandom = require('moment-random');
const moment = require('moment');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const Promise = require('bluebird');

const streamRes = fs.createWriteStream(path.join(__dirname, 'restaurant.json'));

const pastDate = moment(new Date()).format('YYYY-MM-DD');
const futureDate = moment(new Date()).add(7, 'days').format('YYYY-MM-DD');
const limit = faker.random.number({ min: 20, max: 60 });

const writeRestaurant = (n) => {
  let i = n;
  const write = () => {
    let ok = true;
    do {
      i -= 1;
      const writeable = {
        id: i,
        name: faker.company.companyName(),
        seats: faker.random.number({ min: 20, max: 60 }),
        reservations: Array(Math.floor(Math.random() * 5)).fill(0).map(() => ({
          date: momentRandom(futureDate, pastDate).format('YYYY-MM-DD'),
          time: Math.floor((Math.random() * (22 - 17))) + 17,
          name: faker.name.findName(),
          party: Math.min(limit, 1 + Math.floor(10 * Math.random())),
        })),
      };
      if (i === 0) {
        streamRes.write(JSON.stringify(writeable));
        const command = 'mongoimport -d silverspoonMDB -c restaurants --file restaurant.json --type json --numInsertionWorkers 14';
        exec(command, (err, done) => new Promise((resolve, reject) => {
          if (err) {
            reject(err);
          } else {
            resolve(done);
          }
        }).then(() => exec()));
      } else {
        ok = streamRes.write(JSON.stringify(writeable));
      }
    } while (i > 0 && ok);
    if (i > 0) {
      streamRes.once('drain', () => write());
    }
  };
  write();
};

const seed = (n) => {
  writeRestaurant(n);
};
seed(1e7);
