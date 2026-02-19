'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Beach } from '@/lib/types';
import { beaches as fallbackBeaches } from '@/data/beaches';
import BeachList from '@/components/BeachList';
import BeachDetail from '@/components/BeachDetail';
import { AlertCircle } from 'lucide-react';
import { trackPageView, trackBeachView } from '@/lib/analytics';
import ErrorBoundary from '@/components/ErrorBoundary';

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
  const [isLoading, setIsLoading] = useState(false);
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

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch('/api/beaches', {
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeoutId);

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
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timeout - using fallback data');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load live data');
      }
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

  // Refresh when returning to dashboard tab/window (helps admin updates show quickly)
  useEffect(() => {
    const handleFocus = () => {
      fetchBeachData();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchBeachData();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Update selected beach when beaches data changes
  useEffect(() => {
    if (selectedBeach) {
      const updatedBeach = beaches.find((b) => b.id === selectedBeach.id);
      if (updatedBeach) {
        setSelectedBeach(updatedBeach);
      }
    }
  }, [beaches]);

  const handleSelectBeach = (beach: Beach | null) => {
    setSelectedBeach(beach);
    if (beach) {
      // Track beach view
      trackBeachView(beach.id, beach.name);
    }
  };

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('beach-live-status', {
        detail: {
          isLiveData,
          lastUpdated: lastUpdated.toISOString(),
        },
      })
    );
  }, [isLiveData, lastUpdated]);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
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
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="flex gap-2 p-4">
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
          <ErrorBoundary
            fallback={
              <div className="h-full flex items-center justify-center bg-gray-100 p-6 text-center">
                <p className="text-sm text-gray-700">
                  Map failed to load. Refresh the page to retry.
                </p>
              </div>
            }
          >
            <Map
              beaches={beaches}
              selectedBeach={selectedBeach}
              onSelectBeach={handleSelectBeach}
            />
          </ErrorBoundary>
        </div>

        {/* Beach Detail Panel */}
        <div className="col-span-3 min-h-0 overflow-hidden border-l border-gray-200">
          <BeachDetail beach={selectedBeach} onClose={() => handleSelectBeach(null)} />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex-1 overflow-hidden relative">
        {showMobileView === 'list' ? (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <BeachList
                beaches={beaches}
                selectedBeach={selectedBeach}
                mobileFiltersCollapsed
                onSelectBeach={(beach) => {
                  handleSelectBeach(beach);
                }}
              />
            </div>
          </div>
        ) : (
          <div className="h-full">
            <div className="h-full relative">
              <ErrorBoundary
                fallback={
                  <div className="h-full flex items-center justify-center bg-gray-100 p-6 text-center">
                    <div>
                      <p className="text-sm text-gray-700 mb-3">
                        Map failed to load on this device.
                      </p>
                      <button
                        onClick={() => setShowMobileView('list')}
                        className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
                      >
                        Back to beach list
                      </button>
                    </div>
                  </div>
                }
              >
                <Map
                  beaches={beaches}
                  selectedBeach={selectedBeach}
                  onSelectBeach={handleSelectBeach}
                />
              </ErrorBoundary>
            </div>
          </div>
        )}

        {selectedBeach && (
          <div className="absolute inset-0 z-[1200] bg-white overflow-hidden">
            <BeachDetail
              beach={selectedBeach}
              onClose={() => handleSelectBeach(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
