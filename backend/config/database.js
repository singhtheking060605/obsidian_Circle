import mongoose from "mongoose";

export const dbConnection = () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI is not defined in .env");
    return;
  }

  mongoose
    .connect(uri, {
      dbName: "obsidian_circle",
    })
    .then((c) => {
      console.log(`Database connected to ${c.connection.host}`);
    })
    .catch((e) => {
      console.error(`Database connection error: ${e.message}`);
    });
};
