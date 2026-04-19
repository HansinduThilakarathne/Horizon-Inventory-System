# Cost Tracking Implementation Guide

## Overview
The inventory system now includes comprehensive cost tracking functionality. You can set a unit cost for each inventory item and automatically calculate the total inventory value.

## Features Implemented

### 1. **Inventory Page Enhancements**
- **Unit Cost Column**: View the cost per unit for each item
- **Total Value Column**: Automatically displays `Unit Cost × Quantity` for each item
- **Cost Editor Modal**: Click on the cost button to open a modal where you can:
  - View current item details (name, quantity)
  - See current cost and total value
  - See real-time calculation of new total value as you edit
  - Save new cost to database

### 2. **Dashboard Enhancements**
- **Total Inventory Value Card**: Displays the sum of all `(Unit Cost × Quantity)` across entire inventory
- Formatted in LKR currency (e.g., "LKR 1,234,567.89")
- Updates in real-time as item costs change

## How to Use

### Setting Item Costs

1. **Navigate to Inventory Page**
   - Click "Inventory" in the sidebar

2. **Find the Item**
   - Use the search bar to find your item by code or name
   - Or scroll through the inventory table

3. **Click Unit Cost Button**
   - In the "Unit Cost" column, click the cost button (shows "$0.00" for unset costs)
   - The Cost Editor modal will open

4. **Edit Cost**
   - Enter the unit cost in the input field (supports decimals, e.g., 500.50)
   - The modal will show real-time calculation:
     - **Current Total Value**: Current cost × current quantity
     - **New Total Value**: New cost × current quantity

5. **Save Cost**
   - Click "Save Cost" button
   - The modal closes and the table updates immediately

### Viewing Total Inventory Value

**On Inventory Page:**
- Scroll to the bottom of the Inventory page
- See the "Total Inventory Value" card with:
  - Large green total value display
  - Count of items in inventory

**On Dashboard:**
- The 4th card shows "Total Inventory Value"
- Shows LKR formatted total
- Includes icon and footer text

## Technical Details

### Data Structure

Each inventory item now includes a `cost` field:

```json
{
  "_id": "STA0001",
  "name": "Battery AA",
  "category": "Batteries",
  "quantity": 38,
  "supplier": "General",
  "cost": 0,
  "createdAt": "2026-04-18T00:00:00.000Z"
}
```

### API Endpoints

**GET Inventory:**
```
GET http://localhost:5000/api/inventory
```

**Update Item Cost:**
```
PUT http://localhost:5000/api/inventory/:id
Body: { "cost": 500.50 }
```

### Frontend Components

**File:** `src/pages/Inventory/Inventory.jsx`

Key functions:
- `calculateTotalValue()`: Returns sum of (cost × quantity) for all items
- `openCostModal(item)`: Opens cost editor modal for selected item
- `handleSaveCost()`: Saves cost to backend via PUT request

Key state:
- `showCostModal`: Boolean to control modal visibility
- `selectedItem`: Currently selected item for cost editing
- `itemCost`: Current value in cost input field

**File:** `src/pages/Dashboard/Dashboard.jsx`

Updated calculation:
- `totalValue = inventory.reduce((acc, item) => acc + ((item.quantity || 0) * (item.cost || 0)), 0)`

### Backend Support

**File:** `backend/server-simple.js`

The PUT endpoint already supports the cost field:
```javascript
app.put('/api/inventory/:id', async (req, res) => {
  const index = inventory.findIndex(i => i._id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  inventory[index] = { ...inventory[index], ...req.body };
  saveData();
  res.json(inventory[index]);
});
```

## Database Update

All 120 inventory items have been updated with the `cost` field (initialized to 0).

To check if cost field exists:
```bash
# In backend directory
node -e "const fs = require('fs'); const inv = JSON.parse(fs.readFileSync('data/inventory.json', 'utf8')); console.log(inv[0]);"
```

## Styling

### CSS Classes Added

**File:** `src/pages/Inventory/Inventory.module.css`

- `.modalOverlay`: Modal background with blur effect
- `.modalContent`: Modal dialog styling
- `.itemInfo`: Item details display in modal
- `.totalValueCard`: Total value display card
- `.totalValueAmount`: Large value text styling
- `.costBtn`: Cost button styling with green gradient

## Example Workflows

### Scenario 1: Set Cost for Battery AA
1. Go to Inventory page
2. Search for "Battery AA"
3. Click the "$0.00" button in Unit Cost column
4. Enter cost: `250.50`
5. See New Total Value: 250.50 × 38 = 9,519.00
6. Click "Save Cost"
7. Dashboard updates to show new total inventory value

### Scenario 2: Check Total Inventory Value
1. Go to Dashboard
2. The "Total Inventory Value" card shows sum of all (cost × qty)
3. Items without cost (0) don't contribute to total
4. Go to Inventory page to set costs

### Scenario 3: Update Multiple Item Costs
1. Go to Inventory page
2. For each item, click Unit Cost button
3. Set appropriate cost
4. Watch Dashboard update in real-time
5. Total value increases as you set more costs

## Notes

- **Default Cost**: All items start with cost = 0. Set costs as needed.
- **Cost Calculation**: Total Value = Unit Cost × Quantity. Updates automatically.
- **Real-time Updates**: Dashboard refreshes data every 4 seconds from backend.
- **Persistence**: Costs are saved to `backend/data/inventory.json`
- **Currency**: All values displayed in LKR (Sri Lankan Rupees)
- **Precision**: Costs support 2 decimal places (e.g., 500.50)

## Troubleshooting

**Problem**: Cost modal doesn't open
- Solution: Ensure backend is running on port 5000

**Problem**: Cost not saving
- Solution: Check browser console for errors. Verify backend API is accessible.

**Problem**: Dashboard showing old total value
- Solution: Wait 4 seconds for automatic data refresh, or manually refresh page

**Problem**: Cost button showing "$0.00"
- Solution: This is normal for items without set cost. Click to set cost.

## Future Enhancements

Possible additions:
- Bulk cost import from CSV/Excel
- Cost history tracking
- Deprecation/adjustments
- Cost by supplier/batch
- Purchase price vs selling price tracking
- Cost breakdown by category
- Financial reports (cost of goods sold, inventory valuation)
