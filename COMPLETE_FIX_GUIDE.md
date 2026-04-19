# 🚨 LOCALHOST:5173 NOT RESPONDING - COMPLETE FIX GUIDE

## Problem: 
`localhost:5173 refused to connect` - Frontend server is not running

---

## ✅ SOLUTION 1: Use RUN.bat (Easiest)

Located at: `d:\Campus\Final Ye\horizon-inventory\RUN.bat`

**Action:** Double-click the file

This will:
1. Close any old processes
2. Open Backend Server window
3. Open Frontend Server window
4. Show success message

---

## ✅ SOLUTION 2: Manual Startup (2 Steps)

### STEP 1: Open Command Prompt #1

```cmd
cd d:\Campus\Final Ye\horizon-inventory\backend
npm start
```

**Expected Output:**
```
✅ Backend Server running at http://localhost:5000
💾 Using JSON file storage (data/users.json, data/inventory.json, data/messages.json)
```

**Wait for these exact lines** before moving to Step 2.

---

### STEP 2: Open Command Prompt #2

```cmd
cd d:\Campus\Final Ye\horizon-inventory
npm run dev
```

**Expected Output:**
```
  VITE v8.0.3  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Wait for these exact lines** before opening browser.

---

## ✅ STEP 3: Open Browser

Visit: **http://localhost:5173/**

Should see: **Login/Register page**

---

## 🆘 SOLUTION 3: If Nothing Works

### Check if Node.js is installed:

```cmd
node --version
npm --version
```

If you get "command not found":
1. Download: https://nodejs.org/
2. Install Node.js
3. Restart command prompt
4. Try again

### Check if ports are in use:

```powershell
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

If shows process IDs, run:
```powershell
taskkill /PID <number> /F
```

### Complete Reset:

```cmd
REM Kill all Node processes
taskkill /F /IM node.exe

REM Delete node_modules
rmdir /s /q node_modules
rmdir /s /q backend\node_modules

REM Reinstall
npm install
cd backend
npm install
cd ..

REM Start servers
cd backend && npm start
REM (in new window)
npm run dev
```

---

## 🎯 VERIFICATION CHECKLIST

- [ ] Backend terminal shows "Backend Server running at http://localhost:5000"
- [ ] Frontend terminal shows "VITE v8.0.3 ready in XXX ms"
- [ ] Can open http://localhost:5173/ in browser
- [ ] See login/register page
- [ ] Can type in form fields
- [ ] Can click buttons without errors

---

## 📊 What's Running

| Component | Port | URL | Status |
|-----------|------|-----|--------|
| Backend (Express) | 5000 | http://localhost:5000 | Should be running |
| Frontend (Vite) | 5173 | http://localhost:5173 | Should be running |
| Database | - | backend/data/ | Automatic (JSON files) |

---

## 💡 Pro Tips

1. **Keep both terminals open** - Both servers must run simultaneously
2. **Don't close terminals** - Closing kills the server
3. **Use CTRL+C** - To stop a server (graceful shutdown)
4. **Use RUN.bat** - Easiest method, opens both automatically
5. **Check console errors** - Terminal will show error messages

---

## 🔄 Quick Restart

If server crashes or becomes unresponsive:

```cmd
REM Kill all node processes
taskkill /F /IM node.exe

REM Wait
timeout /t 2

REM Start fresh
cd d:\Campus\Final Ye\horizon-inventory\backend
npm start
```

---

## ✨ Expected User Experience

1. Visit http://localhost:5173/
2. See registration form
3. Enter email, password, name, phone
4. Click "REGISTER NEW ACCOUNT"
5. Get success message
6. Redirected to login
7. Enter credentials
8. Successfully logged in
9. See dashboard

---

## 📝 Still Having Issues?

**Check These Files:**
- `STARTUP_INSTRUCTIONS.txt` - Basic startup
- `QUICK_START.md` - Quick reference
- `README_COMPLETE.md` - Full documentation
- `RUN.bat` - Automated startup script

---

## 🎉 SUCCESS = 

- ✅ Both servers running
- ✅ Can open http://localhost:5173/
- ✅ Can see login page
- ✅ Can register and login
- ✅ Can access dashboard

**You're ready to go! 🚀**
