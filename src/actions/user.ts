import User, { IUser } from 'src/models/user';
import config from '../../config';
import uid from 'uniqid';

export const auth = async (req: any, callback: Function) => {
  const authCookie =
    req.body.cookies && req.body.cookies[config.authCookieKey]
      ? req.body.cookies[config.authCookieKey]
      : req.cookies[config.authCookieKey];

  if (authCookie && authCookie.token) {
    User.findOne({ token: authCookie.token }, (err, successData: IUser) => {
      if (err || !successData) {
        callback(err);
      } else {
        callback(null, successData.toJSON());
      }
    });
  } else {
    callback(true);
  }
};

export const createUser = (name: string, callback: Function) => {
  const newUser = new User({
    name,
    token: uid(),
  });

  newUser
    .save()
    .then((user: IUser) => {
      callback(null, user);
    })
    .catch(err => {
      callback(err);
    });
};
