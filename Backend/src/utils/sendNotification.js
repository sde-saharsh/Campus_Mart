import Notification from "../models/notification.model.js";

export const sendNotification = async ({
  user,
  title,
  message,
  meta = {}
}) => {
  try {
    await Notification.create({
      user,
      title,
      message,
      meta
    });
  } catch (error) {
    console.error("Notification error:", error.message);
  }
};
