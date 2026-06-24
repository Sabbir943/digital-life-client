// 🔴 কোনো "use client" থাকবে না (এটি সরাসরি সার্ভার সাইডে রান করবে)
import { stripe } from '@/lib/stripe'; // আপনার সার্ভার সাইড স্ট্রাইপ ইনিশিয়াল ফাইল
import Link from 'next/link';

export default async function SuccessPage({ searchParams }) {
    // ১. সার্ভার কম্পোনেন্টে সরাসরি searchParams প্রপস হিসেবে পাওয়া যায়
    const params = await searchParams;
    const sessionId = params.session_id;
    
    let metadata = null;

    // ২. প্রথমে চেক করব sessionId আছে কিনা এবং স্ট্রাইপ থেকে ডেটা নিয়ে আসব
    if (sessionId) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            metadata = session.metadata;

            // ৩. ডেটা সফলভাবে পাওয়ার পর ব্যাকএন্ডে ডাটাবেজ আপডেটের জন্য পাঠাব
            if (metadata) {
                await fetch(`http://localhost:8000/subscription`, {
                    method: "POST",
                    headers: {
                        'Content-Type': "application/json"
                    },
                    cache: 'no-store', // 🟢 ফিক্সড: Next.js ক্যাশিং বন্ধ করার জন্য এটি অত্যন্ত জরুরি
                    body: JSON.stringify({
                        sessionId: sessionId,
                        userId: metadata.userId,
                        userEmail: metadata.userEmail || "",
                        userPlan: "Pro" // ব্যাকঅ্যান্ডের সাথে মিল রেখে "Pro" করা হলো
                    })
                });
            }
        } catch (error) {
            console.error("Stripe retrieval or database update failed:", error);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white">
            <div className="w-full max-w-xl bg-slate-900 p-10 rounded-3xl text-center border border-emerald-500/20">
                <h1 className="text-3xl font-black">Payment Successful! 🎉</h1>
                
                {metadata && (
                    <div className="mt-4 p-3 bg-black/40 rounded-xl text-left font-mono text-xs">
                        <p className="text-slate-400">User ID: {metadata.userId}</p>
                        {metadata.userEmail && <p className="text-slate-500">Email: {metadata.userEmail}</p>}
                    </div>
                )}
                
                <Link href="/dashboard" className="mt-6 inline-block bg-indigo-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition">
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}