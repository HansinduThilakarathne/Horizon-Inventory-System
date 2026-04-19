import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { AiOutlineDownload } from 'react-icons/ai';
import { toast } from 'react-toastify';
import styles from './Reports.module.css';

const STOCK_DATA = [
  { category: 'Furniture', quantity: 150 },
  { category: 'Electronics', quantity: 45 },
  { category: 'Stationery', quantity: 380 },
  { category: 'Cleaning', quantity: 85 },
];

const VALUE_DATA = [
  { name: 'Furniture', value: 45000 },
  { name: 'Electronics', value: 85000 },
  { name: 'Stationery', value: 12000 },
  { name: 'Cleaning', value: 3000 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const TREND_DATA = [
  { date: '1-Mar', issued: 40, returned: 24 },
  { date: '8-Mar', issued: 30, returned: 13 },
  { date: '15-Mar', issued: 20, returned: 38 },
  { date: '22-Mar', issued: 27, returned: 39 },
  { date: '29-Mar', issued: 18, returned: 48 },
];

const LOW_STOCK = [
  { id: 'ITM101', name: 'Whiteboard Markers (Black)', quantity: 4, reorderLevel: 10 },
  { id: 'ITM105', name: 'A4 Paper Rims', quantity: 2, reorderLevel: 20 },
  { id: 'ITM203', name: 'HDMI Cables', quantity: 8, reorderLevel: 15 },
];

const Reports = () => {
  const [inventory, setInventory] = useState([]);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/inventory');
        if (res.ok) setInventory(await res.json());
      } catch (e) {
        console.error(e);
      }
    };
    fetchInventory();
  }, []);

  const downloadReport = async (period) => {
    setDownloading(period);
    try {
      const now = new Date();
      let startDate = new Date();

      if (period === '1month') {
        startDate.setMonth(now.getMonth() - 1);
      } else if (period === '3months') {
        startDate.setMonth(now.getMonth() - 3);
      } else if (period === '1year') {
        startDate.setFullYear(now.getFullYear() - 1);
      }

      // Generate CSV report
      const reportData = generateReportData(period, startDate, now);
      downloadCSV(reportData, period);
      toast.success(`${period === '1month' ? '1 Month' : period === '3months' ? '3 Months' : '1 Year'} report downloaded!`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to download report');
    } finally {
      setDownloading(null);
    }
  };

  const generateReportData = (period, startDate, endDate) => {
    const report = [
      ['HORIZON CAMPUS - INVENTORY REPORT'],
      [`Period: ${period === '1month' ? 'Last 1 Month' : period === '3months' ? 'Last 3 Months' : 'Last 1 Year'}`],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['INVENTORY SUMMARY'],
      ['Item Code', 'Item Name', 'Category', 'Current Quantity', 'Supplier', 'Status'],
      ...inventory.map(item => [
        item._id || item.id,
        item.name,
        item.category,
        item.quantity,
        item.supplier,
        item.quantity > 0 ? 'In Stock' : 'Out of Stock'
      ]),
      [],
      ['STOCK SUMMARY BY CATEGORY'],
      ['Category', 'Total Items'],
      ...STOCK_DATA.map(cat => [cat.category, cat.quantity]),
      [],
      ['VALUE DISTRIBUTION'],
      ['Category', 'Value (LKR)'],
      ...VALUE_DATA.map(val => [val.name, val.value]),
    ];
    return report;
  };

  const downloadCSV = (data, period) => {
    const csv = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const periodName = period === '1month' ? '1Month' : period === '3months' ? '3Months' : '1Year';
    a.download = `Inventory_Report_${periodName}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  return (
    <div className={styles.reportsContainer}>
      {/* Download Buttons Section */}
      <div className={styles.downloadSection}>
        <div className={styles.downloadHeader}>
          <h2>Quick Download Reports</h2>
          <p>Export inventory reports for specific time periods</p>
        </div>
        <div className={styles.downloadButtons}>
          <button 
            className={styles.downloadBtn}
            onClick={() => downloadReport('1month')}
            disabled={downloading === '1month'}
          >
            <AiOutlineDownload />
            {downloading === '1month' ? 'Downloading...' : '1 Month Report'}
          </button>
          <button 
            className={styles.downloadBtn}
            onClick={() => downloadReport('3months')}
            disabled={downloading === '3months'}
          >
            <AiOutlineDownload />
            {downloading === '3months' ? 'Downloading...' : '3 Months Report'}
          </button>
          <button 
            className={styles.downloadBtn}
            onClick={() => downloadReport('1year')}
            disabled={downloading === '1year'}
          >
            <AiOutlineDownload />
            {downloading === '1year' ? 'Downloading...' : '1 Year Report'}
          </button>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        {/* Current Stock Levels */}
        <div className={styles.chartCard}>
          <h3>Current Stock Levels by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={STOCK_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="category" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444' }} />
              <Legend />
              <Bar dataKey="quantity" fill="#4A7C2A" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Value Distribution */}
        <div className={styles.chartCard}>
          <h3>Inventory Value Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={VALUE_DATA}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {VALUE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#222', borderColor: '#444' }} 
                formatter={(value) => [`LKR ${value.toLocaleString()}`, 'Value']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Trends */}
        <div className={`${styles.chartCard} ${styles.fullWidth}`}>
          <h3>Transaction Trends (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={TREND_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444' }} />
              <Legend />
              <Line type="monotone" dataKey="issued" stroke="#D32F2F" strokeWidth={2} />
              <Line type="monotone" dataKey="returned" stroke="#2A52BE" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className={styles.lowStockSection}>
        <h3 style={{ color: '#D32F2F', marginBottom: '1rem' }}>Low Stock Alerts</h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ITEM ID</th>
                <th>ITEM NAME</th>
                <th>CURRENT QUANTITY</th>
                <th>REORDER LEVEL</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {LOW_STOCK.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td style={{ color: '#F44336', fontWeight: 'bold' }}>{item.quantity}</td>
                  <td>{item.reorderLevel}</td>
                  <td>
                    <button style={{
                      backgroundColor: '#2A52BE',
                      color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer'
                    }}>
                      Order Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
