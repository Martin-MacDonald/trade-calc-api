const pg = require('pg');
require('dotenv').config()

pg.defaults.ssl = process.env.NODE_ENV !== 'development';

const development = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

const production = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

module.exports = process.env.NODE_ENV === 'development' ? development : production;
