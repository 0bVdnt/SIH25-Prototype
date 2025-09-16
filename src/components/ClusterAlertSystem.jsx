import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { AlertTriangle, MapPin, Clock, Users, TrendingUp, Activity, Bell, Zap } from 'lucide-react';

const ClusterAlertSystem = () => {
  const { sendHazardAlert } = useNotifications();
  
  const [clusters, setClusters] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [reportHistory, setReportHistory] = useState(new Map()); // Track verified vs duplicate reports

  // Mock cluster detection logic with improved intelligence
  useEffect(() => {
    const detectClusters = () => {
      // Simulate intelligent cluster detection
      const mockClusters = [
        {
          id: 1,
          location: { lat: 19.0760, lon: 72.8777, name: 'Mumbai Coastal Area' },
          reportCount: 7,
          uniqueReports: 4, // Different from total reports - some might be duplicates
          timeWindow: '15 minutes',
          hazardTypes: ['High Tide', 'Coastal Flooding'],
          severity: 'high',
          firstReported: new Date(Date.now() - 15 * 60 * 1000),
          lastReported: new Date(Date.now() - 2 * 60 * 1000),
          status: 'active',
          radius: 2.5, // km
          confidence: 0.85, // Confidence that this is a real incident vs noise
          verificationStatus: 'pending' // separate from individual report verification
        },
        {
          id: 2,
          location: { lat: 13.0827, lon: 80.2707, name: 'Chennai Marina Beach' },
          reportCount: 5,
          uniqueReports: 5, // All reports are unique
          timeWindow: '20 minutes',
          hazardTypes: ['Oil Spill'],
          severity: 'medium',
          firstReported: new Date(Date.now() - 45 * 60 * 1000),
          lastReported: new Date(Date.now() - 10 * 60 * 1000),
          status: 'monitoring',
          radius: 1.8, // km
          confidence: 0.92,
          verificationStatus: 'pending'
        }
      ];

      setClusters(mockClusters);

      // Improved cluster alert logic
      mockClusters.forEach(cluster => {
        const shouldTriggerAlert = evaluateClusterForAlert(cluster);
        if (shouldTriggerAlert) {
          const existingAlert = activeAlerts.find(alert => alert.clusterId === cluster.id);
          if (!existingAlert) {
            triggerClusterAlert(cluster);
          }
        }
      });
    };

    // Run cluster detection every 30 seconds
    const interval = setInterval(detectClusters, 30000);
    detectClusters(); // Run immediately

    return () => clearInterval(interval);
  }, [activeAlerts]);

  // Intelligent evaluation function for cluster alerts
  const evaluateClusterForAlert = (cluster) => {
    // Criteria for triggering cluster alert (not individual report verification)
    const minUniqueReports = 3; // At least 3 unique reports
    const minConfidence = 0.7; // At least 70% confidence
    const maxTimeWindow = 60; // Within 60 minutes
    
    // Check if cluster meets alert criteria
    const hasEnoughUniqueReports = cluster.uniqueReports >= minUniqueReports;
    const hasHighConfidence = cluster.confidence >= minConfidence;
    const isActiveStatus = cluster.status === 'active';
    const isWithinTimeWindow = (Date.now() - cluster.firstReported.getTime()) < (maxTimeWindow * 60 * 1000);
    
    // Additional logic: Don't auto-verify individual reports just because of clustering
    const needsManualReview = cluster.hazardTypes.some(type => 
      ['Oil Spill', 'Chemical Discharge', 'Unusual Marine Activity'].includes(type)
    );
    
    return hasEnoughUniqueReports && hasHighConfidence && isActiveStatus && isWithinTimeWindow;
  };

  const triggerClusterAlert = (cluster) => {
    const alert = {
      id: Date.now(),
      clusterId: cluster.id,
      title: `Cluster Detection: ${cluster.location.name}`,
      message: `${cluster.uniqueReports} unique reports of ${cluster.hazardTypes.join(', ')} detected. Manual verification recommended.`,
      severity: cluster.confidence > 0.8 ? cluster.severity : 'medium', // Lower severity if confidence is lower
      timestamp: new Date(),
      acknowledged: false,
      recommendsVerification: true, // Flag that this needs human review
      autoVerify: false // Never auto-verify based on clustering alone
    };

    setActiveAlerts(prev => [alert, ...prev]);

    // Send notification but emphasize need for verification
    sendHazardAlert({
      type: 'Cluster Alert - Verification Needed',
      location: cluster.location.name,
      severity: alert.severity,
      source: 'Automated Cluster Detection'
    });
  };

  const acknowledgeAlert = (alertId) => {
    setActiveAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const dismissAlert = (alertId) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-100';
      case 'monitoring': return 'text-orange-600 bg-orange-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cluster Alert System</h2>
          <p className="text-gray-600">Automated detection of hazard clusters and proximity alerts</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Activity className="h-4 w-4 text-green-500 animate-pulse" />
            <span className="text-sm text-green-600 font-medium">Monitoring</span>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-red-500" />
            Active Cluster Alerts ({activeAlerts.filter(a => !a.acknowledged).length} unacknowledged)
          </h3>
          
          {activeAlerts.map(alert => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 ${
                alert.acknowledged ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className={`h-5 w-5 ${
                      alert.acknowledged ? 'text-gray-500' : 'text-red-500'
                    }`} />
                    <h4 className={`font-semibold ${
                      alert.acknowledged ? 'text-gray-700' : 'text-red-900'
                    }`}>
                      {alert.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${
                    alert.acknowledged ? 'text-gray-600' : 'text-red-800'
                  }`}>
                    {alert.message}
                  </p>
                  <div className="text-xs text-gray-500">
                    {alert.timestamp.toLocaleString()}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detected Clusters */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Detected Clusters</h3>
        
        {clusters.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No hazard clusters detected</p>
            <p className="text-sm text-gray-400 mt-1">
              System continuously monitors for patterns in report submissions
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {clusters.map(cluster => (
              <div key={cluster.id} className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{cluster.location.name}</h4>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span>{cluster.location.lat.toFixed(4)}, {cluster.location.lon.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cluster.status)}`}>
                    {cluster.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{cluster.reportCount}</div>
                    <div className="text-xs text-gray-600">Total Reports</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{cluster.uniqueReports}</div>
                    <div className="text-xs text-gray-600">Unique Reports</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{cluster.radius}</div>
                    <div className="text-xs text-gray-600">km radius</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Hazard Types:</span>
                    <span className="font-medium">{cluster.hazardTypes.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Time Window:</span>
                    <span className="font-medium">{cluster.timeWindow}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Confidence:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      cluster.confidence >= 0.8 ? 'bg-green-100 text-green-600' :
                      cluster.confidence >= 0.6 ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {Math.round(cluster.confidence * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Verification:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      cluster.verificationStatus === 'verified' ? 'bg-green-100 text-green-600' :
                      cluster.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {cluster.verificationStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Severity:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(cluster.severity)}`}>
                      {cluster.severity.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>First: {cluster.firstReported.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Last: {cluster.lastReported.toLocaleTimeString()}</span>
                  </div>
                </div>

                {cluster.status === 'active' && (
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-red-700 transition-colors">
                      <Zap className="h-4 w-4 inline mr-1" />
                      Send Emergency Alert
                    </button>
                    <button className="bg-gray-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                      View Details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Configuration */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Cluster Detection Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Reports for Alert
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="3">3 reports</option>
              <option value="5" selected>5 reports</option>
              <option value="7">7 reports</option>
              <option value="10">10 reports</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Window
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30" selected>30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proximity Radius
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="1">1 km</option>
              <option value="2" selected>2 km</option>
              <option value="5">5 km</option>
              <option value="10">10 km</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClusterAlertSystem;