import AbsHandler from './AbsHandler';
import Game, { IGame } from 'src/models/game';
import SendData from '../SendData';
import Commands from '../Commands';
import { Dial } from 'src/actions/game';

class CountDownHandler extends AbsHandler {
  constructor() {
    super('');
  }

  async handleDial(roomId: string) {
    let countDown = 10;

    const _interval = setInterval(() => {
      if (countDown < 0) {
        clearInterval(_interval);

        Dial(roomId)
          .then(data => {
            const _sendData = new SendData(Commands.dialGame);
            _sendData.addParam('data', data);
            this.sender.broadCastInRoom(roomId, _sendData);

            this.handleDial(roomId);
          })
          .catch(err => {
            const _sendData = new SendData(Commands.dialGame);
            _sendData.addParam('err', err);
            this.sender.broadCastInRoom(roomId, _sendData);
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

export default new CountDownHandler();
