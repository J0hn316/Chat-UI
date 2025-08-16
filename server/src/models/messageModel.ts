import mongoose, { Schema, Document } from 'mongoose';

export interface IMessageReaction {
  user: mongoose.Types.ObjectId;
  emoji: string;
}

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  readAt: Date | null;
  reactions: IMessageReaction[];
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    readAt: { type: Date, default: null },
    reactions: {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      emoji: { type: String, required: true },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

messageSchema.index({ _id: 1, 'reactions.user': 1, 'reactions.emoji': 1 });

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
