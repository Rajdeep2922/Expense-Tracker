// src/components/common/Card.jsx
import React from 'react';
import classNames from 'classnames';
import './common.css';

const Card = ({ children, className, ...props }) => (
  <div className={classNames('card', className)} {...props}>
    {children}
  </div>
);

export default Card;
