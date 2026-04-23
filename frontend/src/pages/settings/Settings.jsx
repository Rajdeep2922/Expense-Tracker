// src/pages/settings/Settings.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import { useExpenses } from '../../context/ExpenseContext';
import { exportToCSV, exportToJSON } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import './Settings.css';

const Settings = () => {
  const { user, logout } = useAuth();

  const { fetchExpenses } = useExpenses();
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format) => {
    setExporting(true);
    try {
      // Create a dummy endpoint to fetch all without limits, or just grab state
      // We'll mock a fetch for everything since pagination applies bounds
      const res = await fetchExpenses({ limit: 1000, page: 1 });
      // Because fetchExpenses stores to context, we just wait a bit or use context directly but let's assume we can fetch directly in a real app.
      // Assuming context has expenses loaded:
      // Actually we need to hit the api directly to get the blob 
      console.warn('Need to await API result for export');
    } catch (err) {
      alert('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Settings</h1>
      </header>

      <Card className="settings-section">
        <h3>Profile</h3>
        <div className="profile-details">
          <div className="avatar-large">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <h4>{user?.name}</h4>
            <p className="text-muted">{user?.email}</p>
          </div>
        </div>
      </Card>



      <Card className="settings-section">
        <h3>Data Export</h3>
        <div className="settings-row">
          <span>Export all expenses as CSV</span>
          <Button variant="outline" loading={exporting} onClick={() => alert('Exporting coming soon!')}>Export CSV</Button>
        </div>
        <div className="settings-row" style={{ marginTop: 16 }}>
          <span>Export all expenses as JSON</span>
          <Button variant="outline" loading={exporting} onClick={() => alert('Exporting coming soon!')}>Export JSON</Button>
        </div>
      </Card>

      <div style={{ marginTop: 32 }}>
        <Button variant="danger" onClick={logout}>Log Out</Button>
      </div>
    </div>
  );
};

export default Settings;
