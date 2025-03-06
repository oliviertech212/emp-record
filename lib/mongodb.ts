import mongoose from "mongoose";
const { MONGODB_URI } = process.env;
export const connectDB = async () => {
  try {
    console.log("Database connected");
    
    const { connection } = await mongoose.connect(MONGODB_URI as string);
    if (connection.readyState === 1) {
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error("error connecting datbase",error);
    return Promise.reject(error);
  }
};