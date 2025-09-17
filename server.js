import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Mock data - in production, this would be a database
let reports = [
  {
    id: 1,
    type: 'high-tide',
    title: 'Extreme High Tide Warning',
    location: 'Marine Drive, Mumbai',
    coordinates: [19.0330, 72.8570],
    description: 'Unusually high tide levels observed, flooding walkways and roads near the coastline.',
    severity: 'high',
    status: 'verified',
    reportedBy: 'Rajesh Kumar',
    reportedAt: '2024-09-16T08:30:00Z',
    verifiedAt: '2024-09-16T09:15:00Z',
    verifiedBy: 'Admin',
    comments: 'Alert issued to local authorities. Monitoring continues.',
    photos: []
  },
  {
    id: 2,
    type: 'jellyfish',
    title: 'Large Jellyfish Swarm Spotted',
    location: 'Calangute Beach, Goa',
    coordinates: [15.5467, 73.7553],
    description: 'Multiple jellyfish sightings near the shore. Tourists advised to avoid swimming.',
    severity: 'medium',
    status: 'verified',
    reportedBy: 'Maria Fernandes',
    reportedAt: '2024-09-16T06:45:00Z',
    verifiedAt: '2024-09-16T07:30:00Z',
    verifiedBy: 'Admin',
    comments: 'Beach safety flags updated. Lifeguards notified.',
    photos: []
  },
  {
    id: 3,
    type: 'pollution',
    title: 'Oil Spill Detected',
    location: 'Vizag Port, Andhra Pradesh',
    coordinates: [17.6868, 83.2185],
    description: 'Small oil spill detected near the port area. Immediate cleanup required.',
    severity: 'high',
    status: 'verified',
    reportedBy: 'Captain Ramesh',
    reportedAt: '2024-09-15T14:20:00Z',
    verifiedAt: '2024-09-15T15:10:00Z',
    verifiedBy: 'Admin',
    comments: 'Coast Guard notified. Cleanup operations initiated.',
    photos: []
  },
  {
    id: 4,
    type: 'storm',
    title: 'Rough Sea Conditions',
    location: 'Puri Beach, Odisha',
    coordinates: [19.8135, 85.8312],
    description: 'Strong winds and rough seas observed. Not safe for fishing activities.',
    severity: 'medium',
    status: 'pending',
    reportedBy: 'Fisherman Association',
    reportedAt: '2024-09-16T05:15:00Z',
    verifiedAt: null,
    verifiedBy: null,
    comments: null,
    photos: []
  },
  {
    id: 5,
    type: 'unusual-activity',
    title: 'Unusual Fish Die-off',
    location: 'Kochi Harbor, Kerala',
    coordinates: [9.9312, 76.2673],
    description: 'Large number of dead fish found floating. Possible contamination.',
    severity: 'high',
    status: 'pending',
    reportedBy: 'Local Fisherman',
    reportedAt: '2024-09-16T07:00:00Z',
    verifiedAt: null,
    verifiedBy: null,
    comments: null,
    photos: []
  }
];

// Mock users for authentication
const users = {
  citizen: {
    id: 1,
    username: 'citizen',
    password: 'citizen123',
    role: 'citizen',
    name: 'Citizen User'
  },
  admin: {
    id: 2,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  }
};

// Routes

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = Object.values(users).find(
    u => u.username === username && u.password === password
  );
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

// Get all reports
app.get('/api/reports', (req, res) => {
  const { type, status, severity } = req.query;
  
  let filteredReports = [...reports];
  
  if (type && type !== 'all') {
    filteredReports = filteredReports.filter(report => report.type === type);
  }
  
  if (status && status !== 'all') {
    filteredReports = filteredReports.filter(report => report.status === status);
  }
  
  if (severity && severity !== 'all') {
    filteredReports = filteredReports.filter(report => report.severity === severity);
  }
  
  res.json({ success: true, reports: filteredReports });
});

// Get single report
app.get('/api/reports/:id', (req, res) => {
  const reportId = parseInt(req.params.id);
  const report = reports.find(r => r.id === reportId);
  
  if (report) {
    res.json({ success: true, report });
  } else {
    res.status(404).json({ success: false, error: 'Report not found' });
  }
});

// Submit new report (Citizen only)
app.post('/api/reports', (req, res) => {
  const {
    type,
    title,
    location,
    coordinates,
    description,
    severity,
    reportedBy
  } = req.body;
  
  // Validation
  if (!type || !title || !location || !description || !reportedBy) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields' 
    });
  }
  
  const newReport = {
    id: reports.length + 1,
    type,
    title,
    location,
    coordinates: coordinates || [0, 0],
    description,
    severity: severity || 'medium',
    status: 'pending',
    reportedBy,
    reportedAt: new Date().toISOString(),
    verifiedAt: null,
    verifiedBy: null,
    comments: null,
    photos: []
  };
  
  reports.push(newReport);
  
  res.status(201).json({ 
    success: true, 
    message: 'Report submitted successfully',
    report: newReport
  });
});

// Update report status (Admin only)
app.patch('/api/reports/:id/status', (req, res) => {
  const reportId = parseInt(req.params.id);
  const { status, comments, verifiedBy } = req.body;
  
  const reportIndex = reports.findIndex(r => r.id === reportId);
  
  if (reportIndex === -1) {
    return res.status(404).json({ success: false, error: 'Report not found' });
  }
  
  if (!['pending', 'verified', 'false-alarm'].includes(status)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid status' 
    });
  }
  
  reports[reportIndex] = {
    ...reports[reportIndex],
    status,
    comments: comments || reports[reportIndex].comments,
    verifiedBy: verifiedBy || reports[reportIndex].verifiedBy,
    verifiedAt: (status === 'verified' || status === 'false-alarm') 
      ? new Date().toISOString() 
      : reports[reportIndex].verifiedAt
  };
  
  res.json({ 
    success: true, 
    message: 'Report status updated successfully',
    report: reports[reportIndex]
  });
});

// Add comment to report (Admin only)
app.post('/api/reports/:id/comments', (req, res) => {
  const reportId = parseInt(req.params.id);
  const { comment, commentBy } = req.body;
  
  const reportIndex = reports.findIndex(r => r.id === reportId);
  
  if (reportIndex === -1) {
    return res.status(404).json({ success: false, error: 'Report not found' });
  }
  
  if (!comment) {
    return res.status(400).json({ 
      success: false, 
      error: 'Comment is required' 
    });
  }
  
  reports[reportIndex].comments = comment;
  
  res.json({ 
    success: true, 
    message: 'Comment added successfully',
    report: reports[reportIndex]
  });
});

// Send alert (Admin only)
app.post('/api/reports/:id/alert', (req, res) => {
  const reportId = parseInt(req.params.id);
  const report = reports.find(r => r.id === reportId);
  
  if (!report) {
    return res.status(404).json({ success: false, error: 'Report not found' });
  }
  
  if (report.status !== 'verified') {
    return res.status(400).json({ 
      success: false, 
      error: 'Only verified reports can trigger alerts' 
    });
  }
  
  // Simulate alert sending (in production, this would send real alerts)
  console.log(`ALERT SENT: ${report.title} at ${report.location}`);
  
  res.json({ 
    success: true, 
    message: 'Alert sent successfully',
    alertDetails: {
      reportId: report.id,
      title: report.title,
      location: report.location,
      severity: report.severity,
      sentAt: new Date().toISOString()
    }
  });
});

// Get statistics (Admin only)
app.get('/api/admin/stats', (req, res) => {
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    verified: reports.filter(r => r.status === 'verified').length,
    falseAlarm: reports.filter(r => r.status === 'false-alarm').length,
    highSeverity: reports.filter(r => r.severity === 'high').length,
    byType: {}
  };
  
  // Count by type
  reports.forEach(report => {
    stats.byType[report.type] = (stats.byType[report.type] || 0) + 1;
  });
  
  res.json({ success: true, stats });
});

// Serve React app for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`Ocean Hazard Reporter server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});