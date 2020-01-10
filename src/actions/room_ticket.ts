import uid from 'uniqid';
import { SaveOptions } from 'mongoose';
import RoomTicket, { IRoomTicket } from '../models/room_ticket';

export const getRoomTicket = (room_id: string) => {
  return RoomTicket.findOne({ room_id });
};
