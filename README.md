# Food Delivery App

## 📌 Introduction
The Food Delivery App is a modern web-based application designed to facilitate seamless food ordering and delivery services. It allows users to browse restaurants, place orders, track deliveries, and make payments online. The application ensures a smooth and intuitive experience for both customers and restaurant owners.

---

## 🚀 Features
- User authentication (Login/Signup)
- Browse and search for restaurants & dishes
- Add items to the cart and place orders
- Live order tracking
- Secure online payments
- Admin dashboard for managing restaurants & orders

---

## 🛠️ Tech Stack
- Frontend: React.js / HTML / CSS / JavaScript
- Backend: Node.js / Express.js
- Database: MongoDB
- Authentication: JWT 

---

## 📋 Prerequisites
Ensure you have the following installed before proceeding:
- Node.js (v14 or later) - [Download here](https://nodejs.org/)
- MongoDB (if running locally) - [Download here](https://www.mongodb.com/try/download/community)
- Git - [Download here](https://git-scm.com/downloads)

---

## ⚡ Installation Guide

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/RAVIMAKANI9/Food-delivery.git
cd Food-delivery
```

### 2️⃣ Install Dependencies
#### Frontend
```sh
cd client
npm install
```
#### Backend
```sh
cd server
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the `server` directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_api_key
```

### 4️⃣ Start the Application
#### Run the Backend Server
```sh
cd server
npm start
```
#### Run the Frontend
```sh
cd client
npm start
```

### 5️⃣ Open in Browser
Visit: `http://localhost:3000`

---

## 📖 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/restaurants` | Get all restaurants |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/:id` | Get order details |

---

## 🛠️ Implementation Details
### 🔹 Frontend
- Built with React.js for a dynamic user experience.
- Uses Redux for state management.
- Axios for handling API calls.

### 🔹 Backend
- REST API developed with Node.js & Express.js.
- MongoDB stores user data, orders, and restaurant details.
- JWT Authentication for security.

---

## 📝 Contribution Guidelines
- Fork the repository
- Create a feature branch (`git checkout -b feature-name`)
- Commit changes (`git commit -m "Added new feature"`)
- Push to GitHub (`git push origin feature-name`)
- Create a Pull Request (PR)

---

## 📞 Contact
For any queries, feel free to reach out:
- Author: Makani Ravi
- GitHub: [RAVIMAKANI9](https://github.com/RAVIMAKANI9)

---

## ⭐ Acknowledgments
Special thanks to contributors and open-source libraries that made this project possible!

> Like the project? Give it a ⭐ on GitHub!
