import config from "@/config";
import type { ConnectOptions } from "mongoose";
import mongoose from "mongoose";

const clientOptions: ConnectOptions = {
  dbName: config.MONGO_DB_NAME,
  appName: config.APP_NAME,
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

// Connect to MongoDB
export const connectToDatabase = async () => {
  if (!config.MONGO_DB_URI) {
    throw new Error("MONGO_DB_URI is not defined in the configuration");
  }

  try {
    await mongoose.connect(config.MONGO_DB_URI, clientOptions);
    console.log("Connected to Database Successfully");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    console.error("Error connecting to Database", error);
  }
};

// Disconnect from MongoDB
export const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from Database Successfully");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    console.error("Error disconnecting from Database", error);
  }
};
