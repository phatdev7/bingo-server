import SendData from '../SendData';
import AbsHandler, { ISocket, IParams } from './AbsHandler';
import { createRoom } from 'src/actions/room';
import { IRoom } from 'src/models/room';
import { ICardSize } from 'src/models/room_ticket';

interface IParams2 extends IParams {
  cardSize: ICardSize;
}

class CreateRoomHandler extends AbsHandler {
  checkParams = async (params: IParams2) => {
    const { user, cardSize } = params;
    if (!user._id) {
      return 'User_id is required';
    } else if (!cardSize.title) {
      return 'Title is required';
    } else if (!cardSize.num_of_column) {
      return 'num_of_column is required';
    } else if (!cardSize.num_of_row) {
      return 'num_of_row is required';
    } else if (!cardSize.num_of_win) {
      return 'num_of_win is required';
    }

    return '';
  };

  doHandleMessage = async (
    socket: ISocket,
    params: IParams2,
    sendData: SendData,
  ) => {
    const { user, cardSize } = params;

    createRoom(user._id, cardSize, (err: any, _room: IRoom) => {
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
