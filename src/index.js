import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import connectToDatabase from './knex/db';
import routes from './routes';
import './authentication/passport';

require('dotenv').config()

const port = process.env.PORT;
const app = express();

connectToDatabase();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    maxAge: 1200000, // 20 minutes timeout
  },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.REACT_URL,
  );
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/user', routes.user);

app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});
