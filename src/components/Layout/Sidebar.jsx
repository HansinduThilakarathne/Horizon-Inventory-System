import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Layout.module.css';
import { toast } from 'react-toastify';

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole') || 'Staff';
  
  const [logoUrl, setLogoUrl] = useState(localStorage.getItem('customLogo') || 'https://ui-avatars.com/api/?name=Horizon+Campus&background=3b82f6&color=fff&size=128&rounded=true');

  useEffect(() => {
    const handleLogoUpdate = () => {
      setLogoUrl(localStorage.getItem('customLogo') || 'https://ui-avatars.com/api/?name=Horizon+Campus&background=3b82f6&color=fff&size=128&rounded=true');
    };
    window.addEventListener('logoUpdated', handleLogoUpdate);
    return () => window.removeEventListener('logoUpdated', handleLogoUpdate);
  }, []);

  const handleLogout = () => {
    try {
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      
      toast.success('Logged out successfully');
      // Force page reload to reset app state
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
      toast.error('Failed to log out');
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logo} style={{ backgroundColor: 'transparent', padding: '0.5rem' }}>
          <img src={logoUrl} alt="Horizon Campus Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div className={styles.brandName}>HORIZON CAMPUS</div>
        <div className={styles.brandSubName}>Stationary Inventory</div>
      </div>

      <nav className={styles.navLinks}>
        {role === 'Admin' && (
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.activeNavItem}` : styles.navItem}
          >
            Dashboard
          </NavLink>
        )}
        {role === 'Staff' && (
          <NavLink 
            to="/staff-dashboard" 
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.activeNavItem}` : styles.navItem}
          >
            Dashboard
          </NavLink>
        )}
        <NavLink 
          to="/settings" 
          className={({ isActive }) => isActive ? `${styles.navItem} ${styles.activeNavItem}` : styles.navItem}
        >
          Settings
        </NavLink>
        <NavLink 
          to="/inventory" 
          className={({ isActive }) => isActive ? `${styles.navItem} ${styles.activeNavItem}` : styles.navItem}
        >
          Inventory
        </NavLink>
        <NavLink 
          to="/issue-item" 
          className={({ isActive }) => isActive ? `${styles.navItem} ${styles.activeNavItem}` : styles.navItem}
        >
          Issue Item
        </NavLink>
        <NavLink 
          to="/return-item" 
          className={({ isActive }) => isActive ? `${styles.navItem} ${styles.activeNavItem}` : styles.navItem}
        >
          Return Item
        </NavLink>
        {role === 'Admin' && (
          <NavLink 
            to="/request-item" 
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.activeNavItem}` : styles.navItem}
          >
            Request Item
          </NavLink>
        )}
        {role === 'Admin' && (
          <NavLink 
            to="/reports" 
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.activeNavItem}` : styles.navItem}
          >
            Reports
          </NavLink>
        )}
        {role === 'Admin' && (
          <NavLink 
            to="/user" 
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.activeNavItem}` : styles.navItem}
          >
            User
          </NavLink>
        )}
        <NavLink 
          to="/contact-us" 
          className={({ isActive }) => isActive ? `${styles.navItem} ${styles.activeNavItem}` : styles.navItem}
        >
          Contact Us
        </NavLink>
      </nav>

      <div className={styles.logoutSection}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
