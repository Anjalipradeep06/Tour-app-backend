import Notification from "../models/Notification.js";

/* -----------------------------
   Get Notifications
------------------------------*/
export const getNotifications = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const notifications = await Notification.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Notification.countDocuments({
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      count: notifications.length,
      total,
      page,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch notifications",
    });
  }
};

/* -----------------------------
   Get Unread Count
------------------------------*/
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      message: "Unread count fetched successfully",
      unreadCount: count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch unread count",
    });
  }
};

/* -----------------------------
   Mark Single Notification as Read
------------------------------*/
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update notification",
    });
  }
};

/* -----------------------------
   Mark All As Read
------------------------------*/
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update notifications",
    });
  }
};