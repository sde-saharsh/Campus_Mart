import mongoose from "mongoose";

const connectDB = async () => {
  try {
    
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    mongoose.connection.on('error', err => {
      console.log('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    await mongoose.connect(`${process.env.MONGODB_URI}`);

    console.log('Initial connection established.');

  } catch (error) {
    console.log('MongoDB connection failed:', error);
    process.exit(1); 
  }
};



export default connectDB;