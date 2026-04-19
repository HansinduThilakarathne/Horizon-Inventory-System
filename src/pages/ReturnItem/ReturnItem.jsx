import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../components/Form.module.css';
import { toast } from 'react-toastify';

const ReturnItem = () => {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    quantity: '',
    returnedBy: '',
    returnedById: '',
    condition: 'Good'
  });
  const navigate = useNavigate();

  // Fetch inventory items
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

  const handleReturn = async (e) => {
    e.preventDefault();
    if (!formData.itemCode || !formData.quantity || !formData.returnedBy) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      // Save returned item to backend
      const returnData = {
        itemCode: formData.itemCode,
        itemName: formData.itemName,
        numberOfItems: Number(formData.quantity),
        returnedBy: formData.returnedBy,
        returnedById: formData.returnedById,
        condition: formData.condition,
        date: new Date().toISOString()
      };

      const returnRes = await fetch('http://localhost:5000/api/returned-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnData)
      });

      if (!returnRes.ok) throw new Error('Failed to save returned item');

      // Update inventory quantity - add returned items back
      if (formData.itemCode) {
        const currentItem = inventory.find(item => (item._id || item.id) === formData.itemCode);
        if (currentItem) {
          const newQuantity = currentItem.quantity + Number(formData.quantity);
          await fetch(`http://localhost:5000/api/inventory/${formData.itemCode}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQuantity })
          });
        }
      }

      toast.success(`${formData.quantity} items successfully returned and saved to database!`);
      handleReset();
    } catch (err) {
      toast.error('Failed to return item: ' + err.message);
    }
  };

  const handleReset = () => {
    setFormData({
      itemCode: '',
      itemName: '',
      quantity: '',
      returnedBy: '',
      returnedById: '',
      condition: 'Good'
    });
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleReturn}>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Item Code</label>
            <select 
              className={styles.formInput}
              value={formData.itemCode}
              onChange={handleItemSelect}
              required
            >
              <option value="">Select Item</option>
              {inventory.map(item => (
                <option key={item._id || item.id} value={item._id || item.id}>
                  {(item._id || item.id)} - {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Item Name</label>
            <input 
              type="text" 
              className={styles.formInput}
              value={formData.itemName}
              readOnly
              placeholder="Select item code first"
            />
          </div>
          
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Quantity Returned</label>
            <input 
              type="number" 
              className={styles.formInput}
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Returned By (Name)</label>
            <input 
              type="text" 
              className={styles.formInput}
              value={formData.returnedBy}
              onChange={(e) => setFormData({...formData, returnedBy: e.target.value})}
              placeholder="Full name"
              required
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Returned By ID (Student/Staff ID)</label>
            <input 
              type="text" 
              className={styles.formInput}
              value={formData.returnedById}
              onChange={(e) => setFormData({...formData, returnedById: e.target.value})}
              placeholder="Student or Staff ID"
              required
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Condition (Usable / Damage)</label>
            <select 
              className={styles.formInput}
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value})}
              required
            >
              <option value="Good">Usable (Good)</option>
              <option value="Damage">Damage</option>
            </select>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.btnConfirm}>Confirm Return</button>
          <button type="button" className={styles.btnReset} onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default ReturnItem;
