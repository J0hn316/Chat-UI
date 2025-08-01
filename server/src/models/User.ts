import bcrypt from 'bcrypt';
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, trim: true },
    passwordConfirmation: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 Hash password before saving
UserSchema.pre('save', async function (next): Promise<void> {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Ensure password confirmation matches the hashed password
  this.passwordConfirmation = this.password;
  next();
});

// 🔍 Compare candidate password with hashed password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model<UserDocument>('User', UserSchema);
export default UserModel;
