import mongoose,{ Schema, model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface User extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  name: string;
  roles: string[]; // ['seller', 'admin']
  avatarUrl?: string;
  storefrontUrl?: string;
  earnings?: number;
  paymentDetails?: any;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>({
  _id: { type: Schema.Types.ObjectId, auto: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  roles: { type: [String], default: ['seller'] },
  avatarUrl: { type: String },
  storefrontUrl: { type: String },
  earnings: { type: Number, default: 0 },
  paymentDetails: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User = model<User>('User', userSchema);