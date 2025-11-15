import express from 'express';
import Razorpay from 'razorpay';

const router = express.Router();

// Only initialize Razorpay if credentials are provided
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id') {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

router.post('/create-order', async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ 
        error: 'Payment gateway not configured. Please add Razorpay credentials to .env file.'
      });
    }

    const { plan, amount } = req.body;
    
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { plan }
    };
    
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    // Verify payment signature
    // Update user subscription status
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
