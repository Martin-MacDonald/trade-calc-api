import express from 'express';
import passport from 'passport';
import crypto from 'crypto';
import { User, UserVerification } from '../models';
import isAuthenticated from '../authentication/auth';
import { sendVerificationEmail } from '../helpers/email';

const router = express.Router();

router.get('/', isAuthenticated, async (req, res) => {
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
    res.status(400).send(err);
  }
});

router.get('/verifyEmail', async (req, res) => {
  try {
    const verifiedUser = await UserVerification
      .query()
      .where('verificationKey', req.query.verificationKey)
      .eager('user')
      .first();    
    if (!verifiedUser) {
      throw new Error('no user found for that verification key');
    }
    await User
      .query()
      .patchAndFetchById(verifiedUser.user.id, { isVerified: true });    
    await UserVerification
      .query()
      .deleteById(verifiedUser.id);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/checkUsername', async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User
      .query()
      .where('username', username)
      .first();
    if (user) throw new Error('username already exists');
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/checkEmail', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User
      .query()
      .where('email', email)
      .first();
    if (user) throw new Error('an account with that email already exists');
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/register', async (req, res) => {
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
    res.status(400).send(err);
  }
});

router.post('/login', passport.authenticate('local'), async (req, res) => {
  res.json();
});

export default router;
