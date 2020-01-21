import { Socket } from 'socket.io';
import cookieParser from 'cookie';
import { getUserByToken } from 'src/actions/user';
import config from '../../../config';
import SendData from '../SendData';
import Sender from '../Sender';
import { IUser } from 'src/models/user';
const { authCookieKey } = config;

export interface ISocket extends Socket {
  room_id: string;
  user: IUser;
}

export interface IParams {
  room_id: string;
  user: IUser;
}

class AbsHandler {
  cmd: string;
  sender: any;
  caching: any;
  cachingKey: string;

  constructor(cmd: string) {
    this.cmd = cmd;
    this.sender = Sender;
  }

  makeASendData = () => {
    return new SendData(this.cmd);
  };

  checkParams = async (params: object) => {
    return '';
  };

  doHandleMessage: Function = async (
    socket: ISocket,
    params: IParams,
    sendData: SendData,
  ) => {
    throw new Error(`Not implement handle function yet: ${this.cmd}`);
  };

  handleMessage = async (socket: ISocket, params: IParams) => {
    const sendData = this.makeASendData();

    try {
      const cookie = cookieParser.parse(socket.handshake.headers.cookie);
      const authCookie =
        cookie[authCookieKey] &&
        JSON.parse(cookie[authCookieKey].replace('j:', ''));
      const user = await getUserByToken(authCookie.token);

      const newParams = { ...params, user };
      const err = await this.checkParams(newParams);
      if (err) {
        sendData.setError(err);
        this.sender.send(socket, sendData);
        return;
      }
      await this.doHandleMessage(socket, newParams, sendData);
    } catch (err) {
      sendData.setError(err);
      this.sender.send(socket, sendData);
    }
  };
}

export default AbsHandler;
