const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const URI = process.env.MONGO_URL_PROD;
const InitiateMongoServer = async () => {
  try {
    console.log("⏱ MONGO_DB CONNECTION INITIATED");
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MONGO_DB CONNECTED");
  } catch (err) {
    console.log("❌ MONGO_DB CONNECTION FAILED");
    throw err;
  }
};

module.exports = InitiateMongoServer;
