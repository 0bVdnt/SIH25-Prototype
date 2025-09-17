import React, { useState, useEffect, useRef } from 'react';
import { Filter, List, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock, XCircle, RefreshCw, MapPin, Bell, Shield, Eye } from 'lucide-react';
import { mockReports } from '../mockData';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../utils/toast';

const ModernReportsPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    severity: 'all'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [userVerifications, setUserVerifications] = useState(new Map());
  const [votingInProgress, setVotingInProgress] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(6);
  const isVotingRef = useRef(new Set());

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [reports, filters]);

  // Generate random dates for reports
  const generateRandomDate = () => {
    const start = new Date(2024, 0, 1);
    const end = new Date();
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime);
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add random dates to mock data
      const mockDataWithDates = mockReports.map(report => {
        if (!report.timestamp || report.timestamp === 'Invalid Date') {
          return {
            ...report,
            timestamp: generateRandomDate().toISOString(),
            verifications: report.verifications || { confirm: Math.floor(Math.random() * 20), reject: Math.floor(Math.random() * 5) }
          };
        }
        return {
          ...report,
          verifications: report.verifications || { confirm: Math.floor(Math.random() * 20), reject: Math.floor(Math.random() * 5) }
        };
      });

      setReports(mockDataWithDates);
      setLastFetch(new Date());
    } catch (err) {
      setError('Failed to fetch reports');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = (reportId, type) => {
    // Check if user is logged in
    if (!user) {
      showToast.error('Please log in to vote on reports');
      return;
    }
    
    const operationKey = `${reportId}-${type}`;
    
    // Prevent double-clicks using ref
    if (isVotingRef.current.has(operationKey)) {
      console.log('❌ Vote blocked - already in progress:', operationKey);
      return;
    }
    
    // Mark operation as in progress
    isVotingRef.current.add(operationKey);
    setVotingInProgress(prev => new Set([...prev, operationKey]));
    
    const currentVote = userVerifications.get(reportId);
    console.log(`🗳️ Initiating vote: ${reportId} -> ${type}, current: ${currentVote || 'none'}`);
    
    setTimeout(() => {
      let message = '';
      
      // Update reports
      setReports(prev => {
        const updatedReports = prev.map(report => {
          if (report.id === reportId) {
            const updatedReport = { ...report };
            if (!updatedReport.verifications) {
              updatedReport.verifications = { confirm: 0, reject: 0 };
            }

            console.log('📊 Before vote:', JSON.stringify(updatedReport.verifications));

            if (currentVote === type) {
              // Remove vote
              updatedReport.verifications[type] = Math.max(0, updatedReport.verifications[type] - 1);
              message = 'Vote removed successfully!';
            } else if (currentVote && currentVote !== type) {
              // Switch vote
              updatedReport.verifications[currentVote] = Math.max(0, updatedReport.verifications[currentVote] - 1);
              updatedReport.verifications[type] += 1;
              message = `Vote switched to ${type === 'confirm' ? 'Confirm' : 'Not Relevant'}!`;
            } else {
              // Add new vote
              updatedReport.verifications[type] += 1;
              message = type === 'confirm' ? 'Thank you for confirming this report!' : 'Thank you for your feedback!';
            }

            console.log('📊 After vote:', JSON.stringify(updatedReport.verifications));
            return updatedReport;
          }
          return report;
        });
        
        return updatedReports;
      });
      
      // Update user verification state
      setUserVerifications(prev => {
        const newUserVerifications = new Map(prev);
        
        if (currentVote === type) {
          newUserVerifications.delete(reportId);
        } else {
          newUserVerifications.set(reportId, type);
        }
        
        return newUserVerifications;
      });
      
      // Show toast message with enhanced styling
      if (currentVote === type) {
        // Vote removed
        showToast.success("🗳️ Your vote has been removed", {
          style: {
            background: 'white',
            color: '#374151',
            borderLeft: '4px solid #6B7280'
          }
        });
      } else if (currentVote && currentVote !== type) {
        // Vote switched
        showToast.success(
          type === 'confirm' 
            ? "✅ Vote changed to 'Confirmed'" 
            : "❌ Vote changed to 'Not Relevant'",
          {
            style: {
              background: 'white',
              color: '#374151',
              borderLeft: type === 'confirm' ? '4px solid #10B981' : '4px solid #EF4444'
            }
          }
        );
      } else {
        // New vote
        showToast.success(
          type === 'confirm' 
            ? "🎯 Report confirmed! Thank you for verifying" 
            : "📝 Marked as not relevant. Thank you for the feedback",
          {
            style: {
              background: 'white',
              color: '#374151',
              borderLeft: type === 'confirm' ? '4px solid #10B981' : '4px solid #EF4444'
            }
          }
        );
      }
      
      // Clear operation flags
      setTimeout(() => {
        isVotingRef.current.delete(operationKey);
        setVotingInProgress(prev => {
          const newSet = new Set(prev);
          newSet.delete(operationKey);
          return newSet;
        });
        console.log('✅ Vote operation completed:', operationKey);
      }, 300);
      
    }, 50);
  };

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
    
    setFilteredReports(filtered);
  };

  // Statistics calculations
  const severityData = [
    { severity: 'High', count: reports.filter(r => r.severity === 'high').length },
    { severity: 'Medium', count: reports.filter(r => r.severity === 'medium').length },
    { severity: 'Low', count: reports.filter(r => r.severity === 'low').length }
  ];

  const statusData = [
    { status: 'Verified', count: reports.filter(r => r.status === 'verified').length },
    { status: 'Pending', count: reports.filter(r => r.status === 'pending').length },
    { status: 'Under Review', count: reports.filter(r => r.status === 'under review').length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Status */}
        <div className="text-center fade-in-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Ocean Hazard Reports
          </h1>
          <p className="text-gray-600 text-lg mb-4">Community-reported ocean hazards and safety alerts</p>
          
          {/* Status Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md">
              <div className={`w-3 h-3 rounded-full ${error ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {error ? 'Demo Mode' : 'Live Updates'} • {reports.length} Reports
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

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 fade-in-up">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="marine-pollution">Marine Pollution</option>
                <option value="weather-alert">Weather Alert</option>
                <option value="marine-life">Marine Life</option>
                <option value="infrastructure">Infrastructure</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="under review">Under Review</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters({...filters, severity: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Severity</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
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

        {/* Reports Grid */}
        <div className="space-y-8 fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <List className="h-6 w-6 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-800">Recent Reports ({filteredReports.length})</h3>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="btn-modern btn-secondary px-4 py-2 text-sm"
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </button>
            </div>
          </div>
          
          {/* Pagination calculations */}
          {(() => {
            const totalReports = filteredReports.length;
            const totalPages = Math.ceil(totalReports / reportsPerPage);
            const startIndex = (currentPage - 1) * reportsPerPage;
            const endIndex = startIndex + reportsPerPage;
            const currentReports = filteredReports.slice(startIndex, endIndex);
            
            return (
              <>
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                  {currentReports.map((report) => (
                    <div 
                      key={report.id} 
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] border border-gray-100 hover:border-ocean-200 overflow-hidden"
                    >
                      <div className="p-6">
                        {/* Header with Status */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2.5 rounded-xl ${
                              report.severity === 'high' ? 'bg-red-100' :
                              report.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                            }`}>
                              <AlertTriangle className={`h-5 w-5 ${
                                report.severity === 'high' ? 'text-red-600' :
                                report.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                                {report.hazardType || report.type}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  report.status === 'verified' ? 'bg-green-100 text-green-700' :
                                  report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {report.status}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  report.severity === 'high' ? 'bg-red-100 text-red-700' :
                                  report.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {report.severity}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {new Date(report.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-700 mb-4 text-sm leading-relaxed line-clamp-3">
                          {report.description}
                        </p>
                        
                        {/* Location and Reporter */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="font-medium line-clamp-1">{report.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Shield className="h-4 w-4 text-gray-400" />
                            <span>Reported by {report.reporterName}</span>
                          </div>
                        </div>

                        {/* Verification Section */}
                        <div className="border-t border-gray-100 pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-xs text-gray-500 font-medium">Community Verification</div>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Eye className="h-3 w-3" />
                              <span>{((report.verifications?.confirm || 0) / Math.max((report.verifications?.confirm || 0) + (report.verifications?.reject || 0), 1) * 100).toFixed(0)}% confidence</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            {(() => {
                              const currentVote = user ? userVerifications.get(report.id) : null;
                              const isConfirmSelected = currentVote === 'confirm';
                              const isRejectSelected = currentVote === 'reject';
                              const confirmInProgress = votingInProgress.has(`${report.id}-confirm`);
                              const rejectInProgress = votingInProgress.has(`${report.id}-reject`);
                              
                              return (
                                <>
                                  <button
                                    onClick={() => handleVerification(report.id, 'confirm')}
                                    disabled={confirmInProgress || rejectInProgress}
                                    title={!user ? 'Please log in to vote' : (isConfirmSelected ? 'Click to remove your confirmation' : 'Confirm this report')}
                                    className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium hover:scale-[1.02] transform disabled:cursor-not-allowed disabled:opacity-60 ${
                                      isConfirmSelected
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg border-2 border-green-600'
                                        : !user 
                                          ? 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-600 border-2 border-gray-200 hover:border-gray-300'
                                          : 'bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 border-2 border-green-200 hover:border-green-300'
                                    }`}
                                  >
                                    {confirmInProgress ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                                    ) : (
                                      <CheckCircle className={`h-4 w-4 ${isConfirmSelected ? 'text-white' : ''}`} />
                                    )}
                                    <span>
                                      {confirmInProgress 
                                        ? 'Processing...' 
                                        : !user 
                                          ? 'Confirm (Login Required)'
                                          : isConfirmSelected 
                                            ? '✓ Confirmed' 
                                            : 'Confirm'
                                      }
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                      isConfirmSelected 
                                        ? 'bg-green-400 text-green-900'
                                        : 'bg-green-200 text-green-800'
                                    }`}>
                                      {report.verifications?.confirm || 0}
                                    </span>
                                  </button>
                                  
                                  <button
                                    onClick={() => handleVerification(report.id, 'reject')}
                                    disabled={confirmInProgress || rejectInProgress}
                                    title={!user ? 'Please log in to vote' : (isRejectSelected ? 'Click to remove your vote' : 'Mark as not relevant')}
                                    className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium hover:scale-[1.02] transform disabled:cursor-not-allowed disabled:opacity-60 ${
                                      isRejectSelected
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg border-2 border-red-600'
                                        : !user
                                          ? 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-600 border-2 border-gray-200 hover:border-gray-300'
                                          : 'bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 border-2 border-red-200 hover:border-red-300'
                                    }`}
                                  >
                                    {rejectInProgress ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                                    ) : (
                                      <XCircle className={`h-4 w-4 ${isRejectSelected ? 'text-white' : ''}`} />
                                    )}
                                    <span>
                                      {rejectInProgress 
                                        ? 'Processing...' 
                                        : !user 
                                          ? 'Not Relevant (Login Required)'
                                          : isRejectSelected 
                                            ? '✓ Rejected' 
                                            : 'Not Relevant'
                                      }
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                      isRejectSelected 
                                        ? 'bg-red-400 text-red-900'
                                        : 'bg-red-200 text-red-800'
                                    }`}>
                                      {report.verifications?.reject || 0}
                                    </span>
                                  </button>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-4 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-xl transition-all duration-300 ${
                            currentPage === page
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Results Info */}
                <div className="text-center text-sm text-gray-600 mt-4">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalReports)} of {totalReports} reports
                </div>
              </>
            );
          })()}

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reports Found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more reports.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernReportsPage;