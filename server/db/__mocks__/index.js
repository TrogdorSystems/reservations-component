
const addReservation = ({ restaurantId }) => {
  if (typeof restaurantId === 'number') {
    // console.log('INSIDE MOCK addReservation OK');
    return new Promise(resolve => resolve());
  }
  // console.log('INSIDE MOCK addReservation REJECT');
  return new Promise((resolve, reject) => reject());
};

const bookingsToday = () => new Promise(resolve => resolve(250));

const getOpenSeats = () => new Promise((resolve) => {
  resolve({
    time: 17,
    remaining: 50,
  });
});

const getMaxSeats = () => new Promise(resolve => resolve({ seats: 75 }));

const genReservationSlots = ({ date }) => {
  if (date === '2018-02-31') {
    return new Promise((resolve, reject) => {
      reject(new Error('bad date!'));
    });
  }

  return new Promise(resolve =>
    resolve({
      madeToday: 100,
      reservations: [
        { time: 17, remaining: 5 },
        { time: 18, remaining: 10 },
      ],
    }));
};

module.exports = {
  addReservation, bookingsToday, getOpenSeats, getMaxSeats, genReservationSlots,
};
