import { Schema, model, Document } from 'mongoose';

export interface User extends Document {
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