import { Socket } from 'socket.io';
import SendData from '../SendData';
import AbsHandler, { ISocket, IParams } from './AbsHandler';
import Commands from '../Commands';
import { roomAction } from '../../actions';
import { IRoom } from '../../models/room';
import user, { IUser } from '../../models/user';
import uniqid from 'uniqid';

interface IParams2 extends IParams {
  user_name: string;
}

class CreateRoomHandler extends AbsHandler {
  checkParams = async (params: IParams2) => {
    const { user_name } = params;
    if (!user_name) {
      return 'User_name is required';
    }
    return '';
  };

  doHandleMessage = async (socket: ISocket, params: IParams2, sendData: SendData) => {
    const { user_name } = params;

    roomAction
      .createRoom(user_name)
      .then((_room: IRoom) => {
        if (socket.room_id) socket.leave(socket.room_id);

        socket.room_id = _room._id;
        socket.user = { user_name };
        socket.join(socket.room_id);
        sendData.addParam('user', socket.user).addParam('room', _room);
        this.sender.broadCastInRoom(socket.room_id, sendData);
        // this.sender.broadCastAll(Commands.joinRoomGlobal, sendData);
      })
      .catch(err => {
        sendData.setError(err);
        this.sender.send(socket, sendData);
      });
  };
}

export default CreateRoomHandler;
