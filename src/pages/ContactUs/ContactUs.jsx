import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from '../../components/Form.module.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.message || isSubmitting) return;

    setIsSubmitting(true);
    const msgPayload = {
      ...formData,
      senderRole: localStorage.getItem('userRole') || 'Staff'
    };

    fetch('http://localhost:5000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgPayload)
    })
    .then(async res => {
       if(!res.ok) throw new Error('Database Error');
       toast.success(msgPayload.senderRole === 'Admin' ? 'Broadcast safely delivered to Staff workspaces!' : 'Your message has been safely delivered to the Admin Workspace!');
       setFormData({ name: '', email: '', message: '' });
    })
    .catch(() => {
       toast.error('Failed to connect to MongoDB server! Is it running?');
    })
    .finally(() => {
       setIsSubmitting(false);
    });
  };

  return (
    <div className={styles.formContainer} style={{ maxWidth: '600px', margin: '4rem auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-main)' }}>Contact Administrator</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
          <label>Your Name</label>
          <input type="text" className={styles.formInput} placeholder="Enter your name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
          <label>Your Email</label>
          <input type="email" className={styles.formInput} placeholder="Enter your email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
          <label>Message</label>
          <textarea className={styles.formTextarea} placeholder="How can we help you?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
        </div>
        <button type="submit" className={styles.btnConfirm} style={{ width: '100%', marginTop: '1rem' }} disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
