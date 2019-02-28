import express from 'express';
import passport from 'passport';
import crypto from 'crypto';
import { User, UserVerification } from '../models';
import isAuthenticated from '../authentication/auth';
import { sendVerificationEmail } from '../helpers/email';

const router = express.Router();

router.get('/', isAuthenticated, async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await User
      .query()
      .select('username', 'email')
      .findOne({ id });
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
    const verificationKey = req.query.verificationKey;
    const verifiedUser = await UserVerification
      .query()
      .findOne({ verificationKey })
      .eager('user'); 
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

router.post('/resendVerification', async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User
      .query()
      .findOne({ email })
      .eager('verification');
    if (!user || !user.verification) {
      res.sendStatus(404);
    }
    sendVerificationEmail('mmacdo54@caledonian.ac.uk', user.verification.verificationKey);
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
      .findOne({ username });
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
      .findOne({ email });
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
  if (!req.user.isVerified) {
    req.session.destroy();
    res.status(401).json({ notVerified: true });
  }
  res.json();
});

export default router;
