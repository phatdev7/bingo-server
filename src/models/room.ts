import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  max_member: number;
  current_members: [];
  key_member: string;
  maybe_start: boolean;
  active: boolean;
}

const roomSchema = new Schema({
  name: {
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
  active: {
    type: Boolean,
    default: false,
  },
});

roomSchema.methods.toJSON = function() {
  return {
    _id: this._id.toString(),
    name: this.name,
    max_member: this.max_member,
    current_members: this.current_members,
    key_member: this.key_member,
    maybe_start: this.maybe_start,
    active: this.active,
  };
};

export default mongoose.model<IRoom>('rooms', roomSchema);
