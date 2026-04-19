# Horizon Campus Inventory - Setup Complete ✅

## Fixed Error
**Issue**: Registration was failing with "Failed to fetch" error because:
1. Backend server was not running
2. MongoDB was not configured

**Solution**: Created a complete full-stack setup:

## Backend Setup (Port 5000)
- ✅ Express server running with CORS enabled
- ✅ Authentication APIs: Register & Login
- ✅ Inventory management APIs (CRUD)
- ✅ Messages/Contact APIs
- ✅ Data persistence using JSON files in `backend/data/` folder

## Database Setup
- **Storage**: JSON files (no MongoDB installation required)
- **Location**: `backend/data/users.json`, `inventory.json`, `messages.json`
- **Files automatically created** on first registration/inventory item

## Frontend Setup (Port 5173)
- ✅ Vite dev server running smoothly
- ✅ React Router configured with protected routes
- ✅ Firebase authentication UI ready
- ✅ Connected to backend at `http://localhost:5000`

## How to Use

### Start the Application
1. **Terminal 1 - Backend Server** (Already Running):
   ```bash
   cd backend
   npm start
   ```
   Runs on: `http://localhost:5000`

2. **Terminal 2 - Frontend Server** (Already Running):
   ```bash
   npm run dev
   ```
   Runs on: `http://localhost:5173`

### Register a New Account
1. Go to http://localhost:5173/register
2. Fill in the form:
   - Full Name: Any name
   - Email: Your email
   - Phone: Any phone number
   - Role: Admin or Staff
   - Password: Any password
3. Click "REGISTER NEW ACCOUNT"
4. ✅ User will be saved to `backend/data/users.json`

### Login
1. Go to http://localhost:5173/login
2. Use credentials from your registered account
3. Select appropriate role (Admin or Staff)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Inventory
- `GET /api/inventory` - Get all items
- `POST /api/inventory` - Add new item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send message

## Data Storage
All data is stored in `backend/data/` folder as JSON files:
- `users.json` - Registered users with hashed passwords
- `inventory.json` - Inventory items
- `messages.json` - Contact messages

## Future MongoDB Setup (Optional)
To switch to MongoDB Atlas later:
1. Create account at https://www.mongodb.com/cloud/atlas
2. Update `backend/.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/horizon_campus
   ```
3. Run MongoDB version:
   ```bash
   cd backend
   npm run start-mongo
   ```

## Troubleshooting
- If port 5000 is busy: Update `backend/.env` PORT value
- If port 5173 is busy: Vite will automatically use next available port
- Clear `backend/data/` folder to reset all data
- Ensure Node.js is installed (v14+)

## Status
✅ All systems operational and ready to use!
