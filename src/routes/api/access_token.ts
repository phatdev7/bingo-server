import { Router } from 'express';
const route = Router();
import { auth, createToken } from '../../actions/access_token';
import config from '../../../config';

route.post('/', (req, res) => {
  auth(req, (err: any, token: string) => {
    if (err) {
      createToken((err: any, token: string) => {
        if (err) {
          res.clearCookie(config.authCookieKey);
          res.status(404).json({ errors: err });
        } else {
          res.cookie(
            config.authCookieKey,
            { token },
            {
              httpOnly: true,
              maxAge: config.jwtExpiresIn,
            },
          );
          res.json({ token });
        }
      });
    } else {
      res.cookie(
        config.authCookieKey,
        { token },
        {
          httpOnly: true,
          maxAge: config.jwtExpiresIn,
        },
      );
      res.json({ token });
    }
  });
});

export default route;
