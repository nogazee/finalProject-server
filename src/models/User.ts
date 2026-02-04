import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  personalNumber: Number;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  tokens: { token: string }[];
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  personalNumber: {
    type: Number,
    required: true,
    trim: true,
    unique: true,
    minlength: 7,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
  },
  role: {
    type: String,
    default: "USER"
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.tokens;
  return userObj;
};

UserSchema.pre("save", async function () {
  const user = this;
  const saltRounds = 8;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
});

export default mongoose.model("User", UserSchema);
