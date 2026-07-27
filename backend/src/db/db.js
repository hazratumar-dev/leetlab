import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✔ connect to mongodb");
  } catch (error) {
    console.log("failed connect to mongodb", error);
    process.exit(1);
  }
};

export { connectDB };
