import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true
});
