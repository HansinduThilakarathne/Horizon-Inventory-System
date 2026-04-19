import React, { useState, useEffect } from 'react';
import { AiOutlineDownload, AiOutlineCalendar } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Reports.module.css';

const Reports = () => {
  const [issuedItems, setIssuedItems] = useState([]);
  const [returnedItems, setReturnedItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('1month');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [issRes, retRes, reqRes] = await Promise.all([
          fetch('http://localhost:5000/api/issued-items'),
          fetch('http://localhost:5000/api/returned-items'),
          fetch('http://localhost:5000/api/requests')
        ]);

        if (issRes.ok) setIssuedItems(await issRes.json());
        if (retRes.ok) setReturnedItems(await retRes.json());
        if (reqRes.ok) {
          const allRequests = await reqRes.json();
          // Filter only approved requests
          setRequests(allRequests.filter(r => r.status === 'Approved'));
        }
      } catch (e) {
        console.error('Error fetching data:', e);
        toast.error('Failed to load transaction data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Calculate date range based on selected period
  const getDateRange = (period) => {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    return { startDate, endDate };
  };

  // Filter transactions by date range
  const filterByDateRange = (items, period) => {
    const { startDate, endDate } = getDateRange(period);
    return items.filter(item => {
      const itemDate = new Date(item.createdAt || item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  const filteredIssuedItems = filterByDateRange(issuedItems, selectedPeriod);
  const filteredReturnedItems = filterByDateRange(returnedItems, selectedPeriod);
  const filteredRequests = filterByDateRange(requests, selectedPeriod);

  // Calculate statistics
  const stats = {
    totalIssued: filteredIssuedItems.reduce((sum, item) => sum + item.numberOfItems, 0),
    totalReturned: filteredReturnedItems.reduce((sum, item) => sum + item.numberOfItems, 0),
    totalApprovedRequests: filteredRequests.length,
    totalRequestQuantity: filteredRequests.reduce((sum, req) => sum + req.quantity, 0)
  };

  // Prepare chart data - Daily activity
  const getDailyChartData = () => {
    const dateMap = {};
    
    filteredIssuedItems.forEach(item => {
      const date = new Date(item.createdAt).toLocaleDateString();
      dateMap[date] = dateMap[date] || { date, issued: 0, returned: 0 };
      dateMap[date].issued += item.numberOfItems;
    });
    
    filteredReturnedItems.forEach(item => {
      const date = new Date(item.createdAt).toLocaleDateString();
      dateMap[date] = dateMap[date] || { date, issued: 0, returned: 0 };
      dateMap[date].returned += item.numberOfItems;
    });
    
    return Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Prepare chart data - Issued vs Returned comparison
  const getComparisonChartData = () => {
    return [
      { name: 'Issued', value: stats.totalIssued, fill: '#3b82f6' },
      { name: 'Returned', value: stats.totalReturned, fill: '#22c55e' }
    ];
  };

  // Prepare chart data - Top items issued
  const getTopItemsData = () => {
    const itemMap = {};
    
    filteredIssuedItems.forEach(item => {
      if (!itemMap[item.itemCode]) {
        itemMap[item.itemCode] = { name: item.itemName, quantity: 0 };
      }
      itemMap[item.itemCode].quantity += item.numberOfItems;
    });
    
    return Object.values(itemMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  // Generate CSV content
  const generateCSV = () => {
    let csv = 'HORIZON CAMPUS - INVENTORY TRANSACTION REPORT\n';
    csv += `Generated: ${new Date().toLocaleString()}\n`;
    csv += `Period: ${selectedPeriod === '1month' ? '1 Month' : selectedPeriod === '3months' ? '3 Months' : '1 Year'}\n\n`;

    // Issued Items
    csv += 'ISSUED ITEMS\n';
    csv += 'Item Code,Item Name,Quantity,Issue Department,Receiver Name,Receiver ID,Description,Date\n';
    filteredIssuedItems.forEach(item => {
      csv += `"${item.itemCode}","${item.itemName}",${item.numberOfItems},"${item.issueDepartment}","${item.receiverName}","${item.receiverStudentStaffId}","${item.description || '-'}","${new Date(item.createdAt).toLocaleString()}"\n`;
    });

    csv += '\n\nRETURNED ITEMS\n';
    csv += 'Item Code,Item Name,Quantity,Returned By,Returned ID,Condition,Date\n';
    filteredReturnedItems.forEach(item => {
      csv += `"${item.itemCode}","${item.itemName}",${item.numberOfItems},"${item.returnedBy}","${item.returnedById}","${item.condition}","${new Date(item.createdAt).toLocaleString()}"\n`;
    });

    csv += '\n\nAPPROVED REQUESTS\n';
    csv += 'Item Code,Item Name,Quantity,Requested By,Requested ID,Reason,Date\n';
    filteredRequests.forEach(req => {
      csv += `"${req.itemCode}","${req.itemName}",${req.quantity},"${req.requestedBy}","${req.requestedById}","${req.reason || '-'}","${new Date(req.createdAt).toLocaleString()}"\n`;
    });

    csv += '\n\nSUMMARY\n';
    csv += `Total Items Issued,${stats.totalIssued}\n`;
    csv += `Total Items Returned,${stats.totalReturned}\n`;
    csv += `Total Approved Requests,${stats.totalApprovedRequests}\n`;
    csv += `Total Requested Quantity,${stats.totalRequestQuantity}\n`;

    return csv;
  };

  // Download report
  const handleDownload = async () => {
    try {
      setDownloading(true);
      const csv = generateCSV();
      const element = document.createElement('a');
      const file = new Blob([csv], { type: 'text/csv' });
      element.href = URL.createObjectURL(file);
      
      const periodText = selectedPeriod === '1month' ? '1Month' : selectedPeriod === '3months' ? '3Months' : '1Year';
      element.download = `Inventory-Report-${periodText}-${new Date().toISOString().split('T')[0]}.csv`;
      
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast.success(`Report downloaded successfully!`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Transaction Reports</h1>
          <p>View and download all inventory transactions and approvals</p>
        </div>
      </div>

      {/* Period Selection */}
      <div className={styles.periodSelection}>
        <div className={styles.periodButtons}>
          <button
            className={`${styles.periodBtn} ${selectedPeriod === '1month' ? styles.active : ''}`}
            onClick={() => setSelectedPeriod('1month')}
          >
            <AiOutlineCalendar /> 1 Month
          </button>
          <button
            className={`${styles.periodBtn} ${selectedPeriod === '3months' ? styles.active : ''}`}
            onClick={() => setSelectedPeriod('3months')}
          >
            <AiOutlineCalendar /> 3 Months
          </button>
          <button
            className={`${styles.periodBtn} ${selectedPeriod === '1year' ? styles.active : ''}`}
            onClick={() => setSelectedPeriod('1year')}
          >
            <AiOutlineCalendar /> 1 Year
          </button>
        </div>
        <button 
          className={styles.downloadBtn}
          onClick={handleDownload}
          disabled={downloading}
        >
          <AiOutlineDownload /> {downloading ? 'Downloading...' : 'Download CSV Report'}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Items Issued</div>
          <div className={styles.statValue}>{stats.totalIssued}</div>
          <div className={styles.statSubtext}>{filteredIssuedItems.length} transactions</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Items Returned</div>
          <div className={styles.statValue}>{stats.totalReturned}</div>
          <div className={styles.statSubtext}>{filteredReturnedItems.length} transactions</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Approved Requests</div>
          <div className={styles.statValue}>{stats.totalApprovedRequests}</div>
          <div className={styles.statSubtext}>{stats.totalRequestQuantity} total qty</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Net Movement</div>
          <div className={styles.statValue}>{stats.totalIssued - stats.totalReturned}</div>
          <div className={styles.statSubtext}>Issued - Returned</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        {/* Daily Activity Chart */}
        <div className={styles.chartCard}>
          <h3>Daily Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getDailyChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }} />
              <Legend />
              <Line type="monotone" dataKey="issued" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
              <Line type="monotone" dataKey="returned" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Issued vs Returned Comparison */}
        <div className={styles.chartCard}>
          <h3>Issued vs Returned</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getComparisonChartData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getComparisonChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Items Issued */}
        <div className={`${styles.chartCard} ${styles.fullWidthChart}`}>
          <h3>Top 5 Items Issued</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getTopItemsData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }} />
              <Bar dataKey="quantity" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Tables */}
      <div className={styles.tablesContainer}>
        
        {/* Issued Items Table */}
        <div className={styles.tableSection}>
          <h2>Issued Items</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Department</th>
                  <th>Receiver</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className={styles.emptyCell}>Loading...</td></tr>
                ) : filteredIssuedItems.length === 0 ? (
                  <tr><td colSpan="7" className={styles.emptyCell}>No issued items in this period</td></tr>
                ) : (
                  filteredIssuedItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className={styles.code}>{item.itemCode}</td>
                      <td>{item.itemName}</td>
                      <td className={styles.quantity}>{item.numberOfItems}</td>
                      <td>{item.issueDepartment}</td>
                      <td>{item.receiverName}</td>
                      <td className={styles.description}>{item.description || '-'}</td>
                      <td className={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Returned Items Table */}
        <div className={styles.tableSection}>
          <h2>Returned Items</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Returned By</th>
                  <th>Condition</th>
                  <th>Return Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredReturnedItems.length === 0 ? (
                  <tr><td colSpan="6" className={styles.emptyCell}>No returned items in this period</td></tr>
                ) : (
                  filteredReturnedItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className={styles.code}>{item.itemCode}</td>
                      <td>{item.itemName}</td>
                      <td className={styles.quantity}>{item.numberOfItems}</td>
                      <td>{item.returnedBy}</td>
                      <td>
                        <span className={`${styles.conditionBadge} ${styles[item.condition?.toLowerCase()]}`}>
                          {item.condition}
                        </span>
                      </td>
                      <td className={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approved Requests Table */}
        <div className={styles.tableSection}>
          <h2>Approved Requests</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Requested By</th>
                  <th>Reason</th>
                  <th>Approval Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr><td colSpan="6" className={styles.emptyCell}>No approved requests in this period</td></tr>
                ) : (
                  filteredRequests.map((req, idx) => (
                    <tr key={idx}>
                      <td className={styles.code}>{req.itemCode}</td>
                      <td>{req.itemName}</td>
                      <td className={styles.quantity}>{req.quantity}</td>
                      <td>{req.requestedBy}</td>
                      <td className={styles.description}>{req.reason || '-'}</td>
                      <td className={styles.date}>{new Date(req.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

