import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Timer, Volume2, BarChart2, Settings as SettingsIcon } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from './src/theme/colors';
import FocusTimer from './src/components/FocusTimer';
import SoundscapeMixer from './src/components/SoundscapeMixer';
import StatsDashboard from './src/components/StatsDashboard';
import SettingsScreen from './src/components/SettingsScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('focus'); // 'focus' | 'sounds' | 'stats' | 'settings'

  // Timer Configuration State
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);

  // Focus Statistics State (Seeded with some baseline to look realistic)
  const [totalMinutes, setTotalMinutes] = useState(150);
  const [sessionsCount, setSessionsCount] = useState(6);
  const [currentStreak, setCurrentStreak] = useState(3);
  const [weeklyStats, setWeeklyStats] = useState({
    Mon: 25,
    Tue: 50,
    Wed: 30,
    Thu: 0,
    Fri: 45,
    Sat: 0,
    Sun: 0,
  });

  // Handle Session Completion
  const handleSessionComplete = (minutes) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayName = days[new Date().getDay()];
    
    setTotalMinutes((prev) => prev + minutes);
    setSessionsCount((prev) => prev + 1);
    
    // Update daily chart
    setWeeklyStats((prev) => ({
      ...prev,
      [todayName]: (prev[todayName] || 0) + minutes,
    }));

    // Increment streak (in a real app, this would verify consecutive days)
    if (weeklyStats[todayName] === 0) {
      setCurrentStreak((prev) => prev + 1);
    }
  };

  const handleResetStats = () => {
    setTotalMinutes(0);
    setSessionsCount(0);
    setCurrentStreak(0);
    setWeeklyStats({
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'focus':
        return (
          <FocusTimer
            focusMinutes={focusMinutes}
            shortBreakMinutes={shortBreakMinutes}
            longBreakMinutes={longBreakMinutes}
            onSessionComplete={handleSessionComplete}
          />
        );
      case 'sounds':
        return <SoundscapeMixer />;
      case 'stats':
        return (
          <StatsDashboard
            stats={weeklyStats}
            totalMinutes={totalMinutes}
            sessionsCount={sessionsCount}
            currentStreak={currentStreak}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            focusMinutes={focusMinutes}
            shortBreakMinutes={shortBreakMinutes}
            longBreakMinutes={longBreakMinutes}
            setFocusMinutes={setFocusMinutes}
            setShortBreakMinutes={setShortBreakMinutes}
            setLongBreakMinutes={setLongBreakMinutes}
            onResetStats={handleResetStats}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Elegant Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AURA</Text>
      </View>

      {/* Screen View */}
      <View style={styles.content}>{renderContent()}</View>

      {/* Bottom Tab Navigation Bar */}
      <View style={styles.tabBar}>
        {/* Timer Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab('focus')}
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <Timer
            size={22}
            color={activeTab === 'focus' ? COLORS.primaryDark : COLORS.textSecondary}
            strokeWidth={activeTab === 'focus' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'focus' && styles.activeTabLabel,
            ]}
          >
            Timer
          </Text>
        </TouchableOpacity>

        {/* Soundscape Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab('sounds')}
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <Volume2
            size={22}
            color={activeTab === 'sounds' ? COLORS.primaryDark : COLORS.textSecondary}
            strokeWidth={activeTab === 'sounds' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'sounds' && styles.activeTabLabel,
            ]}
          >
            Sounds
          </Text>
        </TouchableOpacity>

        {/* Stats Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab('stats')}
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <BarChart2
            size={22}
            color={activeTab === 'stats' ? COLORS.primaryDark : COLORS.textSecondary}
            strokeWidth={activeTab === 'stats' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'stats' && styles.activeTabLabel,
            ]}
          >
            Stats
          </Text>
        </TouchableOpacity>

        {/* Settings Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab('settings')}
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <SettingsIcon
            size={22}
            color={activeTab === 'settings' ? COLORS.primaryDark : COLORS.textSecondary}
            strokeWidth={activeTab === 'settings' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'settings' && styles.activeTabLabel,
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.light,
    color: COLORS.primaryDark,
    letterSpacing: 4,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 84 : 64,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    ...SHADOWS.medium,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  activeTabLabel: {
    color: COLORS.primaryDark,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
});
