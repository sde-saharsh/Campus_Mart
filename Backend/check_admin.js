import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user.model.js';

dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const users = await User.find({ role: 'admin' });
    if (users.length > 0) {
      console.log("Admin user(s) found:");
      users.forEach(u => console.log(`- Email: ${u.email}`));
    } else {
      console.log("No admin user found.");
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
};

checkAdmin();
