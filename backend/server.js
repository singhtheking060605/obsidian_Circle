import "./config/env.js";
import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";

// Load from config.env in current directory
dotenv.config({ path: './config.env' });


// console.log(' Environment Loading Debug:');
// console.log('Working Directory:', process.cwd());
// console.log('Available env vars:', Object.keys(process.env).filter(k => 
//   k.includes('MONGO') || k.includes('PORT')
// ));

// Check for MONGO_URI
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
// if (!mongoUri) {
//   console.error('\n ERROR: MONGO_URI or MONGODB_URI not found!');
//   console.error('Please check:');
//   console.error('1. .env or config.env file exists in project root');
//   console.error('2. File contains: MONGO_URI=your_mongodb_connection_string');
//   console.error('3. No extra spaces or quotes around the value\n');
//   process.exit(1);
// }


// console.log(' URI prefix:', mongoUri.substring(0, 25) + '...\n');

// Connect to database AFTER env vars are loaded
connectDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});