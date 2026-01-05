import Item from "../models/item.model.js";



const deleteItem = async(req,res)=>{
  try {

    const itemId = req.params.id;
    const userId = req.user.id;

    //find item
    const item = await Item.findById(itemId);
    if(!item){
      return res.status(404).json({
        success:false,
        message:"Item not found"
      })
    }

    //check ownership
    if(item.seller.toString() !== userId){
      return res.status(403).json({
        success:false,
        message:'you are not allowed to delete this'
      })
    }

    await Item.findByIdAndDelete(itemId);
    res.status(200).json({
      success:true,
      message:"item deleted successfully"
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

const createItem = async (req, res) => {
  try {
    const { title, price, description, images, category, subCategory } = req.body;

    // Daily Limit Check
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayItemsCount = await Item.countDocuments({
      seller: req.user.id,
      createdAt: { $gte: startOfDay }
    });

    if (todayItemsCount >= 5) {
      return res.status(400).json({
        success: false,
        message: "You have reached your daily limit of 5 items"
      });
    }

    const item = await Item.create({
      title,
      price,
      description,
      images,
      category,
      subCategory,
      seller: req.user.id
    });

    res.status(201).json({
      success: true,
      data: item
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id)
      .populate("seller", "name collegeName averageRating ratingCount location");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({ isSold: false })
      .populate("seller", "name collegeName averageRating ratingCount location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, description, category, subCategory, images, isSold } = req.body;
    const userId = req.user.id;

    // Find item
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    // Check ownership
    if (item.seller.toString() !== userId) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this item" });
    }

    // Update item
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { title, price, description, category, subCategory, images, isSold },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedItem, message: "Item updated successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createItem,
  getAllItems,
  getItemById,
  deleteItem,
  updateItem
};
