import express from "express";
import "../config/db/mongoose";
import requestRouter from "./routes/requests";
import userRouter from "./routes/users";
import cors from "cors";

const app = express();
const port = process.env.PORT;
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/requests", requestRouter);
app.use("/users", userRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
