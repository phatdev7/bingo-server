import { Socket, Server } from 'socket.io';
import SendData from './SendData';

class Sender {
  io: Server;
  pub: any;
  sub: any;
  constructor() {
    this.io = null;
    this.pub = null;
    this.sub = null;
  }

  setIO = (io: Server) => {
    this.io = io;
  };

  setPub = (pub: any) => {
    this.pub = pub;
  };

  setSub = (sub: any) => {
    this.sub = sub;
  };

  subscribe = (channel: string) => {
    this.sub.subscribe(channel);
  };

  unsubscribe = (channel: string) => {
    this.sub.unsubscribe(channel);
  };

  publish = (channel: string, msg: string) => {
    this.pub.publish(channel, JSON.stringify(msg));
  };

  onMessage = (callback: Function) => {
    this.sub.on('message', (channel: string, msg: string) => {
      callback(channel, msg);
    });
  };

  send = (socket: Socket, sendData: SendData) => {
    socket.emit(sendData.getCmd(), sendData.getParams());
  };

  broadCastInRoom = (roomId: string, sendData: SendData) => {
    this.io.in(roomId).emit(sendData.getCmd(), sendData.getParams());
  };

  broadCastAll = (cmd: string, sendData: SendData) => {
    this.io.emit(cmd, sendData.getParams());
  };
}

export default new Sender();
