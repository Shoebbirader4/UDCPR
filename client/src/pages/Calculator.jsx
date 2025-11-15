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
              <p style={{ fontSize: '14px', opacity: 0.9 }}>Permissible FSI</p>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', textAlign: 'center' }}>
              <Building size={32} style={{ marginBottom: '10px' }} />
              <h2 style={{ fontSize: '32px', marginBottom: '5px', color: 'white' }}>{results.summary.maxBuiltUp.toFixed(0)}</h2>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>Max Built-up (sq.m)</p>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', textAlign: 'center' }}>
              <Ruler size={32} style={{ marginBottom: '10px' }} />
              <h2 style={{ fontSize: '32px', marginBottom: '5px', color: 'white' }}>{results.summary.maxHeight}m</h2>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>Max Height</p>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white', textAlign: 'center' }}>
              <Car size={32} style={{ marginBottom: '10px' }} />
              <h2 style={{ fontSize: '32px', marginBottom: '5px', color: 'white' }}>{results.summary.requiredParking}</h2>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>Parking (ECS)</p>
            </div>
          </div>

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
              <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #fbcfe8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <strong style={{ fontSize: '14px' }}>Max Height:</strong>
                  <span style={{ fontSize: '14px', color: '#ec4899' }}>{results.height.maxHeight}m</span>
                </div>
              </div>
              <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #fbcfe8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <strong style={{ fontSize: '14px' }}>Max Floors:</strong>
                  <span style={{ fontSize: '14px', color: '#ec4899' }}>{results.height.maxFloors}</span>
                </div>
              </div>
              <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #fbcfe8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <strong style={{ fontSize: '14px' }}>Total Built-up:</strong>
                  <span style={{ fontSize: '14px', color: '#ec4899' }}>{results.builtUp.totalBuiltUp} sq.m</span>
                </div>
              </div>
              <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #fbcfe8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <strong style={{ fontSize: '14px' }}>Per Floor:</strong>
                  <span style={{ fontSize: '14px', color: '#ec4899' }}>{results.builtUp.perFloor} sq.m</span>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <strong style={{ fontSize: '14px' }}>Ground Coverage:</strong>
                  <span style={{ fontSize: '14px', color: '#ec4899' }}>{results.builtUp.coverage}%</span>
                </div>
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
