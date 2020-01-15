import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user';

export interface IRoomTicket extends Document {
  room_id: string;
  title: string;
  key_member: string;
  tickets: [];
  current_code: string;
}

export interface ICard {
  card: [];
  user: IUser;
  current_code: string;
}

const roomTicketSchema = new Schema({
  room_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  key_member: {
    type: String,
    required: true,
  },
  tickets: {
    type: Array,
    default: [],
  },
  current_code: {
    type: String,
    required: true,
  },
});

roomTicketSchema.methods.toJSON = function() {
  return {
    _id: this._id.toString(),
    room_id: this.room_id,
    title: this.title,
    key_member: this.key_member,
    tickets: this.tickets,
    current_code: this.current_code,
  };
};

export default mongoose.model<IRoomTicket>('room_tickets', roomTicketSchema);
