import React from 'react';
import { Github, Mail, FileText } from 'lucide-react';

function Footer() {
  return (
    <footer style={{
      background: '#1f2937',
      color: 'white',
      padding: '40px 20px 20px',
      marginTop: '60px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '30px'
        }}>
          <div>
            <h3 style={{ marginBottom: '15px', color: 'white' }}>🏛️ UDCPR Master</h3>
            <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '1.6' }}>
              AI-powered compliance platform for UDCPR 2020 regulations. 
              Built from official Maharashtra Government documents.
            </p>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <span style={{ background: '#374151', padding: '6px 12px', borderRadius: '6px', fontSize: '12px' }}>
                1,087 Rules
              </span>
              <span style={{ background: '#374151', padding: '6px 12px', borderRadius: '6px', fontSize: '12px' }}>
                30 Districts
              </span>
              <span style={{ background: '#374151', padding: '6px 12px', borderRadius: '6px', fontSize: '12px' }}>
                6 Regions
              </span>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '15px', color: 'white' }}>Features</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#9ca3af', lineHeight: '2' }}>
              <li>• District-specific UDCPR rules</li>
              <li>• FSI & Setback calculator</li>
              <li>• AI compliance checking</li>
              <li>• Project management</li>
              <li>• Report generation</li>
              <li>• Zone finder with GIS</li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '15px', color: 'white' }}>Data Sources</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#9ca3af', lineHeight: '2' }}>
              <li>📄 Mumbai UDCPR (261 pages)</li>
              <li>📄 Rest Maharashtra UDCPR (491 pages)</li>
              <li>🏛️ Maharashtra Government</li>
              <li>📅 UDCPR 2020 & Amendments</li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '15px', color: 'white' }}>Legal</h4>
            <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.6' }}>
              This is an independent reference tool, not an official government application. 
              Always verify with local planning authorities for final approvals.
            </p>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <FileText size={20} color="#9ca3af" style={{ cursor: 'pointer' }} />
              <Mail size={20} color="#9ca3af" style={{ cursor: 'pointer' }} />
              <Github size={20} color="#9ca3af" style={{ cursor: 'pointer' }} />
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#6b7280'
        }}>
          <p>© 2025 UDCPR Master. Built with official Maharashtra Government UDCPR documents.</p>
          <p style={{ marginTop: '5px' }}>
            For official approvals, consult your local planning authority.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
