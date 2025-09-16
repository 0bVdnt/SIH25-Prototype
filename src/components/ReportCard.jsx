
import React from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert'; // Import new icon

const getSeverityStyles = (severity) => {
  switch (severity) {
    case 'High': return { color: '#ff8a80', icon: <WarningAmberIcon fontSize="small" /> };
    case 'Medium': return { color: '#ffb74d', icon: <WarningAmberIcon fontSize="small" /> };
    default: return { color: '#81c784', icon: <WarningAmberIcon fontSize="small" /> };
  }
};

function ReportCard({ incident, isSelected, onClick, onIssueAlert }) {
  const { type, severity, status, description } = incident;
  const severityStyles = getSeverityStyles(severity);

  return (
    // Framer-motion to animate the card on hover and tap
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Box
        onClick={onClick}
        sx={{
          p: 2,
          mb: 1.5,
          borderRadius: '12px',
          cursor: 'pointer',
          border: '1px solid',
          borderColor: isSelected ? 'primary.main' : 'rgba(255, 255, 255, 0.2)',
          backgroundColor: isSelected ? 'rgba(86, 207, 225, 0.1)' : 'transparent',
          transition: 'border-color 0.3s, background-color 0.3s',
          '&:hover': {
            borderColor: 'primary.main',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{type}</Typography>
          <Chip
            icon={status === 'Verified' ? <CheckCircleIcon /> : <HelpOutlineIcon />}
            label={status}
            color={status === 'Verified' ? 'success' : 'warning'}
            size="small"
            variant="outlined"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {description}
        </Typography>
        <Chip
          icon={severityStyles.icon}
          label={`Severity: ${severity}`}
          size="small"
          sx={{ color: severityStyles.color, borderColor: severityStyles.color }}
          variant="outlined"
        />

        {/* NEW: Conditional "Issue Alert" button */}
        {status === 'Verified' && severity === 'High' && (
          <Box sx={{ mt: 2, borderTop: '1px solid rgba(255,255,255,0.1)', pt: 1.5 }}>
            <Button
              fullWidth
              variant="outlined"
              color="warning"
              startIcon={<CrisisAlertIcon />}
              onClick={onIssueAlert} // Call the new handler
            >
              Issue Alert
            </Button>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}

export default ReportCard;