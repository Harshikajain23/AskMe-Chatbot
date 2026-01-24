// import crypto from 'crypto'
// import Transaction from '../models/Transaction.js'
// import User from '../models/User.js'

// export const razorpayWebhook = async (req, res) => {
//   const secret = process.env.RAZORPAY_WEBHOOK_SECRET

//   const signature = req.headers['x-razorpay-signature']

//   // 1️⃣ Verify signature
//   const body = req.body;

//   const expectedSignature = crypto
//     .createHmac('sha256', secret)
//     .update(body)
//     .digest('hex')

//   // if (expectedSignature !== signature) {
//   //   return res.status(400).send('Invalid webhook signature')
//   // }

//   console.log("Webhook Body:", req.body.toString())
// console.log("Webhook Headers:", req.headers)

//   // 2️⃣ Handle event
//   const event = JSON.parse(body.toString())

//   if (event.event === 'payment.captured') {
//     const payment = event.payload.payment.entity

//     const transactionId = payment.notes.transactionId

//     if (!transactionId) {
//       return res.json({ received: true })
//     }

//     const transaction = await Transaction.findOne({
//       _id: transactionId,
//       isPaid: false
//     })

//     if (!transaction) {
//       return res.json({ received: true })
//     }

//     // 3️⃣ Credit the user
//     await User.updateOne(
//       { _id: transaction.userId },
//       { $inc: { credits: transaction.credits } }
//     )

//     transaction.isPaid = true
//     transaction.razorpayPaymentId = payment.id
//     await transaction.save()
//   }

//   res.json({ received: true })
// }
















import Transaction from '../models/Transaction.js'
import User from '../models/User.js'
import connectDB from '../configs/db.js'

export const razorpayWebhook = async (req, res) => {
  try {
    // 1️⃣ Connect to DB safely
    await connectDB()

    // 2️⃣ Get raw body
    const body = req.body.toString()
    console.log('Webhook Body:', body)
    console.log('Webhook Headers:', req.headers)

    // 3️⃣ Parse JSON safely
    let event
    try {
      event = JSON.parse(body)
    } catch (err) {
      console.error('Invalid JSON payload:', err)
      return res.status(400).send('Invalid JSON')
    }

    // 4️⃣ Handle event
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity
      const transactionId = payment.notes?.transactionId
      if (!transactionId) return res.json({ received: true })

      const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false })
      if (!transaction) return res.json({ received: true })

      await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } })
      transaction.isPaid = true
      transaction.razorpayPaymentId = payment.id
      await transaction.save()

      console.log(`Transaction ${transactionId} processed successfully ✅`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook Error:', error)
    res.status(500).send('Server error')
  }
}
