import express from 'express';
import { Types } from 'mongoose';

import './db/mongoose';
import User from './models/user';
import Task from './models/task';

const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());

app.get('/users', (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(() => res.status(500).send());
});

app.post('/users', (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(() => res.status(201).send(user))
    .catch(error => res.status(400).send(error));
});

app.get('/users/:id', (req, res) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid ID' });
  }

  User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404).send();
      }

      res.send(user);
    })
    .catch(err => res.status(500).send(err));
});

app.get('/tasks', (req, res) => {
  Task.find({})
    .then(tasks => res.send(tasks))
    .catch(() => res.status(500).send());
});

app.get('/tasks', (req, res) => {
  Task.find({})
    .then(tasks => res.send(tasks))
    .catch(() => res.status(500).send());
});

app.get('/tasks/:id', (req, res) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid ID' });
  }

  Task.findById(id)
    .then(task => {
      if (!task) {
        return res.status(404).send();
      }

      res.send(task);
    })
    .catch(err => res.status(500).send(err));
});

app.post('/tasks', (req, res) => {
  const task = new Task(req.body);

  task
    .save()
    .then(() => res.status(201).send(task))
    .catch(error => res.status(400).send(error));
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
