import React, { useState, useEffect } from 'react';
import { AiOutlineSearch, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlinePlus } from 'react-icons/ai';
import { toast } from 'react-toastify';
import styles from './RequestItem.module.css';

const RequestItem = () => {
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);
  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    quantity: '',
    reason: '',
    requestedBy: '',
    requestedById: ''
  });

  // Fetch inventory and requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await fetch('http://localhost:5000/api/inventory');
        if (invRes.ok) setInventory(await invRes.json());

        const reqRes = await fetch('http://localhost:5000/api/requests');
        if (reqRes.ok) setRequests(await reqRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRequests = requests.filter(req =>
    req.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.itemCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

    if (!formData.itemCode || !formData.quantity || !formData.requestedBy) {
      return toast.error('Please fill all required fields');
    }

    try {
      const userRole = localStorage.getItem('userRole') || 'Staff';
      const res = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
          status: 'Pending',
          senderRole: userRole,
          createdAt: new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error('Failed to create request');

      toast.success('Request submitted successfully! Admin has been notified.');
      setShowAddRequestModal(false);
      setFormData({
        itemCode: '',
        itemName: '',
        quantity: '',
        reason: '',
        requestedBy: '',
        requestedById: ''
      });

      // Fetch updated requests
      const updatedRes = await fetch('http://localhost:5000/api/requests');
      if (updatedRes.ok) setRequests(await updatedRes.json());
    } catch (e) {
      console.error(e);
      toast.error('Failed to submit request');
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      });

      if (!res.ok) throw new Error('Failed to approve');

      const approvedRequest = requests.find(req => (req._id || req.id) === id);
      
      // Update inventory if approved
      if (approvedRequest) {
        const item = inventory.find(i => (i._id || i.id) === approvedRequest.itemCode);
        if (item) {
          const newQuantity = Math.max(0, item.quantity - Number(approvedRequest.quantity));
          await fetch(`http://localhost:5000/api/inventory/${approvedRequest.itemCode}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQuantity })
          });
        }
      }

      toast.success(`Request approved and inventory updated!`);
      
      // Refresh requests list
      const updatedRes = await fetch('http://localhost:5000/api/requests');
      if (updatedRes.ok) {
        const updatedRequests = await updatedRes.json();
        setRequests(updatedRequests);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' })
      });

      if (!res.ok) throw new Error('Failed to reject');

      toast.warning('Request rejected');
      
      // Refresh requests list
      const updatedRes = await fetch('http://localhost:5000/api/requests');
      if (updatedRes.ok) {
        const updatedRequests = await updatedRes.json();
        setRequests(updatedRequests);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to reject request');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Item Requests Management</h1>
          <p>Manage and approve inventory requests from staff members</p>
        </div>
        <button 
          className={styles.addBtn}
          onClick={() => setShowAddRequestModal(true)}
        >
          <AiOutlinePlus /> New Request
        </button>
      </div>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <AiOutlineSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by item name or code..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <span className={styles.resultCount}>{filteredRequests.length} requests found</span>
      </div>

      {/* Requests Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Requested By</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className={styles.emptyCell}>Loading requests...</td></tr>
            ) : filteredRequests.length === 0 ? (
              <tr><td colSpan="7" className={styles.emptyCell}>No requests found</td></tr>
            ) : (
              filteredRequests.map((req) => (
                <tr key={req._id || req.id}>
                  <td className={styles.code}>{req.itemCode}</td>
                  <td className={styles.name}>{req.itemName}</td>
                  <td className={styles.quantity}>{req.quantity}</td>
                  <td>{req.requestedBy}</td>
                  <td className={styles.reason}>{req.reason || '-'}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[req.status?.toLowerCase()]}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {req.status === 'Pending' && (
                        <>
                          <button 
                            className={styles.approveBtn}
                            onClick={() => handleApprove(req._id || req.id)}
                            title="Approve"
                          >
                            <AiOutlineCheckCircle />
                          </button>
                          <button 
                            className={styles.rejectBtn}
                            onClick={() => handleReject(req._id || req.id)}
                            title="Reject"
                          >
                            <AiOutlineCloseCircle />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Request Modal */}
      {showAddRequestModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddRequestModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Submit New Request</h2>
            <form onSubmit={handleSubmitRequest} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Item Code *</label>
                <select 
                  value={formData.itemCode}
                  onChange={handleItemSelect}
                  required
                  className={styles.input}
                >
                  <option value="">Select Item</option>
                  {inventory.map(item => (
                    <option key={item._id || item.id} value={item._id || item.id}>
                      {(item._id || item.id)} - {item.name}
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
                  placeholder="Select item code first"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Quantity *</label>
                <input 
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="Enter quantity"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Requested By (Name) *</label>
                <input 
                  type="text"
                  value={formData.requestedBy}
                  onChange={(e) => setFormData({...formData, requestedBy: e.target.value})}
                  placeholder="Your name"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Your ID (Student/Staff) *</label>
                <input 
                  type="text"
                  value={formData.requestedById}
                  onChange={(e) => setFormData({...formData, requestedById: e.target.value})}
                  placeholder="Your ID"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Reason for Request</label>
                <textarea 
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Enter reason (optional)"
                  className={styles.textarea}
                ></textarea>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn}>Submit Request</button>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => setShowAddRequestModal(false)}
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

export default RequestItem;
