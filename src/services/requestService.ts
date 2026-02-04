import Request, { IRequest } from "../models/Request";
import { SortOrder } from "mongoose";

const REQUEST_LIMIT = 5;
const DEFAULT_PAGE = 1;

export class RequestService {
  // CREATE NEW REQUEST
  static async createRequest(requestData: Partial<IRequest>) {
    const request = new Request(requestData);
    return await request.save();
  }

  // APPROVE OR REJECT REQUEST
  static async updateRequestStatus(
    requestId: string,
    statusData: { status: string; comment?: string },
  ) {
    if (statusData.status === "APPROVED" || statusData.status === "REJECTED") {
      return await Request.findByIdAndUpdate(
        requestId,
        {
          status: statusData.status,
          rejectionComment: statusData.comment ? statusData.comment : null,
        },
        { new: true },
      );
    }
    return await Request.findById(requestId);
  }

  // GET REQUESTS
  static async getRequests(optionalFilters: {
    userId?: string;
    status?: string;
    type?: string;
    resultsPerPage?: number;
    pageNumber?: number;
    start_date?: string;
    end_date?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const {
      userId,
      status,
      type,
      resultsPerPage = REQUEST_LIMIT,
      pageNumber = DEFAULT_PAGE,
      start_date,
      end_date,
      sortOrder,
    } = optionalFilters;

    const filters: {
      requestor?: string;
      status?: string;
      type?: string;
      createdAt?: {};
    } = {};
    const sort: [string, SortOrder][] = [["", 1]];
    if (userId) filters.requestor = userId;
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (start_date && end_date) {
      const startOfStartDate = new Date(start_date).setHours(0, 0, 0, 0);
      const endOfEndDate = new Date(end_date).setHours(23, 59, 59, 999);
      filters.createdAt = { $gte: startOfStartDate, $lte: endOfEndDate };
    }

    let query = Request.find(filters);
    const documentCount = await Request.countDocuments(filters);

    if (sortOrder) {
      sort[0][0] = "createdAt";
      sort[0][1] = sortOrder === "desc" ? -1 : 1;
      query = query.sort(sort);
    }

    if (resultsPerPage && pageNumber) {
      const skip = (pageNumber - 1) * resultsPerPage;
      query = query.limit(resultsPerPage).skip(skip);
    }

    const requests = await query.populate("requestor").exec();
    return { requests, documentCount };
  }
}
