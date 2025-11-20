import React, { useState } from 'react';
import axios from 'axios';
import { Calculator as CalcIcon, Building, Ruler, Car, TrendingUp } from 'lucide-react';

function Calculator() {
  const [inputs, setInputs] = useState({
    district: 'Pune',
    zone: 'Residential',
    plotArea: '',
    roadWidth: '',
    landUse: 'Residential',
    floors: '',
    buildingHeight: '',
    isTOD: false,
    hasHeritage: false,
    dwellingUnits: '',
    carpetAreaPerUnit: ''
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const districts = [
    'Mumbai City', 'Mumbai Suburban', 'Thane', 'Pune', 'Nagpur', 'Nashik', 
    'Aurangabad', 'Solapur', 'Kolhapur', 'Sangli', 'Other'
  ];

  const handleCalculate = async () => {
    if (!inputs.plotArea || !inputs.roadWidth) {
      alert('Please enter plot area and road width');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/calculator/calculate', inputs);
      setResults(response.data);
    } catch (error) {
      alert('Calculation failed: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ paddingTop: '40px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CalcIcon size={36} color="#10b981" />
          Comprehensive UDCPR Calculator
        </h1>
        <p style={{ color: '#666' }}>
          Calculate FSI, setbacks, parking, height, and built-up area based on UDCPR 2020
        </p>
      </div>

      {/* Input Form */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '20px', color: '#10b981' }}>Project Parameters</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
              District
            </label>
            <select 
              value={inputs.district}
              onChange={(e) => setInputs({...inputs, district: e.target.value})}
            >
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
              Zone Type
            </label>
            <select 
              value={inputs.zone}
              onChange={(e) => setInputs({...inputs, zone: e.target.value})}
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Mixed">Mixed Use</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
              Plot Area (sq.m) *
            </label>
            <input 
              type="number" 
              value={inputs.plotArea}
              onChange={(e) => setInputs({...inputs, plotArea: e.target.value})}
              placeholder="e.g., 500"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
              Road Width (m) *
            </label>
            <input 
              type="number" 
              value={inputs.roadWidth}
              onChange={(e) => setInputs({...inputs, roadWidth: e.target.value})}
              placeholder="e.g., 12"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
              Land Use
            </label>
            <select 
              value={inputs.landUse}
              onChange={(e) => setInputs({...inputs, landUse: e.target.value})}
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Retail/Mall">Retail/Mall</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Industrial">Industrial</option>
              <option value="Mixed">Mixed Use</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
              Number of Floors
            </label>
            <input 
              type="number" 
              value={inputs.floors}
              onChange={(e) => setInputs({...inputs, floors: e.target.value})}
              placeholder="e.g., 4"
            />
          </div>

          {inputs.landUse === 'Residential' && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Dwelling Units
                </label>
                <input 
                  type="number" 
                  value={inputs.dwellingUnits}
                  onChange={(e) => setInputs({...inputs, dwellingUnits: e.target.value})}
                  placeholder="e.g., 10"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
                  Carpet Area per Unit (sq.m)
                </label>
                <input 
                  type="number" 
                  value={inputs.carpetAreaPerUnit}
                  onChange={(e) => setInputs({...inputs, carpetAreaPerUnit: e.target.value})}
                  placeholder="e.g., 60"
                />
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input 
              type="checkbox"
              checked={inputs.isTOD}
              onChange={(e) => setInputs({...inputs, isTOD: e.target.checked})}
            />
            <span style={{ fontSize: '14px' }}>TOD Zone (Transit Oriented Development)</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input 
              type="checkbox"
              checked={inputs.hasHeritage}
              onChange={(e) => setInputs({...inputs, hasHeritage: e.target.checked})}
            />
            <span style={{ fontSize: '14px' }}>Heritage Building</span>
          </label>
        </div>

        <button 
          onClick={handleCalculate}
          disabled={loading}
          style={{ 
            background: loading ? '#9ca3af' : '#10b981', 
            color: 'white', 
            marginTop: '20px', 
            width: '100%',
            fontSize: '16px',
            padding: '12px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Calculating...' : '🧮 Calculate All Parameters'}
        </button>
      </div>

      {/* Results */}
      {results && (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', textAlign: 'center' }}>
              <TrendingUp size={32} style={{ marginBottom: '10px' }} />
              <h2 style={{ fontSize: '32px', marginBottom: '5px', color: 'white' }}>{results.summary.permissibleFSI.toFixed(2)}</h2>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>Current FSI</p>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', textAlign: 'center' }}>
              <Building size={32} style={{ marginBottom: '10px' }} />
              <h2 style={{ fontSize: '32px', marginBottom: '5px', color: 'white' }}>{results.summary.maxBuiltUp.toFixed(0)}</h2>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>Built-up Area (sq.m)</p>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', textAlign: 'center' }}>
              <Building size={32} style={{ marginBottom: '10px' }} />
              <h2 style={{ fontSize: '32px', marginBottom: '5px', color: 'white' }}>
                {results.summary?.totalConstructible ? results.summary.totalConstructible.toFixed(0) : results.summary.maxBuiltUp.toFixed(0)}
              </h2>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>Total Constructible (sq.m)</p>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white', textAlign: 'center' }}>
              <Ruler size={32} style={{ marginBottom: '10px' }} />
              <h2 style={{ fontSize: '32px', marginBottom: '5px', color: 'white' }}>
                {results.height?.proposedHeight ? `${results.height.proposedHeight}m` : `${results.summary.maxHeight}m`}
              </h2>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>
                {results.height?.proposedHeight ? 'Proposed Height' : 'Max Height'}
              </p>
              {results.height?.proposedHeight && results.height?.maxHeight && (
                <p style={{ fontSize: '11px', opacity: 0.8, marginTop: '5px' }}>
                  (Max: {results.height.maxHeight}m)
                </p>
              )}
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white', textAlign: 'center' }}>
              <Car size={32} style={{ marginBottom: '10px' }} />
              <h2 style={{ fontSize: '32px', marginBottom: '5px', color: 'white' }}>{results.summary.requiredParking}</h2>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>Parking (ECS)</p>
            </div>
          </div>

          {/* FSI Comparison Table */}
          {results.fsi && (results.fsi.premiumFSI > 0 || results.fsi.tdrFSI > 0) && (
            <div className="card" style={{ marginBottom: '20px', background: '#f8fafc', border: '2px solid #0369a1' }}>
              <h4 style={{ color: '#0c4a6e', marginBottom: '15px' }}>💰 FSI Options & Built-up Area Comparison</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#0369a1', color: 'white' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0284c7' }}>Scenario</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #0284c7' }}>FSI</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #0284c7' }}>Built-up Area</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #0284c7' }}>Additional Area</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0284c7' }}>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: '#e0f2fe' }}>
                      <td style={{ padding: '12px', fontWeight: '600' }}>✅ Basic FSI (Current)</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>{results.fsi.baseFSI?.toFixed(2) || results.fsi.totalPermissibleFSI.toFixed(2)}</td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>
                        {results.fsi.builtUpBasic ? results.fsi.builtUpBasic.toFixed(0) : results.builtUp.totalBuiltUp.toFixed(0)} sq.m
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>-</td>
                      <td style={{ padding: '12px', color: '#10b981', fontWeight: '600' }}>FREE</td>
                    </tr>
                    {results.fsi.premiumFSI > 0 && results.fsi.builtUpWithPremium > 0 && (
                      <tr style={{ background: '#fff' }}>
                        <td style={{ padding: '12px', fontWeight: '600' }}>💎 With Premium FSI</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>{Math.min(results.fsi.baseFSI + results.fsi.premiumFSI, results.fsi.maxFSI).toFixed(2)}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>{results.fsi.builtUpWithPremium.toFixed(0)} sq.m</td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#0369a1', fontWeight: '600' }}>
                          +{(results.fsi.builtUpWithPremium - (results.fsi.builtUpBasic || results.builtUp.totalBuiltUp)).toFixed(0)} sq.m
                        </td>
                        <td style={{ padding: '12px', color: '#f59e0b' }}>Purchasable</td>
                      </tr>
                    )}
                    {results.fsi.tdrFSI > 0 && results.fsi.builtUpWithTDR > 0 && (
                      <tr style={{ background: '#fef3c7' }}>
                        <td style={{ padding: '12px', fontWeight: '600' }}>🏆 With TDR (Maximum)</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>{results.fsi.maxFSI.toFixed(2)}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>{results.fsi.builtUpWithTDR.toFixed(0)} sq.m</td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#0369a1', fontWeight: '600' }}>
                          +{(results.fsi.builtUpWithTDR - (results.fsi.builtUpBasic || results.builtUp.totalBuiltUp)).toFixed(0)} sq.m
                        </td>
                        <td style={{ padding: '12px', color: '#f59e0b' }}>TDR Purchase</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '15px', padding: '12px', background: '#dbeafe', borderRadius: '6px', fontSize: '13px' }}>
                <strong>💡 Understanding FSI Options:</strong>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                  <li><strong>Basic FSI:</strong> Free FSI available to all plots (includes road bonus if applicable)</li>
                  {results.fsi.premiumFSI > 0 && <li><strong>Premium FSI:</strong> Additional FSI that can be purchased from the authority</li>}
                  {results.fsi.tdrFSI > 0 && <li><strong>TDR:</strong> Transferable Development Rights - can be purchased from TDR holders (plot &gt; 1000 sq.m)</li>}
                </ul>
              </div>
            </div>
          )}

          {/* Detailed Results */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* FSI Details */}
            <div className="card" style={{ background: '#f0f9ff', border: '2px solid #0369a1' }}>
              <h4 style={{ color: '#0c4a6e', marginBottom: '15px' }}>📊 FSI Breakdown</h4>
              {results.fsi.calculations.map((calc, i) => (
                <div key={i} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #e0e7ff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <strong style={{ fontSize: '14px' }}>{calc.label}:</strong>
                    <span style={{ fontSize: '14px', color: '#0369a1' }}>{calc.value}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{calc.description}</p>
                </div>
              ))}
              {results.fsi.notes.length > 0 && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#dbeafe', borderRadius: '6px' }}>
                  <strong style={{ fontSize: '12px' }}>Notes:</strong>
                  <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', fontSize: '12px' }}>
                    {results.fsi.notes.map((note, i) => <li key={i}>{note}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Setbacks */}
            <div className="card" style={{ background: '#fef3c7', border: '2px solid #f59e0b' }}>
              <h4 style={{ color: '#92400e', marginBottom: '15px' }}>📏 Setback Requirements</h4>
              {results.setbacks.calculations.map((calc, i) => (
                <div key={i} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #fde68a' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <strong style={{ fontSize: '14px' }}>{calc.label}:</strong>
                    <span style={{ fontSize: '14px', color: '#f59e0b' }}>{calc.value}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{calc.description}</p>
                </div>
              ))}
              {results.setbacks.notes.length > 0 && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#fef3c7', borderRadius: '6px' }}>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px' }}>
                    {results.setbacks.notes.map((note, i) => <li key={i}>{note}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Parking */}
            <div className="card" style={{ background: '#f0fdf4', border: '2px solid #10b981' }}>
              <h4 style={{ color: '#065f46', marginBottom: '15px' }}>🚗 Parking Requirements</h4>
              {results.parking.calculations.map((calc, i) => (
                <div key={i} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #d1fae5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <strong style={{ fontSize: '14px' }}>{calc.label}:</strong>
                    <span style={{ fontSize: '14px', color: '#10b981' }}>{calc.value}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{calc.description}</p>
                </div>
              ))}
              {results.parking.notes.length > 0 && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#d1fae5', borderRadius: '6px' }}>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px' }}>
                    {results.parking.notes.map((note, i) => <li key={i}>{note}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Height & Built-up */}
            <div className="card" style={{ background: '#fce7f3', border: '2px solid #ec4899' }}>
              <h4 style={{ color: '#9f1239', marginBottom: '15px' }}>🏢 Height & Built-up Area</h4>
              
              {/* Height Section */}
              <div style={{ marginBottom: '15px', padding: '10px', background: '#fce7f3', borderRadius: '6px', borderLeft: '3px solid #ec4899' }}>
                <strong style={{ fontSize: '13px', color: '#9f1239', display: 'block', marginBottom: '8px' }}>Height Analysis:</strong>
                
                {/* Proposed Height (if floors specified) */}
                {results.height.proposedHeight && (
                  <div style={{ 
                    marginBottom: '12px', 
                    padding: '8px', 
                    background: results.height.isCompliant ? '#d1fae5' : '#fee2e2',
                    borderRadius: '6px',
                    border: `2px solid ${results.height.isCompliant ? '#10b981' : '#ef4444'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>Your Proposed Height:</span>
                      <strong style={{ fontSize: '15px', color: results.height.isCompliant ? '#065f46' : '#991b1b' }}>
                        {results.height.proposedHeight}m
                      </strong>
                    </div>
                    <p style={{ fontSize: '11px', color: results.height.isCompliant ? '#065f46' : '#991b1b', margin: '3px 0 0 0' }}>
                      {results.height.proposedFloors} floors × {results.height.floorHeight}m = {results.height.proposedHeight}m
                    </p>
                    {!results.height.isCompliant && (
                      <p style={{ fontSize: '11px', color: '#991b1b', marginTop: '5px', fontWeight: '600' }}>
                        ⚠️ Exceeds permitted maximum!
                      </p>
                    )}
                  </div>
                )}
                
                {/* Permitted Maximum */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px' }}>Permitted Max Height:</span>
                    <strong style={{ fontSize: '13px', color: '#ec4899' }}>{results.height.maxHeight}m</strong>
                  </div>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px' }}>Permitted Max Floors:</span>
                    <strong style={{ fontSize: '13px', color: '#ec4899' }}>{results.height.maxFloors}</strong>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px' }}>Standard Floor Height:</span>
                    <strong style={{ fontSize: '13px', color: '#ec4899' }}>{results.height.floorHeight}m</strong>
                  </div>
                  <p style={{ fontSize: '11px', color: '#9f1239', margin: '3px 0 0 0' }}>Floor-to-floor height</p>
                </div>
                {results.height.notes && results.height.notes.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '11px', color: '#9f1239' }}>
                    {results.height.notes.map((note, i) => <div key={i}>• {note}</div>)}
                  </div>
                )}
              </div>

              {/* Built-up Section */}
              <div style={{ padding: '10px', background: '#fbcfe8', borderRadius: '6px', borderLeft: '3px solid #ec4899' }}>
                <strong style={{ fontSize: '13px', color: '#9f1239', display: 'block', marginBottom: '8px' }}>Built-up Area:</strong>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px' }}>Total Built-up:</span>
                    <strong style={{ fontSize: '13px', color: '#ec4899' }}>{results.builtUp.totalBuiltUp.toFixed(0)} sq.m</strong>
                  </div>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px' }}>Per Floor:</span>
                    <strong style={{ fontSize: '13px', color: '#ec4899' }}>{results.builtUp.perFloor.toFixed(0)} sq.m</strong>
                  </div>
                  <p style={{ fontSize: '11px', color: '#9f1239', margin: '3px 0 0 0' }}>
                    {results.builtUp.totalBuiltUp.toFixed(0)} ÷ {results.height.maxFloors} floors
                  </p>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '13px' }}>Ground Coverage:</span>
                    <strong style={{ fontSize: '13px', color: '#ec4899' }}>{results.builtUp.coverage}%</strong>
                  </div>
                  {/* Coverage Bar */}
                  <div style={{ width: '100%', height: '8px', background: '#fce7f3', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${Math.min(results.builtUp.coverage, 100)}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #ec4899, #f472b6)',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <p style={{ fontSize: '11px', color: '#9f1239', margin: '3px 0 0 0' }}>
                    {results.builtUp.perFloor.toFixed(0)} sq.m on {results.summary.plotArea} sq.m plot
                  </p>
                </div>
              </div>
            </div>

            {/* Ancillary Areas */}
            {results.ancillary && results.ancillary.calculations && (
              <div className="card" style={{ background: '#f3e8ff', border: '2px solid #a855f7' }}>
                <h4 style={{ color: '#6b21a8', marginBottom: '15px' }}>🔧 Ancillary Areas (NOT in FSI)</h4>
                {results.ancillary.calculations.map((calc, i) => (
                  <div key={i} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #e9d5ff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <strong style={{ fontSize: '14px' }}>{calc.label}:</strong>
                      <span style={{ fontSize: '14px', color: '#a855f7' }}>{calc.value}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{calc.description}</p>
                  </div>
                ))}
                <div style={{ marginTop: '15px', padding: '12px', background: '#e9d5ff', borderRadius: '6px', borderLeft: '4px solid #a855f7' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '15px', color: '#6b21a8' }}>Total Constructible:</strong>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#a855f7' }}>
                      {results.ancillary.totalConstructible?.toFixed(0) || results.builtUp.totalBuiltUp.toFixed(0)} sq.m
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#6b21a8', margin: '5px 0 0 0' }}>
                    FSI Built-up ({results.builtUp.totalBuiltUp.toFixed(0)} sq.m) + Ancillary ({results.ancillary.totalAncillary?.toFixed(0) || 0} sq.m)
                  </p>
                </div>
                {results.ancillary.notes && results.ancillary.notes.length > 0 && (
                  <div style={{ marginTop: '10px', padding: '10px', background: '#faf5ff', borderRadius: '6px' }}>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '11px', color: '#6b21a8' }}>
                      {results.ancillary.notes.map((note, i) => <li key={i}>{note}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => window.print()}
              style={{ 
                background: '#3b82f6', 
                color: 'white', 
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🖨️ Print Report
            </button>
            <button 
              onClick={() => {
                const data = JSON.stringify(results, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `calculator-results-${Date.now()}.json`;
                a.click();
              }}
              style={{ 
                background: '#8b5cf6', 
                color: 'white', 
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              💾 Export Data
            </button>
            <button 
              onClick={() => {
                const text = `
UDCPR Calculator Results
========================

Plot Details:
- District: ${inputs.district}
- Zone: ${inputs.zone}
- Plot Area: ${results.summary.plotArea} sq.m
- Road Width: ${inputs.roadWidth}m

FSI:
- Current FSI: ${results.fsi.totalPermissibleFSI}
- Max FSI: ${results.fsi.maxFSI}
- Built-up Area: ${results.builtUp.totalBuiltUp} sq.m
- Total Constructible: ${results.summary.totalConstructible} sq.m

Setbacks:
- Front: ${results.setbacks.front}m
- Rear: ${results.setbacks.rear}m
- Sides: ${results.setbacks.side1}m, ${results.setbacks.side2}m

Height:
- Max Height: ${results.height.maxHeight}m
- Max Floors: ${results.height.maxFloors}

Parking:
- Required: ${results.parking.ecs} ECS
- Area: ${results.parking.parkingArea} sq.m
                `.trim();
                
                navigator.clipboard.writeText(text).then(() => {
                  alert('Results copied to clipboard!');
                });
              }}
              style={{ 
                background: '#10b981', 
                color: 'white', 
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              📋 Copy Summary
            </button>
          </div>

          {/* Area Distribution Visualization */}
          <div className="card" style={{ marginTop: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <h4 style={{ color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📐 Area Distribution Summary
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '5px' }}>Plot Area</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{results.summary.plotArea} sq.m</div>
                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '3px' }}>Total land area</div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '5px' }}>FSI Built-up</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{results.builtUp.totalBuiltUp.toFixed(0)} sq.m</div>
                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '3px' }}>
                  {((results.builtUp.totalBuiltUp / results.summary.plotArea) * 100).toFixed(1)}% of plot area
                </div>
              </div>
              
              {results.ancillary && (
                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
                  <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '5px' }}>Ancillary Areas</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {results.ancillary.totalAncillary?.toFixed(0) || 0} sq.m
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '3px' }}>
                    {results.ancillary.totalAncillary ? 
                      ((results.ancillary.totalAncillary / results.builtUp.totalBuiltUp) * 100).toFixed(1) : 0}% of built-up
                  </div>
                </div>
              )}
              
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '8px', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '5px' }}>Total Constructible</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {results.summary.totalConstructible?.toFixed(0) || results.builtUp.totalBuiltUp.toFixed(0)} sq.m
                </div>
                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '3px' }}>
                  FSI + Ancillary areas
                </div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '5px' }}>Parking Required</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{results.parking.parkingArea} sq.m</div>
                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '3px' }}>
                  {results.parking.ecs} ECS × 25 sq.m
                </div>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '5px' }}>Open Space</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {(results.summary.plotArea - results.builtUp.perFloor).toFixed(0)} sq.m
                </div>
                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '3px' }}>
                  {((1 - results.builtUp.coverage / 100) * 100).toFixed(1)}% of plot
                </div>
              </div>
            </div>
            
            {/* Visual Bar */}
            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
              <div style={{ fontSize: '13px', marginBottom: '10px', fontWeight: '600' }}>Area Utilization:</div>
              <div style={{ display: 'flex', height: '40px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <div 
                  style={{ 
                    background: '#10b981', 
                    width: `${results.builtUp.coverage}%`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    transition: 'width 0.3s ease'
                  }}
                  title={`Built-up: ${results.builtUp.coverage}%`}
                >
                  {results.builtUp.coverage > 15 && `${results.builtUp.coverage}%`}
                </div>
                <div 
                  style={{ 
                    background: '#6366f1', 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  title={`Open Space: ${(100 - results.builtUp.coverage).toFixed(1)}%`}
                >
                  {(100 - results.builtUp.coverage) > 15 && `${(100 - results.builtUp.coverage).toFixed(1)}%`}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', opacity: 0.9 }}>
                <span>🏗️ Built-up Coverage</span>
                <span>🌳 Open Space</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="card" style={{ background: '#fff3cd', border: '2px solid #ffc107', marginTop: '20px' }}>
            <p style={{ fontSize: '13px', color: '#856404', margin: 0 }}>
              <strong>⚠️ Disclaimer:</strong> These calculations are based on UDCPR 2020 general guidelines. 
              Actual requirements may vary based on specific plot conditions, local authority requirements, and recent amendments. 
              Please verify with your local planning authority before finalizing designs.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Calculator;
