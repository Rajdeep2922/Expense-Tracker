// src/components/common/Loading.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading...', fullScreen = false }) => {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      <Loader2 size={32} style={{ marginBottom: 12, color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: 14, fontWeight: 500 }}>{message}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-body)' }}>
        {content}
      </div>
    );
  }

  return <div style={{ padding: 'var(--spacing-xxl) 0' }}>{content}</div>;
};

export default Loading;
