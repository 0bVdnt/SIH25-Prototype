import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Filter, List, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock, XCircle, RefreshCw, MapPin, Bell, Shield, Eye } from 'lucide-react';
import { mockReports } from '../mockData';
import { useAuth } from '../contexts/AuthContext';

const ModernReportsPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [alertsOnly, setAlertsOnly] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    severity: 'all'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // For citizen users, we'll show a simplified view
  const isCitizen = user?.role === 'citizen';

  useEffect(() => {
    fetchReports();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
    // Filter for citizen alerts (only verified high/medium severity)
    if (isCitizen) {
      const citizenAlerts = reports
        .filter(report => 
          report.status === 'verified' && 
          (report.severity === 'high' || report.severity === 'medium')
        )
        .slice(0, 4); // Limit to 4 key alerts
      setAlertsOnly(citizenAlerts);
    }
  }, [reports, filters, isCitizen]);

  const fetchReports = async () => {
    try {
      setError(null);
      
      // Try to fetch from API first
      const response = await fetch('http://localhost:3001/api/reports');
      
      if (response.ok) {
        const data = await response.json();
        // Transform API data to match expected format
        const transformedData = data.map(report => ({
          ...report,
          hazardType: report.hazardType || report.type,
          status: report.status || 'pending',
          severity: report.severity || 'medium'
        }));
        setReports(transformedData);
        setLastFetch(new Date());
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.warn('API fetch failed, using mock data:', error);
      
      // Fallback to mock data with some dynamic updates
      const mockDataWithUpdates = mockReports.map(report => {
        // Randomly update some statuses to simulate real-time changes
        if (Math.random() < 0.1 && report.status === 'pending') {
          return { ...report, status: Math.random() < 0.7 ? 'verified' : 'false-alarm' };
        }
        return report;
      });
      
      setReports(mockDataWithUpdates);
      setLastFetch(new Date());
      setError('Using demo data - API unavailable');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = reports;
    
    if (filters.type !== 'all') {
      filtered = filtered.filter(report => {
        const reportType = report.hazardType || report.type;
        return reportType === filters.type;
      });
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(report => report.status === filters.status);
    }
    if (filters.severity !== 'all') {
      filtered = filtered.filter(report => report.severity === filters.severity);
    }
    
    setFilteredReports(filtered);
  };

  // Chart data processing
  const hazardTypeData = reports.reduce((acc, report) => {
    const reportType = report.hazardType || report.type;
    const existing = acc.find(item => item.type === reportType);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ type: reportType, count: 1 });
    }
    return acc;
  }, []);

  const statusData = [
    { status: 'Pending', count: reports.filter(r => r.status === 'pending').length, color: '#f59e0b' },
    { status: 'Verified', count: reports.filter(r => r.status === 'verified').length, color: '#10b981' },
    { status: 'False Alarm', count: reports.filter(r => r.status === 'false-alarm' || r.status === 'false_alarm').length, color: '#ef4444' }
  ];

  const severityData = [
    { severity: 'Low', count: reports.filter(r => r.severity === 'low').length, color: '#10b981' },
    { severity: 'Medium', count: reports.filter(r => r.severity === 'medium').length, color: '#f59e0b' },
    { severity: 'High', count: reports.filter(r => r.severity === 'high').length, color: '#ef4444' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'false_alarm': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (severity) {
      case 'high': return `${baseClasses} bg-red-100 text-red-800`;
      case 'medium': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low': return `${baseClasses} bg-green-100 text-green-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-shimmer w-96 h-64 rounded-xl"></div>
      </div>
    );
  }

  // Simplified view for citizen users
  if (isCitizen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center fade-in-up">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-2xl">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Ocean Safety Alerts
              </h1>
            </div>
            <p className="text-gray-600 text-lg mb-6">
              Current warnings and alerts for your safety
            </p>
            
            {/* Status Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md">
                <div className={`w-3 h-3 rounded-full ${error ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {error ? 'Demo Mode' : 'Live Updates'} • {alertsOnly.length} Active Alerts
                </span>
              </div>
              {lastFetch && (
                <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md">
                  <RefreshCw className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {lastFetch.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Active Alerts */}
          {alertsOnly.length > 0 ? (
            <div className="space-y-4 fade-in-up">
              {alertsOnly.map((alert, index) => (
                <div
                  key={alert.id}
                  className={`modern-card p-6 border-l-4 hover:scale-[1.02] transition-all duration-300 ${
                    alert.severity === 'high' 
                      ? 'border-red-500 bg-gradient-to-r from-red-50 to-red-100' 
                      : 'border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-2xl ${
                      alert.severity === 'high' ? 'bg-red-500' : 'bg-orange-500'
                    }`}>
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {alert.hazardType || alert.type}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          alert.severity === 'high' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {alert.severity.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-4 text-lg">{alert.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-700">{alert.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-700 font-medium">Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 fade-in-up">
              <div className="bg-green-100 p-6 rounded-3xl inline-block mb-6">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">All Clear!</h3>
              <p className="text-gray-600 text-lg mb-6">
                No active alerts in your area. Enjoy the ocean safely!
              </p>
              <div className="bg-white rounded-2xl p-6 shadow-lg max-w-md mx-auto">
                <h4 className="font-bold text-gray-900 mb-3">Safety Reminders:</h4>
                <ul className="text-left space-y-2 text-gray-600">
                  <li>• Always check weather conditions</li>
                  <li>• Stay hydrated and use sun protection</li>
                  <li>• Follow local beach guidelines</li>
                  <li>• Report any unusual ocean activity</li>
                </ul>
              </div>
            </div>
          )}

          {/* Quick Action */}
          <div className="text-center fade-in-up">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Eye className="h-6 w-6 text-ocean-600" />
                <h3 className="text-xl font-bold text-gray-900">Spot Something Unusual?</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Help keep our oceans safe by reporting hazards you observe.
              </p>
              <a
                href="/submit-report"
                className="bg-gradient-to-r from-ocean-500 to-blue-600 hover:from-ocean-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <AlertTriangle className="h-5 w-5" />
                <span>Report Ocean Hazard</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full analytics view for admin/authority users

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Status */}
        <div className="text-center fade-in-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Ocean Hazard Analytics
          </h1>
          <p className="text-gray-600 text-lg mb-4">Comprehensive visualization and analysis of reported ocean hazards</p>
          
          {/* Status Indicator */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${error ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-sm text-gray-600">
                {error ? 'Demo Mode' : 'Live Data'} • {reports.length} reports
              </span>
            </div>
            {lastFetch && (
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Updated: {lastFetch.toLocaleTimeString()}
                </span>
              </div>
            )}
            <button
              onClick={fetchReports}
              disabled={loading}
              className="btn-modern btn-secondary px-3 py-1 text-sm flex items-center space-x-1"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          
          {error && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md mx-auto">
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="modern-card p-6 fade-in-up">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="font-semibold text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="modern-input min-w-[150px]"
            >
              <option value="all">All Types</option>
              <option value="High Tide">High Tide</option>
              <option value="Storm/Cyclone">Storm/Cyclone</option>
              <option value="Water Pollution">Water Pollution</option>
              <option value="Jellyfish Swarm">Jellyfish Swarm</option>
              <option value="Oil Spill">Oil Spill</option>
              <option value="Unusual Marine Activity">Marine Activity</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="modern-input min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="false_alarm">False Alarm</option>
            </select>

            <select
              value={filters.severity}
              onChange={(e) => setFilters({...filters, severity: e.target.value})}
              className="modern-input min-w-[150px]"
            >
              <option value="all">All Severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 fade-in-up">
          <div className="modern-card p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-blue-600">{reports.length}</div>
            <div className="text-gray-600 mt-2">Total Reports</div>
          </div>
          <div className="modern-card p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-green-600">{statusData.find(s => s.status === 'Verified')?.count || 0}</div>
            <div className="text-gray-600 mt-2">Verified</div>
          </div>
          <div className="modern-card p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-yellow-600">{statusData.find(s => s.status === 'Pending')?.count || 0}</div>
            <div className="text-gray-600 mt-2">Pending</div>
          </div>
          <div className="modern-card p-6 text-center hover-lift">
            <div className="text-3xl font-bold text-red-600">{severityData.find(s => s.severity === 'High')?.count || 0}</div>
            <div className="text-gray-600 mt-2">High Severity</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hazard Types Chart */}
          <div className="modern-card p-6 slide-in-right">
            <div className="flex items-center space-x-2 mb-6">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">Hazard Types Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hazardTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="type" tick={{fontSize: 12}} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="count" fill="url(#blueGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.9}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="modern-card p-6 slide-in-right">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-800">Status Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({status, count}) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reports List */}
        <div className="modern-card p-6 fade-in-up">
          <div className="flex items-center space-x-2 mb-6">
            <List className="h-6 w-6 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-800">Recent Reports ({filteredReports.length})</h3>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
            {filteredReports.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-xl p-4 hover-lift hover:border-blue-300 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(report.status)}
                      <h4 className="font-semibold text-gray-800">{report.hazardType}</h4>
                      <span className={getSeverityBadge(report.severity)}>
                        {report.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{report.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📍 {report.location}</span>
                      <span>👤 {report.reporterName}</span>
                      <span>📅 {new Date(report.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernReportsPage;