import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../lib/stripe'

export async function POST(req) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin');

    // বডি থেকে ডাটা নেওয়া হচ্ছে
    const body = await req.json().catch(() => ({}));
    const userId = body.userId;
    const email = body.email; // নিশ্চিত করুন এখানে বানানে কোনো ভুল নেই

    // ইমেইল বা ইউজার আইডি না থাকলে সেফটি এরর থ্রো করবে
    if (!userId || !email) {
      return NextResponse.json(
        { error: `Missing credentials. Received userId: ${userId}, email: ${email}` }, 
        { status: 400 }
      );
    }

    // Create Checkout Sessions from body params.
   const session = await stripe.checkout.sessions.create({
    customer_email: email, 
  line_items: [
    {
      // আপনার default_price আইডিটি এখানে বসানো হলো
      price: 'price_1Tlr5xJh5BKgyTRbSwiRKxNT', 
      quantity: 1,
    },
  ],
  mode: 'subscription', // এককালীন পেমেন্টের জন্য
  metadata: {
    userId: userId, 
    userEmail:email,
    userPlan:"pro"
  },
  success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/cancel?session_id={CHECKOUT_SESSION_ID}`,
 
});
    console.log(session);
    return NextResponse.json({url:session.url})
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}