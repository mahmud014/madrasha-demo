import { Schema, model, models, Document } from "mongoose";

export interface IMessage extends Document {
  name: string;
  contact: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = models.messages || model<IMessage>("messages", MessageSchema);

export default Message;
