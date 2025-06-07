import express from "express";
import {
  createKader,
  deleteKader,
  getAllKaders,
  getKaderById,
  updateKader,
} from "../controller/Kader.controller.js";
import { authentication } from "../middleware/auth.js";

const kaderRouter = express.Router();

kaderRouter.route("/").get(getAllKaders);


// Must Login 

// kaderRouter.use(authentication)

kaderRouter.route("/add").post(createKader);
kaderRouter
  .route("/:id")
  .get(getKaderById)
  .patch(updateKader)
  .delete(deleteKader);

export default kaderRouter;
