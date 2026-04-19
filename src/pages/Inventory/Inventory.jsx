import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineFilter, AiOutlinePlus, AiOutlineSync, AiOutlineClose, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'; 
import { MdDownload, MdUpload } from 'react-icons/md';
import { toast } from 'react-toastify';
import styles from './Inventory.module.css';

const Inventory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemCost, setItemCost] = useState('');
  const [newItem, setNewItem] = useState({ itemCode: '', name: '', category: '', quantity: 1, cost: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await fetch('http://localhost:5000/api/inventory');
        if (invRes.ok) setInventory(await invRes.json());

        const msgRes = await fetch('http://localhost:5000/api/messages');
        if (msgRes.ok) {
           const msgData = await msgRes.json();
           setMessages(msgData.filter(m => m.senderRole === 'Admin'));
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

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    if (!newItem.itemCode.trim() || !newItem.name.trim() || !newItem.category.trim() || !newItem.quantity) {
      return toast.error('Please fill all required fields');
    }
    
    if (Number(newItem.quantity) <= 0) {
      return toast.error('Quantity must be greater than 0');
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: newItem.itemCode.toUpperCase(),
          id: newItem.itemCode.toUpperCase(),
          name: newItem.name,
          category: newItem.category,
          quantity: Number(newItem.quantity),
          cost: Number(newItem.cost) || 0,
          supplier: 'General'
        })
      });
      
      if(!res.ok) {
        const error = await res.text();
        throw new Error(error || 'Failed to add item');
      }
      
      toast.success('Item added successfully to inventory!');
      setShowAddForm(false);
      setNewItem({ itemCode: '', name: '', category: '', quantity: 1, cost: 0 });
      
      // Refresh inventory
      const invRes = await fetch('http://localhost:5000/api/inventory');
      if (invRes.ok) setInventory(await invRes.json());
      
      setLoading(false);
    } catch (e) {
      console.error('Add item error:', e);
      toast.error('Failed to add item: ' + e.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/inventory/' + id, {
        method: 'DELETE'
      });
      if(!res.ok) throw new Error('Delete failed');
      
      toast.success('Item deleted successfully!');
      
      // Refresh inventory
      const invRes = await fetch('http://localhost:5000/api/inventory');
      if (invRes.ok) setInventory(await invRes.json());
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete item');
    }
  };

  const openAddQuantityPage = (item) => {
    navigate('/add-quantity', { state: { item } });
  };

  const openCostModal = (item) => {
    setSelectedItem(item);
    setItemCost(item.cost || 0);
    setShowCostModal(true);
  };

  const handleSaveCost = async () => {
    if (!itemCost || itemCost < 0) {
      return toast.error('Please enter a valid cost');
    }

    try {
      const res = await fetch(`http://localhost:5000/api/inventory/${selectedItem._id || selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cost: Number(itemCost) })
      });

      if (!res.ok) throw new Error('Update failed');

      setInventory(inventory.map(item =>
        (item._id || item.id) === (selectedItem._id || selectedItem.id)
          ? { ...item, cost: Number(itemCost) }
          : item
      ));

      toast.success(`Cost updated for ${selectedItem.name}!`);
      setShowCostModal(false);
      setSelectedItem(null);
      setItemCost('');
    } catch (e) {
      console.error(e);
      toast.error('Failed to update cost');
    }
  };

  const calculateTotalValue = () => {
    return inventory.reduce((total, item) => {
      const cost = item.cost || 0;
      return total + (cost * item.quantity);
    }, 0);
  };

  const filteredInventory = inventory.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.inventoryContainer}>
      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <AiOutlineSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search items..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button onClick={() => setShowAddForm(true)} style={{backgroundColor: '#3b82f6', color: 'white', border: 'none', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.3s ease'}}>
          <AiOutlinePlus /> Add Item
        </button>
      </div>

      {showAddForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 style={{marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.3rem', fontWeight: '700'}}>Add New Inventory Item</h3>
            <form onSubmit={handleCreateSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
               <div>
                 <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)'}}>Item Code *</label>
                 <input 
                   placeholder="e.g., PEN-001" 
                   value={newItem.itemCode} 
                   onChange={(e) => setNewItem({...newItem, itemCode: e.target.value})} 
                   style={{width: '100%', padding: '0.8rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.95rem', boxSizing: 'border-box', transition: 'all 0.3s ease'}} 
                   required 
                 />
               </div>
               <div>
                 <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)'}}>Item Name *</label>
                 <input 
                   placeholder="e.g., Ballpoint Pens" 
                   value={newItem.name} 
                   onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
                   style={{width: '100%', padding: '0.8rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.95rem', boxSizing: 'border-box', transition: 'all 0.3s ease'}} 
                   required 
                 />
               </div>
               <div>
                 <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)'}}>Category *</label>
                 <input 
                   placeholder="e.g., Stationery" 
                   value={newItem.category} 
                   onChange={(e) => setNewItem({...newItem, category: e.target.value})} 
                   style={{width: '100%', padding: '0.8rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.95rem', boxSizing: 'border-box', transition: 'all 0.3s ease'}} 
                   required 
                 />
               </div>
               <div>
                 <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)'}}>Quantity *</label>
                 <input 
                   type="number" 
                   min="1" 
                   placeholder="Enter quantity" 
                   value={newItem.quantity} 
                   onChange={(e) => setNewItem({...newItem, quantity: e.target.value})} 
                   style={{width: '100%', padding: '0.8rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.95rem', boxSizing: 'border-box', transition: 'all 0.3s ease'}} 
                   required 
                 />
               </div>
               <div>
                 <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)'}}>Unit Cost (LKR)</label>
                 <input 
                   type="number" 
                   min="0" 
                   step="0.01" 
                   placeholder="Enter unit cost" 
                   value={newItem.cost} 
                   onChange={(e) => setNewItem({...newItem, cost: e.target.value})} 
                   style={{width: '100%', padding: '0.8rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.95rem', boxSizing: 'border-box', transition: 'all 0.3s ease'}} 
                 />
               </div>
               <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                  <button type="submit" disabled={loading} style={{flex: 1, padding: '0.9rem', borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', background: '#27ae60', color: 'white', border: 'none', transition: 'all 0.3s ease', opacity: loading ? 0.6 : 1}}>
                    {loading ? 'Adding...' : 'Add Item'}
                  </button>
                  <button type="button" onClick={() => setShowAddForm(false)} style={{flex: 1, padding: '0.9rem', background: 'var(--bg-input)', color: 'var(--text-main)', borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', border: '1px solid var(--border-color)', transition: 'all 0.3s ease'}}>Cancel</button>
               </div>
               <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem'}}>Fields marked with * are required</p>
            </form>
          </div>
        </div>
      )}

      <div className={styles.statusText}>Searching Items....</div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit Cost</th>
              <th>Total Value</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" style={{textAlign: 'center', padding: '2rem'}}>Loading inventory from Firestore...</td></tr>
            ) : filteredInventory.length === 0 ? (
              <tr><td colSpan="9" style={{textAlign: 'center', padding: '2rem'}}>No items found.</td></tr>
            ) : (
              filteredInventory.map((item) => (
                <tr key={item._id || item.id}>
                  <td>{(item._id || item.id).slice(0,6)}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button 
                      className={styles.costBtn}
                      onClick={() => openCostModal(item)}
                      title="Click to set cost"
                    >
                      LKR {item.cost ? item.cost.toFixed(2) : '0.00'}
                    </button>
                  </td>
                  <td className={styles.totalValue}>
                    LKR {((item.cost || 0) * item.quantity).toFixed(2)}
                  </td>
                  <td>{item.supplier}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${item.quantity > 0 ? styles.inStock : styles.outOfStock}`}>
                      {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={styles.addQuantityBtn} 
                      onClick={() => openAddQuantityPage(item)}
                      title="Add Quantity"
                    >
                      <AiOutlinePlus /> Add Qty
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span>Showing 1 to 3 of 10 Items</span>
        <div className={styles.paginationControls}>
          <button className="pageBtn">Previous</button>
          <button className="pageBtn active">1</button>
          <button className="pageBtn">2</button>
          <button className="pageBtn">Next</button>
        </div>
      </div>

      {/* Admin Broadcasts For Staff Workspace */}
      <div className={styles.recentInventory} style={{ marginTop: '3rem' }}>
        <div className={styles.sectionHeader}>
          <h3>Admin Broadcasts & Notifications</h3>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Sender</th>
                <th>Message Content</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>No new messages from Administrators at this time.</td></tr>
              ) : (
                messages.map(msg => (
                  <tr key={msg._id || msg.id}>
                    <td>{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Just now'}</td>
                    <td>
                      <div style={{fontWeight: '600', color: 'var(--color-primary)'}}>Admin: {msg.name}</div>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{msg.email}</div>
                    </td>
                    <td style={{maxWidth: '300px', whiteSpace: 'normal', lineHeight: '1.4'}}>{msg.message}</td>
                    <td>
                      <span style={{
                        padding: '4px 10px', 
                        background: 'rgba(239, 68, 68, 0.15)', 
                        color: '#ef4444', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        Critical
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Modal */}
      {showCostModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCostModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Set Unit Cost</h3>
            <div className={styles.itemInfo}>
              <p><strong>Item:</strong> {selectedItem?.name}</p>
              <p><strong>Current Cost:</strong> LKR {(selectedItem?.cost || 0).toFixed(2)}</p>
              <p><strong>Quantity:</strong> {selectedItem?.quantity}</p>
              <p><strong>Current Total Value:</strong> LKR {((selectedItem?.cost || 0) * selectedItem?.quantity).toFixed(2)}</p>
            </div>
            <div style={{marginTop: '1rem', marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)'}}>Unit Cost (LKR)</label>
              <input 
                type="number" 
                step="0.01"
                value={itemCost}
                onChange={(e) => setItemCost(e.target.value)}
                style={{width: '100%', padding: '0.8rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', fontSize: '1rem'}}
              />
              <p style={{marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem'}}>New Total Value: LKR {((itemCost || 0) * selectedItem?.quantity).toFixed(2)}</p>
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              <button 
                onClick={handleSaveCost}
                style={{flex: 1, padding: '0.8rem', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'}}
              >
                Save Cost
              </button>
              <button 
                onClick={() => setShowCostModal(false)}
                style={{flex: 1, padding: '0.8rem', background: 'var(--bg-input)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Total Inventory Value */}
      <div className={styles.totalValueCard}>
        <h3>Total Inventory Value</h3>
        <div className={styles.totalValueAmount}>
          LKR {calculateTotalValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <p className={styles.totalValueSubtext}>{inventory.length} items in inventory</p>
      </div>
    </div>
  );
};

export default Inventory;
