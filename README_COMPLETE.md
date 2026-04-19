# 🎓 Horizon Campus Inventory System

Complete inventory management system for campus resources with role-based access control, real-time tracking, and comprehensive reporting.

## ✨ Features

- ✅ **User Management** - Secure registration & login with role-based access (Admin/Staff)
- ✅ **Inventory Tracking** - Add, update, delete inventory items
- ✅ **Issue Tracking** - Report and track inventory issues
- ✅ **Returns Management** - Process item returns
- ✅ **Request System** - Request new inventory items
- ✅ **Analytics Dashboard** - Real-time inventory reports and statistics
- ✅ **Contact System** - Admin messaging system
- ✅ **Theme Support** - Light/Dark mode switching
- ✅ **Responsive Design** - Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- npm (comes with Node.js)

### Installation

1. **Install Dependencies**
```bash
npm install
cd backend && npm install && cd ..
```

2. **Start Backend Server**
```bash
cd backend
npm start
```
✅ Backend running at: `http://localhost:5000`

3. **Start Frontend Server** (in a new terminal)
```bash
npm run dev
```
✅ Frontend running at: `http://localhost:5173`

4. **Open Application**
Visit: http://localhost:5173

## 📋 Usage

### First Time Setup

1. Navigate to `http://localhost:5173/register`
2. Create a new account
3. Go to `http://localhost:5173/login`
4. Login with your credentials
5. Access dashboard and features

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Inventory
- `GET /api/inventory` - Get all items
- `POST /api/inventory` - Add item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send message

## 🏗️ Technology Stack

**Frontend:**
- React 19.2.4
- Vite 8.0.1
- React Router DOM 7.13.2
- Firebase 12.11.0

**Backend:**
- Express.js 4.19.2
- Node.js
- bcryptjs (password hashing)
- JWT (authentication)

## 🗄️ Database

Uses JSON file storage in `backend/data/`:
- `users.json` - User accounts
- `inventory.json` - Inventory items
- `messages.json` - Contact messages

## ✅ Status

**System Status: ✅ FULLY OPERATIONAL**

All systems ready to use!
