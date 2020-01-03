import { Router } from 'express';
const route = Router();
import { generate } from 'src/actions/card';

route.get('/', async (req, res) => {
  generate(6, 4)
    .then(card => {
      res.json({ card });
    })
    .catch(err => res.status(404).json({ errors: err }));
});

export default route;
