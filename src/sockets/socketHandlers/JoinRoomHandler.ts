import SendData from '../SendData';
import AbsHandler, { ISocket, IParams } from './AbsHandler';
import { getRoomById } from 'src/actions/room';
import { IRoom } from 'src/models/room';

class JoinRoomHandler extends AbsHandler {
  checkParams = async (params: IParams) => {
    const { room_id, user } = params;
    if (!room_id) {
      return 'Room_id is required';
    } else if (!user) {
      return 'User is required';
    }
    return '';
  };

  doHandleMessage = async (
    socket: ISocket,
    params: IParams,
    sendData: SendData,
  ) => {
    const { room_id, user } = params;

    getRoomById(room_id)
      .then((room: IRoom) => {
        if (socket.room_id) {
          socket.leave(socket.room_id);
        }
        socket.room_id = room_id;
        socket.user = user;
        socket.join(socket.room_id);

        sendData.addParam('room', room);
        this.sender.broadCastInRoom(socket.room_id, sendData);
      })
      .catch((err: any) => {
        sendData.setError(err);
        this.sender.send(socket, sendData);
      });
  };
}

export default JoinRoomHandler;
