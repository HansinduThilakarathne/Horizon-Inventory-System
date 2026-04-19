import React, { useState, useEffect } from 'react';
import styles from '../../components/Form.module.css';
import { toast } from 'react-toastify';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const IssueItem = () => {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    staffAdminId: '',
    numberOfItems: '',
    issueDepartment: '',
    receiverName: '',
    receiverStudentStaffId: '',
    description: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save issued item to backend
      const issueData = {
        ...formData,
        numberOfItems: Number(formData.numberOfItems),
        itemCode: formData.itemCode,
        itemName: formData.itemName,
        staffAdminId: formData.staffAdminId,
        issuedBy: localStorage.getItem('userName') || 'Admin',
        date: new Date().toISOString()
      };

      const issueRes = await fetch('http://localhost:5000/api/issued-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData)
      });

      if (!issueRes.ok) throw new Error('Failed to save issued item');
      
      // Update inventory quantity
      if (formData.itemCode) {
        const currentItem = inventory.find(item => (item._id || item.id) === formData.itemCode);
        if (currentItem) {
          const newQuantity = currentItem.quantity - Number(formData.numberOfItems);
          await fetch(`http://localhost:5000/api/inventory/${formData.itemCode}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQuantity })
          });
        }
      }

      toast.success('Item issued successfully and saved to database!');
      handleReset();
    } catch (error) {
      toast.error('Error issuing item: ' + error.message);
    }
  };

  const handleReset = () => {
    setFormData({
      itemCode: '',
      itemName: '',
      staffAdminId: '',
      numberOfItems: '',
      issueDepartment: '',
      receiverName: '',
      receiverStudentStaffId: '',
      description: ''
    });
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
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
          
          <div className={styles.formGroup}>
            <label>Item Name</label>
            <input 
              type="text" 
              className={styles.formInput} 
              value={formData.itemName}
              readOnly
              placeholder="Select item code first"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Staff/Admin ID</label>
            <input 
              type="text" 
              className={styles.formInput}
              value={formData.staffAdminId}
              onChange={(e) => setFormData({...formData, staffAdminId: e.target.value})}
              placeholder="Enter staff or admin ID"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Number of Items</label>
            <input 
              type="number" 
              className={styles.formInput}
              value={formData.numberOfItems}
              onChange={(e) => setFormData({...formData, numberOfItems: e.target.value})}
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Issue Department</label>
            <input 
              type="text" 
              className={styles.formInput}
              value={formData.issueDepartment}
              onChange={(e) => setFormData({...formData, issueDepartment: e.target.value})}
              placeholder="e.g., Administration, IT, etc."
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Receiver Name</label>
            <input 
              type="text" 
              className={styles.formInput}
              value={formData.receiverName}
              onChange={(e) => setFormData({...formData, receiverName: e.target.value})}
              placeholder="Full name of receiver"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Receiver Student/Staff ID</label>
            <input 
              type="text" 
              className={styles.formInput}
              value={formData.receiverStudentStaffId}
              onChange={(e) => setFormData({...formData, receiverStudentStaffId: e.target.value})}
              placeholder="Student or Staff ID"
              required
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Description</label>
            <textarea 
              className={styles.formTextarea}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Additional notes or purpose of issue"
            ></textarea>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.btnConfirm}>Confirm Issue</button>
          <button type="button" className={styles.btnReset} onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default IssueItem;
