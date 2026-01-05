import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["ORDER", "SYSTEM"],
      default: "ORDER"
    },

    isRead: {
      type: Boolean,
      default: false
    },

    meta: {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
      },
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
