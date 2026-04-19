import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './Register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'Staff',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if(isSubmitting) return;
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsSubmitting(true);
    fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         name: formData.fullName,
         email: formData.email,
         phone: formData.phone,
         role: formData.role,
         password: formData.password
      })
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register');
      toast.success(data.message || 'Account created successfully in MongoDB!');
      navigate('/login');
    })
    .catch(error => {
      toast.error('Registration failed: ' + error.message);
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.glassCard}>
        <div className={styles.logoArea}>
          <h1>Create Account</h1>
          <p>Join HORIZON CAMPUS Directory</p>
        </div>
        
        <form onSubmit={handleRegister} style={{ width: '100%' }}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              placeholder="E.g. John Doe"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="john@horizon.edu"
              required 
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="text" 
                id="phone" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+94 77 XXXXXXX"
                required 
              />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label htmlFor="role">Role</label>
              <select 
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
             <label htmlFor="password">Password</label>
             <input 
              type="password" 
              id="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Create a strong password"
              required 
            />
          </div>

          <div className={styles.formGroup}>
             <label htmlFor="confirmPassword">Confirm Password</label>
             <input 
              type="password" 
              id="confirmPassword" 
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="Repeat your password"
              required 
            />
          </div>
          
          <button type="submit" className={styles.registerBtn} disabled={isSubmitting}>
             {isSubmitting ? 'REGISTERING...' : 'REGISTER NEW ACCOUNT'}
          </button>
        </form>

        <div className={styles.links}>
          <div className={styles.loginLink} onClick={() => navigate('/login')}>
            Already have an account? <span>Log in here</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
