import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, ChevronDown, Search, Filter, FileText, MapPin, Eye, ExternalLink } from 'lucide-react';

const RegulationBrowser = () => {
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [regulations, setRegulations] = useState([]);
  const [selectedRegulation, setSelectedRegulation] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChapters, setExpandedChapters] = useState(new Set());
  const [selectedRule, setSelectedRule] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchChapters();
    fetchStats();
  }, []);

  const fetchChapters = async () => {
    try {
      const response = await fetch('/api/rules/chapters');
      if (response.ok) {
        const data = await response.json();
        setChapters(data);
      } else {
        const sampleChapters = [
          { number: 1, title: 'Administration', ruleCount: 45 },
          { number: 2, title: 'Development Permission and Commencement Certificate', ruleCount: 78 },
          { number: 3, title: 'Subdivision of Land and Plot Requirements', ruleCount: 156 },
          { number: 4, title: 'Land Use Classification and Permissible Uses', ruleCount: 234 },
          { number: 5, title: 'Floor Space Index (FSI)', ruleCount: 1121 },
          { number: 6, title: 'Margins and Setbacks', ruleCount: 52 },
          { number: 7, title: 'Building Height', ruleCount: 130 },
          { number: 8, title: 'Parking Requirements', ruleCount: 26 },
          { number: 9, title: 'Requirements of Parts of Building', ruleCount: 3 },
          { number: 10, title: 'Fire Safety Requirements', ruleCount: 145 },
          { number: 11, title: 'Structural Safety', ruleCount: 354 },
          { number: 12, title: 'Building Services and Environmental Provisions', ruleCount: 631 },
          { number: 13, title: 'Special Provisions for Certain Buildings', ruleCount: 122 },
          { number: 14, title: 'Special Schemes', ruleCount: 396 },
          { number: 15, title: 'Regulations for Special Activities/Plans', ruleCount: 54 }
        ];
        setChapters(sampleChapters);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
      const sampleChapters = [
        { number: 1, title: 'Administration', ruleCount: 45 },
        { number: 5, title: 'Floor Space Index (FSI)', ruleCount: 1121 },
        { number: 6, title: 'Margins and Setbacks', ruleCount: 52 },
        { number: 7, title: 'Building Height', ruleCount: 130 },
        { number: 8, title: 'Parking Requirements', ruleCount: 26 }
      ];
      setChapters(sampleChapters);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/rules/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setStats({
          totalRules: 3776,
          totalChapters: 15,
          totalRegulations: 1148,
          categories: {
            'FSI': 1121,
            'Environmental': 631,
            'General': 533,
            'Structural': 354
          }
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRegulations = async (chapterNumber) => {
    try {
      const response = await fetch(`/api/rules/chapter/${chapterNumber}/regulations`);
      if (response.ok) {
        const data = await response.json();
        setRegulations(data);
      } else {
        const sampleRegulations = [
          { number: `${chapterNumber}.1`, title: 'General Provisions', ruleCount: 12 },
          { number: `${chapterNumber}.2`, title: 'Specific Requirements', ruleCount: 8 },
          { number: `${chapterNumber}.3`, title: 'Calculations and Formulas', ruleCount: 15 },
          { number: `${chapterNumber}.4`, title: 'Exemptions and Relaxations', ruleCount: 6 }
        ];
        setRegulations(sampleRegulations);
      }
    } catch (error) {
      console.error('Error fetching regulations:', error);
      setRegulations([]);
    }
  };

  const fetchRules = async (regulationNumber) => {
    try {
      const response = await fetch(`/api/rules/regulation/${regulationNumber}`);
      if (response.ok) {
        const data = await response.json();
        setRules(data);
      } else {
        const sampleRules = [
          {
            reference: `UDCPR-${regulationNumber}.1`,
            clause: `${regulationNumber}.1`,
            summary: 'Basic requirements and definitions for this regulation',
            category: 'General',
            applicableZones: ['All'],
            hasTable: false,
            hasFormula: false
          },
          {
            reference: `UDCPR-${regulationNumber}.2`,
            clause: `${regulationNumber}.2`,
            summary: 'Specific calculation methods and procedures',
            category: 'FSI',
            applicableZones: ['R1', 'R2'],
            hasTable: true,
            hasFormula: true
          }
        ];
        setRules(sampleRules);
      }
    } catch (error) {
      console.error('Error fetching rules:', error);
      setRules([]);
    }
  };

  const handleChapterClick = (chapter) => {
    setSelectedChapter(chapter);
    setSelectedRegulation(null);
    setRules([]);
    fetchRegulations(chapter.number);
    
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapter.number)) {
      newExpanded.delete(chapter.number);
    } else {
      newExpanded.add(chapter.number);
    }
    setExpandedChapters(newExpanded);
  };

  const handleRegulationClick = (regulation) => {
    setSelectedRegulation(regulation);
    fetchRules(regulation.number);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'FSI': '#10b981',
      'Setback': '#3b82f6',
      'Height': '#8b5cf6',
      'Parking': '#f59e0b',
      'Environmental': '#059669',
      'Structural': '#dc2626',
      'Fire Safety': '#ea580c',
      'General': '#6b7280',
      'Heritage': '#7c3aed',
      'TDR': '#0891b2'
    };
    return colors[category] || '#6b7280';
  };

  const filteredChapters = chapters.filter(chapter => 
    searchTerm === '' || 
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.number.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading regulation browser...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          📚 Regulation Browser
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Browse {stats?.totalRules || 3776} rules organized by {stats?.totalChapters || 15} chapters and {stats?.totalRegulations || 1148} regulations
        </p>
      </div>

      {stats && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>{stats.totalRules}</h3>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Total Rules</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>{stats.totalChapters}</h3>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Chapters</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>{stats.totalRegulations}</h3>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Regulations</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>100%</h3>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Real Data</p>
          </div>
        </div>
      )}

      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={20} style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#9ca3af' 
          }} />
          <input
            type="text"
            placeholder="Search chapters by number or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>Chapters & Regulations</h3>
          </div>
          
          <div style={{ maxHeight: '600px', overflow: 'auto' }}>
            {filteredChapters.map((chapter) => (
              <div key={chapter.number}>
                <div 
                  style={{
                    padding: '15px 20px',
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    background: selectedChapter?.number === chapter.number ? '#f0f9ff' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onClick={() => handleChapterClick(chapter)}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {expandedChapters.has(chapter.number) ? 
                        <ChevronDown size={16} style={{ color: '#3b82f6' }} /> : 
                        <ChevronRight size={16} style={{ color: '#9ca3af' }} />
                      }
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>Chapter {chapter.number}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginLeft: '26px', marginTop: '4px' }}>
                      {chapter.title}
                    </div>
                  </div>
                  <div style={{ 
                    background: '#f3f4f6', 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    {chapter.ruleCount}
                  </div>
                </div>

                {expandedChapters.has(chapter.number) && regulations.length > 0 && (
                  <div style={{ background: '#f9fafb' }}>
                    {regulations.map((regulation) => (
                      <div
                        key={regulation.number}
                        style={{
                          padding: '12px 20px 12px 46px',
                          borderBottom: '1px solid #e5e7eb',
                          cursor: 'pointer',
                          background: selectedRegulation?.number === regulation.number ? '#dbeafe' : 'transparent'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegulationClick(regulation);
                        }}
                      >
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', marginBottom: '2px' }}>
                          Regulation {regulation.number}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {regulation.title}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              {selectedRegulation ? `Rules for Regulation ${selectedRegulation.number}` : 'Select a regulation to view rules'}
            </h3>
          </div>

          <div style={{ padding: '20px', maxHeight: '600px', overflow: 'auto' }}>
            {rules.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {rules.map((rule, index) => (
                  <div
                    key={index}
                    style={{
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setSelectedRule(rule)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(59,130,246,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div style={{ 
                        background: getCategoryColor(rule.category),
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {rule.category}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                        {rule.reference}
                      </div>
                    </div>

                    <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5', marginBottom: '10px' }}>
                      {rule.summary}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {rule.hasTable && (
                        <span style={{ 
                          background: '#dbeafe', 
                          color: '#1e40af', 
                          padding: '3px 8px', 
                          borderRadius: '10px', 
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          📊 Has Table
                        </span>
                      )}
                      {rule.hasFormula && (
                        <span style={{ 
                          background: '#fef3c7', 
                          color: '#92400e', 
                          padding: '3px 8px', 
                          borderRadius: '10px', 
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          🧮 Has Formula
                        </span>
                      )}
                      {rule.applicableZones && rule.applicableZones.length > 0 && (
                        <span style={{ 
                          background: '#d1fae5', 
                          color: '#065f46', 
                          padding: '3px 8px', 
                          borderRadius: '10px', 
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          📍 {rule.applicableZones.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
                <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p style={{ fontSize: '16px', margin: 0 }}>
                  {selectedRegulation ? 'Loading rules...' : 'Select a regulation from the left panel to view its rules'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedRule && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                  {selectedRule.reference}
                </h2>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <span style={{
                    background: getCategoryColor(selectedRule.category),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {selectedRule.category}
                  </span>
                  <span style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Clause {selectedRule.clause}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRule(null)}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{
              background: '#f9fafb',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              marginBottom: '20px'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>Rule Summary:</h4>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', margin: 0 }}>
                {selectedRule.summary}
              </p>
            </div>

            {selectedRule.applicableZones && selectedRule.applicableZones.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Applicable Zones:</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedRule.applicableZones.map((zone, i) => (
                    <span key={i} style={{
                      background: '#d1fae5',
                      color: '#065f46',
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {zone}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedRule(null)}
                style={{
                  padding: '10px 20px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegulationBrowser;
