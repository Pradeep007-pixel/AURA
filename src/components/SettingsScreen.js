import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Plus, Minus, Info, RefreshCw } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/colors';

export default function SettingsScreen({
  focusMinutes,
  shortBreakMinutes,
  longBreakMinutes,
  setFocusMinutes,
  setShortBreakMinutes,
  setLongBreakMinutes,
  onResetStats
}) {
  const adjustTime = (type, amount) => {
    if (type === 'focus') {
      setFocusMinutes(prev => Math.max(5, Math.min(prev + amount, 120)));
    } else if (type === 'shortBreak') {
      setShortBreakMinutes(prev => Math.max(1, Math.min(prev + amount, 30)));
    } else if (type === 'longBreak') {
      setLongBreakMinutes(prev => Math.max(5, Math.min(prev + amount, 60)));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>PREFERENCES</Text>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.description}>
          Tailor the focus intervals to suit your personal attention span and energy cycles.
        </Text>
      </View>

      {/* Adjust Timers Section */}
      <View style={styles.settingsGroup}>
        <Text style={styles.groupLabel}>TIMER DURATIONS</Text>
        
        {/* Focus Timer */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Focus Interval</Text>
            <Text style={styles.settingDesc}>Time spent on focused work</Text>
          </View>
          <View style={styles.stepper}>
            <TouchableOpacity 
              onPress={() => adjustTime('focus', -5)}
              style={styles.stepButton}
              activeOpacity={0.7}
            >
              <Minus size={16} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.stepValue}>{focusMinutes}m</Text>
            <TouchableOpacity 
              onPress={() => adjustTime('focus', 5)}
              style={styles.stepButton}
              activeOpacity={0.7}
            >
              <Plus size={16} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Short Break */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Short Break</Text>
            <Text style={styles.settingDesc}>Rest session between intervals</Text>
          </View>
          <View style={styles.stepper}>
            <TouchableOpacity 
              onPress={() => adjustTime('shortBreak', -1)}
              style={styles.stepButton}
              activeOpacity={0.7}
            >
              <Minus size={16} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.stepValue}>{shortBreakMinutes}m</Text>
            <TouchableOpacity 
              onPress={() => adjustTime('shortBreak', 1)}
              style={styles.stepButton}
              activeOpacity={0.7}
            >
              <Plus size={16} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Long Break */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Long Break</Text>
            <Text style={styles.settingDesc}>Extended rest after 4 focus rounds</Text>
          </View>
          <View style={styles.stepper}>
            <TouchableOpacity 
              onPress={() => adjustTime('longBreak', -5)}
              style={styles.stepButton}
              activeOpacity={0.7}
            >
              <Minus size={16} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.stepValue}>{longBreakMinutes}m</Text>
            <TouchableOpacity 
              onPress={() => adjustTime('longBreak', 5)}
              style={styles.stepButton}
              activeOpacity={0.7}
            >
              <Plus size={16} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Danger Zone Section */}
      <View style={styles.settingsGroup}>
        <Text style={styles.groupLabel}>DATA MANAGEMENT</Text>
        <TouchableOpacity
          onPress={() => {
            const confirmReset = confirm ? confirm("Are you sure you want to reset all focus stats? This cannot be undone.") : true;
            if (confirmReset) onResetStats();
          }}
          style={styles.resetButton}
          activeOpacity={0.8}
        >
          <RefreshCw size={16} color={COLORS.danger} style={{ marginRight: SPACING.sm }} />
          <Text style={styles.resetText}>Reset Focus Statistics</Text>
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.infoCard}>
        <Info size={16} color={COLORS.textSecondary} style={{ marginRight: SPACING.sm, marginTop: 2 }} />
        <Text style={styles.infoText}>
          Aura is built on the Pomodoro Technique. It is recommended to take a 5-minute break after 25 minutes of work, and a longer 15-minute break after every 4 cycles.
        </Text>
      </View>

      <Text style={styles.versionText}>AURA APP • VERSION 1.0.0</Text>
    </ScrollView>
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
  settingsGroup: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.light,
  },
  groupLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingInfo: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  settingName: {
    fontSize: TYPOGRAPHY.sizes.sm + 1,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textSecondary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 2,
  },
  stepButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.light,
  },
  stepValue: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.textPrimary,
    marginHorizontal: SPACING.md,
    minWidth: 32,
    textAlign: 'center',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
    marginTop: SPACING.xs,
  },
  resetText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.danger,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    ...SHADOWS.light,
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.xs + 1,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  versionText: {
    fontSize: TYPOGRAPHY.sizes.xs - 2,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textSecondary,
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: SPACING.xxl,
  },
});
