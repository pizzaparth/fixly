import mongoose from 'mongoose';

/**
 * Connect to MongoDB database using Mongoose.
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fixly';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    console.warn('[MongoDB] Running in fallback mode. Ensure MongoDB is running or provide a valid MONGODB_URI.');
  }
};

/**
 * Disconnect from MongoDB database.
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected.');
  } catch (error) {
    console.error(`[MongoDB] Error during disconnect: ${error.message}`);
  }
};
