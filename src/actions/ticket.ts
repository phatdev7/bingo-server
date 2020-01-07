import uid from 'uniqid';
import Ticket, { ITicket } from '../models/ticket';

export const createTicket = async (room_id: string) => {
  const tickets = [];
  for (let i = 0; i < 10; i++) {
    tickets.push(uid());
  }

  const newTicket = new Ticket({
    room_id,
    tickets,
    sold: [],
  });

  return newTicket.save();
};

export const getCurrentTicketByRoomId = async (id: string, callback: Function) => {
  Ticket.findOne({ room_id: id }, (err: any, ticket: ITicket) => {
    if (err) {
      callback(err);
    } else {
      const first = ticket.tickets[0] ? ticket.tickets[0] : null;
      callback(null, first);
    }
  });
};
