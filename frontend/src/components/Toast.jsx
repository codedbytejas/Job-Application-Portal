import React, { useEffect } from 'react';
import { IconCheck, IconBookmark } from './Icons';

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <IconCheck size={16} />;
      case 'saved':
        return <IconBookmark size={16} fill="currentColor" />;
      default:
        return <IconCheck size={16} />;
    }
  };

  return (
    <div className={`toast-notification toast-${type}`}>
      <span className="toast-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
        {renderIcon()}
      </span>
      <span className="toast-text">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
}

export default Toast;
