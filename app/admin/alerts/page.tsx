'use client';

import React, { useState, useEffect } from 'react';
import { CustomAlert } from '@/lib/types';
import { beaches as allBeaches } from '@/data/beaches';
import { useLanguage } from '@/lib/LanguageContext';
import { Save, CheckCircle, AlertCircle, Trash2, Clock } from 'lucide-react';

export default function AdminAlertsPage() {
  const { t } = useLanguage();
  const [alertBeachId, setAlertBeachId] = useState<string>('all');
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertPriority, setAlertPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [alertDuration, setAlertDuration] = useState<number>(24);
  const [alertLanguage, setAlertLanguage] = useState<'en' | 'es' | 'both'>('both');
  const [alertStatus, setAlertStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [activeAlerts, setActiveAlerts] = useState<CustomAlert[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    fetchActiveAlerts();
  }, []);

  const fetchActiveAlerts = async () => {
    try {
      const response = await fetch('/api/custom-alerts');
      const result = await response.json();
      if (result.success) {
        setStatusMessage('');
        setActiveAlerts(result.data);
      } else {
        setStatusMessage(result.error || 'Failed to fetch active alerts');
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setStatusMessage('Failed to fetch active alerts');
    }
  };

  const handlePostAlert = async () => {
    if (!alertTitle || !alertMessage) {
      setStatusMessage('Title and message are required.');
      setAlertStatus('error');
      setTimeout(() => setAlertStatus('idle'), 2000);
      return;
    }

    setAlertStatus('saving');

    try {
      const response = await fetch('/api/custom-alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          beachId: alertBeachId,
          title: alertTitle,
          message: alertMessage,
          priority: alertPriority,
          language: alertLanguage,
          createdBy: 'County Staff',
          expiresAt: new Date(Date.now() + alertDuration * 60 * 60 * 1000).toISOString(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatusMessage('');
        setAlertStatus('success');
        // Reset form
        setAlertTitle('');
        setAlertMessage('');
        setAlertBeachId('all');
        setAlertPriority('medium');
        setAlertDuration(24);
        // Refresh alerts list
        fetchActiveAlerts();

        setTimeout(() => {
          setAlertStatus('idle');
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to post alert');
      }
    } catch (error) {
      console.error('Error posting alert:', error);
      setStatusMessage(error instanceof Error ? error.message : 'Failed to post alert');
      setAlertStatus('error');

      setTimeout(() => {
        setAlertStatus('idle');
      }, 2000);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!confirm('Are you sure you want to deactivate this alert?')) {
      return;
    }

    try {
      const response = await fetch(`/api/custom-alerts?id=${alertId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setStatusMessage('');
        // Refresh alerts list
        fetchActiveAlerts();
      } else {
        throw new Error(result.error || 'Failed to deactivate alert');
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
      setStatusMessage(error instanceof Error ? error.message : 'Failed to deactivate alert');
    }
  };

  const getPriorityBadge = (priority: CustomAlert['priority']) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[priority]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Custom Alert Management
        </h1>
        <p className="text-gray-600">
          Post county-wide or beach-specific alerts for residents and visitors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alert Form */}
        <div className="lg:col-span-2 space-y-6">
          {statusMessage && (
            <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-3 text-sm">
              {statusMessage}
            </div>
          )}

          {/* Beach Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Alert Location
            </h2>
            <select
              value={alertBeachId}
              onChange={(e) => setAlertBeachId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-base"
            >
              <option value="all">County-wide (All Beaches)</option>
              {allBeaches.map((beach) => (
                <option key={beach.id} value={beach.id}>
                  {beach.name}
                </option>
              ))}
            </select>
          </div>

          {/* Alert Title */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Alert Title
            </h2>
            <input
              type="text"
              value={alertTitle}
              onChange={(e) => setAlertTitle(e.target.value)}
              placeholder="e.g., Beach Closure, Special Event, Safety Notice"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-base"
              maxLength={100}
            />
          </div>

          {/* Alert Message */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Alert Message
            </h2>
            <textarea
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              placeholder="Enter detailed alert message..."
              rows={5}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none resize-none text-base"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-2">
              {alertMessage.length}/500 characters
            </p>
          </div>

          {/* Priority and Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Alert Settings
            </h2>

            <div className="space-y-4">
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setAlertPriority(priority)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        alertPriority === priority
                          ? 'border-primary bg-blue-50 ring-2 ring-primary'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <p className="text-sm font-medium capitalize">{priority}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Duration (hours)
                </label>
                <input
                  type="number"
                  value={alertDuration}
                  onChange={(e) => setAlertDuration(Number(e.target.value))}
                  min={1}
                  max={168}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Alert will expire after {alertDuration} hours
                </p>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Language
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['en', 'es', 'both'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setAlertLanguage(lang)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        alertLanguage === lang
                          ? 'border-primary bg-blue-50 ring-2 ring-primary'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <p className="text-sm font-medium">
                        {lang === 'en' ? 'English' : lang === 'es' ? 'Español' : 'Both'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Post Button */}
          <button
            onClick={handlePostAlert}
            disabled={alertStatus === 'saving'}
            className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
              alertStatus === 'success'
                ? 'bg-green-600 text-white'
                : alertStatus === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-primary text-white hover:bg-primary/90'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {alertStatus === 'saving' && (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Posting Alert...</span>
              </>
            )}
            {alertStatus === 'success' && (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Alert Posted Successfully!</span>
              </>
            )}
            {alertStatus === 'error' && (
              <>
                <AlertCircle className="w-5 h-5" />
                <span>Error - Please fill all required fields</span>
              </>
            )}
            {alertStatus === 'idle' && (
              <>
                <Save className="w-5 h-5" />
                <span>Post Alert</span>
              </>
            )}
          </button>
        </div>

        {/* Active Alerts Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Active Alerts ({activeAlerts.length})
            </h2>
            {activeAlerts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No active alerts
              </p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {activeAlerts.map((alert) => {
                  const beach = alert.beachId === 'all'
                    ? null
                    : allBeaches.find((b) => b.id === alert.beachId);
                  const expiresIn = Math.round((new Date(alert.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60));

                  return (
                    <div
                      key={alert.id}
                      className="border-2 border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        {getPriorityBadge(alert.priority)}
                        <button
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          title="Deactivate alert"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>

                      <h3 className="font-semibold text-sm text-gray-900 mb-1">
                        {alert.title}
                      </h3>

                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {alert.message}
                      </p>

                      <div className="text-xs text-gray-500 space-y-1">
                        <p>
                          <strong>Location:</strong> {beach ? beach.name : 'County-wide'}
                        </p>
                        <p className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expires in {expiresIn}h
                        </p>
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
