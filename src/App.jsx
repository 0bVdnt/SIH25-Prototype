import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Box, useMediaQuery } from '@mui/material';
import { AzureMap, AzureMapsProvider } from 'react-azure-maps';
import { theme } from './theme';

import SidePanel from './components/SidePanel';
import MapController from './components/MapController';
import ReportDialog from './components/ReportDialog';

// API Key from .env file
const azureMapsKey = import.meta.env.VITE_AZURE_MAPS_KEY;

function App() {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showSensors, setShowSensors] = useState(true);
  const [showPrediction, setShowPrediction] = useState(false);

  // MUI Hook to check if the screen is small (mobile)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Prevent map option re-render
  const mapOptions = useMemo(() => ({
    authOptions: {
      authType: 'subscriptionKey',
      subscriptionKey: azureMapsKey,
    },
    style: 'satellite_road_labels', // Satellite view
    center: [73.7471974, 18.6200922], // Long, Lat for JSPM's RSCOE
    zoom: 9,
  }), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AzureMapsProvider>
        <Box sx={{ width: '100vw', height: '100vh', position: 'relative' }}>

          {/* Layer 1: The Full-Screen Azure Map */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <AzureMap options={mapOptions}>
              {/* The MapController will handle markers and camera movement */}
              <MapController
                selectedIncident={selectedIncident}
                setSelectedIncident={setSelectedIncident}
                showSensors={showSensors}
                showPrediction={showPrediction}
              />
            </AzureMap>
          </Box>

          {/* Layer 2: The Floating UI */}
          <SidePanel
            isMobile={isMobile}
            selectedIncident={selectedIncident}
            setSelectedIncident={setSelectedIncident}
            onAddReport={() => setDialogOpen(true)}
            showSensors={showSensors}
            setShowSensors={setShowSensors}
            showPrediction={showPrediction}
            setShowPrediction={setShowPrediction}
          />

          {/* Hidden dialog until the 'Add Report' button is clicked */}
          <ReportDialog open={dialogOpen} handleClose={() => setDialogOpen(false)} />

        </Box>
      </AzureMapsProvider>
    </ThemeProvider>
  );
}

export default App;