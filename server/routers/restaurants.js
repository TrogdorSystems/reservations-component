const express = require('express');
const moment = require('moment-timezone');

const db = require('../db');

const router = express.Router();

router.get('/:id/reservations/:date?', (req, res) => {
  const dateParam = req.params.date
    ? req.params.date
    : moment(new Date()).tz('America/Los_Angeles').format('YYYY-MM-DD');

  // console.log(req.params.id, dateParam);
  // res.set({ 'Access-Control-Allow-Origin': '*' });

  db.genReservationSlots({ restaurantId: req.params.id, date: dateParam })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log('genReservationSlots error', error);
      res.sendStatus(500);
    });
});

module.exports = router;
