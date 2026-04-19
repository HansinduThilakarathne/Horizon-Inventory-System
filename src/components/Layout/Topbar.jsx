import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

const Topbar = () => {
  const location = useLocation();
  const path = location.pathname;

  // Map routes to display titles
  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard': return 'Dashboard';
      case '/inventory': return 'Inventory';
      case '/issue-item': return 'Issue Items';
      case '/return-item': return 'Return Items';
      case '/request-item': return 'Request Items';
      case '/reports': return 'Reports';
      case '/user': return 'User Management';
      case '/contact-us': return 'Contact Us';
      default: return 'Stationary Inventory';
    }
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.pageTitleContainer}>
        <div className={styles.pageTitle}>HORIZON CAMPUS - {getPageTitle(path)}</div>
        <div className={styles.pageSubtitle}>Comprehensive Overview of Campus Stationary Inventory</div>
      </div>
      {/* We can add user profile avatar or search here if needed */}
    </div>
  );
};

export default Topbar;
