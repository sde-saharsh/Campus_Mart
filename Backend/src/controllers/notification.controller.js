import Notification from "../models/notification.model.js";




export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false
    });

    res.json({
      success: true,
      unreadCount: count
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyNotifications = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({
      user: req.user.id
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({
      user: req.user.id
    });

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      data: notifications
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification || notification.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

