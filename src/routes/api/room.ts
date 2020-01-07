import { Router } from 'express';
const route = Router();
import { auth } from '../../actions/access_token';
import { getCurrenRoomByToken, getRoomByTokenAndRoomId } from '../../actions/room';

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

export default route;
