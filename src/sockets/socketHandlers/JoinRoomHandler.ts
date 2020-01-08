import { Socket } from 'socket.io';
import SendData from '../SendData';
import AbsHandler, { ISocket, IParams } from './AbsHandler';
import Commands from '../Commands';
import { addUserInRoom } from '../../actions/room';
import { IRoom } from '../../models/room';
import { IUser } from '../../models/user';

interface IParams2 extends IParams {
  ticket: string;
  token: string;
}

class JoinRoomHandler extends AbsHandler {
  checkParams = async (params: IParams2) => {
    const { ticket, token } = params;
    if (!ticket) {
      return 'Ticket is required';
    } else if (!token) {
      return 'Token is required';
    }
    return '';
  };

  doHandleMessage = async (socket: ISocket, params: IParams2, sendData: SendData) => {
    const { ticket, token } = params;

    addUserInRoom(ticket, token, (err: string, _room: IRoom) => {
      if (err) {
        // sendData.setError(err);
        // this.sender.send(socket, sendData);
      } else {
        // if (socket.room_id) socket.leave(socket.room_id);
        // socket.room_id = _room.id;
        // socket.user = { token };
        // socket.join(socket.room_id);
        // sendData.addParam('token', token).addParam('room', _room);
        // this.sender.broadCastInRoom(socket.room_id, sendData);
        // this.sender.broadCastAll(Commands.joinRoomGlobal, sendData);
      }
    });
  };
}

export default JoinRoomHandler;
