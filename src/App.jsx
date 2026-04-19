import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import StaffDashboard from './pages/StaffDashboard/StaffDashboard';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Inventory from './pages/Inventory/Inventory';
import AddQuantity from './pages/AddQuantity/AddQuantity';
import IssueItem from './pages/IssueItem/IssueItem';
import ReturnItem from './pages/ReturnItem/ReturnItem';
import RequestItem from './pages/RequestItem/RequestItem';
import Reports from './pages/Reports/Reports';
import User from './pages/User/User';
import ContactUs from './pages/ContactUs/ContactUs';
import Settings from './pages/Settings/Settings';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Apply global theme
    if (localStorage.getItem('appTheme') === 'light') {
      document.documentElement.classList.add('light-theme');
    }

    // Check if user is logged in by checking token in localStorage
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (token && userRole) {
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0A1128', color: 'white' }}>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={localStorage.getItem('userRole') === 'Admin' ? '/dashboard' : '/staff-dashboard'} />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={localStorage.getItem('userRole') === 'Admin' ? '/dashboard' : '/staff-dashboard'} />} />
        
        {/* Staff Dashboard - Standalone Route */}
        <Route path="/staff-dashboard" element={localStorage.getItem('userRole') === 'Staff' ? <StaffDashboard /> : <Navigate to="/login" />} />
        
        {/* Protected Routes inside Layout */}
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to={localStorage.getItem('userRole') === 'Admin' ? "/dashboard" : "/inventory"} replace />} />
          <Route path="dashboard" element={localStorage.getItem('userRole') === 'Admin' ? <Dashboard /> : <Navigate to="/inventory" />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="add-quantity" element={<AddQuantity />} />
          <Route path="issue-item" element={<IssueItem />} />
          <Route path="return-item" element={<ReturnItem />} />
          <Route path="request-item" element={<RequestItem />} />
          <Route path="reports" element={localStorage.getItem('userRole') === 'Admin' ? <Reports /> : <Navigate to="/inventory" />} />
          <Route path="user" element={localStorage.getItem('userRole') === 'Admin' ? <User /> : <Navigate to="/inventory" />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
    </Router>
  );
}

export default App;
