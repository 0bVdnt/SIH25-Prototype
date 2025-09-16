import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, X, MapPin } from 'lucide-react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState('default');
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const [notificationThrottle, setNotificationThrottle] = useState({
    lastSent: {},
    throttleTime: 3 * 60 * 1000 // 3 minutes in milliseconds
  });

  // Initialize notification system
  useEffect(() => {
    checkNotificationPermission();
    registerServiceWorker();
    setupMockNotifications();
  }, []);

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    }
    return false;
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        // In a real app, you'd register an actual service worker
        setIsServiceWorkerReady(true);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  // Mock notification setup for demo
  const setupMockNotifications = () => {
    // Reduced frequency and more intelligent notifications
    const interval = setInterval(() => {
      const mockNotifications = [
        {
          id: Date.now(),
          type: 'hazard_alert',
          title: 'High Tide Alert',
          message: 'Severe high tide warning issued for Marine Drive, Mumbai. Avoid coastal areas.',
          location: { lat: 19.0330, lon: 72.8570, name: 'Marine Drive, Mumbai' },
          severity: 'high',
          timestamp: new Date(),
          read: false,
          actions: [
            { label: 'View Details', action: 'view_details' },
            { label: 'Mark Safe', action: 'mark_safe' }
          ]
        },
        {
          id: Date.now() + 1,
          type: 'report_update',
          title: 'Report Verified',
          message: 'Your oil spill report at Chennai Marina has been verified by authorities.',
          reportId: 'R12345',
          timestamp: new Date(),
          read: false,
          actions: [
            { label: 'View Report', action: 'view_report' }
          ]
        }
      ];

      // Only send meaningful notifications (hazard alerts and report updates)
      const meaningfulNotifications = mockNotifications.filter(n => 
        n.type === 'hazard_alert' || n.type === 'report_update'
      );
      
      const randomNotification = meaningfulNotifications[Math.floor(Math.random() * meaningfulNotifications.length)];
      addNotification(randomNotification);
    }, 5 * 60 * 1000); // Every 5 minutes instead of 45 seconds

    return () => clearInterval(interval);
  };

  const isThrottled = (type, severity = 'medium') => {
    const now = Date.now();
    const throttleKey = `${type}_${severity}`;
    const lastSent = notificationThrottle.lastSent[throttleKey];
    
    // Always allow high severity notifications
    if (severity === 'high') {
      return false;
    }
    
    // Check if enough time has passed since last notification of this type
    if (lastSent && (now - lastSent) < notificationThrottle.throttleTime) {
      return true;
    }
    
    return false;
  };

  const updateThrottle = (type, severity = 'medium') => {
    const throttleKey = `${type}_${severity}`;
    setNotificationThrottle(prev => ({
      ...prev,
      lastSent: {
        ...prev.lastSent,
        [throttleKey]: Date.now()
      }
    }));
  };

  const addNotification = (notification) => {
    // Check if notification should be throttled
    if (isThrottled(notification.type, notification.severity)) {
      console.log(`Notification throttled: ${notification.type} - ${notification.severity}`);
      return;
    }

    const newNotification = {
      ...notification,
      id: notification.id || Date.now(),
      timestamp: notification.timestamp || new Date()
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep max 50 notifications

    // Update throttle for this notification type
    updateThrottle(notification.type, notification.severity);

    // Show browser notification if permission granted
    if (permission === 'granted' && document.hidden) {
      showBrowserNotification(newNotification);
    }

    // Play notification sound (only for important notifications)
    if (newNotification.severity === 'high' || newNotification.type === 'hazard_alert') {
      playNotificationSound(newNotification.type);
    }
  };

  const showBrowserNotification = (notification) => {
    if ('Notification' in window && permission === 'granted') {
      const options = {
        body: notification.message,
        icon: '/vite.svg', // Use your app icon
        badge: '/vite.svg',
        tag: notification.type,
        requireInteraction: notification.severity === 'high',
        actions: notification.actions?.map(action => ({
          action: action.action,
          title: action.label
        })) || []
      };

      const browserNotification = new Notification(notification.title, options);
      
      browserNotification.onclick = () => {
        window.focus();
        handleNotificationAction(notification.id, 'view_details');
      };

      // Auto close after 10 seconds for non-critical notifications
      if (notification.severity !== 'high') {
        setTimeout(() => browserNotification.close(), 10000);
      }
    }
  };

  const playNotificationSound = (type) => {
    // In a real app, you'd play different sounds for different notification types
    if ('Audio' in window) {
      try {
        const audio = new Audio(`data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+b2snIpBSyEzvLZiTYIG2m98Ol`);
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Ignore errors if audio fails
      } catch (error) {
        // Ignore audio errors
      }
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationAction = (notificationId, action) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    markAsRead(notificationId);

    switch (action) {
      case 'view_details':
        if (notification.type === 'hazard_alert') {
          window.location.href = '/reports';
        }
        break;
      case 'view_report':
        if (notification.reportId) {
          window.location.href = `/reports#${notification.reportId}`;
        }
        break;
      case 'mark_safe':
        // Implement mark safe functionality
        break;
      default:
        break;
    }
  };

  // Get notification counts
  const getNotificationCounts = () => {
    const unreadCount = notifications.filter(n => !n.read).length;
    const criticalCount = notifications.filter(n => !n.read && n.severity === 'high').length;
    return { unread: unreadCount, critical: criticalCount, total: notifications.length };
  };

  // Get notifications by type
  const getNotificationsByType = (type) => {
    return notifications.filter(n => n.type === type);
  };

  // Mock functions for different notification types
  const sendHazardAlert = (hazardData) => {
    const notification = {
      type: 'hazard_alert',
      title: `${hazardData.type} Alert`,
      message: `${hazardData.type} reported at ${hazardData.location}. ${hazardData.severity === 'high' ? 'Immediate action required.' : 'Please exercise caution.'}`,
      location: hazardData.location,
      severity: hazardData.severity,
      actions: [
        { label: 'View Details', action: 'view_details' },
        { label: 'Mark Safe', action: 'mark_safe' }
      ]
    };
    addNotification(notification);
  };

  const sendReportUpdate = (reportData) => {
    const notification = {
      type: 'report_update',
      title: 'Report Status Update',
      message: `Your ${reportData.type} report has been ${reportData.status}.`,
      reportId: reportData.id,
      actions: [
        { label: 'View Report', action: 'view_report' }
      ]
    };
    addNotification(notification);
  };

  const sendGamificationUpdate = (achievementData) => {
    const notification = {
      type: 'gamification',
      title: achievementData.title,
      message: achievementData.message,
      badge: achievementData.badge,
      points: achievementData.points
    };
    addNotification(notification);
  };

  const value = {
    notifications,
    permission,
    isServiceWorkerReady,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    handleNotificationAction,
    requestNotificationPermission,
    getNotificationCounts,
    getNotificationsByType,
    sendHazardAlert,
    sendReportUpdate,
    sendGamificationUpdate
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Notification component for rendering individual notifications
export const NotificationItem = ({ notification, onAction, onDismiss }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'hazard_alert':
        return <AlertTriangle className={`h-5 w-5 ${
          notification.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
        }`} />;
      case 'report_update':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'gamification':
        return <span className="text-lg">🏆</span>;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    if (notification.read) return 'bg-gray-50 border-gray-200';
    
    switch (notification.type) {
      case 'hazard_alert':
        return notification.severity === 'high' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200';
      case 'report_update':
        return 'bg-green-50 border-green-200';
      case 'gamification':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`border rounded-lg p-4 transition-all duration-200 ${getBgColor()}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className={`text-sm font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                {notification.title}
              </h4>
              <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                {notification.message}
              </p>
              {notification.location && (
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  {notification.location.name}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-2">
                {notification.timestamp.toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => onDismiss(notification.id)}
              className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex space-x-2 mt-3">
              {notification.actions.map((action) => (
                <button
                  key={action.action}
                  onClick={() => onAction(notification.id, action.action)}
                  className="text-xs bg-white hover:bg-gray-50 border border-gray-300 rounded px-3 py-1 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};