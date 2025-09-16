import React, { useState } from 'react';
import { 
  BarChart3, 
  MapPin, 
  List, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  MessageSquare,
  Send,
  Filter,
  Download,
  Eye,
  Users,
  TrendingUp,
  Activity
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { mockReports, hazardTypes, statusConfig, severityConfig } from '../mockData';
import L from 'leaflet';

// Custom marker icons for admin view
const createAdminIcon = (type, severity, status) => {
  const severityColors = {
    low: '#10B981',
    medium: '#F59E0B', 
    high: '#EF4444'
  };
  
  const borderColor = status === 'verified' ? '#10B981' : status === 'false-alarm' ? '#EF4444' : '#F59E0B';
  
  const iconHtml = `
    <div style="
      background-color: ${severityColors[severity]};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid ${borderColor};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">
      ${hazardTypes[type]?.icon || '📍'}
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'admin-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [reports, setReports] = useState(mockReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionComment, setActionComment] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    type: 'all'
  });

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    verified: reports.filter(r => r.status === 'verified').length,
    falseAlarm: reports.filter(r => r.status === 'false-alarm').length,
    highSeverity: reports.filter(r => r.severity === 'high').length
  };

  const recentActivity = [
    { action: 'Report verified', report: 'High Tide Warning - Mumbai', time: '2 hours ago' },
    { action: 'New report submitted', report: 'Jellyfish Alert - Goa', time: '4 hours ago' },
    { action: 'Alert sent', report: 'Oil Spill - Vizag', time: '6 hours ago' },
    { action: 'Report marked false alarm', report: 'Unusual Activity - Kerala', time: '8 hours ago' }
  ];

  const handleAction = (report, action) => {
    setSelectedReport(report);
    setActionType(action);
    setShowActionModal(true);
  };

  const executeAction = () => {
    if (!selectedReport) return;
    
    const updatedReports = reports.map(report => {
      if (report.id === selectedReport.id) {
        const now = new Date().toISOString();
        return {
          ...report,
          status: actionType === 'verify' ? 'verified' : actionType === 'reject' ? 'false-alarm' : report.status,
          verifiedAt: actionType === 'verify' ? now : report.verifiedAt,
          verifiedBy: actionType === 'verify' || actionType === 'reject' ? 'Admin' : report.verifiedBy,
          comments: actionComment || report.comments
        };
      }
      return report;
    });
    
    setReports(updatedReports);
    setShowActionModal(false);
    setActionComment('');
    
    // Simulate alert sending
    if (actionType === 'verify') {
      alert(`Alert sent successfully for ${selectedReport.title}`);
    }
  };

  const filteredReports = reports.filter(report => {
    return (filters.status === 'all' || report.status === filters.status) &&
           (filters.severity === 'all' || report.severity === filters.severity) &&
           (filters.type === 'all' || report.type === filters.type);
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionButtons = (report) => {
    if (report.status === 'pending') {
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => handleAction(report, 'verify')}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            <CheckCircle2 className="h-4 w-4 inline mr-1" />
            Verify
          </button>
          <button
            onClick={() => handleAction(report, 'reject')}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            <XCircle className="h-4 w-4 inline mr-1" />
            Reject
          </button>
          <button
            onClick={() => handleAction(report, 'comment')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            <MessageSquare className="h-4 w-4 inline mr-1" />
            Comment
          </button>
        </div>
      );
    }
    
    return (
      <button
        onClick={() => handleAction(report, 'comment')}
        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
      >
        <MessageSquare className="h-4 w-4 inline mr-1" />
        Add Comment
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Monitor and manage ocean hazard reports</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 bg-ocean-500 hover:bg-ocean-600 text-white rounded-lg transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'reports', label: 'Reports', icon: List },
              { id: 'map', label: 'Map View', icon: MapPin }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-ocean-500 text-ocean-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <List className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Reports</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Verified</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.verified}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <div className="bg-red-100 p-3 rounded-full">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">False Alarms</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.falseAlarm}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <div className="bg-red-100 p-3 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">High Severity</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.highSeverity}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="bg-ocean-100 p-2 rounded-full">
                        <Activity className="h-4 w-4 text-ocean-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.report}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg text-left transition-colors">
                    <div className="flex items-center justify-between">
                      <span>Send Emergency Alert</span>
                      <Send className="h-4 w-4" />
                    </div>
                  </button>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg text-left transition-colors">
                    <div className="flex items-center justify-between">
                      <span>Bulk Verify Reports</span>
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </button>
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg text-left transition-colors">
                    <div className="flex items-center justify-between">
                      <span>Generate Analytics</span>
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="false-alarm">False Alarm</option>
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
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
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
                <div className="flex items-end">
                  <button className="w-full bg-ocean-500 hover:bg-ocean-600 text-white px-4 py-2 rounded-md transition-colors">
                    <Filter className="h-4 w-4 inline mr-2" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{report.title}</div>
                            <div className="text-sm text-gray-500">{report.location}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">{hazardTypes[report.type]?.label}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{
                              backgroundColor: severityConfig[report.severity]?.bgColor,
                              color: severityConfig[report.severity]?.color
                            }}
                          >
                            {severityConfig[report.severity]?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{
                              backgroundColor: statusConfig[report.status]?.bgColor,
                              color: statusConfig[report.status]?.color
                            }}
                          >
                            {statusConfig[report.status]?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(report.reportedAt)}
                        </td>
                        <td className="px-6 py-4">
                          {getActionButtons(report)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-96 md:h-[600px]">
              <MapContainer
                center={[20.5937, 78.9629]}
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
                    icon={createAdminIcon(report.type, report.severity, report.status)}
                  >
                    <Popup>
                      <div className="p-3 min-w-64">
                        <h3 className="font-semibold text-lg mb-2">{report.title}</h3>
                        <div className="space-y-2 text-sm mb-4">
                          <div><strong>Type:</strong> {hazardTypes[report.type]?.label}</div>
                          <div><strong>Severity:</strong> {severityConfig[report.severity]?.label}</div>
                          <div><strong>Status:</strong> {statusConfig[report.status]?.label}</div>
                          <div><strong>Location:</strong> {report.location}</div>
                          <div><strong>Reported by:</strong> {report.reportedBy}</div>
                          <div><strong>Date:</strong> {formatDate(report.reportedAt)}</div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                        {report.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAction(report, 'verify')}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleAction(report, 'reject')}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {actionType === 'verify' ? 'Verify Report' : 
               actionType === 'reject' ? 'Reject Report' : 'Add Comment'}
            </h3>
            <p className="text-gray-600 mb-4">{selectedReport?.title}</p>
            
            <textarea
              value={actionComment}
              onChange={(e) => setActionComment(e.target.value)}
              placeholder={
                actionType === 'verify' ? 'Add verification notes...' :
                actionType === 'reject' ? 'Reason for rejection...' : 
                'Add your comment...'
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500 mb-4"
              rows={4}
            />
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                className={`px-4 py-2 rounded-md text-white transition-colors ${
                  actionType === 'verify' ? 'bg-green-500 hover:bg-green-600' :
                  actionType === 'reject' ? 'bg-red-500 hover:bg-red-600' :
                  'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {actionType === 'verify' ? 'Verify & Send Alert' : 
                 actionType === 'reject' ? 'Reject Report' : 'Add Comment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;