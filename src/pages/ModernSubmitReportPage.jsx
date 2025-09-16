import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../contexts/GamificationContext';
import { 
  Camera, MapPin, Upload, X, AlertTriangle, Waves, Wind, Trash2, 
  Zap, Eye, Navigation, RefreshCw, CheckCircle, Clock, MapIcon 
} from 'lucide-react';

const ModernSubmitReportPage = () => {
  const navigate = useNavigate();
  const { updateReportStats, awardPoints } = useGamification();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [formData, setFormData] = useState({
    hazardType: '',
    location: '',
    latitude: '',
    longitude: '',
    description: '',
    severity: 'medium',
    photos: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [duplicateCheck, setDuplicateCheck] = useState({
    isChecking: false,
    duplicateFound: false,
    similarReports: [],
    canSubmit: true
  });
  const [locationState, setLocationState] = useState({
    loading: false,
    error: null,
    accuracy: null,
    timestamp: null,
    address: null
  });

  const hazardTypes = [
    { id: 'High Tide', label: 'High Tide', icon: Waves, color: 'text-blue-500', bg: 'bg-blue-50 hover:bg-blue-100' },
    { id: 'Storm/Cyclone', label: 'Storm/Cyclone', icon: Wind, color: 'text-gray-500', bg: 'bg-gray-50 hover:bg-gray-100' },
    { id: 'Water Pollution', label: 'Water Pollution', icon: Trash2, color: 'text-green-500', bg: 'bg-green-50 hover:bg-green-100' },
    { id: 'Jellyfish Swarm', label: 'Jellyfish Swarm', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50 hover:bg-purple-100' },
    { id: 'Oil Spill', label: 'Oil Spill', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 hover:bg-red-100' },
    { id: 'Unusual Marine Activity', label: 'Marine Activity', icon: Eye, color: 'text-orange-500', bg: 'bg-orange-50 hover:bg-orange-100' }
  ];

  const severityLevels = [
    { id: 'low', label: 'Low Risk', color: 'bg-green-500', description: 'Minor concern, low risk to public', icon: CheckCircle },
    { id: 'medium', label: 'Medium Risk', color: 'bg-yellow-500', description: 'Moderate risk, caution advised', icon: Clock },
    { id: 'high', label: 'High Risk', color: 'bg-red-500', description: 'Immediate attention required', icon: AlertTriangle }
  ];

  // Auto-detect location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      handleLocationDetection();
    }
  }, []);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Check for duplicates when location and hazard type are set
  useEffect(() => {
    if (formData.latitude && formData.longitude && formData.hazardType) {
      checkForDuplicates();
    }
  }, [formData.latitude, formData.longitude, formData.hazardType]);

  const checkForDuplicates = async () => {
    setDuplicateCheck(prev => ({ ...prev, isChecking: true }));
    
    try {
      // Simulate API call to check for nearby similar reports
      // In real implementation, this would query your backend
      const mockSimilarReports = [
        {
          id: 1,
          type: formData.hazardType,
          location: 'Nearby location',
          distance: 0.8, // km
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          status: 'verified'
        }
      ];

      // Check if there are similar reports within 1km and 24 hours
      const recentSimilarReports = mockSimilarReports.filter(report => 
        report.type === formData.hazardType && 
        report.distance < 1.0 && 
        (Date.now() - report.timestamp.getTime()) < 24 * 60 * 60 * 1000
      );

      const hasVerifiedDuplicate = recentSimilarReports.some(report => 
        report.status === 'verified'
      );

      setDuplicateCheck({
        isChecking: false,
        duplicateFound: recentSimilarReports.length > 0,
        similarReports: recentSimilarReports,
        canSubmit: !hasVerifiedDuplicate
      });
    } catch (error) {
      console.error('Duplicate check failed:', error);
      setDuplicateCheck(prev => ({ 
        ...prev, 
        isChecking: false, 
        canSubmit: true 
      }));
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      setCameraStream(stream);
      setShowCamera(true);
      
      // Wait for video element to be available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const capturedPhoto = {
          file: new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' }),
          preview: canvas.toDataURL('image/jpeg'),
          id: Date.now() + Math.random(),
          isCaptured: true
        };
        
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, capturedPhoto]
        }));
        
        // Add flash effect
        setTimeout(() => {
          setIsCapturing(false);
          stopCamera();
        }, 200);
      }
    }, 'image/jpeg', 0.9);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      // Using a free geocoding service
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
      const data = await response.json();
      return `${data.locality || data.city || 'Unknown City'}, ${data.principalSubdivision || data.region || 'Unknown Region'}, ${data.countryName || 'Unknown Country'}`;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  };

  const handleLocationDetection = () => {
    if (!navigator.geolocation) {
      setLocationState(prev => ({ ...prev, error: 'Geolocation is not supported by this browser' }));
      return;
    }

    setLocationState(prev => ({ ...prev, loading: true, error: null }));

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const timestamp = new Date(position.timestamp);
        
        // Get human-readable address
        const address = await reverseGeocode(latitude, longitude);
        
        setFormData(prev => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          location: address
        }));

        setLocationState({
          loading: false,
          error: null,
          accuracy: Math.round(accuracy),
          timestamp,
          address
        });
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setLocationState(prev => ({ ...prev, loading: false, error: errorMessage }));
      },
      options
    );
  };

  const handleFileSelect = (files) => {
    const selectedFiles = Array.from(files);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length + formData.photos.length > 5) {
      alert('Maximum 5 photos allowed');
      return;
    }

    const newPhotos = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));

    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
  };

  const removePhoto = (photoId) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => {
        if (photo.id === photoId) {
          URL.revokeObjectURL(photo.preview);
        }
        return photo.id !== photoId;
      })
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.hazardType) newErrors.hazardType = 'Please select a hazard type';
    if (!formData.location) newErrors.location = 'Please provide location information';
    if (!formData.description.trim()) newErrors.description = 'Please provide a description';
    if (formData.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create form data for submission
      const submitData = {
        ...formData,
        reporterName: 'Current User', // This would come from auth context
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      const response = await fetch('http://localhost:3001/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        // Award points for report submission
        updateReportStats('submitted');
        const pointsEarned = awardPoints('reportSubmitted');
        
        // Show success message with points
        alert(`Report submitted successfully! You earned ${pointsEarned} points. Thank you for helping keep our oceans safe!`);
        navigate('/reports');
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      console.error('Submission error:', error);
      // For demo purposes, still award points even if backend fails
      updateReportStats('submitted');
      const pointsEarned = awardPoints('reportSubmitted');
      alert(`Demo: Report submitted successfully! You earned ${pointsEarned} points. Thank you for helping keep our oceans safe!`);
      navigate('/reports');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="modern-card overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">Report Ocean Hazard</h1>
            <p className="text-blue-100 text-lg">Help protect our coastal communities by reporting hazards in real-time</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* Hazard Type Selection */}
            <div className="fade-in-up">
              <label className="block text-lg font-semibold text-gray-800 mb-6">
                What type of hazard are you reporting? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hazardTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleInputChange('hazardType', type.id)}
                    className={`p-6 border-2 rounded-xl transition-all duration-300 hover-lift ${
                      formData.hazardType === type.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300'
                    } ${type.bg}`}
                  >
                    <type.icon className={`h-10 w-10 mx-auto mb-3 ${type.color}`} />
                    <div className="text-sm font-semibold text-gray-900">{type.label}</div>
                  </button>
                ))}
              </div>
              {errors.hazardType && <p className="mt-3 text-sm text-red-600 font-medium">{errors.hazardType}</p>}
            </div>

            {/* Location Section */}
            <div className="fade-in-up">
              <label className="block text-lg font-semibold text-gray-800 mb-6">
                Location Information *
              </label>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Auto Location */}
                <div className="modern-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                      <Navigation className="h-5 w-5 mr-2 text-blue-600" />
                      Auto-Location
                    </h3>
                    <button
                      type="button"
                      onClick={handleLocationDetection}
                      disabled={locationState.loading}
                      className="btn-modern btn-primary px-4 py-2 text-sm flex items-center space-x-2"
                    >
                      {locationState.loading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      <span>{locationState.loading ? 'Detecting...' : 'Get Location'}</span>
                    </button>
                  </div>

                  {locationState.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                      <p className="text-sm text-red-600">{locationState.error}</p>
                    </div>
                  )}

                  {locationState.address && (
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Location detected successfully</p>
                          <p className="text-sm text-green-600">{locationState.address}</p>
                          {locationState.accuracy && (
                            <p className="text-xs text-green-500 mt-1">
                              Accuracy: ±{locationState.accuracy}m • {locationState.timestamp?.toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Manual Location Input */}
                <div className="modern-card p-6">
                  <h3 className="font-semibold text-gray-800 flex items-center mb-4">
                    <MapIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Manual Entry
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location Description
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g., Marina Beach, Chennai or specific landmark"
                        className="modern-input"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Latitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={formData.latitude}
                          onChange={(e) => handleInputChange('latitude', e.target.value)}
                          placeholder="e.g., 13.0827"
                          className="modern-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Longitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={formData.longitude}
                          onChange={(e) => handleInputChange('longitude', e.target.value)}
                          placeholder="e.g., 80.2707"
                          className="modern-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {errors.location && <p className="mt-3 text-sm text-red-600 font-medium">{errors.location}</p>}
            </div>

            {/* Severity Level */}
            <div className="fade-in-up">
              <label className="block text-lg font-semibold text-gray-800 mb-6">
                How severe is this hazard?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {severityLevels.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => handleInputChange('severity', level.id)}
                    className={`p-6 border-2 rounded-xl transition-all duration-300 hover-lift text-left ${
                      formData.severity === level.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-6 h-6 rounded-full ${level.color}`}></div>
                      <level.icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-2">{level.label}</div>
                    <div className="text-sm text-gray-600">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="fade-in-up">
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Describe the hazard in detail *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                maxLength={1000}
                placeholder="Please provide detailed information about what you observed, when it occurred, current conditions, and any immediate dangers or concerns..."
                className="modern-input resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                {errors.description && <p className="text-sm text-red-600 font-medium">{errors.description}</p>}
                <p className="text-sm text-gray-500 ml-auto">{formData.description.length}/1000</p>
              </div>
            </div>

            {/* Duplicate Check Warning */}
            {duplicateCheck.duplicateFound && (
              <div className="fade-in-up">
                <div className={`p-6 rounded-xl border-2 ${
                  duplicateCheck.canSubmit 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`h-6 w-6 flex-shrink-0 mt-0.5 ${
                      duplicateCheck.canSubmit ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-2 ${
                        duplicateCheck.canSubmit ? 'text-yellow-800' : 'text-red-800'
                      }`}>
                        {duplicateCheck.canSubmit 
                          ? 'Similar Reports Found' 
                          : 'Duplicate Report Detected'
                        }
                      </h3>
                      <p className={`text-sm mb-3 ${
                        duplicateCheck.canSubmit ? 'text-yellow-700' : 'text-red-700'
                      }`}>
                        {duplicateCheck.canSubmit
                          ? 'We found similar reports in this area. Please review them before submitting.'
                          : 'A verified report for this hazard type already exists in this location. Duplicate submissions are not allowed.'
                        }
                      </p>
                      
                      <div className="space-y-2">
                        {duplicateCheck.similarReports.map((report, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                            <div>
                              <span className="font-medium text-gray-900">{report.type}</span>
                              <span className="text-sm text-gray-600 ml-2">
                                {report.distance.toFixed(1)}km away • {report.timestamp.toLocaleString()}
                              </span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              report.status === 'verified' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-yellow-100 text-yellow-600'
                            }`}>
                              {report.status}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {duplicateCheck.canSubmit && (
                        <p className="text-xs text-yellow-600 mt-3">
                          You can still submit if you believe this is a separate incident.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Photo Upload */}
            <div className="fade-in-up">
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Add Photos (Optional - Max 5)
              </label>
              
              {/* Photo Upload Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* File Upload */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-gray-700 mb-2">Upload from Device</p>
                  <p className="text-sm text-gray-500">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB each</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                </div>

                {/* Camera Capture */}
                <div
                  onClick={startCamera}
                  className="border-2 border-dashed border-green-300 hover:border-green-400 rounded-xl p-6 text-center transition-all duration-300 cursor-pointer hover:bg-green-50"
                >
                  <Camera className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-gray-700 mb-2">Take Photo</p>
                  <p className="text-sm text-gray-500">
                    Use camera to capture directly
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Best for real-time hazards</p>
                </div>
              </div>

              {/* Camera Modal */}
              {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">Capture Photo</h3>
                      <button
                        onClick={stopCamera}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="h-6 w-6 text-gray-600" />
                      </button>
                    </div>
                    
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-auto max-h-[60vh] rounded-xl object-cover bg-black"
                      />
                      
                      {isCapturing && (
                        <div className="absolute inset-0 bg-white opacity-80 rounded-xl"></div>
                      )}
                      
                      <canvas
                        ref={canvasRef}
                        className="hidden"
                      />
                    </div>
                    
                    <div className="flex justify-center space-x-4 mt-6">
                      <button
                        onClick={stopCamera}
                        className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={capturePhoto}
                        disabled={isCapturing || formData.photos.length >= 5}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
                      >
                        <Camera className="h-5 w-5" />
                        <span>{isCapturing ? 'Capturing...' : 'Take Photo'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                  {formData.photos.map((photo) => (
                    <div key={photo.id} className="relative group hover-lift">
                      <img
                        src={photo.preview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      {photo.isCaptured && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Camera
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Section */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !duplicateCheck.canSubmit || duplicateCheck.isChecking}
                className={`px-8 py-3 flex items-center space-x-2 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed ${
                  !duplicateCheck.canSubmit 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'btn-modern btn-primary disabled:opacity-50'
                }`}
              >
                {duplicateCheck.isChecking ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Checking for duplicates...</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Submitting Report...</span>
                  </>
                ) : !duplicateCheck.canSubmit ? (
                  <>
                    <X className="h-5 w-5" />
                    <span>Cannot Submit - Duplicate Detected</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModernSubmitReportPage;