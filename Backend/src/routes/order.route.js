import express from "express";
import  authMiddleware  from "../middleware/auth.js";
import {
  createOrder,
  confirmOrder,
  cancelOrder,
  completeOrder,
  getMyOrders,
  getBuyerOrderHistory,
  getSellerOrderHistory,
  getOrderDetails
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/my", authMiddleware, getMyOrders);
router.get("/history", authMiddleware, getBuyerOrderHistory);
router.get("/sold", authMiddleware, getSellerOrderHistory);
router.get("/details/:orderId", authMiddleware, getOrderDetails);

router.post("/:itemId", authMiddleware, createOrder);
router.patch("/:orderId/confirm", authMiddleware, confirmOrder);
router.patch("/:orderId/cancel", authMiddleware, cancelOrder);
router.patch("/:orderId/complete", authMiddleware, completeOrder);

export default router;
