import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Upload, X, AlertTriangle, Waves, Wind, Trash2, Zap, Eye } from 'lucide-react';

const SubmitReportPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    type: '',
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

  const hazardTypes = [
    { id: 'high-tide', label: 'High Tide', icon: Waves, color: 'text-blue-500' },
    { id: 'storm', label: 'Storm/Cyclone', icon: Wind, color: 'text-gray-500' },
    { id: 'pollution', label: 'Water Pollution', icon: Trash2, color: 'text-green-500' },
    { id: 'jellyfish', label: 'Jellyfish Swarm', icon: Zap, color: 'text-purple-500' },
    { id: 'oil-spill', label: 'Oil Spill', icon: AlertTriangle, color: 'text-red-500' },
    { id: 'unusual-activity', label: 'Unusual Marine Activity', icon: Eye, color: 'text-orange-500' }
  ];

  const severityLevels = [
    { id: 'low', label: 'Low', color: 'bg-green-500', description: 'Minor concern, low risk' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-500', description: 'Moderate risk, caution advised' },
    { id: 'high', label: 'High', color: 'bg-red-500', description: 'Immediate attention required' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLocationSelect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
            location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }));
        },
        (error) => {
          alert('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleFileSelect = (files) => {
    const selectedFiles = Array.from(files);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
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
    
    if (!formData.type) newErrors.type = 'Please select a hazard type';
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
    
    // Simulate API call
    setTimeout(() => {
      alert('Report submitted successfully! Thank you for helping keep our oceans safe.');
      navigate('/reports');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-ocean-500 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Report Ocean Hazard</h1>
            <p className="text-ocean-100 mt-1">Help protect our coastal communities by reporting hazards</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Hazard Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Hazard Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hazardTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleInputChange('type', type.id)}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                      formData.type === type.id
                        ? 'border-ocean-500 bg-ocean-50'
                        : 'border-gray-200 hover:border-ocean-300'
                    }`}
                  >
                    <type.icon className={`h-8 w-8 mx-auto mb-2 ${type.color}`} />
                    <div className="text-sm font-medium text-gray-900">{type.label}</div>
                  </button>
                ))}
              </div>
              {errors.type && <p className="mt-2 text-sm text-red-600">{errors.type}</p>}
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter location or coordinates"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleLocationSelect}
                    className="w-full bg-ocean-100 hover:bg-ocean-200 text-ocean-700 py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Use Current Location
                  </button>
                </div>
                {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location}</p>}
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
                    placeholder="e.g., 19.0760"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
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
                    placeholder="e.g., 72.8777"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Severity Level
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {severityLevels.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => handleInputChange('severity', level.id)}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                      formData.severity === level.id
                        ? 'border-ocean-500 bg-ocean-50'
                        : 'border-gray-200 hover:border-ocean-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${level.color} mx-auto mb-2`}></div>
                    <div className="text-sm font-medium text-gray-900">{level.label}</div>
                    <div className="text-xs text-gray-600 mt-1">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                placeholder="Describe the hazard in detail... (What did you observe? When? Any immediate dangers?)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                <p className="text-sm text-gray-500 ml-auto">{formData.description.length}/500</p>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Photos (Optional - Max 5)
              </label>
              
              {/* Upload Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive ? 'border-ocean-500 bg-ocean-50' : 'border-gray-300 hover:border-ocean-400'
                }`}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag and drop photos here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-ocean-500 hover:text-ocean-600 font-medium"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-gray-500">PNG, JPG up to 5MB each</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Photo Previews */}
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                  {formData.photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.preview}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-ocean-500 hover:bg-ocean-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitReportPage;