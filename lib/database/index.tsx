import { MongooseCache } from "@/types";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const globalWithMongoose = global as typeof global & {
  mongoose: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
};

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "eventsync",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
