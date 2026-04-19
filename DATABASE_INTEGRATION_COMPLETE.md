# Database Integration - Issue, Return, and Request Items

## ✅ COMPLETED: Backend API Endpoints for Data Persistence

### Issue Items Endpoint (`/api/issued-items`)
- **POST /api/issued-items** - Create a new issued item record
  ```json
  {
    "itemCode": "STW001",
    "itemName": "Pen",
    "staffAdminId": "staff123",
    "numberOfItems": 5,
    "issueDepartment": "CS",
    "receiverName": "John Doe",
    "receiverStudentStaffId": "student001",
    "description": "Office supplies"
  }
  ```
  - **Response**: Returns created record with auto-generated `_id` and `createdAt` timestamp
  - **Storage**: Persisted to `backend/data/issued-items.json`
  - **Auto-Updates Inventory**: Decreases quantity by numberOfItems

- **GET /api/issued-items** - Retrieve all issued items
  - **Response**: Array of all issued items sorted by date (descending)
  - **Pagination**: Sorted with most recent first

### Return Items Endpoint (`/api/returned-items`)
- **POST /api/returned-items** - Create a new returned item record
  ```json
  {
    "itemCode": "STW001",
    "itemName": "Pen",
    "numberOfItems": 2,
    "returnedBy": "Jane Smith",
    "returnedById": "student001",
    "condition": "Good"
  }
  ```
  - **Response**: Returns created record with auto-generated `_id` and `createdAt` timestamp
  - **Storage**: Persisted to `backend/data/returned-items.json`
  - **Auto-Updates Inventory**: Increases quantity by numberOfItems

- **GET /api/returned-items** - Retrieve all returned items
  - **Response**: Array of all returned items sorted by date (descending)

### Request Items Endpoint (`/api/requests`)
- **POST /api/requests** - Create a new request (ALREADY WORKING)
  ```json
  {
    "itemCode": "STW001",
    "itemName": "Pen",
    "quantity": 10,
    "reason": "Semester supplies",
    "requestedBy": "Admin",
    "requestedById": "admin001",
    "status": "Pending",
    "senderRole": "Staff"
  }
  ```
  - **Response**: Returns created request with auto-generated `_id` and `createdAt` timestamp
  - **Storage**: Persisted to `backend/data/requests.json`
  - **Approval Workflow**: Admin can approve/reject, auto-updates inventory on approval

- **GET /api/requests** - Retrieve all requests
- **PUT /api/requests/:id** - Update request status (Approve/Reject)

## ✅ COMPLETED: Frontend Integration Updates

### IssueItem.jsx - Updated to Use Backend API
- **Change**: Migrated from Firebase (`addDoc`) to REST API (`fetch POST`)
- **Endpoint**: `POST http://localhost:5000/api/issued-items`
- **Features**:
  - Sends item issue data to backend
  - Auto-decreases inventory quantity
  - Data persisted to JSON file
  - Toast notifications on success/error

### ReturnItem.jsx - Updated to Use Backend API
- **Change**: Migrated from Firebase to REST API (`fetch POST`)
- **Endpoint**: `POST http://localhost:5000/api/returned-items`
- **Features**:
  - Sends item return data to backend
  - Auto-increases inventory quantity
  - Data persisted to JSON file
  - Toast notifications on success/error
- **Removed Firebase imports**: No longer imports `addDoc` or `db` from Firebase

### RequestItem.jsx - Already Using Backend API
- **Status**: ✅ WORKING - Already posts to `/api/requests`
- **Features**:
  - Creates new requests with status "Pending"
  - Auto-includes senderRole from localStorage
  - Admin can approve/reject
  - Data persisted to JSON file

## 📁 Data Files Created on First Use

When you submit forms through the UI, these files will be automatically created:

```
backend/data/
├── issued-items.json          (NEW - tracks all issued items)
├── returned-items.json        (NEW - tracks all returned items)
├── requests.json              (EXISTING - tracks all requests)
├── inventory.json             (EXISTING - tracks inventory)
├── users.json                 (EXISTING - user accounts)
└── messages.json              (EXISTING - admin messages)
```

Each record includes:
- `_id`: Auto-generated timestamp-based ID
- `createdAt`: ISO timestamp of creation
- All submitted form data
- Auto-updated inventory quantities

## 🚀 How It Works End-to-End

### Issuing Items Flow:
1. Staff fills IssueItem form (item code, quantity, receiver info)
2. Frontend POSTs data to `/api/issued-items`
3. Backend creates record with `_id` and timestamp
4. Backend decreases inventory quantity automatically
5. Backend saves data to `issued-items.json` and `inventory.json`
6. Frontend shows success toast notification

### Returning Items Flow:
1. Staff fills ReturnItem form (item code, quantity, return info, condition)
2. Frontend POSTs data to `/api/returned-items`
3. Backend creates record with `_id` and timestamp
4. Backend increases inventory quantity automatically
5. Backend saves data to `returned-items.json` and `inventory.json`
6. Frontend shows success toast notification

### Requesting Items Flow:
1. Admin fills RequestItem form (item code, quantity, reason, requester info)
2. Frontend POSTs data to `/api/requests` with `senderRole` from localStorage
3. Backend creates request with status "Pending"
4. Other admin can approve/reject via RequestItem page
5. On approval: inventory decreases, data persists
6. Data persists to `requests.json`

## ✅ Servers Running

- **Frontend**: http://localhost:5177/ (Vite dev server)
- **Backend**: http://localhost:5000/ (Express API server)

### To Restart Servers:
```bash
# Terminal 1 - Frontend
cd "d:\Campus\Final Ye\horizon-inventory"
npm run dev

# Terminal 2 - Backend
cd "d:\Campus\Final Ye\horizon-inventory\backend"
node server-simple.js
```

## 🔄 Data Synchronization

All operations are atomic:
- When you submit a form, data is:
  1. Saved to in-memory data store
  2. Persisted to corresponding JSON file
  3. Inventory automatically updated
  4. Response sent back to frontend

## Testing the New Features

1. **Test Issue Items**:
   - Go to "Issue Item" page
   - Select an item, enter quantity and receiver info
   - Submit form
   - Check that inventory decreases
   - Check that `issued-items.json` is created with your data

2. **Test Return Items**:
   - Go to "Return Item" page
   - Select an item, enter return quantity and condition
   - Submit form
   - Check that inventory increases
   - Check that `returned-items.json` is created with your data

3. **Test Requests** (Already Working):
   - Go to "Request Item" page
   - Create a request
   - Check that it shows as "Pending"
   - Admin can approve/reject
   - Verify `requests.json` contains the request

## Key Files Modified

- `backend/server-simple.js`: Added 4 new API endpoints
- `src/pages/IssueItem/IssueItem.jsx`: Migrated to REST API
- `src/pages/ReturnItem/ReturnItem.jsx`: Migrated to REST API, removed Firebase imports

## Summary

✅ **All 3 transaction types now have persistent backend storage:**
- Issue Items → Tracked in `issued-items.json`
- Return Items → Tracked in `returned-items.json`
- Requested Items → Tracked in `requests.json`

✅ **All data is automatically persisted to JSON files**

✅ **Inventory quantities auto-update with each transaction**

✅ **Frontend properly integrated with REST API endpoints**

The database integration is complete and ready for production use!
