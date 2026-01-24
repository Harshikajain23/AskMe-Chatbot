import mongoose from 'mongoose'

let isConnected = false

const connectDB = async () => {
  if (isConnected) return

  try {
    const conn = await mongoose.connect(
      `${process.env.MONGODB_URI}/AskMe`
    )

    isConnected = true
    console.log('MongoDB connected:', conn.connection.host)
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    throw error
  }
}

export default connectDB
