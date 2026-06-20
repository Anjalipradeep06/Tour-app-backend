import User from "../models/User.js";

/* -----------------------------
   Get All Users (excludes soft-deleted by default)
------------------------------*/
const getAllUsers = async (req, res) => {
  try {
    const includeDeleted = req.query.includeDeleted === "true";

    const filter = includeDeleted ? {} : { isDeleted: false };

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -----------------------------
   Soft Delete User
------------------------------*/
const softDeleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "User is already deactivated",
      });
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -----------------------------
   Restore User
------------------------------*/
const restoreUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "User is not deactivated",
      });
    }

    user.isDeleted = false;
    user.deletedAt = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User restored successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getAllUsers, softDeleteUser, restoreUser };