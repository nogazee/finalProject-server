import { Request } from "express";
import { IUser } from "../models/User";

interface IUserRequest extends Request {
  user?: IUser;
  token?: string;
}

export default IUserRequest;
