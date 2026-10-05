# 🍕 Pizza Express - Full Stack Pizza Delivery Web Application

An end-to-end, responsive food ordering and kitchen inventory platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). 

This project was developed and submitted as part of the **Web Development & Designing Internship Program (OIBSIP)** at **Oasis Infobyte**.

---

## 📌 Project Overview
Pizza Express provides customers with a seamless pizza discovery, customization, and checkout workflow while equipping restaurant staff and administrators with a centralized kitchen console to track incoming orders, update stock levels, and manage menu items in real time.

---

## 🚀 Key Features

* **Dynamic Catalog & Filtering:** Real-time client-side categorization across Veg, Non-Veg, Sides & Snacks, and Beverages.
* **Smart Cart & Pricing Engine:** Automated item subtotal calculations, dynamic pricing based on sizes (Small, Medium, Large), and instant quantity modifiers.
* **Build Your Own Pizza:** Interactive customization modal allowing users to configure crusts, sauces, cheeses, and vegetable/meat toppings.
* **Multi-Role Authentication:** Dedicated authentication flows with role-based access for regular users and store proprietors.
* **Proprietor Kitchen Console:** Administrative management portal to view incoming customer orders, manage active menu availability, and track inventory.
* **Resilient UI/UX:** Client-side error handling with fallback states for network latency and broken media assets.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** React.js, React Router, Context API (State Management), Axios, CSS3
* **Backend:** Node.js, Express.js (RESTful APIs)
* **Database:** MongoDB Atlas (Cloud Database) with Mongoose ODM
* **Authentication & Security:** JSON Web Tokens (JWT), bcryptjs
* **Development & Tooling:** Git, GitHub, VS Code, Postman

---

## 📂 Project Structure

```text
Pizza Delivery App/
├── pizza-delivery/
│   ├── client/                  # React Frontend Application
│   │   ├── public/              # Static assets & HTML template
│   │   └── src/
│   │       ├── components/      # UI Components (Navbar, Cart, Cards, Modals)
│   │       ├── context/         # Global Cart & Auth Context
│   │       └── pages/           # Application views (Home, Menu, Admin)
│   │
│   └── server/                  # Node.js / Express Backend
│       ├── config/              # Database connection settings
│       ├── controllers/         # Business logic & route handlers
│       ├── models/              # Mongoose data schemas (User, Pizza, Order)
│       └── routes/              # API endpoints
│
├── .gitignore                   # Excluded build artifacts & credentials
└── README.md                    # Project documentation
