import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export class UserService {
  // CREATE NEW USER
  static async createUser(userData: Partial<IUser>) {
    const existingUser = await User.exists({
      email: userData.email,
    });

    if (existingUser) {
      throw new Error("A user with this email already exists.");
    }

    const user = new User(userData);
    return await user.save();
  }

  // UPDATE USER
  static async updateUser(userId: string, updates: Partial<IUser>) {
    return await User.findByIdAndUpdate(userId, updates, { new: true });
  }

  // GENERATE AUTH TOKEN
  static async generateAuthToken(userId: string) {
    const user = await User.findById(userId);
    if (user) {
      const token = jwt.sign(
        {
          _id: user._id.toString(),
          user: {
            role: user.role,
          },
        },
        process.env.JWT_SECRET!,
      );

      user.tokens = user.tokens.concat({ token });
      await user.save();

      return token;
    }
    return;
  }

  // FIND USER BY CREDENTIALS
  static async findByCredentials(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return user;
  }
}
