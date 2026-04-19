# 📋 Transaction Reports - Testing Guide

## ✅ Test Scenarios

### Test 1: Reports Page Load
**Expected Results:**
- ✅ Reports page loads without errors
- ✅ Shows period selection buttons (1 Month, 3 Months, 1 Year)
- ✅ Download CSV button is visible
- ✅ 4 statistics cards display
- ✅ Three transaction tables are visible

**Steps:**
1. Log in as Admin
2. Click "Reports" in sidebar
3. Verify all UI elements render correctly

---

### Test 2: Period Selection - 1 Month
**Expected Results:**
- ✅ Only transactions from last 30 days show
- ✅ Statistics update automatically
- ✅ Active button styling applied (blue background)
- ✅ Table data filters correctly

**Steps:**
1. On Reports page, click "1 Month" button
2. Observe statistics cards update
3. Check that table only shows recent transactions
4. Verify button shows active state

**Test Data in Range:**
- PEN-001: 50 units (Jan 7, 2025) ✅
- NOTE-001: 30 units (Jan 14, 2025) ✅

---

### Test 3: Period Selection - 3 Months
**Expected Results:**
- ✅ All transactions from last 90 days show
- ✅ Includes 1 month data + any older data
- ✅ Statistics update
- ✅ Active button styling applied

**Steps:**
1. Click "3 Months" button
2. Verify statistics show higher numbers
3. Check table displays expected data
4. Verify button styling

---

### Test 4: Period Selection - 1 Year
**Expected Results:**
- ✅ All transactions from last 365 days show
- ✅ Includes all previous periods' data
- ✅ Statistics show maximum values
- ✅ Active button styling applied

**Steps:**
1. Click "1 Year" button
2. Verify all data displays
3. Statistics should show all transactions
4. All transactions appear in tables

---

### Test 5: Statistics Cards
**Expected Results for Provided Test Data:**
- Total Items Issued: 80 (50 + 30)
- Total Items Returned: 35 (20 + 15)
- Approved Requests: 6 (from existing data)
- Net Movement: 45 (80 - 35)

**Steps:**
1. Check each stat card value
2. Verify calculations are correct
3. Ensure numbers update when period changes

---

### Test 6: Issued Items Table
**Expected Results:**
- ✅ Shows all issued transactions
- ✅ Columns display: Code, Name, Qty, Department, Receiver, Description, Date
- ✅ Quantity highlighted in blue
- ✅ Item codes formatted correctly
- ✅ Rows are selectable/hoverable

**Steps:**
1. Look at "Issued Items" section
2. Verify PEN-001 row shows 50 units
3. Verify NOTE-001 row shows 30 units
4. Check all columns have data
5. Hover over rows to see highlight effect

**Test Data:**
```
PEN-001 | Ballpoint Pens | 50 | Admin | John Doe | Pens for office use | 1/7/2025
NOTE-001 | Notepads | 30 | HR | Jane Smith | Notepads for meetings | 1/14/2025
```

---

### Test 7: Returned Items Table
**Expected Results:**
- ✅ Shows all returned transactions
- ✅ Columns: Code, Name, Qty, Returned By, Condition, Date
- ✅ Condition shows colored badge
- ✅ "Good" items show green badge
- ✅ "Damage" items show red badge

**Steps:**
1. Look at "Returned Items" section
2. Verify PEN-001 row shows 20 units, "Good" condition (green badge)
3. Verify NOTE-001 row shows 15 units, "Damage" condition (red badge)
4. Check badge colors display correctly

**Test Data:**
```
PEN-001 | Ballpoint Pens | 20 | John Doe | Good (green) | 1/20/2025
NOTE-001 | Notepads | 15 | Jane Smith | Damage (red) | 1/22/2025
```

---

### Test 8: Approved Requests Table
**Expected Results:**
- ✅ Shows only APPROVED requests
- ✅ Columns: Code, Name, Qty, Requested By, Reason, Date
- ✅ Displays 6 approved requests from existing data
- ✅ All data columns populated

**Steps:**
1. Look at "Approved Requests" section
2. Verify 6 rows display (from existing requests)
3. Check all columns have data
4. Verify request information is accurate

---

### Test 9: CSV Download - File Generation
**Expected Results:**
- ✅ File downloads when button clicked
- ✅ Filename includes period: `Inventory-Report-1Month-YYYY-MM-DD.csv`
- ✅ File is valid CSV format
- ✅ Loading state shows "Downloading..."

**Steps:**
1. Click "Download CSV Report" button
2. Observe "Downloading..." state
3. File should download to default location
4. File should be named with period and date
5. Verify file opens in spreadsheet application

**Expected Filenames:**
- 1 Month: `Inventory-Report-1Month-2025-01-24.csv`
- 3 Months: `Inventory-Report-3Months-2025-01-24.csv`
- 1 Year: `Inventory-Report-1Year-2025-01-24.csv`

---

### Test 10: CSV Download - File Content
**Expected Results:**
- ✅ Header: "HORIZON CAMPUS - INVENTORY TRANSACTION REPORT"
- ✅ Generated date and time
- ✅ Period shown correctly
- ✅ Three sections: ISSUED ITEMS, RETURNED ITEMS, APPROVED REQUESTS
- ✅ SUMMARY section with statistics
- ✅ Proper CSV formatting (quotes, commas)

**CSV Structure:**
```
HORIZON CAMPUS - INVENTORY TRANSACTION REPORT
Generated: [timestamp]
Period: 1 Month

ISSUED ITEMS
Item Code,Item Name,Quantity,Issue Department,Receiver Name,Receiver ID,Description,Date
"PEN-001","Ballpoint Pens",50,"Admin","John Doe","S12345","Pens for office use","1/7/2025"
"NOTE-001","Notepads",30,"HR","Jane Smith","S12346","Notepads for meetings","1/14/2025"

RETURNED ITEMS
[similar format]

APPROVED REQUESTS
[similar format]

SUMMARY
Total Items Issued,80
Total Items Returned,35
Total Approved Requests,6
Total Requested Quantity,[sum]
```

---

### Test 11: Empty Period Scenario
**Expected Results:**
- ✅ When no data in period, shows "No [type] items in this period"
- ✅ Statistics show 0 values
- ✅ Download still works (empty CSV generated)

**Steps:**
1. Manually delete test data from JSON files
2. Select a period with no transactions
3. Verify "No items" message displays
4. Check statistics show zero
5. Try downloading empty report

---

### Test 12: Real-Time Updates
**Expected Results:**
- ✅ Page auto-refreshes every 10 seconds
- ✅ New transactions appear automatically
- ✅ Statistics update without page reload
- ✅ No polling errors in console

**Steps:**
1. Open Reports page
2. Create a new issued item in another tab
3. Wait 10 seconds
4. Verify new item appears in table
5. Check statistics updated

**Process:**
- Create new issued item → Reports updates automatically
- Create new returned item → Reports updates automatically
- Approve a request → Reports updates automatically

---

### Test 13: Role-Based Access
**Expected Results:**
- ✅ Admin can access Reports page
- ✅ Staff cannot access Reports page
- ✅ Staff redirected to Inventory when accessing /reports

**Steps:**
1. Log in as Admin, verify Reports link visible in sidebar
2. Navigate to /reports, page loads
3. Log out, log in as Staff
4. Verify Reports link NOT in sidebar
5. Try accessing /reports directly
6. Verify redirected to /inventory

---

### Test 14: Responsive Design - Mobile
**Expected Results:**
- ✅ Page works on mobile (375px width)
- ✅ Period buttons stack vertically
- ✅ Tables scroll horizontally if needed
- ✅ Stat cards stack to single column
- ✅ Download button visible and accessible

**Steps:**
1. Open browser DevTools
2. Set viewport to mobile (iPhone 12: 390x844)
3. Verify layout adapts
4. Test all buttons are clickable
5. Verify tables readable

---

### Test 15: Error Handling
**Expected Results:**
- ✅ If API fails, shows error toast
- ✅ "Loading..." displays while fetching
- ✅ Page doesn't crash on network error
- ✅ Retry functionality works

**Steps:**
1. Stop backend server
2. Try loading Reports page
3. Should show error message
4. Restart backend
5. Page should recover

---

## 🔍 Manual Testing Checklist

- [ ] Reports page accessible by Admin only
- [ ] All three period buttons work correctly
- [ ] Statistics calculate correctly for each period
- [ ] Issued Items table displays all columns
- [ ] Returned Items table shows condition badges correctly
- [ ] Approved Requests table displays only approved items
- [ ] CSV download generates correct filename
- [ ] CSV file contains correct data structure
- [ ] Download button shows loading state
- [ ] Empty state message displays when no data
- [ ] Page auto-refreshes every 10 seconds
- [ ] Mobile layout responsive and functional
- [ ] Error handling works if API fails
- [ ] Role-based access control enforced
- [ ] Data formatting in CSV is correct

---

## 🧪 Backend Data Setup

**Test data already created in:**
- `backend/data/issued-items.json` - 2 items
- `backend/data/returned-items.json` - 2 items
- `backend/data/requests.json` - 6 approved requests

**To add more test data:**
1. Use IssueItem page to create new issued items
2. Use ReturnItem page to create new returned items
3. Use RequestItem page (admin) to approve more requests
4. All data automatically appears in Reports page

---

## 📊 Expected Test Results

After running all tests, you should see:
- ✅ All UI elements render correctly
- ✅ Period filtering works for all 3 periods
- ✅ Statistics calculations accurate
- ✅ All three transaction tables populate
- ✅ CSV exports with correct format and data
- ✅ Real-time updates working
- ✅ Mobile responsive layout
- ✅ Error handling and loading states
- ✅ Role-based access working

---

**Status**: Ready for User Acceptance Testing (UAT)
