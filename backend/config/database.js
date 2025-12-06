import mongoose from "mongoose";

export const connectDatabase = () => {
  // Check both possible variable names
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  
  if (!uri) {
    console.error(' MONGO_URI or MONGODB_URI is not defined in environment variables');
    console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO')));
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  // console.log('URI found:', uri.substring(0, 20) + '...');
  
  mongoose
    .connect(uri, {
      dbName: "obsidian_circle",
    })
    .then((c) => {
      console.log(`✅ Database connected to ${c.connection.host}`);
    })
    .catch((e) => {
      console.error('❌ Database connection error:', e.message);
      process.exit(1);
    });
};