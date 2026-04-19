import React, { useState, useEffect } from 'react';
import { AiOutlineBarChart, AiOutlineWarning, AiOutlineCloseCircle, AiOutlineDollarCircle } from 'react-icons/ai';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [inventory, setInventory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await fetch('http://localhost:5000/api/inventory');
        if (invRes.ok) setInventory(await invRes.json());

        const msgRes = await fetch('http://localhost:5000/api/messages');
        if (msgRes.ok) {
           const msgData = await msgRes.json();
           setMessages(msgData.filter(m => m.senderRole !== 'Admin'));
        }
      } catch (e) {
        console.error("MongoDB Backend Connection Error", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 4000); // Poll MongoDB every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const totalItems = inventory.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  const lowStockItems = inventory.filter(item => Number(item.quantity) > 0 && Number(item.quantity) < 10).length;
  const outOfStock = inventory.filter(item => Number(item.quantity) === 0).length;
  const totalValue = inventory.reduce((acc, item) => acc + ((Number(item.quantity) || 0) * (Number(item.cost) || 0)), 0);

  // Get unique categories from inventory
  const categories = ['All', ...new Set(inventory.map(item => item.category).filter(Boolean))].sort();

  // Filter inventory by search term and category
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item._id || item.id)?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.dashboardContainer}>
      {/* Overview Cards */}
      <div className={styles.overviewCards}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Total Inventory Items</div>
            <div className={`${styles.iconContainer} ${styles.blue}`}>
              <AiOutlineBarChart />
            </div>
          </div>
          <div className={styles.cardValue}>{loading ? '...' : totalItems}</div>
          <div className={styles.cardFooter}>Across all categories</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Low Stock Alerts</div>
            <div className={`${styles.iconContainer} ${styles.orange}`}>
              <AiOutlineWarning />
            </div>
          </div>
          <div className={styles.cardValue}>{loading ? '...' : lowStockItems}</div>
          <div className={styles.cardFooter}>Items below 10 quantity</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Out of Stock</div>
            <div className={`${styles.iconContainer} ${styles.red}`}>
              <AiOutlineCloseCircle />
            </div>
          </div>
          <div className={styles.cardValue}>{loading ? '...' : outOfStock}</div>
          <div className={styles.cardFooter}>Needs immediate restock</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Total Inventory Value</div>
            <div className={`${styles.iconContainer} ${styles.green}`}>
              <AiOutlineDollarCircle />
            </div>
          </div>
          <div className={styles.cardValue}>{loading ? '...' : `LKR ${totalValue.toLocaleString()}`}</div>
          <div className={styles.cardFooter}>Total asset value</div>
        </div>
      </div>

      {/* Recent Inventory Table */}
      <div className={styles.recentInventory}>
        <div className={styles.sectionHeader}>
          <h3>Recent Inventory</h3>
          <div className={styles.searchFilters}>
            <input 
              type="text" 
              placeholder="Search Items.." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className={styles.categorySelect}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.slice(0, 3).map((item) => (
                <tr key={item._id || item.id}>
                  <td>{(item._id || item.id).slice(0, 6)}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td className={item.quantity > 0 ? styles.statusInStock : styles.statusOutOfStock}>
                    {item.quantity > 0 ? 'In Stock' : 'Empty'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className={styles.pagination}>
          <span>Showing 1 to {Math.min(3, filteredInventory.length)} of {filteredInventory.length} Items</span>
          <div className={styles.paginationControls}>
            <button className={styles.pageBtn}>Previous</button>
            <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
            <button className={styles.pageBtn}>2</button>
            <button className={styles.pageBtn}>Next</button>
          </div>
        </div>
      </div>

      {/* Admin Messages Section */}
      <div className={styles.recentInventory} style={{ marginTop: '2rem' }}>
        <div className={styles.sectionHeader}>
          <h3>Staff Messages & Requests</h3>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Sender</th>
                <th>Message Content</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>No new messages from staff.</td></tr>
              ) : (
                messages.map(msg => (
                  <tr key={msg._id || msg.id}>
                    <td>{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Just now'}</td>
                    <td>
                      <div style={{fontWeight: '600'}}>{msg.name}</div>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{msg.email}</div>
                    </td>
                    <td style={{maxWidth: '300px', whiteSpace: 'normal', lineHeight: '1.4'}}>{msg.message}</td>
                    <td>
                      <span style={{
                        padding: '4px 10px', 
                        background: 'rgba(59, 130, 246, 0.15)', 
                        color: '#60a5fa', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {msg.status || 'Received'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
