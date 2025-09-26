import React, { useState, useRef, useEffect } from 'react';
import { showToast } from '../utils/toast';
import { 
  Shield, Bell, TrendingUp, BarChart3, MapPin, AlertTriangle, 
  Clock, Activity, Brain, Zap, Waves, Eye, Users, Filter,
  Download, ChevronDown, ChevronRight, X, Play, Pause,
  Layers, Settings, Calendar, Globe, Target, Search, List,
  MessageSquare, Hash, ThumbsUp, ThumbsDown, Gauge
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, ScatterChart, Scatter,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { ResponsivePie } from '@nivo/pie';
import { mockReports } from '../mockData';
import SocialMediaAnalysis from '../components/SocialMediaAnalysis';
import ClusterAlertSystem from '../components/ClusterAlertSystem';
import INCOISIntegration from '../components/INCOISIntegration';

// Custom Radial Progress Component
const RadialProgress = ({ value, max, color, label, size = 120 }) => {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Spiral Chart for Hazard Distribution
const SpiralHazardChart = ({ data }) => {
  return (
    <div className="relative h-80 flex items-center justify-center">
      <svg width="300" height="300" viewBox="0 0 300 300" className="overflow-visible">
        {data.map((item, index) => {
          const angle = (index / data.length) * 2 * Math.PI;
          const radius = 80 + (item.count * 2);
          const x = 150 + Math.cos(angle) * radius;
          const y = 150 + Math.sin(angle) * radius;
          const size = Math.max(20, item.count * 3);
          
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r={size}
                fill={item.color}
                opacity="0.7"
                className="animate-pulse hover:opacity-100 transition-all duration-300 cursor-pointer"
              />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                className="fill-white text-xs font-bold pointer-events-none"
              >
                {item.count}
              </text>
              <text
                x={x}
                y={y + size + 15}
                textAnchor="middle"
                className="fill-gray-700 text-xs font-medium"
              >
                {item.type}
              </text>
            </g>
          );
        })}
        <circle
          cx="150"
          cy="150"
          r="30"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2"
          strokeDasharray="5,5"
          className="opacity-50"
        />
      </svg>
    </div>
  );
};

// Organic Flow Chart for Status Distribution
const OrganicFlowChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div className="relative h-80">
      <svg width="100%" height="100%" viewBox="0 0 400 300" className="overflow-visible">
        {data.map((item, index) => {
          const percentage = (item.count / total) * 100;
          const width = Math.max(60, percentage * 3);
          const height = 40 + (percentage * 2);
          const x = 50 + (index * 120);
          const y = 150 - (height / 2);
          
          return (
            <g key={index}>
              <path
                d={`M${x},${y + height} Q${x + width/2},${y - 20} ${x + width},${y + height} Q${x + width/2},${y + height + 20} ${x},${y + height} Z`}
                fill={item.color}
                opacity="0.8"
                className="hover:opacity-100 transition-all duration-500 cursor-pointer"
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                }}
              />
              <text
                x={x + width/2}
                y={y + height/2}
                textAnchor="middle"
                className="fill-white text-sm font-bold pointer-events-none"
              >
                {item.count}
              </text>
              <text
                x={x + width/2}
                y={y + height + 30}
                textAnchor="middle"
                className="fill-gray-700 text-xs font-medium"
              >
                {item.status}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Wave Timeline Chart
const WaveTimelineChart = ({ data }) => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="verifiedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area
            type="monotone"
            dataKey="reports"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#waveGradient)"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="verified"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#verifiedGradient)"
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Radar Chart for Severity Analysis
const SeverityRadarChart = ({ data }) => {
  const radarData = [
    { subject: 'Coastal Areas', high: 12, medium: 8, low: 4 },
    { subject: 'Urban Zones', high: 8, medium: 15, low: 12 },
    { subject: 'Rural Areas', high: 5, medium: 10, low: 18 },
    { subject: 'Industrial', high: 15, medium: 6, low: 2 },
    { subject: 'Tourist Areas', high: 10, medium: 12, low: 8 },
    { subject: 'Fishing Zones', high: 18, medium: 5, low: 3 }
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 20]}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
          />
          <Radar
            name="High Risk"
            dataKey="high"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Medium Risk"
            dataKey="medium"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name="Low Risk"
            dataKey="low"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Bubble Chart Component
const BubbleChart = ({ data }) => {
  return (
    <div className="relative h-64 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100">
      {data.map((item, index) => {
        const size = Math.max(20, item.value * 2);
        const left = Math.random() * 70 + 10;
        const top = Math.random() * 60 + 20;
        
        return (
          <div
            key={index}
            className="absolute rounded-full flex items-center justify-center text-white font-bold text-xs animate-pulse"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              backgroundColor: item.color,
              animation: `float ${2 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            {item.value}
          </div>
        );
      })}
    </div>
  );
};

// Heatmap Component
const Heatmap = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="grid grid-cols-7 gap-1 p-4">
      {data.map((cell, index) => {
        const intensity = cell.value / maxValue;
        const opacity = 0.2 + intensity * 0.8;
        
        return (
          <div
            key={index}
            className="aspect-square rounded-md flex items-center justify-center text-xs font-medium text-white relative group cursor-pointer"
            style={{
              backgroundColor: `rgba(239, 68, 68, ${opacity})`,
            }}
          >
            <span>{cell.value}</span>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {cell.label}: {cell.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// GIS Risk Map Component with Alert Dialog on Left
const GISRiskMap = ({ selectedLayers, onLayerToggle, alerts, onAlertClick, timeSlider }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [zoom, setZoom] = useState(5);
  const [alertsExpanded, setAlertsExpanded] = useState(true);

  const hazardLayers = [
    { id: 'tsunami', name: 'Tsunamis', color: '#ef4444', active: selectedLayers.includes('tsunami') },
    { id: 'storm', name: 'Storm Surges', color: '#3b82f6', active: selectedLayers.includes('storm') },
    { id: 'erosion', name: 'Coastal Erosion', color: '#f97316', active: selectedLayers.includes('erosion') },
    { id: 'sealevel', name: 'Sea Level Rise', color: '#8b5cf6', active: selectedLayers.includes('sealevel') },
    { id: 'cyclone', name: 'Cyclones', color: '#10b981', active: selectedLayers.includes('cyclone') }
  ];

  const riskZones = [
    { id: 1, name: 'Mumbai Coast', lat: 19.0760, lng: 72.8777, risk: 'high', population: '20M+', infrastructure: 'Critical' },
    { id: 2, name: 'Chennai Coast', lat: 13.0827, lng: 80.2707, risk: 'medium', population: '10M+', infrastructure: 'Major' },
    { id: 3, name: 'Kolkata Coast', lat: 22.5726, lng: 88.3639, risk: 'medium', population: '15M+', infrastructure: 'Major' },
    { id: 4, name: 'Kochi Coast', lat: 9.9312, lng: 76.2673, risk: 'low', population: '2M+', infrastructure: 'Minor' },
    { id: 5, name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, risk: 'high', population: '5M+', infrastructure: 'Critical' }
  ];

  const handleAlertClick = (alert) => {
    setMapCenter({ lat: alert.coordinates.lat, lng: alert.coordinates.lng });
    onAlertClick(alert);
    showToast.info(`🎯 Map centered on ${alert.location}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Interactive GIS Ocean Risk Map</h3>
            <p className="text-blue-100 text-sm">Real-time multi-hazard coastal visualization</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs bg-white/20 px-2 py-1 rounded">
              Zoom: {zoom}x | Center: {mapCenter.lat.toFixed(2)}, {mapCenter.lng.toFixed(2)}
            </div>
            <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm transition-all">
              <Download className="h-4 w-4 inline mr-1" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-96">
        {/* Alert Dialog Panel - Left Side */}
        <div className={`${alertsExpanded ? 'w-80' : 'w-16'} border-r bg-gray-50 transition-all duration-300`}>
          <div className="p-4 border-b bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <div className="flex items-center justify-between">
              {alertsExpanded && (
                <div>
                  <h4 className="font-bold">Live Alert Center</h4>
                  <p className="text-red-100 text-xs">{alerts.length} active alerts</p>
                </div>
              )}
              <button
                onClick={() => setAlertsExpanded(!alertsExpanded)}
                className="bg-white/20 hover:bg-white/30 p-1 rounded transition-all"
              >
                {alertsExpanded ? <ChevronDown className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {alertsExpanded ? (
            <div className="h-full overflow-y-auto pb-16">
              {alerts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No active alerts</p>
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {alerts.map((alert, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl hover:bg-white cursor-pointer transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-md group"
                      onClick={() => handleAlertClick(alert)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-2 animate-pulse ${
                          alert.severity === 'high' ? 'bg-red-500' :
                          alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-sm text-gray-900 truncate group-hover:text-blue-600">
                            {alert.title}
                          </h5>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {alert.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {alert.location}
                            </span>
                            <span className="text-xs text-gray-400">{alert.time}</span>
                          </div>
                          <div className={`text-xs font-medium mt-1 ${
                            alert.severity === 'high' ? 'text-red-600' :
                            alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                          }`}>
                            {alert.severity.toUpperCase()} PRIORITY
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center">
              <Bell className={`h-6 w-6 mx-auto ${alerts.length > 0 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
              <div className="text-xs font-bold text-red-600 mt-1">{alerts.length}</div>
            </div>
          )}
        </div>

        {/* Map Area - Right Side */}
        <div className="flex-1 relative">
          {/* Enhanced Simulated Map */}
          <div className="h-full bg-gradient-to-br from-blue-200 via-green-100 to-blue-300 relative overflow-hidden">
            {/* Coastline and Geographic Features */}
            <div className="absolute inset-0">
              <svg width="100%" height="100%" className="absolute inset-0">
                {/* Enhanced India Coastline */}
                <path
                  d="M50,50 Q200,60 300,120 Q350,200 320,280 Q250,320 180,300 Q120,250 80,200 Q60,150 50,50 Z"
                  fill="#e0f2fe"
                  stroke="#0369a1"
                  strokeWidth="2"
                  className="opacity-60"
                />
                {/* Additional coastline details */}
                <path
                  d="M100,100 Q180,90 250,150 Q280,200 260,250"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="1"
                  className="opacity-40"
                />
              </svg>
            </div>

            {/* Infrastructure Zones */}
            {riskZones.map(zone => (
              <div key={zone.id}>
                {/* Infrastructure Highlight */}
                {zone.infrastructure === 'Critical' && (
                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 opacity-30"
                    style={{
                      left: `${((zone.lng - 68) / 20) * 100}%`,
                      top: `${((28 - zone.lat) / 18) * 100}%`,
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#fbbf24',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                )}
                
                {/* Risk Zone Marker */}
                <div
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group`}
                  style={{
                    left: `${((zone.lng - 68) / 20) * 100}%`,
                    top: `${((28 - zone.lat) / 18) * 100}%`
                  }}
                  onClick={() => setMapCenter({ lat: zone.lat, lng: zone.lng })}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 border-white shadow-lg hover:scale-125 transition-all duration-300 ${
                      zone.risk === 'high' ? 'bg-red-500 animate-pulse' :
                      zone.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                  />
                  
                  {/* Enhanced Tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-20 border">
                    <div className="font-semibold text-sm text-gray-900">{zone.name}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Population: <span className="font-medium">{zone.population}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Infrastructure: <span className="font-medium">{zone.infrastructure}</span>
                    </div>
                    <div className={`text-xs font-bold mt-2 ${
                      zone.risk === 'high' ? 'text-red-600' :
                      zone.risk === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      Risk Level: {zone.risk.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Enhanced Hazard Layer Overlays */}
            {selectedLayers.includes('tsunami') && (
              <div className="absolute inset-0 bg-red-500 opacity-25 animate-pulse" style={{
                background: 'radial-gradient(circle at 60% 70%, rgba(239, 68, 68, 0.3) 0%, transparent 70%)'
              }}></div>
            )}
            {selectedLayers.includes('storm') && (
              <div className="absolute top-0 left-0 w-full h-1/2 opacity-20" style={{
                background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.4) 0%, transparent 100%)'
              }}></div>
            )}
            {selectedLayers.includes('erosion') && (
              <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-25" style={{
                background: 'linear-gradient(0deg, rgba(249, 115, 22, 0.4) 0%, transparent 100%)'
              }}></div>
            )}
            {selectedLayers.includes('sealevel') && (
              <div className="absolute inset-0 bg-purple-500 opacity-15" style={{
                background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.2) 0%, transparent 50%, rgba(139, 92, 246, 0.2) 100%)'
              }}></div>
            )}
            {selectedLayers.includes('cyclone') && (
              <div className="absolute top-1/4 right-1/4 w-1/2 h-1/2 opacity-20 rounded-full animate-spin" style={{
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
                animationDuration: '10s'
              }}></div>
            )}

            {/* Enhanced Map Controls */}
            <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg border">
              <button
                onClick={() => setZoom(Math.min(zoom + 1, 10))}
                className="block w-10 h-10 text-center hover:bg-gray-100 border-b text-lg font-bold text-gray-600 hover:text-blue-600 transition-all"
              >
                +
              </button>
              <button
                onClick={() => setZoom(Math.max(zoom - 1, 1))}
                className="block w-10 h-10 text-center hover:bg-gray-100 text-lg font-bold text-gray-600 hover:text-blue-600 transition-all"
              >
                −
              </button>
            </div>

            {/* Layer Legend */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border">
              <h5 className="font-semibold text-sm text-gray-900 mb-2">Active Layers</h5>
              <div className="space-y-1">
                {hazardLayers.filter(layer => layer.active).map(layer => (
                  <div key={layer.id} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span className="text-xs text-gray-700">{layer.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Time Slider */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border">
              <div className="flex items-center space-x-4">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>Timeline Analysis</span>
                    <span>Day {timeSlider}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={timeSlider}
                    onChange={(e) => onLayerToggle('timeSlider', parseInt(e.target.value))}
                    className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>30 days ago</span>
                    <span>15 days ago</span>
                    <span>Today</span>
                  </div>
                </div>
                <button className="bg-blue-100 hover:bg-blue-200 p-2 rounded-lg transition-all">
                  <Play className="h-4 w-4 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Alert Dialog Component
const AlertDialog = ({ alerts, onAlertClick, isCollapsed, onToggleCollapse }) => {
  return (
    <div className={`fixed right-4 top-24 bg-white rounded-2xl shadow-2xl border transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-2xl">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h3 className="font-bold">Live Alerts</h3>
              <p className="text-red-100 text-xs">Real-time hazard notifications</p>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Alert List */}
      {!isCollapsed && (
        <div className="max-h-96 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No active alerts</p>
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-gray-100 hover:border-gray-200"
                  onClick={() => onAlertClick(alert)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-2 animate-pulse ${
                      alert.severity === 'high' ? 'bg-red-500' :
                      alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {alert.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{alert.location}</span>
                        <span className="text-xs text-gray-400">{alert.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isCollapsed && (
        <div className="p-4 text-center">
          <Bell className="h-6 w-6 mx-auto text-red-500 animate-pulse" />
          <div className="text-xs font-bold text-red-600 mt-1">{alerts.length}</div>
        </div>
      )}
    </div>
  );
};

const ModernAdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedLayers, setSelectedLayers] = useState(['tsunami', 'storm']);
  const [alertsCollapsed, setAlertsCollapsed] = useState(false);
  const [timeSlider, setTimeSlider] = useState(0);
  const [animationPlaying, setAnimationPlaying] = useState(false);

  // Mock data
  const reports = mockReports;
  
  // Enhanced chart data
  const hazardDistributionData = [
    { name: 'Jan', value: 12 },
    { name: 'Feb', value: 18 },
    { name: 'Mar', value: 25 },
    { name: 'Apr', value: 8 },
    { name: 'May', value: 15 },
    { name: 'Jun', value: 22 },
    { name: 'Jul', value: 28 },
    { name: 'Aug', value: 32 }
  ];

  const statusDistributionData = [
    { status: 'Verified', count: 45, color: '#10b981' },
    { status: 'Pending', count: 23, color: '#f59e0b' },
    { status: 'False Alarm', count: 8, color: '#ef4444' }
  ];

  const timelineData = [
    { date: 'Oct 20', reports: 12, verified: 8, trend: 'up' },
    { date: 'Oct 21', reports: 18, verified: 14, trend: 'up' },
    { date: 'Oct 22', reports: 15, verified: 12, trend: 'down' },
    { date: 'Oct 23', reports: 22, verified: 18, trend: 'up' },
    { date: 'Oct 24', reports: 28, verified: 24, trend: 'up' },
    { date: 'Oct 25', reports: 35, verified: 30, trend: 'up' },
    { date: 'Oct 26', reports: 31, verified: 28, trend: 'stable' }
  ];
  
  const liveAlerts = [
    {
      id: 1,
      title: "High Tide Warning - Mumbai",
      description: "Unusually high tide levels detected approaching Mumbai coastline",
      severity: "high",
      location: "Mumbai Coast",
      time: "2 min ago",
      coordinates: { lat: 19.0760, lng: 72.8777 }
    },
    {
      id: 2,
      title: "Cyclone Formation - Bay of Bengal",
      description: "Low pressure system developing into potential cyclone",
      severity: "medium",
      location: "Bay of Bengal",
      time: "15 min ago",
      coordinates: { lat: 15.0, lng: 85.0 }
    },
    {
      id: 3,
      title: "Coastal Erosion Alert - Kerala",
      description: "Accelerated erosion reported along Kochi coastline",
      severity: "medium",
      location: "Kochi",
      time: "1 hour ago",
      coordinates: { lat: 9.9312, lng: 76.2673 }
    }
  ];

  const stats = {
    totalReports: reports.length,
    activeAlerts: liveAlerts.length,
    highRiskZones: 8,
    responseTime: '3.2min',
    accuracyRate: 94.7,
    populationCovered: '52M'
  };

  const radialData = [
    { label: 'Accuracy', value: 95, max: 100, color: '#10b981' },
    { label: 'Coverage', value: 78, max: 100, color: '#3b82f6' },
    { label: 'Response', value: 87, max: 100, color: '#f59e0b' },
    { label: 'Alerts', value: 23, max: 50, color: '#ef4444' }
  ];

  const bubbleData = [
    { label: 'Tsunami', value: 12, color: '#ef4444' },
    { label: 'Cyclone', value: 8, color: '#10b981' },
    { label: 'High Tide', value: 25, color: '#3b82f6' },
    { label: 'Erosion', value: 6, color: '#f97316' },
    { label: 'Pollution', value: 15, color: '#8b5cf6' }
  ];

  const heatmapData = Array.from({ length: 21 }, (_, i) => ({
    label: `Zone ${i + 1}`,
    value: Math.floor(Math.random() * 20) + 1
  }));

  const handleLayerToggle = (layerId, value) => {
    if (layerId === 'timeSlider') {
      setTimeSlider(value);
      return;
    }
    
    setSelectedLayers(prev => 
      prev.includes(layerId) 
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    );
  };

  const handleAlertClick = (alert) => {
    showToast.info(`Focusing on ${alert.title} at ${alert.location}`);
    // Here you would typically center the map on the alert coordinates
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-3xl shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Ocean Safety Command
                </h1>
                <p className="text-gray-600 text-lg">Advanced Analytics & Emergency Response System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">System Status</div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-600">All Systems Operational</span>
                </div>
              </div>
              
              <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Bell className="h-5 w-5 inline mr-2" />
                Emergency Alert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Pills */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-2 bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-white/20 shadow-lg">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: BarChart3, color: 'blue' },
            { id: 'analytics', label: 'Advanced Analytics', icon: TrendingUp, color: 'purple' },
            { id: 'social-intelligence', label: 'Social Intelligence', icon: MessageSquare, color: 'orange' },
            { id: 'cluster-analysis', label: 'Cluster Analysis', icon: Zap, color: 'red' },
            { id: 'incois-integration', label: 'INCOIS Integration', icon: Waves, color: 'cyan' }
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                activeSection === section.id
                  ? 'bg-white text-blue-600 shadow-lg border-2 border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
              }`}
            >
              <section.icon className="h-4 w-4" />
              <span className="hidden lg:inline">{section.label}</span>
              <span className="lg:hidden">{section.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>



      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl shadow-xl text-white hover:scale-105 transform transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Reports</p>
                    <p className="text-3xl font-bold">{stats.totalReports}</p>
                    <p className="text-blue-200 text-xs">+12% from last week</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-3xl shadow-xl text-white hover:scale-105 transform transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Active Alerts</p>
                    <p className="text-3xl font-bold">{stats.activeAlerts}</p>
                    <p className="text-red-200 text-xs">2 high priority</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-3xl shadow-xl text-white hover:scale-105 transform transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">High Risk Zones</p>
                    <p className="text-3xl font-bold">{stats.highRiskZones}</p>
                    <p className="text-orange-200 text-xs">Requires attention</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-3xl shadow-xl text-white hover:scale-105 transform transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Response Time</p>
                    <p className="text-3xl font-bold">{stats.responseTime}</p>
                    <p className="text-green-200 text-xs">-15% improvement</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-3xl shadow-xl text-white hover:scale-105 transform transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Accuracy Rate</p>
                    <p className="text-3xl font-bold">{stats.accuracyRate}%</p>
                    <p className="text-purple-200 text-xs">AI-enhanced</p>
                  </div>
                  <Brain className="h-8 w-8 text-purple-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-3xl shadow-xl text-white hover:scale-105 transform transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-medium">Population Coverage</p>
                    <p className="text-3xl font-bold">{stats.populationCovered}</p>
                    <p className="text-indigo-200 text-xs">Coastal regions</p>
                  </div>
                  <Users className="h-8 w-8 text-indigo-200" />
                </div>
              </div>
            </div>

            {/* Radial Progress Charts */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">System Performance Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {radialData.map((item, index) => (
                  <RadialProgress
                    key={index}
                    value={item.value}
                    max={item.max}
                    color={item.color}
                    label={item.label}
                  />
                ))}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Live Activity Stream</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Real-time updates</span>
                </div>
              </div>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {[
                  { time: '2 min ago', action: 'High tide alert verified', location: 'Mumbai Coast', type: 'alert' },
                  { time: '5 min ago', action: 'New hazard report received', location: 'Chennai', type: 'report' },
                  { time: '8 min ago', action: 'Emergency response team deployed', location: 'Kolkata', type: 'response' },
                  { time: '12 min ago', action: 'Weather data updated', location: 'Bay of Bengal', type: 'data' },
                  { time: '15 min ago', action: 'Cyclone warning issued', location: 'Andhra Pradesh', type: 'warning' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white/50 rounded-2xl">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'alert' ? 'bg-red-500' :
                      activity.type === 'report' ? 'bg-blue-500' :
                      activity.type === 'response' ? 'bg-green-500' :
                      activity.type === 'data' ? 'bg-purple-500' : 'bg-orange-500'
                    } animate-pulse`} />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.location}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Advanced Analytics Section */}
        {activeSection === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold mb-3">Advanced Analytics Hub</h2>
                  <p className="text-purple-100 text-lg">AI-powered insights with custom visualizations</p>
                  <div className="flex items-center space-x-4 mt-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Real-time Processing</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Brain className="h-4 w-4" />
                      <span>AI Enhanced</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">94.7%</div>
                    <div className="text-purple-200 text-sm">Accuracy Rate</div>
                  </div>
                  <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105">
                    📊 Export Analytics
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Visualization Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Simple Line Chart for Hazard Distribution */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/30 hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Hazard Distribution Pattern</h3>
                    <p className="text-gray-600 text-sm">Daily hazard reports over time</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-2xl">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hazardDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Status Distribution Pie Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/30 hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Status Distribution</h3>
                    <p className="text-gray-600 text-sm">Report processing status breakdown</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-2xl">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div style={{ height: '300px' }}>
                  <ResponsivePie
                    data={[
                      { id: 'Verified', label: 'Verified', value: 145, color: '#10b981' },
                      { id: 'Pending', label: 'Pending Review', value: 32, color: '#f59e0b' },
                      { id: 'Under Review', label: 'Under Review', value: 28, color: '#3b82f6' },
                      { id: 'Rejected', label: 'Rejected', value: 15, color: '#ef4444' }
                    ]}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.4}
                    padAngle={2}
                    cornerRadius={4}
                    activeOuterRadiusOffset={8}
                    colors={{ datum: 'data.color' }}
                    borderWidth={2}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsRadiusOffset={0.55}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
                    enableArcLabels={true}
                    enableArcLinkLabels={true}
                    motionConfig="gentle"
                    tooltip={({ datum }) => (
                      <div className="bg-white p-3 rounded-lg shadow-lg border">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: datum.color }}
                          />
                          <span className="font-medium">{datum.label}</span>
                        </div>
                        <div className="text-lg font-bold mt-1">{datum.value} reports</div>
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Wave Timeline */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/30 hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Reports Timeline Wave</h3>
                    <p className="text-gray-600 text-sm">Temporal analysis showing report intensity and verification trends</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-2xl">
                    <Waves className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <WaveTimelineChart data={timelineData} />
              </div>

              {/* Severity Radar Analysis */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/30 hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Multi-Dimensional Risk Radar</h3>
                    <p className="text-gray-600 text-sm">360° analysis of severity distribution across regions</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-2xl">
                    <Gauge className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <SeverityRadarChart />
              </div>
            </div>

            {/* AI Insights Panel */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Brain className="h-7 w-7 mr-3" />
                AI-Powered Predictive Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">87%</div>
                  <div className="text-emerald-100 text-sm font-medium">Tsunami Risk Probability</div>
                  <div className="text-emerald-200 text-xs">(Next 7 days)</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">156</div>
                  <div className="text-emerald-100 text-sm font-medium">Predicted Reports</div>
                  <div className="text-emerald-200 text-xs">(This week)</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">23%</div>
                  <div className="text-emerald-100 text-sm font-medium">Cyclone Formation</div>
                  <div className="text-emerald-200 text-xs">(Bay of Bengal)</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">3.2min</div>
                  <div className="text-emerald-100 text-sm font-medium">Avg Response Time</div>
                  <div className="text-emerald-200 text-xs">(15% improvement)</div>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <h4 className="font-bold mb-3">🔍 Pattern Analysis</h4>
                  <ul className="space-y-2 text-sm text-emerald-100">
                    <li>• Correlation between monsoon patterns and coastal flooding reports increased by 23%</li>
                    <li>• Social media sentiment shows 87% accuracy in predicting actual hazard occurrences</li>
                    <li>• Peak reporting hours: 2-4 PM correlate with maximum tide conditions</li>
                  </ul>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <h4 className="font-bold mb-3">🎯 Recommendations</h4>
                  <ul className="space-y-2 text-sm text-emerald-100">
                    <li>• Deploy additional sensors in Mumbai-Chennai corridor</li>
                    <li>• Enhance AI monitoring during 12-6 PM daily window</li>
                    <li>• Implement predictive alerts for high-risk population zones</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Social Intelligence Section */}
        {activeSection === 'social-intelligence' && (
          <SocialMediaAnalysis />
        )}

        {/* Cluster Analysis Section */}
        {activeSection === 'cluster-analysis' && (
          <ClusterAlertSystem />
        )}

        {/* INCOIS Integration Section */}
        {activeSection === 'incois-integration' && (
          <INCOISIntegration />
        )}

        {/* Real-time Monitoring Section */}
        {activeSection === 'real-time' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Real-time Ocean Monitoring</h2>
                  <p className="text-green-100">Live sensor data and automated alerts</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Activity className="h-12 w-12 text-green-200 animate-pulse" />
                  <button 
                    onClick={() => setAnimationPlaying(!animationPlaying)}
                    className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2"
                  >
                    {animationPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    <span>{animationPlaying ? 'Pause' : 'Start'} Monitoring</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Wave Height', value: '3.2m', change: '+0.5m', status: 'warning' },
                { name: 'Water Temperature', value: '28.5°C', change: '+1.2°C', status: 'normal' },
                { name: 'Current Speed', value: '2.1 m/s', change: '-0.3 m/s', status: 'normal' },
                { name: 'Tide Level', value: '1.8m', change: '+0.8m', status: 'alert' }
              ].map((sensor, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{sensor.name}</h4>
                    <div className={`w-3 h-3 rounded-full ${
                      sensor.status === 'alert' ? 'bg-red-500 animate-pulse' :
                      sensor.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{sensor.value}</div>
                  <div className={`text-sm ${
                    sensor.change.startsWith('+') ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {sensor.change} from last hour
                  </div>
                </div>
              ))}
            </div>

            {/* Live Data Streams */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Live Data Streams</h3>
              <div className="space-y-4">
                {[
                  { source: 'Mumbai Buoy Station', data: 'Wave: 3.2m | Wind: 25 km/h | Temp: 28.5°C', status: 'active' },
                  { source: 'Chennai Coastal Radar', data: 'Current: 2.1 m/s | Tide: High | Visibility: 15km', status: 'active' },
                  { source: 'Kolkata Weather Station', data: 'Pressure: 1013 hPa | Humidity: 78% | Rain: 0mm', status: 'active' },
                  { source: 'Satellite Ocean Monitor', data: 'Sea Surface: 29.1°C | Chlorophyll: Normal | Cloud: 40%', status: 'active' }
                ].map((stream, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <div>
                        <div className="font-semibold text-gray-900">{stream.source}</div>
                        <div className="text-sm text-gray-600">{stream.data}</div>
                      </div>
                    </div>
                    <span className="text-xs text-green-600 font-semibold">LIVE</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .slider::-webkit-slider-thumb:hover {
          background: #2563eb;
          transform: scale(1.1);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ModernAdminDashboard;