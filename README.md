<div align="center">
  <img src="./client/public/vite.svg" alt="TravelEase Logo" width="100"/>
  <h1>🌍 TravelEase</h1>
  <p>A Full-Stack Modern Travel & Route Planning Application</p>
</div>

---

## 📖 Overview
**TravelEase** is a comprehensive, MERN-stack web application designed to help users plan their journeys with ease. It features an interactive route planner powered by the **Google Maps API**, real-time emergency SOS alerts via **Socket.io**, seamless payment processing with **Stripe**, and a beautiful, fully responsive UI built with **React** and **Tailwind CSS**.

## ✨ Features
- 🗺️ **Interactive Route Planning**: Calculate distance, estimated duration, and visualize routes using Google Maps Directions API.
- 🏨 **En-Route Services Search**: Seamlessly find hotels, restaurants, mechanics, and petrol pumps directly along your calculated route using Google Maps Places API.
- 🚨 **Emergency SOS System**: Integrated real-time emergency dispatch alerts powered by Socket.io for immediate assistance.
- 💳 **Secure Payments**: Complete payment integration with Stripe for seamless service bookings.
- 📱 **Fully Responsive UI**: A modern, sleek interface built with Tailwind CSS, Framer Motion for animations, and Lucide React icons.
- 🔒 **Secure Authentication**: JWT-based secure user authentication and authorization logic.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Framer Motion
- React Google Maps API
- Redux Toolkit & Context API
- Stripe React Elements
- Axios

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs
- Socket.io (Real-time communication)
- Stripe REST API

---

## 🚀 Live Demo

- **Frontend Application:** *[Add your Vercel Link here!]*
- **Backend API:** *[Add your Render Link here!]*

---

## 💻 Running the Project Locally

### Prerequisites
- Node.js (v16+)
- MongoDB connection string
- Google Maps API Key
- Stripe Publishable & Secret Keys

### 1. Clone the repository
```bash
git clone https://github.com/Ankit-CSE-01/TravelEase.git
cd TravelEase
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
NODE_ENV=development
```
Start the backend server:
```bash
npm start
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_API_URL=http://localhost:5000/api
```
Start the React development server:
```bash
npm run dev
```

---

## 📜 License
This project is for educational purposes. All rights reserved.
