import { Router } from 'express';
const route = Router();
import { auth } from '../../actions/access_token';
import { generate, getCardList } from 'src/actions/card';

interface ICard {
  token: string;
  card: [];
  current_code: string;
}

route.get('/', async (req, res) => {
  auth(req, (err: any, token: string) => {
    if (err) {
      res.status(401).json({ errors: 'Unauthencation' });
    } else {
      getCardList(token)
        .then((cards: ICard[]) => {
          res.json({ cards });
        })
        .catch((err: any) => {
          res.status(404).json({ errors: err });
        });
    }
  });
});

export default route;
