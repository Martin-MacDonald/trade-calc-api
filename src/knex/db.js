import Knex from 'knex';
import { Model } from 'objection';
import connection from '../../knexfile';

const connectToDatabase = () => Model.knex(Knex(connection));

export default connectToDatabase;
