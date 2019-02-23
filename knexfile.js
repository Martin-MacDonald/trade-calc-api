require('dotenv').config()

const development = {
  client: 'mysql2',
  connection: {
    database: 'trade_calculator',
    user: 'root',
    password: 'root',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

const production = {
  client: 'mysql2',
  connection: {
    host: process.env.RDS_HOSTNAME,
    database: process.env.RDS_DB_NAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

module.exports = process.env.NODE_ENV === 'development' ? development : production;
