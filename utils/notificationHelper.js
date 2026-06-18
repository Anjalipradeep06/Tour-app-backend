import Notification from "../models/Notification.js";

export const createNotification = async (userId, title, message) => {
  try {
    if (!userId) {
      throw new Error("Missing userId in createNotification");
    }

    const notification = await Notification.create({
      user: userId,
      title,
      message,
      isRead: false,
    });

    console.log("📢 Notification created:", notification._id);

    return notification;
  } catch (error) {
    console.error("❌ Notification Error:", error.message);
  }
};