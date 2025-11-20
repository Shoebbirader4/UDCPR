import React from 'react';

// Loading Skeleton Component
export const SkeletonCard = () => (
  <div className="card fade-in">
    <div className="skeleton" style={{ height: '24px', width: '60%', marginBottom: '12px' }} />
    <div className="skeleton" style={{ height: '16px', width: '100%', marginBottom: '8px' }} />
    <div className="skeleton" style={{ height: '16px', width: '90%', marginBottom: '8px' }} />
    <div className="skeleton" style={{ height: '16px', width: '80%' }} />
  </div>
);

// Loading Spinner
export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="card fade-in" style={{ textAlign: 'center', padding: '40px' }}>
    <div style={{ 
      width: '48px', 
      height: '48px', 
      border: '4px solid #f3f4f6',
      borderTop: '4px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 16px'
    }} />
    <p style={{ color: '#666', fontSize: '16px' }}>{message}</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Error Alert Component
export const ErrorAlert = ({ error, onDismiss }) => (
  <div className="card fade-in" style={{ 
    background: '#fee2e2', 
    border: '2px solid #ef4444',
    marginBottom: '20px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '20px' }}>❌</span>
          <strong style={{ color: '#991b1b', fontSize: '16px' }}>Error</strong>
        </div>
        <p style={{ color: '#991b1b', fontSize: '14px', lineHeight: '1.6' }}>{error}</p>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          style={{ 
            background: '#ef4444', 
            color: 'white',
            padding: '6px 12px',
            fontSize: '12px',
            marginLeft: '16px'
          }}
        >
          Dismiss
        </button>
      )}
    </div>
  </div>
);

// Success Alert Component
export const SuccessAlert = ({ message, onDismiss }) => (
  <div className="card fade-in" style={{ 
    background: '#d1fae5', 
    border: '2px solid #10b981',
    marginBottom: '20px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '20px' }}>✅</span>
          <strong style={{ color: '#065f46', fontSize: '16px' }}>Success</strong>
        </div>
        <p style={{ color: '#065f46', fontSize: '14px', lineHeight: '1.6' }}>{message}</p>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          style={{ 
            background: '#10b981', 
            color: 'white',
            padding: '6px 12px',
            fontSize: '12px',
            marginLeft: '16px'
          }}
        >
          Dismiss
        </button>
      )}
    </div>
  </div>
);

// Info Alert Component
export const InfoAlert = ({ message, icon = 'ℹ️' }) => (
  <div className="card fade-in" style={{ 
    background: '#dbeafe', 
    border: '2px solid #3b82f6',
    marginBottom: '20px'
  }}>
    <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <p style={{ color: '#1e40af', fontSize: '14px', lineHeight: '1.6', flex: 1 }}>{message}</p>
    </div>
  </div>
);

// Warning Alert Component
export const WarningAlert = ({ message, title = 'Warning' }) => (
  <div className="card fade-in" style={{ 
    background: '#fef3c7', 
    border: '2px solid #f59e0b',
    marginBottom: '20px'
  }}>
    <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
      <span style={{ fontSize: '20px' }}>⚠️</span>
      <div style={{ flex: 1 }}>
        <strong style={{ color: '#92400e', fontSize: '16px', display: 'block', marginBottom: '8px' }}>
          {title}
        </strong>
        <p style={{ color: '#92400e', fontSize: '14px', lineHeight: '1.6' }}>{message}</p>
      </div>
    </div>
  </div>
);

// Empty State Component
export const EmptyState = ({ icon = '📭', title, message }) => (
  <div className="card fade-in" style={{ textAlign: 'center', padding: '60px 20px', background: '#f9fafb' }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
    {title && <h3 style={{ marginBottom: '12px', color: '#374151' }}>{title}</h3>}
    <p style={{ color: '#6b7280', fontSize: '16px', lineHeight: '1.6' }}>{message}</p>
  </div>
);

// Result Count Badge
export const ResultCount = ({ count, label = 'results', filters = {} }) => (
  <div className="fade-in" style={{ 
    padding: '12px 20px', 
    background: '#f0f9ff', 
    borderRadius: '8px',
    border: '1px solid #0284c7',
    marginBottom: '20px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
      <div>
        <strong style={{ color: '#0c4a6e', fontSize: '16px' }}>
          Found {count} {label}
        </strong>
        {Object.keys(filters).length > 0 && (
          <span style={{ color: '#0369a1', marginLeft: '10px', fontSize: '14px' }}>
            {Object.entries(filters).map(([key, value]) => value && `${key}: ${value}`).filter(Boolean).join(' • ')}
          </span>
        )}
      </div>
    </div>
  </div>
);

// Badge Component
export const Badge = ({ children, color = 'blue', size = 'md' }) => {
  const colors = {
    blue: { bg: '#dbeafe', text: '#1e40af' },
    green: { bg: '#d1fae5', text: '#065f46' },
    yellow: { bg: '#fef3c7', text: '#92400e' },
    red: { bg: '#fee2e2', text: '#991b1b' },
    purple: { bg: '#f3e8ff', text: '#6b21a8' },
    gray: { bg: '#f3f4f6', text: '#374151' }
  };
  
  const sizes = {
    sm: { padding: '2px 8px', fontSize: '11px' },
    md: { padding: '4px 12px', fontSize: '12px' },
    lg: { padding: '6px 16px', fontSize: '14px' }
  };
  
  return (
    <span style={{
      background: colors[color].bg,
      color: colors[color].text,
      ...sizes[size],
      borderRadius: '12px',
      fontWeight: '500',
      display: 'inline-block'
    }}>
      {children}
    </span>
  );
};

// Stat Card Component
export const StatCard = ({ icon, value, label, color = '#3b82f6', gradient }) => (
  <div className="card fade-in" style={{ 
    background: gradient || `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
    color: 'white',
    textAlign: 'center',
    padding: '24px'
  }}>
    {icon && <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>}
    <h2 style={{ fontSize: '36px', marginBottom: '8px', color: 'white', fontWeight: 'bold' }}>{value}</h2>
    <p style={{ fontSize: '14px', opacity: 0.9 }}>{label}</p>
  </div>
);

// Pagination Component
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ background: '#3b82f6', color: 'white' }}
      >
        ← Previous
      </button>
      
      <span style={{ padding: '0 16px', color: '#666', fontSize: '14px' }}>
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ background: '#3b82f6', color: 'white' }}
      >
        Next →
      </button>
    </div>
  );
};

// Search Input Component
export const SearchInput = ({ value, onChange, onSearch, placeholder, loading }) => (
  <div style={{ position: 'relative' }}>
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyPress={(e) => e.key === 'Enter' && onSearch && onSearch()}
      placeholder={placeholder}
      disabled={loading}
      style={{ paddingRight: '100px' }}
    />
    {onSearch && (
      <button
        onClick={onSearch}
        disabled={loading}
        style={{
          position: 'absolute',
          right: '4px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#3b82f6',
          color: 'white',
          padding: '8px 16px'
        }}
      >
        {loading ? '...' : '🔍 Search'}
      </button>
    )}
  </div>
);

export default {
  SkeletonCard,
  LoadingSpinner,
  ErrorAlert,
  SuccessAlert,
  InfoAlert,
  WarningAlert,
  EmptyState,
  ResultCount,
  Badge,
  StatCard,
  Pagination,
  SearchInput
};
