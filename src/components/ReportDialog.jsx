// src/components/ReportDialog.jsx

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Select, MenuItem, InputLabel, FormControl, Box, Typography } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function ReportDialog({ open, handleClose }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleUpload = () => {
    setIsAnalyzing(true);
    setIsVerified(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsVerified(true);
    }, 2500);
  };

  // Resets the simulation state when closing the dialog
  const handleDialogClose = () => {
    handleClose();
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsVerified(false);
    }, 300); // Delay reset to allow dialog to fade out
  };

  const handleSubmit = () => {
    alert('Prototype: Report Submitted!');
    handleDialogClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(23, 42, 58, 0.9)',
        }
      }}
    >
      {/* FIX: Added DialogTitle for a proper header */}
      <DialogTitle sx={{ fontWeight: 'bold' }}>Submit New Hazard Report</DialogTitle>

      {/* FIX: Wrapped all content in DialogContent for correct padding and scrolling */}
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Hazard Type</InputLabel>
            <Select label="Hazard Type" defaultValue="">
              <MenuItem value="Coastal Flooding">Coastal Flooding</MenuItem>
              <MenuItem value="High Waves">High Waves</MenuItem>
              <MenuItem value="Damaged Structure">Damaged Structure</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            placeholder="Provide a brief description of the situation..."
          />
          <Button
            variant="outlined"
            component="label"
            startIcon={<AddPhotoAlternateIcon />}
            onClick={handleUpload}
            disabled={isAnalyzing || isVerified}
          >
            Upload Photo/Video
            <input type="file" hidden />
          </Button>

          {/* Simulation feedback */}
          {isAnalyzing && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <CircularProgress size={24} />
              <Typography variant="body2">Analyzing image on-device...</Typography>
            </Box>
          )}
          {isVerified && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, color: 'success.main' }}>
              <CheckCircleIcon />
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>High Confidence: Flooding Detected!</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* FIX: Added DialogActions for correctly positioned buttons */}
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!isVerified}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReportDialog;