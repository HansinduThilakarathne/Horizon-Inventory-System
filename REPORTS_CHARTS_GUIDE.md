# 📊 Reports Page with Charts - Complete Guide

## Overview
The Reports page has been enhanced with comprehensive charts and visualizations to provide admins with better insights into inventory transactions.

## Features Added

### 1. **Three Interactive Charts**

#### Daily Activity Chart (Line Chart)
- **Location**: Top-left of charts section
- **Shows**: Daily issued and returned item quantities
- **Data Points**: 
  - Blue line = Items issued per day
  - Green line = Items returned per day
- **Interaction**: Hover to see exact values for any day

#### Issued vs Returned Comparison (Pie Chart)
- **Location**: Top-right of charts section
- **Shows**: Proportion of total items issued vs returned
- **Colors**:
  - Blue = Total items issued
  - Green = Total items returned
- **Display**: Percentage labels on chart segments

#### Top 5 Items Issued (Bar Chart)
- **Location**: Full width below pie chart
- **Shows**: Most frequently issued inventory items
- **Order**: Sorted by quantity (highest to lowest)
- **Data**: Item names and total quantities

### 2. **Period Selection**
- 📅 **1 Month** - Last 30 days of transactions
- 📅 **3 Months** - Last 90 days of transactions
- 📅 **1 Year** - Last 365 days of transactions
- Charts automatically update when period changes

### 3. **Statistics Cards** (4 KPIs)
- **Total Items Issued**: Sum of all items given out
- **Total Items Returned**: Sum of all items returned
- **Approved Requests**: Count of approved staff requests
- **Net Movement**: Issued minus returned (inventory flow)

### 4. **Detailed Transaction Tables**

#### Issued Items Table
| Column | Description |
|--------|-------------|
| Item Code | Unique item identifier |
| Item Name | Full item name |
| Quantity | Number of units issued |
| Department | Department receiving items |
| Receiver | Name of person receiving |
| Description | Additional details |
| Date | Transaction date |

#### Returned Items Table
| Column | Description |
|--------|-------------|
| Item Code | Unique item identifier |
| Item Name | Full item name |
| Quantity | Number of units returned |
| Returned By | Name of person returning |
| Condition | Good/Damage status badge |
| Return Date | Transaction date |

#### Approved Requests Table
| Column | Description |
|--------|-------------|
| Item Code | Unique item identifier |
| Item Name | Full item name |
| Quantity | Requested quantity |
| Requested By | Staff member name |
| Reason | Request reason |
| Approval Date | When request was approved |

### 5. **CSV Export Functionality**
- **Button**: Download CSV Report
- **Filename Format**: `Inventory-Report-[Period]-[Date].csv`
- **Example**: `Inventory-Report-1Month-2026-04-19.csv`
- **Contents**:
  - Header with report title and generation date
  - Issued Items section with all transactions
  - Returned Items section with all transactions
  - Approved Requests section with all transactions
  - Summary statistics at the end

## Technical Implementation

### Chart Library
- **Library**: Recharts 3.8.1
- **Charts Used**:
  - LineChart for daily activity trends
  - PieChart for issued vs returned comparison
  - BarChart for top items ranking

### Chart Features
- Responsive design - adapts to screen size
- Interactive tooltips - hover for details
- Custom styling - matches dark theme
- Color scheme:
  - Blue (#3b82f6) for issued items
  - Green (#22c55e) for returned items
  - Chart borders and text adapt to theme

### Data Processing
Functions that prepare chart data:
```javascript
getDailyChartData()        // Group transactions by date
getComparisonChartData()   // Calculate issued vs returned totals
getTopItemsData()          // Get top 5 most issued items
```

### Auto-Refresh
- Charts update every 10 seconds
- Data fetched from backend APIs:
  - `/api/issued-items`
  - `/api/returned-items`
  - `/api/requests` (filtered for approved only)

## Styling
CSS Classes:
- `.chartsGrid` - Grid layout for charts
- `.chartCard` - Individual chart container
- `.fullWidthChart` - Make chart span full width
- All charts styled with theme variables for light/dark mode support

## Usage Instructions

### For Admins
1. Navigate to **Reports** from sidebar
2. Select desired time period (1 Month, 3 Months, 1 Year)
3. View charts and statistics
4. Scroll down to see detailed transaction tables
5. Click "Download CSV Report" to export data

### Period Selection Impact
- Changes all charts, statistics, and tables
- Data automatically filters to selected period
- Older transactions are excluded from display

### Data Interpretation

**Daily Activity Chart**
- Watch trends over time
- Identify peaks in issuance or returns
- Spot any unusual patterns

**Issued vs Returned Pie Chart**
- If blue > green: More items going out than coming back
- If green > blue: Good inventory recovery rate
- Balanced = Healthy inventory flow

**Top 5 Items Chart**
- Shows which items are most frequently used
- Helps with inventory planning
- Identifies high-demand items

## Export Format (CSV)

Example CSV output structure:
```
HORIZON CAMPUS - INVENTORY TRANSACTION REPORT
Generated: [Timestamp]
Period: [Selected Period]

ISSUED ITEMS
Item Code,Item Name,Quantity,Issue Department,Receiver Name,Receiver ID,Description,Date
PEN-001,"Ballpoint Pens",50,"Admin","John Doe","S12345","Office use","1/7/2026, 10:30:00 AM"

RETURNED ITEMS
Item Code,Item Name,Quantity,Returned By,Returned ID,Condition,Date
PEN-001,"Ballpoint Pens",20,"John Doe","S12345","Good","1/20/2026, 11:15:00 AM"

APPROVED REQUESTS
Item Code,Item Name,Quantity,Requested By,Requested ID,Reason,Date
NOTE-001,"Notepads",15,"Jane Smith","S12346","Meeting notes","1/22/2026, 2:45:00 PM"

SUMMARY
Total Items Issued,50
Total Items Returned,20
Total Approved Requests,1
Total Requested Quantity,15
```

## Access Control
- **Admin Only**: Full access to all reports and charts
- **Staff**: Cannot access Reports page (redirect to Staff Dashboard)
- **Authentication**: Required (checked via JWT token)

## Performance Notes
- Charts render efficiently even with large datasets
- Auto-refresh every 10 seconds (configurable)
- Responsive design works on desktop and mobile devices
- Charts automatically resize based on container width

## Troubleshooting

### Charts Not Displaying
1. Verify backend is running on port 5000
2. Check browser console for API errors
3. Ensure data files exist in `backend/data/`

### CSV Download Not Working
1. Check browser permissions
2. Verify localStorage has user role (Admin)
3. Check browser console for download errors

### Data Not Updating
1. Backend APIs returning data but not updating?
2. Check network tab in browser dev tools
3. Verify 10-second refresh interval is working

## Future Enhancements
- Custom date range picker
- Additional chart types (scatter, area)
- Comparison between multiple time periods
- Export to PDF format
- Email report delivery
- Scheduled report generation
