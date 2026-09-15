import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

const InteractiveMap = ({ lat, lng, countryName, capitalName, flagUrl }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (lat === undefined || lng === undefined || lat === null || lng === null) return;

    // Clean up previous instance if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // CartoDB Dark Matter tiles for sleek dark Liquid Glass feel
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Zoom control in top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Custom HTML marker with purple glow
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #8B32E8;
          border: 2px solid #ffffff;
          box-shadow: 0 0 16px rgba(139, 50, 232, 0.8), 0 0 4px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        ">
          <div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });

    const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

    // Custom styled popup
    const popupContent = `
      <div style="font-family: 'Space Grotesk', sans-serif; min-width: 140px; padding: 4px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          ${flagUrl ? `<img src="${flagUrl}" style="width: 20px; height: 14px; object-fit: cover; border-radius: 3px;" />` : ''}
          <strong style="color: #ffffff; font-size: 14px;">${countryName || ''}</strong>
        </div>
        ${capitalName ? `<p style="margin: 0; color: #a1a1aa; font-size: 11px;">Capital: <span style="color: #e4e4e7;">${capitalName}</span></p>` : ''}
        <p style="margin: 2px 0 0; color: #71717a; font-size: 10px; font-family: monospace;">${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°</p>
      </div>
    `;

    marker.bindPopup(popupContent).openPopup();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, countryName, capitalName, flagUrl]);

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="section-label text-[10px]">Cartographic Coordinates</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground px-2 py-0.5 rounded bg-white/5 border border-white/5">
          <Navigation className="w-3 h-3 text-primary" />
          <span>{Number(lat || 0).toFixed(2)}°, {Number(lng || 0).toFixed(2)}°</span>
        </div>
      </div>

      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '280px',
          borderRadius: '1rem',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      />
    </div>
  );
};

InteractiveMap.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  countryName: PropTypes.string,
  capitalName: PropTypes.string,
  flagUrl: PropTypes.string,
};

export default InteractiveMap;
