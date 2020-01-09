import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  room_id: string;
  key_member: string;
  sale: string[];
  sold: [];
}

const ticketSchema = new Schema({
  room_id: {
    type: String,
    required: true,
  },
  key_member: {
    type: String,
    required: true,
  },
  sale: {
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
    key_member: this.key_member,
    sale: this.sale,
    sold: this.sold,
  };
};

export default mongoose.model<ITicket>('tickets', ticketSchema);
