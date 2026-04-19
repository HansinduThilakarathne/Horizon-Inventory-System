# 🚀 Horizon Campus Inventory - Complete Setup Guide

## Quick Start (Recommended)

### Option 1: Run Individual Servers (Recommended)

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm start
```
Expected output:
```
✅ Backend Server running at http://localhost:5000
💾 Using JSON file storage
```

**Terminal 2 - Start Frontend Server:**
```bash
npm run dev
```
Expected output:
```
VITE v8.0.3 ready in XXX ms
➜ Local: http://localhost:5173/
```

### Option 2: Run Start Script (Windows)

Double-click: `start-all.bat`

Or in PowerShell:
```powershell
.\start-all.bat
```

---

## 📱 Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Status**: Both should be running

---

## 🔧 Troubleshooting

### Ports Already in Use
If port 5000 or 5173 is in use:

**Find process using port 5000:**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Find process using port 5173:**
```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Kill All Node Processes
```powershell
Get-Process node | Stop-Process -Force
```

### Clear Backend Data
Delete folder: `backend/data/`
(Deletes all stored users, inventory, messages)

---

## 📊 Features

✅ User Registration & Login  
✅ Inventory Management  
✅ Reports & Analytics  
✅ Contact Messages  
✅ Role-based Access (Admin/Staff)  
✅ Dark Theme Support  

---

## 📁 Data Storage

All data stored in `backend/data/`:
- `users.json` - User accounts (passwords hashed)
- `inventory.json` - Inventory items
- `messages.json` - Contact messages

---

## 🔐 Default Credentials (Demo)

Register new account at: http://localhost:5173/register

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite + React Router
- **Backend**: Express.js + Node.js
- **Database**: JSON files (no MongoDB required)
- **Auth**: JWT + bcrypt
- **Styling**: CSS Modules

---

## ✅ Verification Checklist

- [ ] Backend server running (http://localhost:5000)
- [ ] Frontend server running (http://localhost:5173)
- [ ] Can access registration page
- [ ] Can register new account
- [ ] Data saved to backend/data/users.json
- [ ] Can login with registered account

---

## 📞 Support

All components are configured and ready to use.
If issues persist, check:
1. Node.js is installed (v14+)
2. npm packages installed (`npm install` in root and `backend/`)
3. No port conflicts (5000, 5173)
4. Firewall not blocking localhost

**System Status: ✅ READY TO RUN**
