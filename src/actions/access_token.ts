import AccessToken, { IAccessToken } from '../models/access_token';
import config from '../../config';
import uid from 'uniqid';

export const auth = async (req: any, callback: Function) => {
  const authCookie =
    req.body.cookies && req.body.cookies[config.authCookieKey]
      ? req.body.cookies[config.authCookieKey]
      : req.cookies[config.authCookieKey];

  if (authCookie && authCookie.token) {
    AccessToken.findOne({ token: authCookie.token }, (err, successData: IAccessToken) => {
      if (err || !successData) {
        callback(err);
      } else {
        callback(null, successData.toJSON().token);
      }
    });
  } else {
    callback(true);
  }
};

export const createToken = (callback: Function) => {
  const newAccessToken = new AccessToken({
    token: uid(),
  });

  newAccessToken
    .save()
    .then((access_token: IAccessToken) => {
      callback(null, access_token.token);
    })
    .catch(err => {
      callback(err);
    });
};
