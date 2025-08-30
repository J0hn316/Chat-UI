import bcrypt from 'bcrypt';
import crypto from 'crypto';
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  passwordChangedAt?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  lastSeen?: Date | null;
  comparePassword(password: string): Promise<boolean>;
  createPasswordRestToken(): { rawToken: string; expiresAt: Date };
}

const UserSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    lastSeen: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
      select: false,
    },
    passwordChangedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// 🔐 Hash password before saving
UserSchema.pre('save', async function (next): Promise<void> {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordChangedAt = new Date();
  next();
});

// 🔍 Compare candidate password with hashed password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.createPasswordRestToken = function (): {
  rawToken: string;
  expiresAt: Date;
} {
  // 32-byte random token, hex-encoded
  const rawToken = crypto.randomBytes(32).toString('hex');
  // Store only a hash in DB
  const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');

  const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 mins

  this.resetPasswordToken = hashed;
  this.resetPasswordExpires = expiresAt;

  return { rawToken, expiresAt };
};

const UserModel = mongoose.model<UserDocument>('User', UserSchema);
export default UserModel;
