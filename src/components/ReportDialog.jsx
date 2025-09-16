import React, { useState } from 'react'; // Import useState
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function ReportDialog({ open, handleClose }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleUpload = () => {
    setIsAnalyzing(true);
    setIsVerified(false);
    // Simulate a 2.5 second analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsVerified(true);
    }, 2500);
  };

  const handleSubmit = () => {
    alert('Prototype: Report Submitted!');
    handleClose();
    setIsAnalyzing(false);
    setIsVerified(false);
  };


  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(23, 42, 58, 0.9)',
        }
      }}
    >
      <Button 
        variant="outlined" 
        component="label" 
        startIcon={<AddPhotoAlternateIcon />}
        onClick={handleUpload} // Trigger the simulation
        disabled={isAnalyzing || isVerified} // Disable after clicking
      >
        Upload Photo/Video
        <input type="file" hidden />
      </Button>

      {/* NEW: Simulation feedback */}
      {isAnalyzing && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2">Analyzing image on-device...</Typography>
        </Box>
      )}
      {isVerified && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, color: 'success.main' }}>
          <CheckCircleIcon />
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>High Confidence: Flooding Detected!</Typography>
        </Box>
      )}

      {/* ... DialogActions */}
    </Dialog>
  );
}

export default ReportDialog;