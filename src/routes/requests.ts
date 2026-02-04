import express, { Router } from "express";
import { RequestController } from "../controllers/requestController";
import auth, { IAuth, adminPermission } from "../middleware/auth";

const router = Router();

router.post("/", [auth as IAuth], RequestController.createRequest);
router.patch(
  "/manage/statusUpdate",
  [auth as IAuth, adminPermission],
  RequestController.updateRequestStatus
);
router.get(
  "/manage/allRequests",
  [auth as IAuth, adminPermission],
  RequestController.getRequests
);
router.get(
  "/",
  auth as IAuth,
  RequestController.getRequestsByUser
);

export default router;
