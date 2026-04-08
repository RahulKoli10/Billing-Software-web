# 🚀 BissBill – Smart Billing & Subscription Management System

BissBill is a full-stack SaaS application designed to manage billing, subscriptions, customers, and sales efficiently. It provides a secure and scalable platform for businesses to handle invoices, pricing plans, and transactions.

   

## 🧠 Tech Stack

### Frontend

* Next.js (App Router)
* Tailwind CSS
* Axios

### Backend

* Node.js + Express
* MySQL Database
* JWT Authentication

### Other Tools

* Razorpay (Payments)
* Cron Jobs (Subscription cleanup)
* Helmet (Security)
* Rate Limiting

   

## ⚙️ Features

* 🔐 Secure Authentication (Login / Signup)
* 💳 Subscription & Pricing Plans
* 🧾 Billing & Invoice Management
* 👥 Customer Management
* 📊 Sales Tracking
* 📥 File Download System
* 🔄 Automated Payment Cleanup (Cron Job)
* 🌐 API Integration with secure CORS

   

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/bissbill.git
cd bissbill
```

   

### 2. Install dependencies

```bash
npm install
```

   

### 3. Setup environment variables

Create a `.env` file in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000


DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=


JWT_SECRET=
JWT_EXPIRES_IN=1d

#Super admin credentials
ADMIN_EMAIL=
ADMIN_PASSWORD=


# Google OAuth credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000

# Razorpay credentials
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# SMTP configuration for sending emails
SMTP_HOST=
SMTP_EMAIL=
SMTP_PASSWORD=
SMTP_PORT=

```

   

### 4. Run the development server

#### Frontend

```bash
npm run dev
```

#### Backend

```bash
npm run dev
```

   

### 5. Open in browser

👉 http://localhost:3000

   

## 🔐 Security Features

* Helmet.js for secure HTTP headers
* CORS protection with whitelist
* Rate limiting to prevent abuse
* Environment variables for sensitive data
* Input validation (recommended)

   

## 📁 Project Structure

```
/frontend (Next.js app)
  ├── app/
  ├── components/
  ├── utils/

/backend (Express API)
  ├── routes/
  ├── controllers/
  ├── middlewares/
  ├── config/
```

   

## 🚀 Deployment

### Frontend

Deploy easily on **Vercel**

### Backend

Deploy on:

* Render
* AWS
* DigitalOcean

   

## 🧪 API Base URL

```
/backend/*
```

Example:

```
/backend/api/auth/login
```

   

## 📌 Future Improvements

* 🔍 Advanced analytics dashboard
* 📱 Mobile responsiveness improvements
* 🤖 AI-based insights (billing predictions)
* 📊 Export reports (PDF/Excel)

   

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.
 
   

## 👨‍💻 Author

Developed by **Rahul Koli**
Full-Stack Developer | MERN Stack Enthusiast
