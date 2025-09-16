// src/pages/CitizenDashboard.jsx
import React, { useState, useMemo } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { AzureMap } from 'react-azure-maps';
import { theme } from '../theme';
import SidePanel from '../components/SidePanel';
import MapController from '../components/MapController';
import ReportDialog from '../components/ReportDialog';
import AlertDialog from '../components/AlertDialog';

// This component is the refactored main view from your original App.jsx
function CitizenDashboard() {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showSensors, setShowSensors] = useState(true);
  const [showPrediction, setShowPrediction] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [incidentToAlert, setIncidentToAlert] = useState(null);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const mapOptions = useMemo(() => ({
    authOptions: {
      authType: 'subscriptionKey',
      subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY,
    },
    style: 'satellite_road_labels',
    center: [80.2707, 13.0827],
    zoom: 9,
  }), []);

  const handleOpenAlertDialog = (incident) => {
    setIncidentToAlert(incident);
    setAlertDialogOpen(true);
  };
  
  const handleCloseAlertDialog = () => setAlertDialogOpen(false);

  const handleConfirmAlert = () => {
    handleCloseAlertDialog();
    // In a real app, a global snackbar provider would handle this
    alert("Success: Alert sent to residents in the predicted impact zone!");
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <AzureMap options={mapOptions}>
        <MapController
          selectedIncident={selectedIncident}
          setSelectedIncident={setSelectedIncident}
          showSensors={showSensors}
          showPrediction={showPrediction}
        />
      </AzureMap>
      <SidePanel
        isMobile={isMobile}
        selectedIncident={selectedIncident}
        setSelectedIncident={setSelectedIncident}
        onAddReport={() => setDialogOpen(true)}
        onIssueAlert={handleOpenAlertDialog}
        showSensors={showSensors}
        setShowSensors={setShowSensors}
        showPrediction={showPrediction}
        setShowPrediction={setShowPrediction}
      />
      <ReportDialog open={dialogOpen} handleClose={() => setDialogOpen(false)} />
      <AlertDialog
        open={alertDialogOpen}
        handleClose={handleCloseAlertDialog}
        incident={incidentToAlert}
        onConfirm={handleConfirmAlert}
      />
    </Box>
  );
}

export default CitizenDashboard;