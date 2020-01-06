import { Socket } from 'socket.io';
import Commands from './Commands';
import config from '../../config';
import Sender from './Sender';
import { CreateGameHandler, JoinRoomHandler } from './socketHandlers';
import { ISocket } from './socketHandlers/AbsHandler';
const { authCookieKey } = config;

export default (socket: ISocket) => {
  // const cookie = socket.handshake.headers.cookie;
  // const authCookie = cookie[authCookieKey] && JSON.parse(cookie[authCookieKey].replace('j:', ''));

  socket.on(Commands.createGame, params => {
    const handler = new CreateGameHandler(Commands.createGame);
    handler.handleMessage(socket, params);
  });

  socket.on(Commands.joinRoom, params => {
    const handler = new JoinRoomHandler(Commands.joinRoom);
    handler.handleMessage(socket, params);
  });
};
