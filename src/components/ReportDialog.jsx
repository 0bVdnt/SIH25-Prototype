import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

function ReportDialog({ open, handleClose }) {

  const handleSubmit = () => {
    // For the prototype, just shows an alert and closes the dialog.
    // Would have to handle state and submissions for complete app
    alert('Prototype: Thank you! Your report has been submitted for verification.');
    handleClose();
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
      <DialogTitle sx={{ fontWeight: 'bold' }}>Submit New Hazard Report</DialogTitle>
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
          >
            Upload Photo/Video
            <input type="file" hidden />
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReportDialog;