import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, MapPin, Calculator, CheckCircle, Bot, FileText, Table, List } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'District Rules', path: '/district-rules', icon: MapPin },
    { name: 'General Rules', path: '/rules', icon: BookOpen },
    { name: 'Regulations', path: '/regulations', icon: List },
    { name: 'Tables', path: '/tables', icon: Table },
    { name: 'Calculator', path: '/calculator', icon: Calculator },
    { name: 'Compliance', path: '/compliance', icon: CheckCircle },
    { name: 'AI Assistant', path: '/ai-assistant', icon: Bot },
    { name: 'Projects', path: '/projects', icon: FileText }
  ];

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '0 20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px'
      }}>
        <div 
          onClick={() => navigate('/')}
          style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span style={{ fontSize: '24px' }}>🏛️</span>
          UDCPR Master
        </div>

        <div style={{
          display: 'flex',
          gap: '5px',
          alignItems: 'center'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <Icon size={16} />
                <span style={{ display: window.innerWidth > 768 ? 'inline' : 'none' }}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
