import mongoose from "mongoose";

const connectionURI = process.env.MONGODB_URL;

mongoose.connect(connectionURI!);
