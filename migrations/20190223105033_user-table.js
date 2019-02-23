exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username').notNullable();
    table.string('password').notNullable();
    table.string('email').notNullable();
    table.boolean('isVerified').notNullable().defaultsTo(false);
    table.unique('username');
    table.unique('email');
  }),
]);

exports.down = (knex, Promise) => Promise.all([knex.schema.dropTable('users')]);
