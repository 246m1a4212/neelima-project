import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} color="var(--success)" />,
    error: <AlertCircle size={18} color="var(--danger)" />,
    info: <Info size={18} color="var(--primary)" />
  };

  return (
    <div className="toast-container">
      <div className={`toast ${toast.type || 'info'}`}>
        {icons[toast.type] || icons.info}
        <span style={{ flex: 1 }}>{toast.message}</span>
        <button 
          onClick={onClose}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
