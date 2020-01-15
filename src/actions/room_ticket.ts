import RoomTicket, { IRoomTicket } from 'src/models/room_ticket';

export const getRoomTicket = (room_id: string) => {
  return RoomTicket.findOne({ room_id });
};
