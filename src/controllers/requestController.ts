import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestService } from "../services/requestService";
import IUserRequest from "../types/requestType";

export class RequestController {
  // CREATE NEW REQUEST
  static async createRequest(req: IUserRequest, res: Response) {
    try {
      const { type, title, description } = req.body;
      const requestor = req.user!._id.toString();
      if (!type || !title || !description) {
        return res.status(StatusCodes.BAD_REQUEST).send();
      }

      const request = await RequestService.createRequest({
        type,
        title,
        description,
        requestor,
      });

      return res.status(StatusCodes.CREATED).json({ request });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error ? error.message : "Failed to create request.",
      });
    }
  }

  // APPROVE OR REJECT REQUEST
  static async updateRequestStatus(req: Request, res: Response) {
    try {
      const { _id, statusData } = req.body;
      const request = await RequestService.updateRequestStatus(_id, statusData);

      if (!request) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Request not found." });
      }

      await request.save();
      res.json({ request });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to update request status.",
      });
    }
  }

  // GET REQUESTS BY USER
  static async getRequestsByUser(req: IUserRequest, res: Response) {
    try {
      const userId = req.user!._id.toString();
      const { requests, documentCount } = await RequestService.getRequests({
        userId,
        ...req.query,
      });

      res.json({ requests, documentCount });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error ? error.message : "Failed to fetch requests.",
      });
    }
  }

  // GET REQUESTS
  static async getRequests(req: Request, res: Response) {
    try {
      const { requests, documentCount } = await RequestService.getRequests(
        req.query,
      );
      res.json({ requests, documentCount });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error ? error.message : "Failed to fetch requests.",
      });
    }
  }
}
