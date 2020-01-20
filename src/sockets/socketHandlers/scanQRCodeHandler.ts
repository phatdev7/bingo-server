import { Socket } from 'socket.io';
import SendData from '../SendData';
import AbsHandler, { ISocket, IParams } from './AbsHandler';
import Commands from '../Commands';
import { addUserInRoom } from 'src/actions/room';
import { IRoom } from 'src/models/room';
import { IUser } from 'src/models/user';

interface IParams2 extends IParams {
  current_code: string;
}

class ScanQRCodeHandler extends AbsHandler {
  checkParams = async (params: IParams2) => {
    const { current_code, user } = params;
    if (!current_code) {
      return 'current_code is required';
    } else if (!user) {
      return 'User is required';
    }
    return '';
  };

  doHandleMessage = async (
    socket: ISocket,
    params: IParams2,
    sendData: SendData,
  ) => {
    const { current_code, user } = params;

    addUserInRoom(current_code, user)
      .then(
        (data: {
          card: any;
          user: IUser;
          room_id: string;
          new_code: string;
        }) => {
          if (socket.room_id) socket.leave(socket.room_id);
          socket.room_id = data.room_id;
          socket.user = user;
          socket.join(socket.room_id);
          sendData
            .addParam('user', data.user)
            .addParam('card', data.card)
            .addParam('room_id', data.room_id)
            .addParam('new_code', data.new_code);
          this.sender.broadCastInRoom(socket.room_id, sendData);
        },
      )
      .catch((err: any) => {
        sendData.setError(err);
        this.sender.send(socket, sendData);
      });
  };
}

export default ScanQRCodeHandler;
