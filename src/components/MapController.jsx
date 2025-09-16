import React, { useEffect } from 'react';
import {
  AzureMapDataSourceProvider,
  AzureMapHtmlMarker,
  useAzureMaps,
} from 'react-azure-maps';
import { mockIncidents } from '../mockData';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const CustomMarker = ({ severity, isSelected }) => {
  const color = severity === 'High' ? '#ff8a80' : '#ffb74d';
  return (
    <div style={{
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      backgroundColor: 'rgba(13, 27, 42, 0.8)',
      border: `3px solid ${color}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'transform 0.2s ease-out',
      transform: isSelected ? 'scale(1.4)' : 'scale(1)',
    }}>
      <WarningAmberIcon style={{ color: color, fontSize: '16px' }} />
    </div>
  );
};

function MapController({ selectedIncident, setSelectedIncident }) {
  const { mapRef, isMapReady } = useAzureMaps();

  useEffect(() => {
    if (isMapReady && mapRef && mapRef.current && selectedIncident) {
      mapRef.current.setCamera({
        center: [selectedIncident.lng, selectedIncident.lat],
        zoom: 14,
        pitch: 45,
        type: 'fly',
        duration: 2000,
      });
    }
  }, [selectedIncident, isMapReady, mapRef]);

  return (
    <AzureMapDataSourceProvider id={'incidents-source'}>
      {mockIncidents.map(incident => (
        <AzureMapHtmlMarker
          key={incident.id}
          markerContent={
            <CustomMarker 
              severity={incident.severity}
              isSelected={selectedIncident?.id === incident.id}
            />
          }
          options={{
            position: [incident.lng, incident.lat],
          }}
          events={{ click: () => setSelectedIncident(incident) }}
        />
      ))}
    </AzureMapDataSourceProvider>
  );
}

export default MapController;