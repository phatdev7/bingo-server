import Commands from './Commands';
import config from '../../config';
import { CreateRoomHandler, JoinRoomHandler, ScanQRCodeHandler } from './socketHandlers';
import { ISocket } from './socketHandlers/AbsHandler';
const { authCookieKey } = config;

export default (socket: ISocket) => {
  // const cookie = socket.handshake.headers.cookie;
  // const authCookie = cookie[authCookieKey] && JSON.parse(cookie[authCookieKey].replace('j:', ''));

  socket.on(Commands.createRoom, params => {
    const handler = new CreateRoomHandler(Commands.createRoom);
    handler.handleMessage(socket, params);
  });

  socket.on(Commands.joinRoom, params => {
    const handler = new JoinRoomHandler(Commands.joinRoom);
    handler.handleMessage(socket, params);
  });

  socket.on(Commands.scanQRCode, params => {
    const handler = new ScanQRCodeHandler(Commands.scanQRCode);
    handler.handleMessage(socket, params);
  });
};
