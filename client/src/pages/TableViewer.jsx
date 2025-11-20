import { useState, useEffect } from 'react';
import { Search, Table, Eye } from 'lucide-react';

const TableViewer = () => {
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    filterTables();
  }, [tables, searchTerm, filter]);

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/tables');
      if (response.ok) {
        const data = await response.json();
        const allTables = [...(data.udcpr || []), ...(data.mumbai || [])];
        setTables(allTables);
      } else {
        const sampleTables = [
          {
            number: '3A',
            title: 'Internal Roads for Residential Development',
            type: 'Road/Infrastructure Table',
            source: 'UDCPR',
            content: 'Table showing minimum width requirements for internal roads in residential layouts based on length of road.'
          },
          {
            number: '6A',
            title: 'FSI by Road Width for Municipal Corporations',
            type: 'FSI Table',
            source: 'UDCPR',
            content: 'Comprehensive FSI table showing Basic FSI, Premium FSI on payment, Maximum TDR loading, and Maximum building potential based on road width categories.'
          },
          {
            number: '6B',
            title: 'Front Marginal Distances/Setback',
            type: 'Setback Table',
            source: 'UDCPR',
            content: 'Front setback requirements for residential buildings and mixed-use buildings based on road width categories.'
          }
        ];
        setTables(sampleTables);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      const sampleTables = [
        {
          number: '3A',
          title: 'Internal Roads for Residential Development',
          type: 'Road/Infrastructure Table',
          source: 'UDCPR',
          content: 'Table showing minimum width requirements for internal roads.'
        }
      ];
      setTables(sampleTables);
    } finally {
      setLoading(false);
    }
  };

  const filterTables = () => {
    let filtered = tables;

    if (searchTerm) {
      filtered = filtered.filter(table => 
        table.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter !== 'all') {
      filtered = filtered.filter(table => table.type === filter);
    }

    setFilteredTables(filtered);
  };

  const getTableTypes = () => {
    const types = [...new Set(tables.map(table => table.type))];
    return types.sort();
  };

  const getTypeColor = (type) => {
    const colors = {
      'FSI Table': '#10b981',
      'Setback Table': '#3b82f6',
      'Height Table': '#8b5cf6',
      'Parking Table': '#f59e0b',
      'Road/Infrastructure Table': '#ef4444',
      'Zoning Table': '#06b6d4',
      'General Table': '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  const getSourceBadge = (source) => {
    return source === 'UDCPR' ? 
      { bg: '#dbeafe', color: '#1e40af', text: 'UDCPR' } :
      { bg: '#fef3c7', color: '#92400e', text: 'Mumbai' };
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading tables...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          📊 Table Viewer
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          Browse all {tables.length} tables extracted from UDCPR and Mumbai-DCPR documents
        </p>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
            <Search size={20} style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9ca3af' 
            }} />
            <input
              type="text"
              placeholder="Search tables by number, title, or content..."
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

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: 'white',
              minWidth: '180px'
            }}
          >
            <option value="all">All Types ({tables.length})</option>
            {getTableTypes().map(type => {
              const count = tables.filter(t => t.type === type).length;
              return (
                <option key={type} value={type}>{type} ({count})</option>
              );
            })}
          </select>

          <div style={{ 
            padding: '8px 16px', 
            background: '#f3f4f6', 
            borderRadius: '20px', 
            fontSize: '14px',
            color: '#374151',
            fontWeight: '500'
          }}>
            {filteredTables.length} table{filteredTables.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredTables.map((table, index) => {
          const sourceBadge = getSourceBadge(table.source);
          return (
            <div 
              key={index}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedTable(table)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{
                  background: getTypeColor(table.type),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Table {table.number}
                </div>
                <div style={{
                  background: sourceBadge.bg,
                  color: sourceBadge.color,
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {sourceBadge.text}
                </div>
              </div>

              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '8px',
                lineHeight: '1.4'
              }}>
                {table.title}
              </h3>

              <div style={{ 
                fontSize: '12px', 
                color: getTypeColor(table.type),
                fontWeight: '500',
                marginBottom: '12px'
              }}>
                {table.type}
              </div>

              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                lineHeight: '1.5',
                marginBottom: '15px'
              }}>
                {table.content.substring(0, 120)}...
              </p>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  <Eye size={14} />
                  View Full
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTables.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Table size={48} style={{ color: '#9ca3af', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', color: '#374151', marginBottom: '8px' }}>No tables found</h3>
          <p style={{ color: '#6b7280' }}>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {selectedTable && (
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
                  Table {selectedTable.number}
                </h2>
                <h3 style={{ fontSize: '18px', color: '#374151', marginBottom: '12px' }}>
                  {selectedTable.title}
                </h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{
                    background: getTypeColor(selectedTable.type),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {selectedTable.type}
                  </span>
                  <span style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {selectedTable.source}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTable(null)}
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
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>Table Content:</h4>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563', whiteSpace: 'pre-wrap' }}>
                {selectedTable.content}
              </p>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedTable(null)}
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

export default TableViewer;
