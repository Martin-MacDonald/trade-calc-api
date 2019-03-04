exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable('passwordResets', (table) => {
    table.increments('id').primary();
    table
      .integer('userId')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users');
    table.string('resetKey').notNullable();
    table.datetime('expires').notNullable();
  }),
]);

exports.down = (knex, Promise) => Promise.all([knex.schema.dropTable('passwordResets')]);


