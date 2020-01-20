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

    createGame(user._id, room_id, (err: any, game: IGame) => {
      if (err) {
        sendData.setError(err);
        this.sender.send(socket, sendData);
      } else {
        sendData.addParam('game', game);
        this.sender.broadCastInRoom(socket.room_id, sendData);

        this.handleCountDownInitGame(room_id, game._id);
      }
    });
  };

  async handleCountDownInitGame(room_id, game_id) {
    let countDown = 10;

    const _interval = setInterval(async () => {
      if (countDown < 0) {
        clearInterval(_interval);

        const game = await Dial(game_id);

        const _sendData = new SendData(Commands.dialGame);
        _sendData.addParam('game', game);
        this.sender.broadCastInRoom(room_id, _sendData);

        CountDownHandler.handleDial(game);
      } else {
        const _sendData = new SendData(Commands.countDownInitGame);
        _sendData.addParam('count_down', countDown);
        this.sender.broadCastInRoom(room_id, _sendData);
      }
      countDown -= 1;
    }, 1000);
  }
}

export default CreateGameHandler;
