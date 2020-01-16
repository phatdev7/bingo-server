import SendData from '../SendData';
import AbsHandler, { ISocket, IParams } from './AbsHandler';
import { createRoom } from 'src/actions/room';
import {} from 'src/actions/game';
import { IRoom } from 'src/models/room';

interface IParams2 extends IParams {
  room_id: string;
}

class CreateGameHandler extends AbsHandler {
  checkParams = async (params: IParams2) => {
    const { user, room_id } = params;
    if (!user._id) {
      return 'User_id is required';
    } else if (!room_id) {
      return 'Room_id is required';
    }

    return '';
  };

  doHandleMessage = async (socket: ISocket, params: IParams2, sendData: SendData) => {
    const { user, room_id } = params;

    createRoom(user._id, room_id, (err: any, _room: IRoom) => {
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

export default CreateGameHandler;
