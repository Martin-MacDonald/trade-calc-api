exports.seed = knex => knex('userVerifications').del()
.then(() => knex('passwordResets').del())
.then(() => knex('users').del())
.then(() => knex('users')
  .insert([
    {
      username: 'mmacdo54',
      password: '$2y$12$uzOuBMbZZvKXBT4UXCplj.7x5vjTZm98FE9dsIg20h05ZZC4wB7ly',
      email: 'test@gmail.com',
    },
    {
      username: 'smacdo54',
      password: '$2y$12$uzOuBMbZZvKXBT4UXCplj.7x5vjTZm98FE9dsIg20h05ZZC4wB7ly',
      email: 'test2@gmail.com',
    },
    {
      username: 'bmacdo54',
      password: '$2y$12$uzOuBMbZZvKXBT4UXCplj.7x5vjTZm98FE9dsIg20h05ZZC4wB7ly',
      email: 'test3@gmail.com',
    },
  ]));

