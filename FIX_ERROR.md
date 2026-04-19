# 🔴 SERVER NOT RUNNING - FIX NOW

## ⚡ EASIEST FIX - Double-Click This:

📁 **RUN.bat** (in project root folder)

This will automatically:
- Kill old processes
- Start backend (Port 5000)
- Start frontend (Port 5173)

---

## OR: Manual 2-Step Method

### Step 1: Backend (First Terminal)
```
cd "d:\Campus\Final Ye\horizon-inventory\backend"
npm start
```

Wait for:
```
✅ Backend Server running at http://localhost:5000
💾 Using JSON file storage
```

### Step 2: Frontend (Second Terminal)
```
cd "d:\Campus\Final Ye\horizon-inventory"
npm run dev
```

Wait for:
```
VITE v8.0.3 ready in XXX ms
➜ Local: http://localhost:5173/
```

---

## 🎯 Then Access:

**Open Browser:** http://localhost:5173

---

## ❌ Still Not Working?

### Check Port Usage:
```powershell
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

### Kill All Node Processes:
```powershell
Get-Process node | Stop-Process -Force
```

### Reinstall Dependencies:
```bash
cd "d:\Campus\Final Ye\horizon-inventory"
npm install
cd backend
npm install
cd ..
```

Then start servers again.

---

## ✅ Success = You See:
- Backend terminal: "Backend Server running at http://localhost:5000"
- Frontend terminal: "VITE v8.0.3 ready"
- Browser loads: http://localhost:5173/register page

---

**DO THIS NOW:** Double-click **RUN.bat** file 👆
