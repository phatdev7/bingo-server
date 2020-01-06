import mongoose, { Schema, Document } from 'mongoose';

export interface ICouter extends Document {
  id: string;
  sequence_value: number;
}

const roomCouterSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
  },
  sequence_value: {
    type: Number,
    default: 0,
    required: true,
  },
});

export default mongoose.model<ICouter>('counters', roomCouterSchema);
