import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Trophy, Clock, Zap, Calendar } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function StatsDashboard({ 
  stats = {
    Mon: 25,
    Tue: 50,
    Wed: 30,
    Thu: 0,
    Fri: 45,
    Sat: 0,
    Sun: 0
  },
  totalMinutes = 150,
  sessionsCount = 6,
  currentStreak = 3
}) {
  // Find max value in weekly stats to scale chart columns proportionally (min scale value is 60 minutes)
  const maxStatVal = Math.max(...Object.values(stats), 60);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>YOUR PROGRESS</Text>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.description}>
          Monitor your focus consistency and track your daily stats.
        </Text>
      </View>

      {/* KPI Cards Grid */}
      <View style={styles.statsGrid}>
        {/* Total Time */}
        <View style={styles.kpiCard}>
          <View style={[styles.kpiIconWrapper, { backgroundColor: COLORS.primaryLight }]}>
            <Clock size={20} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.kpiValue}>{totalMinutes}m</Text>
          <Text style={styles.kpiLabel}>Total Focus</Text>
        </View>

        {/* Sessions */}
        <View style={styles.kpiCard}>
          <View style={[styles.kpiIconWrapper, { backgroundColor: '#EAF2F8' }]}>
            <Trophy size={20} color="#2980B9" />
          </View>
          <Text style={styles.kpiValue}>{sessionsCount}</Text>
          <Text style={styles.kpiLabel}>Sessions</Text>
        </View>

        {/* Streak */}
        <View style={styles.kpiCard}>
          <View style={[styles.kpiIconWrapper, { backgroundColor: '#FEF9E7' }]}>
            <Zap size={20} color="#F39C12" />
          </View>
          <Text style={styles.kpiValue}>{currentStreak}d</Text>
          <Text style={styles.kpiLabel}>Daily Streak</Text>
        </View>
      </View>

      {/* Weekly Activity Card */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Calendar size={16} color={COLORS.textSecondary} style={{ marginRight: SPACING.xs }} />
          <Text style={styles.chartTitle}>This Week's Focus Time</Text>
        </View>

        {/* Dynamic Column Chart */}
        <View style={styles.chartContainer}>
          {daysOfWeek.map((day) => {
            const minutes = stats[day] || 0;
            // Height ratio (max height of bar is 120dp)
            const barHeight = (minutes / maxStatVal) * 120;
            const isToday = day === 'Thu'; // hardcoded or dynamic based on date
            
            return (
              <View key={day} style={styles.chartColumn}>
                <View style={styles.barTrack}>
                  {/* Column Fill */}
                  <View 
                    style={[
                      styles.barFill, 
                      { height: Math.max(barHeight, 4) },
                      minutes > 0 ? styles.barActive : styles.barInactive,
                      isToday && styles.barToday
                    ]}
                  />
                  {/* Hovering minutes count above column if positive */}
                  {minutes > 0 && (
                    <Text style={styles.barMinutesText}>{minutes}</Text>
                  )}
                </View>
                <Text style={[styles.dayLabel, isToday && styles.activeDayLabel]}>
                  {day[0]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xl + 4,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  kpiCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md - 2,
    alignItems: 'center',
    width: (width - SPACING.lg * 2 - SPACING.md * 2) / 3,
    ...SHADOWS.light,
  },
  kpiIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  kpiValue: {
    fontSize: TYPOGRAPHY.sizes.md + 2,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  kpiLabel: {
    fontSize: TYPOGRAPHY.sizes.xs - 1,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    ...SHADOWS.light,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg + SPACING.sm,
  },
  chartTitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.textPrimary,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingHorizontal: SPACING.xs,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    height: 120,
    width: 14,
    backgroundColor: COLORS.background,
    borderRadius: 7,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barActive: {
    backgroundColor: COLORS.primary,
  },
  barInactive: {
    backgroundColor: COLORS.border,
  },
  barToday: {
    backgroundColor: COLORS.primaryDark,
  },
  barMinutesText: {
    position: 'absolute',
    top: -20,
    fontSize: TYPOGRAPHY.sizes.xs - 2,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primaryDark,
    textAlign: 'center',
  },
  dayLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weights.medium,
    marginTop: SPACING.sm,
  },
  activeDayLabel: {
    color: COLORS.primaryDark,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
});
