import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  title: string;
  max_member: number;
  current_members: [];
  key_member: string;
  maybe_start: boolean;
  status: string;
}

const roomSchema = new Schema({
  title: {
    type: String,
    default: '',
  },
  max_member: {
    type: Number,
    default: 10,
    required: true,
  },
  current_members: {
    type: Array,
    default: [],
  },
  key_member: {
    type: String,
  },
  maybe_start: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: 'open',
  },
});

roomSchema.methods.toJSON = function() {
  return {
    _id: this._id.toString(),
    title: this.title,
    max_member: this.max_member,
    current_members: this.current_members,
    key_member: this.key_member,
    maybe_start: this.maybe_start,
    status: this.status,
  };
};

export default mongoose.model<IRoom>('rooms', roomSchema);
