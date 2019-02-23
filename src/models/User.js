import { Model } from 'objection';
import bcrypt from 'bcryptjs';
import { UserVerification } from '.';

class User extends Model {
  static get tableName() {
    return 'users';
  }

  $beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 12);
  }

  static verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'password', 'email'],
      properties: {
        id: { type: 'integer' },
        username: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
          unique: true,
        },
        password: { type: 'string', minLength: 1, maxLength: 255 },
        email: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
          unique: true,
        },
        isVerified: { type: 'boolean' },
      },
    };
  }

  static get relationMappings() {
    return {
      verification: {
        relation: Model.HasOneRelation,
        modelClass: UserVerification,
        join: {
          from: 'users.id',
          to: 'userVerifications.userId',
        },
      },
    };
  }
}

export default User;
