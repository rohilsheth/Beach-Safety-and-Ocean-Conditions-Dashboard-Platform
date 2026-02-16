'use client';

import React, { useState, useEffect } from 'react';
import { CustomAlert } from '@/lib/types';
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { trackAlertClick } from '@/lib/analytics';

interface CustomAlertsProps {
  beachId?: string; // If provided, shows alerts for specific beach + county-wide
}

export default function CustomAlerts({ beachId }: CustomAlertsProps) {
  const { language } = useLanguage();
  const [alerts, setAlerts] = useState<CustomAlert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/custom-alerts');
      const result = await response.json();

      if (result.success) {
        // Filter alerts based on language and beachId
        const filteredAlerts = result.data.filter((alert: CustomAlert) => {
          const languageMatch = alert.language === 'both' || alert.language === language;
          const beachMatch = !beachId || alert.beachId === 'all' || alert.beachId === beachId;
          return languageMatch && beachMatch;
        });

        setAlerts(filteredAlerts);
      }
    } catch (error) {
      console.error('Error fetching custom alerts:', error);
    }
  };

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts((prev) => new Set([...prev, alertId]));
  };

  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.has(alert.id));

  if (visibleAlerts.length === 0) {
    return null;
  }

  const getPriorityStyles = (priority: CustomAlert['priority']) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-400',
          text: 'text-red-900',
          icon: AlertTriangle,
          iconColor: 'text-red-600',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-400',
          text: 'text-yellow-900',
          icon: AlertCircle,
          iconColor: 'text-yellow-600',
        };
      case 'low':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-400',
          text: 'text-blue-900',
          icon: Info,
          iconColor: 'text-blue-600',
        };
    }
  };

  return (
    <div className="space-y-3">
      {visibleAlerts.map((alert) => {
        const styles = getPriorityStyles(alert.priority);
        const Icon = styles.icon;

        return (
          <div
            key={alert.id}
            className={`${styles.bg} ${styles.border} border-2 rounded-lg p-4 ${styles.text} relative cursor-pointer hover:shadow-md transition-shadow`}
            role="alert"
            aria-live="polite"
            onClick={() => trackAlertClick(alert.id, alert.title)}
          >
            <button
              onClick={() => handleDismiss(alert.id)}
              className="absolute top-2 right-2 p-1 hover:bg-black/10 rounded-full transition-colors"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-3 pr-8">
              <Icon className={`w-5 h-5 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <h3 className="font-bold text-sm mb-1">{alert.title}</h3>
                <p className="text-sm leading-relaxed">{alert.message}</p>
                <p className="text-xs mt-2 opacity-75">
                  Posted by {alert.createdBy} •{' '}
                  {new Date(alert.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
