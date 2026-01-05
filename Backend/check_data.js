import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './src/models/item.model.js';
import User from './src/models/user.model.js';
import Order from './src/models/order.model.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    const itemCount = await Item.countDocuments();
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    
    console.log("--- DATA COUNTS ---");
    console.log(`Items: ${itemCount}`);
    console.log(`Users: ${userCount}`);
    console.log(`Orders: ${orderCount}`);
    
    if (itemCount > 0) {
        const items = await Item.find().limit(3);
        console.log("Sample Items:", JSON.stringify(items, null, 2));
    }
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();
