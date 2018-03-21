
const http = require('http');
const fs = require('fs');
const db = require('./db');
const moment = require('moment-timezone');

const redisClient = require('./cache');

const port = 8081;
const hostname = '127.0.0.1';

const server = http.createServer((req, res) => {
  const { method, url } = req;
  let urlSplit = url.split('/');
  let id = urlSplit[2];
  let date = urlSplit[4];
  if (method === 'GET' && url === `/restaurants/${id}/reservations/${date}`) {

    const dateParam = date || moment(new Date()).tz('America/Los_Angeles').format('YYYY-MM-DD');
    redisClient.HMSET( , date, (err, response) => {
      if (response !== null) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(response));
        res.end();
      }
      db.genReservationSlots({ restaurantId: id, date: dateParam })
        .then((result) => {
          redisClient.set( , () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(result));
            res.end();
          });
        })
        .catch((error) => {
          res.writeHead(500);
          res.end(error);
        });
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
