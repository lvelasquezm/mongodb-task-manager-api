import express from 'express';

import './db/mongoose';
import userRouter from './routes/user';
import taskRouter from './routes/task';

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is up on port ${process.env.PORT}`);
});
