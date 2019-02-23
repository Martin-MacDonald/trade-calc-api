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

router.get('/players', isAuthenticated, async (req, res) => {
  try {
    const players = await User
      .query()
      .select('username')
      .where('id', req.user.id)
      .eager('players.[position, team]');
    if (!players) {
      res.sendStatus(404);
    }
    res.json(players);
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

router.post('/select', isAuthenticated, async (req, res) => {
  try {
    if (!req.body.selections) {
      throw new Error('no selection provided');
    }
    const selections = req.body.selections;
    await UserSelection
      .query()
      .delete()
      .where('userId', req.user.id);
    for (let i = 0; i < selections.length; i++) {
      await UserSelection
        .query()
        .insert({ userId: req.user.id, playerId: selections[i].playerId });
    }
    res.sendStatus(201);
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;
