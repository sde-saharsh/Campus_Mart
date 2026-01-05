import Order from '../models/order.model.js'
import Item from '../models/item.model.js'
import mongoose from 'mongoose';
import { sendNotification } from "../utils/sendNotification.js";


export const getSellerOrderHistory = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // 🔹 1. Query params
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const { status, from, to } = req.query;

    // 🔹 2. Base filter
    let filter = {
      seller: sellerId,
      // Default: Show ALL statuses unless specified
    };

    // 🔹 3. Status filter
    if (status) {
      filter.status = status;
    }

    // 🔹 4. Date range filter
    if (from || to) {
      filter.updatedAt = {};
      if (from) filter.updatedAt.$gte = new Date(from);
      if (to) filter.updatedAt.$lte = new Date(to);
    }

    // 🔹 5. Query with pagination
    const orders = await Order.find(filter)
      .populate("item", "title price images")
      .populate("buyer", "name email mobileNo")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getBuyerOrderHistory = async (req, res) => {
  try {
    const buyerId = req.user.id;

    // 🔹 1. Read query params
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const { status, from, to } = req.query;

    // 🔹 2. Base filter
    let filter = {
      buyer: buyerId,
      status: { $in: ["COMPLETED", "CANCELLED"] }
    };

    // 🔹 3. Status filter
    if (status) {
      filter.status = status;
    }

    // 🔹 4. Date range filter
    if (from || to) {
      filter.updatedAt = {};
      if (from) filter.updatedAt.$gte = new Date(from);
      if (to) filter.updatedAt.$lte = new Date(to);
    }

    // 🔹 5. Query with pagination
    const orders = await Order.find(filter)
      .populate("item", "title price")
      .populate("seller", "name email")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ buyer: userId })
      .populate("item", "title price images")
      .populate("seller", "name email mobileNo")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const cancelOrder = async(req,res)=>{
    try {
        const {orderId} = req.params;
        const sellerId = req.user.id;

        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({
                success:false,
                message:"Order not found"
            });
        }

        //only seller can confirmed
        if(order.seller.toString()!==sellerId){
             return res.status(403).json({
                success:false,
                message:"not Authorized"
            });
        }

        order.status= "CANCELLED";
        await order.save();

        res.json({success:true,message:"Order confirmed"})
        await sendNotification({
          user: order.buyer,
          title: "Order Cancelled",
          message: "Your order was cancelled",
          meta: { orderId: order._id }
        });

        await sendNotification({
          user: order.seller,
          title: "Order Cancelled",
          message: "An order for your item was cancelled",
          meta: { orderId: order._id }
        });


    } catch (error) {
        res.status(500).json({success:false,messgae:error.message});
    }
}


export const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const sellerId = req.user.id;

    const order = await Order.findById(orderId).populate("item");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // only seller can complete
    if (order.seller.toString() !== sellerId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (order.status !== "CONFIRMED") {
      return res.status(400).json({
        success: false,
        message: "Order must be CONFIRMED first"
      });
    }

    // mark order completed
    order.status = "COMPLETED";
    await order.save();

    // mark item as sold
    await Item.findByIdAndUpdate(order.item._id, {
      isSold: true
    });

    res.json({
      success: true,
      message: "Order completed & item marked as sold"
    });
    await sendNotification({
      user: order.seller,
      title: "Item Sold 🎉",
      message: "Your item has been sold successfully",
      meta: { orderId: order._id }
    });

    await sendNotification({
      user: order.buyer,
      title: "Order Completed",
      message: "You have successfully purchased the item",
      meta: { orderId: order._id }
    });


  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const confirmOrder = async(req,res)=>{
    try {
        const {orderId} = req.params;
        const sellerId = req.user.id;

        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({
                success:false,
                message:"Order not found"
            });
        }

        //only seller can confirmed
        if(order.seller.toString()!==sellerId){
             return res.status(403).json({
                success:false,
                message:"not Authorized"
            });
        }

        order.status= "CONFIRMED";
        await order.save();

        res.json({success:true,message:"Order confirmed"})
        await sendNotification({
          user: order.buyer,
          title: "Order Accepted",
          message: "Seller has accepted your order",
          meta: { orderId: order._id, itemId: order.item }
        });


    } catch (error) {
        res.status(500).json({success:false,messgae:error.message});
    }
}

export const createOrder = async (req, res) => {
    try {
        const buyerId = req.user.id;
        const { itemId } = req.params; 

        // validate objectId
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid item ID"
            });
        }

        // check item exists
        const item = await Item.findById(itemId);
        if (!item || item.isSold) {
            return res.status(400).json({
                success: false,
                message: "Item not found or already sold"
            });
        }

        // prevent self buy
        if (item.seller.toString() === buyerId) {
            return res.status(400).json({
                success: false,
                message: "You cannot buy your own item"
            });
        }

        // create order
        const order = await Order.create({
            buyer: buyerId,
            seller: item.seller,
            item: item._id
        });

        res.status(201).json({
            success: true,
            data: order
        });
        await sendNotification({
          user: item.seller,
          title: "New Order Received",
          message: `Someone wants to buy your item: ${item.title}`,
          meta: { orderId: order._id, itemId: item._id }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await Order.findById(orderId)
            .populate("item")
            .populate("buyer", "name email mobileNo")
            .populate("seller", "name email mobileNo collegeName");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.buyer._id.toString() !== userId && order.seller._id.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


