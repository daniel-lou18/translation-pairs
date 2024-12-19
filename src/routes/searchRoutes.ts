import { Router } from "express";
import * as searchController from "@/controllers/searchController";

const router = Router();

router
  .route("/")
  .post(searchController.loadSourceEmbeddings)
  .get(searchController.search);

export default router;
