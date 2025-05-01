import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection success!");
  } catch (err) {
    const error = err as mongoose.Error;
    console.error("MongoDB connection failed!", error.message);
  }
};

export default connectDB