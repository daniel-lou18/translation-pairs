import { Router } from "express";
import * as searchController from "@/controllers/searchController";

const router = Router();

router.get("/", searchController.getMatches);

export default router;