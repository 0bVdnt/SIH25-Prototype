import React, { useEffect } from 'react';
import {
  AzureMapDataSourceProvider,
  AzureMapFeature,
  AzureMapHtmlMarker,
  AzureMapLayerProvider,
  useAzureMaps,
} from 'react-azure-maps';
import { mockIncidents, mockIotSensors, predictivePath } from '../mockData';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SensorsIcon from '@mui/icons-material/Sensors';

const CustomMarker = ({ severity, isSelected }) => {
  const color = severity === 'High' ? '#ff8a80' : '#ffb74d';
  return (
    <div style={{
      width: '30px', height: '30px', borderRadius: '50%',
      backgroundColor: 'rgba(13, 27, 42, 0.8)', border: `3px solid ${color}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center',
      transition: 'transform 0.2s ease-out',
      transform: isSelected ? 'scale(1.4)' : 'scale(1)',
    }}>
      <WarningAmberIcon style={{ color: color, fontSize: '16px' }} />
    </div>
  );
};

const SensorMarker = ({ status, isFused }) => (
  <div style={{
    width: '25px', height: '25px', borderRadius: '50%',
    backgroundColor: status === 'Alert' ? '#f44336' : '#4caf50',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    border: isFused ? '3px solid #56cfe1' : '2px solid white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
    animation: isFused ? 'pulse 1.5s infinite' : 'none',
  }}>
    <SensorsIcon style={{ color: 'white', fontSize: '16px' }} />
  </div>
);

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
        zoom: 14, pitch: 45, type: 'fly', duration: 2000,
      });
    }
  }, [selectedIncident, isMapReady, mapRef]);

  return (
    <AzureMapDataSourceProvider id={'main-source'}>
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

      {showSensors && mockIotSensors.map(sensor => {
        const isFused = selectedIncident?.id === 'INC001' && sensor.id === 'JS001';
        return (
          <AzureMapHtmlMarker
            key={sensor.id}
            markerContent={<SensorMarker status={sensor.status} isFused={isFused} />}
            options={{
              position: [sensor.lng, sensor.lat],
              popup: {
                content: `
                  <div style="padding: 5px;">
                    <b>${sensor.type} #${sensor.id}</b><br/>
                    Status: <b>${sensor.status}</b><br/>
                    Current Water Level: <b>${sensor.waterLevel}m</b>
                    <hr style="border-color: rgba(255,255,255,0.2); margin: 5px 0;"/>
                    <div style="font-size: 10px; color: #b0b5b3;">6-Hour Trend</div>
                    <div style="display: flex; align-items: flex-end; height: 30px; border-left: 1px solid #415a77; border-bottom: 1px solid #415a77;">
                      ${sensor.historicalData.map(h => 
                        `<div style="width: 10px; margin: 0 2px; background-color: #56cfe1; height: ${ (h / 4) * 100 }%">&nbsp;</div>`
                      ).join('')}
                    </div>
                  </div>`,
                pixelOffset: [0, -20],
              },
            }}
          />
        );
      })}

      {showPrediction && (
        <AzureMapLayerProvider id={'prediction-layer'} type={'polygon'} options={{ fillColor: '#f44336', fillOpacity: 0.4 }}>
          <AzureMapFeature type="Polygon" coordinates={[predictivePath]} />
        </AzureMapLayerProvider>
      )}
    </AzureMapDataSourceProvider>
  );
}

export default MapController;