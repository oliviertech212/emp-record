# Employee Records Management App

🚀 **Live Demo**: [Employee Records App](https://emp-record-7mdk.vercel.app/)  
📂 **GitHub Repository**: [View on GitHub](https://github.com/oliviertech212/emp-record)  

## 📌 Overview

This is a simple **Employee Records Management** web application built with **Next.js** and **MongoDB**. The app allows authenticated users to **Create, Read, Update, and Delete (CRUD)** employee records. It also features authentication with **NextAuth.js** to ensure secure access.

## ✨ Features

✅ **Employee CRUD Operations**  
- Add new employees with **Firstname, Lastname, Email, Phone, and Role (Admin/Staff)**  
- View all employees in a list  
- Update employee details (Firstname, Lastname, Phone)  
- Delete employee records  

✅ **Authentication & Authorization**  
- User **Signup, Login, and Logout**  
- **JWT-based authentication** with NextAuth.js  
- Protect API routes – **only logged-in users** can manage records  

✅ **Tech Stack Used**  
- **Frontend**: Next.js (React) with Tailwind CSS  
- **Backend**: Next.js API routes, NextAuth.js  
- **Database**: MongoDB with Mongoose  
- **Authentication**: NextAuth.js (JWT-based authentication)  

## 🚀 Getting Started

### 1️⃣ **Clone the Repository**

git clone https://github.com/oliviertech212/emp-record.git
cd emp-record

### update .env 
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
### run development server
- npm install
- npm run dev
