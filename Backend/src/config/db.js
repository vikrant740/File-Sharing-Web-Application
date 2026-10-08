const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/filedrop';
    const conn = await mongoose.connect(mongoURI);
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Server chal raha hai, lekin database features tabhi chalenge jab MongoDB run hoga.');
  }
};

module.exports = connectDB;