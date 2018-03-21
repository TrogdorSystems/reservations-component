# reservations-component

[![CircleCI](https://circleci.com/gh/thesilverspoon/reservations-component.svg?style=svg)](https://circleci.com/gh/thesilverspoon/reservations-component)

## PostgreSQL Installation Instructions

1.  Install PostgreSQL through `brew`:
```
$ brew install postgresql
```

2.  Initialize the database
```
$ initdb /usr/local/var/postgres
```

3. In order to start the PostgreSQL server, run:
```
$ pg_ctl -D /usr/local/var/postgres start
```

Later, if you want to stop the PostgreSQL server, run:
```
$ pg_ctl -D /usr/local/var/postgres stop
```

4. Create a user:
```
$ createuser mark_pg

Shall the new role be a superuser? (y/n) n
Shall the new role be allowed to create databases? (y/n) n
Shall the new role be allowed to create more new roles? (y/n) n
```

5. Create a database named "silverspoon", owned by the new user
```
$ createdb -Omark_pg -Eutf8 silverspoon
```

### `psql` console
Login to the `psql` administrative console:
```
$ psql -U mark_pg silverspoon
```

The `psql` prompt looks like this.
```
silverspoon->
```

List of useful `psql` commands
```
\?   // help
\q   // quit
\l   // list databases
\dt  // show tables
\dt <name>
\i <filename> // run filename with commands
select * from restaurants;
select * from reservations;
```

## Reservations Component Setup

6. `git clone` the repository from Github.

7. Download and install dependencies:
```
$ cd reservations-component
$ npm install
```

8. Update the included `example.env` file with relevant settings & rename to `.env`


9. Seed the database with data:
```
$ npm run seed

> node ./server/db/seed.js

migration complete, loading restaurant data
restaurant data complete, loading reservations
Generated 3866 reservations for 2018-03-02
Generated 3840 reservations for 2018-03-03
Generated 3763 reservations for 2018-03-04
Generated 3794 reservations for 2018-03-05
Generated 3749 reservations for 2018-03-06
Generated 3778 reservations for 2018-03-07
Generated 3836 reservations for 2018-03-08
reservations complete
closing connections
pg client end
```

10. Run the development server:
```
$ npm run server-dev
```

11. The component should now be available from:
```
http://localhost:3001/
```

12. Install redis
```
brew install redis
```
13. start redis server
```
redis-server /usr/local/etc/redis.conf
```
  stop redis server
```
redis-serv

### Other `npm` commands:
```
npm test                  // run jest test suite
npm run test:watch        // run jest in watch mode
npm run test:coverage     // generate test coverage report
npm run build             // run webpack build
npm run build:prod        // create a production bundle.js
npm run build:watch       // run webpack in watch mode
npm run lint              // run ESLint
```
