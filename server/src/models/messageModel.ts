import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  readAt: Date | null;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    readAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
