import User from "../models/User";
import { Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import IUserRequest from "../types/requestType";

export interface IAuth extends RequestHandler {
  req: IUserRequest;
}

const auth = async (req: IUserRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")!.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: error instanceof Error ? error.message : "Please authenticate.",
    });
  }
};

export const adminPermission = (
  req: IUserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user!.role === "USER") {
      res.status(StatusCodes.UNAUTHORIZED).send();
    }
    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).send();
  }
};

export default auth;
