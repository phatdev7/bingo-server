import { Socket } from 'socket.io';
import SendData from '../SendData';
import AbsHandler, { ISocket, IParams } from './AbsHandler';
import Commands from '../Commands';
import { roomAction } from '../../actions';
import { IRoom } from '../../models/room';
import { IUser } from '../../models/user';

interface IParams2 extends IParams {
  room_id: string;
  token: string;
}

class JoinRoomHandler extends AbsHandler {
  checkParams = async (params: IParams2) => {
    const { room_id, token } = params;
    if (!room_id) {
      return 'Room_id is required';
    } else if (!token) {
      return 'Token is required';
    }
    return '';
  };

  doHandleMessage = async (socket: ISocket, params: IParams2, sendData: SendData) => {
    const { room_id, token } = params;

    // roomAction.addUserInRoom(room_id, token, (err: string, _room: IRoom) => {
    //   if (err) {
    //     sendData.setError(err);
    //     this.sender.send(socket, sendData);
    //   } else {
    //     if (socket.room_id) socket.leave(socket.room_id);

    //     socket.room_id = _room.id;
    //     socket.user = { token };
    //     socket.join(socket.room_id);
    //     sendData.addParam('token', token).addParam('room', _room);
    //     this.sender.broadCastInRoom(room_id, sendData);
    //     // this.sender.broadCastAll(Commands.joinRoomGlobal, sendData);
    //   }
    // });
  };
}

export default JoinRoomHandler;
