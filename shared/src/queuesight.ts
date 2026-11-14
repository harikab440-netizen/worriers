export type QueueStatus = 'short' | 'moderate' | 'busy';
export type CounterStatus = 'open' | 'busy' | 'closed';
export type ObstacleSeverity = 'low' | 'medium' | 'high';
export type AlertResolutionStatus = 'active' | 'resolved' | 'dismissed';
export type PlaceCategory = 'shops' | 'lodges' | 'resorts' | 'food' | 'essentials';
export type TransportMode = 'bus' | 'train' | 'taxi' | 'auto_rickshaw' | 'walking' | 'driving';

export interface QueueItem {
  id: string;
  name: string;
  counterId: string;
  counterName: string;
  personCount: number;
  estimatedWaitMinutes: number;
  status: QueueStatus;
  throughput: string;
  trend: 'decreasing' | 'steady' | 'increasing';
  bbox: [number, number, number, number]; // [x, y, w, h] normalized 0-100%
}

export interface CounterItem {
  id: string;
  name: string;
  number: number;
  status: CounterStatus;
  assignedStaff: string;
  specialty: string;
  avgServiceMinutes: number;
  queueId: string;
  bbox: [number, number, number, number]; // [x, y, w, h] normalized 0-100%
}

export interface ObstacleAlertItem {
  id: string;
  zone: string;
  obstacleType: string;
  severity: ObstacleSeverity;
  detectedAt: string;
  detectedTimeFormatted: string;
  confidence: number;
  suggestedAction: string;
  status: AlertResolutionStatus;
  bbox: [number, number, number, number];
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  timeFormatted: string;
  type: 'queue' | 'counter' | 'obstacle' | 'resolution' | 'visitor' | 'system';
  title: string;
  description: string;
  confidenceScore?: number;
  confidenceText?: string;
  severity?: 'low' | 'medium' | 'high' | 'info';
}

export interface NearbyPlaceItem {
  id: string;
  name: string;
  category: PlaceCategory;
  distanceMeters: number;
  distanceKm: number;
  address: string;
  area: string;
  isOpen: boolean;
  openingHours: string;
  lastCheckedTime: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  amenities: string[];
  rating: number;
  reviewsCount: number;
  contactUrl?: string;
  contactPhone?: string;
  isSponsored?: boolean;
  sponsoredDisclosure?: string;
  bookingNote: string;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // 0-100% for SVG map
    mapY: number; // 0-100% for SVG map
  };
  shortDescription: string;
}

export interface TouristDestinationItem {
  id: string;
  name: string;
  type: string;
  isOpen: boolean;
  openingHours: string;
  lastCheckedTime: string;
  entryFee: string;
  shortDescription: string;
  highlights: string[];
  sourceUrl: string;
  isVerified: boolean;
  stepFreeAccess: boolean;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number;
    mapY: number;
  };
}

export interface TransportRouteStep {
  stepNumber: number;
  modeType: 'walk' | 'bus' | 'train' | 'taxi' | 'auto' | 'drive';
  instruction: string;
  durationMinutes: number;
  detail?: string;
  routeCode?: string;
  isStepFree?: boolean;
}

export interface TransportRouteOption {
  id: string;
  destinationId: string;
  mode: TransportMode;
  modeName: string;
  estimatedJourneyMinutes: number;
  estimatedFare: string;
  fareCurrency: string;
  transfersCount: number;
  startStop: string;
  destStop: string;
  routeSummary: string;
  stepFreeAccessible: boolean;
  steps: TransportRouteStep[];
  scheduleFrequency?: string;
  emissionsEstimate?: string;
}

export interface SettingsState {
  locationName: string;
  demoMode: boolean;
  soundAlerts: boolean;
  highSeverityToasts: boolean;
  detectionSensitivity: 'low' | 'medium' | 'high';
  autoDismissResolved: boolean;
  theme: 'navy' | 'plum' | 'contrast';
  density: 'comfortable' | 'compact';
  reducedMotion: boolean;
  currency: 'USD' | 'INR' | 'EUR' | 'GBP';
}
