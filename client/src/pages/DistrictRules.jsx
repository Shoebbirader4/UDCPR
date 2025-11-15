import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Filter } from 'lucide-react';

function DistrictRules() {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [query, setQuery] = useState('');
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const categories = [
    'FSI', 
    'Setback', 
    'Height', 
    'Parking', 
    'Heritage', 
    'TDR', 
    'Amenity', 
    'Environmental', 
    'Safety', 
    'Accessibility',
    'CRZ',
    'TOD',
    'Affordable Housing',
    'Mixed Use',
    'Special Buildings',
    'Land Use',
    'Zoning',
    'Infrastructure',
    'Social Infrastructure',
    'Redevelopment',
    'Regularization'
  ];

  useEffect(() => {
    loadDistricts();
    loadStats();
  }, []);

  const loadDistricts = async () => {
    try {
      const response = await axios.get('/api/district-rules/districts');
      setDistricts(response.data);
    } catch (error) {
      console.error('Failed to load districts:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get('/api/district-rules/stats/overview');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedDistrict) params.district = selectedDistrict;
      if (selectedCategory) params.category = selectedCategory;
      if (query) params.query = query;

      const response = await axios.get('/api/district-rules/search', { params });
      setRules(response.data);
    } catch (error) {
      alert('Search failed: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '10px' }}>District-Specific UDCPR Rules</h1>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Comprehensive UDCPR 2020 regulations covering all aspects of urban development
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ background: '#e0e7ff', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
            📋 2,704 Rules
          </span>
          <span style={{ background: '#fef3c7', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
            🏷️ 21 Categories
          </span>
          <span style={{ background: '#d1fae5', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
            🗺️ 35 Districts
          </span>
          <span style={{ background: '#fce7f3', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
            🏛️ 6 Regions
          </span>
          <span style={{ background: '#e0f2fe', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
            ✅ Complete Coverage
          </span>
        </div>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <div className="card" style={{ background: '#f0f9ff', border: '2px solid #0369a1' }}>
            <h3 style={{ color: '#0369a1', marginBottom: '5px' }}>{stats.totalRules}</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>Total Rules</p>
          </div>
          <div className="card" style={{ background: '#f0fdf4', border: '2px solid #10b981' }}>
            <h3 style={{ color: '#10b981', marginBottom: '5px' }}>{stats.totalDistricts}</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>Districts Covered</p>
          </div>
          <div className="card" style={{ background: '#fef3c7', border: '2px solid #f59e0b' }}>
            <h3 style={{ color: '#f59e0b', marginBottom: '5px' }}>{stats.byCategory?.length || 0}</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>Categories</p>
          </div>
        </div>
      )}

      <div className="card" style={{ background: '#f0fdf4', border: '2px solid #10b981', marginBottom: '30px' }}>
        <h4 style={{ color: '#065f46', marginBottom: '15px', fontSize: '16px' }}>📚 All 21 UDCPR Categories Available</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          {categories.map(cat => (
            <div 
              key={cat}
              onClick={() => { setSelectedCategory(cat); handleSearch(); }}
              style={{ 
                background: 'white', 
                padding: '10px', 
                borderRadius: '8px', 
                fontSize: '13px', 
                fontWeight: '500',
                color: '#065f46',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '1px solid #d1fae5'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#d1fae5';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={20} /> Filter Rules
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
              <MapPin size={16} style={{ display: 'inline', marginRight: '5px' }} />
              District
            </label>
            <select 
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
              Category
            </label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by keyword (FSI, setback, parking, etc.)"
            style={{ flex: 1 }}
          />
          <button 
            onClick={handleSearch}
            style={{ background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Search size={18} /> Search
          </button>
          {(selectedDistrict || selectedCategory || query) && (
            <button 
              onClick={() => {
                setSelectedDistrict('');
                setSelectedCategory('');
                setQuery('');
                setRules([]);
              }}
              style={{ background: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading && <p>Searching...</p>}

      {rules.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>
              Found {rules.length} rule{rules.length !== 1 ? 's' : ''}
              {selectedDistrict && ` in ${selectedDistrict}`}
              {selectedCategory && ` (${selectedCategory})`}
            </h3>
            {selectedDistrict && !selectedCategory && rules.length > 0 && (
              <div style={{ fontSize: '13px', color: '#666' }}>
                {(() => {
                  const categoryCounts = {};
                  rules.forEach(rule => {
                    categoryCounts[rule.category] = (categoryCounts[rule.category] || 0) + 1;
                  });
                  return Object.entries(categoryCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([cat, count]) => `${cat}: ${count}`)
                    .join(' • ');
                })()}
              </div>
            )}
          </div>
          
          <div style={{ display: 'grid', gap: '15px' }}>
            {rules.map((rule) => (
              <div key={rule._id} className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                  <div>
                    <span style={{ 
                      background: '#e0e7ff', 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      marginRight: '10px'
                    }}>
                      {rule.district}
                    </span>
                    <span style={{ 
                      background: '#fef3c7', 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '12px'
                    }}>
                      {rule.category}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {rule.chapter} - {rule.section} - {rule.clause}
                  </span>
                </div>
                
                <h4 style={{ marginBottom: '10px', color: '#333' }}>{rule.summary}</h4>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '10px' }}>
                  {rule.fullText}
                </p>
                
                {rule.applicableZones && rule.applicableZones.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <strong style={{ fontSize: '12px', color: '#666' }}>Applicable Zones: </strong>
                    {rule.applicableZones.map((zone, i) => (
                      <span 
                        key={i}
                        style={{ 
                          background: '#f3f4f6', 
                          padding: '2px 8px', 
                          borderRadius: '8px', 
                          fontSize: '11px',
                          marginLeft: '5px'
                        }}
                      >
                        {zone}
                      </span>
                    ))}
                  </div>
                )}

                {rule.planningAuthority && (
                  <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
                    Planning Authority: {rule.planningAuthority}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && rules.length === 0 && (selectedDistrict || selectedCategory || query) && (
        <div className="card" style={{ textAlign: 'center', padding: '40px', background: '#f9fafb' }}>
          <p style={{ color: '#666' }}>No rules found matching your criteria. Try different filters.</p>
        </div>
      )}

      <div className="card" style={{ background: '#e0f2fe', border: '2px solid #0284c7', marginTop: '30px' }}>
        <h4 style={{ marginBottom: '10px', color: '#0c4a6e' }}>✅ Official UDCPR Data Extracted</h4>
        <p style={{ fontSize: '14px', color: '#0c4a6e', marginBottom: '10px' }}>
          Rules extracted from official Maharashtra Government UDCPR PDFs:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
          <div style={{ background: 'white', padding: '15px', borderRadius: '8px' }}>
            <h5 style={{ color: '#0c4a6e', marginBottom: '8px' }}>📄 Mumbai UDCPR</h5>
            <p style={{ fontSize: '13px', color: '#0c4a6e', marginBottom: '5px' }}>• 261 pages processed</p>
            <p style={{ fontSize: '13px', color: '#0c4a6e', marginBottom: '5px' }}>• 459 rules extracted</p>
            <p style={{ fontSize: '13px', color: '#0c4a6e' }}>• Mumbai City & Suburban</p>
          </div>
          <div style={{ background: 'white', padding: '15px', borderRadius: '8px' }}>
            <h5 style={{ color: '#0c4a6e', marginBottom: '8px' }}>📄 Rest Maharashtra UDCPR</h5>
            <p style={{ fontSize: '13px', color: '#0c4a6e', marginBottom: '5px' }}>• 491 pages processed</p>
            <p style={{ fontSize: '13px', color: '#0c4a6e', marginBottom: '5px' }}>• 628 rules extracted</p>
            <p style={{ fontSize: '13px', color: '#0c4a6e' }}>• 28 other districts</p>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: '#0c4a6e', marginTop: '15px', fontStyle: 'italic' }}>
          ⚠️ Extracted rules require manual review and refinement for accuracy.
        </p>
      </div>

      <div className="card" style={{ background: '#fef3c7', border: '2px solid #f59e0b', marginTop: '20px' }}>
        <h4 style={{ marginBottom: '10px', color: '#92400e' }}>🗺️ Region-wise Distribution</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '13px', color: '#92400e' }}>
          <div><strong>Konkan:</strong> Mumbai City, Mumbai Suburban (459 rules)</div>
          <div><strong>Pune:</strong> Pune, Satara, Sangli, Kolhapur, Solapur (628 rules)</div>
          <div><strong>Nashik:</strong> Nashik, Dhule, Nandurbar, Jalgaon (628 rules)</div>
          <div><strong>Aurangabad:</strong> 8 districts (628 rules)</div>
          <div><strong>Nagpur:</strong> 6 districts (628 rules)</div>
          <div><strong>Amravati:</strong> 5 districts (628 rules)</div>
        </div>
      </div>
    </div>
  );
}

export default DistrictRules;
