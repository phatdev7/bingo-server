import { Router } from 'express';
const route = Router();
import { auth } from 'src/actions/user';
import { getTicketList } from 'src/actions/card';
import { IUser } from 'src/models/user';
import { ITicket } from 'src/models/room_ticket';

route.get('/', async (req, res) => {
  auth(req)
    .then((user: IUser) => {
      getTicketList(user._id)
        .then((tickets: ITicket[]) => {
          res.json({ tickets });
        })
        .catch((err: any) => {
          res.status(404).json({ errors: err });
        });
    })
    .catch((errors: any) => {
      res.status(401).json({ errors });
    });
});

export default route;
