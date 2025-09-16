import React, { createContext, useContext, useState, useEffect } from 'react';

const GamificationContext = createContext();

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ children }) => {
  const [userStats, setUserStats] = useState({
    points: 0,
    level: 1,
    totalReports: 0,
    verifiedReports: 0,
    streak: 0,
    badges: [],
    achievements: []
  });

  const [leaderboard, setLeaderboard] = useState([]);

  // Badge definitions
  const availableBadges = [
    {
      id: 'first_report',
      name: 'First Reporter',
      description: 'Submit your first hazard report',
      icon: '🎯',
      requirement: 'reports >= 1',
      points: 50
    },
    {
      id: 'verified_reporter',
      name: 'Verified Reporter',
      description: 'Have 5 reports verified by authorities',
      icon: '✅',
      requirement: 'verifiedReports >= 5',
      points: 200
    },
    {
      id: 'ocean_guardian',
      name: 'Ocean Guardian',
      description: 'Submit 25 hazard reports',
      icon: '🌊',
      requirement: 'reports >= 25',
      points: 500
    },
    {
      id: 'streak_master',
      name: 'Streak Master',
      description: 'Report hazards for 7 consecutive days',
      icon: '🔥',
      requirement: 'streak >= 7',
      points: 300
    },
    {
      id: 'community_hero',
      name: 'Community Hero',
      description: 'Reach 1000 total points',
      icon: '🦸',
      requirement: 'points >= 1000',
      points: 100
    },
    {
      id: 'accuracy_expert',
      name: 'Accuracy Expert',
      description: '90% of reports verified (min 10 reports)',
      icon: '🎖️',
      requirement: 'verifiedReports / reports >= 0.9 && reports >= 10',
      points: 400
    }
  ];

  // Level system
  const levelThresholds = [
    { level: 1, minPoints: 0, title: 'Novice Reporter' },
    { level: 2, minPoints: 100, title: 'Alert Citizen' },
    { level: 3, minPoints: 300, title: 'Safety Advocate' },
    { level: 4, minPoints: 600, title: 'Ocean Protector' },
    { level: 5, minPoints: 1000, title: 'Guardian Elite' },
    { level: 6, minPoints: 1500, title: 'Maritime Expert' },
    { level: 7, minPoints: 2500, title: 'Hazard Specialist' },
    { level: 8, minPoints: 4000, title: 'Community Leader' },
    { level: 9, minPoints: 6000, title: 'Ocean Champion' },
    { level: 10, minPoints: 10000, title: 'Legendary Guardian' }
  ];

  // Points system
  const pointsConfig = {
    reportSubmitted: 25,
    reportVerified: 75,
    reportFalseAlarm: -10,
    consecutiveDay: 15,
    weeklyBonus: 100,
    monthlyBonus: 500
  };

  // Check for new badges
  const checkBadges = (stats) => {
    const newBadges = [];
    
    availableBadges.forEach(badge => {
      if (!stats.badges.includes(badge.id)) {
        let earned = false;
        
        switch (badge.id) {
          case 'first_report':
            earned = stats.totalReports >= 1;
            break;
          case 'verified_reporter':
            earned = stats.verifiedReports >= 5;
            break;
          case 'ocean_guardian':
            earned = stats.totalReports >= 25;
            break;
          case 'streak_master':
            earned = stats.streak >= 7;
            break;
          case 'community_hero':
            earned = stats.points >= 1000;
            break;
          case 'accuracy_expert':
            earned = stats.totalReports >= 10 && (stats.verifiedReports / stats.totalReports) >= 0.9;
            break;
        }
        
        if (earned) {
          newBadges.push(badge);
        }
      }
    });
    
    return newBadges;
  };

  // Calculate user level
  const calculateLevel = (points) => {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (points >= levelThresholds[i].minPoints) {
        return levelThresholds[i];
      }
    }
    return levelThresholds[0];
  };

  // Award points
  const awardPoints = (type, amount = null) => {
    const points = amount || pointsConfig[type] || 0;
    
    setUserStats(prevStats => {
      const newStats = {
        ...prevStats,
        points: prevStats.points + points
      };
      
      // Update level
      const newLevel = calculateLevel(newStats.points);
      newStats.level = newLevel.level;
      newStats.levelTitle = newLevel.title;
      
      // Check for new badges
      const newBadges = checkBadges(newStats);
      if (newBadges.length > 0) {
        newStats.badges = [...newStats.badges, ...newBadges.map(b => b.id)];
        newStats.achievements = [...newStats.achievements, ...newBadges];
        
        // Award badge points
        const badgePoints = newBadges.reduce((sum, badge) => sum + badge.points, 0);
        newStats.points += badgePoints;
      }
      
      return newStats;
    });
    
    return points;
  };

  // Update report stats
  const updateReportStats = (type) => {
    setUserStats(prevStats => {
      const newStats = { ...prevStats };
      
      switch (type) {
        case 'submitted':
          newStats.totalReports += 1;
          awardPoints('reportSubmitted');
          break;
        case 'verified':
          newStats.verifiedReports += 1;
          awardPoints('reportVerified');
          break;
        case 'false_alarm':
          awardPoints('reportFalseAlarm');
          break;
      }
      
      return newStats;
    });
  };

  // Update streak
  const updateStreak = (isConsecutive) => {
    setUserStats(prevStats => ({
      ...prevStats,
      streak: isConsecutive ? prevStats.streak + 1 : 0
    }));
    
    if (isConsecutive) {
      awardPoints('consecutiveDay');
    }
  };

  // Get next level progress
  const getNextLevelProgress = () => {
    const currentLevel = levelThresholds.find(l => l.level === userStats.level);
    const nextLevel = levelThresholds.find(l => l.level === userStats.level + 1);
    
    if (!nextLevel) return { progress: 100, pointsNeeded: 0 };
    
    const progress = ((userStats.points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100;
    const pointsNeeded = nextLevel.minPoints - userStats.points;
    
    return { progress, pointsNeeded, nextLevel };
  };

  // Get user rank
  const getUserRank = () => {
    const sorted = [...leaderboard].sort((a, b) => b.points - a.points);
    return sorted.findIndex(user => user.id === 'current_user') + 1;
  };

  // Load user stats (in real app, this would be from API)
  useEffect(() => {
    // Mock data loading
    const savedStats = localStorage.getItem('userGamificationStats');
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
    
    // Mock leaderboard data
    setLeaderboard([
      { id: 'current_user', name: 'You', points: userStats.points, level: userStats.level, reports: userStats.totalReports },
      { id: '1', name: 'Rajesh Kumar', points: 1250, level: 5, reports: 45 },
      { id: '2', name: 'Priya Sharma', points: 980, level: 4, reports: 32 },
      { id: '3', name: 'Amit Patel', points: 850, level: 4, reports: 28 },
      { id: '4', name: 'Sneha Reddy', points: 720, level: 3, reports: 24 },
      { id: '5', name: 'Vikram Singh', points: 650, level: 3, reports: 22 }
    ]);
  }, []);

  // Save user stats
  useEffect(() => {
    localStorage.setItem('userGamificationStats', JSON.stringify(userStats));
  }, [userStats]);

  const value = {
    userStats,
    leaderboard,
    availableBadges,
    levelThresholds,
    awardPoints,
    updateReportStats,
    updateStreak,
    getNextLevelProgress,
    getUserRank,
    calculateLevel
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};