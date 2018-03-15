require('dotenv').config();
const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    },
    searchPath: ['public'],
    migrations: {
      directory: './server/db/migrations/',
    },
    seeds: {
      directory: path.join(__dirname, './server/db/seeds'),
    },
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    },
    searchPath: ['public'],
    migrations: {
      directory: './server/db/migrations/',
    },
  },
};
