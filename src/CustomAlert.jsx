import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faTimes } from '@fortawesome/free-solid-svg-icons';
import './CustomAlert.css';

const CustomAlert = ({ isOpen, title, message, gamemode, onConfirm, onCancel, confirmText = "Yes", cancelText = "No" }) => {
  if (!isOpen) return null;

  return (
    <div className="alert-overlay">
      <div className="alert-container">
        <div className="alert-header">
          <div className="alert-icon">
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </div>
          <h3 className="alert-title">{title}</h3>
          <button className="alert-close" onClick={onCancel}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="alert-content">
          <p className="alert-message">Are you sure you want to delete all <b>{gamemode}</b> game history?</p>
        </div>
        
        <div className="alert-actions">
          <button className="alert-button alert-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="alert-button alert-confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;