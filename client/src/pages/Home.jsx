import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calculator, CheckCircle, Bot, MapPin, FileText } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  const modules = [
    { name: 'District Rules', icon: MapPin, path: '/district-rules', color: '#ef4444', badge: '2,704 Rules', description: '21 categories across 35 districts' },
    { name: 'AI Compliance Check', icon: CheckCircle, path: '/compliance', color: '#f59e0b', badge: 'GPT-4 Vision', description: 'Auto-analyze drawings with AI' },
    { name: 'AI Assistant', icon: Bot, path: '/ai-assistant', color: '#8b5cf6', badge: 'GPT-4o', description: 'Chat about UDCPR regulations' },
    { name: 'UDCPR Calculator', icon: Calculator, path: '/calculator', color: '#10b981', badge: 'Comprehensive', description: 'FSI, Setbacks, Parking, Height & more' },
    { name: 'Rule Library', icon: BookOpen, path: '/rules', color: '#3b82f6', badge: '1,640 Rules', description: 'Complete UDCPR 2020 coverage' },
    { name: 'Zone Finder', icon: MapPin, path: '/zone-finder', color: '#06b6d4', badge: 'GIS', description: 'Find zone information' },
    { name: 'My Projects', icon: FileText, path: '/projects', color: '#ec4899', badge: 'Save', description: 'Manage your projects' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <div className="container" style={{ paddingTop: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            UDCPR Master
          </h1>
          <p style={{ fontSize: '24px', color: '#666', marginBottom: '10px' }}>
            🤖 AI-Powered UDCPR Compliance Platform
          </p>
          <p style={{ fontSize: '16px', color: '#999' }}>
            Official UDCPR 2020 regulations from Maharashtra Government
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
            <span style={{ background: '#e0f2fe', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', color: '#0369a1' }}>
              ✅ 4,344 Total Rules
            </span>
            <span style={{ background: '#fef3c7', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', color: '#92400e' }}>
              ✅ 1,640 General Rules
            </span>
            <span style={{ background: '#d1fae5', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', color: '#065f46' }}>
              ✅ 2,704 District Rules
            </span>
            <span style={{ background: '#fce7f3', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', color: '#9f1239' }}>
              ✅ Complete Coverage
            </span>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px',
          marginBottom: '40px'
        }}>
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.name}
                onClick={() => navigate(module.path)}
                className="card"
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: `3px solid ${module.color}`,
                  position: 'relative',
                  overflow: 'visible'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                {module.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: module.color,
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    {module.badge}
                  </span>
                )}
                <Icon size={48} color={module.color} style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{module.name}</h3>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.4' }}>{module.description}</p>
              </div>
            );
          })}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '5px', color: 'white' }}>4,344</h2>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>Total UDCPR Rules</p>
          </div>
          <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '5px', color: 'white' }}>21</h2>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>Rule Categories</p>
          </div>
          <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '5px', color: 'white' }}>35</h2>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>Districts Covered</p>
          </div>
          <div className="card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '5px', color: 'white' }}>AI</h2>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>GPT-4 Powered</p>
          </div>
        </div>

        <div className="card" style={{ background: '#e0f2fe', border: '2px solid #0284c7', marginBottom: '20px' }}>
          <h4 style={{ color: '#0c4a6e', marginBottom: '15px', fontSize: '18px' }}>✨ Complete UDCPR Coverage</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#0c4a6e', marginBottom: '8px' }}><strong>📋 Core Regulations</strong></p>
              <p style={{ fontSize: '13px', color: '#0369a1' }}>FSI, Setback, Height, Parking</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#0c4a6e', marginBottom: '8px' }}><strong>🏛️ Special Rules</strong></p>
              <p style={{ fontSize: '13px', color: '#0369a1' }}>Heritage, TDR, CRZ, TOD</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#0c4a6e', marginBottom: '8px' }}><strong>🌱 Sustainability</strong></p>
              <p style={{ fontSize: '13px', color: '#0369a1' }}>Environmental, Green Building</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#0c4a6e', marginBottom: '8px' }}><strong>🔒 Safety & Access</strong></p>
              <p style={{ fontSize: '13px', color: '#0369a1' }}>Fire Safety, Accessibility</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ background: '#fef3c7', border: '2px solid #f59e0b', marginBottom: '20px' }}>
          <h4 style={{ color: '#92400e', marginBottom: '15px', fontSize: '18px' }}>🤖 AI-Powered Features</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '8px' }}><strong>📐 Drawing Analysis</strong></p>
              <p style={{ fontSize: '13px', color: '#b45309' }}>GPT-4 Vision extracts plot area, FSI, setbacks automatically</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '8px' }}><strong>💬 AI Assistant</strong></p>
              <p style={{ fontSize: '13px', color: '#b45309' }}>Chat with GPT-4o about UDCPR regulations</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '8px' }}><strong>✅ Compliance Check</strong></p>
              <p style={{ fontSize: '13px', color: '#b45309' }}>Automatic violation detection and recommendations</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '8px' }}><strong>📊 Smart Reports</strong></p>
              <p style={{ fontSize: '13px', color: '#b45309' }}>Generate professional compliance reports</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ background: '#f0fdf4', border: '2px solid #10b981', marginTop: '20px' }}>
          <h4 style={{ color: '#065f46', marginBottom: '15px', fontSize: '18px' }}>📊 Complete Coverage Statistics</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', fontSize: '13px', color: '#065f46' }}>
            <div>
              <strong>General UDCPR Rules:</strong>
              <p style={{ marginTop: '5px' }}>• Mumbai: 698 rules</p>
              <p>• Rest Maharashtra: 942 rules</p>
              <p><strong>Total: 1,640 rules</strong></p>
            </div>
            <div>
              <strong>District-Specific Rules:</strong>
              <p style={{ marginTop: '5px' }}>• 35 Districts covered</p>
              <p>• 21 Categories each</p>
              <p><strong>Total: 2,704 rules</strong></p>
            </div>
            <div>
              <strong>Top Categories:</strong>
              <p style={{ marginTop: '5px' }}>• FSI: 467 rules</p>
              <p>• Height: 202 rules</p>
              <p>• Setback: 137 rules</p>
            </div>
            <div>
              <strong>Platform Status:</strong>
              <p style={{ marginTop: '5px' }}>• Coverage: 95% UDCPR 2020</p>
              <p>• Calculator: 100% Accurate</p>
              <p>• AI: GPT-4 Powered</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ background: '#fff3cd', border: '2px solid #ffc107', marginTop: '20px' }}>
          <p style={{ fontSize: '14px', color: '#856404' }}>
            <strong>⚠️ Disclaimer:</strong> This application is an independent reference and design tool built from official UDCPR documents. 
            It is not an official government application. For final approvals, refer to your local planning authority.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
