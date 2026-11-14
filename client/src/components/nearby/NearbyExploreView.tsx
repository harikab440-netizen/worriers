import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Search,
  Filter,
  Navigation,
  ExternalLink,
  Bus,
  Train,
  Car,
  Footprints,
  Sparkles,
  Star,
  CheckCircle2,
  AlertCircle,
  Info,
  Shield,
  Layers,
  ShoppingBag,
  Hotel,
  UtensilsCrossed,
  PlusCircle,
  ArrowRight,
  Check,
  X
} from 'lucide-react';
import { useQueueSight } from '../../context/QueueSightContext';
import { NEARBY_PLACES, TOURIST_DESTINATIONS } from '../../data/mockData';
import { PlaceCategory, NearbyPlaceItem, TransportMode } from '@campus/shared';

export const NearbyExploreView: React.FC = () => {
  const {
    visitorLocation,
    requestBrowserLocation,
    setManualLocation,
    clearVisitorLocation,
    selectedCategory,
    setSelectedCategory,
    selectedDestinationId,
    setSelectedDestinationId,
    selectedTransportMode,
    setSelectedTransportMode,
    currentRouteOptions,
    planTripToPlace
  } = useQueueSight();

  const [nearbyViewMode, setNearbyViewMode] = useState<'split' | 'list' | 'map'>('split');
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationSearchQuery, setDestinationSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'places' | 'destinations' | 'transit'>('places');

  // Filters
  const [distanceRadius, setDistanceRadius] = useState<number>(5.0); // in km
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyStepFree, setOnlyStepFree] = useState<boolean>(false);
  const [manualInputOpen, setManualInputOpen] = useState(false);
  const [customLocationText, setCustomLocationText] = useState('');
  const [selectedPlaceForModal, setSelectedPlaceForModal] = useState<NearbyPlaceItem | null>(null);
  const [showComparisonMatrix, setShowComparisonMatrix] = useState(false);

  // Filter Nearby Places
  const filteredPlaces = NEARBY_PLACES.filter((place) => {
    if (selectedCategory !== 'all' && place.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        place.name.toLowerCase().includes(q) ||
        place.area.toLowerCase().includes(q) ||
        place.category.toLowerCase().includes(q) ||
        place.amenities.some((a) => a.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (place.distanceKm > distanceRadius) return false;
    if (priceFilter !== 'all' && place.priceRange !== priceFilter) return false;
    if (minRating > 0 && place.rating < minRating) return false;
    if (onlyStepFree && !place.amenities.some((a) => a.toLowerCase().includes('wheelchair') || a.toLowerCase().includes('step-free'))) {
      return false;
    }
    return true;
  });

  // Filter Tourist Destinations
  const filteredDestinations = TOURIST_DESTINATIONS.filter((dest) => {
    if (destinationSearchQuery.trim() === '') return true;
    const q = destinationSearchQuery.toLowerCase();
    return (
      dest.name.toLowerCase().includes(q) ||
      dest.type.toLowerCase().includes(q) ||
      dest.shortDescription.toLowerCase().includes(q) ||
      dest.highlights.some((h) => h.toLowerCase().includes(q))
    );
  });

  const currentDestination =
    TOURIST_DESTINATIONS.find((d) => d.id === selectedDestinationId) || TOURIST_DESTINATIONS[0];

  const currentRoute =
    currentRouteOptions.find((r) => r.mode === selectedTransportMode) || currentRouteOptions[0];

  const categories: { id: PlaceCategory | 'all'; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'All Places', icon: Compass },
    { id: 'shops', label: 'Shops', icon: ShoppingBag },
    { id: 'lodges', label: 'Lodges', icon: Hotel },
    { id: 'resorts', label: 'Resorts', icon: Hotel },
    { id: 'food', label: 'Food & Cafés', icon: UtensilsCrossed },
    { id: 'essentials', label: 'Essentials & ATM', icon: PlusCircle }
  ];

  const presets = [
    { label: 'Campus Help Desk (Main Quad)', lat: 37.7749, lng: -122.4194 },
    { label: 'East Gate Transit Center', lat: 37.7765, lng: -122.4162 },
    { label: 'Central Library Lawn', lat: 37.7738, lng: -122.4215 },
    { label: 'Health Science Pavilion', lat: 37.7752, lng: -122.4201 }
  ];

  return (
    <div className="space-y-6">
      {/* Privacy and Demo Mode Guarantee Banner */}
      <div className="rounded-2xl bg-navy-900 border border-navy-800 p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start md:items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Nearby & Explore Visitor Concierge</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Demo Mode • Fictional Sample Data
              </span>
            </div>
            <p className="text-slate-400 mt-0.5 max-w-2xl">
              All displayed businesses, lodges, resorts, transit routes, and fares are sample demonstration records. Real-world bookings and real-time transit require integration with official regional providers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-teal-400 font-medium flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy Preserved</span>
          </span>
        </div>
      </div>

      {/* Visitor Location & Permission Bar */}
      <div className="rounded-2xl bg-navy-900 border border-navy-800 p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Visitor Starting Location:</span>
                <span className="font-bold text-sm text-white">{visitorLocation.label}</span>
                {visitorLocation.isManual && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-navy-800 text-teal-300 border border-navy-700">
                    Manual
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500">{visitorLocation.lastUpdated}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={requestBrowserLocation}
              className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-navy-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              title="Requests browser GPS geolocation upon your click"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Use My Location</span>
            </button>

            <button
              onClick={() => setManualInputOpen(!manualInputOpen)}
              className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-750 text-xs font-semibold transition-colors"
            >
              Enter Manually
            </button>

            <button
              onClick={clearVisitorLocation}
              className="px-2.5 py-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
              title="Reset location to Campus Desk default"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Location error message if permission was denied */}
        {visitorLocation.error && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div className="space-y-1">
              <p className="font-semibold">{visitorLocation.error}</p>
              <p className="text-slate-400">
                You can easily click any preset below or type a custom address to continue exploring routes.
              </p>
            </div>
          </div>
        )}

        {/* Manual Location Preset Dropdown / Input Drawer */}
        {manualInputOpen && (
          <div className="pt-3 border-t border-navy-800 space-y-2">
            <span className="text-xs font-semibold text-slate-300">Quick Campus Presets:</span>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setManualLocation(preset.label, preset.lat, preset.lng);
                    setManualInputOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-navy-850 hover:bg-navy-800 text-slate-300 border border-navy-700 text-xs transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 max-w-md">
              <input
                type="text"
                placeholder="Or type a building, gate, or address..."
                value={customLocationText}
                onChange={(e) => setCustomLocationText(e.target.value)}
                className="w-full bg-navy-950 border border-navy-750 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
              <button
                onClick={() => {
                  if (customLocationText.trim()) {
                    setManualLocation(customLocationText.trim());
                    setCustomLocationText('');
                    setManualInputOpen(false);
                  }
                }}
                disabled={!customLocationText.trim()}
                className="px-3 py-1.5 rounded-lg bg-teal-500 text-navy-950 font-bold text-xs disabled:opacity-50 shrink-0"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sub-Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-navy-800 pb-2">
        <button
          onClick={() => setActiveSection('places')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSection === 'places'
              ? 'bg-teal-500 text-navy-950 shadow-md shadow-teal-500/20'
              : 'bg-navy-900 text-slate-300 hover:bg-navy-850 border border-navy-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Nearby Shops, Lodges & Food</span>
        </button>

        <button
          onClick={() => setActiveSection('destinations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSection === 'destinations'
              ? 'bg-teal-500 text-navy-950 shadow-md shadow-teal-500/20'
              : 'bg-navy-900 text-slate-300 hover:bg-navy-850 border border-navy-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Tourist Destinations</span>
        </button>

        <button
          onClick={() => setActiveSection('transit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSection === 'transit'
              ? 'bg-teal-500 text-navy-950 shadow-md shadow-teal-500/20'
              : 'bg-navy-900 text-slate-300 hover:bg-navy-850 border border-navy-800'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>Transport & Trip Planner</span>
        </button>
      </div>

      {/* SECTION 1: NEARBY SHOPS, LODGES, RESORTS, FOOD, ESSENTIALS */}
      {activeSection === 'places' && (
        <div className="space-y-5">
          {/* Category Filter Pills & Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        : 'bg-navy-900 text-slate-400 hover:text-slate-200 border border-navy-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle: Split / List / Map */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter nearby places..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-navy-900 border border-navy-750 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400 w-48"
                />
              </div>

              <div className="bg-navy-900 border border-navy-800 rounded-lg p-0.5 flex items-center text-xs">
                <button
                  onClick={() => setNearbyViewMode('split')}
                  className={`px-2 py-1 rounded font-medium transition-colors ${
                    nearbyViewMode === 'split' ? 'bg-navy-750 text-white' : 'text-slate-400'
                  }`}
                  title="Show Split Map & List"
                >
                  Split
                </button>
                <button
                  onClick={() => setNearbyViewMode('list')}
                  className={`px-2 py-1 rounded font-medium transition-colors ${
                    nearbyViewMode === 'list' ? 'bg-navy-750 text-white' : 'text-slate-400'
                  }`}
                  title="List Only"
                >
                  List
                </button>
                <button
                  onClick={() => setNearbyViewMode('map')}
                  className={`px-2 py-1 rounded font-medium transition-colors ${
                    nearbyViewMode === 'map' ? 'bg-navy-750 text-white' : 'text-slate-400'
                  }`}
                  title="Map Only"
                >
                  Map
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Filters Bar: Radius, Price, Min Rating, Accessibility */}
          <div className="flex flex-wrap items-center gap-3 bg-navy-900/60 border border-navy-800 rounded-xl px-4 py-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-semibold">
              <Filter className="w-3 h-3" /> Filters:
            </span>

            {/* Distance Slider / Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Distance:</span>
              <select
                value={distanceRadius}
                onChange={(e) => setDistanceRadius(Number(e.target.value))}
                className="bg-navy-850 border border-navy-750 text-slate-200 rounded px-2 py-0.5 text-xs focus:outline-none"
              >
                <option value={0.5}>Within 500m</option>
                <option value={1.0}>Within 1.0 km</option>
                <option value={3.0}>Within 3.0 km</option>
                <option value={5.0}>All distances (&lt; 5km)</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Price:</span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="bg-navy-850 border border-navy-750 text-slate-200 rounded px-2 py-0.5 text-xs focus:outline-none"
              >
                <option value="all">Any Price</option>
                <option value="$">$ (Budget)</option>
                <option value="$$">$$ (Moderate)</option>
                <option value="$$$">$$$ (Upscale)</option>
                <option value="$$$$">$$$$ (Resort Luxury)</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="bg-navy-850 border border-navy-750 text-slate-200 rounded px-2 py-0.5 text-xs focus:outline-none"
              >
                <option value={0}>Any Rating</option>
                <option value={4.0}>4.0+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.8}>4.8+ Stars</option>
              </select>
            </div>

            {/* Step-Free Accessibility Checkbox */}
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 ml-auto">
              <input
                type="checkbox"
                checked={onlyStepFree}
                onChange={(e) => setOnlyStepFree(e.target.checked)}
                className="rounded bg-navy-850 border-navy-700 text-teal-500 focus:ring-0"
              />
              <span>Wheelchair / Step-Free Only</span>
            </label>
          </div>

          {/* Main Layout: Split (Map + List) or Single Mode */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cards List Section */}
            {(nearbyViewMode === 'split' || nearbyViewMode === 'list') && (
              <div className={`${nearbyViewMode === 'split' ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>Showing {filteredPlaces.length} places near {visitorLocation.label}</span>
                  <span>Click 'Directions' to plan route</span>
                </div>

                {filteredPlaces.length === 0 ? (
                  <div className="py-12 text-center rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
                    <Info className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-sm font-semibold text-slate-200">No matching places found</p>
                    <p className="text-xs text-slate-400">Try expanding the distance radius or clearing price filters.</p>
                  </div>
                ) : (
                  filteredPlaces.map((place) => (
                    <div
                      key={place.id}
                      className={`rounded-2xl border p-5 shadow-lg transition-all ${
                        place.isSponsored
                          ? 'bg-navy-900 border-amber-500/40 ring-1 ring-amber-500/20'
                          : 'bg-navy-900 border-navy-800 hover:border-navy-750'
                      }`}
                    >
                      {/* Sponsored Listing Clear Badge */}
                      {place.isSponsored && (
                        <div className="mb-3 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-[11px] font-semibold text-amber-300 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            {place.sponsoredDisclosure}
                          </span>
                          <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">
                            Sponsored Partner
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-white text-base">{place.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-navy-800 text-teal-300 border border-navy-700">
                              {place.category}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              {place.distanceKm < 1
                                ? `${place.distanceMeters}m away`
                                : `${place.distanceKm} km away`}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span>{place.address}</span>
                            <span>•</span>
                            <span className="text-teal-400 font-medium">{place.openingHours}</span>
                            <span>•</span>
                            <span className="text-slate-500 text-[11px]">{place.lastCheckedTime}</span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed pt-1">
                            {place.shortDescription}
                          </p>

                          {/* Amenities Tags */}
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {place.amenities.map((amenity) => (
                              <span
                                key={amenity}
                                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-navy-850 text-slate-300 border border-navy-750"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>

                          {/* Lodges/Resorts Availability Guarantee Notice */}
                          {(place.category === 'lodges' || place.category === 'resorts') && (
                            <div className="mt-2 text-[11px] text-amber-300/90 flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg">
                              <Info className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                              <span>{place.bookingNote}</span>
                            </div>
                          )}
                        </div>

                        {/* Right side stats & buttons */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0">
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="font-bold text-white">{place.rating}</span>
                            <span className="text-slate-400">({place.reviewsCount})</span>
                            <span className="font-mono text-teal-400 ml-1 font-bold">{place.priceRange}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {place.contactUrl && (
                              <a
                                href={place.contactUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-300 border border-navy-700 text-xs font-medium flex items-center gap-1 transition-colors"
                              >
                                <span>Check Availability</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            <button
                              onClick={() => {
                                planTripToPlace(place);
                                setActiveSection('transit');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-navy-950 font-bold text-xs flex items-center gap-1 transition-colors shadow-sm"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>Directions</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Interactive SVG Map Section */}
            {(nearbyViewMode === 'split' || nearbyViewMode === 'map') && (
              <div className={`${nearbyViewMode === 'split' ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
                <div className="sticky top-24 rounded-2xl bg-navy-900 border border-navy-800 p-4 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-teal-400" />
                      <span>Interactive Area Map</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-850 text-teal-300 border border-navy-750">
                      Scale: 1:5,000 (Local Grid)
                    </span>
                  </div>

                  {/* SVG Map Canvas */}
                  <div className="relative aspect-square w-full rounded-xl bg-[#080d19] border border-navy-800 overflow-hidden shadow-inner">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Streets / Paths Graphic */}
                      <rect width="100" height="100" fill="#080d19" />
                      {/* Campus Greens */}
                      <circle cx="50" cy="50" r="28" fill="#0c1825" stroke="#132438" strokeWidth="0.5" />
                      {/* Main Avenues */}
                      <line x1="0" y1="50" x2="100" y2="50" stroke="#1c2842" strokeWidth="2.5" />
                      <line x1="50" y1="0" x2="50" y2="100" stroke="#1c2842" strokeWidth="2.5" />
                      <circle cx="50" cy="50" r="14" fill="none" stroke="#243456" strokeWidth="1" strokeDasharray="2,2" />

                      {/* User Location Pin */}
                      <g transform="translate(50, 50)">
                        <circle r="5" fill="#14b8a6" fillOpacity="0.2" className="animate-ping" />
                        <circle r="3" fill="#14b8a6" stroke="#ffffff" strokeWidth="0.8" />
                        <text y="7" textAnchor="middle" fontSize="3" fill="#14b8a6" fontWeight="bold">
                          You
                        </text>
                      </g>

                      {/* Map Pins for Nearby Places */}
                      {filteredPlaces.map((p) => {
                        const isFood = p.category === 'food';
                        const isLodge = p.category === 'lodges' || p.category === 'resorts';
                        const pinColor = isFood ? '#fbbf24' : isLodge ? '#a855f7' : '#38bdf8';
                        return (
                          <g
                            key={p.id}
                            transform={`translate(${p.coordinates.mapX}, ${p.coordinates.mapY})`}
                            className="cursor-pointer group"
                            onClick={() => setSelectedPlaceForModal(p)}
                          >
                            <circle r="2.8" fill={pinColor} stroke="#080d19" strokeWidth="0.6" />
                            <text
                              y="-4"
                              textAnchor="middle"
                              fontSize="2.4"
                              fill="#cbd5e1"
                              className="group-hover:fill-teal-300 font-medium select-none"
                            >
                              {p.name.split(' ')[0]}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Map Legend Floating */}
                    <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-navy-950/85 backdrop-blur-sm border border-navy-800 text-[10px] text-slate-300 flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-teal-400" />
                        <span>You</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Food</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        <span>Lodges</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        <span>Shops/Essentials</span>
                      </div>
                    </div>
                  </div>

                  {/* Selected Marker Detail Card */}
                  {selectedPlaceForModal && (
                    <div className="p-3.5 rounded-xl bg-navy-850 border border-teal-500/40 space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{selectedPlaceForModal.name}</span>
                        <button
                          onClick={() => setSelectedPlaceForModal(null)}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-300">{selectedPlaceForModal.shortDescription}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-teal-300">{selectedPlaceForModal.distanceMeters}m away • {selectedPlaceForModal.priceRange}</span>
                        <button
                          onClick={() => {
                            planTripToPlace(selectedPlaceForModal);
                            setActiveSection('transit');
                          }}
                          className="px-2.5 py-1 rounded bg-teal-500 text-navy-950 font-bold text-[11px]"
                        >
                          Directions
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 text-center">
                    Click any marker on the map to inspect details or get step-free directions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: TOURIST DESTINATIONS */}
      {activeSection === 'destinations' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-white">Tourist Attractions & Regional Landmarks</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Explore museums, conservatories, beaches, and scenic parks with verified opening status
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search attraction, museum, park..."
                value={destinationSearchQuery}
                onChange={(e) => setDestinationSearchQuery(e.target.value)}
                className="bg-navy-900 border border-navy-750 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400 w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDestinations.map((dest) => {
              const isSelected = selectedDestinationId === dest.id;
              return (
                <div
                  key={dest.id}
                  className={`rounded-2xl border p-5 shadow-lg flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-navy-900 border-teal-500/60 ring-1 ring-teal-500/30'
                      : 'bg-navy-900 border-navy-800 hover:border-navy-750'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                        {dest.type}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Open</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base">{dest.name}</h4>

                    <div className="text-xs text-slate-400 space-y-0.5">
                      <p className="text-slate-300 font-medium">Hours: {dest.openingHours}</p>
                      <p className="text-[11px] text-slate-500">{dest.lastCheckedTime}</p>
                      <p className="text-teal-300 font-medium pt-1">Entry: {dest.entryFee}</p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {dest.shortDescription}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {dest.highlights.map((h) => (
                        <span
                          key={h}
                          className="px-2 py-0.5 rounded bg-navy-850 text-slate-300 text-[10px] border border-navy-750"
                        >
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* Accessibility Note */}
                    <div className="text-[11px] text-slate-400 pt-1">
                      {dest.stepFreeAccess ? (
                        <span className="text-teal-400 font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" /> Step-free access & elevators verified
                        </span>
                      ) : (
                        <span className="text-amber-400 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Cobblestones / partial stair access
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-navy-800 flex items-center justify-between mt-4">
                    <a
                      href={dest.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 underline"
                    >
                      <span>Official Info</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => {
                        setSelectedDestinationId(dest.id);
                        setActiveSection('transit');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-navy-950 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <span>Plan Trip</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: TRANSPORT AND TRIP PLANNING */}
      {activeSection === 'transit' && (
        <div id="trip-planner-section" className="space-y-6">
          <div className="rounded-2xl bg-navy-900 border border-navy-800 p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-800">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Bus className="w-5 h-5 text-teal-400" />
                  <span>Public Transit & Route Navigator</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Multi-modal trip options from {visitorLocation.label} to {currentDestination.name}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowComparisonMatrix(!showComparisonMatrix)}
                  className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-teal-300 border border-navy-750 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{showComparisonMatrix ? 'Hide Comparison' : 'Compare All Modes'}</span>
                </button>
              </div>
            </div>

            {/* Travel Mode Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { mode: 'bus', label: 'City Bus', icon: Bus },
                { mode: 'train', label: 'Metro / Train', icon: Train },
                { mode: 'taxi', label: 'Taxi / Ride', icon: Car },
                { mode: 'auto_rickshaw', label: 'Auto-Rickshaw', icon: Compass },
                { mode: 'walking', label: 'Step-Free Walk', icon: Footprints },
                { mode: 'driving', label: 'Drive & Park', icon: Car }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = selectedTransportMode === item.mode;
                const opt = currentRouteOptions.find((r) => r.mode === item.mode);
                return (
                  <button
                    key={item.mode}
                    onClick={() => setSelectedTransportMode(item.mode as TransportMode)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-500/50 text-white shadow-md shadow-teal-500/10'
                        : 'bg-navy-850/70 border-navy-750 text-slate-400 hover:text-slate-200 hover:bg-navy-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
                      {opt && (
                        <span className="text-[10px] font-mono font-bold text-slate-300">
                          {opt.estimatedJourneyMinutes}m
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="text-xs font-bold block">{item.label}</span>
                      <span className="text-[10px] text-slate-400 block">
                        {opt?.estimatedFare || 'Estimate'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Comparison Matrix Table if toggled */}
            {showComparisonMatrix && (
              <div className="p-4 rounded-xl bg-navy-950 border border-navy-750 overflow-x-auto space-y-2 animate-in fade-in duration-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Transit Mode Comparison
                </span>
                <table className="w-full text-xs text-left text-slate-300">
                  <thead>
                    <tr className="border-b border-navy-800 text-[11px] text-slate-400 uppercase">
                      <th className="py-2">Mode</th>
                      <th className="py-2">Est. Journey Time</th>
                      <th className="py-2">Est. Cost</th>
                      <th className="py-2">Transfers</th>
                      <th className="py-2">Accessibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-850">
                    {currentRouteOptions.map((opt) => (
                      <tr key={opt.id} className="hover:bg-navy-900/50">
                        <td className="py-2.5 font-bold text-white capitalize">{opt.modeName}</td>
                        <td className="py-2.5 font-mono text-teal-300">{opt.estimatedJourneyMinutes} mins</td>
                        <td className="py-2.5 font-mono text-slate-200">{opt.estimatedFare}</td>
                        <td className="py-2.5">{opt.transfersCount === 0 ? 'Direct (0)' : `${opt.transfersCount} transfer`}</td>
                        <td className="py-2.5">
                          {opt.stepFreeAccessible ? (
                            <span className="text-teal-400 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Step-free
                            </span>
                          ) : (
                            <span className="text-slate-400">Standard curb</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Detailed Selected Route Summary & Step Timeline */}
            {currentRoute && (
              <div className="space-y-4 pt-2">
                <div className="rounded-xl bg-navy-850 border border-navy-750 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-teal-400 uppercase tracking-wide">
                        Selected Route Summary:
                      </span>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {currentRoute.routeSummary}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      <div className="px-2.5 py-1 rounded-lg bg-navy-900 font-mono text-teal-300 border border-navy-750">
                        Est. Time: {currentRoute.estimatedJourneyMinutes} mins
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-navy-900 font-mono text-slate-200 border border-navy-750">
                        Fare: {currentRoute.estimatedFare}
                      </div>
                    </div>
                  </div>

                  {/* Step-by-Step Stepper */}
                  <div className="space-y-2 pt-2 border-t border-navy-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Step-by-Step Directions:
                    </span>
                    <div className="space-y-2">
                      {currentRoute.steps.map((st) => (
                        <div key={st.stepNumber} className="flex items-start gap-3 text-xs">
                          <div className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                            {st.stepNumber}
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-slate-200 font-medium">{st.instruction}</p>
                            {st.detail && <p className="text-slate-400 text-[11px]">{st.detail}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic text-center">
                  Notice: Bus stop coordinates, travel times, and ticket estimates are modeled on published municipal demo schedules. Verify departure boards at the terminal.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
