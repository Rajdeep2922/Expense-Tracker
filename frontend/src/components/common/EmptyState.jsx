// src/components/common/EmptyState.jsx
import React from 'react';

const EmptyState = ({ icon = '📦', title, subtitle }) => (
  <div style={{ textAlign: 'center', padding: 'var(--spacing-xxl) var(--spacing-md)' }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
    <h3 style={{ color: 'var(--text-main)', marginBottom: 8 }}>{title}</h3>
    {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{subtitle}</p>}
  </div>
);

export default EmptyState;
