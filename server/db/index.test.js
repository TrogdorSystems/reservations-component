require('dotenv').config();
const moment = require('moment-timezone');

jest.mock('mongoose');

const db = require('./index');

describe('db/index.js', () => {
  afterAll(() => {
    jest.unmock('mongoose');
  });

  describe('bookingsToday', () => {
    // test('should run count reservations made today for a restaurant', () => {
    //   const restaurantId = 305;
    //   const today = moment.tz('America/Los_Angeles').format('YYYY-MM-DD');
    //   db.bookingsToday(restaurantId)
    //     .then((result) => {
    //       console.log(result)
    //       // expect(result.query).toBe('SELECT COUNT(restaurantId) FROM reservations WHERE restaurantid=$1 AND timestamp=$2');
    //       expect(result.params).toHaveLength(2);
    //       expect(result.params).toEqual(expect.arrayContaining([
    //         restaurantId, today]));
    //     })
    //     .catch((error) => {
    //       expect(error).toBe(false);
    //     });
    // });
  });

  describe('getOpenSeats', () => {
    test('should run select query from DB', () => {
      const testItem = { restaurantId: 305, date: '2018-04-01' };
      db.getOpenSeats(testItem)
        .then((result) => {
          expect(result.query).toBe('SELECT time,(MAX(restaurants.seats)-SUM(party)) AS remaining FROM reservations INNER JOIN restaurants ON restaurants.id = reservations.restaurantid WHERE date=$1 AND restaurantid=$2 GROUP BY time');
          expect(result.params).toHaveLength(2);
          expect(result.params).toEqual(expect.arrayContaining([
            testItem.date, testItem.restaurantId]));
        })
        .catch((error) => {
          expect(error).toBe(false);
        });
    });
  });

  describe('getMaxSeats', () => {
    test('should run select query from DB', () => {
      const restaurantId = 305;
      db.getMaxSeats(restaurantId)
        .then((result) => {
          console.log('get max seats', result);
          // expect(result.params).toHaveLength(1);
          expect(result.params).toEqual(expect.arrayContaining([restaurantId]));
        })
        .catch((error) => {
          expect(error).toBe(false);
        });
    });
  });


  describe('addRestaurantInfo', () => {
    test('should run insert query of restaurant info into DB', () => {
      const testItem = { id: 5, name: 'Krusty Burger', seats: 100 };
      db.addRestaurantInfo(testItem)
        .then((result) => {
          expect(result.params).toHaveLength(3);
          expect(result.params).toEqual(expect.arrayContaining([
            testItem.id, testItem.name, testItem.seats]));
        })
        .catch((error) => {
          expect(error).toBe(false);
        });
    });
  });


  describe('addReservation', () => {
    test('should run insert query of reservation into DB', () => {
      const testItem = {
        restaurantId: 305,
        date: '2018-03-01',
        time: 17,
        name: 'Homer Simpson',
        party: 5,
      };

      db.addReservation(testItem)
        .then((result) => {
          expect(result.params).toHaveLength(5);
          expect(result.params).toEqual(expect.arrayContaining([
            testItem.restaurantId, testItem.date, testItem.time, testItem.name, testItem.party]));
        })
        .catch((error) => {
          expect(error).toBe(false);
        });
    });
  });

  describe('genReservationSlots', () => {
    test('should', () => {
      expect(true).toBe(true);
    });
  });
});
