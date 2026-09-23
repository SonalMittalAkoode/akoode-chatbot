const { default: mongoose } = require("mongoose");

const dbConnect = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is missing from the backend environment.");
  }
  const conn = await mongoose.connect(process.env.MONGODB_URL, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log("Database Connected Successfully");
  return conn;
};
module.exports = dbConnect;


