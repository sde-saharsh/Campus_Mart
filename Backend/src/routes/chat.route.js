import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getChatHistory, getUnreadCount, markMessagesAsRead } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/unread/count", authMiddleware, getUnreadCount);
router.put("/read/:orderId", authMiddleware, markMessagesAsRead);
router.get("/:orderId", authMiddleware, getChatHistory);

export default router;
