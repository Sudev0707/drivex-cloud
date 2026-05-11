const mongoose = require("mongoose");
const URL = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(URL,{
      family: 4, // Use IPv4 to avoid potential issues with IPv6
    });
    console.log(`Database connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Database connection error: ${error}`);
    process.exit();
  }
}

module.exports = connectDB;

// mongoose
//   .connect(URL)
//   .then(() => {
//     console.log("Database connected successfully");
//     connection = mongoose.connection; // Assign mongoose connection to variable
//   })
//   .catch((err) => {
//     console.log(`Database connection error: ${err}`);
//     process.exit();
//   });
