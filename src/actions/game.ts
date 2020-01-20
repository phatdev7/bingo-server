import mongoose, { SaveOptions } from 'mongoose';
import shuffle from 'shuffle-array';
import generateUID from 'uniqid';
import { SaveOptions } from 'mongoose';
import Game, { IGame } from 'src/models/game';
import RoomTicket, { IRoomTicket, ICardSize } from 'src/models/room_ticket';
import Room, { IRoom } from 'src/models/room';

export const createGame = async (
  user_id: string,
  room_id: string,
  callback: Function,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const room = await Room.findById(room_id);

    if (room.status !== 'open') {
      await session.abortTransaction();
      callback('Room has been started');
    } else if (room.key_member !== user_id) {
      await session.abortTransaction();
      callback('You are not room owner');
    } else {
      await Room.findByIdAndUpdate(
        room_id,
        { status: 'start' },
        { new: true, session },
      );
      const pull = [...Array(room.num_of_column * 10 + 1).keys()].slice(1);
      const newGame = new Game({
        room_id,
        pull: shuffle(pull),
        push: [],
      });

      await newGame.save({ session });
      await session.commitTransaction();
    }
  } catch (err) {
    await session.abortTransaction();
    callback(err);
  } finally {
    session.endSession();
  }
};

export const updateGame = async (
  gameId: string,
  params: any,
  options?: SaveOptions,
) => {
  try {
    if (!gameId) {
      throw 'Game_id is required';
    } else {
      return Game.findByIdAndUpdate(gameId, { ...params }, options);
    }
  } catch (err) {
    throw err;
  }
};

export const Dial = async (gameId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!gameId) {
      return Promise.reject('Game_id is required');
    } else {
      const game = await Game.findById(gameId);
      if (!game) {
        return Promise.reject('Game not found');
      } else {
        const idx = Math.floor(Math.random() * game.pull.length);
        const pull = [
          ...game.pull.slice(0, idx),
          ...game.pull.slice(idx + 1, game.pull.length),
        ];

        const just_announced = game.pull[idx];
        const push = [...game.push, just_announced];

        const _game = await Game.findByIdAndUpdate(
          gameId,
          {
            pull,
            push,
            just_announced,
          },
          { new: true, session },
        );

        await session.commitTransaction();
        return _game.toJSON();
      }
    }
  } catch (err) {
    await session.abortTransaction();
    return Promise.reject(err);
  } finally {
    session.endSession();
  }
};
