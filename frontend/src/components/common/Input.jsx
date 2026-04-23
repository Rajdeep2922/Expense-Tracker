// src/components/common/Input.jsx
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import './common.css';

const Input = forwardRef(({ label, error, helpText, className, id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={classNames('input-group', className)}>
      {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      <input
        id={inputId}
        ref={ref}
        className={classNames('input-field', { 'input-error': !!error })}
        {...props}
      />
      {error && <span className="input-error-text">{error}</span>}
      {!error && helpText && <span className="input-help-text">{helpText}</span>}
    </div>
  );
});

export default Input;
