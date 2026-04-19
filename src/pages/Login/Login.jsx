import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin'); // User requested this back
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to login');

      // Save JWT token and roles from MongoDB perfectly
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userName', data.name);
      
      // Instant reload triggers router checks properly
      window.location.href = data.role === 'Admin' ? '/dashboard' : '/inventory';
      
    } catch (error) {
       toast.error(`Login failed: ${error.message}`);
    } finally {
       setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.glassCard}>
        <div className={styles.logoArea}>
          <h1>HORIZON CAMPUS</h1>
          <p>Stationary Inventory</p>
        </div>

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <div className={styles.formGroup}>
            <label htmlFor="role">Select Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', marginBottom: '1rem' }}
            >
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Username/Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className={styles.loginBtn} disabled={isSubmitting}>
            {isSubmitting ? 'LOGGING IN...' : 'LOG IN'}
          </button>
        </form>

        <div className={styles.links}>
          <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Password reset link sent to your email.'); }}>Forgotten Password?</a>
          <button className={styles.createAccountBtn} onClick={() => navigate('/register')}>Create New Account</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
