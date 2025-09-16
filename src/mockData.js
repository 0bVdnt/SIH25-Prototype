// Mock data for ocean hazard reports
export const mockReports = [
  {
    id: 1,
    type: 'high-tide',
    title: 'Extreme High Tide Warning',
    location: 'Marine Drive, Mumbai',
    coordinates: [19.0330, 72.8570],
    description: 'Unusually high tide levels observed, flooding walkways and roads near the coastline. Water level approximately 2 feet above normal.',
    severity: 'high',
    status: 'verified',
    reportedBy: 'Rajesh Kumar',
    reportedAt: '2024-09-16T08:30:00Z',
    verifiedAt: '2024-09-16T09:15:00Z',
    verifiedBy: 'Admin',
    comments: 'Alert issued to local authorities. Monitoring continues.',
    photos: []
  },
  {
    id: 2,
    type: 'jellyfish',
    title: 'Large Jellyfish Swarm Spotted',
    location: 'Calangute Beach, Goa',
    coordinates: [15.5467, 73.7553],
    description: 'Multiple jellyfish sightings near the shore. Tourists advised to avoid swimming in the area.',
    severity: 'medium',
    status: 'verified',
    reportedBy: 'Maria Fernandes',
    reportedAt: '2024-09-16T06:45:00Z',
    verifiedAt: '2024-09-16T07:30:00Z',
    verifiedBy: 'Admin',
    comments: 'Beach safety flags updated. Lifeguards notified.',
    photos: []
  },
  {
    id: 3,
    type: 'pollution',
    title: 'Oil Spill Detected',
    location: 'Vizag Port, Andhra Pradesh',
    coordinates: [17.6868, 83.2185],
    description: 'Small oil spill detected near the port area. Appears to be from a cargo vessel. Immediate cleanup required.',
    severity: 'high',
    status: 'verified',
    reportedBy: 'Captain Ramesh',
    reportedAt: '2024-09-15T14:20:00Z',
    verifiedAt: '2024-09-15T15:10:00Z',
    verifiedBy: 'Admin',
    comments: 'Coast Guard notified. Cleanup operations initiated.',
    photos: []
  },
  {
    id: 4,
    type: 'storm',
    title: 'Rough Sea Conditions',
    location: 'Puri Beach, Odisha',
    coordinates: [19.8135, 85.8312],
    description: 'Strong winds and rough seas observed. Wave height approximately 3-4 meters. Not safe for fishing or water activities.',
    severity: 'medium',
    status: 'pending',
    reportedBy: 'Fisherman Association',
    reportedAt: '2024-09-16T05:15:00Z',
    verifiedAt: null,
    verifiedBy: null,
    comments: null,
    photos: []
  },
  {
    id: 5,
    type: 'unusual-activity',
    title: 'Unusual Fish Die-off',
    location: 'Kochi Harbor, Kerala',
    coordinates: [9.9312, 76.2673],
    description: 'Large number of dead fish found floating in the harbor area. Possible water contamination or disease outbreak.',
    severity: 'high',
    status: 'pending',
    reportedBy: 'Local Fisherman',
    reportedAt: '2024-09-16T07:00:00Z',
    verifiedAt: null,
    verifiedBy: null,
    comments: null,
    photos: []
  },
  {
    id: 6,
    type: 'high-tide',
    title: 'Moderate High Tide',
    location: 'Juhu Beach, Mumbai',
    coordinates: [19.1075, 72.8263],
    description: 'Higher than normal tide levels. Some beach area submerged but no immediate danger to public.',
    severity: 'low',
    status: 'verified',
    reportedBy: 'Beach Patrol',
    reportedAt: '2024-09-15T16:30:00Z',
    verifiedAt: '2024-09-15T17:00:00Z',
    verifiedBy: 'Admin',
    comments: 'Normal tidal variation. Monitoring continues.',
    photos: []
  },
  {
    id: 7,
    type: 'pollution',
    title: 'Plastic Waste Accumulation',
    location: 'Versova Beach, Mumbai',
    coordinates: [19.1318, 72.8155],
    description: 'Large amount of plastic waste washed ashore. Cleanup required to prevent environmental damage.',
    severity: 'medium',
    status: 'verified',
    reportedBy: 'Environmental Activist',
    reportedAt: '2024-09-15T11:20:00Z',
    verifiedAt: '2024-09-15T12:45:00Z',
    verifiedBy: 'Admin',
    comments: 'Cleanup drive organized for tomorrow morning.',
    photos: []
  },
  {
    id: 8,
    type: 'jellyfish',
    title: 'Jellyfish Warning',
    location: 'Kovalam Beach, Kerala',
    coordinates: [8.4004, 76.9784],
    description: 'Several jellyfish spotted in shallow waters. Swimmers should exercise caution.',
    severity: 'low',
    status: 'false-alarm',
    reportedBy: 'Tourist',
    reportedAt: '2024-09-14T14:15:00Z',
    verifiedAt: '2024-09-14T15:30:00Z',
    verifiedBy: 'Admin',
    comments: 'False alarm - identified as harmless sea creatures.',
    photos: []
  },
  {
    id: 9,
    type: 'storm',
    title: 'Cyclone Warning',
    location: 'Paradip Port, Odisha',
    coordinates: [20.2648, 86.6982],
    description: 'Cyclonic conditions expected in 48 hours. All fishing activities suspended. Evacuation preparations underway.',
    severity: 'high',
    status: 'verified',
    reportedBy: 'Meteorological Department',
    reportedAt: '2024-09-14T08:00:00Z',
    verifiedAt: '2024-09-14T08:30:00Z',
    verifiedBy: 'Admin',
    comments: 'Emergency protocols activated. Regular updates issued.',
    photos: []
  },
  {
    id: 10,
    type: 'unusual-activity',
    title: 'Whale Stranding',
    location: 'Digha Beach, West Bengal',
    coordinates: [21.6283, 87.5085],
    description: 'Single whale found stranded on the beach. Rescue operations required immediately.',
    severity: 'high',
    status: 'verified',
    reportedBy: 'Beach Security',
    reportedAt: '2024-09-13T12:30:00Z',
    verifiedAt: '2024-09-13T13:00:00Z',
    verifiedBy: 'Admin',
    comments: 'Marine rescue team deployed. Successful rescue completed.',
    photos: []
  },
  {
    id: 11,
    type: 'pollution',
    title: 'Chemical Discharge',
    location: 'Haldia Port, West Bengal',
    coordinates: [22.0333, 88.0667],
    description: 'Suspected chemical discharge into the water from industrial facility. Water discoloration observed.',
    severity: 'high',
    status: 'pending',
    reportedBy: 'Port Authority',
    reportedAt: '2024-09-16T10:45:00Z',
    verifiedAt: null,
    verifiedBy: null,
    comments: null,
    photos: []
  },
  {
    id: 12,
    type: 'high-tide',
    title: 'Spring Tide Effects',
    location: 'Mandarmani Beach, West Bengal',
    coordinates: [21.6615, 87.7845],
    description: 'Spring tide causing higher than usual water levels. Temporary fishing restrictions in place.',
    severity: 'medium',
    status: 'verified',
    reportedBy: 'Coast Guard',
    reportedAt: '2024-09-15T19:20:00Z',
    verifiedAt: '2024-09-15T20:00:00Z',
    verifiedBy: 'Admin',
    comments: 'Normal spring tide phenomenon. Safety measures implemented.',
    photos: []
  },
  {
    id: 13,
    type: 'jellyfish',
    title: 'Box Jellyfish Alert',
    location: 'Radhanagar Beach, Andaman',
    coordinates: [11.9416, 92.9542],
    description: 'Potentially dangerous box jellyfish spotted. Swimming strictly prohibited until further notice.',
    severity: 'high',
    status: 'pending',
    reportedBy: 'Marine Biologist',
    reportedAt: '2024-09-16T11:30:00Z',
    verifiedAt: null,
    verifiedBy: null,
    comments: null,
    photos: []
  },
  {
    id: 14,
    type: 'storm',
    title: 'Monsoon Surge',
    location: 'Mangalore Coast, Karnataka',
    coordinates: [12.9141, 74.8560],
    description: 'Strong monsoon surge creating dangerous conditions for small vessels. Harbour restrictions in effect.',
    severity: 'medium',
    status: 'verified',
    reportedBy: 'Harbour Master',
    reportedAt: '2024-09-15T22:15:00Z',
    verifiedAt: '2024-09-16T06:30:00Z',
    verifiedBy: 'Admin',
    comments: 'Fishing boats advised to stay in harbour. Weather monitoring continues.',
    photos: []
  },
  {
    id: 15,
    type: 'unusual-activity',
    title: 'Red Tide Phenomenon',
    location: 'Panaji Coast, Goa',
    coordinates: [15.4909, 73.8278],
    description: 'Water discoloration due to algal bloom. Possible red tide phenomenon affecting local marine life.',
    severity: 'medium',
    status: 'pending',
    reportedBy: 'Marine Research Institute',
    reportedAt: '2024-09-16T09:20:00Z',
    verifiedAt: null,
    verifiedBy: null,
    comments: null,
    photos: []
  }
];

// Hazard type configurations
export const hazardTypes = {
  'high-tide': {
    label: 'High Tide',
    color: '#0066CC',
    icon: '🌊'
  },
  'storm': {
    label: 'Storm/Cyclone',
    color: '#6B7280',
    icon: '🌪️'
  },
  'pollution': {
    label: 'Water Pollution',
    color: '#10B981',
    icon: '🏭'
  },
  'jellyfish': {
    label: 'Jellyfish Swarm',
    color: '#8B5CF6',
    icon: '🪼'
  },
  'oil-spill': {
    label: 'Oil Spill',
    color: '#EF4444',
    icon: '🛢️'
  },
  'unusual-activity': {
    label: 'Unusual Marine Activity',
    color: '#F59E0B',
    icon: '🐋'
  }
};

// Status configurations
export const statusConfig = {
  'pending': {
    label: 'Pending',
    color: '#F59E0B',
    bgColor: '#FEF3C7'
  },
  'verified': {
    label: 'Verified',
    color: '#10B981',
    bgColor: '#D1FAE5'
  },
  'false-alarm': {
    label: 'False Alarm',
    color: '#EF4444',
    bgColor: '#FEE2E2'
  }
};

// Severity configurations
export const severityConfig = {
  'low': {
    label: 'Low',
    color: '#10B981',
    bgColor: '#D1FAE5'
  },
  'medium': {
    label: 'Medium',
    color: '#F59E0B',
    bgColor: '#FEF3C7'
  },
  'high': {
    label: 'High',
    color: '#EF4444',
    bgColor: '#FEE2E2'
  }
};

// Legacy export for compatibility
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
];