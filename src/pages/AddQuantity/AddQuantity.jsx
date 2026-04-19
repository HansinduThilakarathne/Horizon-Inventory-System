import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { toast } from 'react-toastify';
import styles from './AddQuantity.module.css';

const AddQuantity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [quantityToAdd, setQuantityToAdd] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get the item from navigation state
    if (location.state && location.state.item) {
      setItem(location.state.item);
      setUnitCost(location.state.item.cost ? String(location.state.item.cost) : '');
    } else {
      toast.error('No item selected');
      navigate('/inventory');
    }
  }, [location, navigate]);

  const handleAddQuantity = async (e) => {
    e.preventDefault();
    
    if (!quantityToAdd || quantityToAdd <= 0) {
      return toast.error('Please enter a valid quantity');
    }

    if (!item) {
      return toast.error('No item selected');
    }

    setLoading(true);

    try {
      const newQuantity = item.quantity + Number(quantityToAdd);
      const updateData = { quantity: newQuantity };
      
      // Include cost in update if provided
      if (unitCost) {
        updateData.cost = Number(unitCost);
      }
      
      const res = await fetch(`http://localhost:5000/api/inventory/${item._id || item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!res.ok) throw new Error('Update failed');

      toast.success(`Successfully added ${quantityToAdd} units to ${item.name}!`);
      setLoading(false);
      navigate('/inventory');
    } catch (e) {
      console.error(e);
      toast.error('Failed to update quantity');
      setLoading(false);
    }
  };

  if (!item) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>Loading...</div>
      </div>
    );
  }

  const newTotal = item.quantity + (quantityToAdd ? Number(quantityToAdd) : 0);

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate('/inventory')}>
        <AiOutlineArrowLeft /> Back to Inventory
      </button>

      <div className={styles.card}>
        <h1>Add Quantity to Inventory</h1>

        <div className={styles.itemDetails}>
          <div className={styles.detailRow}>
            <span className={styles.label}>Item Code:</span>
            <span className={styles.value}>{item._id || item.id}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Item Name:</span>
            <span className={styles.value}>{item.name}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Category:</span>
            <span className={styles.value}>{item.category}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Supplier:</span>
            <span className={styles.value}>{item.supplier}</span>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Current Quantity:</span>
            <span className={`${styles.value} ${styles.highlight}`}>{item.quantity}</span>
          </div>
        </div>

        <form onSubmit={handleAddQuantity} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="quantity">Quantity to Add</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantityToAdd}
              onChange={(e) => setQuantityToAdd(e.target.value)}
              placeholder="Enter quantity to add"
              required
              disabled={loading}
              className={styles.input}
            />
            <span className={styles.hint}>Enter a positive number</span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="unitCost">Unit Cost (LKR)</label>
            <input
              id="unitCost"
              type="number"
              step="0.01"
              min="0"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              placeholder="Enter unit cost (optional)"
              disabled={loading}
              className={styles.input}
            />
            <span className={styles.hint}>Current cost: LKR {(item.cost || 0).toFixed(2)}</span>
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Current Quantity:</span>
              <span className={styles.summaryValue}>{item.quantity}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Quantity to Add:</span>
              <span className={styles.summaryValue}>{quantityToAdd || 0}</span>
            </div>
            <div className={styles.summaryDivider}></div>
            <div className={styles.summaryRow}>
              <span className={styles.newTotal}>New Total Quantity:</span>
              <span className={`${styles.summaryValue} ${styles.newTotalValue}`}>{newTotal}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Unit Cost:</span>
              <span className={styles.summaryValue}>LKR {(Number(unitCost) || item.cost || 0).toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.newTotal}>Total Inventory Value:</span>
              <span className={`${styles.summaryValue} ${styles.newTotalValue}`}>LKR {(newTotal * (Number(unitCost) || item.cost || 0)).toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !quantityToAdd || quantityToAdd <= 0}
            >
              {loading ? 'Processing...' : 'Add Quantity'}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate('/inventory')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuantity;
