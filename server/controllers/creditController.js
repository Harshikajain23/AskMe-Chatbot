import Transaction from "../models/Transaction.js"
import Razorpay from "razorpay"
import crypto from "crypto"


const plans = [
      {
        _id: "basic",
        name: "Basic",
        price: 299,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 599,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 799,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
]

// API Controller for getting all plans
export const getPlans = async (req, res)=> {
    try{
        res.json({success : true , plans})
    }catch(error){
        res.json({success : false , message: error.message})
    }
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_PUBLISHABLE_KEY,       // test key
  key_secret: process.env.RAZORPAY_TEST_SECRET_KEY
})

// API Controller for purchasing a plan

export const purchasePlans = async (req, res)=> {

    try{
        const { planId } = req.body

        const userId = req.user._id

        const plan = plans.find( plan => plan._id === planId)

        if(!plan){
            return res.json({success: false, message: "Invalid plan"})
        }

        // Create new Transaction

        const transaction = await Transaction.create({
            userId: userId,
            planId: plan._id,
            amount: plan.price,
            credits: plan.credits,
            isPaid: false
        })
        
        const {origin} = req.headers;

        const order = await razorpay.orders.create({
  amount: plan.price * 100, // INR → paise
      currency: "INR",
      receipt: transaction._id.toString(),
      notes: {
        planName: plan.name,
        userId: userId.toString(),
        transactionId: transaction._id.toString()
      }
    })
      return res.json({
      success: true,
      order, // order.id goes to frontend
      razorpayKey: process.env.RAZORPAY_TEST_PUBLISHABLE_KEY,
      transactionId: transaction._id
    })
 } catch(error){
        res.json({success: false, message: error.message})
    }

}

// verify payment

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ success: false, message: "Transaction ID is required" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_TEST_SECRET_KEY)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    // Mark transaction as paid
    await Transaction.findByIdAndUpdate(transactionId, { isPaid: true });

    return res.json({
      success: true,
      message: "Payment verified successfully"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
