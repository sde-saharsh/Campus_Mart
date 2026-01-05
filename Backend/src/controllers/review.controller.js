import Review from "../models/review.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

export const createReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validate Input
    if (!orderId || !rating) {
      return res.status(400).json({ message: "Order ID and Rating are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Find Order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verification
    if (order.buyer.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to review this order" });
    }
    if (order.status !== "COMPLETED") {
      return res.status(400).json({ message: "Order must be completed before reviewing" });
    }
    if (order.isReviewed) {
      return res.status(400).json({ message: "This order has already been reviewed" });
    }

    // Create Review
    const review = new Review({
      reviewer: userId,
      reviewedUser: order.seller,
      order: orderId,
      rating,
      comment
    });
    await review.save();

    // Update Order
    order.isReviewed = true;
    await order.save();

    // Update Seller's Rating Stats
    const seller = await User.findById(order.seller);
    if (seller) {
      const totalRating = (seller.averageRating * seller.ratingCount) + rating;
      const newCount = seller.ratingCount + 1;
      seller.averageRating = totalRating / newCount;
      seller.ratingCount = newCount;
      await seller.save();
    }

    res.status(201).json({ message: "Review submitted successfully", data: review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
