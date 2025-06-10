import React from 'react';
import { STATUS_COLORS } from '../constants';

const StatusBadge = ({ status }) => {
  return (
    <span style={{
      backgroundColor: STATUS_COLORS[status] || 'gray',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px'
    }}>
      {status}
    </span>
  );
};

export default StatusBadge;
