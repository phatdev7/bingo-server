import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  room_id: string;
  tickets: string[];
  sold: [];
}

const ticketSchema = new Schema({
  room_id: {
    type: String,
    required: true,
  },
  tickets: {
    type: Array,
    default: [],
  },
  sold: {
    type: Array,
    default: [],
  },
});

ticketSchema.methods.toJSON = function() {
  return {
    _id: this._id.toString(),
    room_id: this.room_id,
    tickets: this.tickets,
    sold: this.sold,
  };
};

export default mongoose.model<ITicket>('tickets', ticketSchema);
