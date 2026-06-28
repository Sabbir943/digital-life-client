import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("digital-lessons");

export const auth = betterAuth({
  emailAndPassword: { 
    enabled: true, 
  },
  socialProviders: {
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    }, 
  },
  
  // // 🌟 এখানে আপনার Vercel ডোমেইনটি trustedOrigins হিসেবে যুক্ত করুন
  // trustedOrigins: [
  //   "https://digital-life-client-eta.vercel.app"
  // ],
    
  database: mongodbAdapter(db, {
    client
  }),
  user: {
    additionalFields: {
      userPlan: {
        type: "string",
        defaultValue: "free"
      } 
    }
  },
});