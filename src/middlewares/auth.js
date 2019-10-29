import jwt from 'jsonwebtoken';
import User from '../models/user';

export default async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const jwtDecoded = jwt.verify(token, 'randomsecret!@$%');
    const user = await User.findOne({
      _id: jwtDecoded._id,
      'tokens.token': token
    });

    if (!user) throw new Error();

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Authentication required' });
  }
};
