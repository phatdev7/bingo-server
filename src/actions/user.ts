import User, { IUser } from 'src/models/user';
import config from '../../config';
import uid from 'uniqid';

export const auth = async (req: any) => {
  try {
    const authCookie =
      req.body.cookies && req.body.cookies[config.authCookieKey]
        ? req.body.cookies[config.authCookieKey]
        : req.cookies[config.authCookieKey];

    if (authCookie && authCookie.token) {
      return getUserByToken(authCookie.token);
    } else {
      throw 'Auth cookie not found';
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getUserByToken = async (token: string) => {
  try {
    const user = await User.findOne({ token });
    if (user) {
      return Promise.resolve(user.toJSON());
    } else {
      throw 'User not found';
    }
  } catch (err) {
    return Promise.reject(err);
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
