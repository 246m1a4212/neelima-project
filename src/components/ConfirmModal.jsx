import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmText = 'Delete', 
  cancelText = 'Cancel', 
  onConfirm, 
  onCancel 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              background: 'var(--danger-bg)', 
              color: 'var(--danger)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <AlertTriangle size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h3>
          </div>
          <button className="btn-icon" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
