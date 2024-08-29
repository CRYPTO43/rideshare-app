import mongoose from "mongoose";

const connectMongoDB = async () => {
  
  const uri = "mongodb+srv://uber:Arshjot07@cluster0.ydmsmam.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  try {
    // Connect using mongoose to leverage schemas and models
    await mongoose.connect(uri)
    console.log("Successfully connected to MongoDB Atlas via Mongoose");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectMongoDB;