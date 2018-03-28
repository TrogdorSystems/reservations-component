require('newrelic');
require('dotenv').config()
const Reservation = require('../client/dist/productionBundle-server').default;
const Html = require('../client/src/html');
const { renderToString } = require('react-dom/server');
const { createElement } = require('react');
const http = require('http');
const fs = require('fs');
const db = require('./db');
const path = require('path');

const redisClient = require('./cache');

const port = 8081;
// const hostname = '127.0.0.1';


const statistics = {
  cacheHit: 0,
  cacheMiss: 0,
  total: 0,
};

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const renderComponent = (component, id) => {
    const componentString = createElement(component, { id }, null);
    return renderToString(componentString);
  };
  // const urlSplit = url.split('/');
  // !Number()
  const urlSplit = url.split('/').slice(1);
  const [id, date] = [urlSplit[1], urlSplit[3]];
  if (method === 'GET' && url === `/restaurants/${id}/reservations/${date}`) {
    const redisKey = `${id}${date}`;
    statistics.total += 1;
    redisClient.GET(redisKey, (err, response) => {
      if (response !== null && response !== undefined) {
        statistics.cacheHit += 1;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(response);
      } else {
        statistics.cacheMiss += 1;
        db.genReservationSlots({ restaurantId: id, date })
          .then((result) => {
            const stringifiedResult = JSON.stringify(result);
            redisClient.SETEX(redisKey, 30, stringifiedResult);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(stringifiedResult);
          })
          .catch((error) => {
            res.writeHead(500);
            res.end(JSON.stringify(error));
          });
      }
    });
  } else if (method === 'GET' && url === '/favicon.ico') {
    res.writeHead(200, { 'Content-Type': 'image/apng' });
    fs.readFile('./client/dist/favicon.ico', (err, result) => (
      err ? console.error(err) : res.end(result)
    ));
  } else if (method === 'GET' && url === '/productionBundle.js') {
    // console.log(__dirname + '../client/dist/productionBundle.js')
    fs.createReadStream(path.join(__dirname, '../client/dist/productionBundle.js')).pipe(res);
  } else if (method === 'GET' && url === '/') {
    res.end(Html(renderComponent(Reservation, id), 'Silverspoon', id));
  } else if (method === 'POST' && url === '/reservations') {
    let body = '';
    req.on('error', (err) => { throw new Error(err); });
    req.on('data', (chunk) => {
      body += chunk;
    }).on('end', () => {
      const newBody = JSON.parse(body);
      db.addReservation(newBody)
        .then(() => {
          const redisKey = `${newBody.restaurantId}${newBody.date}`;
          redisClient.del(redisKey, (err) => {
            if (err) {
              throw new Error('redis error', err);
            }
          });
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

process.on('SIGINT', () => {
  console.log(__dirname)
  console.log(`
  'CacheHit: '${statistics.cacheHit} 
  CacheMiss: ${statistics.cacheMiss} 
  Percentage: ${(statistics.cacheHit / statistics.total) * 100}%
  `);
  process.exit();
});

server.listen(port, () => console.log(`server listening on ${port}`));
