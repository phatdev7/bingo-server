import { Router } from 'express';
import room from './room';
import card from './card';
import ticket from './ticket';
import access_token from './access_token';
const route = Router();

route.use('/room', room);
route.use('/card', card);
route.use('/ticket', ticket);
route.use('/access_token', access_token);
route.use('*', (req, res) => {
  res.status(404).json({ msg: 'Api not found' });
});

export default route;
