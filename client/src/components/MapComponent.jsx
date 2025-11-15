import React, { useEffect, useRef, useState } from 'react';

function MapComponent({ onLocationSelect }) {
  const mapContainerRef = useRef(null);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    // Check if Mapbox token is available
    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
    
    if (!mapboxToken || mapboxToken === 'your_mapbox_token') {
      setMapError('Mapbox token not configured. Add VITE_MAPBOX_TOKEN to .env file.');
      return;
    }

    // Load Mapbox GL JS dynamically
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js';
    script.async = true;
    
    const link = document.createElement('link');
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css';
    link.rel = 'stylesheet';
    
    document.head.appendChild(link);
    document.body.appendChild(script);

    script.onload = () => {
      if (window.mapboxgl) {
        window.mapboxgl.accessToken = mapboxToken;
        
        const map = new window.mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [72.8777, 19.0760], // Mumbai coordinates
          zoom: 11
        });

        map.addControl(new window.mapboxgl.NavigationControl());

        map.on('click', (e) => {
          const { lng, lat } = e.lngLat;
          
          new window.mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map);

          if (onLocationSelect) {
            onLocationSelect({ lng, lat });
          }
        });
      }
    };

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, [onLocationSelect]);

  if (mapError) {
    return (
      <div style={{ 
        padding: '40px', 
        background: '#f0f9ff', 
        border: '2px dashed #0369a1',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p style={{ color: '#0369a1', marginBottom: '10px' }}>
          <strong>Map Integration Ready</strong>
        </p>
        <p style={{ fontSize: '14px', color: '#666' }}>{mapError}</p>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
          Get your free token at: https://www.mapbox.com/
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainerRef} 
      style={{ 
        width: '100%', 
        height: '400px', 
        borderRadius: '8px',
        border: '1px solid #ddd'
      }} 
    />
  );
}

export default MapComponent;
