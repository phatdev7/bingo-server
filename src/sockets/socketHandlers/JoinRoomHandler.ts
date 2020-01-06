import { Socket } from 'socket.io';
import SendData from '../SendData';
import AbsHandler, { ISocket, IParams } from './AbsHandler';
import Commands from '../Commands';
import { roomAction } from '../../actions';
import { IRoom } from '../../models/room';
import { IUser } from '../../models/user';

class JoinRoomHandler extends AbsHandler {
  checkParams = async (params: IParams) => {
    const { room_id } = params;
    if (!room_id) {
      return 'Room_id is required';
    }
    return '';
  };

  doHandleMessage = async (socket: ISocket, params: IParams, sendData: SendData) => {
    const { room_id, user } = params;

    roomAction.addUserInRoom(room_id, user, (err: string, _room: IRoom) => {
      if (err) {
        sendData.setError(err);
        this.sender.send(socket, sendData);
      } else {
        if (socket.room_id) socket.leave(socket.room_id);

        socket.room_id = _room.id;
        socket.user = user;
        socket.join(socket.room_id);
        sendData.addParam('user', user).addParam('room', _room);
        this.sender.broadCastInRoom(room_id, sendData);
        // this.sender.broadCastAll(Commands.joinRoomGlobal, sendData);
      }
    });
  };
}

export default JoinRoomHandler;
