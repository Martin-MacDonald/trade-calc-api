import passport from 'passport';
import LocalStrategy from 'passport-local';
import { User } from '../models';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User
      .query()
      .where({ id })
      .first();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new LocalStrategy(
  async (username, password, done) => {
    const user = await User
      .query()
      .where({ username })
      .first();
    if (!user || !(User.verifyPassword(password, user.password))) {
      done(null, false);
    }
    done(null, user);
  },
));
