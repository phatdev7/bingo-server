import mongoose, { Schema, Document } from 'mongoose';

export interface IGame extends Document {
  room_id: string;
}

const gameSchema = new Schema({
  room_id: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IGame>('games', gameSchema);
