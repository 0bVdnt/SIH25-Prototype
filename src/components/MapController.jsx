// src/components/MapController.jsx

import React, { useContext, useEffect } from 'react';
import {
  AzureMapDataSourceProvider,
  AzureMapHtmlMarker,
  AzureMapLayerProvider, // CHANGE 1: Import AzureMapLayerProvider
  useAzureMaps,
} from 'react-azure-maps';
import { mockIncidents, mockIotSensors, predictivePath } from '../mockData';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SensorsIcon from '@mui/icons-material/Sensors';

// The CustomMarker and SensorMarker components remain the same and are correct.
const CustomMarker = ({ severity, isSelected }) => { /* ... existing code ... */ };
const SensorMarker = ({ status }) => { /* ... existing code ... */ };

function MapController({
  selectedIncident,
  setSelectedIncident,
  showSensors,
  showPrediction,
}) {
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
    <AzureMapDataSourceProvider id={'main-source'}>
      {/* RENDER CITIZEN REPORTS MARKERS */}
      {mockIncidents.map(incident => (
        <AzureMapHtmlMarker
          key={incident.id}
          markerContent={<CustomMarker severity={incident.severity} isSelected={selectedIncident?.id === incident.id} />}
          options={{
            position: [incident.lng, incident.lat],
            popup: {
              content: `
                <div>
                  <b>${incident.type}</b><br/>
                  ${incident.description}
                  ${incident.insuranceTriggered ? `<br/><hr/>
                    <div style='color: #4caf50; display: flex; align-items-center; margin-top: 5px; font-weight: bold;'>
                      ✓ Parametric Insurance Triggered
                    </div>` : ''}
                </div>`,
              pixelOffset: [0, -30],
            },
          }}
          events={{ click: () => setSelectedIncident(incident) }}
        />
      ))}

      {/* RENDER IoT SENSORS MARKERS (conditionally) */}
      {showSensors && mockIotSensors.map(sensor => (
        <AzureMapHtmlMarker
          key={sensor.id}
          markerContent={<SensorMarker status={sensor.status} />}
          options={{
            position: [sensor.lng, sensor.lat],
            popup: {
              content: `<b>${sensor.type} #${sensor.id}</b><br/>Status: ${sensor.status}<br/>Water Level: ${sensor.waterLevel}m`,
              pixelOffset: [0, -20],
            },
          }}
        />
      ))}

      {/* CHANGE 2: RENDER AI PREDICTION POLYGON (conditionally) using AzureMapLayerProvider */}
      {showPrediction && (
        <AzureMapLayerProvider
          id={'prediction-layer'}
          type={'polygon'} // Specify the layer type
          options={{
            fillColor: '#f44336',
            fillOpacity: 0.4,
          }}
        >
          {/* We now use a feature with a polygon geometry inside the layer provider */}
          <AzureMapFeature
            type="Polygon"
            coordinates={[predictivePath]} // Note the extra array wrapping
          />
        </AzureMapLayerProvider>
      )}
    </AzureMapDataSourceProvider>
  );
}

export default MapController;