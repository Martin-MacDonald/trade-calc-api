import { Model } from 'objection';
import { User } from '.';
import moment from 'moment';

class PasswordReset extends Model {
  static get tableName() {
    return 'passwordResets';
  }

  $beforeInsert() {
    this.expires = moment().add(1, 'hours');
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'resetKey'],
      properties: {
        id: { type: 'integer' },
        userId: { type: 'integer' },
        resetKey: { type: 'string' },
        expires: { type: 'string', format: 'date-time' },
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
          from: 'passwordResets.userId',
          to: 'users.id',
        },
      },
    };
  }
}

export default PasswordReset;
