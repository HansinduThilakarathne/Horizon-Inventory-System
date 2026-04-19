import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineSearch, AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import styles from './RequestItems.module.css';

const RequestItems = () => {
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [staffName, setStaffName] = useState(localStorage.getItem('userName') || '');
  const [staffId, setStaffId] = useState(localStorage.getItem('userEmail') || '');
  
  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    quantity: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch inventory and requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await fetch('http://localhost:5000/api/inventory');
        if (invRes.ok) setInventory(await invRes.json());

        const reqRes = await fetch('http://localhost:5000/api/requests');
        if (reqRes.ok) {
          const allRequests = await reqRes.json();
          // Filter only current staff's requests
          const staffRequests = allRequests.filter(req => req.requestedBy === staffName);
          setRequests(staffRequests);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [staffName]);

  const handleItemSelect = (e) => {
    const selectedItem = inventory.find(item => (item._id || item.id) === e.target.value);
    if (selectedItem) {
      setFormData({
        ...formData,
        itemCode: selectedItem._id || selectedItem.id,
        itemName: selectedItem.name
      });
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!formData.itemCode || !formData.quantity) {
      return toast.error('Please select item and enter quantity');
    }

    // Validate staff name is set
    if (!staffName || staffName === '') {
      return toast.error('Staff name not found. Please login again.');
    }

    setIsSubmitting(true);

    try {
      const requestPayload = {
        itemCode: formData.itemCode,
        itemName: formData.itemName,
        quantity: Number(formData.quantity),
        reason: formData.reason,
        requestedBy: staffName,
        requestedById: staffId || 'Unknown',
        status: 'Pending',
        senderRole: 'Staff',
        createdAt: new Date().toISOString()
      };

      const res = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const responseData = await res.json();

      toast.success('Request submitted to Admin! Waiting for approval...');
      setShowRequestModal(false);
      setFormData({ itemCode: '', itemName: '', quantity: '', reason: '' });
      setIsSubmitting(false);

      // Refresh requests
      const updatedRes = await fetch('http://localhost:5000/api/requests');
      if (updatedRes.ok) {
        const allRequests = await updatedRes.json();
        const staffRequests = allRequests.filter(req => req.requestedBy === staffName);
        setRequests(staffRequests);
      }
    } catch (e) {
      console.error('Request submission error:', e);
      setIsSubmitting(false);
      toast.error('Failed to submit request: ' + e.message);
    }
  };

  const filteredRequests = requests.filter(req =>
    req.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.itemCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <AiOutlineClockCircle className={styles.pendingIcon} />;
      case 'Approved':
        return <AiOutlineCheckCircle className={styles.approvedIcon} />;
      case 'Rejected':
        return <AiOutlineCloseCircle className={styles.rejectedIcon} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Request Inventory Items</h1>
          <p>Submit requests for items to be approved by admin</p>
        </div>
        <button 
          className={styles.newRequestBtn}
          onClick={() => setShowRequestModal(true)}
        >
          <AiOutlinePlus /> New Request
        </button>
      </div>

      {/* Staff Info */}
      <div className={styles.staffInfo}>
        <div className={styles.infoCard}>
          <span className={styles.label}>Staff Name:</span>
          <span className={styles.value}>{staffName || 'Not Set'}</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.label}>Staff ID:</span>
          <span className={styles.value}>{staffId || 'Not Set'}</span>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <AiOutlineSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search your requests..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <span className={styles.resultCount}>{filteredRequests.length} requests</span>
      </div>

      {/* Requests Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Requested Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className={styles.emptyCell}>Loading your requests...</td></tr>
            ) : filteredRequests.length === 0 ? (
              <tr><td colSpan="6" className={styles.emptyCell}>No requests yet. Click "New Request" to create one.</td></tr>
            ) : (
              filteredRequests.map((req) => (
                <tr key={req._id || req.id}>
                  <td className={styles.code}>{req.itemCode}</td>
                  <td className={styles.name}>{req.itemName}</td>
                  <td className={styles.quantity}>{req.quantity}</td>
                  <td className={styles.reason}>{req.reason || '-'}</td>
                  <td>
                    <div className={styles.statusCell}>
                      {getStatusIcon(req.status)}
                      <span className={`${styles.statusBadge} ${styles[req.status?.toLowerCase()]}`}>
                        {req.status}
                      </span>
                    </div>
                  </td>
                  <td className={styles.date}>
                    {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRequestModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Submit Item Request</h2>
            <p className={styles.modalSubtitle}>Request items from inventory - Admin will review and approve</p>
            
            <form onSubmit={handleSubmitRequest} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Select Item *</label>
                <select 
                  value={formData.itemCode}
                  onChange={handleItemSelect}
                  required
                  className={styles.input}
                >
                  <option value="">-- Choose an item --</option>
                  {inventory.map(item => (
                    <option key={item._id || item.id} value={item._id || item.id}>
                      {(item._id || item.id)} - {item.name} (Available: {item.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Item Name</label>
                <input 
                  type="text"
                  value={formData.itemName}
                  readOnly
                  placeholder="Automatically filled"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Quantity Needed *</label>
                <input 
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="Enter quantity"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Reason for Request</label>
                <textarea 
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Why do you need these items?"
                  className={styles.textarea}
                  rows="4"
                ></textarea>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Send Request to Admin'}
                </button>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => setShowRequestModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestItems;
