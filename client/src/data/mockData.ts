import {
  QueueItem,
  CounterItem,
  ObstacleAlertItem,
  ActivityLogItem,
  NearbyPlaceItem,
  TouristDestinationItem,
  TransportRouteOption,
  SettingsState
} from '@campus/shared';

export const INITIAL_QUEUES: QueueItem[] = [
  {
    id: 'queue-1',
    name: 'General Enquiries',
    counterId: 'counter-1',
    counterName: 'Counter 1',
    personCount: 4,
    estimatedWaitMinutes: 8,
    status: 'moderate',
    throughput: '~2.0 min / person',
    trend: 'steady',
    bbox: [18, 40, 16, 45]
  },
  {
    id: 'queue-2',
    name: 'Document Verification',
    counterId: 'counter-2',
    counterName: 'Counter 2',
    personCount: 1,
    estimatedWaitMinutes: 3,
    status: 'short',
    throughput: '~2.5 min / person',
    trend: 'decreasing',
    bbox: [42, 42, 16, 43]
  },
  {
    id: 'queue-3',
    name: 'Financial Services & Fees',
    counterId: 'counter-3',
    counterName: 'Counter 3',
    personCount: 6,
    estimatedWaitMinutes: 14,
    status: 'busy',
    throughput: '~2.3 min / person',
    trend: 'increasing',
    bbox: [66, 38, 17, 48]
  },
  {
    id: 'queue-4',
    name: 'Express Services & Pickup',
    counterId: 'counter-4',
    counterName: 'Counter 4',
    personCount: 0,
    estimatedWaitMinutes: 0,
    status: 'short',
    throughput: '~1.5 min / person',
    trend: 'steady',
    bbox: [85, 45, 12, 35]
  }
];

export const INITIAL_COUNTERS: CounterItem[] = [
  {
    id: 'counter-1',
    name: 'Counter 1',
    number: 1,
    status: 'open',
    assignedStaff: 'Elena Rostova',
    specialty: 'General Information & ID Issuance',
    avgServiceMinutes: 2.1,
    queueId: 'queue-1',
    bbox: [15, 18, 20, 18]
  },
  {
    id: 'counter-2',
    name: 'Counter 2',
    number: 2,
    status: 'open',
    assignedStaff: 'Marcus Vance',
    specialty: 'Document Certification & Stamp',
    avgServiceMinutes: 2.4,
    queueId: 'queue-2',
    bbox: [40, 18, 20, 18]
  },
  {
    id: 'counter-3',
    name: 'Counter 3',
    number: 3,
    status: 'busy',
    assignedStaff: 'Aisha Patel',
    specialty: 'Tuition, Transcripts & Accounts',
    avgServiceMinutes: 3.8,
    queueId: 'queue-3',
    bbox: [65, 18, 20, 18]
  },
  {
    id: 'counter-4',
    name: 'Counter 4',
    number: 4,
    status: 'closed',
    assignedStaff: 'On Shift Break',
    specialty: 'Express Kiosk Triage',
    avgServiceMinutes: 1.5,
    queueId: 'queue-4',
    bbox: [86, 18, 12, 18]
  }
];

export const INITIAL_ALERTS: ObstacleAlertItem[] = [
  {
    id: 'alert-101',
    zone: 'North Ramp Walkway (Main Wheelchair Access)',
    obstacleType: 'Unattended Travel Bag',
    severity: 'high',
    detectedAt: new Date(Date.now() - 4 * 60000).toISOString(),
    detectedTimeFormatted: '4 mins ago (10:37 AM)',
    confidence: 93,
    suggestedAction: 'Notify floor assistant to relocate bag to parcel bay; clear 36-inch wheelchair pathway.',
    status: 'active',
    bbox: [28, 72, 14, 16]
  },
  {
    id: 'alert-102',
    zone: 'Counter 2 Approach Corridor',
    obstacleType: 'Displaced Stanchion Barrier',
    severity: 'medium',
    detectedAt: new Date(Date.now() - 11 * 60000).toISOString(),
    detectedTimeFormatted: '11 mins ago (10:30 AM)',
    confidence: 87,
    suggestedAction: 'Re-align velvet queue rope and stanchion base to prevent tripping hazard.',
    status: 'active',
    bbox: [48, 62, 12, 14]
  },
  {
    id: 'alert-100',
    zone: 'East Emergency Exit Hallway',
    obstacleType: 'Janitorial Cleaning Cart',
    severity: 'medium',
    detectedAt: new Date(Date.now() - 35 * 60000).toISOString(),
    detectedTimeFormatted: '35 mins ago (10:06 AM)',
    confidence: 95,
    suggestedAction: 'Moved to utility closet by staff member.',
    status: 'resolved',
    resolvedAt: new Date(Date.now() - 22 * 60000).toISOString(),
    resolvedBy: 'Staff Member #14 (Elena)',
    bbox: [82, 68, 14, 18]
  }
];

export const INITIAL_ACTIVITY: ActivityLogItem[] = [
  {
    id: 'act-1',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    timeFormatted: '10:39 AM',
    type: 'queue',
    title: 'Queue 2 wait time improved',
    description: 'Estimated wait reduced to 3 mins as person exited Counter 2.',
    confidenceScore: 94,
    confidenceText: 'High confidence based on visual departure from service desk'
  },
  {
    id: 'act-2',
    timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
    timeFormatted: '10:37 AM',
    type: 'obstacle',
    title: 'Possible obstacle detected in North Ramp',
    description: 'Visual model flagged an unattended travel bag obstructing wheelchair path.',
    confidenceScore: 93,
    confidenceText: 'Identified with 93% visual confidence; stationary for >3 mins',
    severity: 'high'
  },
  {
    id: 'act-3',
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    timeFormatted: '10:33 AM',
    type: 'counter',
    title: 'Counter 3 transitioned to Busy',
    description: 'Complex financial aid consultation in progress with Aisha Patel.',
    confidenceScore: 91,
    severity: 'info'
  },
  {
    id: 'act-4',
    timestamp: new Date(Date.now() - 11 * 60000).toISOString(),
    timeFormatted: '10:30 AM',
    type: 'obstacle',
    title: 'Displaced stanchion in Counter 2 corridor',
    description: 'Visual tracking detected barrier tilted at 18 degrees across lane.',
    confidenceScore: 87,
    severity: 'medium'
  },
  {
    id: 'act-5',
    timestamp: new Date(Date.now() - 22 * 60000).toISOString(),
    timeFormatted: '10:19 AM',
    type: 'resolution',
    title: 'East Emergency Exit alert marked resolved',
    description: 'Staff Elena confirmed janitorial cart removed to service closet.',
    confidenceScore: 98,
    severity: 'low'
  },
  {
    id: 'act-6',
    timestamp: new Date(Date.now() - 28 * 60000).toISOString(),
    timeFormatted: '10:13 AM',
    type: 'visitor',
    title: 'Visitor route inquiry',
    description: 'Visitor requested step-free guidance to Counter 2.',
    severity: 'info'
  }
];

export const NEARBY_PLACES: NearbyPlaceItem[] = [
  // Shops
  {
    id: 'shop-1',
    name: 'University Academic Bookstore',
    category: 'shops',
    distanceMeters: 180,
    distanceKm: 0.18,
    address: 'East Quad, Building B Ground Floor',
    area: 'Campus Core',
    isOpen: true,
    openingHours: '8:30 AM - 6:30 PM',
    lastCheckedTime: 'Verified 12m ago',
    priceRange: '$$',
    amenities: ['Wheelchair Accessible', 'Digital Kiosk', 'Campus Discount', 'Card & Cash'],
    rating: 4.6,
    reviewsCount: 124,
    contactUrl: 'https://example.com/bookstore',
    bookingNote: 'In-store pickup available. Check textbook availability on store portal.',
    coordinates: { lat: 37.7749, lng: -122.4194, mapX: 42, mapY: 34 },
    shortDescription: 'Official campus store offering course materials, reference guides, stationery, and technology accessories.'
  },
  {
    id: 'shop-2',
    name: 'Campus Tech Hub & Repairs',
    category: 'shops',
    distanceMeters: 290,
    distanceKm: 0.29,
    address: 'Science Hall Walkway #104',
    area: 'North Campus',
    isOpen: true,
    openingHours: '9:00 AM - 5:00 PM',
    lastCheckedTime: 'Verified 25m ago',
    priceRange: '$$',
    amenities: ['Certified Technicians', 'Loaner Chargers', 'Wheelchair Ramp', 'Wi-Fi'],
    rating: 4.8,
    reviewsCount: 89,
    contactUrl: 'https://example.com/techhub',
    bookingNote: 'Diagnostics walk-in accepted; schedule hardware check online.',
    coordinates: { lat: 37.7758, lng: -122.4182, mapX: 58, mapY: 26 },
    shortDescription: 'Laptop repairs, phone screen replacement, software support, and certified campus tech accessories.'
  },

  // Food
  {
    id: 'food-1',
    name: 'Botanical Garden Terrace Café',
    category: 'food',
    distanceMeters: 220,
    distanceKm: 0.22,
    address: 'West Greenhouse Concourse',
    area: 'Botany Pavilion',
    isOpen: true,
    openingHours: '7:30 AM - 8:00 PM',
    lastCheckedTime: 'Verified 8m ago',
    priceRange: '$',
    amenities: ['Outdoor Garden Seating', 'Vegan & Gluten-free Options', 'Free High-speed Wi-Fi', 'Step-free Ramp'],
    rating: 4.7,
    reviewsCount: 312,
    contactUrl: 'https://example.com/botanicalcafe',
    bookingNote: 'Walk-ins welcome. Mobile pre-order available through campus app.',
    coordinates: { lat: 37.7741, lng: -122.4212, mapX: 25, mapY: 48 },
    shortDescription: 'Artisan espresso, fresh organic sandwiches, seasonal salads, and botanical pastries under glass atrium.'
  },
  {
    id: 'food-2',
    name: 'Courtyard Artisan Bakery & Deli',
    category: 'food',
    distanceMeters: 380,
    distanceKm: 0.38,
    address: '14 University Avenue',
    area: 'Old Quad Row',
    isOpen: true,
    openingHours: '6:30 AM - 4:00 PM',
    lastCheckedTime: 'Verified 18m ago',
    priceRange: '$$',
    amenities: ['Fresh Sourdough Daily', 'Wheelchair Seating', 'Takeaway Window', 'Apple Pay'],
    rating: 4.9,
    reviewsCount: 420,
    contactUrl: 'https://example.com/artisanbakery',
    bookingNote: 'Morning batch sells out quickly; online reserve for whole loaves.',
    coordinates: { lat: 37.7735, lng: -122.4175, mapX: 62, mapY: 55 },
    shortDescription: 'Handcrafted slow-fermented breads, gourmet paninis, hot soups, and single-origin filter roasts.'
  },

  // Lodges
  {
    id: 'lodge-1',
    name: 'Campus Heritage Guest House',
    category: 'lodges',
    distanceMeters: 450,
    distanceKm: 0.45,
    address: '32 Founders Way',
    area: 'South Campus Green',
    isOpen: true,
    openingHours: '24/7 Front Desk',
    lastCheckedTime: 'Verified 40m ago',
    priceRange: '$$',
    amenities: ['Elevator Access', 'Complimentary Breakfast', 'Quiet Study Lounge', 'Private En-suite'],
    rating: 4.5,
    reviewsCount: 156,
    contactUrl: 'https://example.com/heritageguesthouse',
    bookingNote: 'Check availability online; room vacancy subject to campus visitor registry.',
    coordinates: { lat: 37.7728, lng: -122.4205, mapX: 30, mapY: 68 },
    shortDescription: 'Comfortable guest lodging for university visitors, conference attendees, visiting faculty, and families.'
  },
  {
    id: 'lodge-2',
    name: 'Scholar’s Inn & Suites',
    category: 'lodges',
    distanceMeters: 850,
    distanceKm: 0.85,
    address: '77 College Crest Blvd',
    area: 'Transit Village',
    isOpen: true,
    openingHours: '24/7 Front Desk',
    lastCheckedTime: 'Verified 1h ago',
    priceRange: '$$',
    amenities: ['Luggage Storage', 'Free Shuttle to Campus', 'Accessible Bathrooms', 'High-speed Fiber'],
    rating: 4.4,
    reviewsCount: 204,
    contactUrl: 'https://example.com/scholarsinn',
    bookingNote: 'Check availability on booking partner portal. No walk-in guarantee.',
    coordinates: { lat: 37.7715, lng: -122.4225, mapX: 18, mapY: 82 },
    shortDescription: 'Modern boutique rooms featuring ergonomic workstations, kitchenette options, and express checkout.'
  },

  // Resorts
  {
    id: 'resort-1',
    name: 'Lakeview Pine Resort & Spa',
    category: 'resorts',
    distanceMeters: 3400,
    distanceKm: 3.4,
    address: '1000 Lake Shore Drive',
    area: 'Pine Valley Lakefront',
    isOpen: true,
    openingHours: '24/7 Concierge',
    lastCheckedTime: 'Verified 30m ago',
    priceRange: '$$$$',
    amenities: ['Heated Pool', 'Full Spa & Sauna', 'Waterfront Dining', 'Valet Parking', 'Wheelchair Accessible'],
    rating: 4.9,
    reviewsCount: 512,
    contactUrl: 'https://example.com/lakeviewresort',
    isSponsored: true,
    sponsoredDisclosure: 'Sponsored Partner Listing - Verified Campus Hospitality Partner',
    bookingNote: 'Check availability on Lakeview resort reservation portal.',
    coordinates: { lat: 37.782, lng: -122.435, mapX: 84, mapY: 14 },
    shortDescription: 'Premier retreat surrounded by pine forest and lakeside views, with full wellness facilities and fine dining.'
  },
  {
    id: 'resort-2',
    name: 'Hillside Eco-Sanctuary Lodges',
    category: 'resorts',
    distanceMeters: 4800,
    distanceKm: 4.8,
    address: '250 Ridge Crest Overlook',
    area: 'Northern Foothills',
    isOpen: true,
    openingHours: '8:00 AM - 10:00 PM Reception',
    lastCheckedTime: 'Verified 2h ago',
    priceRange: '$$$',
    amenities: ['Solar Powered', 'Nature Trails', 'Organic Breakfast Included', 'Panoramic Deck'],
    rating: 4.7,
    reviewsCount: 188,
    contactUrl: 'https://example.com/hillsideeco',
    bookingNote: 'Check availability on provider website. Advance reservation recommended.',
    coordinates: { lat: 37.788, lng: -122.41, mapX: 92, mapY: 28 },
    shortDescription: 'Sustainable woodland cabins overlooking the valley, offering quiet retreats, bird-watching, and guided walks.'
  },

  // Essentials
  {
    id: 'essential-1',
    name: 'Campus Health Center & Pharmacy',
    category: 'essentials',
    distanceMeters: 140,
    distanceKm: 0.14,
    address: 'Health Sciences Wing, Ground Floor',
    area: 'Campus Core',
    isOpen: true,
    openingHours: '8:00 AM - 7:00 PM (Emergency 24/7)',
    lastCheckedTime: 'Verified 5m ago',
    priceRange: '$',
    amenities: ['Licensed Pharmacist', 'Wheelchair Ramp', 'First-Aid Supplies', 'Prescription Pickup'],
    rating: 4.7,
    reviewsCount: 175,
    contactUrl: 'https://example.com/healthpharmacy',
    bookingNote: 'Walk-in prescription drop-off; flu vaccines available without appointment.',
    coordinates: { lat: 37.7752, lng: -122.4201, mapX: 38, mapY: 42 },
    shortDescription: 'Full-service campus pharmacy providing over-the-counter medicine, first-aid, mobility aids, and health advice.'
  },
  {
    id: 'essential-2',
    name: 'Campus Express ATM & Postal Hub',
    category: 'essentials',
    distanceMeters: 90,
    distanceKm: 0.09,
    address: 'Student Services Breezeway',
    area: 'Campus Core',
    isOpen: true,
    openingHours: '24/7 Accessible',
    lastCheckedTime: 'Verified 10m ago',
    priceRange: '$',
    amenities: ['Multi-Bank ATM', 'Package Lockers', 'Wheelchair Height Accessible', 'Surveillance Monitored'],
    rating: 4.5,
    reviewsCount: 92,
    contactUrl: 'https://example.com/atmhub',
    bookingNote: 'No booking needed. Accessible 24 hours with student ID or card entry.',
    coordinates: { lat: 37.7746, lng: -122.4198, mapX: 47, mapY: 46 },
    shortDescription: '24/7 ATMs supporting major networks, automated stamp dispenser, and secure parcel collection lockers.'
  }
];

export const TOURIST_DESTINATIONS: TouristDestinationItem[] = [
  {
    id: 'dest-1',
    name: 'State Heritage Art Museum',
    type: 'Cultural & History Museum',
    isOpen: true,
    openingHours: '10:00 AM - 6:00 PM (Closed Mondays)',
    lastCheckedTime: 'Verified today at 9:30 AM',
    entryFee: '$8.00 General / Free with Student ID / Children under 12 Free',
    shortDescription: 'Renowned regional art museum housing historic artifacts, classical paintings, and rotating contemporary exhibits.',
    highlights: ['Impressionist Wing', 'Sculpture Courtyard', 'Tactile Sensory Gallery', 'Museum Café'],
    sourceUrl: 'https://example.com/heritage-museum',
    isVerified: true,
    stepFreeAccess: true,
    coordinates: { lat: 37.768, lng: -122.412, mapX: 74, mapY: 62 }
  },
  {
    id: 'dest-2',
    name: 'Central Botanical Conservatory & Palm House',
    type: 'Botanical Gardens & Arboreta',
    isOpen: true,
    openingHours: '9:00 AM - 7:00 PM Daily',
    lastCheckedTime: 'Verified today at 8:45 AM',
    entryFee: '$5.00 Standard / $3.00 Students & Seniors',
    shortDescription: 'Victorian glass conservatory featuring rare exotic flora, tropical rainforest biomes, and sensory fragrance paths.',
    highlights: ['Giant Water Lilies', 'Carnivorous Plant Terrarium', 'Paved Wheelchair Path', 'Butterfly Pavilion'],
    sourceUrl: 'https://example.com/botanical-conservatory',
    isVerified: true,
    stepFreeAccess: true,
    coordinates: { lat: 37.771, lng: -122.428, mapX: 20, mapY: 44 }
  },
  {
    id: 'dest-3',
    name: 'Lakeside Promontory & Sunset Beach',
    type: 'Scenic Park & Waterfront',
    isOpen: true,
    openingHours: 'Sunrise to 10:00 PM Daily',
    lastCheckedTime: 'Verified today at 7:00 AM',
    entryFee: 'Free Public Access (Parking $2.00/hr)',
    shortDescription: 'Panoramic freshwater lakefront park with paved promenade, kayak rentals, wooden pier, and picnic groves.',
    highlights: ['Sunset Viewing Deck', 'Kayak Launch Dock', 'Paved Bike & Stroller Trail', 'Waterfront Kiosks'],
    sourceUrl: 'https://example.com/lakeside-promontory',
    isVerified: true,
    stepFreeAccess: true,
    coordinates: { lat: 37.785, lng: -122.438, mapX: 86, mapY: 18 }
  },
  {
    id: 'dest-4',
    name: 'Summit Hill Observatory & Skywalk',
    type: 'Science Center & Panoramic Lookout',
    isOpen: true,
    openingHours: '12:00 PM - 10:30 PM (Stargazing sessions from 8:00 PM)',
    lastCheckedTime: 'Verified today at 10:00 AM',
    entryFee: '$10.00 Admission / Free entry to terrace lookout',
    shortDescription: 'Historic domed telescope facility atop Summit Hill offering 360-degree city views and evening astronomy viewings.',
    highlights: ['Historic 24-inch Refractor Telescope', '360° Viewing Deck', 'Solar Observation Dome', 'Gift Shop'],
    sourceUrl: 'https://example.com/summit-observatory',
    isVerified: true,
    stepFreeAccess: true,
    coordinates: { lat: 37.792, lng: -122.418, mapX: 62, mapY: 10 }
  },
  {
    id: 'dest-5',
    name: 'Old Town Historic Artisan Quarter',
    type: 'Historic Landmark District',
    isOpen: true,
    openingHours: 'Open pedestrian district (Shops usually 10 AM - 8 PM)',
    lastCheckedTime: 'Verified today at 9:00 AM',
    entryFee: 'Free Public Access',
    shortDescription: 'Cobblestone pedestrian-friendly heritage enclave with restored 19th-century architecture, local studios, and food markets.',
    highlights: ['Open-air Street Musicians', 'Handmade Craft Stalls', 'Heritage Clocktower', 'Historical Murals'],
    sourceUrl: 'https://example.com/oldtown-quarter',
    isVerified: true,
    stepFreeAccess: false, // Notable contrast for accessibility advice
    coordinates: { lat: 37.764, lng: -122.422, mapX: 44, mapY: 88 }
  }
];

export const SAMPLE_TRANSPORT_ROUTES: Record<string, TransportRouteOption[]> = {
  // Routes to State Heritage Art Museum (dest-1)
  'dest-1': [
    {
      id: 'route-dest-1-bus',
      destinationId: 'dest-1',
      mode: 'bus',
      modeName: 'City Bus Route 12 (Direct)',
      estimatedJourneyMinutes: 16,
      estimatedFare: '$2.25',
      fareCurrency: 'USD',
      transfersCount: 0,
      startStop: 'Campus Transit Bay 2 (120m walk)',
      destStop: 'Museum Road Station (East Entrance)',
      routeSummary: 'Walk 4 mins to Campus Bay 2 → Take Route 12 Bus (8 mins, 4 stops) → Get off at Museum Road → Walk 4 mins (Step-free).',
      stepFreeAccessible: true,
      scheduleFrequency: 'Every 8-10 minutes',
      emissionsEstimate: '0.12 kg CO2 (Low)',
      steps: [
        {
          stepNumber: 1,
          modeType: 'walk',
          instruction: 'Walk south along Main Quad paved ramp to Campus Transit Bay 2',
          durationMinutes: 4,
          detail: 'Step-free tactile pavement along walkway',
          isStepFree: true
        },
        {
          stepNumber: 2,
          modeType: 'bus',
          instruction: 'Board Route 12 Bus toward Civic Center',
          durationMinutes: 8,
          routeCode: 'Route 12',
          detail: 'Low-floor kneeling bus with 2 dedicated wheelchair bays',
          isStepFree: true
        },
        {
          stepNumber: 3,
          modeType: 'walk',
          instruction: 'Disembark at Museum Road Station and follow paved plaza to main museum doors',
          durationMinutes: 4,
          detail: 'Automatic glass entrance doors and elevator at museum lobby',
          isStepFree: true
        }
      ]
    },
    {
      id: 'route-dest-1-train',
      destinationId: 'dest-1',
      mode: 'train',
      modeName: 'Suburban Rapid Metro Line 1',
      estimatedJourneyMinutes: 14,
      estimatedFare: '$3.00',
      fareCurrency: 'USD',
      transfersCount: 0,
      startStop: 'University Station (Underground)',
      destStop: 'Cultural District Metro Station',
      routeSummary: 'Walk 5 mins to University Metro → Take Southbound Line 1 (6 mins, 2 stops) → Exit at Cultural District → Walk 3 mins.',
      stepFreeAccessible: true,
      scheduleFrequency: 'Every 6 minutes',
      emissionsEstimate: '0.08 kg CO2 (Very Low)',
      steps: [
        {
          stepNumber: 1,
          modeType: 'walk',
          instruction: 'Take elevator down to University Metro Concourse',
          durationMinutes: 5,
          isStepFree: true
        },
        {
          stepNumber: 2,
          modeType: 'train',
          instruction: 'Board Southbound Line 1 Train toward Metro Center',
          durationMinutes: 6,
          routeCode: 'Line 1 Blue',
          detail: 'Level boarding platform with tactile guidance',
          isStepFree: true
        },
        {
          stepNumber: 3,
          modeType: 'walk',
          instruction: 'Take Exit 2 elevator up to Art Museum Plaza',
          durationMinutes: 3,
          isStepFree: true
        }
      ]
    },
    {
      id: 'route-dest-1-taxi',
      destinationId: 'dest-1',
      mode: 'taxi',
      modeName: 'Taxi or Ride-Hail (Campus Stand)',
      estimatedJourneyMinutes: 9,
      estimatedFare: '$8.50 - $11.00',
      fareCurrency: 'USD',
      transfersCount: 0,
      startStop: 'Campus Help Desk Circle Pickup',
      destStop: 'Museum Porte-Cochère Dropoff',
      routeSummary: 'Direct ride via University Ave and 5th Street (1.8 miles).',
      stepFreeAccessible: true,
      emissionsEstimate: '0.45 kg CO2',
      steps: [
        {
          stepNumber: 1,
          modeType: 'walk',
          instruction: 'Walk 1 minute to designated campus taxi curb',
          durationMinutes: 1,
          isStepFree: true
        },
        {
          stepNumber: 2,
          modeType: 'taxi',
          instruction: 'Direct vehicular transit along University Ave',
          durationMinutes: 8,
          detail: 'Wheelchair-accessible WAV vehicles available on request',
          isStepFree: true
        }
      ]
    },
    {
      id: 'route-dest-1-auto',
      destinationId: 'dest-1',
      mode: 'auto_rickshaw',
      modeName: 'Auto-Rickshaw / E-Shuttle',
      estimatedJourneyMinutes: 11,
      estimatedFare: '$4.50 (₹60 demo eq)',
      fareCurrency: 'USD',
      transfersCount: 0,
      startStop: 'East Gate Auto-Rickshaw Stand',
      destStop: 'Museum West Gate Curb',
      routeSummary: 'Breezy short-haul ride across campus perimeter boulevard.',
      stepFreeAccessible: false,
      steps: [
        {
          stepNumber: 1,
          modeType: 'walk',
          instruction: 'Walk 3 mins to East Gate Stand',
          durationMinutes: 3,
          isStepFree: true
        },
        {
          stepNumber: 2,
          modeType: 'auto',
          instruction: 'Ride metered auto-rickshaw through side streets',
          durationMinutes: 8,
          detail: 'Cash or digital QR code fare payment',
          isStepFree: false
        }
      ]
    },
    {
      id: 'route-dest-1-walk',
      destinationId: 'dest-1',
      mode: 'walking',
      modeName: 'Pedestrian Step-Free Walk',
      estimatedJourneyMinutes: 22,
      estimatedFare: 'Free',
      fareCurrency: 'USD',
      transfersCount: 0,
      startStop: 'Campus Help Desk',
      destStop: 'Museum Front Plaza',
      routeSummary: 'Pleasant 1.1 mile walk through Arboretum Path and Sculpture Grove (100% paved, step-free).',
      stepFreeAccessible: true,
      emissionsEstimate: 'Zero CO2',
      steps: [
        {
          stepNumber: 1,
          modeType: 'walk',
          instruction: 'Head south past Library Lawn along tree-lined paved path',
          durationMinutes: 10,
          isStepFree: true
        },
        {
          stepNumber: 2,
          modeType: 'walk',
          instruction: 'Cross University Blvd at the signalized pedestrian crossing with audible cues',
          durationMinutes: 4,
          isStepFree: true
        },
        {
          stepNumber: 3,
          modeType: 'walk',
          instruction: 'Walk through Sculpture Grove directly into Museum courtyard',
          durationMinutes: 8,
          isStepFree: true
        }
      ]
    },
    {
      id: 'route-dest-1-drive',
      destinationId: 'dest-1',
      mode: 'driving',
      modeName: 'Personal Vehicle / Driving',
      estimatedJourneyMinutes: 8,
      estimatedFare: '$4.00 (Parking)',
      fareCurrency: 'USD',
      transfersCount: 0,
      startStop: 'Campus Visitor Lot 3',
      destStop: 'Museum Underground Parking Garage',
      routeSummary: 'Quick drive down University Way; garage has 12 designated ADA parking spots.',
      stepFreeAccessible: true,
      steps: [
        {
          stepNumber: 1,
          modeType: 'drive',
          instruction: 'Drive south on University Way toward 5th Street',
          durationMinutes: 6,
          isStepFree: true
        },
        {
          stepNumber: 2,
          modeType: 'walk',
          instruction: 'Take garage elevator up to ground level museum atrium',
          durationMinutes: 2,
          isStepFree: true
        }
      ]
    }
  ],

  // Fallback / default generated for other destinations
  'dest-2': [
    {
      id: 'route-dest-2-bus',
      destinationId: 'dest-2',
      mode: 'bus',
      modeName: 'Green Line Campus Bus #4',
      estimatedJourneyMinutes: 12,
      estimatedFare: '$1.50',
      fareCurrency: 'USD',
      transfersCount: 0,
      startStop: 'Campus Center Loop',
      destStop: 'Palm House Conservatory Stop',
      routeSummary: 'Direct shuttle: Walk 2 mins to Campus Loop → Bus #4 (7 mins) → Arrive at Conservatory Gate.',
      stepFreeAccessible: true,
      steps: [
        {
          stepNumber: 1,
          modeType: 'walk',
          instruction: 'Walk west to Campus Center Loop bus shelter',
          durationMinutes: 2,
          isStepFree: true
        },
        {
          stepNumber: 2,
          modeType: 'bus',
          instruction: 'Ride Green Line Shuttle #4 (3 stops)',
          durationMinutes: 7,
          routeCode: 'Bus #4',
          isStepFree: true
        },
        {
          stepNumber: 3,
          modeType: 'walk',
          instruction: 'Enter via Conservatory step-free ramp entrance',
          durationMinutes: 3,
          isStepFree: true
        }
      ]
    },
    {
      id: 'route-dest-2-walk',
      destinationId: 'dest-2',
      mode: 'walking',
      modeName: 'Botanical Walkway (Direct)',
      estimatedJourneyMinutes: 15,
      estimatedFare: 'Free',
      fareCurrency: 'USD',
      transfersCount: 0,
      startStop: 'Campus Help Desk',
      destStop: 'Conservatory West Porch',
      routeSummary: 'Scenic 0.7-mile shaded walkway through student gardens.',
      stepFreeAccessible: true,
      steps: [
        {
          stepNumber: 1,
          modeType: 'walk',
          instruction: 'Follow paved garden path past Greenhouse Concourse',
          durationMinutes: 15,
          isStepFree: true
        }
      ]
    }
  ],

  'dest-3': [
    {
      id: 'route-dest-3-bus',
      destinationId: 'dest-3',
      mode: 'bus',
      modeName: 'Lakeside Express Bus 88',
      estimatedJourneyMinutes: 24,
      estimatedFare: '$2.75',
      fareCurrency: 'USD',
      transfersCount: 0,
      startStop: 'North Transit Hub Bay 4',
      destStop: 'Lakeside Beach Terminal',
      routeSummary: 'Walk 6 mins to North Transit Hub → Bus 88 Express (14 mins) → Disembark at Beach Promenade.',
      stepFreeAccessible: true,
      steps: [
        {
          stepNumber: 1,
          modeType: 'walk',
          instruction: 'Walk north to North Transit Hub Bay 4',
          durationMinutes: 6,
          isStepFree: true
        },
        {
          stepNumber: 2,
          modeType: 'bus',
          instruction: 'Board Bus 88 Express toward Lake Shore',
          durationMinutes: 14,
          routeCode: 'Bus 88',
          isStepFree: true
        },
        {
          stepNumber: 3,
          modeType: 'walk',
          instruction: 'Walk 4 mins along boardwalk to Sunset Beach',
          durationMinutes: 4,
          isStepFree: true
        }
      ]
    },
    {
      id: 'route-dest-3-taxi',
      destinationId: 'dest-3',
      mode: 'taxi',
      modeName: 'CityRide / Taxi',
      estimatedJourneyMinutes: 14,
      estimatedFare: '$14.00 - $18.00',
      fareCurrency: 'USD',
      transfersCount: 0,
      startStop: 'Campus Help Desk Stand',
      destStop: 'Lakeside Pavilion Dropoff',
      routeSummary: 'Direct drive via Lake Shore Expressway (3.4 miles).',
      stepFreeAccessible: true,
      steps: [
        {
          stepNumber: 1,
          modeType: 'taxi',
          instruction: 'Direct ride along Lake Shore Expressway',
          durationMinutes: 14,
          isStepFree: true
        }
      ]
    }
  ]
};

export const INITIAL_SETTINGS: SettingsState = {
  locationName: 'Campus Help Desk',
  demoMode: true,
  soundAlerts: true,
  highSeverityToasts: true,
  detectionSensitivity: 'medium',
  autoDismissResolved: false,
  theme: 'navy',
  density: 'comfortable',
  reducedMotion: false,
  currency: 'USD'
};
