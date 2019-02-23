import { Model } from 'objection';
import { User } from '.';

class UserVerification extends Model {
  static get tableName() {
    return 'userVerifications';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'verificationKey'],
      properties: {
        id: { type: 'integer' },
        userId: { type: 'integer' },
        verificationKey: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        filter: query => query.select('id'),
        join: {
          from: 'userVerifications.userId',
          to: 'users.id',
        },
      },
    };
  }
}

export default UserVerification;
