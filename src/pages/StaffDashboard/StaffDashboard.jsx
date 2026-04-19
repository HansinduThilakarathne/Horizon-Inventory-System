import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineFileText, AiOutlineWarning, AiOutlineLogout, AiOutlineArrowRight } from 'react-icons/ai';
import styles from './StaffDashboard.module.css';
import { toast } from 'react-toastify';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user info from localStorage
    const name = localStorage.getItem('userName') || 'Staff';
    const email = localStorage.getItem('userEmail') || 'staff@horizon.edu';
    setUserName(name);
    setUserEmail(email);

    // Verify user is staff
    const role = localStorage.getItem('userRole');
    if (role !== 'Staff') {
      navigate('/dashboard');
      return;
    }

    // Fetch data
    const fetchData = async () => {
      try {
        const invRes = await fetch('http://localhost:5000/api/inventory');
        if (invRes.ok) setInventory(await invRes.json());

        const reqRes = await fetch('http://localhost:5000/api/requests');
        if (reqRes.ok) {
          const allRequests = await reqRes.json();
          setRequests(allRequests);
        }

        const msgRes = await fetch('http://localhost:5000/api/messages');
        if (msgRes.ok) {
          const allMessages = await msgRes.json();
          // Filter messages from Admin only
          const adminMessages = allMessages.filter(m => m.senderRole === 'Admin');
          setMessages(adminMessages);
        }
      } catch (e) {
        console.error('Error fetching data', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      toast.success('Logged out successfully');
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
      toast.error('Failed to log out');
    }
  };

  const totalItems = inventory.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  const outOfStock = inventory.filter(item => Number(item.quantity) === 0).length;
  const myRequests = requests.filter(r => r.senderRole === 'Staff' || r.requestedBy === userName);
  const pendingRequests = myRequests.filter(r => r.status === 'Pending');
  const approvedRequests = myRequests.filter(r => r.status === 'Approved');

  return (
    <div className={styles.staffDashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>HORIZON CAMPUS - Staff Dashboard</h1>
          <p>Stationary Inventory Management Platform</p>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <AiOutlineLogout /> Logout
        </button>
      </div>

      {/* User Info */}
      <div className={styles.userInfo}>
        <div className={styles.userAvatar}>{userName.charAt(0).toUpperCase()}</div>
        <div className={styles.userDetails}>
          <h2>Welcome, {userName}!</h2>
          <p>{userEmail}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.blue}`}>
          <div className={styles.statHeader}>
            <h3>Total Items</h3>
            <div className={styles.statIcon}>
              <AiOutlineFileText />
            </div>
          </div>
          <p className={styles.statValue}>{loading ? '...' : totalItems}</p>
          <span className={styles.statLabel}>In Inventory</span>
        </div>

        <div className={`${styles.statCard} ${styles.orange}`}>
          <div className={styles.statHeader}>
            <h3>Out of Stock</h3>
            <div className={styles.statIcon}>
              <AiOutlineWarning />
            </div>
          </div>
          <p className={styles.statValue}>{loading ? '...' : outOfStock}</p>
          <span className={styles.statLabel}>Need restock</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActionsSection}>
        <h2>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <a href="/add-quantity" className={`${styles.actionCard} ${styles.actionAdd}`}>
            <div className={styles.actionIcon}>📦</div>
            <h3>Add Quantity</h3>
            <p>Add more items to inventory</p>
            <AiOutlineArrowRight className={styles.actionArrow} />
          </a>
          <a href="/issue-item" className={`${styles.actionCard} ${styles.actionIssue}`}>
            <div className={styles.actionIcon}>📤</div>
            <h3>Issue Item</h3>
            <p>Issue items to departments</p>
            <AiOutlineArrowRight className={styles.actionArrow} />
          </a>
          <a href="/return-item" className={`${styles.actionCard} ${styles.actionReturn}`}>
            <div className={styles.actionIcon}>📥</div>
            <h3>Return Item</h3>
            <p>Record item returns</p>
            <AiOutlineArrowRight className={styles.actionArrow} />
          </a>
          <a href="/request-item" className={`${styles.actionCard} ${styles.actionRequest}`}>
            <div className={styles.actionIcon}>✍️</div>
            <h3>Make Request</h3>
            <p>Request items from inventory</p>
            <AiOutlineArrowRight className={styles.actionArrow} />
          </a>
        </div>
      </div>

      {/* Recent Requests */}
      <div className={styles.recentSection}>
        <div className={styles.recentHeader}>
          <h2>Your Recent Requests</h2>
          {myRequests.length > 0 && (
            <span className={styles.viewAll}>Total: {myRequests.length}</span>
          )}
        </div>
        {myRequests.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No requests yet. Start by making a request!</p>
          </div>
        ) : (
          <div className={styles.requestsList}>
            {myRequests.slice(0, 5).map((req) => (
              <div key={req._id || req.id} className={`${styles.requestItem} ${styles[req.status?.toLowerCase()]}`}>
                <div className={styles.requestMain}>
                  <div className={styles.requestInfo}>
                    <h4>{req.itemName}</h4>
                    <p className={styles.requestDate}>{new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={styles.requestMeta}>
                    <span className={styles.quantity}>Qty: {req.quantity}</span>
                    <span className={`${styles.status} ${styles[req.status?.toLowerCase()]}`}>
                      {req.status || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Messages */}
      <div className={styles.recentSection}>
        <div className={styles.recentHeader}>
          <h2>📧 Messages from Admin</h2>
          {messages.length > 0 && (
            <span className={styles.viewAll}>New: {messages.length}</span>
          )}
        </div>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No messages from admin yet.</p>
          </div>
        ) : (
          <div className={styles.messagesList}>
            {messages.slice(0, 5).map((msg) => (
              <div key={msg._id || msg.id} className={styles.messageItem}>
                <div className={styles.messageMain}>
                  <div className={styles.messageInfo}>
                    <h4>Admin Notification</h4>
                    <p className={styles.messageContent}>{msg.messageContent || msg.content || msg.message}</p>
                    <p className={styles.messageDate}>{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alert Box */}
      {outOfStock > 0 && (
        <div className={styles.alertBox}>
          <div className={styles.alertIcon}>⚠️</div>
          <div className={styles.alertContent}>
            <h3>Low Stock Alert</h3>
            <p>There are {outOfStock} items out of stock. Please notify your supervisor for restock.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
