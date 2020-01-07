import { Socket } from 'socket.io';
import SendData from '../SendData';
import AbsHandler, { ISocket, IParams } from './AbsHandler';
import Commands from '../Commands';
import { createRoom } from '../../actions/room';
import { IRoom } from '../../models/room';
import user, { IUser } from '../../models/user';

interface IParams2 extends IParams {
  token: string;
  title: string;
}

class CreateRoomHandler extends AbsHandler {
  checkParams = async (params: IParams2) => {
    const { token, title } = params;
    if (!token) {
      return 'Token is required';
    } else if (!title) {
      return 'Title is required';
    }
    return '';
  };

  doHandleMessage = async (socket: ISocket, params: IParams2, sendData: SendData) => {
    const { token, title } = params;

    createRoom(token, title, (err: any, _room: IRoom) => {
      if (err) {
        sendData.setError(err);
        this.sender.send(socket, sendData);
      } else {
        if (socket.room_id) {
          socket.leave(socket.room_id);
        }
        socket.room_id = _room._id;
        socket.user = { token };
        socket.join(socket.room_id);
        sendData.addParam('token', socket.user.token).addParam('room', _room);
        this.sender.broadCastInRoom(socket.room_id, sendData);
      }
    });
  };
}

export default CreateRoomHandler;
