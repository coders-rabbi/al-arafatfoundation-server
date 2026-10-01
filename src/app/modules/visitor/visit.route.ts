import express from "express";
import { visitControllers } from "./visit.controller";
import optionalAuth from "../../middleware/optionalAuth";
const router = express.Router();

router.post("/track", optionalAuth(), visitControllers.trackVisitController);
router.get("/stats", visitControllers.getTrafficStatsController);

export const visitRouters = router;