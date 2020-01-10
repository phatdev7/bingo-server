import { Socket } from 'socket.io';
import SendData from '../SendData';
import AbsHandler, { ISocket, IParams } from './AbsHandler';
import Commands from '../Commands';
import { addUserInRoom } from '../../actions/room';
import { IRoom } from '../../models/room';
import { IUser } from '../../models/user';

interface IParams2 extends IParams {
  current_code: string;
  token: string;
}

class JoinRoomHandler extends AbsHandler {
  checkParams = async (params: IParams2) => {
    const { current_code, token } = params;
    if (!current_code) {
      return 'current_code is required';
    } else if (!token) {
      return 'Token is required';
    }
    return '';
  };

  doHandleMessage = async (socket: ISocket, params: IParams2, sendData: SendData) => {
    const { current_code, token } = params;

    addUserInRoom(
      current_code,
      token,
      (err: string, data: { card: any; token: string; room_id: string }) => {
        if (err) {
          sendData.setError(err);
          this.sender.send(socket, sendData);
        } else {
          if (socket.room_id) socket.leave(socket.room_id);
          socket.room_id = data.room_id;
          socket.user = { token };
          socket.join(socket.room_id);
          sendData
            .addParam('token', token)
            .addParam('card', data.card)
            .addParam('room_id', data.room_id);
          this.sender.send(socket, sendData);
          this.sender.broadCastInRoom(socket.room_id, sendData);
        }
      },
    );
  };
}

export default JoinRoomHandler;
