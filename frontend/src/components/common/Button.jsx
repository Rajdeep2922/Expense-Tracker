// src/components/common/Button.jsx
import React from 'react';
import classNames from 'classnames';
import { Loader2 } from 'lucide-react';
import './common.css';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  fullWidth = false,
  loading = false,
  disabled = false,
  className,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classNames(
        'btn',
        `btn-${variant}`,
        { 'btn-full': fullWidth, 'btn-loading': loading },
        className
      )}
    >
      {loading && <Loader2 className="btn-spinner" size={18} />}
      <span 
        className={classNames({ 'invisible': loading })}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
      >
        {children}
      </span>
    </button>
  );
};

export default Button;
