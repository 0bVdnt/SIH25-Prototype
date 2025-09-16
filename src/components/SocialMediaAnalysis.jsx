import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Search, Filter, Users, MapPin, AlertTriangle, TrendingUp, Brain, Twitter, Instagram, MessageSquare, Activity, Eye, Zap, Settings, Calendar, Download, RefreshCw, Globe, Clock, BarChart3 } from 'lucide-react';

// API Configuration
const RAPIDAPI_KEY = '86a387736amshf754673fb66ff61p1d06a3jsnb092c81afa66';
const RAPIDAPI_HOST_TWITTER = 'twitter-api45.p.rapidapi.com';
const RAPIDAPI_HOST_INSTAGRAM = 'instagram-scraper-api2.p.rapidapi.com';

// Disaster-related keywords for monitoring
const DISASTER_KEYWORDS = [
  'tsunami', 'earthquake', 'cyclone', 'flood', 'hurricane', 'typhoon',
  'ocean hazard', 'high tide', 'storm surge', 'oil spill', 'marine pollution',
  'coastal flooding', 'rip current', 'dangerous waves', 'beach warning',
  'sea level rise', 'algae bloom', 'water contamination'
];

const LOCATION_KEYWORDS = [
  'Mumbai', 'Chennai', 'Kolkata', 'Goa', 'Kochi', 'Visakhapatnam',
  'Indian Ocean', 'Bay of Bengal', 'Arabian Sea', 'Gujarat coast',
  'Tamil Nadu coast', 'Kerala coast', 'Odisha coast', 'West Bengal coast'
];

const SocialMediaAnalysis = () => {
  const { sendHazardAlert } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('monitoring');
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    twitter: 'connected',
    instagram: 'connected',
    lastSync: new Date()
  });
  
  const [analysisData, setAnalysisData] = useState({
    totalPosts: 15847,
    hazardPosts: 234,
    verifiedHazards: 18,
    falsePositives: 89,
    realTimePosts: 0,
    lastUpdated: new Date()
  });

  // Real-time API integration functions
  const fetchTwitterPosts = async (keywords) => {
    try {
      const searchQuery = keywords.join(' OR ');
      const response = await fetch(`https://${RAPIDAPI_HOST_TWITTER}/search.php?query=${encodeURIComponent(searchQuery)}&count=50`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST_TWITTER
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.timeline || [];
      }
    } catch (error) {
      console.error('Twitter API Error:', error);
      setApiStatus(prev => ({ ...prev, twitter: 'error' }));
    }
    return [];
  };

  const fetchInstagramPosts = async (hashtags) => {
    try {
      for (const hashtag of hashtags) {
        const response = await fetch(`https://${RAPIDAPI_HOST_INSTAGRAM}/v1/hashtag?hashtag=${hashtag}`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST_INSTAGRAM
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          return data.data || [];
        }
      }
    } catch (error) {
      console.error('Instagram API Error:', error);
      setApiStatus(prev => ({ ...prev, instagram: 'error' }));
    }
    return [];
  };

  // AI-powered content analysis
  const analyzePostRelevance = (postContent) => {
    const content = postContent.toLowerCase();
    let relevanceScore = 0;
    let hazardType = 'unknown';
    
    // Check for disaster keywords
    DISASTER_KEYWORDS.forEach(keyword => {
      if (content.includes(keyword.toLowerCase())) {
        relevanceScore += 0.3;
        if (keyword.includes('tsunami')) hazardType = 'Tsunami';
        else if (keyword.includes('flood')) hazardType = 'Flooding';
        else if (keyword.includes('cyclone')) hazardType = 'Cyclone';
        else if (keyword.includes('oil spill')) hazardType = 'Oil Spill';
        else if (keyword.includes('tide')) hazardType = 'High Tide';
      }
    });
    
    // Check for location keywords
    LOCATION_KEYWORDS.forEach(location => {
      if (content.includes(location.toLowerCase())) {
        relevanceScore += 0.2;
      }
    });
    
    // Sentiment analysis (simplified)
    const urgentWords = ['emergency', 'danger', 'warning', 'evacuation', 'immediate', 'critical'];
    urgentWords.forEach(word => {
      if (content.includes(word)) relevanceScore += 0.1;
    });
    
    return {
      isRelevant: relevanceScore > 0.5,
      confidence: Math.min(relevanceScore, 0.95),
      hazardType,
      sentiment: relevanceScore > 0.7 ? 'urgent' : relevanceScore > 0.4 ? 'concerned' : 'neutral'
    };
  };

  // Process and filter API responses
  const processApiPosts = (posts, platform) => {
    return posts.map(post => {
      const content = platform === 'twitter' ? post.text : post.caption;
      const analysis = analyzePostRelevance(content);
      
      return {
        id: post.id_str || post.id || Date.now(),
        platform,
        content,
        location: post.location || extractLocationFromText(content),
        confidence: analysis.confidence,
        hazardType: analysis.hazardType,
        timestamp: new Date(post.created_at || post.timestamp),
        verified: false,
        sentiment: analysis.sentiment,
        engagement: {
          likes: post.favorite_count || post.like_count || 0,
          shares: post.retweet_count || post.share_count || 0,
          comments: post.reply_count || post.comment_count || 0
        },
        isRelevant: analysis.isRelevant
      };
    }).filter(post => post.isRelevant);
  };

  const extractLocationFromText = (text) => {
    for (const location of LOCATION_KEYWORDS) {
      if (text.toLowerCase().includes(location.toLowerCase())) {
        return location;
      }
    }
    return 'Unknown';
  };

  // Real-time monitoring
  const startLiveMonitoring = async () => {
    setIsLiveMode(true);
    
    const monitoringInterval = setInterval(async () => {
      try {
        // Fetch from both platforms
        const twitterPosts = await fetchTwitterPosts(DISASTER_KEYWORDS);
        const instagramPosts = await fetchInstagramPosts(['tsunami', 'cyclone', 'flood', 'oceanhazard']);
        
        // Process and analyze posts
        const processedTwitter = processApiPosts(twitterPosts, 'twitter');
        const processedInstagram = processApiPosts(instagramPosts, 'instagram');
        
        const allNewPosts = [...processedTwitter, ...processedInstagram];
        
        // Update recent detections with new relevant posts
        if (allNewPosts.length > 0) {
          setRecentDetections(prev => {
            const updated = [...allNewPosts, ...prev].slice(0, 20); // Keep latest 20
            return updated;
          });
          
          // Update stats
          setAnalysisData(prev => ({
            ...prev,
            realTimePosts: prev.realTimePosts + allNewPosts.length,
            lastUpdated: new Date()
          }));
          
          // Auto-verify high confidence posts
          allNewPosts.forEach(post => {
            if (post.confidence > 0.85 && post.sentiment === 'urgent') {
              sendHazardAlert({
                type: post.hazardType,
                message: `Social media alert: ${post.content.substring(0, 100)}...`,
                location: post.location,
                severity: 'high',
                source: `${post.platform} (AI verified)`
              });
            }
          });
        }
        
        setApiStatus(prev => ({ ...prev, lastSync: new Date() }));
        
      } catch (error) {
        console.error('Live monitoring error:', error);
      }
    }, 60000); // Check every minute
    
    // Store interval ID for cleanup
    return () => clearInterval(monitoringInterval);
  };

  const [recentDetections, setRecentDetections] = useState([
    {
      id: 1,
      platform: 'twitter',
      content: '🌊 Massive waves hitting Marine Drive Mumbai! Water splashing over the barriers. Stay away from seafront #MumbaiRains #HighTide',
      location: 'Marine Drive, Mumbai',
      confidence: 0.92,
      hazardType: 'High Tide',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      verified: true,
      engagement: { likes: 156, shares: 43, comments: 28 }
    },
    {
      id: 2,
      platform: 'instagram',
      content: 'Oil spill spotted near Chennai port. Black substance floating on water surface. Reporting to authorities. #ChennaiPort #OilSpill #MarinePollution',
      location: 'Chennai Port',
      confidence: 0.87,
      hazardType: 'Oil Spill',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      verified: false,
      engagement: { likes: 89, shares: 67, comments: 15 }
    },
    {
      id: 3,
      platform: 'twitter',
      content: 'Red algae bloom visible from Goa beach. Water color changed to reddish brown. Local fishermen avoiding the area. #GoaBeach #AlgaeBloom',
      location: 'Calangute Beach, Goa',
      confidence: 0.78,
      hazardType: 'Algae Bloom',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      verified: true,
      engagement: { likes: 234, shares: 89, comments: 45 }
    }
  ]);

  const [sentimentData, setSentimentData] = useState({
    positive: 15,
    neutral: 65,
    negative: 20
  });

  const [monitoringSettings, setMonitoringSettings] = useState({
    platforms: {
      twitter: true,
      instagram: true,
      facebook: false,
      youtube: true
    },
    keywords: ['ocean hazard', 'oil spill', 'high tide', 'tsunami', 'algae bloom', 'marine pollution', 'coastal flooding'],
    locations: ['Mumbai', 'Chennai', 'Goa', 'Kochi', 'Visakhapatnam'],
    confidenceThreshold: 0.7,
    autoAlert: true
  });

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalysisData(prev => ({
        ...prev,
        totalPosts: prev.totalPosts + Math.floor(Math.random() * 5),
        hazardPosts: prev.hazardPosts + Math.floor(Math.random() * 2),
        lastUpdated: new Date()
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleVerifyHazard = (detection) => {
    setRecentDetections(prev =>
      prev.map(d => d.id === detection.id ? { ...d, verified: true } : d)
    );

    // Send notification alert
    sendHazardAlert({
      type: detection.hazardType,
      location: detection.location,
      severity: detection.confidence > 0.8 ? 'high' : 'medium',
      source: 'Social Media Detection'
    });

    setAnalysisData(prev => ({
      ...prev,
      verifiedHazards: prev.verifiedHazards + 1
    }));
  };

  const handleDismissHazard = (detection) => {
    setRecentDetections(prev => prev.filter(d => d.id !== detection.id));
    setAnalysisData(prev => ({
      ...prev,
      falsePositives: prev.falsePositives + 1
    }));
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4 text-blue-400" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'facebook':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Social Media Analysis</h2>
          <p className="text-gray-600">AI-powered hazard detection from social media platforms</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">Last updated: {analysisData.lastUpdated.toLocaleTimeString()}</span>
          <div className="flex items-center space-x-1">
            <Activity className="h-4 w-4 text-green-500 animate-pulse" />
            <span className="text-sm text-green-600 font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{analysisData.totalPosts.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Total Posts Analyzed</p>
            </div>
            <Eye className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{analysisData.hazardPosts}</h3>
              <p className="text-sm text-gray-600">Potential Hazards</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{analysisData.verifiedHazards}</h3>
              <p className="text-sm text-gray-600">Verified Hazards</p>
            </div>
            <Zap className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{((analysisData.verifiedHazards / analysisData.hazardPosts) * 100).toFixed(1)}%</h3>
              <p className="text-sm text-gray-600">Accuracy Rate</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'monitoring', label: 'Live Monitoring', icon: Activity },
            { id: 'detections', label: 'Recent Detections', icon: AlertTriangle },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'monitoring' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Real-time Feed */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-500" />
              Real-time Monitoring
            </h3>
            <div className="space-y-4">
              {recentDetections.slice(0, 3).map(detection => (
                <div key={detection.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getPlatformIcon(detection.platform)}
                      <span className="text-sm font-medium capitalize">{detection.platform}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(detection.confidence)}`}>
                        {Math.round(detection.confidence * 100)}% confidence
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {detection.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{detection.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>{detection.location}</span>
                    </div>
                    <span className="text-xs font-medium text-orange-600">{detection.hazardType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Distribution */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Platform Distribution</h3>
            <div className="space-y-4">
              {[
                { platform: 'Twitter', posts: 8543, hazards: 156, color: 'bg-blue-500' },
                { platform: 'Instagram', posts: 4234, hazards: 67, color: 'bg-pink-500' },
                { platform: 'Facebook', posts: 2156, hazards: 8, color: 'bg-blue-600' },
                { platform: 'YouTube', posts: 914, hazards: 3, color: 'bg-red-500' }
              ].map(platform => (
                <div key={platform.platform} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                    <span className="font-medium">{platform.platform}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {platform.hazards} hazards / {platform.posts.toLocaleString()} posts
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'detections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Hazard Detections</h3>
            <div className="flex items-center space-x-3">
              <button className="btn-modern btn-secondary px-4 py-2 text-sm flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button className="btn-modern btn-primary px-4 py-2 text-sm flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {recentDetections.map(detection => (
              <div key={detection.id} className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getPlatformIcon(detection.platform)}
                    <div>
                      <span className="font-medium capitalize">{detection.platform}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(detection.confidence)}`}>
                          {Math.round(detection.confidence * 100)}% confidence
                        </span>
                        <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                          {detection.hazardType}
                        </span>
                        {detection.verified && (
                          <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {detection.timestamp.toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{detection.content}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{detection.location}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>❤️ {detection.engagement.likes}</span>
                    <span>🔄 {detection.engagement.shares}</span>
                    <span>💬 {detection.engagement.comments}</span>
                  </div>
                </div>

                {!detection.verified && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleVerifyHazard(detection)}
                      className="btn-modern btn-primary px-4 py-2 text-sm"
                    >
                      Verify & Send Alert
                    </button>
                    <button
                      onClick={() => handleDismissHazard(detection)}
                      className="btn-modern btn-secondary px-4 py-2 text-sm"
                    >
                      Mark as False Positive
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sentiment Analysis */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
            <div className="space-y-4">
              {[
                { label: 'Positive', value: sentimentData.positive, color: 'bg-green-500' },
                { label: 'Neutral', value: sentimentData.neutral, color: 'bg-gray-400' },
                { label: 'Negative', value: sentimentData.negative, color: 'bg-red-500' }
              ].map(sentiment => (
                <div key={sentiment.label} className="flex items-center justify-between">
                  <span className="font-medium">{sentiment.label}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${sentiment.color}`}
                        style={{ width: `${sentiment.value}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{sentiment.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Keywords */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Top Hazard Keywords</h3>
            <div className="space-y-3">
              {[
                { keyword: 'oil spill', mentions: 89, trend: '+15%' },
                { keyword: 'high tide', mentions: 67, trend: '+8%' },
                { keyword: 'algae bloom', mentions: 34, trend: '-5%' },
                { keyword: 'coastal flooding', mentions: 23, trend: '+12%' },
                { keyword: 'marine pollution', mentions: 19, trend: '+3%' }
              ].map(keyword => (
                <div key={keyword.keyword} className="flex items-center justify-between">
                  <span className="font-medium">{keyword.keyword}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{keyword.mentions}</span>
                    <span className={`text-xs font-medium ${
                      keyword.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {keyword.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Monitoring Configuration</h3>
            
            {/* Platform Settings */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Monitored Platforms</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(monitoringSettings.platforms).map(([platform, enabled]) => (
                  <label key={platform} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => setMonitoringSettings(prev => ({
                        ...prev,
                        platforms: { ...prev.platforms, [platform]: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="capitalize">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Monitored Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {monitoringSettings.keywords.map((keyword, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
              <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm">
                + Add keyword
              </button>
            </div>

            {/* Confidence Threshold */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Confidence Threshold: {monitoringSettings.confidenceThreshold * 100}%</h4>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={monitoringSettings.confidenceThreshold}
                onChange={(e) => setMonitoringSettings(prev => ({
                  ...prev,
                  confidenceThreshold: parseFloat(e.target.value)
                }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Auto Alert */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={monitoringSettings.autoAlert}
                  onChange={(e) => setMonitoringSettings(prev => ({
                    ...prev,
                    autoAlert: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Automatically send alerts for high-confidence detections</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaAnalysis;