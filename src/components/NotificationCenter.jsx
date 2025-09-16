import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Bell, Settings, Filter, Search, X, Check, Trash2, RotateCcw } from 'lucide-react';
import { NotificationItem } from '../contexts/NotificationContext';

const NotificationCenter = () => {
  const {
    notifications,
    permission,
    getNotificationCounts,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    handleNotificationAction,
    requestNotificationPermission
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const counts = getNotificationCounts();

  // Filter notifications based on selected filter and search term
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'hazard_alert' && notification.type === 'hazard_alert') ||
      (filter === 'report_update' && notification.type === 'report_update') ||
      (filter === 'gamification' && notification.type === 'gamification');

    const matchesSearch = searchTerm === '' ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleDismiss = (notificationId) => {
    removeNotification(notificationId);
  };

  const handleAction = (notificationId, action) => {
    handleNotificationAction(notificationId, action);
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setShowSettings(false);
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
      >
        <Bell className="h-6 w-6" />
        {counts.unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {counts.unread > 99 ? '99+' : counts.unread}
          </span>
        )}
        {counts.critical > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 border-2 border-white rounded-full h-3 w-3 animate-ping" />
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-w-sm bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
              <span>{counts.total} total</span>
              <span>{counts.unread} unread</span>
              {counts.critical > 0 && (
                <span className="text-red-600 font-medium">{counts.critical} critical</span>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Notification Settings</h4>
              
              {permission !== 'granted' && (
                <div className="mb-3">
                  <button
                    onClick={handleEnableNotifications}
                    className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition-colors"
                  >
                    Enable Browser Notifications
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    Get instant alerts for critical hazard warnings
                  </p>
                </div>
              )}

              {permission === 'granted' && (
                <div className="text-sm text-green-600 flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Browser notifications enabled
                </div>
              )}
            </div>
          )}

          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All', count: counts.total },
                { key: 'unread', label: 'Unread', count: counts.unread },
                { key: 'hazard_alert', label: 'Hazards', count: notifications.filter(n => n.type === 'hazard_alert').length },
                { key: 'report_update', label: 'Reports', count: notifications.filter(n => n.type === 'report_update').length },
                { key: 'gamification', label: 'Achievements', count: notifications.filter(n => n.type === 'gamification').length }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label} ({filterOption.count})
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={markAllAsRead}
                disabled={counts.unread === 0}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4" />
                <span>Mark all read</span>
              </button>
              <button
                onClick={clearAllNotifications}
                disabled={counts.total === 0}
                className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear all</span>
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">
                  {searchTerm || filter !== 'all' 
                    ? 'No notifications match your filters' 
                    : 'No notifications yet'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {filteredNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onAction={handleAction}
                    onDismiss={handleDismiss}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
              <p className="text-xs text-gray-500">
                Showing {filteredNotifications.length} of {counts.total} notifications
              </p>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter;