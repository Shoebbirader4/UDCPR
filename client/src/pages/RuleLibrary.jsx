import React, { useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

function RuleLibrary() {
  const [query, setQuery] = useState('');
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'FSI', 'Height', 'Setback', 'Parking', 'Building Requirements',
    'Procedures', 'Affordable Housing', 'Structural', 'Amenity',
    'Fire Safety', 'Environmental', 'Redevelopment', 'TOD',
    'Heritage', 'TDR', 'Safety', 'Accessibility', 'Penalties'
  ];

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = { query };
      if (selectedCategory) params.category = selectedCategory;
      const response = await axios.get('/api/rules/search', { params });
      setRules(response.data);
    } catch (error) {
      alert('Search failed: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '10px' }}>UDCPR Rule Library</h1>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Complete UDCPR 2020 regulations - Mumbai & Rest of Maharashtra
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ background: '#e0e7ff', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
            📋 1,640 General Rules
          </span>
          <span style={{ background: '#fef3c7', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
            📍 Mumbai: 698 rules
          </span>
          <span style={{ background: '#d1fae5', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
            📍 Rest Maharashtra: 942 rules
          </span>
          <span style={{ background: '#e0f2fe', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
            ✅ 19 Categories
          </span>
        </div>
      </div>
      
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '15px' }}>Search Rules</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
            Category (Optional)
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search: FSI, parking, staircase, setback, fire safety..."
            style={{ flex: 1 }}
          />
          <button 
            onClick={handleSearch}
            style={{ background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Search size={18} /> Search
          </button>
          {(query || selectedCategory) && (
            <button 
              onClick={() => {
                setQuery('');
                setSelectedCategory('');
                setRules([]);
              }}
              style={{ background: '#ef4444', color: 'white' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ background: '#f0fdf4', border: '2px solid #10b981', marginBottom: '20px' }}>
        <h4 style={{ color: '#065f46', marginBottom: '10px' }}>📚 Complete UDCPR 2020 Coverage</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '13px', color: '#065f46' }}>
          <div><strong>FSI:</strong> 467 rules</div>
          <div><strong>Height:</strong> 202 rules</div>
          <div><strong>Setback:</strong> 137 rules</div>
          <div><strong>Procedures:</strong> 135 rules</div>
          <div><strong>Building Req:</strong> 83 rules</div>
          <div><strong>Affordable Housing:</strong> 68 rules</div>
          <div><strong>Structural:</strong> 55 rules</div>
          <div><strong>Parking:</strong> 52 rules</div>
          <div><strong>Amenity:</strong> 52 rules</div>
          <div><strong>Fire Safety:</strong> 45 rules</div>
          <div><strong>Environmental:</strong> 41 rules</div>
          <div><strong>Redevelopment:</strong> 33 rules</div>
        </div>
      </div>

      {loading && <p>Searching...</p>}

      {rules.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <h3>Found {rules.length} rule{rules.length !== 1 ? 's' : ''}</h3>
        </div>
      )}

      <div style={{ display: 'grid', gap: '15px' }}>
        {rules.map((rule) => (
          <div key={rule._id} className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: '#e0e7ff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>
                  {rule.chapter}
                </span>
                {rule.category && (
                  <span style={{ background: '#fef3c7', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>
                    {rule.category}
                  </span>
                )}
                {rule.subcategory && (
                  <span style={{ background: '#d1fae5', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>
                    {rule.subcategory}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {rule.reference || `Clause ${rule.clause}`}
              </span>
            </div>
            <h4 style={{ marginBottom: '10px', color: '#333' }}>{rule.summary}</h4>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>{rule.fullText}</p>
            {rule.tags && rule.tags.length > 0 && (
              <div style={{ marginTop: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {rule.tags.slice(0, 5).map((tag, i) => (
                  <span 
                    key={i}
                    style={{ 
                      background: '#f3f4f6', 
                      padding: '2px 8px', 
                      borderRadius: '8px', 
                      fontSize: '11px',
                      color: '#666'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {!loading && rules.length === 0 && (query || selectedCategory) && (
        <div className="card" style={{ textAlign: 'center', padding: '40px', background: '#f9fafb' }}>
          <p style={{ color: '#666' }}>No rules found. Try different keywords or category.</p>
        </div>
      )}
    </div>
  );
}

export default RuleLibrary;
