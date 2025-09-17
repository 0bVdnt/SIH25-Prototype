import React, { useEffect, useRef, useState } from 'react';
import * as atlas from 'azure-maps-control';
import { mockReports } from '../mockData';
import { AlertTriangle, CheckCircle, Clock, MapPin, Calendar, User, RefreshCw } from 'lucide-react';

const MapPage = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Azure Maps subscription key - use import.meta.env for Vite
  const AZURE_MAPS_KEY = import.meta.env.VITE_AZURE_MAPS_KEY || 'CjkwxWSlkIJBrkLJxh2G469pYElCVSCAmpwzMUhnoiEvIfHlWtPiJQQJ99BIACYeBjFvT24DAAAgAZMP3D2x';

  useEffect(() => {
    // Load reports data
    fetchReports();
    
    // Initialize Azure Maps
    initializeMap();
    
    // Set up auto-refresh
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, []);

  // Add markers to map when map becomes ready or reports change
  useEffect(() => {
    if (map && reports.length > 0) {
      addMarkersToMap(reports);
    }
  }, [map, reports]);

  const fetchReports = () => {
    try {
      // Generate random coordinates around Indian Ocean regions
      const reportsWithCoordinates = mockReports.map(report => ({
        ...report,
        coordinates: generateRandomCoordinates(),
        timestamp: report.timestamp || new Date().toISOString()
      }));
      
      setReports(reportsWithCoordinates);
      setLastUpdated(new Date());
      
      // Add markers to map if map is ready
      if (map) {
        addMarkersToMap(reportsWithCoordinates);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCoordinates = () => {
    // Indian coastal regions with more specific coordinates
    const coastalRegions = [
      { lat: 19.0760, lng: 72.8777, name: 'Mumbai Coast' },
      { lat: 13.0827, lng: 80.2707, name: 'Chennai Coast' },
      { lat: 15.2993, lng: 74.1240, name: 'Goa Coast' },
      { lat: 11.9416, lng: 79.8083, name: 'Pondicherry Coast' },
      { lat: 8.5241, lng: 76.9366, name: 'Kerala Coast' },
      { lat: 20.2961, lng: 85.8245, name: 'Odisha Coast' },
      { lat: 21.1458, lng: 79.0882, name: 'Nagpur Coast' },
      { lat: 17.6868, lng: 83.2185, name: 'Visakhapatnam Coast' },
      { lat: 12.2958, lng: 76.6394, name: 'Mysore Coast' },
      { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad Coast' },
    ];
    
    const randomRegion = coastalRegions[Math.floor(Math.random() * coastalRegions.length)];
    
    // Add some random offset to make markers spread out
    const latOffset = (Math.random() - 0.5) * 0.3; // ±0.15 degrees
    const lngOffset = (Math.random() - 0.5) * 0.3; // ±0.15 degrees
    
    return [
      randomRegion.lng + lngOffset, // longitude first for Azure Maps
      randomRegion.lat + latOffset  // latitude second
    ];
  };

  const initializeMap = () => {
    if (mapRef.current) {
      try {
        const mapInstance = new atlas.Map(mapRef.current, {
          center: [78.9629, 20.5937], // Center of India
          zoom: 5,
          minZoom: 4,
          maxZoom: 18,
          view: 'Auto',
          authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: AZURE_MAPS_KEY
          },
          style: 'road', // Changed to 'road' for better marker visibility
          showLogo: false,
          showFeedbackLink: false,
          // Restrict the map bounds to focus on India and surrounding areas
          bounds: [
            68.0, 6.0,   // Southwest corner (longitude, latitude)
            97.0, 37.0   // Northeast corner (longitude, latitude)
          ],
          padding: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
          }
        });

        // Add map ready event
        mapInstance.events.add('ready', () => {
          console.log('Azure Maps loaded successfully');
          setMap(mapInstance);
          setLoading(false);
          
          // Add zoom and style controls
          mapInstance.controls.add([
            new atlas.control.ZoomControl(),
            new atlas.control.StyleControl({
              mapStyles: ['road', 'satellite', 'road_shaded_relief', 'grayscale_dark']
            })
          ], {
            position: 'top-right'
          });

          // Add markers once map is ready
          if (reports.length > 0) {
            addMarkersToMap(reports);
          }
        });

        // Add error handling
        mapInstance.events.add('error', (error) => {
          console.error('Azure Maps error:', error);
          setLoading(false);
          
          // Show fallback content
          mapRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gradient-to-br from-red-100 to-red-200 rounded-lg">
              <div class="text-center p-8">
                <div class="bg-white rounded-2xl p-6 shadow-lg max-w-md">
                  <div class="text-6xl mb-4">⚠️</div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">Map Loading Error</h3>
                  <p class="text-gray-600 mb-4">Unable to load Azure Maps</p>
                  <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p class="text-sm text-red-800">
                      <strong>Possible issues:</strong><br>
                      • Network connectivity<br>
                      • Invalid API key<br>
                      • Service temporarily unavailable
                    </p>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
      } catch (error) {
        console.error('Failed to initialize Azure Maps:', error);
        setLoading(false);
        
        // Show error message
        mapRef.current.innerHTML = `
          <div class="flex items-center justify-center h-full bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg">
            <div class="text-center p-8">
              <div class="bg-white rounded-2xl p-6 shadow-lg max-w-md">
                <div class="text-6xl mb-4">🔧</div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Initialization Error</h3>
                <p class="text-gray-600 mb-4">Failed to initialize map component</p>
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p class="text-sm text-yellow-800">
                    Please refresh the page or check the console for more details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        `;
      }
    }
  };

  const addMarkersToMap = (reportsData) => {
    if (!map) return;

    // Filter out storm and pollution reports - only ocean hazards
    const filteredReports = reportsData.filter(report => {
      const hazardType = (report.hazardType || report.type || '').toLowerCase();
      const description = (report.description || '').toLowerCase();
      
      // Exclude storm and pollution related reports
      const excludeKeywords = ['storm', 'pollution', 'weather', 'rain', 'wind'];
      const isExcluded = excludeKeywords.some(keyword => 
        hazardType.includes(keyword) || description.includes(keyword)
      );
      
      return !isExcluded;
    });

    if (filteredReports.length === 0) {
      console.log('No ocean hazard reports to display on map');
      return;
    }

    // Create data source with a unique ID to prevent conflicts
    const dataSourceId = 'reportsDataSource_' + Date.now();
    const dataSource = new atlas.source.DataSource(dataSourceId);
    map.sources.add(dataSource);

    // Add points to data source with proper coordinates - use filtered reports
    filteredReports.forEach(report => {
      const point = new atlas.data.Feature(new atlas.data.Point(report.coordinates), {
        id: report.id,
        title: report.hazardType || report.type,
        description: report.description,
        status: report.status,
        severity: report.severity,
        location: report.location,
        timestamp: report.timestamp,
        reporterName: report.reportedBy || 'Anonymous'
      });
      
      dataSource.add(point);
    });

    // Add a single bubble layer with conditional colors and proper ID
    const bubbleLayerId = 'bubble-layer_' + Date.now();
    const bubbleLayer = new atlas.layer.BubbleLayer(dataSource, bubbleLayerId, {
      radius: [
        'case',
        ['==', ['get', 'severity'], 'high'], 16,
        ['==', ['get', 'severity'], 'medium'], 14,
        12 // low severity
      ],
      strokeWidth: [
        'case',
        ['==', ['get', 'severity'], 'high'], 4,
        ['==', ['get', 'severity'], 'medium'], 3,
        2 // low severity
      ],
      strokeColor: [
        'case',
        ['==', ['get', 'status'], 'pending'], '#ffffff',
        ['==', ['get', 'status'], 'verified'], '#ffffff', 
        ['==', ['get', 'status'], 'resolved'], '#ffffff',
        '#ffffff' // default white
      ],
      color: [
        'case',
        ['==', ['get', 'status'], 'pending'], '#ef4444',
        ['==', ['get', 'status'], 'verified'], '#f59e0b', 
        ['==', ['get', 'status'], 'resolved'], '#10b981',
        '#6b7280' // default gray
      ],
      blur: 0.2,
      opacity: [
        'case',
        ['==', ['get', 'severity'], 'high'], 0.9,
        ['==', ['get', 'severity'], 'medium'], 0.8,
        0.7 // low severity
      ],
      strokeOpacity: 0.9,
      // Add pulsing animation for pending reports
      pitchAlignment: 'map',
      rotationAlignment: 'map'
    });

    map.layers.add(bubbleLayer);

    // Add inner glow layer for more visual appeal
    const glowLayerId = 'glow-layer_' + Date.now();
    const glowLayer = new atlas.layer.BubbleLayer(dataSource, glowLayerId, {
      radius: [
        'case',
        ['==', ['get', 'severity'], 'high'], 20,
        ['==', ['get', 'severity'], 'medium'], 18,
        16 // low severity
      ],
      strokeWidth: 0,
      color: [
        'case',
        ['==', ['get', 'status'], 'pending'], '#ef4444',
        ['==', ['get', 'status'], 'verified'], '#f59e0b', 
        ['==', ['get', 'status'], 'resolved'], '#10b981',
        '#6b7280' // default gray
      ],
      opacity: 0.2,
      blur: 0.8
    });

    map.layers.add(glowLayer);

    // Add symbol layer for icons with ID
    const symbolLayerId = 'symbol-layer_' + Date.now();
    const symbolLayer = new atlas.layer.SymbolLayer(dataSource, symbolLayerId, {
      iconOptions: {
        image: [
          'case',
          ['==', ['get', 'title'], 'high-tide'], 'pin-blue',
          ['==', ['get', 'title'], 'jellyfish'], 'pin-round-blue',
          ['==', ['get', 'title'], 'oil-spill'], 'pin-red',
          ['==', ['get', 'title'], 'unusual-activity'], 'pin-darkblue',
          'pin-blue' // default
        ],
        size: [
          'case',
          ['==', ['get', 'severity'], 'high'], 1.2,
          ['==', ['get', 'severity'], 'medium'], 1.0,
          0.8 // low severity
        ],
        anchor: 'bottom',
        allowOverlap: true,
        ignorePlacement: false,
        opacity: 0.9
      },
      textOptions: {
        textField: ['get', 'title'],
        color: '#ffffff',
        haloColor: '#000000',
        haloWidth: 2,
        size: [
          'case',
          ['==', ['get', 'severity'], 'high'], 12,
          ['==', ['get', 'severity'], 'medium'], 11,
          10 // low severity
        ],
        offset: [0, -2],
        allowOverlap: false,
        textTransform: 'uppercase'
      }
    });

    map.layers.add(symbolLayer);

    // Add click event for enhanced popups with animations
    map.events.add('click', bubbleLayer, (e) => {
      if (e.shapes && e.shapes.length > 0) {
        const properties = e.shapes[0].getProperties();
        const coordinates = e.shapes[0].getCoordinates();
        
        setSelectedReport({
          ...properties,
          coordinates
        });

        // Create enhanced popup with animation
        const popup = new atlas.Popup({
          content: createEnhancedPopupContent(properties),
          position: coordinates,
          pixelOffset: [0, -30],
          closeButton: true,
          fillColor: 'rgba(255, 255, 255, 0.95)',
          showPointer: true
        });

        // Add popup with fade-in animation
        map.popups.clear();
        map.popups.add(popup);

        // Add pulse animation to clicked marker
        animateMarkerPulse(coordinates);
      }
    });

    // Enhanced hover effects
    map.events.add('mouseenter', bubbleLayer, (e) => {
      map.getCanvasContainer().style.cursor = 'pointer';
      
      if (e.shapes && e.shapes.length > 0) {
        const coordinates = e.shapes[0].getCoordinates();
        const properties = e.shapes[0].getProperties();
        
        // Create hover tooltip
        const tooltip = new atlas.Popup({
          content: `
            <div class="p-2 bg-gray-900 text-white rounded-lg shadow-lg min-w-[200px]">
              <div class="flex items-center space-x-2 mb-1">
                <div class="w-3 h-3 rounded-full ${getStatusDotColor(properties.status)}"></div>
                <span class="font-semibold text-sm">${properties.title}</span>
              </div>
              <p class="text-xs text-gray-300 mb-1">${properties.location}</p>
              <div class="flex items-center justify-between text-xs">
                <span class="capitalize ${getSeverityTextColor(properties.severity)}">${properties.severity} severity</span>
                <span class="text-gray-400">${properties.status}</span>
              </div>
            </div>
          `,
          position: coordinates,
          pixelOffset: [0, -50],
          closeButton: false,
          showPointer: false
        });
        
        map.popups.add(tooltip);
        
        // Add hover scale effect
        addHoverScaleEffect(coordinates);
      }
    });

    map.events.add('mouseleave', bubbleLayer, () => {
      map.getCanvasContainer().style.cursor = 'grab';
      
      // Clear hover tooltips (keep main popups)
      const popups = map.popups.getPopups();
      popups.forEach(popup => {
        if (!popup.getOptions().closeButton) {
          map.popups.remove(popup);
        }
      });
      
      // Remove hover effects
      removeHoverEffects();
    });
  };

  // Helper functions for interactive effects
  const getStatusDotColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-red-500';
      case 'verified': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityTextColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const animateMarkerPulse = (coordinates) => {
    // Create a temporary pulse layer
    const pulseSource = new atlas.source.DataSource('pulse_' + Date.now());
    map.sources.add(pulseSource);
    
    const pulsePoint = new atlas.data.Feature(new atlas.data.Point(coordinates));
    pulseSource.add(pulsePoint);
    
    const pulseLayer = new atlas.layer.BubbleLayer(pulseSource, 'pulse_layer_' + Date.now(), {
      radius: 30,
      color: '#0066CC',
      opacity: 0.6,
      strokeWidth: 2,
      strokeColor: '#ffffff'
    });
    
    map.layers.add(pulseLayer);
    
    // Animate pulse effect
    let radius = 30;
    let opacity = 0.6;
    const animate = () => {
      radius += 2;
      opacity -= 0.03;
      
      if (opacity > 0) {
        pulseLayer.setOptions({
          radius: radius,
          opacity: opacity
        });
        requestAnimationFrame(animate);
      } else {
        // Clean up
        map.layers.remove(pulseLayer);
        map.sources.remove(pulseSource);
      }
    };
    
    animate();
  };

  const addHoverScaleEffect = (coordinates) => {
    // Visual feedback for hover state
    console.log('Hover effect at:', coordinates);
  };

  const removeHoverEffects = () => {
    // Clean up hover effects
    console.log('Removing hover effects');
  };

  const createEnhancedPopupContent = (properties) => {
    const statusColors = {
      'pending': 'bg-red-500 border-red-600',
      'verified': 'bg-yellow-500 border-yellow-600',
      'resolved': 'bg-green-500 border-green-600'
    };

    const severityColors = {
      'high': 'text-red-600 bg-red-50 border-red-200',
      'medium': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'low': 'text-green-600 bg-green-50 border-green-200'
    };

    const statusIcons = {
      'pending': '⏳',
      'verified': '✅',
      'resolved': '🔒'
    };

    const hazardIcons = {
      'high-tide': '🌊',
      'jellyfish': '🪼',
      'oil-spill': '🛢️',
      'unusual-activity': '🐋'
    };

    return `
      <div class="bg-white rounded-2xl shadow-2xl border-0 overflow-hidden max-w-sm animate-fadeIn">
        <!-- Header with gradient background -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white relative overflow-hidden">
          <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center space-x-2">
                <span class="text-2xl">${hazardIcons[properties.title] || '⚠️'}</span>
                <h3 class="text-lg font-bold capitalize">${properties.title.replace('-', ' ')}</h3>
              </div>
              <div class="flex items-center space-x-1">
                <span class="text-sm">${statusIcons[properties.status]}</span>
                <span class="px-2 py-1 rounded-full text-xs font-semibold ${statusColors[properties.status]} text-white border">
                  ${properties.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="px-2 py-1 rounded-lg text-xs font-medium border border-white/30 ${severityColors[properties.severity]} bg-white/90">
                ${properties.severity.toUpperCase()} SEVERITY
              </span>
            </div>
          </div>
          <!-- Animated wave pattern -->
          <div class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-30">
            <svg class="w-full h-full" viewBox="0 0 400 40" preserveAspectRatio="none">
              <path d="M0,20 Q100,0 200,20 T400,20 L400,40 L0,40 Z" fill="currentColor" class="animate-pulse"/>
            </svg>
          </div>
        </div>
        
        <!-- Content -->
        <div class="p-4 space-y-3">
          <p class="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
            ${properties.description}
          </p>
          
          <div class="space-y-2">
            <div class="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
              <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-sm font-medium text-blue-800">${properties.location}</span>
            </div>
            
            <div class="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-sm text-gray-600">${new Date(properties.timestamp).toLocaleString()}</span>
            </div>
            
            <div class="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-sm text-gray-600">Reported by <strong>${properties.reporterName}</strong></span>
            </div>
          </div>
          
          <!-- Action buttons -->
          <div class="flex space-x-2 pt-2 border-t border-gray-100">
            <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
              </svg>
              <span>View Details</span>
            </button>
            <button class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
      
      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      </style>
    `;
  };

  const createPopupContent = (properties) => {
    const statusColors = {
      'pending': 'bg-red-100 text-red-800 border-red-200',
      'verified': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'resolved': 'bg-green-100 text-green-800 border-green-200'
    };

    const severityColors = {
      'high': 'text-red-600',
      'medium': 'text-yellow-600',
      'low': 'text-green-600'
    };

    return `
      <div class="p-4 max-w-sm">
        <div class="flex items-start space-x-3 mb-3">
          <div class="p-2 rounded-lg bg-blue-100">
            <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-900 mb-1">${properties.title}</h3>
            <div class="flex items-center space-x-2 mb-2">
              <span class="px-2 py-1 rounded-full text-xs font-medium border ${statusColors[properties.status] || 'bg-gray-100 text-gray-800 border-gray-200'}">
                ${properties.status.toUpperCase()}
              </span>
              <span class="text-sm font-medium ${severityColors[properties.severity] || 'text-gray-600'}">
                ${properties.severity.toUpperCase()} SEVERITY
              </span>
            </div>
          </div>
        </div>
        
        <p class="text-gray-700 text-sm mb-3 leading-relaxed">${properties.description}</p>
        
        <div class="space-y-2 text-sm">
          <div class="flex items-center space-x-2 text-gray-600">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
            <span>${properties.location}</span>
          </div>
          <div class="flex items-center space-x-2 text-gray-600">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
            </svg>
            <span>${new Date(properties.timestamp).toLocaleString()}</span>
          </div>
          <div class="flex items-center space-x-2 text-gray-600">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
            </svg>
            <span>Reported by ${properties.reporterName}</span>
          </div>
        </div>
      </div>
    `;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-red-600 bg-red-100';
      case 'verified':
        return 'text-yellow-600 bg-yellow-100';
      case 'resolved':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-2xl">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Interactive Hazard Map</h1>
                <p className="text-gray-600 mt-1">Real-time ocean hazard tracking and monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-xl px-4 py-2">
                <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {loading ? 'Loading...' : `${reports.length} Active Reports`}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 bg-gray-100 rounded-xl px-4 py-2">
                <RefreshCw className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Legend */}
        <div className="absolute top-4 left-4 z-10 bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Status Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-700">Pending ({reports.filter(r => r.status === 'pending').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-700">Verified ({reports.filter(r => r.status === 'verified').length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-700">Resolved ({reports.filter(r => r.status === 'resolved').length})</span>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading map...</p>
              <p className="text-gray-500 text-sm mt-2">Initializing Azure Maps</p>
            </div>
          </div>
        )}

        {/* Azure Maps Container */}
        <div 
          ref={mapRef} 
          className="w-full h-full rounded-lg shadow-lg"
          style={{ minHeight: '400px' }}
        />

        {/* Map Controls Info */}
        <div className="absolute bottom-4 right-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 max-w-sm">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-bold text-gray-900">Map Controls</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Click markers for detailed information</p>
            <p>• Use mouse wheel to zoom in/out</p>
            <p>• Drag to pan around the map</p>
            <p>• Auto-refreshes every 30 seconds</p>
            <p>• Total markers: {reports.length}</p>
          </div>
        </div>
      </div>

      {/* Reports Summary */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-xl">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">
                  {reports.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-sm text-red-700">Pending</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-xl">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-600">
                  {reports.filter(r => r.status === 'verified').length}
                </div>
                <div className="text-sm text-yellow-700">Verified</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {reports.filter(r => r.status === 'resolved').length}
                </div>
                <div className="text-sm text-green-700">Resolved</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">{reports.length}</div>
                <div className="text-sm text-blue-700">Total Reports</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;