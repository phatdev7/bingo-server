import { Router } from 'express';
import card from './card';
import access_token from './access_token';
const route = Router();

route.use('/card', card);
route.use('/access_token', access_token);
route.use('*', (req, res) => {
  res.status(404).json({ msg: 'Api not found' });
});

export default route;
