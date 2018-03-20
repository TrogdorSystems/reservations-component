require('dotenv').config();

jest.mock('mongoose', () => ({
  connect: () => {},
  Schema: () => ({
    id: {
      type: Number,
      unique: true,
    },
    name: String,
    seats: Number,
    reservations: [{
      date: Date,
      time: Number,
      name: String,
      party: Number,
      timestamp: { type: Date, default: Date.now() },
    }],
  }),
  model: () => ({ 
    find: (id) => {
      // console.log('mock factory function', query, params);
      if (id) {
        return new Promise((resolve) => {
          resolve([{
            id: 108232389749,
            name: 'Bart Simpson',
            seats: 25,
            reservations: [{
              date: new Date(),
              time: 18,
              name: 'Homer Simpson',
              party: 4,
              timestamp: '2018-03-25',
            }],
          }]);
        });
      }
    },
    getBookingsForDate: (id, date) => {
      return new Promise((resolve) => {
        resolve([
          { time: 17, remaining: 40 },
          { time: 18, remaining: 0 },
          { time: 19, remaining: 10 },
          { time: 20, remaining: 25 },
          { time: 21, remaining: 30 },
        ]);
      });
    },
    getMaxSeats: () => new Promise((resolve) => {
      resolve([{
        seats: 250,
      }]);
    }),
    findOneAndUpdate: (id, date, time, name, party) => new Promise((resolve) => {
      resolve();
    }),
  }),
  findById: () => new Promise(resolve => resolve([{ seats: 250 }])),
  RestaurantModel: () => ({
    
  }),
}));

const db = require('./index');

describe('db helpers w/live database', () => {
  afterAll(() => {
    jest.unmock('mongoose');
  });

  describe('genReservationSlots', () => {
    test('should return data in the right shape', () => db.genReservationSlots({ restaurantId: 305, date: '2018-04-13' })
      .then((results) => {
        // expect(true).toBe(false);
        const expectedObj = {
          madeToday: expect.any(Number),
          reservations: expect.any(Array),
        };
        expect(results).toMatchObject(expectedObj);

        const expectedReservation = {
          time: expect.any(Number),
          remaining: expect.any(Number),
        };
        expect(results.reservations[0]).toMatchObject(expectedReservation);
      }));
  });

  describe('addReservation', () => {
    test('should fail on party > available seats', () => db.addReservation({
      restaurantId: 305,
      date: '2018-04-01',
      time: 17,
      name: 'Mayor Quimby',
      party: 1000,
    })
      .then(() => {
        // this shouldn't happen
        expect(true).toBe(false);
      })
      .catch((error) => {
        expect(error.message).toBe('Restaurant cannot take a party of that size!');
      }));

    test('should succeed on available seats > party', () => db.addReservation({
      restaurantId: 305,
      date: '2018-01-01',
      time: 17,
      name: 'Mayor Quimby',
      party: 1,
    })
      .then(() => {
        expect(true).toBe(true);
      }));
  });
});
