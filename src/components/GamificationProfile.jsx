import React, { useState } from 'react';
import { useGamification } from '../contexts/GamificationContext';
import { Trophy, Star, TrendingUp, X, Award, Target } from 'lucide-react';

const GamificationProfile = ({ isOpen, onClose }) => {
  const { userStats, getNextLevelProgress } = useGamification();
  const nextLevelInfo = getNextLevelProgress();

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 modern-card p-6 shadow-xl z-50 fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Your Progress</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Level & Points */}
      <div className="text-center mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-4 mb-4">
          <div className="text-2xl font-bold">Level {userStats.level}</div>
          <div className="text-blue-100 text-sm">{userStats.levelTitle || 'Ocean Protector'}</div>
          <div className="text-xl font-semibold mt-2">{userStats.points.toLocaleString()} pts</div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Level {userStats.level}</span>
            <span>Level {userStats.level + 1}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(nextLevelInfo.progress, 100)}%` }}
            ></div>
          </div>
          {nextLevelInfo.pointsNeeded > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {nextLevelInfo.pointsNeeded} points to next level
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <Trophy className="h-5 w-5 text-blue-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-blue-600">{userStats.totalReports}</div>
          <div className="text-xs text-gray-600">Reports</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <Star className="h-5 w-5 text-green-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-green-600">{userStats.verifiedReports}</div>
          <div className="text-xs text-gray-600">Verified</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg text-center">
          <TrendingUp className="h-5 w-5 text-orange-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-orange-600">{userStats.streak}</div>
          <div className="text-xs text-gray-600">Day Streak</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg text-center">
          <Award className="h-5 w-5 text-purple-600 mx-auto mb-1" />
          <div className="text-lg font-bold text-purple-600">{userStats.badges.length}</div>
          <div className="text-xs text-gray-600">Badges</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <button 
          onClick={() => window.location.href = '/gamification'}
          className="w-full btn-modern btn-primary py-2 text-sm flex items-center justify-center space-x-2"
        >
          <Target className="h-4 w-4" />
          <span>View Full Dashboard</span>
        </button>
        <button 
          onClick={() => window.location.href = '/submit-report'}
          className="w-full btn-modern btn-accent py-2 text-sm"
        >
          Earn More Points
        </button>
      </div>
    </div>
  );
};

// Badge notification component
export const BadgeNotification = ({ badge, onClose }) => {
  if (!badge) return null;

  return (
    <div className="fixed top-4 right-4 modern-card p-6 shadow-xl z-50 max-w-sm fade-in-up">
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{badge.icon}</div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 mb-1">Badge Earned! 🎉</h4>
          <h5 className="font-semibold text-blue-600 mb-1">{badge.name}</h5>
          <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
          <div className="text-xs text-green-600 font-medium">+{badge.points} points</div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default GamificationProfile;