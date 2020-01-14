import { Router } from 'express';
const route = Router();
import { auth } from '../../actions/access_token';
import { getCurrenRoomByToken, createRoom, getRoomByTokenAndRoomId } from '../../actions/room';
import { getRoomTicket } from '../../actions/room_ticket';
import { IRoomTicket } from '../../models/room_ticket';
import { IRoom } from '../../models/room';

route.post('/current', (req, res) => {
  auth(req, (err: any, token: string) => {
    if (err) {
      res.status(401).json({ errors: 'Unauthencation' });
    } else {
      getCurrenRoomByToken(token)
        .then(rooms => {
          res.json({ rooms });
        })
        .catch(err => {
          res.status(404).json({ errors: err });
        });
    }
  });
});

route.post('/', (req, res) => {
  auth(req, (err: any, token: string) => {
    if (err) {
      res.status(401).json({ errors: 'Unauthencation' });
    } else if (!req.body.title) {
      res.status(403).json({ errors: 'Title is required' });
    } else {
      createRoom(token, req.body.title, (err: any, room: IRoom) => {
        if (err) {
          res.status(404).json({ errors: err });
        } else {
          res.json(room);
        }
      });
    }
  });
});

route.get('/:id', (req, res) => {
  auth(req, (err: any, token: string) => {
    if (err) {
      res.status(401).json({ errors: 'Unauthencation' });
    } else {
      getRoomByTokenAndRoomId(token, req.params.id)
        .then(room => {
          res.json(room);
        })
        .catch(err => {
          res.status(404).json({ errors: err });
        });
    }
  });
});

route.get('/:id/current_code', (req, res) => {
  auth(req, (err: any) => {
    if (err) {
      res.status(401).json({ errors: 'Unauthencation' });
    } else {
      getRoomTicket(req.params.id)
        .then((roomTicket: IRoomTicket) => {
          res.json(roomTicket.current_code);
        })
        .catch(err => {
          res.status(404).json({ errors: err });
        });
    }
  });
});

export default route;
