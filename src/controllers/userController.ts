import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "../services/userService";
import IUserRequest from "../types/requestType";

export class UserController {
  // CREATE NEW USER
  static async createUser(req: Request, res: Response) {
    try {
      const { name, personalNumber, email, password } = req.body;
      if (!name || !email || !personalNumber || !password) {
        return res.status(StatusCodes.BAD_REQUEST).send();
      }

      const user = await UserService.createUser({
        name,
        personalNumber,
        email,
        password,
      });

      const token = await UserService.generateAuthToken(user._id.toString());
      return res.status(StatusCodes.CREATED).json({ user, token });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "A user with this email already exists."
      ) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: error.message });
      }

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error ? error.message : "Failed to create user.",
      });
    }
  }

  // UPDATE USER
  static async updateUser(req: IUserRequest, res: Response) {
    try {
      const { name, personalNumber, email } = req.body;
      const updates: Partial<{
        email: string;
        name: string;
        personalNumber: number;
      }> = {};

      if (name) updates.name = name;
      if (personalNumber) updates.personalNumber = personalNumber;
      if (email) updates.email = email;

      const user = await UserService.updateUser(
        req.user!._id.toString(),
        updates,
      );

      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "User not found." });
      }

      await user.save();
      res.json({ user });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error ? error.message : "Failed to update user.",
      });
    }
  }

  // LOGIN
  static async login(req: Request, res: Response) {
    try {
      const user = await UserService.findByCredentials(
        req.body.email,
        req.body.password,
      );
      const token = await UserService.generateAuthToken(user._id.toString());
      res.send({ user, token });
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid credentials") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: error.message });
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Failed to login.",
      });
    }
  }

  // LOGOUT
  static async logout(req: IUserRequest, res: Response) {
    try {
      const user = req.user!;
      user.tokens = user.tokens.filter((token: { token: string }) => {
        return token.token !== req.token;
      });
      await user.save();
      res.send();
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error instanceof Error ? error.message : "Failed to logout.",
      });
    }
  }

  // GET LOGGED USER
  static async getProfile(req: IUserRequest, res: Response) {
    res.send(req.user);
  }
}
