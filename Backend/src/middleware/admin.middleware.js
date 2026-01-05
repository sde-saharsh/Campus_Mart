import User from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id; // Provided by verifyToken middleware
    const user = await User.findById(userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
