import SendData from '../SendData';
import AbsHandler, { ISocket, IParams } from './AbsHandler';
import { createGame, Dial } from 'src/actions/game';
import { IGame } from 'src/models/game';
import Commands from '../Commands';
import CountDownHandler from './CountDownHandler';

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

  doHandleMessage = async (
    socket: ISocket,
    params: IParams2,
    sendData: SendData,
  ) => {
    const { user, room_id } = params;

    createGame(user._id, room_id)
      .then((game: IGame) => {
        sendData.addParam('game', game);
        this.sender.broadCastInRoom(socket.room_id, sendData);

        this.handleCountDownInitGame(room_id, game._id, socket, sendData);
      })
      .catch((err: any) => {
        sendData.setError(err);
        this.sender.send(socket, sendData);
      });
  };

  async handleCountDownInitGame(
    roomId: string,
    gameId: string,
    socket: ISocket,
    sendData: SendData,
  ) {
    let countDown = 10;

    const _interval = setInterval(() => {
      if (countDown < 0) {
        clearInterval(_interval);
        Dial(roomId)
          .then(data => {
            const _sendData = new SendData(Commands.dialGame);
            _sendData.addParam('data', data);
            this.sender.broadCastInRoom(roomId, _sendData);

            CountDownHandler.handleDial(roomId);
          })
          .catch(err => {
            // sendData.setError(err);
            // this.sender.send(socket, sendData);
          });
      } else {
        const _sendData = new SendData(Commands.countDownInitGame);
        _sendData.addParam('count_down', countDown);
        this.sender.broadCastInRoom(roomId, _sendData);
      }
      countDown -= 1;
    }, 1000);
  }
}

export default CreateGameHandler;
