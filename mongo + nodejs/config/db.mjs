import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MONGO_DB IS CONNECTED!");
  } catch (error) {
    console.log("mongo connection failed");
    process.exit(1); // failed
  }
};

export default connectDB;
