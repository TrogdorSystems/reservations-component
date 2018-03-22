require('newrelic');
// const React = require('react');
// const { renderToString } = require('react-dom/server');
// const Reservation = require('../client/src/components/Reservation.jsx');
// const Html = require('../client/src/html');

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
    redisClient.GET(redisKey, (err, response) => {
      if (response !== null && response !== undefined) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(response);
      } else {
        db.genReservationSlots({ restaurantId: urlSplit[2], date: dateParam })
          .then((result) => {
            const stringifiedResult = JSON.stringify(result);
            redisClient.SETEX(redisKey, 20, stringifiedResult);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(stringifiedResult);
          })
          .catch((error) => {
            res.writeHead(500);
            res.end(JSON.stringify(error));
          });
      }
    });
  } else if (method === 'GET' && url === '/bundle.js') {
    fs.createReadStream('../client/dist/bundle.js').pipe(res);
  } else if (method === 'GET' && url === '/productionBundle.js') {
    fs.createReadStream('./client/dist/productionBundle.js').pipe(res);
  } else if (method === 'GET' && url === '/') {
    fs.createReadStream('./client/dist/index.html').pipe(res);
  } else if (method === 'POST' && url === '/reservations') {
    let body = [];
    req.on('error', err => console.error(err));
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      db.addReservation(JSON.parse(body))
        .then((slots) => {
          const newBody = JSON.parse(body);
          const redisKey = `${newBody.restaurantId}${newBody.date}`;
          redisClient.del(redisKey, (err) => {
            if (err) {
              console.log(err);
            } else {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(slots));
            }
          });
        })
        .catch((err) => {
          res.writeHead(500);
          res.end(err);
        });
    });
  }
});

server.listen(port, hostname, () => console.log(`server listening on ${port}`));
