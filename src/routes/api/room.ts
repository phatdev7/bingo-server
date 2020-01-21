import { Router } from 'express';
const route = Router();
import { auth } from 'src/actions/user';
import {
  getCurrenRoom,
  createRoom,
  getRoomByUserIdAndRoomId,
} from 'src/actions/room';
import { getRoomTicket } from 'src/actions/room_ticket';
import { IRoomTicket, ICardSize } from 'src/models/room_ticket';
import { IRoom } from 'src/models/room';
import { IUser } from 'src/models/user';

route.post('/current', (req, res) => {
  auth(req)
    .then((user: IUser) => {
      getCurrenRoom(user._id)
        .then(rooms => {
          res.json({ rooms });
        })
        .catch(err => {
          res.status(404).json({ errors: err });
        });
    })
    .catch((errors: any) => {
      res.status(401).json({ errors });
    });
});

route.post('/', (req, res) => {
  auth(req)
    .then((user: IUser) => {
      const { title, num_of_column, num_of_row, num_of_win } = req.body;
      if (!title) {
        res.status(400).json({ errors: 'title is required' });
      } else if (!num_of_column) {
        res.status(400).json({ errors: 'num_of_column is required' });
      } else if (!num_of_row) {
        res.status(400).json({ errors: 'num_of_row is required' });
      } else if (!num_of_win) {
        res.status(400).json({ errors: 'num_of_win is required' });
      } else {
        const cardSize: ICardSize = {
          title,
          num_of_column,
          num_of_row,
          num_of_win,
        };
        createRoom(user._id, cardSize, (err: any, room: IRoom) => {
          if (err) {
            res.status(404).json({ errors: err });
          } else {
            res.json(room);
          }
        });
      }
    })
    .catch((errors: any) => {
      res.status(401).json({ errors });
    });
});

route.get('/:id', (req, res) => {
  auth(req)
    .then((user: IUser) => {
      getRoomByUserIdAndRoomId(user._id, req.params.id)
        .then(room => {
          res.json(room);
        })
        .catch(err => {
          res.status(404).json({ errors: err });
        });
    })
    .catch((errors: any) => {
      res.status(401).json({ errors });
    });
});

route.get('/:id/current_code', (req, res) => {
  auth(req)
    .then((user: IUser) => {
      getRoomTicket(req.params.id)
        .then((roomTicket: IRoomTicket) => {
          res.json(roomTicket.current_code);
        })
        .catch(err => {
          res.status(404).json({ errors: err });
        });
    })
    .catch((errors: any) => {
      res.status(401).json({ errors });
    });
});

route.get('/:id/tickets', (req, res) => {
  auth(req)
    .then((user: IUser) => {
      getRoomTicket(req.params.id)
        .then((roomTicket: IRoomTicket) => {
          res.json(roomTicket.tickets);
        })
        .catch(err => {
          res.status(404).json({ errors: err });
        });
    })
    .catch((errors: any) => {
      res.status(401).json({ errors });
    });
});

export default route;
