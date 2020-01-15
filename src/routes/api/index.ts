import { Router } from 'express';
import room from './room';
import card from './card';
import user from './user';
const route = Router();

route.use('/room', room);
route.use('/cards', card);
route.use('/user', user);
route.use('*', (req, res) => {
  res.status(404).json({ msg: 'Api not found' });
});

export default route;
