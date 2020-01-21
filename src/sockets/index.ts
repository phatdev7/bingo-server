import SocketIO, { Server } from 'socket.io';
import http from 'http';
import RegisterHandlers from './RegisterHandlers';
import Sender from './Sender';
import { ISocket } from './socketHandlers/AbsHandler';
import redis from 'redis';
import config from '../../config';
const { port, host } = config.cachingConfig;

class Socket {
  io: Server;
  pub: any;
  sub: any;
  constructor() {
    this.io = null;
    this.pub = null;
    this.sub = null;
  }

  init = (server: http.Server, path: string, initSuccess: Function) => {
    this.io = SocketIO(server, {
      path,
      pingInterval: 5000,
      pingTimeout: 5000,
      cookie: false,
    });
    Sender.setIO(this.io);
    this.io.on('connection', this.onConnection);

    setTimeout(() => {
      console.log('Websocket ready');
      initSuccess();
    }, 100);
  };

  initWithPubSub = (server: Server, path: string, initSuccess: Function) => {
    this.pub = redis.createClient(port, host);
    this.sub = redis.createClient(port, host);

    const self = this;

    self.pub.on('ready', () => {
      self.sub.on('ready', () => {
        console.log('Pub/Sub ready');

        self.io = SocketIO(server, {
          path,
          pingInterval: 5000,
          pingTimeout: 5000,
        });

        Sender.setIO(self.io);
        Sender.setPub(self.pub);
        Sender.setSub(self.sub);

        self.io.on('connection', this.onConnection.bind(self));

        setTimeout(() => {
          console.log('Websocket ready');
          initSuccess();
        }, 100);
      });
    });
  };

  onConnection = (socket: ISocket) => {
    RegisterHandlers(socket);
  };
}

export default new Socket();
