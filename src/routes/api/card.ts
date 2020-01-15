import { Router } from 'express';
const route = Router();
import { auth } from 'src/actions/user';
import { getCardList } from 'src/actions/card';
import { IUser } from 'src/models/user';
import { ICard } from 'src/models/room_ticket';

route.get('/', async (req, res) => {
  auth(req, (err: any, user: IUser) => {
    if (err) {
      res.status(401).json({ errors: 'Unauthencation' });
    } else {
      getCardList(user._id)
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
