import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import MapComponent from '../components/MapComponent';

function ZoneFinder() {
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [zoneInfo, setZoneInfo] = useState(null);

  const handleSearch = () => {
    // Mock zone data - integrate with actual GIS API
    setZoneInfo({
      zone: 'Residential Zone R1',
      permissibleFSI: 1.0,
      roadWidth: 12,
      heritage: false,
      floodZone: false,
      applicableClauses: ['Chapter 3, Section 2', 'Chapter 5, Section 1']
    });
  };

  const handleMapLocationSelect = (coords) => {
    setCoordinates(coords);
    setLocation(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
    
    // Auto-fetch zone info when location is selected on map
    setZoneInfo({
      zone: 'Residential Zone R1',
      permissibleFSI: 1.0,
      roadWidth: 12,
      heritage: false,
      floodZone: false,
      applicableClauses: ['Chapter 3, Section 2', 'Chapter 5, Section 1'],
      coordinates: coords
    });
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h1 style={{ marginBottom: '30px' }}>Zone Finder</h1>
      
      <div className="card">
        <h3 style={{ marginBottom: '15px' }}>Search Location</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input 
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter plot location or coordinates..."
            style={{ flex: 1 }}
          />
          <button 
            onClick={handleSearch}
            style={{ background: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <MapPin size={18} /> Find Zone
          </button>
        </div>

        <MapComponent onLocationSelect={handleMapLocationSelect} />
      </div>

      {zoneInfo && (
        <div className="card">
          <h3 style={{ marginBottom: '15px' }}>Zone Information</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <p><strong>Zone:</strong> {zoneInfo.zone}</p>
            <p><strong>Permissible FSI:</strong> {zoneInfo.permissibleFSI}</p>
            <p><strong>Road Width:</strong> {zoneInfo.roadWidth}m</p>
            <p><strong>Heritage Zone:</strong> {zoneInfo.heritage ? 'Yes' : 'No'}</p>
            <p><strong>Flood Zone:</strong> {zoneInfo.floodZone ? 'Yes' : 'No'}</p>
            {zoneInfo.coordinates && (
              <p><strong>Coordinates:</strong> {zoneInfo.coordinates.lat.toFixed(6)}, {zoneInfo.coordinates.lng.toFixed(6)}</p>
            )}
            <div style={{ marginTop: '10px' }}>
              <strong>Applicable UDCPR Clauses:</strong>
              <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                {zoneInfo.applicableClauses.map((clause, i) => <li key={i}>{clause}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ZoneFinder;
