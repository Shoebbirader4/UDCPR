import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, XCircle } from 'lucide-react';

function ComplianceCheck() {
  const [file, setFile] = useState(null);
  const [projectData, setProjectData] = useState({
    proposedFSI: '',
    permissibleFSI: '',
    providedSetbacks: { front: '', rear: '', side1: '', side2: '' },
    requiredSetbacks: { front: '', rear: '', side1: '', side2: '' }
  });
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    try {
      const formData = new FormData();
      if (file) formData.append('drawing', file);
      formData.append('projectData', JSON.stringify(projectData));
      
      const response = await axios.post('/api/compliance/check', formData);
      setResult(response.data);
    } catch (error) {
      alert('Compliance check failed: ' + error.message);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h1 style={{ marginBottom: '10px' }}>AI Compliance Check</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Automated compliance validation using 3,776 real UDCPR rules from the database
      </p>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <span style={{ background: '#e0f2fe', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '500', color: '#0369a1' }}>
          ✅ Real Rule Validation
        </span>
        <span style={{ background: '#fef3c7', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '500', color: '#92400e' }}>
          ✅ GPT-4 Vision Analysis
        </span>
        <span style={{ background: '#d1fae5', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '500', color: '#065f46' }}>
          ✅ Specific Clause References
        </span>
      </div>
      
      <div className="card">
        <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          📄 Upload Drawing
          <span style={{ 
            fontSize: '12px', 
            background: '#0284c7', 
            color: 'white', 
            padding: '4px 10px', 
            borderRadius: '12px' 
          }}>
            AI Analysis
          </span>
        </h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
          Upload architectural drawings for AI-powered analysis using GPT-4 Vision.
        </p>
        <div style={{ 
          background: '#fef3c7', 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '15px',
          fontSize: '13px',
          color: '#92400e'
        }}>
          <strong>✅ Supported:</strong> JPG, PNG (images)<br />
          <strong>⚠️ Coming Soon:</strong> PDF, DWG (AutoCAD)<br />
          <strong>💡 Tip:</strong> For DWG files, export as JPG/PNG from AutoCAD first
        </div>
        <input 
          type="file" 
          accept=".jpg,.jpeg,.png,.pdf,.dwg"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: '10px' }}
        />
        {file && (
          <div style={{ 
            padding: '10px', 
            background: '#f0f9ff', 
            borderRadius: '6px',
            fontSize: '14px',
            color: '#0c4a6e'
          }}>
            📎 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            <br />
            <small>AI will extract: plot area, FSI, setbacks, parking, and more</small>
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '15px' }}>Project Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <input 
            type="number"
            placeholder="Proposed FSI"
            value={projectData.proposedFSI}
            onChange={(e) => setProjectData({...projectData, proposedFSI: e.target.value})}
          />
          <input 
            type="number"
            placeholder="Permissible FSI"
            value={projectData.permissibleFSI}
            onChange={(e) => setProjectData({...projectData, permissibleFSI: e.target.value})}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <input 
            type="number"
            placeholder="Proposed Height (m)"
            value={projectData.proposedHeight || ''}
            onChange={(e) => setProjectData({...projectData, proposedHeight: e.target.value})}
          />
          <input 
            type="number"
            placeholder="Permissible Height (m)"
            value={projectData.permissibleHeight || ''}
            onChange={(e) => setProjectData({...projectData, permissibleHeight: e.target.value})}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <input 
            type="number"
            placeholder="Provided Parking (ECS)"
            value={projectData.providedParking || ''}
            onChange={(e) => setProjectData({...projectData, providedParking: e.target.value})}
          />
          <input 
            type="number"
            placeholder="Required Parking (ECS)"
            value={projectData.requiredParking || ''}
            onChange={(e) => setProjectData({...projectData, requiredParking: e.target.value})}
          />
        </div>
        
        <button 
          onClick={handleCheck}
          style={{ background: '#f59e0b', color: 'white', marginTop: '20px', width: '100%' }}
        >
          Run Compliance Check
        </button>
      </div>

      {result && (
        <>
          {/* AI Drawing Analysis Results */}
          {result.hasDrawingAnalysis && result.extractedData && (
            <div className="card" style={{ background: '#e0f2fe', border: '2px solid #0284c7', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px', color: '#0c4a6e', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🤖 AI Drawing Analysis
                <span style={{ fontSize: '12px', background: '#0284c7', color: 'white', padding: '4px 10px', borderRadius: '12px' }}>
                  GPT-4 Vision
                </span>
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                {result.extractedData.plotArea && (
                  <div style={{ background: 'white', padding: '12px', borderRadius: '8px' }}>
                    <strong style={{ fontSize: '12px', color: '#666' }}>Plot Area</strong>
                    <p style={{ fontSize: '20px', color: '#0c4a6e', marginTop: '5px' }}>{result.extractedData.plotArea} sq.m</p>
                  </div>
                )}
                {result.extractedData.builtUpArea && (
                  <div style={{ background: 'white', padding: '12px', borderRadius: '8px' }}>
                    <strong style={{ fontSize: '12px', color: '#666' }}>Built-up Area</strong>
                    <p style={{ fontSize: '20px', color: '#0c4a6e', marginTop: '5px' }}>{result.extractedData.builtUpArea} sq.m</p>
                  </div>
                )}
                {result.extractedData.calculatedFSI && (
                  <div style={{ background: 'white', padding: '12px', borderRadius: '8px' }}>
                    <strong style={{ fontSize: '12px', color: '#666' }}>Calculated FSI</strong>
                    <p style={{ fontSize: '20px', color: '#0c4a6e', marginTop: '5px' }}>{result.extractedData.calculatedFSI.toFixed(2)}</p>
                  </div>
                )}
                {result.extractedData.parkingSpaces && (
                  <div style={{ background: 'white', padding: '12px', borderRadius: '8px' }}>
                    <strong style={{ fontSize: '12px', color: '#666' }}>Parking Spaces</strong>
                    <p style={{ fontSize: '20px', color: '#0c4a6e', marginTop: '5px' }}>{result.extractedData.parkingSpaces}</p>
                  </div>
                )}
              </div>

              {result.extractedData.setbacks && (
                <div style={{ background: 'white', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
                  <strong style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '10px' }}>Setbacks (meters)</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '14px' }}>
                    <div>Front: <strong>{result.extractedData.setbacks.front || 'N/A'}</strong></div>
                    <div>Rear: <strong>{result.extractedData.setbacks.rear || 'N/A'}</strong></div>
                    <div>Side 1: <strong>{result.extractedData.setbacks.side1 || 'N/A'}</strong></div>
                    <div>Side 2: <strong>{result.extractedData.setbacks.side2 || 'N/A'}</strong></div>
                  </div>
                </div>
              )}

              {result.drawingAnalysis && (
                <details style={{ marginTop: '15px' }}>
                  <summary style={{ cursor: 'pointer', color: '#0c4a6e', fontWeight: '500' }}>
                    View Full AI Analysis
                  </summary>
                  <div style={{ 
                    marginTop: '10px', 
                    padding: '12px', 
                    background: 'white', 
                    borderRadius: '8px',
                    fontSize: '13px',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    {result.drawingAnalysis}
                  </div>
                </details>
              )}
            </div>
          )}

          {/* Compliance Results */}
          <div className="card" style={{ 
            background: result.status === 'pass' ? '#f0fdf4' : '#fef2f2',
            border: `2px solid ${result.status === 'pass' ? '#10b981' : '#ef4444'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              {result.status === 'pass' ? 
                <CheckCircle size={32} color="#10b981" /> : 
                <XCircle size={32} color="#ef4444" />
              }
              <h3>{result.status === 'pass' ? 'Compliant' : 'Non-Compliant'}</h3>
              {result.hasDrawingAnalysis && (
                <span style={{ 
                  marginLeft: 'auto',
                  fontSize: '12px', 
                  background: '#0284c7', 
                  color: 'white', 
                  padding: '4px 10px', 
                  borderRadius: '12px' 
                }}>
                  AI Analyzed
                </span>
              )}
            </div>
            
            <p style={{ marginBottom: '15px' }}>{result.summary}</p>
            
            {result.violations.length > 0 && (
              <div>
                <h4 style={{ marginBottom: '10px' }}>Violations:</h4>
                {result.violations.map((v, i) => (
                  <div key={i} style={{ padding: '12px', background: '#fee2e2', borderRadius: '8px', marginBottom: '10px', border: '1px solid #fecaca' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <div>
                        <strong style={{ color: '#dc2626' }}>{v.type}:</strong> {v.message}
                      </div>
                      {v.severity && (
                        <span style={{ 
                          fontSize: '11px', 
                          background: v.severity === 'high' ? '#dc2626' : v.severity === 'medium' ? '#f59e0b' : '#6b7280',
                          color: 'white',
                          padding: '3px 10px',
                          borderRadius: '10px',
                          fontWeight: '600'
                        }}>
                          {v.severity}
                        </span>
                      )}
                    </div>
                    {v.ruleReference && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#7f1d1d', 
                        background: '#fef2f2', 
                        padding: '6px 10px', 
                        borderRadius: '6px',
                        marginTop: '6px'
                      }}>
                        📖 <strong>Rule:</strong> {v.ruleReference} - {v.ruleClause}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {result.recommendations.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <h4 style={{ marginBottom: '10px' }}>Recommendations:</h4>
                {result.recommendations.map((r, i) => (
                  <div key={i} style={{ padding: '10px', background: '#fef3c7', borderRadius: '6px', marginBottom: '8px' }}>
                    {r}
                  </div>
                ))}
              </div>
            )}

            {result.appliedRules && result.appliedRules.length > 0 && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <h4 style={{ marginBottom: '12px', color: '#374151' }}>
                  📋 Rules Checked ({result.rulesChecked || result.appliedRules.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {result.appliedRules.map((rule, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '8px 12px',
                        background: 'white',
                        borderRadius: '6px',
                        fontSize: '13px'
                      }}
                    >
                      <div>
                        <strong style={{ color: '#1f2937' }}>{rule.reference}</strong>
                        <span style={{ color: '#6b7280', marginLeft: '8px' }}>{rule.clause}</span>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        background: rule.result === 'compliant' ? '#d1fae5' : '#fee2e2',
                        color: rule.result === 'compliant' ? '#065f46' : '#991b1b',
                        padding: '4px 10px',
                        borderRadius: '10px',
                        fontWeight: '600'
                      }}>
                        {rule.result === 'compliant' ? '✓ Compliant' : '✗ Violated'}
                      </span>
                    </div>
                  ))}
                </div>
                {result.databaseRulesAvailable && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#6b7280' }}>
                    💡 {result.databaseRulesAvailable} relevant rules available in database
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '15px' }}>Download Report</h3>
            <button 
              onClick={async () => {
                try {
                  const response = await axios.post('/api/reports/download', {
                    projectData,
                    complianceResult: result
                  }, { responseType: 'blob' });
                  
                  const url = window.URL.createObjectURL(new Blob([response.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `UDCPR_Report_${Date.now()}.html`);
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                } catch (error) {
                  alert('Failed to download report: ' + error.message);
                }
              }}
              style={{ background: '#06b6d4', color: 'white', width: '100%' }}
            >
              Download Compliance Report (HTML)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ComplianceCheck;
