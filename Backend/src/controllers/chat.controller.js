import Message from "../models/message.model.js";
import Order from "../models/order.model.js";
import mongoose from "mongoose";

export const getChatHistory = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.buyer.toString() !== userId && order.seller.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const messages = await Message.find({ order: orderId })
            .sort({ createdAt: 1 })
            .populate("sender", "name");

        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const saveChatMessage = async (orderId, senderId, content) => {
    try {
        const order = await Order.findById(orderId);
        if (!order) throw new Error("Order not found");

        if (order.status !== "CONFIRMED" && order.status !== "COMPLETED") {
             throw new Error("Chat is only available for confirmed orders");
        }

        const count = await Message.countDocuments({ order: orderId });
        if (count >= 20) {
            throw new Error("Message limit (20) reached for this order");
        }

        const message = await Message.create({
            order: orderId,
            sender: senderId,
            content
        });

        const populatedMessage = await Message.findById(message._id)
            .populate("sender", "name")
            .populate({
                path: "order",
                select: "buyer seller"
            });
        return populatedMessage;
    } catch (error) {
        throw error;
    }
};
export const markMessagesAsRead = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        await Message.updateMany(
            { order: orderId, sender: { $ne: userId } },
            { $set: { isRead: true } }
        );

        res.json({ success: true, message: "Messages marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new mongoose.Types.ObjectId(userId);
        
        // Find all orders where user is participant
        const orders = await Order.find({
            $or: [{ buyer: userId }, { seller: userId }]
        }).select('_id');
        
        const orderIds = orders.map(o => o._id);

        const unreadMessages = await Message.aggregate([
            {
                $match: {
                    order: { $in: orderIds },
                    sender: { $ne: userObjectId },
                    isRead: false
                }
            },
            {
                $group: {
                    _id: "$order",
                    count: { $sum: 1 },
                    lastMessage: { $last: "$content" },
                    senderId: { $last: "$sender" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "senderId",
                    foreignField: "_id",
                    as: "sender"
                }
            },
            {
                $unwind: "$sender"
            },
            {
                $lookup: { // Also fetch order updates
                     from: "orders",
                     localField: "_id",
                     foreignField: "_id",
                     as: "order"
                }
            },
            {
                $unwind: "$order"
            }
        ]);
        
        // Populate item title for context
        // Note: Aggregation is complex, let's keep it simple for now or populate item.
        // We really just need the sender name and order ID.
        
        const count = unreadMessages.reduce((acc, curr) => acc + curr.count, 0);

        res.json({ 
            success: true, 
            count,
            conversations: unreadMessages.map(c => ({
                orderId: c._id,
                count: c.count,
                senderName: c.sender.name,
                itemTitle: "Order", // Simplification
                lastMessage: c.lastMessage
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
