import SendData from '../SendData';
import AbsHandler, { ISocket, IParams } from './AbsHandler';
import { createRoom } from '../../actions/room';
import { IRoom } from '../../models/room';

interface IParams2 extends IParams {
  title: string;
}

class CreateRoomHandler extends AbsHandler {
  checkParams = async (params: IParams2) => {
    const { user, title } = params;
    if (!user._id) {
      return 'User_id is required';
    } else if (!title) {
      return 'Title is required';
    }

    return '';
  };

  doHandleMessage = async (socket: ISocket, params: IParams2, sendData: SendData) => {
    const { user, title } = params;

    createRoom(user._id, title, (err: any, _room: IRoom) => {
      if (err) {
        sendData.setError(err);
        this.sender.send(socket, sendData);
      } else {
        if (socket.room_id) {
          socket.leave(socket.room_id);
        }
        socket.room_id = _room._id;
        socket.user = user;
        socket.join(socket.room_id);
        sendData.addParam('room', _room);
        this.sender.broadCastInRoom(socket.room_id, sendData);
      }
    });
  };
}

export default CreateRoomHandler;
