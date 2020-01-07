import { Room } from '../models';
import { Counter } from '../models';
import { IUser } from '../models/user';
import { createTicket } from './ticket';
import uid from 'uniqid';

interface IParams {
  id: string;
}

interface IBody {
  name: string;
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

const getRoomById = (params: IParams, callback: Function) => {
  if (!params.id) {
    return callback({ status: 405, msg: 'Id is required' });
  }
  return Room.findOne({ id: params.id }, (err, room) => {
    if (err) {
      return callback({ status: 405, msg: 'Room does not exist}' });
    }
    return callback(null, room.toJSON());
  });
};

export const getCurrenRoomByToken = async (token: string) => {
  return Room.find({ key_member: token, status: ['open', 'start'] }).exec();
};

export const getRoomByTokenAndRoomId = async (token: string, id: string) => {
  return Room.findOne({ key_member: token, _id: id }).exec();
};

export const createRoom = async (token: string, title: string, callback: Function) => {
  const finalRoom = new Room({
    title,
    key_member: token,
    maxMember: 10,
    currentMembers: [],
    maybe_start: false,
  });

  finalRoom
    .save()
    .then(async room => {
      room.toJSON();
      await createTicket(room.toJSON()._id);
      callback(null, room.toJSON());
    })
    .catch(err => {
      callback(err);
    });
};

const updateRoom = async (room_id: string, params: IParams) => {
  try {
    if (!room_id) {
      throw 'Room_id is required';
    }

    const room = await Room.findOneAndUpdate(room_id, { ...params }, { new: true })
      .then(room => room.toJSON())
      .catch(err => ({}));
    return room;
  } catch (err) {
    throw err;
  }
};

const addUserInRoom = (room_id: string, token: string, callback: Function) => {
  Room.findOne({ id: room_id }, (err, room) => {
    if (err) {
      return callback('Room does not exist');
    } else if (!room.status) {
      const { current_members } = room.toJSON();
      const idx = current_members.findIndex((item: IUser) => item._id === token || '');
      let new_current_members = [...current_members];

      if (idx === -1) {
        new_current_members.push(token);
      } else {
        new_current_members = [
          ...current_members.slice(0, idx),
          token,
          ...current_members.slice(idx + 1, current_members.length),
        ];
      }

      Room.findOneAndUpdate(
        { id: room_id },
        {
          current_members: new_current_members,
          maybe_start: getMayBeStart(new_current_members),
          key_member: new_current_members[0] ? new_current_members[0]._id : '',
        },
        { new: true },
        (err, _room) => {
          callback(err, _room.toJSON());
        },
      );
    }
  });
};

const removeUserInRoom = (room_id: string, user: IUser, callback: Function) => {
  Room.findOne({ id: room_id }, (err, room) => {
    if (err) {
      return callback('Room does not exist');
    } else if (!room.status) {
      const { current_members } = room.toJSON();
      const new_current_members = current_members.filter(
        (item: IUser) => item.email !== user.email,
      );

      Room.findOneAndUpdate(
        { id: room_id },
        {
          current_members: new_current_members,
          maybe_start: getMayBeStart(new_current_members),
          key_member: new_current_members[0] ? new_current_members[0]._id : '',
        },
        { new: true },
        (err, _room) => {
          callback(err, _room.toJSON());
        },
      );
    }
  });
};

const userReadyRoom = (room_id: string, user: IUser, callback: Function) => {
  Room.findOne({ id: room_id }, (err, room) => {
    if (err) {
      return callback('Room does not exist');
    } else if (!room.status) {
      const { current_members } = room.toJSON();
      const idx = current_members.findIndex((item: IUser) => item._id === user._id);
      let new_current_members = [...current_members];

      if (idx !== -1) {
        new_current_members = [
          ...current_members.slice(0, idx),
          { ...user, is_ready: true },
          ...current_members.slice(idx + 1, current_members.length),
        ];
      }

      Room.findOneAndUpdate(
        { id: room_id },
        {
          current_members: new_current_members,
          maybe_start: getMayBeStart(new_current_members),
          key_member: new_current_members[0] ? new_current_members[0]._id : '',
        },
        { new: true },
        (err, _room) => {
          callback(err, _room.toJSON());
        },
      );
    }
  });
};

const userCancelRoom = (room_id: string, user: IUser, callback: Function) => {
  Room.findOne({ id: room_id }, (err, room) => {
    if (err) {
      return callback('Room does not exist');
    } else if (!room.status) {
      const { current_members } = room.toJSON();
      const idx = current_members.findIndex((item: IUser) => item._id === user._id);
      let new_current_members = [...current_members];

      if (idx !== -1) {
        new_current_members = [
          ...current_members.slice(0, idx),
          { ...user, is_ready: false },
          ...current_members.slice(idx + 1, current_members.length),
        ];
      }

      Room.findOneAndUpdate(
        { id: room_id },
        {
          current_members: new_current_members,
          maybe_start: getMayBeStart(new_current_members),
          key_member: new_current_members[0] ? new_current_members[0]._id : '',
        },
        { new: true },
        (err, _room) => {
          callback(err, _room.toJSON());
        },
      );
    }
  });
};

const startRoom = (room_id: string, callback: Function) => {
  Room.findOne({ id: room_id }, (err, room) => {
    if (err) {
      return callback('Room does not exist');
    } else if (!room.status) {
      Room.findOneAndUpdate({ id: room.id }, { active: true }, { new: true }, (err, _room) => {
        callback(err, _room.toJSON());
      });
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
