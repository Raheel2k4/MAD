# ☕ Skybrews Coffee App (Full-Stack)

**Skybrews Coffee App** is a complete full-stack mobile application for a coffee shop, built with **React Native (Expo)** on the frontend and **Node.js/Express** on the backend.

Originally created as a **university project (CS375)**, it has grown into a feature-rich, production-quality app featuring a live menu, persistent shopping cart, and full simulated checkout process.

---

## ✨ Features

### 📩 Full-Stack Architecture

* React Native (Expo) frontend
* Node.js / Express backend
* MongoDB Atlas for database
* Zustand for global state management

### 💼 Persistent Shopping Cart

* Add, remove, and update item quantities
* Data persists across app sessions

### 💳 Complete Checkout Flow

1. **My Cart Screen** – Live-updating total
2. **Checkout Screen** – Validated user form (Name, Address, Phone)
3. **Order Success Modal** – Clears cart and returns home

### 🍰 Item Details Screen

* Tap any item for a detailed view with full description and image

### 🎁 "Surprise Me" Feature

* Fetches a random in-stock item from backend and displays in a custom modal

### ⚡ Dynamic UI & Feedback

* "Add to Cart" button shows confirmation before navigating
* Live cart badges on tabs and menu

### 🎨 Modern & Clean Design

* Custom light theme (white + sky blue)
* Hidden native headers, replaced by custom titles
* Consistent and modern look throughout

### 🌐 Automatic IP Configuration

* Backend IP auto-detected from Expo manifest
* No need to manually change `apiConfig.ts`

---

## 🛠️ Tech Stack

| Frontend         | Backend       |
| ---------------- | ------------- |
| React Native     | Node.js       |
| Expo (SDK 49+)   | Express       |
| TypeScript       | Mongoose      |
| Expo Router (v2) | MongoDB Atlas |
| Zustand          | cors          |
| expo-constants   | dotenv        |

---

## 🚀 How to Run

The project is structured as a **monorepo** with separate `frontend` and `backend` folders. Use two terminals to run each part.

### 🪙 Prerequisites

* Node.js (v18+)
* MongoDB Atlas account
* Expo Go app on a phone (same Wi-Fi as PC)

---

### 💻 Backend Setup

1. Navigate to backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   ```bash
   MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/coffee_shop_db?retryWrites=true&w=majority"
   ```

4. Whitelist your IP on MongoDB Atlas:

   * Go to **Network Access → Add IP Address**
   * Click **Allow My Current IP Address**

5. Populate the database:

   * Create database: `coffee_shop_db`
   * Create collection: `menu_items`
   * Insert provided JSON menu data

6. Run the server:

   ```bash
   node server.js
   ```

Expected output:

```
Success: Connected to MongoDB
Coffee shop server running on port 3000
```

---

### 📲 Frontend Setup

1. Navigate to frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Allow network access on Windows Firewall:

   * Open **Windows Defender Firewall → Allow an app**
   * Find **Node.js JavaScript Runtime**
   * Ensure **Private** is checked

4. Run the app:

   ```bash
   npx expo start -c
   ```

   * Clear cache with `-c` (recommended)
   * Scan QR code using **Expo Go** app

---

## 🔍 API Endpoints

| Method | Endpoint       | Description                  |
| ------ | -------------- | ---------------------------- |
| GET    | `/menu`        | Get all menu items           |
| GET    | `/menu/random` | Get one random in-stock item |
| GET    | `/menu/:id`    | Get menu item by ID          |

---

## 🗂️ Folder Structure

```
skybrews-coffee-app/
│
├── backend/
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── store/
│   ├── apiConfig.ts
│   └── package.json
│
└── README.md
```

---

## 👨‍💻 Author

**M. Raheel Nawaz**
[https://github.com/Raheel2k4](#) | [raheel.nawaz768@gmail.com](#)

---

## 🗃️ License

Licensed under the **MIT License** — you’re free to use and modify.

---

⭐ *If you like this project, please give it a star on GitHub!*
