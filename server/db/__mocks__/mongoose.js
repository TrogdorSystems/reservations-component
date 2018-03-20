const mongoose = {
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
    create: () => new Promise(resolve => resolve([{
      id: 314756,
      name: 'KrustyBurger',
      seats: 30,
    }])),
  }),
};

// mongoose.prototype = mongoose;

module.exports = mongoose;
