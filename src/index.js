import express from 'express';

import './db/mongoose';
import User from './models/user';
import Task from './models/task';

const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());

app.get('/users', (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(500).send());
});

app.post('/users', (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(() => res.status(201).send(user))
    .catch(error => res.status(400).send(error));
});

app.get('/tasks', (req, res) => {
  Task.find({})
    .then(tasks => res.send(tasks))
    .catch(err => res.status(500).send());
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
