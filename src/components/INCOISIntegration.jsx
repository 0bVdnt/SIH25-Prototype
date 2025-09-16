import React, { useState, useEffect } from 'react';
import { Activity, Waves, TrendingUp, AlertTriangle, MapPin, Calendar, Thermometer, Wind } from 'lucide-react';

const INCOISIntegration = () => {
  const [forecastData, setForecastData] = useState({
    tsunami: {
      riskLevel: 'low',
      lastUpdate: new Date(),
      areas: [
        { location: 'Mumbai Coast', risk: 'low', confidence: 0.85 },
        { location: 'Chennai Coast', risk: 'medium', confidence: 0.72 },
        { location: 'Kochi Coast', risk: 'low', confidence: 0.91 }
      ]
    },
    surge: {
      predictions: [
        { location: 'Mumbai', height: '2.1m', time: '14:30', risk: 'medium' },
        { location: 'Chennai', height: '1.8m', time: '15:45', risk: 'low' },
        { location: 'Visakhapatnam', height: '2.4m', time: '16:20', risk: 'high' }
      ],
      lastUpdate: new Date()
    },
    waves: {
      conditions: [
        { location: 'Arabian Sea (West)', height: '3.2m', direction: 'SW', period: '8s' },
        { location: 'Bay of Bengal (East)', height: '2.8m', direction: 'SE', period: '7s' },
        { location: 'Indian Ocean (South)', height: '4.1m', direction: 'S', period: '9s' }
      ],
      lastUpdate: new Date()
    }
  });

  const [validationResults, setValidationResults] = useState([
    {
      id: 1,
      reportLocation: 'Mumbai Marine Drive',
      reportType: 'High Tide',
      reportTime: new Date(Date.now() - 30 * 60 * 1000),
      incoisPrediction: 'High surge (2.1m) predicted at 14:30',
      correlation: 0.92,
      status: 'validated',
      confidence: 'high'
    },
    {
      id: 2,
      reportLocation: 'Chennai Marina',
      reportType: 'Oil Spill',
      reportTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      incoisPrediction: 'No related ocean conditions',
      correlation: 0.15,
      status: 'independent',
      confidence: 'low'
    },
    {
      id: 3,
      reportLocation: 'Goa Calangute Beach',
      reportType: 'Strong Currents',
      reportTime: new Date(Date.now() - 45 * 60 * 1000),
      incoisPrediction: 'High wave activity (3.5m) in Arabian Sea',
      correlation: 0.78,
      status: 'validated',
      confidence: 'medium'
    }
  ]);

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setForecastData(prev => ({
        ...prev,
        tsunami: {
          ...prev.tsunami,
          lastUpdate: new Date()
        },
        surge: {
          ...prev.surge,
          lastUpdate: new Date()
        },
        waves: {
          ...prev.waves,
          lastUpdate: new Date()
        }
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getCorrelationColor = (correlation) => {
    if (correlation >= 0.8) return 'text-green-600 bg-green-100';
    if (correlation >= 0.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getValidationStatus = (status) => {
    switch (status) {
      case 'validated': return 'text-green-600 bg-green-100';
      case 'conflicting': return 'text-red-600 bg-red-100';
      case 'independent': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">INCOIS Data Integration</h2>
          <p className="text-gray-600">Real-time ocean forecasts and validation with crowdsourced reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Activity className="h-4 w-4 text-green-500 animate-pulse" />
            <span className="text-sm text-green-600 font-medium">Live Feed</span>
          </div>
          <span className="text-sm text-gray-500">
            Last sync: {forecastData.tsunami.lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Forecast Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tsunami Risk */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Waves className="h-5 w-5 mr-2 text-blue-600" />
              Tsunami Risk
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(forecastData.tsunami.riskLevel)}`}>
              {forecastData.tsunami.riskLevel.toUpperCase()}
            </span>
          </div>
          
          <div className="space-y-3">
            {forecastData.tsunami.areas.map((area, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{area.location}</div>
                  <div className="text-xs text-gray-500">Confidence: {Math.round(area.confidence * 100)}%</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(area.risk)}`}>
                  {area.risk}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Storm Surge */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
              Storm Surge
            </h3>
            <span className="text-sm text-gray-500">Next 6 hours</span>
          </div>
          
          <div className="space-y-3">
            {forecastData.surge.predictions.map((prediction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{prediction.location}</div>
                  <div className="text-xs text-gray-500">at {prediction.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{prediction.height}</div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(prediction.risk)}`}>
                    {prediction.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave Conditions */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Wind className="h-5 w-5 mr-2 text-cyan-600" />
              Wave Conditions
            </h3>
            <span className="text-sm text-gray-500">Current</span>
          </div>
          
          <div className="space-y-3">
            {forecastData.waves.conditions.map((condition, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-sm mb-1">{condition.location}</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Height:</span>
                    <div className="font-bold">{condition.height}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Direction:</span>
                    <div className="font-bold">{condition.direction}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Period:</span>
                    <div className="font-bold">{condition.period}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Validation Results */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-purple-600" />
          Report Validation with INCOIS Data
        </h3>
        
        <div className="space-y-4">
          {validationResults.map(result => (
            <div key={result.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold">{result.reportType} Report</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getValidationStatus(result.status)}`}>
                      {result.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{result.reportLocation}</span>
                    <span>•</span>
                    <Calendar className="h-3 w-3" />
                    <span>{result.reportTime.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Correlation</div>
                  <span className={`px-2 py-1 rounded text-sm font-bold ${getCorrelationColor(result.correlation)}`}>
                    {Math.round(result.correlation * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Citizen Report</div>
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    {result.reportType} reported at {result.reportLocation}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">INCOIS Forecast</div>
                  <div className="text-sm text-gray-600 bg-purple-50 p-3 rounded">
                    {result.incoisPrediction}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Validation confidence: {result.confidence}
                </span>
                <div className="flex space-x-2">
                  {result.status === 'validated' && (
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                      Boost Priority
                    </button>
                  )}
                  {result.status === 'conflicting' && (
                    <button className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors">
                      Manual Review
                    </button>
                  )}
                  <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Settings */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Integration Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Data Sources</h4>
            <div className="space-y-2">
              {[
                { name: 'INCOIS Tsunami Bulletins', enabled: true, status: 'Connected' },
                { name: 'Wave Height Forecasts', enabled: true, status: 'Connected' },
                { name: 'Storm Surge Models', enabled: true, status: 'Connected' },
                { name: 'Ocean Current Data', enabled: false, status: 'Disabled' }
              ].map((source, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{source.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      source.status === 'Connected' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {source.status}
                    </span>
                    <input
                      type="checkbox"
                      checked={source.enabled}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      readOnly
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Validation Thresholds</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  High Correlation Threshold: 80%
                </label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value="80"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Auto-validate threshold: 90%
                </label>
                <input
                  type="range"
                  min="70"
                  max="100"
                  value="90"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default INCOISIntegration;