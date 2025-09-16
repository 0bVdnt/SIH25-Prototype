export const mockIncidents = [
  {
    id: "INC001",
    lat: 13.0827,
    lng: 80.2707,
    type: "Coastal Flooding",
    severity: "High",
    status: "Verified",
    description: "Severe waterlogging near Foreshore Estate. Roads are impassable for small vehicles.",
    timestamp: "2025-09-15T09:45:00Z",
    photo: "https://images.unsplash.com/photo-1599420234755-73c013b603d7",
  },
  {
    id: "INC002",
    lat: 12.9716,
    lng: 80.2707,
    type: "High Waves",
    severity: "Medium",
    status: "Unverified",
    description: "Unusually high waves reported by fishermen at Marina Beach. Small boats advised to return.",
    timestamp: "2025-09-15T09:15:00Z",
    photo: "https://images.unsplash.com/photo-1562251333-585329a1de45",
  },
  {
    id: "INC003",
    lat: 11.6139,
    lng: 79.8145,
    type: "Damaged Structure",
    severity: "High",
    status: "Verified",
    description: "A portion of the old pier at Promenade Beach has collapsed due to wave action.",
    timestamp: "2025-09-15T08:30:00Z",
    photo: "https://images.unsplash.com/photo-1563810337881-805139048a47",
  },
  {
    id: "INC001",
    lat: 13.0827,
    lng: 80.2707,
    type: "Coastal Flooding",
    severity: "High",
    status: "Verified",
    description: "Severe waterlogging near Foreshore Estate. Roads are impassable for small vehicles.",
    timestamp: "2025-09-15T09:45:00Z",
    photo: "https://images.unsplash.com/photo-1599420234755-73c013b603d7",
    // NEW: Add the insurance trigger data
    insuranceTriggered: true, 
  },
  // ... other incidents
];

// NEW: Add data for the Jal-Sentinel IoT sensors
export const mockIotSensors = [
  {
    id: "JS001",
    lat: 13.0950,
    lng: 80.2850,
    type: "Jal-Sentinel",
    status: "Alert", // Can be 'Normal' or 'Alert'
    waterLevel: 3.2, // in meters
    waveHeight: 1.5, // in meters
    // Fake historical data for the chart
    historicalData: [2.1, 2.3, 2.2, 2.5, 2.8, 3.2],
  },
  {
    id: "JS002",
    lat: 12.9510,
    lng: 80.2600,
    type: "Jal-Sentinel",
    status: "Normal",
    waterLevel: 1.8,
    waveHeight: 0.6,
    historicalData: [1.5, 1.6, 1.5, 1.7, 1.6, 1.8],
  },
];

// NEW: Add coordinates for the AI Predictive Path polygon
export const predictivePath = [
  [80.275, 13.085], // Starting near the main incident
  [80.285, 13.090],
  [80.290, 13.080],
  [80.280, 13.075],
  [80.275, 13.085], // Close the polygon
];