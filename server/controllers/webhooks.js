import crypto from 'crypto'
import Transaction from '../models/Transaction.js'
import User from '../models/User.js'

export const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET

  const signature = req.headers['x-razorpay-signature']

  // 1️⃣ Verify signature
  const body = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  // if (expectedSignature !== signature) {
  //   return res.status(400).send('Invalid webhook signature')
  // }

  console.log("Webhook Body:", req.body.toString())
console.log("Webhook Headers:", req.headers)

  // 2️⃣ Handle event
  const event = JSON.parse(body.toString())

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity

    const transactionId = payment.notes.transactionId

    if (!transactionId) {
      return res.json({ received: true })
    }

    const transaction = await Transaction.findOne({
      _id: transactionId,
      isPaid: false
    })

    if (!transaction) {
      return res.json({ received: true })
    }

    // 3️⃣ Credit the user
    await User.updateOne(
      { _id: transaction.userId },
      { $inc: { credits: transaction.credits } }
    )

    transaction.isPaid = true
    transaction.razorpayPaymentId = payment.id
    await transaction.save()
  }

  res.json({ received: true })
}











