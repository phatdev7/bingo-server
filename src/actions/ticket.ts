import uid from 'uniqid';
import Ticket, { ITicket } from '../models/ticket';

export const createTicket = async (room_id: string, key_member: string) => {
  const sale = [];
  for (let i = 0; i < 10; i++) {
    const ticket = { room_id, uid: uid() };
    sale.push(JSON.stringify(ticket));
  }

  const newTicket = new Ticket({
    room_id,
    key_member,
    sale,
    sold: [],
  });

  return newTicket.save();
};

export const getCurrentTicketByRoomId = async (id: string, callback: Function) => {
  Ticket.findOne({ room_id: id }, (err: any, ticket: ITicket) => {
    if (err) {
      callback(err);
    } else {
      const first = ticket.sale[0] ? ticket.sale[0] : null;
      callback(null, first);
    }
  });
};
