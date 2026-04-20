import mongoose from "mongoose";

const connectDB = async () => {
  try {
    return await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed");
  }
};

export default connectDB;
