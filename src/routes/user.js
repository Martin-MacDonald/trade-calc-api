import express from 'express';
import passport from 'passport';
import crypto from 'crypto';
import { User, UserVerification } from '../models';
import isAuthenticated from '../authentication/auth';
import { sendVerificationEmail } from '../helpers/email';

const router = express.Router();

router.get('/', isAuthenticated, async (req, res, next) => {
  try {
    const user = await User
      .query()
      .select('username', 'email')
      .where('id', req.user.id)
      .first();
    if (!user) {
      res.sendStatus(404);
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/verifyEmail', async (req, res, next) => {
  try {
    const verifiedUser = await UserVerification
      .query()
      .where('verificationKey', req.query.verificationKey)
      .eager('user')
      .first();    
    if (!verifiedUser) {
      res.sendStatus(404);
    }
    await User
      .query()
      .patchAndFetchById(verifiedUser.user.id, { isVerified: true });    
    await UserVerification
      .query()
      .deleteById(verifiedUser.id);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.post('/checkUsername', async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User
      .query()
      .where('username', username)
      .first();
    if (user) {
      res.sendStatus(409);
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.post('/checkEmail', async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User
      .query()
      .where('email', email)
      .first();
    if (user) {
      res.sendStatus(409);
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const verificationKey = crypto.randomBytes(48).toString('hex');
    await User
      .query()
      .insertWithRelated({
        username,
        email,
        password,
        isVerified: false,
        verification: {
          verificationKey,
        }
      });
    sendVerificationEmail('mmacdo54@caledonian.ac.uk', verificationKey);
    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
});

router.post('/login', passport.authenticate('local'), async (req, res) => {
  res.json();
});

export default router;
