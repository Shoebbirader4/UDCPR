import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calculator, CheckCircle, Bot, MapPin, FileText, TrendingUp, Award } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const modules = [
    { name: 'UDCPR Calculator', icon: Calculator, path: '/calculator', color: '#10b981', badge: 'Real Data', description: 'FSI, Setbacks, Parking from actual UDCPR' },
    { name: 'Rule Library', icon: BookOpen, path: '/rules', color: '#3b82f6', badge: '2,878 Rules', description: 'Complete UDCPR & Mumbai-DCPR database' },
    { name: 'Regulation Browser', icon: FileText, path: '/regulations', color: '#7c3aed', badge: '15 Chapters', description: 'Browse rules by chapter & regulation number' },
    { name: 'Table Viewer', icon: FileText, path: '/tables', color: '#059669', badge: '410 Tables', description: 'Browse all extracted tables (3A, 6B, 7A, etc.)' },
    { name: 'District Rules', icon: MapPin, path: '/district-rules', color: '#ef4444', badge: '231 Rules', description: 'District-specific regulations (23 districts)' },
    { name: 'AI Assistant', icon: Bot, path: '/ai-assistant', color: '#8b5cf6', badge: 'GPT-4o', description: 'Query 2,878 rules with AI' },
    { name: 'AI Compliance Check', icon: CheckCircle, path: '/compliance', color: '#f59e0b', badge: 'GPT-4 Vision', description: 'Auto-analyze drawings with AI' },
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
              ✅ 2,878 Total Rules
            </span>
            <span style={{ background: '#fef3c7', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', color: '#92400e' }}>
              ✅ 410 Tables Extracted
            </span>
            <span style={{ background: '#d1fae5', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', color: '#065f46' }}>
              ✅ 100% Real DOCX Data
            </span>
            <span style={{ background: '#fce7f3', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', color: '#9f1239' }}>
              ✅ 23 Districts Covered
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
            <h2 style={{ fontSize: '36px', marginBottom: '5px', color: 'white' }}>2,878</h2>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>Total Rules (DOCX)</p>
          </div>
          <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '5px', color: 'white' }}>410</h2>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>Tables Extracted</p>
          </div>
          <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '5px', color: 'white' }}>23</h2>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>Districts Covered</p>
          </div>
          <div className="card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '5px', color: 'white' }}>27</h2>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>Categories</p>
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
          <h4 style={{ color: '#065f46', marginBottom: '15px', fontSize: '18px' }}>📊 Real Data from Official DOCX Files</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', fontSize: '13px', color: '#065f46' }}>
            <div>
              <strong>UDCPR (Maharashtra):</strong>
              <p style={{ marginTop: '5px' }}>• 1,582 rules extracted</p>
              <p>• 190 tables (FSI, parking, etc.)</p>
              <p><strong>100% from DOCX</strong></p>
            </div>
            <div>
              <strong>Mumbai-DCPR:</strong>
              <p style={{ marginTop: '5px' }}>• 1,234 rules extracted</p>
              <p>• 220 Mumbai tables</p>
              <p><strong>Complete coverage</strong></p>
            </div>
            <div>
              <strong>Top Categories:</strong>
              <p style={{ marginTop: '5px' }}>• FSI: 488 rules</p>
              <p>• Height: 273 rules</p>
              <p>• Land Use: 274 rules</p>
            </div>
            <div>
              <strong>Data Quality:</strong>
              <p style={{ marginTop: '5px' }}>• Source: Official DOCX</p>
              <p>• Extracted: 2,878 rules</p>
              <p>• 23 districts covered</p>
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
