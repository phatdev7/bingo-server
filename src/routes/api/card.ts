import { Router } from 'express';
const route = Router();
import { generate } from 'src/actions/card';

route.post('/', async (req, res) => {
  generate(6, 4)
    .then(data => {
      res.json({ data });
    })
    .catch(err => res.status(404).json({ errors: err }));
});

export default route;
