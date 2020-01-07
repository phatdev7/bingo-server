import { Socket } from 'socket.io';
import SendData from '../SendData';
import Sender from '../Sender';
import { IUser } from '../../models/user';

export interface ISocket extends Socket {
  room_id: string;
  user: {
    token: string;
  };
}

export interface IParams {
  room_id: string;
  user: {
    token: string;
  };
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

  doHandleMessage: Function = async (socket: ISocket, params: IParams, sendData: SendData) => {
    throw new Error(`Not implement handle function yet: ${this.cmd}`);
  };

  handleMessage = async (socket: ISocket, params: IParams) => {
    const sendData = this.makeASendData();

    try {
      const err = await this.checkParams(params);
      if (err) {
        sendData.setError(err);
        this.sender.send(socket, sendData);
        return;
      }
      await this.doHandleMessage(socket, params, sendData);
    } catch (err) {
      sendData.setError(err);
      this.sender.send(socket, sendData);
    }
  };
}

export default AbsHandler;
