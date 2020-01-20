import { Router } from 'express';
import room from './room';
import ticket from './ticket';
import user from './user';
const route = Router();

route.use('/room', room);
route.use('/tickets', ticket);
route.use('/user', user);
route.use('*', (req, res) => {
  res.status(404).json({ msg: 'Api not found' });
});

export default route;
