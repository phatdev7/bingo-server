import express from 'express';
import api from './api';
const route = express.Router();

route.use((req, res, next) => {
  next();
});

route.use('/api', api);

export default route;
