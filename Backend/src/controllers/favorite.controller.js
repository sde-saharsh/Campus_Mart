import User from "../models/user.model.js";
import Item from "../models/item.model.js";



export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    const user = await User.findById(userId);
    const isFavorite = user.favorites.includes(itemId);

    if (isFavorite) {
      await User.findByIdAndUpdate(userId, {
        $pull: { favorites: itemId }
      });

      return res.status(200).json({
        success: true,
        message: "Removed from favorites"
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { favorites: itemId }
      });

      return res.status(200).json({
        success: true,
        message: "Added to favorites"
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const getFavorite = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate("favorites");

    res.status(200).json({
      success: true,
      length:user.favorites.length,
      data: user.favorites
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
