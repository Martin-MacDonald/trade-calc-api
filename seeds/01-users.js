exports.seed = knex => knex('userVerifications')
.del()
.then(() => knex('users').del())
.then(() => knex('users')
  .insert([
    {
      id: 1,
      username: 'mmacdo54',
      password: '$2y$12$uzOuBMbZZvKXBT4UXCplj.7x5vjTZm98FE9dsIg20h05ZZC4wB7ly',
      email: 'test@gmail.com',
    },
    {
      id: 2,
      username: 'smacdo54',
      password: '$2y$12$uzOuBMbZZvKXBT4UXCplj.7x5vjTZm98FE9dsIg20h05ZZC4wB7ly',
      email: 'test2@gmail.com',
    },
    {
      id: 3,
      username: 'bmacdo54',
      password: '$2y$12$uzOuBMbZZvKXBT4UXCplj.7x5vjTZm98FE9dsIg20h05ZZC4wB7ly',
      email: 'test3@gmail.com',
    },
  ]));

