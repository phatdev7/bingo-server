import AbsHandler from './AbsHandler';
import Game, { IGame } from 'src/actions/game';
import SendData from '../SendData';
import Commands from '../Commands';
import { Dial } from 'src/actions/game';

class CountDownHandler extends AbsHandler {
  constructor() {
    super('');
  }

  async handleDial(game: IGame) {
    let countDown = 10;

    const _interval = setInterval(async () => {
      if (countDown < 0) {
        clearInterval(_interval);

        const _game = await Dial(game._id);

        const _sendData = new SendData(Commands.dialGame);
        _sendData.addParam('game', _game);
        this.sender.broadCastInRoom(_game.room_id, _sendData);

        this.handleDial(_game);
      } else {
        const _sendData = new SendData(Commands.countDownInitGame);
        _sendData.addParam('count_down', countDown);
        this.sender.broadCastInRoom(game.room_id, _sendData);
      }
      countDown -= 1;
    }, 1000);
  }
}

export default new CountDownHandler();
