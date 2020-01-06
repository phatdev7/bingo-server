import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  full_name: string;
  hash: string;
  salt: string;
  gender: string;
  birthday: string;
  avatar: string;
  created_at: Date;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    full_name: {
      type: String,
      default: '',
    },
    hash: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      default: '',
    },
    birthday: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { minimize: false },
);

userSchema.methods.toJSON = function() {
  return {
    _id: this._id.toString(),
    email: this.email,
    full_name: this.full_name,
    gender: this.gender,
    birthday: this.birthday,
    avatar: this.avatar,
  };
};

export default mongoose.model<IUser>('users', userSchema);
