exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable('userVerifications', (table) => {
    table.increments('id').primary();
    table
      .integer('userId')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users');
    table
      .string('verificationKey')
      .notNullable();
  }),
]);

exports.down = (knex, Promise) => Promise.all([knex.schema.dropTable('userVerifications')]);

