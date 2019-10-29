import { Router } from 'express';
import { Types } from 'mongoose';

import Task from '../models/task';
import authMiddleware from '../middlewares/auth';

const router = new Router();

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch {
    res.status(500).send();
  }
});

router.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid ID' });
  }

  try {
    const task = await Task.findById(id);

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

router.patch('/tasks/:id', async (req, res) => {
  const updateKeys = Object.keys(req.body);
  const validUpdateKeys = ['description', 'completed'];
  const isValidUpdate = updateKeys.every(key => validUpdateKeys.includes(key));

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(400).send();
    }

    updateKeys.forEach(update => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).send();
    }

    return res.send(task);
  } catch {
    return res.status(400).send();
  }
});

export default router;
