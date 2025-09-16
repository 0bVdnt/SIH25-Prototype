import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, IconButton, Button, ToggleButtonGroup, ToggleButton, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { mockIncidents } from '../mockData';
import ReportCard from './ReportCard';
import { Switch, FormControlLabel } from '@mui/material';

// Animation variants for Framer-motion
const panelVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  exit: { x: '-100%', transition: { duration: 0.5, ease: 'easeInOut' } },
};

function SidePanel({
  isMobile,
  selectedIncident,
  setSelectedIncident,
  onAddReport,
  showSensors,
  setShowSensors,
  showPrediction,
  setShowPrediction,
}) {
  const [filter, setFilter] = useState('All');
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const filteredIncidents = useMemo(() => {
    if (filter === 'All') return mockIncidents;
    return mockIncidents.filter(inc => inc.status === filter);
  }, [filter]);

  const handleCardClick = (incident) => {
    setSelectedIncident(incident);
    if (isMobile) {
      setMobileOpen(false); // Closes drawer on selection in mobile
    }
  };

  const panelContent = (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Live Feed</Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={onAddReport}
          sx={{ display: { xs: 'none', md: 'flex' } }} // Hide on mobile
        >
          Add Report
        </Button>
      </Box>

      {/* Filters */}
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={handleFilterChange}
        fullWidth
        sx={{ mb: 2 }}
      >
        <ToggleButton value="All">All</ToggleButton>
        <ToggleButton value="Verified">Verified</ToggleButton>
        <ToggleButton value="Unverified">Unverified</ToggleButton>
      </ToggleButtonGroup>
      {/* Report List */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', my: 2 }}>
        <FormControlLabel
          control={<Switch checked={showSensors} onChange={(e) => setShowSensors(e.target.checked)} />}
          label="Show IoT Sensors"
        />
        <FormControlLabel
          control={<Switch checked={showPrediction} onChange={(e) => setShowPrediction(e.target.checked)} color="warning" />}
          label="AI Prediction"
        />
      </Box>
      <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
        <AnimatePresence>
          {filteredIncidents.map(incident => (
            <motion.div
              key={incident.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ReportCard
                incident={incident}
                isSelected={selectedIncident?.id === incident.id}
                onClick={() => handleCardClick(incident)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );

  // If it's a mobile screen, renders a floating button and a sliding drawer
  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 1300,
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
          }}
        >
          <MenuIcon />
        </IconButton>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '80%',
                zIndex: 1200,
              }}
            >
              <Paper
                elevation={10}
                sx={{
                  height: '100%',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                {panelContent}
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // If it's a desktop screen, renders a static floating panel
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '2%',
        left: '1%',
        height: '96%',
        width: { md: 400, lg: 450 },
        zIndex: 1000,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          height: '100%',
          backdropFilter: 'blur(10px)',
          backgroundColor: theme.palette.background.paper,
          borderRadius: '16px',
        }}
      >
        {panelContent}
      </Paper>
    </Box>
  );
}

export default SidePanel;