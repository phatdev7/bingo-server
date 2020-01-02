import { Router } from 'express';
import card from './card';
const route = Router();

route.use('/card', card);
route.use('*', (req, res) => {
  res.status(404).json({ msg: 'Api not found' });
});

export default route;
