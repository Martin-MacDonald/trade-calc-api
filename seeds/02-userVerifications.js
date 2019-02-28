exports.seed = knex => knex('userVerifications')
  .insert([
    {
      id: 1,
      userId: 1,
      verificationKey: '4132928f44b36e852f4aed3dd269c59834eb0abf241342bce97cecba43fd0ef082439c209fa9f9c177b35f057b99dd24',
    },
    {
      id: 2,
      userId: 2,
      verificationKey: '5132928f44b36e852f4aed3dd269c59834eb0abf241342bce97cecba43fd0ef082439c209fa9f9c177b35f057b99dd24',
    },
    {
      id: 3,
      userId: 3,
      verificationKey: '6132928f44b36e852f4aed3dd269c59834eb0abf241342bce97cecba43fd0ef082439c209fa9f9c177b35f057b99dd24',
    },
  ]);