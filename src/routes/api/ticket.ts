import { Router } from 'express';
const route = Router();
import { auth } from '../../actions/access_token';
import { getCurrentTicketByRoomId } from '../../actions/ticket';
import { ITicket } from '../../models/ticket';

route.get('/room/:id', (req, res) => {
  auth(req, (err: any, token: string) => {
    if (err) {
      res.status(401).json({ errors: 'Unauthencation' });
    } else {
      getCurrentTicketByRoomId(req.params.id, (err: any, ticket: ITicket) => {
        if (err) {
          res.status(404).json({ errors: err });
        } else {
          res.json(ticket);
        }
      });
    }
  });
});

export default route;
