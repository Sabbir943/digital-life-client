# 🌟 Digital Life Lessons

A modern, secure web application where individuals can capture, categorize, and preserve meaningful life lessons, personal growth insights, and wisdom. Built to foster self-reflection, the platform features a hybrid Free/Premium model, real-time community engagement, and comprehensive dashboard analytics.

🚀 **Live Link:** [View Live Site](https://digital-life-client-inky.vercel.app)  
🖥️ **Server Repository:** [GitHub Link](https://github.com/Sabbir943/digital-life-client)

---

## 📖 Table of Contents
- [Core Purpose](#-core-purpose)
- [Key Features](#-key-features)
- [Tech Stack & Dependencies](#-tech-stack--dependencies)
- [System Access Control](#-system-access-control)


---

## 🎯 Core Purpose
Valuable insights are often forgotten amid daily life. **Digital Life Lessons** provides a digital journal to document personal epiphanies. Users can keep their entries completely private, share them publicly for free, or lock premium insights behind a paywall. The platform encourages communal growth by allowing users to explore and interact with shared wisdom.

---

## ✨ Key Features

### 🔐 Secure Authentication (Better Auth)
* **Unified Flow:** Credentials signup with explicit client-side validation rules (min 6 characters, at least 1 uppercase, and 1 lowercase letter).
* **Social Login:** Single-click integration using Google Authentication.
* **Persistent Session Handling:** Robust protected routes ensure users are never redirected to login when refreshing a private path.

### 💎 Stripe Paywall Integration
* **One-Time Lifetime Access:** Free tier users can upgrade seamlessly via Stripe (৳1500) to gain lifetime Premium status.
* **Asynchronous Webhooks:** Webhook listeners ensure reliable and instant data synchronization on successful transactions.
* **Dynamic Locking & Blurring:** Automatically blurs premium content cards for free users, displaying a clean "Upgrade to Premium" prompt.

### 📊 Comprehensive User & Admin Dashboards
* **User Workspace:** Track creation metrics via analytical charts, manage personal entries in a structured data table, and customize profiles.
* **Admin Control Center:** Manage global statistics, upgrade user roles, handle reported posts, and mark lessons as "Featured" to display on the landing page hero gallery.

### 🎭 UX/UI Interactivity
* **Framer Motion Elements:** Smooth, modern viewport entry transitions across the landing page.
* **Toast Feedback Engine:** Replaces standard browser alerts with clean, descriptive context toasts for all operations.

---

## 🛠️ Tech Stack & Dependencies

### Frontend (Client-Side)
* **Framework:** Next.js  with Tailwind CSS
* **Animation & Icons:** Framer Motion, Lucide React / React Icons/gravity UI
* **Key Packages:** `better-auth`, `recharts`, `react-toastify` / `sweetalert2`, `react-share`

### Backend (Server-Side)
* **Runtime & Framework:**  Express.js
* **Database Management:** MongoDB (Native Driver / Mongoose)
* **Payment Gateway:** Stripe Node SDK
* **Key Packages:** `better-auth`, `dotenv`, `cors`

---

## 🛡️ System Access Control

| Action / Capability | Unauthenticated | Free User | Premium Member | Admin |
| :--- | :---: | :---: | :---: | :---: |
| Browse Free Lessons | ✅ | ✅ | ✅ | ✅ |
| View Premium Lessons | 🔒 (Blurred) | 🔒 (Lock Prompt) | ✅ | ✅ |
| Access Dashboards | ❌ | ✅ (User) | ✅ (User) | ✅ (Admin) |
| Author Premium Content | ❌ | ❌ (Disabled) | ✅ | ✅ |
| Content Moderation | ❌ | ❌ | ❌ | ✅ |

---

