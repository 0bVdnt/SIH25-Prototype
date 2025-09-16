import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Filter, List, Map, Calendar, AlertTriangle, CheckCircle2, Clock, Eye } from 'lucide-react';
import { mockReports, hazardTypes, statusConfig, severityConfig } from '../mockData';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on hazard type and severity
const createCustomIcon = (type, severity) => {
  const config = hazardTypes[type];
  const severityColors = {
    low: '#10B981',
    medium: '#F59E0B', 
    high: '#EF4444'
  };
  
  const iconHtml = `
    <div style="
      background-color: ${severityColors[severity]};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">
      ${config?.icon || '📍'}
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

const ReportsPage = () => {
  const [reports, setReports] = useState(mockReports);
  const [filteredReports, setFilteredReports] = useState(mockReports);
  const [view, setView] = useState('map'); // 'map' or 'list'
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    severity: 'all',
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  // India center coordinates
  const center = [20.5937, 78.9629];

  useEffect(() => {
    applyFilters();
  }, [filters, reports]);

  const applyFilters = () => {
    let filtered = [...reports];
    
    if (filters.type !== 'all') {
      filtered = filtered.filter(report => report.type === filters.type);
    }
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(report => report.status === filters.status);
    }
    
    if (filters.severity !== 'all') {
      filtered = filtered.filter(report => report.severity === filters.severity);
    }
    
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case '24h':
          filterDate.setHours(now.getHours() - 24);
          break;
        case '7d':
          filterDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          filterDate.setDate(now.getDate() - 30);
          break;
        default:
          break;
      }
      
      if (filters.dateRange !== 'all') {
        filtered = filtered.filter(report => new Date(report.reportedAt) >= filterDate);
      }
    }
    
    setFilteredReports(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'false-alarm':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ocean Hazard Reports</h1>
              <p className="text-gray-600 mt-1">
                {filteredReports.length} of {reports.length} reports shown
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView('map')}
                  className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    view === 'map'
                      ? 'bg-ocean-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Map className="h-4 w-4 mr-1" />
                  Map
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    view === 'list'
                      ? 'bg-ocean-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="h-4 w-4 mr-1" />
                  List
                </button>
              </div>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-ocean-500 hover:bg-ocean-600 text-white rounded-lg transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
          
          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  >
                    <option value="all">All Types</option>
                    {Object.entries(hazardTypes).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  >
                    <option value="all">All Statuses</option>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    value={filters.severity}
                    onChange={(e) => setFilters({...filters, severity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  >
                    <option value="all">All Severities</option>
                    {Object.entries(severityConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  >
                    <option value="all">All Time</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {view === 'map' ? (
          // Map View
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-96 md:h-[600px]">
              <MapContainer
                center={center}
                zoom={5}
                className="h-full w-full"
                scrollWheelZoom={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredReports.map((report) => (
                  <Marker
                    key={report.id}
                    position={report.coordinates}
                    icon={createCustomIcon(report.type, report.severity)}
                  >
                    <Popup>
                      <div className="p-2 min-w-64">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{report.title}</h3>
                          <StatusIcon status={report.status} />
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Type:</span>
                            <span className="text-gray-600">{hazardTypes[report.type]?.label}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Location:</span>
                            <span className="text-gray-600">{report.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Severity:</span>
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: severityConfig[report.severity]?.bgColor,
                                color: severityConfig[report.severity]?.color
                              }}
                            >
                              {severityConfig[report.severity]?.label}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Status:</span>
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: statusConfig[report.status]?.bgColor,
                                color: statusConfig[report.status]?.color
                              }}
                            >
                              {statusConfig[report.status]?.label}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Reported:</span>
                            <span className="text-gray-600">{formatDate(report.reportedAt)}</span>
                          </div>
                          <p className="text-gray-600 mt-2">{report.description}</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{report.title}</h3>
                      <StatusIcon status={report.status} />
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: statusConfig[report.status]?.bgColor,
                          color: statusConfig[report.status]?.color
                        }}
                      >
                        {statusConfig[report.status]?.label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">Type:</span>
                        <span>{hazardTypes[report.type]?.label}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">Location:</span>
                        <span>{report.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-medium mr-2">Severity:</span>
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: severityConfig[report.severity]?.bgColor,
                            color: severityConfig[report.severity]?.color
                          }}
                        >
                          {severityConfig[report.severity]?.label}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{report.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Reported by: {report.reportedBy}</span>
                      <span>•</span>
                      <span>{formatDate(report.reportedAt)}</span>
                      {report.verifiedAt && (
                        <>
                          <span>•</span>
                          <span>Verified: {formatDate(report.verifiedAt)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;