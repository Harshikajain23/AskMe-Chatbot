import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'

import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoute.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import { razorpayWebhook } from './controllers/webhooks.js'

const app = express()

await connectDB()

app.post(
  '/api/razorpay',
  express.raw({ type: 'application/json' }),
  razorpayWebhook
)

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('Server is Live!'))
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)

export default app
