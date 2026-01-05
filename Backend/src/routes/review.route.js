import express from "express";
import { createReview } from "../controllers/review.controller.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.post("/create", verifyToken, createReview);

export default router;
