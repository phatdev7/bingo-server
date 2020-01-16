import generateUID from 'uniqid';
import { SaveOptions } from 'mongoose';
import RoomTicket, { IRoomTicket, ICardSize } from 'src/models/room_ticket';

export const createTicket: (
  room_id: string,
  cardSize: ICardSize,
  key_member: string,
  options?: SaveOptions,
) => Promise<IRoomTicket> = async (room_id, cardSize, key_member, options) => {
  const newTicket = new RoomTicket({
    room_id,
    key_member,
    sold: [],
    ...cardSize,
    current_code: JSON.stringify({ room_id, uid: generateUID() }),
  });

  return newTicket.save(options);
};
