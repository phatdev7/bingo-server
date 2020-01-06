import { Socket } from 'socket.io';
import SendData from '../SendData';
import AbsHandler, { ISocket, IParams } from './AbsHandler';
import Commands from '../Commands';
import { roomAction } from '../../actions';
import { IRoom } from '../../models/room';
import { IUser } from '../../models/user';
import uniqid from 'uniqid';

interface IParams2 extends IParams {
  name: string;
}

class CreateGameHandler extends AbsHandler {
  checkParams = async (params: IParams2) => {
    const { name } = params;
    if (!name) {
      return 'Name is required';
    }
    return '';
  };

  doHandleMessage = async (socket: ISocket, params: IParams2, sendData: SendData) => {
    const { name } = params;

    const uid = uniqid();
    socket.room_id = name;
    socket.join(socket.room_id);
    sendData.addParam('uid', uid).addParam('room', socket.room_id);
    console.log(uid);
    this.sender.broadCastInRoom(socket.room_id, sendData);

    // roomAction.addUserInRoom(room_id, user, (err: string, _room: IRoom) => {
    //   if (err) {
    //     sendData.setError(err);
    //     this.sender.send(socket, sendData);
    //   } else {
    //     if (socket.room_id) socket.leave(socket.room_id);

    //     socket.room_id = _room.id;
    //     socket.user = user;
    //     socket.join(socket.room_id);
    //     sendData.addParam('user', user).addParam('room', _room);
    //     this.sender.broadCastInRoom(room_id, sendData);
    //     // this.sender.broadCastAll(Commands.joinRoomGlobal, sendData);
    //   }
    // });
  };
}

export default CreateGameHandler;
