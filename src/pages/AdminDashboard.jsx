// src/pages/AdminDashboard.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { mockIncidents } from '../mockData';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'type', headerName: 'Hazard Type', width: 150 },
  { field: 'severity', headerName: 'Severity', width: 110 },
  { field: 'status', headerName: 'Status', width: 110 },
  { field: 'description', headerName: 'Description', flex: 1 },
  { field: 'timestamp', headerName: 'Timestamp', width: 200 },
];

function AdminDashboard() {
  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 64px)', width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard - All Reports
      </Typography>
      <DataGrid
        rows={mockIncidents}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell': {
            color: 'text.primary',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'action.hover',
          },
        }}
      />
    </Box>
  );
}

export default AdminDashboard;