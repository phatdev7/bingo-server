import generateUID from 'uniqid';
import { SaveOptions } from 'mongoose';
import RoomTicket, { IRoomTicket } from '../models/room_ticket';

export const createTicket: (
  room_id: string,
  title: string,
  key_member: string,
  options?: SaveOptions,
) => Promise<IRoomTicket> = async (room_id, title, key_member, options) => {
  const newTicket = new RoomTicket({
    room_id,
    title,
    key_member,
    sold: [],
    current_code: JSON.stringify({ room_id, uid: generateUID() }),
  });

  return newTicket.save(options);
};
