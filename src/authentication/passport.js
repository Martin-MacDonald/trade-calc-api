import passport from 'passport';
import LocalStrategy from 'passport-local';
import { User } from '../models';

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User
      .query()
      .findById(id);
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
});

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User
        .query()
        .findOne({ username });
      if (!user || !(User.verifyPassword(password, user.password))) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
));
