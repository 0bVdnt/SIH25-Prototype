import React, { useState } from 'react';
import { useGamification } from '../contexts/GamificationContext';
import { 
  Trophy, Star, Target, TrendingUp, Award, Users, 
  Calendar, Zap, Medal, Crown, ChevronRight, Gift
} from 'lucide-react';

const GamificationDashboard = () => {
  const { 
    userStats, 
    leaderboard, 
    availableBadges, 
    getNextLevelProgress, 
    getUserRank 
  } = useGamification();
  
  const [activeTab, setActiveTab] = useState('overview');
  const nextLevelInfo = getNextLevelProgress();
  const userRank = getUserRank();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
  ];

  const achievements = [
    {
      title: 'Reports Submitted',
      value: userStats.totalReports,
      icon: Star,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Reports Verified',
      value: userStats.verifiedReports,
      icon: Medal,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Current Streak',
      value: `${userStats.streak} days`,
      icon: Zap,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      title: 'Global Rank',
      value: `#${userRank}`,
      icon: Crown,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center fade-in-up">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Your Ocean Guardian Journey
        </h1>
        <p className="text-gray-600 text-lg">Track your progress and compete with fellow ocean protectors</p>
      </div>

      {/* Level Progress Card */}
      <div className="modern-card p-8 fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Level {userStats.level}</h2>
            <p className="text-gray-600">{userStats.levelTitle || 'Ocean Protector'}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{userStats.points.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Points</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress to Level {userStats.level + 1}</span>
            <span>{nextLevelInfo.pointsNeeded > 0 ? `${nextLevelInfo.pointsNeeded} points needed` : 'Max Level!'}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(nextLevelInfo.progress, 100)}%` }}
            ></div>
          </div>
        </div>

        {nextLevelInfo.nextLevel && (
          <div className="text-center text-sm text-gray-600">
            Next: <span className="font-semibold text-gray-800">{nextLevelInfo.nextLevel.title}</span>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 fade-in-up">
        {achievements.map((achievement, index) => (
          <div key={index} className="modern-card p-6 text-center hover-lift">
            <div className={`w-16 h-16 ${achievement.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <achievement.icon className={`h-8 w-8 ${achievement.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{achievement.value}</div>
            <div className="text-gray-600 text-sm">{achievement.title}</div>
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="modern-card p-6 fade-in-up">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Report verified - Oil Spill at Marina Beach</span>
                      <span className="text-xs text-gray-500 ml-auto">+75 pts</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">New report submitted - High Tide Warning</span>
                      <span className="text-xs text-gray-500 ml-auto">+25 pts</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Badge earned - Ocean Guardian</span>
                      <span className="text-xs text-gray-500 ml-auto">+500 pts</span>
                    </div>
                  </div>
                </div>

                {/* Points Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    Points Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Reports Submitted</span>
                      <span className="font-semibold">{userStats.totalReports * 25} pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Reports Verified</span>
                      <span className="font-semibold">{userStats.verifiedReports * 75} pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Streak Bonus</span>
                      <span className="font-semibold">{userStats.streak * 15} pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Badges Earned</span>
                      <span className="font-semibold">{userStats.badges.length * 100} pts</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between items-center font-semibold">
                      <span>Total Points</span>
                      <span className="text-blue-600">{userStats.points} pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Your Badges ({userStats.badges.length}/{availableBadges.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableBadges.map((badge) => {
                  const isEarned = userStats.badges.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                        isEarned
                          ? 'border-green-300 bg-green-50 hover:bg-green-100'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-4xl mb-3 ${isEarned ? '' : 'grayscale opacity-50'}`}>
                          {badge.icon}
                        </div>
                        <h4 className={`font-semibold mb-2 ${isEarned ? 'text-green-800' : 'text-gray-600'}`}>
                          {badge.name}
                        </h4>
                        <p className={`text-sm mb-3 ${isEarned ? 'text-green-600' : 'text-gray-500'}`}>
                          {badge.description}
                        </p>
                        <div className={`text-xs font-medium px-3 py-1 rounded-full ${
                          isEarned ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isEarned ? 'Earned' : `${badge.points} points`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                Community Leaderboard
              </h3>
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((user, index) => (
                  <div
                    key={user.id}
                    className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
                      user.id === 'current_user'
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`text-lg font-bold w-8 text-center ${
                      index === 0 ? 'text-yellow-600' :
                      index === 1 ? 'text-gray-500' :
                      index === 2 ? 'text-orange-600' : 'text-gray-400'
                    }`}>
                      {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-600">Level {user.level} • {user.reports} reports</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{user.points.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                    {user.id === 'current_user' && (
                      <div className="text-blue-600">
                        <Crown className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamificationDashboard;