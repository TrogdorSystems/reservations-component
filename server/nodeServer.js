require('newrelic');

const Reservation = require('../client/dist/productionBundle-server').default;
const Html = require('../client/src/html');
const { renderToString } = require('react-dom/server');
const { createElement } = require('react');
const http = require('http');
const fs = require('fs');
const db = require('./db');
const moment = require('moment-timezone');

const redisClient = require('./cache');

const port = 8081;
const hostname = '127.0.0.1';

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const renderComponent = (component, id) => {
    const componentString = createElement(component, { id }, null);
    return renderToString(componentString);
  };
  const urlSplit = url.split('/');
  const urlId = Number(urlSplit[2]) || 305;
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
  } else if (method === 'GET' && url === '/favicon.ico') {
    res.writeHead(200, { 'Content-Type': 'image/webp' });
    let image = fs.readFile('../client/dist/favicon.ico', () => {
      res.end(image);
    });
  } else if (method === 'GET' && url === '/productionBundle.js') {
    fs.createReadStream('./client/dist/productionBundle.js').pipe(res);
  } else if (method === 'GET' && url === '/') {
    res.end(Html(renderComponent(Reservation, urlId), 'Silverspoon', urlId));
    fs.createReadStream('./client/dist/productionBundle.js').pipe(res);
  } else if (method === 'POST' && url === '/reservations') {
    let body = [];
    req.on('error', err => console.error(err));
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      const newBody = JSON.parse(body);
      db.addReservation(newBody)
        .then((slots) => {
          const redisKey = `${newBody.restaurantId}${newBody.date}`;
          redisClient.del(redisKey, (err) => {
            if (err) {
              console.log('redis error', err);
            }
          });
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(slots));
        })
        .catch((err) => {
          res.writeHead(500);
          res.end(err);
        });
    });
  }
});

server.listen(port, hostname, () => console.log(`server listening on ${port}`));
