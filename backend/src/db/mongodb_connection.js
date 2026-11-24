import mongoose from "mongoose";

export const mongoConnect = async () => {
  const atlas = process.env.URI;

  if (!atlas) {
    throw new Error("MongoDB connection URI is missing. Set URI in your .env file.");
  }

  try {
    await mongoose.connect(atlas, {
      dbName: "scazstore",
    });
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};
