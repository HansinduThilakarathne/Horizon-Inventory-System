import React, { useState } from 'react';
import styles from './Settings.module.css';
import { toast } from 'react-toastify';

const Settings = () => {
  const [theme, setTheme] = useState(localStorage.getItem('appTheme') || 'dark');
  const [logo, setLogo] = useState(localStorage.getItem('customLogo') || '');

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('appTheme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    toast.success(`Theme updated to ${newTheme} mode!`);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File is too large! Please upload under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setLogo(base64String);
        localStorage.setItem('customLogo', base64String);
        // Dispatch global event so Sidebar auto-updates instantly
        window.dispatchEvent(new Event('logoUpdated'));
        toast.success("Logo successfully updated app-wide!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogo('');
    localStorage.removeItem('customLogo');
    window.dispatchEvent(new Event('logoUpdated'));
    toast.info("Logo reset to default avatar.");
  };

  return (
    <div className={styles.settingsPage}>
      <h1 className={styles.header}>Application Settings</h1>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Appearance Strategy</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Customize the background and global UI layout theme.</p>
        <div className={styles.themeToggle}>
          <button
            className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`}
            onClick={() => handleThemeChange('dark')}
          >
            Dark Mode
          </button>
          <button
            className={`${styles.themeBtn} ${theme === 'light' ? styles.active : ''}`}
            onClick={() => handleThemeChange('light')}
          >
            Light Mode
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Branding Customization</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Upload a custom logo to dynamically display inside the navigation sidebar.</p>

        <div className={styles.uploadContainer}>
          <div className={styles.logoPreview}>
            {logo ? (
              <img src={logo} alt="Custom Logo Preview" />
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>No custom logo</span>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className={styles.fileInput}
          />

          {logo && (
            <button onClick={handleRemoveLogo} style={{ alignSelf: 'flex-start', background: 'var(--color-danger)' }}>
              Remove Custom Logo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
