import mongoose, { Schema, Document } from 'mongoose';

export interface IGame extends Document {
  room_id: string;
  pull: number[];
  push: number[];
  just_announced: number;
  winner: string;
  win_numbers: number[];
}

const gameSchema = new Schema({
  room_id: {
    type: String,
    required: true,
  },
  pull: {
    type: Array,
    defalt: [],
  },
  push: {
    type: Array,
    default: [],
  },
  just_announced: {
    type: Number,
    default: 0,
  },
  winner: {
    type: String,
  },
  win_numbers: {
    type: Array,
    default: [],
  },
});

gameSchema.methods.toJSON = function() {
  return {
    _id: this._id.toString(),
    room_id: this.room_id,
    pull: this.pull,
    push: this.push,
    just_announced: this.just_announced,
    winner: this.winner,
    win_numbers: this.win_numbers,
  };
};

export default mongoose.model<IGame>('games', gameSchema);
