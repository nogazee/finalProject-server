import mongoose, { Schema, Document } from "mongoose";

export interface IRequest extends Document {
  type: string;
  status: "APPROVED" | "REJECTED" | "PENDING";
  title: string;
  description: string;
  requestor: Schema.Types.ObjectId | string;
}

const RequestSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "PENDING",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    requestor: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rejectionComment: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Request", RequestSchema);
