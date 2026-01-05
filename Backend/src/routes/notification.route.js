import express from "express";
import { getMyNotifications, markAsRead,getUnreadCount } from "../controllers/notification.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get('/unread-count',authMiddleware,getUnreadCount);
router.get("/", authMiddleware, getMyNotifications);
router.patch("/:id/read", authMiddleware, markAsRead);

export default router;
