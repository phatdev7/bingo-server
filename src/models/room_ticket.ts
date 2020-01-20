import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user';

export interface IRoomTicket extends Document {
  room_id: string;
  title: string;
  num_of_column: number;
  num_of_row: number;
  num_of_win: number;
  key_member: string;
  tickets: [];
  current_code: string;
}

export interface ICard {
  matrix: number[][];
  num_of_column: number;
  num_of_row: number;
  num_of_win: number;
}

export interface ITicket {
  card: ICard;
  user: IUser;
  current_code: string;
}

export interface ICardSize {
  title: string;
  num_of_column: number;
  num_of_row: number;
  num_of_win: number;
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
  num_of_column: {
    type: Number,
    required: true,
  },
  num_of_row: {
    type: Number,
    required: true,
  },
  num_of_win: {
    type: Number,
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
    num_of_column: this.num_of_column,
    num_of_row: this.num_of_row,
    num_of_win: this.num_of_win,
    key_member: this.key_member,
    tickets: this.tickets,
    current_code: this.current_code,
  };
};

export default mongoose.model<IRoomTicket>('room_tickets', roomTicketSchema);
