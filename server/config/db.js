const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB Atlas] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    // If Atlas connection blocked by network, fallback to in-memory
    try {
      console.log('[MongoDB] Falling back to memory server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB In-Memory] Connected: ${conn.connection.name}`);
      return conn;
    } catch (memErr) {
      console.error(`[MongoDB Critical] Failed to initialize database: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
