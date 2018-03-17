// require('dotenv').config();

// jest.mock('pg', () => ({
//   Client: () => ({
//     connect: () => {},
//     on: () => {},
//     end: () => {},
//     query: (query) => {
//       // console.log('mock factory function', query, params);
//       if (query === 'SELECT COUNT(restaurantid) FROM reservations WHERE restaurantid=$1 AND timestamp=$2') {
//         return new Promise((resolve) => {
//           resolve({
//             rows: [{ count: 199 }],
//           });
//         });
//       } else if (query === 'SELECT time,(MAX(restaurants.seats)-SUM(party)) AS remaining FROM reservations INNER JOIN restaurants ON restaurants.id = reservations.restaurantid WHERE date=$1 AND restaurantid=$2 GROUP BY time') {
//         return new Promise((resolve) => {
//           resolve({
//             rows: [
//               { time: 17, remaining: 40 },
//               { time: 18, remaining: 0 },
//               { time: 19, remaining: 10 },
//               { time: 20, remaining: 25 },
//               { time: 21, remaining: 30 },
//             ],
//           });
//         });
//       } else if (query === 'SELECT seats FROM restaurants WHERE id=$1') {
//         return new Promise((resolve) => {
//           resolve({
//             rows: [{ seats: 100 }],
//           });
//         });
//       } else if (query === 'INSERT INTO reservations (restaurantid, date, time, name, party) VALUES ($1,$2,$3,$4,$5)') {
//         return new Promise((resolve) => {
//           resolve();
//         });
//       }
//       return new Promise(resolve => resolve());
//     },
//   }),
// }));

// const db = require('./index');

// describe('db helpers w/live database', () => {
//   afterAll(() => {
//     jest.unmock('pg');
//   });

//   describe('genReservationSlots', () => {
//     test('should return data in the right shape', () => db.genReservationSlots({ restaurantId: 305, date: '2018-4-13' })
//       .then((results) => {
//         // expect(true).toBe(false);
//         const expectedObj = {
//           madeToday: expect.any(Number),
//           reservations: expect.any(Array),
//         };
//         expect(results).toMatchObject(expectedObj);

//         const expectedReservation = {
//           time: expect.any(Number),
//           remaining: expect.any(Number),
//         };
//         expect(results.reservations[0]).toMatchObject(expectedReservation);
//       }));
//   });

//   describe('addReservation', () => {
//     test('should fail on party > available seats', () => db.addReservation({
//       restaurantId: 305,
//       date: '2018-04-01',
//       time: 17,
//       name: 'Mayor Quimby',
//       party: 1000,
//     })
//       .then(() => {
//         // this shouldn't happen
//         expect(true).toBe(false);
//       })
//       .catch((error) => {
//         expect(error.message).toBe('Restaurant cannot take a party of that size!');
//       }));

//     test('should succeed on available seats > party', () => db.addReservation({
//       restaurantId: 305,
//       date: '2018-01-01',
//       time: 17,
//       name: 'Mayor Quimby',
//       party: 1,
//     })
//       .then(() => {
//         expect(true).toBe(true);
//       })
//       .catch(() => {
//         // this shouldn't happen
//         expect(true).toBe(false);
//       }));
//   });
// });
