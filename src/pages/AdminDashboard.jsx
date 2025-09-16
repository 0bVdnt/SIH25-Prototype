import React, { useState, useRef } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  BarChart3, 
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
  Activity,
  Brain,
  Zap,
  Waves,
  FileText,
  Settings,
  Globe,
  Shield,
  ChevronDown,
  ChevronRight,
  Search,
  Calendar,
  PieChart,
  BarChart,
  Bell
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import { mockReports, hazardTypes, statusConfig, severityConfig } from '../mockData';
import SocialMediaAnalysis from '../components/SocialMediaAnalysis';
import ClusterAlertSystem from '../components/ClusterAlertSystem';
import INCOISIntegration from '../components/INCOISIntegration';

const AdminDashboard = () => {
  const { sendEmergencyAlert: broadcastAlert, showNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('overview');
  const [reports, setReports] = useState(mockReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [actionType, setActionType] = useState('');
  const [actionComment, setActionComment] = useState('');
  const [emergencyAlert, setEmergencyAlert] = useState({
    title: '',
    message: '',
    severity: 'high',
    location: '',
    type: ''
  });
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    type: 'all'
  });
  const [expandedSections, setExpandedSections] = useState({
    analytics: true,
    insights: true,
    alerts: true
  });
  const downloadRef = useRef();

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    verified: reports.filter(r => r.status === 'verified').length,
    falseAlarm: reports.filter(r => r.status === 'false-alarm').length,
    highSeverity: reports.filter(r => r.severity === 'high').length,
    todayReports: reports.filter(r => {
      const today = new Date();
      const reportDate = new Date(r.timestamp);
      return reportDate.toDateString() === today.toDateString();
    }).length
  };

  // Chart data for analytics
  const hazardTypeData = reports.reduce((acc, report) => {
    const type = report.type || report.hazardType;
    const existing = acc.find(item => item.type === type);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ type, count: 1 });
    }
    return acc;
  }, []);

  const statusData = [
    { status: 'Pending', count: stats.pending, color: '#f59e0b' },
    { status: 'Verified', count: stats.verified, color: '#10b981' },
    { status: 'False Alarm', count: stats.falseAlarm, color: '#ef4444' }
  ];

  const severityData = [
    { severity: 'Low', count: reports.filter(r => r.severity === 'low').length, color: '#10b981' },
    { severity: 'Medium', count: reports.filter(r => r.severity === 'medium').length, color: '#f59e0b' },
    { severity: 'High', count: reports.filter(r => r.severity === 'high').length, color: '#ef4444' }
  ];

  // Generate time-based analytics
  const timeAnalytics = reports.reduce((acc, report) => {
    const date = new Date(report.timestamp).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.reports += 1;
      if (report.status === 'verified') existing.verified += 1;
    } else {
      acc.push({ 
        date, 
        reports: 1, 
        verified: report.status === 'verified' ? 1 : 0 
      });
    }
    return acc;
  }, []).slice(-7); // Last 7 days

  const recentActivity = [
    { action: 'Report verified', report: 'High Tide Warning - Mumbai', time: '2 hours ago', type: 'verify' },
    { action: 'Emergency alert sent', report: 'Tsunami Warning - Tamil Nadu', time: '4 hours ago', type: 'alert' },
    { action: 'New report submitted', report: 'Jellyfish Alert - Goa', time: '4 hours ago', type: 'submit' },
    { action: 'Analysis generated', report: 'Weekly Hazard Trends', time: '6 hours ago', type: 'analysis' },
    { action: 'Report marked false alarm', report: 'Unusual Activity - Kerala', time: '8 hours ago', type: 'reject' }
  ];

  const handleAction = (report, action) => {
    setSelectedReport(report);
    setActionType(action);
    setShowActionModal(true);
  };

  const handleEmergencyAlert = () => {
    setShowEmergencyAlert(true);
  };

  const sendEmergencyAlert = async () => {
    if (!emergencyAlert.title || !emergencyAlert.message) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Create comprehensive alert payload
      const alertPayload = {
        ...emergencyAlert,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
        priority: emergencyAlert.severity === 'high' ? 'critical' : 'high',
        broadcastRadius: emergencyAlert.severity === 'high' ? 50 : 25, // km
        channel: 'emergency'
      };
      
      // Broadcast to all citizens
      await broadcastAlert(alertPayload);
      
      // Show local notification to admin
      showNotification({
        type: 'success',
        title: 'Emergency Alert Sent',
        message: `"${emergencyAlert.title}" has been broadcast to all citizens in the area.`,
        priority: 'high'
      });
      
      // Simulate sending to emergency services
      console.log('Alert sent to emergency services:', alertPayload);
      
      // Show success feedback
      alert(`✅ Emergency alert "${emergencyAlert.title}" successfully broadcast to all citizens!\n\n📍 Location: ${emergencyAlert.location}\n🚨 Severity: ${emergencyAlert.severity.toUpperCase()}\n📱 Estimated reach: ${emergencyAlert.severity === 'high' ? '10,000+' : '5,000+'} users`);
      
      // Reset form and close modal
      setEmergencyAlert({
        title: '',
        message: '',
        severity: 'high',
        location: '',
        type: ''
      });
      setShowEmergencyAlert(false);
      
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
      alert('Failed to send emergency alert. Please try again.');
    }
  };

  const generateAnalysis = async () => {
    try {
      // Show loading state
      alert('Generating comprehensive analysis... This may take a moment.');
      
      // Generate comprehensive analysis with AI insights
      const analysis = {
        reportSummary: {
          totalReports: stats.total,
          verifiedReports: stats.verified,
          pendingReports: stats.pending,
          falseAlarms: stats.falseAlarm,
          highSeverityReports: stats.highSeverity,
          accuracyRate: ((stats.verified / (stats.verified + stats.falseAlarm)) * 100).toFixed(1)
        },
        trends: {
          weeklyChange: '+12%',
          mostCommonHazard: 'High Tide',
          peakReportingTime: '2:00 PM - 4:00 PM',
          mostActiveLocation: 'Mumbai Coast'
        },
        aiInsights: [
          '🔍 Increasing trend in coastal flooding reports during monsoon season',
          '⚠️ High correlation between social media mentions and actual hazard occurrences',
          '📈 Report accuracy has improved by 15% over the last month',
          '🌊 Weather pattern analysis suggests heightened ocean activity in the coming week',
          '📱 Mobile reports are 23% more accurate than web submissions'
        ],
        recommendations: [
          'Increase monitoring around Mumbai Coast during afternoon hours',
          'Deploy additional sensors in high-tide prone areas',
          'Enhance social media AI monitoring for early detection',
          'Conduct citizen awareness campaigns in coastal communities',
          'Implement predictive modeling for weather-related hazards'
        ],
        riskAssessment: {
          currentRiskLevel: 'Medium',
          riskFactors: ['Monsoon season approaching', 'High tide alerts', 'Weather instability'],
          preparednessScore: '85%'
        },
        generatedAt: new Date().toISOString(),
        analysisId: `ANALYSIS-${Date.now()}`
      };
      
      // Store analysis for display
      setAnalysisResults(analysis);
      setShowAnalysisModal(true);
      
      // Show success notification
      showNotification({
        type: 'success',
        title: 'Analysis Generated',
        message: 'Comprehensive hazard analysis ready for review and export.',
        priority: 'medium'
      });
      
    } catch (error) {
      console.error('Analysis generation failed:', error);
      alert('Failed to generate analysis. Please try again.');
    }
  };

  const exportToPDF = () => {
    try {
      // Create a comprehensive report for PDF export
      const reportData = {
        generatedAt: new Date().toISOString(),
        reportTitle: 'Ocean Hazard Analysis Report',
        period: 'Last 30 Days',
        summary: {
          ...stats,
          accuracyRate: ((stats.verified / (stats.verified + stats.falseAlarm)) * 100).toFixed(1) + '%'
        },
        hazardDistribution: hazardTypeData,
        statusBreakdown: statusData,
        timeSeriesData: timeAnalytics,
        recentActivity: recentActivity,
        keyInsights: analysisResults?.aiInsights || [
          'Increasing trend in coastal flooding reports',
          'High accuracy rate maintained across all regions',
          'Mobile submissions show higher verification rates'
        ],
        recommendations: analysisResults?.recommendations || [
          'Enhance monitoring during peak hours',
          'Deploy additional sensors in high-risk areas',
          'Increase community awareness campaigns'
        ]
      };

      // Create PDF content (in a real app, you'd use a library like jsPDF)
      const pdfContent = `
OCEAN HAZARD ANALYSIS REPORT
Generated: ${new Date(reportData.generatedAt).toLocaleString()}
Period: ${reportData.period}

EXECUTIVE SUMMARY
==================
Total Reports: ${reportData.summary.total}
Verified Reports: ${reportData.summary.verified}
Pending Reviews: ${reportData.summary.pending}
False Alarms: ${reportData.summary.falseAlarm}
High Severity: ${reportData.summary.highSeverity}
Accuracy Rate: ${reportData.summary.accuracyRate}

HAZARD DISTRIBUTION
===================
${reportData.hazardDistribution.map(h => `${h.type}: ${h.count} reports`).join('\n')}

KEY INSIGHTS
============
${reportData.keyInsights.map(insight => `• ${insight}`).join('\n')}

RECOMMENDATIONS
===============
${reportData.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

RECENT ACTIVITY
===============
${reportData.recentActivity.map(activity => `• ${activity.action} - ${activity.report} (${activity.time})`).join('\n')}
      `;

      // Create downloadable file
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ocean_Hazard_Report_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show success notification
      showNotification({
        type: 'success',
        title: 'Report Exported',
        message: 'Comprehensive analysis report has been downloaded successfully.',
        priority: 'medium'
      });

      alert('✅ Report exported successfully!\n\nThe comprehensive analysis has been downloaded to your device.');
      
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-2xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Ocean Safety Command Center
                </h1>
                <p className="text-gray-600">Advanced analytics and emergency response management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleEmergencyAlert}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <Bell className="h-5 w-5 mr-2" />
                Send Emergency Alert
              </button>
              <button 
                onClick={generateAnalysis}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Generate Analysis
              </button>
              <button 
                onClick={exportToPDF}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <Download className="h-5 w-5 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
              { id: 'analytics', label: 'Advanced Analytics', icon: TrendingUp },
              { id: 'reports', label: 'Reports Management', icon: List },
              { id: 'social-media', label: 'Social Intelligence', icon: Brain },
              { id: 'cluster-alerts', label: 'Cluster Analysis', icon: Zap },
              { id: 'incois', label: 'INCOIS Integration', icon: Waves }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-6 px-4 border-b-2 font-semibold text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-ocean-500 text-ocean-600 bg-ocean-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Reports</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </div>
                  <List className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-3xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-3xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Verified</p>
                    <p className="text-3xl font-bold">{stats.verified}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-3xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">False Alarms</p>
                    <p className="text-3xl font-bold">{stats.falseAlarm}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-3xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">High Severity</p>
                    <p className="text-3xl font-bold">{stats.highSeverity}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-3xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-medium">Today's Reports</p>
                    <p className="text-3xl font-bold">{stats.todayReports}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-indigo-200" />
                </div>
              </div>
            </div>

            {/* Collapsible Analytics Section */}
            <div className="space-y-6">
              <button
                onClick={() => toggleSection('analytics')}
                className="w-full flex items-center justify-between p-6 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-6 w-6 text-ocean-600" />
                  <h3 className="text-xl font-bold text-gray-900">Advanced Analytics</h3>
                </div>
                {expandedSections.analytics ? (
                  <ChevronDown className="h-6 w-6 text-gray-400" />
                ) : (
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                )}
              </button>

              {expandedSections.analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Hazard Types Chart */}
                  <div className="bg-white p-8 rounded-3xl shadow-lg">
                    <div className="flex items-center space-x-3 mb-6">
                      <BarChart className="h-6 w-6 text-blue-600" />
                      <h4 className="text-lg font-bold text-gray-900">Hazard Distribution</h4>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsBarChart data={hazardTypeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                        <XAxis dataKey="type" tick={{fontSize: 12}} angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="url(#blueGradient)" radius={[8, 8, 0, 0]} />
                        <defs>
                          <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                            <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.9}/>
                          </linearGradient>
                        </defs>
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Status Distribution */}
                  <div className="bg-white p-8 rounded-3xl shadow-lg">
                    <div className="flex items-center space-x-3 mb-6">
                      <PieChart className="h-6 w-6 text-green-600" />
                      <h4 className="text-lg font-bold text-gray-900">Status Breakdown</h4>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
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
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Time Series Analytics */}
                  <div className="bg-white p-8 rounded-3xl shadow-lg lg:col-span-2">
                    <div className="flex items-center space-x-3 mb-6">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                      <h4 className="text-lg font-bold text-gray-900">7-Day Trend Analysis</h4>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={timeAnalytics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="reports" stackId="1" stroke="#8884d8" fill="url(#purpleGradient)" />
                        <Area type="monotone" dataKey="verified" stackId="1" stroke="#82ca9d" fill="url(#greenGradient)" />
                        <defs>
                          <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                          </linearGradient>
                          <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* Live Activity Feed */}
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

        {activeTab === 'social-media' && (
          <SocialMediaAnalysis />
        )}

        {activeTab === 'cluster-alerts' && (
          <ClusterAlertSystem />
        )}

        {activeTab === 'incois' && (
          <INCOISIntegration />
        )}
      </div>

      {/* Emergency Alert Modal */}
      {showEmergencyAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-red-100 p-3 rounded-2xl">
                <Bell className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Send Emergency Alert</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alert Title</label>
                <input
                  type="text"
                  value={emergencyAlert.title}
                  onChange={(e) => setEmergencyAlert({...emergencyAlert, title: e.target.value})}
                  placeholder="e.g., Tsunami Warning - Immediate Evacuation Required"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alert Message</label>
                <textarea
                  value={emergencyAlert.message}
                  onChange={(e) => setEmergencyAlert({...emergencyAlert, message: e.target.value})}
                  placeholder="Detailed alert message for citizens..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                  <select
                    value={emergencyAlert.severity}
                    onChange={(e) => setEmergencyAlert({...emergencyAlert, severity: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="high">High - Critical</option>
                    <option value="medium">Medium - Important</option>
                    <option value="low">Low - Advisory</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={emergencyAlert.location}
                    onChange={(e) => setEmergencyAlert({...emergencyAlert, location: e.target.value})}
                    placeholder="e.g., Mumbai Coast"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hazard Type</label>
                <select
                  value={emergencyAlert.type}
                  onChange={(e) => setEmergencyAlert({...emergencyAlert, type: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select hazard type...</option>
                  <option value="tsunami">Tsunami</option>
                  <option value="cyclone">Cyclone/Storm</option>
                  <option value="high-tide">High Tide</option>
                  <option value="oil-spill">Oil Spill</option>
                  <option value="pollution">Water Pollution</option>
                  <option value="other">Other Emergency</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowEmergencyAlert(false)}
                className="px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={sendEmergencyAlert}
                disabled={!emergencyAlert.title || !emergencyAlert.message}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl font-bold transition-all duration-300 disabled:cursor-not-allowed"
              >
                Send Emergency Alert
              </button>
            </div>
          </div>
        </div>
      )}

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