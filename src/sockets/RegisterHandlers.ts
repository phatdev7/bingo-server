import Commands from './Commands';
import {
  CreateRoomHandler,
  JoinRoomHandler,
  ScanQRCodeHandler,
  CreateGameHandler,
} from './socketHandlers';
import { ISocket } from './socketHandlers/AbsHandler';

export default (socket: ISocket) => {
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

  socket.on(Commands.createGame, params => {
    const handler = new CreateGameHandler(Commands.createGame);
    handler.handleMessage(socket, params);
  });
};
