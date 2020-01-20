import { Room } from 'src/models';
import { Counter } from 'src/models';
import User, { IUser } from 'src/models/user';
import { createTicket } from './ticket';
import generateUID from 'uniqid';
import mongoose from 'mongoose';
import { IRoom } from 'src/models/room';
import RoomTicket, {
  IRoomTicket,
  ITicket,
  ICardSize,
} from 'src/models/room_ticket';
import { generate } from 'src/actions/card';

interface IParams {
  id: string;
}

const getNextSequenceValue = async () => {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { id: 'room_id' },
    { $inc: { sequence_value: 1 } },
    { new: true },
  );

  return sequenceDocument.sequence_value;
};

const getRooms = () => {
  return Room.find()
    .then(rooms => rooms.map(item => item.toJSON()))
    .catch(err => err);
};

export const getRoomById = async (id: string) => {
  if (!id) {
    return Promise.reject('Room Id is required');
  }
  return await Room.findById(id);
};

export const getCurrenRoom = async (user_id: string) => {
  return Room.find({ key_member: user_id, status: ['open', 'start'] }).exec();
};

export const getRoomByUserIdAndRoomId = async (user_id: string, id: string) => {
  return Room.findOne({ key_member: user_id, _id: id }).exec();
};

export const createRoom = async (
  user_id: string,
  cardSize: ICardSize,
  callback: Function,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await RoomTicket.createCollection();
    const finalRoom = new Room({
      ...cardSize,
      maxMember: 10,
      currentMembers: [],
      key_member: user_id,
      maybe_start: false,
      status: 'open',
    });

    const room = await finalRoom.save();
    const roomJSON = room.toJSON();
    await createTicket(roomJSON._id, cardSize, roomJSON.key_member, {
      session,
    });

    await session.commitTransaction();
    callback(null, room.toJSON());
  } catch (err) {
    await session.abortTransaction();
    callback(err);
  } finally {
    await session.endSession();
  }
};

const updateRoom = async (room_id: string, params: IParams) => {
  try {
    if (!room_id) {
      throw 'Room_id is required';
    }

    const room = await Room.findOneAndUpdate(
      room_id,
      { ...params },
      { new: true },
    )
      .then(room => room.toJSON())
      .catch(err => ({}));
    return room;
  } catch (err) {
    throw err;
  }
};

export const addUserInRoom = async (current_code: string, user: IUser) => {
  const { room_id } = JSON.parse(current_code);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const room: IRoom = await Room.findById(room_id);
    const roomTicket: IRoomTicket = await RoomTicket.findOne({ room_id });

    if (!room) {
      throw 'Room not found';
    } else if (!roomTicket) {
      throw 'Ticket Room not found';
    } else if (
      roomTicket.tickets.find(
        (item: ITicket) => item.current_code === current_code,
      )
    ) {
      throw 'The code was used';
    } else {
      const card = await generate(
        roomTicket.num_of_column,
        roomTicket.num_of_row,
        roomTicket.num_of_win,
      );
      const new_code = JSON.stringify({ room_id, uid: generateUID() });
      await RoomTicket.findOneAndUpdate(
        { room_id },
        {
          tickets: [...roomTicket.tickets, { user, current_code, card }],
          current_code: new_code,
        },
        { new: true, session },
      );

      await Room.findByIdAndUpdate(
        room_id,
        {
          current_members: [
            ...room.current_members.filter(
              (item: IUser) => item._id !== user._id,
            ),
            user,
          ],
        },
        { new: true, session },
      );

      await session.commitTransaction();
      return { card, user, room_id, new_code };
    }
  } catch (err) {
    await session.abortTransaction();
    return Promise.reject(err);
  } finally {
    session.endSession();
  }
};

// const removeUserInRoom = (room_id: string, user: IUser, callback: Function) => {
//   Room.findOne({ id: room_id }, (err, room) => {
//     if (err) {
//       return callback('Room does not exist');
//     } else if (!room.status) {
//       const { current_members } = room.toJSON();
//       const new_current_members = current_members.filter(
//         (item: IUser) => item.email !== user.email,
//       );

//       Room.findOneAndUpdate(
//         { id: room_id },
//         {
//           current_members: new_current_members,
//           maybe_start: getMayBeStart(new_current_members),
//           key_member: new_current_members[0] ? new_current_members[0]._id : '',
//         },
//         { new: true },
//         (err, _room) => {
//           callback(err, _room.toJSON());
//         },
//       );
//     }
//   });
// };

// const userReadyRoom = (room_id: string, user: IUser, callback: Function) => {
//   Room.findOne({ id: room_id }, (err, room) => {
//     if (err) {
//       return callback('Room does not exist');
//     } else if (!room.status) {
//       const { current_members } = room.toJSON();
//       const idx = current_members.findIndex((item: IUser) => item._id === user._id);
//       let new_current_members = [...current_members];

//       if (idx !== -1) {
//         new_current_members = [
//           ...current_members.slice(0, idx),
//           { ...user, is_ready: true },
//           ...current_members.slice(idx + 1, current_members.length),
//         ];
//       }

//       Room.findOneAndUpdate(
//         { id: room_id },
//         {
//           current_members: new_current_members,
//           maybe_start: getMayBeStart(new_current_members),
//           key_member: new_current_members[0] ? new_current_members[0]._id : '',
//         },
//         { new: true },
//         (err, _room) => {
//           callback(err, _room.toJSON());
//         },
//       );
//     }
//   });
// };

// const userCancelRoom = (room_id: string, user: IUser, callback: Function) => {
//   Room.findOne({ id: room_id }, (err, room) => {
//     if (err) {
//       return callback('Room does not exist');
//     } else if (!room.status) {
//       const { current_members } = room.toJSON();
//       const idx = current_members.findIndex((item: IUser) => item._id === user._id);
//       let new_current_members = [...current_members];

//       if (idx !== -1) {
//         new_current_members = [
//           ...current_members.slice(0, idx),
//           { ...user, is_ready: false },
//           ...current_members.slice(idx + 1, current_members.length),
//         ];
//       }

//       Room.findOneAndUpdate(
//         { id: room_id },
//         {
//           current_members: new_current_members,
//           maybe_start: getMayBeStart(new_current_members),
//           key_member: new_current_members[0] ? new_current_members[0]._id : '',
//         },
//         { new: true },
//         (err, _room) => {
//           callback(err, _room.toJSON());
//         },
//       );
//     }
//   });
// };

const startRoom = (room_id: string, callback: Function) => {
  Room.findOne({ id: room_id }, (err, room) => {
    if (err) {
      return callback('Room does not exist');
    } else if (!room.status) {
      Room.findOneAndUpdate(
        { id: room.id },
        { active: true },
        { new: true },
        (err, _room) => {
          callback(err, _room.toJSON());
        },
      );
    }
  });
};

const getMayBeStart = (current_members: any[]) => {
  const maybe_start =
    current_members.length > 1 &&
    current_members
      .filter((item: any, index: number) => index !== 0)
      .findIndex((item: any) => !item.is_ready) === -1;

  return maybe_start;
};
