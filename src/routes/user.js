import { Router } from 'express';
import { Types } from 'mongoose';

import User from '../models/user';
import authMiddleware from '../middlewares/auth';

const router = new Router();

router.get('/users/me', authMiddleware, async (req, res) => {
  res.send(req.user);
});

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/users/logout', authMiddleware, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch {
    req.status(500).send();
  }
});

router.post('/users/logoutAll', authMiddleware, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch {
    req.status(500).send();
  }
});

router.patch('/users/me', authMiddleware, async (req, res) => {
  const updateKeys = Object.keys(req.body);
  const validUpdateKeys = ['name', 'email', 'password', 'age'];
  const isValidUpdate = updateKeys.every(key => validUpdateKeys.includes(key));

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    updateKeys.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/users/me', authMiddleware, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch {
    return res.status(400).send();
  }
});

export default router;
