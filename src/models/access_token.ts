import mongoose, { Schema, Document } from 'mongoose';

export interface IAccessToken extends Document {
  token: string;
  avatar: string;
  created_at: Date;
}

const accessTockenSchema = new Schema({
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

accessTockenSchema.methods.toJSON = function() {
  return {
    _id: this._id.toString(),
    token: this.token,
    avatar: this.avatar,
    created_at: this.created_at,
  };
};

export default mongoose.model<IAccessToken>('access_tokens', accessTockenSchema);
