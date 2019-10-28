import express from 'express';
import { Types } from 'mongoose';

import './db/mongoose';
import User from './models/user';
import Task from './models/task';

const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch {
    res.status(500).send();
  }
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid ID' });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch {
    res.status(500).send();
  }
});

app.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.patch('/users/:id', async (req, res) => {
  const updateKeys = Object.keys(req.body);
  const validUpdateKeys = ['name', 'email', 'password', 'age'];
  const isValidUpdate = updateKeys.every(key => validUpdateKeys.includes(key));

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(400).send();
    }

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch {
    res.status(500).send();
  }
});

app.get('/tasks/:id', async (req, res) => {
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

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.patch('/tasks/:id', async (req, res) => {
  const updateKeys = Object.keys(req.body);
  const validUpdateKeys = ['description', 'completed'];
  const isValidUpdate = updateKeys.every(key => validUpdateKeys.includes(key));

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(400).send();
    }

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
