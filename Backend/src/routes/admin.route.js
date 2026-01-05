import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { getStats, getAllUsers, deleteUser, getAllItems, deleteItem, getAllOrders, getAnalytics, getReports } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/stats", verifyToken, isAdmin, getStats);
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

router.get("/items", verifyToken, isAdmin, getAllItems);
router.delete("/items/:id", verifyToken, isAdmin, deleteItem);
router.get("/orders", verifyToken, isAdmin, getAllOrders);
router.get("/analytics", verifyToken, isAdmin, getAnalytics);
router.get("/reports", verifyToken, isAdmin, getReports);

export default router;
