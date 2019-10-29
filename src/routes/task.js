import { Router } from 'express';
import { Types } from 'mongoose';

import Task from '../models/task';
import authMiddleware from '../middlewares/auth';

const router = new Router();

// GET /tasks?completed=true
router.get('/tasks', authMiddleware, async (req, res) => {
  const match = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  try {
    await req.user.populate({ path: 'tasks', match }).execPopulate();
    res.send(req.user.tasks);
  } catch {
    res.status(500).send();
  }
});

router.get('/tasks/:id', authMiddleware, async (req, res) => {
  const { id: _id } = req.params;

  if (!Types.ObjectId.isValid(_id)) {
    return res.status(400).send({ error: 'Invalid ID' });
  }

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch {
    res.status(500).send();
  }
});

router.post('/tasks', authMiddleware, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch('/tasks/:id', authMiddleware, async (req, res) => {
  const updateKeys = Object.keys(req.body);
  const validUpdateKeys = ['description', 'completed'];
  const isValidUpdate = updateKeys.every(key => validUpdateKeys.includes(key));

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).send();
    }

    updateKeys.forEach(update => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch {
    return res.status(400).send();
  }
});

export default router;
