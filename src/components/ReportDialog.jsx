import React, { useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';
import { Camera, Upload, X, MapPin, Calendar } from 'lucide-react';
import { showToast } from '../utils/toast';

function ReportDialog({ open, handleClose }) {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    location: '',
    severity: 'medium'
  });
  const [capturedImages, setCapturedImages] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const severityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800', 
    high: 'bg-red-100 text-red-800'
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      showToast.error('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        const timestamp = new Date().toLocaleString();
        setCapturedImages(prev => [...prev, {
          id: Date.now(),
          url: imageUrl,
          blob: blob,
          timestamp: timestamp,
          type: 'camera'
        }]);
      }, 'image/jpeg', 0.8);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const imageUrl = URL.createObjectURL(file);
        setCapturedImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: imageUrl,
          blob: file,
          timestamp: new Date().toLocaleString(),
          type: 'upload',
          name: file.name
        }]);
      }
    });
    event.target.value = ''; // Reset input
  };

  const removeImage = (id) => {
    setCapturedImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      const removedImg = prev.find(img => img.id === id);
      if (removedImg) {
        URL.revokeObjectURL(removedImg.url);
      }
      return updated;
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          showToast.error('Unable to get current location. Please enter manually.');
        }
      );
    } else {
      showToast.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.type || !formData.description) {
      showToast.error('Please fill in all required fields.');
      return;
    }

    // Prepare submission data
    const submissionData = {
      ...formData,
      images: capturedImages.map(img => ({
        timestamp: img.timestamp,
        type: img.type,
        name: img.name || 'camera_capture.jpg'
      })),
      submittedAt: new Date().toISOString(),
      id: `REPORT-${Date.now()}`
    };

    console.log('Submitting report:', submissionData);
    
    // Show success message with submission details
    showToast.success(
      `✅ Report Submitted Successfully!\n\nReport ID: ${submissionData.id}\nType: ${formData.type}\nSeverity: ${formData.severity.toUpperCase()}\nYour report has been submitted for verification and will be reviewed within 24 hours.`,
      { autoClose: 8000 }
    );

    // Clean up and close
    capturedImages.forEach(img => URL.revokeObjectURL(img.url));
    setCapturedImages([]);
    setFormData({
      type: '',
      description: '',
      location: '',
      severity: 'medium'
    });
    stopCamera();
    handleClose();
  };

  const handleDialogClose = () => {
    // Clean up resources
    capturedImages.forEach(img => URL.revokeObjectURL(img.url));
    setCapturedImages([]);
    stopCamera();
    handleClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleDialogClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 'bold', 
        fontSize: '1.5rem',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        color: 'white',
        borderRadius: '12px 12px 0 0'
      }}>
        🌊 Submit Hazard Report
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          
          {/* Hazard Type Selection */}
          <FormControl fullWidth>
            <InputLabel>Hazard Type *</InputLabel>
            <Select 
              label="Hazard Type *" 
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            >
              <MenuItem value="Coastal Flooding">🌊 Coastal Flooding</MenuItem>
              <MenuItem value="High Waves">🌊 High Waves</MenuItem>
              <MenuItem value="Oil Spill">🛢️ Oil Spill</MenuItem>
              <MenuItem value="Marine Debris">🗑️ Marine Debris</MenuItem>
              <MenuItem value="Damaged Infrastructure">🏗️ Damaged Infrastructure</MenuItem>
              <MenuItem value="Algae Bloom">🦠 Algae Bloom</MenuItem>
              <MenuItem value="Rip Current">🌊 Dangerous Currents</MenuItem>
              <MenuItem value="Other">❓ Other</MenuItem>
            </Select>
          </FormControl>

          {/* Severity Level */}
          <FormControl fullWidth>
            <InputLabel>Severity Level</InputLabel>
            <Select 
              label="Severity Level" 
              value={formData.severity}
              onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
            >
              <MenuItem value="low">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors.low}`}>
                  🟢 Low - Minor concern
                </span>
              </MenuItem>
              <MenuItem value="medium">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors.medium}`}>
                  🟡 Medium - Moderate threat
                </span>
              </MenuItem>
              <MenuItem value="high">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors.high}`}>
                  🔴 High - Immediate danger
                </span>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Location Input */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Location"
              fullWidth
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Enter location or use GPS..."
            />
            <Button 
              variant="outlined"
              onClick={getCurrentLocation}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </Box>

          {/* Description */}
          <TextField
            label="Description *"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Provide detailed information about the hazard situation..."
          />

          {/* Camera and Upload Section */}
          <Box sx={{ border: '2px dashed #e2e8f0', borderRadius: 2, p: 3, backgroundColor: '#f8fafc' }}>
            <div className="text-center mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">📷 Add Visual Evidence</h4>
              <p className="text-sm text-gray-500">Photos and videos help verify reports faster</p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <Button
                variant="contained"
                onClick={startCamera}
                disabled={showCamera}
                startIcon={<Camera className="h-4 w-4" />}
                sx={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  }
                }}
              >
                Take Photo
              </Button>
              
              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload className="h-4 w-4" />}
              >
                Upload Files
                <input 
                  type="file" 
                  hidden 
                  multiple 
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                />
              </Button>
              
              {showCamera && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={stopCamera}
                  startIcon={<X className="h-4 w-4" />}
                >
                  Close Camera
                </Button>
              )}
            </div>

            {/* Camera Preview */}
            {showCamera && (
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    borderRadius: '8px',
                    backgroundColor: '#000'
                  }}
                />
                <div className="mt-3">
                  <Button
                    variant="contained"
                    onClick={capturePhoto}
                    size="large"
                    sx={{
                      borderRadius: '50%',
                      minWidth: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                      }
                    }}
                  >
                    📸
                  </Button>
                </div>
              </Box>
            )}

            {/* Captured Images Grid */}
            {capturedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {capturedImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt="Captured evidence"
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                      {image.type === 'camera' ? '📷' : '📁'} {image.timestamp.split(' ')[1]}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Box>

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button onClick={handleDialogClose} size="large">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          size="large"
          disabled={!formData.type || !formData.description}
          sx={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            px: 4,
            '&:hover': {
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
            }
          }}
        >
          Submit Report
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReportDialog;