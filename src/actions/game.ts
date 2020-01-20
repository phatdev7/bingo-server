import mongoose, { SaveOptions } from 'mongoose';
import shuffle from 'shuffle-array';
import generateUID from 'uniqid';
import Game, { IGame } from 'src/models/game';
import RoomTicket, {
  IRoomTicket,
  ICardSize,
  ITicket,
  ICard,
} from 'src/models/room_ticket';
import Room, { IRoom } from 'src/models/room';

export const createGame = async (user_id: string, room_id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const room = await Room.findById(room_id);

    if (room.status !== 'open') {
      throw 'Room has been started';
    } else if (room.key_member !== user_id) {
      throw 'You are not room owner';
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

      const game = await newGame.save({ session });
      await session.commitTransaction();
      return game.toJSON();
    }
  } catch (err) {
    await session.abortTransaction();
    return Promise.reject(err);
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

export const Dial = async (roomId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!roomId) {
      throw 'Room_id is required';
    } else {
      const game = await Game.findOne({ room_id: roomId });
      const roomTicket = await RoomTicket.findOne({
        room_id: roomId,
      });
      if (!game) {
        throw 'Game not found';
      } else if (!roomTicket) {
        throw 'Room Ticket not found';
      } else if (roomTicket.tickets.length === 0) {
        throw 'Have not tickets';
      } else if (game.pull.length === 0) {
        throw 'Pull length == 0';
      } else {
        const idx = Math.floor(Math.random() * game.pull.length);
        const pull = [
          ...game.pull.slice(0, idx),
          ...game.pull.slice(idx + 1, game.pull.length),
        ];

        const just_announced = game.pull[idx];
        const push = [...game.push, just_announced];

        const _game = await Game.findOneAndUpdate(
          { room_id: roomId },
          {
            pull,
            push,
            just_announced,
          },
          { new: true, session },
        );

        const tickets: ITicket[] = [];
        roomTicket.tickets.forEach((ticket: ITicket) => {
          const card: ICard = JSON.parse(JSON.stringify(ticket.card));
          for (let i = 0; i < card.matrix.length; i++) {
            const cell: any = card.matrix[i][Math.floor(just_announced / 10)];
            if (cell.value === just_announced && cell.status === 'available') {
              cell.status = 'announced';
            }
          }
          tickets.push({ ...ticket, card });
        });

        const _roomTicket = await RoomTicket.findOneAndUpdate(
          { room_id: roomId },
          {
            tickets,
          },
          { new: true, session },
        );

        await session.commitTransaction();
        return { game: _game.toJSON(), room_ticket: _roomTicket.toJSON() };
      }
    }
  } catch (err) {
    await session.abortTransaction();
    return await Promise.reject(err);
  } finally {
    session.endSession();
  }
};
