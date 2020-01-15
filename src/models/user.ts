import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  token: string;
  avatar?: string;
  created_at?: Date;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.toJSON = function() {
  return {
    _id: this._id.toString(),
    name: this.name,
    token: this.token,
    avatar: this.avatar,
    created_at: this.created_at,
  };
};

export default mongoose.model('users', userSchema);
