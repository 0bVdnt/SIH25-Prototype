import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import WarningIcon from '@mui/icons-material/Warning';

function AlertDialog({ open, handleClose, incident, onConfirm }) {
  if (!incident) return null; // Don't render if no incident is selected

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
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon color="warning" />
        Issue Targeted Alert
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          You are about to send a public alert for the following incident:
        </Typography>
        <Box sx={{ p: 2, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 1, mb: 2 }}>
          <Typography variant="h6" color="primary">{incident.type}</Typography>
          <Typography variant="body2" color="text.secondary">{incident.description}</Typography>
        </Box>
        <TextField
          label="Add a custom message (optional)"
          fullWidth
          multiline
          rows={2}
          placeholder="e.g., 'Evacuate low-lying areas immediately.'"
        />
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="warning" startIcon={<SendIcon />}>
          Send Alert to Impact Zone
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AlertDialog;