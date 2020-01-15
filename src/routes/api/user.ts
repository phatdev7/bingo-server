import { Router } from 'express';
const route = Router();
import { auth, createUser } from 'src/actions/user';
import { IUser } from 'src/models/user';
import config from '../../../config';

route.post('/access_token', (req, res) => {
  auth(req, (err: any, user: IUser) => {
    if (err || !user) {
      res.clearCookie(config.authCookieKey);
      res.status(401).json({ errors: 'Unauthencation' });
      // createUser((err: any, user: IUser) => {
      //   if (err) {
      //     res.clearCookie(config.authCookieKey);
      //     res.status(404).json({ errors: err });
      //   } else {
      //     res.cookie(
      //       config.authCookieKey,
      //       { token: user.token },
      //       {
      //         httpOnly: true,
      //         maxAge: config.jwtExpiresIn,
      //       },
      //     );
      //     res.json({ user });
      //   }
      // });
    } else {
      res.cookie(
        config.authCookieKey,
        { token: user.token },
        {
          httpOnly: true,
          maxAge: config.jwtExpiresIn,
        },
      );
      res.json({ user });
    }
  });
});

route.post('/register', (req, res) => {
  const { name } = req.body;
  if (req.body.name) {
    createUser(name, (err: any, user: IUser) => {
      if (err) {
        res.clearCookie(config.authCookieKey);
        res.status(404).json({ errors: err });
      } else {
        res.cookie(
          config.authCookieKey,
          { token: user.token },
          {
            httpOnly: true,
            maxAge: config.jwtExpiresIn,
          },
        );
        res.json({ user });
      }
    });
  } else {
    res.status(403).json({ errors: 'Name is required' });
  }
});

export default route;
