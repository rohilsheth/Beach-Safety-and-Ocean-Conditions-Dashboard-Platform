'use client';

import React, { useState } from 'react';
import { Beach, FlagStatus, HazardType, AdminUpdate } from '@/lib/types';
import { beaches as initialBeaches } from '@/data/beaches';
import { useLanguage } from '@/lib/LanguageContext';
import FlagBadge from '@/components/FlagBadge';
import { Save, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { HAZARD_CONFIG } from '@/lib/constants';

export default function AdminPage() {
  const { t } = useLanguage();
  const [beaches] = useState<Beach[]>(initialBeaches);
  const [selectedBeachId, setSelectedBeachId] = useState<string>('');
  const [flagStatus, setFlagStatus] = useState<FlagStatus>('green');
  const [advisory, setAdvisory] = useState<string>('');
  const [selectedHazards, setSelectedHazards] = useState<HazardType[]>([]);
  const [updateLog, setUpdateLog] = useState<AdminUpdate[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>(
    'idle'
  );
  const [resetStatus, setResetStatus] = useState<'idle' | 'resetting' | 'success' | 'error'>(
    'idle'
  );
  const [statusMessage, setStatusMessage] = useState<string>('');

  const selectedBeach = beaches.find((b) => b.id === selectedBeachId);

  // Load beach data when selected
  const handleBeachSelect = (beachId: string) => {
    const beach = beaches.find((b) => b.id === beachId);
    if (beach) {
      setSelectedBeachId(beachId);
      setFlagStatus(beach.flagStatus);
      setAdvisory(beach.advisory || '');
      setSelectedHazards(beach.hazards);
    }
  };

  const handleHazardToggle = (hazard: HazardType) => {
    setSelectedHazards((prev) =>
      prev.includes(hazard)
        ? prev.filter((h) => h !== hazard)
        : [...prev, hazard]
    );
  };

  const handleSave = async () => {
    if (!selectedBeachId) return;

    setSaveStatus('saving');

    try {
      const response = await fetch('/api/admin/beach-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          beachId: selectedBeachId,
          updatedBy: 'County Staff',
          flagStatus,
          advisory: advisory || undefined,
          hazards: selectedHazards,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const update: AdminUpdate = result.data;
        setUpdateLog((prev) => [update, ...prev].slice(0, 10));
        setStatusMessage('');
        setSaveStatus('success');

        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Error saving beach update:', error);
      setStatusMessage(error instanceof Error ? error.message : 'Failed to save update');
      setSaveStatus('error');

      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }
  };

  const handleReset = async () => {
    if (!selectedBeachId) return;

    const confirmed = window.confirm(
      `Reset ${selectedBeach?.name} to automatic data? This will remove all manual overrides for this beach.`
    );

    if (!confirmed) return;

    setResetStatus('resetting');

    try {
      const response = await fetch(`/api/admin/beach-update?beachId=${selectedBeachId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setStatusMessage('');
        setResetStatus('success');

        // Reload the beach data to show automatic values
        const beach = beaches.find((b) => b.id === selectedBeachId);
        if (beach) {
          setFlagStatus(beach.flagStatus);
          setAdvisory(beach.advisory || '');
          setSelectedHazards(beach.hazards);
        }

        setTimeout(() => {
          setResetStatus('idle');
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to reset');
      }
    } catch (error) {
      console.error('Error resetting beach:', error);
      setStatusMessage(error instanceof Error ? error.message : 'Failed to reset override');
      setResetStatus('error');

      setTimeout(() => {
        setResetStatus('idle');
      }, 2000);
    }
  };

  const allHazards: HazardType[] = [
    'rip-currents',
    'high-surf',
    'jellyfish',
    'sharks',
    'water-quality',
    'sneaker-waves',
    'wildlife',
    'strong-winds',
  ];

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 max-w-6xl">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1">
          {t('admin.title')}
        </h1>
        <p className="text-sm text-gray-600">
          {t('admin.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admin Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Beach Selection */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('admin.selectBeach')}
            </h2>
            <select
              value={selectedBeachId}
              onChange={(e) => handleBeachSelect(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-base"
            >
              <option value="">{t('admin.selectBeachPlaceholder')}</option>
              {beaches.map((beach) => (
                <option key={beach.id} value={beach.id}>
                  {beach.name} ({beach.region})
                </option>
              ))}
            </select>
          </div>

          {selectedBeach && (
            <>
              {statusMessage && (
                <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-3 text-sm">
                  {statusMessage}
                </div>
              )}

              {/* Current Status Preview */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  {t('admin.currentStatus')}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <FlagBadge status={selectedBeach.flagStatus} size="lg" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {selectedBeach.hazards.length} {t('admin.activeHazards')}
                    </p>
                    {selectedBeach.advisory && (
                      <p className="text-xs text-gray-500 mt-1">
                        {t('admin.advisoryPosted')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Flag Status */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('admin.setFlag')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['green', 'yellow', 'red'] as FlagStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFlagStatus(status)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                        flagStatus === status
                          ? 'border-primary bg-blue-50 ring-2 ring-primary'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <FlagBadge status={status} size="md" />
                      <p className="text-xs text-gray-600 mt-2">
                        {t(`flag.${status}.desc`)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hazards */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('admin.hazards')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allHazards.map((hazard) => {
                    const config = HAZARD_CONFIG[hazard];
                    const isSelected = selectedHazards.includes(hazard);
                    return (
                      <button
                        key={hazard}
                        onClick={() => handleHazardToggle(hazard)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-blue-50 ring-2 ring-primary'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{config.icon}</span>
                          <span className="text-sm font-medium">
                            {t(`hazard.${hazard}`)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advisory Message */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('admin.advisory')}
                </h2>
                <textarea
                  value={advisory}
                  onChange={(e) => setAdvisory(e.target.value)}
                  placeholder={t('admin.advisoryPlaceholder')}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {t('admin.advisoryHint')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className={`py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg flex items-center justify-center gap-3 transition-all ${
                    saveStatus === 'success'
                      ? 'bg-green-600 text-white'
                      : saveStatus === 'error'
                      ? 'bg-red-600 text-white'
                      : 'bg-primary text-white hover:bg-primary/90'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {saveStatus === 'saving' && (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{t('admin.saving')}</span>
                    </>
                  )}
                  {saveStatus === 'success' && (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>{t('admin.success')}</span>
                    </>
                  )}
                  {saveStatus === 'error' && (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      <span>{t('admin.error')}</span>
                    </>
                  )}
                  {saveStatus === 'idle' && (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{t('admin.save')}</span>
                    </>
                  )}
                </button>

                {/* Reset to Automatic Button */}
                <button
                  onClick={handleReset}
                  disabled={resetStatus === 'resetting'}
                  className={`py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg flex items-center justify-center gap-3 transition-all ${
                    resetStatus === 'success'
                      ? 'bg-green-600 text-white'
                      : resetStatus === 'error'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {resetStatus === 'resetting' && (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{t('admin.resetting')}</span>
                    </>
                  )}
                  {resetStatus === 'success' && (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>{t('admin.resetComplete')}</span>
                    </>
                  )}
                  {resetStatus === 'error' && (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      <span>{t('admin.error')}</span>
                    </>
                  )}
                  {resetStatus === 'idle' && (
                    <>
                      <RotateCcw className="w-5 h-5" />
                      <span>{t('admin.resetAutomatic')}</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Update Log Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('admin.updateLog')}
            </h2>
            {updateLog.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                {t('admin.noUpdates')}
              </p>
            ) : (
              <div className="space-y-4">
                {updateLog.map((update, index) => {
                  const beach = beaches.find((b) => b.id === update.beachId);
                  const timestamp = new Date(update.timestamp);
                  return (
                    <div
                      key={index}
                      className="border-l-4 border-primary pl-3 py-2"
                    >
                      <p className="font-semibold text-sm text-gray-900">
                        {beach?.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {timestamp.toLocaleString()}
                      </p>
                      <div className="mt-2 space-y-1">
                        {update.changes.flagStatus && (
                          <p className="text-xs">
                            Flag: <FlagBadge status={update.changes.flagStatus} size="sm" />
                          </p>
                        )}
                        {update.changes.hazards && (
                          <p className="text-xs text-gray-600">
                            {update.changes.hazards.length} hazard(s)
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
