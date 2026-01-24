import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // If already connected, reuse the existing connection
    if (mongoose.connection.readyState >= 1) {
      console.log('MongoDB already connected')
      return
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'AskMe', // optional: specify DB name
    })

    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    throw error // important: throw so serverless knows connection failed
  }
}

export default connectDB
