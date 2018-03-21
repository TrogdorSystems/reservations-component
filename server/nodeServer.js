
const http = require('http');
const fs = require('fs');
const db = require('./db');
const moment = require('moment-timezone');

const redisClient = require('./cache');

const port = 8081;
const hostname = '127.0.0.1';

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const urlSplit = url.split('/');
  if (method === 'GET' && url === `/restaurants/${urlSplit[2]}/reservations/${urlSplit[4]}`) {
    const dateParam = urlSplit[4] || moment(new Date()).tz('America/Los_Angeles').format('YYYY-MM-DD');
    const redisKey = `${urlSplit[2]}${urlSplit[4]}`;
    redisClient.GET(redisKey.toString(), (err, response) => {
      if (response !== null && response !== undefined) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(response);
        res.end();
      } else {
        db.genReservationSlots({ restaurantId: urlSplit[2], date: dateParam })
          .then((result) => {
            const stringifiedResult = JSON.stringify(result);
            redisClient.SETEX(
              redisKey, 60, stringifiedResult,
              (err, result) => {
                if (err) {
                  throw new Error(err);
                } else {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(stringifiedResult);
                }
              },
            );
          })
          .catch((error) => {
            res.writeHead(500);
            res.end(JSON.stringify(error));
          });
      }
    });
  } else if (method === 'GET' && url === '/bundle.js') {
    fs.createReadStream('../client/dist/bundle.js').pipe(res);
  } else if (method === 'GET' && url === '/') {
    fs.createReadStream('../client/dist/index.html').pipe(res);
  } else if (method === 'POST' && url === '/reservations') {
    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      const result = JSON.parse(body);
      db.addReservation(result)
        .then(() => {
          res.writeHead(201);
          res.end();
        })
        .catch(() => {
          res.writeHead(500);
          res.end();
        });
    });
  }
});

server.listen(port, hostname, () => console.log(`server listening on ${port}`));
