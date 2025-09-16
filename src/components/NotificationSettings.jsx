import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Bell, Settings, ToggleLeft, ToggleRight, Volume2, VolumeX, Smartphone, Monitor, Mail, MessageSquare } from 'lucide-react';

const NotificationSettings = () => {
  const { permission, requestNotificationPermission } = useNotifications();
  
  const [settings, setSettings] = useState({
    browserNotifications: permission === 'granted',
    soundEnabled: true,
    emailNotifications: false,
    smsNotifications: false,
    desktopNotifications: true,
    mobileNotifications: true,
    
    // Notification types
    hazardAlerts: true,
    reportUpdates: true,
    gamificationUpdates: true,
    systemAlerts: true,
    
    // Frequency settings
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '07:00'
    },
    
    // Location-based
    nearbyHazards: {
      enabled: true,
      radius: 10 // km
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const updateNestedSetting = (parent, key, value) => {
    const newSettings = {
      ...settings,
      [parent]: {
        ...settings[parent],
        [key]: value
      }
    };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const handleEnableBrowserNotifications = async () => {
    setIsLoading(true);
    const granted = await requestNotificationPermission();
    updateSetting('browserNotifications', granted);
    setIsLoading(false);
  };

  const testNotification = () => {
    if (settings.browserNotifications && 'Notification' in window) {
      new Notification('Test Notification', {
        body: 'This is a test notification from Ocean Hazard Reporter',
        icon: '/vite.svg'
      });
    }
  };

  const ToggleSwitch = ({ enabled, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Settings</h1>
        <p className="text-gray-600">Customize how and when you receive notifications</p>
      </div>

      {/* Browser Notifications */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Browser Notifications</h3>
              <p className="text-sm text-gray-600">Receive instant alerts in your browser</p>
            </div>
          </div>
          <ToggleSwitch
            enabled={settings.browserNotifications}
            onChange={handleEnableBrowserNotifications}
            disabled={isLoading}
          />
        </div>
        
        {!settings.browserNotifications && permission !== 'granted' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Enable browser notifications to receive critical hazard alerts even when the app is closed.
            </p>
            <button
              onClick={handleEnableBrowserNotifications}
              disabled={isLoading}
              className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Requesting...' : 'Enable Notifications'}
            </button>
          </div>
        )}

        {settings.browserNotifications && (
          <button
            onClick={testNotification}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Send Test Notification
          </button>
        )}
      </div>

      {/* Notification Channels */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2 text-blue-600" />
          Notification Channels
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="h-5 w-5 text-gray-500" />
              <div>
                <span className="font-medium">Sound Alerts</span>
                <p className="text-sm text-gray-600">Play sound for notifications</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.soundEnabled}
              onChange={(value) => updateSetting('soundEnabled', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Monitor className="h-5 w-5 text-gray-500" />
              <div>
                <span className="font-medium">Desktop Notifications</span>
                <p className="text-sm text-gray-600">Show notifications on desktop</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.desktopNotifications}
              onChange={(value) => updateSetting('desktopNotifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-gray-500" />
              <div>
                <span className="font-medium">Mobile Push Notifications</span>
                <p className="text-sm text-gray-600">Receive push notifications on mobile</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.mobileNotifications}
              onChange={(value) => updateSetting('mobileNotifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <span className="font-medium">Email Notifications</span>
                <p className="text-sm text-gray-600">Receive important updates via email</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.emailNotifications}
              onChange={(value) => updateSetting('emailNotifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-gray-500" />
              <div>
                <span className="font-medium">SMS Alerts</span>
                <p className="text-sm text-gray-600">Receive critical alerts via SMS</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.smsNotifications}
              onChange={(value) => updateSetting('smsNotifications', value)}
            />
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Notification Types</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-red-600">Hazard Alerts</span>
              <p className="text-sm text-gray-600">Critical ocean hazard warnings</p>
            </div>
            <ToggleSwitch
              enabled={settings.hazardAlerts}
              onChange={(value) => updateSetting('hazardAlerts', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-blue-600">Report Updates</span>
              <p className="text-sm text-gray-600">Status updates on your reports</p>
            </div>
            <ToggleSwitch
              enabled={settings.reportUpdates}
              onChange={(value) => updateSetting('reportUpdates', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-purple-600">Achievement Updates</span>
              <p className="text-sm text-gray-600">Badges, points, and rewards</p>
            </div>
            <ToggleSwitch
              enabled={settings.gamificationUpdates}
              onChange={(value) => updateSetting('gamificationUpdates', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-600">System Alerts</span>
              <p className="text-sm text-gray-600">App updates and maintenance notices</p>
            </div>
            <ToggleSwitch
              enabled={settings.systemAlerts}
              onChange={(value) => updateSetting('systemAlerts', value)}
            />
          </div>
        </div>
      </div>

      {/* Location-Based Settings */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Location-Based Alerts</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Nearby Hazard Alerts</span>
              <p className="text-sm text-gray-600">Get notified about hazards near your location</p>
            </div>
            <ToggleSwitch
              enabled={settings.nearbyHazards.enabled}
              onChange={(value) => updateNestedSetting('nearbyHazards', 'enabled', value)}
            />
          </div>

          {settings.nearbyHazards.enabled && (
            <div className="ml-4 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Radius: {settings.nearbyHazards.radius} km
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={settings.nearbyHazards.radius}
                onChange={(e) => updateNestedSetting('nearbyHazards', 'radius', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 km</span>
                <span>25 km</span>
                <span>50 km</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Quiet Hours</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Do Not Disturb</span>
              <p className="text-sm text-gray-600">Silence non-critical notifications during specified hours</p>
            </div>
            <ToggleSwitch
              enabled={settings.quietHours.enabled}
              onChange={(value) => updateNestedSetting('quietHours', 'enabled', value)}
            />
          </div>

          {settings.quietHours.enabled && (
            <div className="ml-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={settings.quietHours.startTime}
                    onChange={(e) => updateNestedSetting('quietHours', 'startTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={settings.quietHours.endTime}
                    onChange={(e) => updateNestedSetting('quietHours', 'endTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Critical hazard alerts will still be delivered during quiet hours
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;