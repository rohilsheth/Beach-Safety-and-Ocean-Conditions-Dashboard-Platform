'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Beach } from '@/lib/types';
import { beaches as fallbackBeaches } from '@/data/beaches';
import BeachList from '@/components/BeachList';
import BeachDetail from '@/components/BeachDetail';
import { Clock, AlertCircle } from 'lucide-react';
import { trackPageView, trackBeachView } from '@/lib/analytics';

// Dynamically import Map component with no SSR
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  const [beaches, setBeaches] = useState<Beach[]>(fallbackBeaches);
  const [selectedBeach, setSelectedBeach] = useState<Beach | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showMobileView, setShowMobileView] = useState<'list' | 'map'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveData, setIsLiveData] = useState(false);

  // Apply fixed viewport styling for dashboard (prevents main scroll)
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.style.overflow = 'hidden';
    }

    // Cleanup: restore scrolling when leaving dashboard
    return () => {
      if (mainElement) {
        mainElement.style.overflow = 'auto';
      }
    };
  }, []);

  // Fetch live beach data from API
  const fetchBeachData = async () => {
    try {
      setError(null);
      const response = await fetch('/api/beaches');

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setBeaches(result.data);
        setLastUpdated(new Date());
        setIsLiveData(true);
        console.log('✅ Live data loaded from:', result.sources);
      } else {
        throw new Error('Invalid API response');
      }
    } catch (err) {
      console.error('Error fetching beach data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load live data');
      setIsLiveData(false);
      // Keep using fallback data
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchBeachData();
    // Track page view
    trackPageView('/');
  }, []);

  // Real-time data refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBeachData();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Update selected beach when beaches data changes
  useEffect(() => {
    if (selectedBeach) {
      const updatedBeach = beaches.find((b) => b.id === selectedBeach.id);
      if (updatedBeach) {
        handleSelectBeach(updatedBeach);
      }
    }
  }, [beaches, selectedBeach]);

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleSelectBeach = (beach: Beach | null) => {
    setSelectedBeach(beach);
    if (beach) {
      // Track beach view
      trackBeachView(beach.id, beach.name);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Live Data Indicator - Always Visible */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <div className={`shadow-xl rounded-lg px-4 py-2 flex items-center gap-3 text-sm border-2 transition-all ${
          isLiveData
            ? 'bg-green-50 border-green-500'
            : 'bg-yellow-50 border-yellow-500'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full animate-pulse ${isLiveData ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className={`font-bold text-xs uppercase tracking-wide ${isLiveData ? 'text-green-700' : 'text-yellow-700'}`}>
              {isLiveData ? '🟢 LIVE DATA' : '⚠️ LOADING...'}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-600" />
            <span className="font-medium text-gray-700 text-xs">
              {formatTimestamp(lastUpdated)}
            </span>
          </div>
        </div>
        {isLiveData && (
          <div className="text-center mt-1">
            <span className="text-[10px] text-gray-600 bg-white/90 px-2 py-0.5 rounded-full">
              Auto-updates every 5 min
            </span>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 bg-yellow-50 border-2 border-yellow-400 rounded-lg px-4 py-2 flex items-center gap-2 text-sm max-w-md">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <span className="text-yellow-800">
            Using fallback data. {error}
          </span>
        </div>
      )}

      {/* Mobile View Toggle */}
      <div className="md:hidden flex gap-2 p-4 bg-white border-b border-gray-200">
        <button
          onClick={() => setShowMobileView('list')}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
            showMobileView === 'list'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Beach List
        </button>
        <button
          onClick={() => setShowMobileView('map')}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
            showMobileView === 'map'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Map View
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-12 flex-1 min-h-0">
        {/* Beach List Sidebar */}
        <div className="col-span-3 min-h-0 overflow-hidden">
          <BeachList
            beaches={beaches}
            selectedBeach={selectedBeach}
            onSelectBeach={handleSelectBeach}
          />
        </div>

        {/* Map */}
        <div className="col-span-6 relative min-h-0">
          <Map
            beaches={beaches}
            selectedBeach={selectedBeach}
            onSelectBeach={handleSelectBeach}
          />
        </div>

        {/* Beach Detail Panel */}
        <div className="col-span-3 min-h-0 overflow-hidden border-l border-gray-200">
          <BeachDetail beach={selectedBeach} onClose={() => handleSelectBeach(null)} />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex-1 overflow-hidden">
        {showMobileView === 'list' ? (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <BeachList
                beaches={beaches}
                selectedBeach={selectedBeach}
                onSelectBeach={(beach) => {
                  handleSelectBeach(beach);
                  setShowMobileView('map');
                }}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex-1 relative">
              <Map
                beaches={beaches}
                selectedBeach={selectedBeach}
                onSelectBeach={handleSelectBeach}
              />
            </div>
            {selectedBeach && (
              <div className="h-1/2 overflow-hidden border-t-4 border-primary">
                <BeachDetail
                  beach={selectedBeach}
                  onClose={() => handleSelectBeach(null)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
