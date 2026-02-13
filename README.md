# AskMe – AI Powered Chatbot

AskMe is a full-stack AI-powered chatbot application designed with real-world scalability in mind. It allows users to generate text and images using AI, manage usage through a credit-based system, and make secure payments to purchase credits.

![ASK-ME CHATBOT SCREENSHOT](1.jpg)

## Live Demo
[https://askme-chatbot-git-main-harshika-jains-projects-d462d05c.vercel.app/]

---

## Features

- AI-powered text generation using OpenAI
- Image generation using ImageKit
- User authentication (Signup & Login)
- Credit-based usage system for chat generation
- Secure payment integration using Razorpay
- Credits deducted per request
- Persistent user data storage using MongoDB
- Scalable and production-ready architecture

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Vercel (Deployment)

### Backend
- Node.js
- Express.js
- MongoDB (User data, credits, transactions, chat history)

### AI & Media
- OpenAI API (Text generation)
- ImageKit (Image generation and media handling)

### Authentication & Payments
- JWT Authentication
- Razorpay Payment Gateway

---

## How It Works

1. Users sign up or log in to the application.
2. User details, credits, and transactions are stored in MongoDB.
3. Users purchase credits securely using Razorpay.
4. Each AI request (text or image generation) consumes credits.
5. AI responses are generated using OpenAI and ImageKit APIs.

---

## Installation & Setup

### Step 1: Clone the repository
```bash
git clone https://github.com/Harshikajain23/AskMe-Chatbot.git
```

### Step 2: Navigate to the project directory
Go inside the cloned folder:
```bash
cd AskMe-Chatbot
```

### Step 3: Install dependencies
Install all required packages:
```bash
npm install
```
### Step 4: Configure environment variables
Create a .env file in the root directory and add the following keys:
```bash
OPENAI_API_KEY=your_openai_api_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Step 5: Run the application

for frontend :
```bash
npm run dev
```
for backend :
```bash
npm run server
```


