'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, Monitor, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
  const { t } = useLanguage();

  // Mock analytics data
  const monthlyVisits = [
    { date: 'Jan 1', visits: 2400 },
    { date: 'Jan 5', visits: 3200 },
    { date: 'Jan 10', visits: 2800 },
    { date: 'Jan 15', visits: 3900 },
    { date: 'Jan 20', visits: 4200 },
    { date: 'Jan 25', visits: 3800 },
    { date: 'Jan 30', visits: 4500 },
    { date: 'Feb 5', visits: 5100 },
    { date: 'Feb 10', visits: 4800 },
    { date: 'Feb 15', visits: 5600 },
  ];

  const popularBeaches = [
    { name: 'Pacifica State Beach', views: 12500 },
    { name: 'Half Moon Bay', views: 11200 },
    { name: 'Mavericks', views: 9800 },
    { name: 'Montara', views: 7600 },
    { name: 'Moss Beach', views: 6400 },
    { name: 'Rockaway', views: 5900 },
  ];

  const deviceBreakdown = [
    { name: t('analytics.mobile'), value: 68, color: '#3b82f6' },
    { name: t('analytics.desktop'), value: 25, color: '#10b981' },
    { name: t('analytics.tablet'), value: 7, color: '#f59e0b' },
  ];

  const peakUsageTimes = [
    { hour: '6 AM', visits: 120 },
    { hour: '8 AM', visits: 450 },
    { hour: '10 AM', visits: 890 },
    { hour: '12 PM', visits: 1250 },
    { hour: '2 PM', visits: 1100 },
    { hour: '4 PM', visits: 950 },
    { hour: '6 PM', visits: 680 },
    { hour: '8 PM', visits: 320 },
  ];

  const totalVisits = monthlyVisits.reduce((sum, day) => sum + day.visits, 0);
  const avgDailyVisits = Math.round(totalVisits / monthlyVisits.length);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('analytics.title')}
        </h1>
        <p className="text-gray-600">
          User engagement metrics for February 2026
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          icon={<Users className="w-6 h-6" />}
          label="Total Visits"
          value={totalVisits.toLocaleString()}
          change="+12.5%"
          changePositive={true}
        />
        <SummaryCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Avg. Daily Visits"
          value={avgDailyVisits.toLocaleString()}
          change="+8.3%"
          changePositive={true}
        />
        <SummaryCard
          icon={<Monitor className="w-6 h-6" />}
          label="Mobile Users"
          value="68%"
          change="+2.1%"
          changePositive={true}
        />
        <SummaryCard
          icon={<Calendar className="w-6 h-6" />}
          label="Avg. Session Duration"
          value="4m 32s"
          change="-0.5%"
          changePositive={false}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Visits Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('analytics.totalVisits')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyVisits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#1e3a5f"
                strokeWidth={2}
                dot={{ fill: '#1e3a5f', r: 4 }}
                name="Visits"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Beaches Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('analytics.popularBeaches')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={popularBeaches} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                width={120}
              />
              <Tooltip />
              <Bar dataKey="views" fill="#10b981" name="Views" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device Breakdown Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('analytics.deviceBreakdown')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Peak Usage Times Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('analytics.peakUsage')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peakUsageTimes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="visits" fill="#f59e0b" name="Visits" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Section */}
      <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          📊 Key Insights
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">✓</span>
            <span>
              <strong>Mobile-first usage:</strong> 68% of visitors access the
              dashboard from mobile devices, validating the mobile-responsive
              design.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">✓</span>
            <span>
              <strong>Peak hours:</strong> Highest traffic between 10 AM - 2 PM,
              aligning with typical beach-going times.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">✓</span>
            <span>
              <strong>Popular destinations:</strong> Pacifica State Beach and Half
              Moon Bay receive the most views, likely due to accessibility and
              amenities.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold mt-0.5">ℹ</span>
            <span>
              <strong>Growth trend:</strong> 12.5% increase in total visits
              month-over-month, indicating successful platform adoption.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  change,
  changePositive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  changePositive: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            changePositive
              ? 'text-green-700 bg-green-100'
              : 'text-red-700 bg-red-100'
          }`}
        >
          {change}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
