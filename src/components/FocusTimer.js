import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/colors';

const { width } = Dimensions.get('window');
const TIMER_SIZE = Math.min(width * 0.65, 240);
const STROKE_WIDTH = 6;
const RADIUS = (TIMER_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function FocusTimer({
  focusMinutes = 25,
  shortBreakMinutes = 5,
  longBreakMinutes = 15,
  onSessionComplete,
}) {
  const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60);
  const [totalDuration, setTotalDuration] = useState(focusMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  // Sync timer when duration settings or mode change
  useEffect(() => {
    resetTimer(mode, false);
  }, [focusMinutes, shortBreakMinutes, longBreakMinutes]);

  const resetTimer = (newMode = mode, stop = true) => {
    if (stop) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    let minutes = focusMinutes;
    if (newMode === 'shortBreak') minutes = shortBreakMinutes;
    if (newMode === 'longBreak') minutes = longBreakMinutes;
    
    setTimeLeft(minutes * 60);
    setTotalDuration(minutes * 60);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    resetTimer(newMode, true);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            setIsActive(false);
            clearInterval(timerRef.current);
            
            // Trigger completion callback
            if (mode === 'focus') {
              onSessionComplete(totalDuration / 60);
            }
            
            // Play alert / transition mode
            const nextMode = mode === 'focus' ? 'shortBreak' : 'focus';
            alert(mode === 'focus' ? "Focus session finished! Time for a short break." : "Break finished! Let's focus.");
            handleModeChange(nextMode);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, mode, totalDuration]);

  // Format MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Circular progress calculations
  const progress = timeLeft / totalDuration;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={styles.container}>
      {/* Mode Selector Tabs */}
      <View style={styles.tabContainer}>
        {['focus', 'shortBreak', 'longBreak'].map((tabMode) => (
          <TouchableOpacity
            key={tabMode}
            onPress={() => handleModeChange(tabMode)}
            style={[
              styles.tab,
              mode === tabMode && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                mode === tabMode && styles.activeTabText,
              ]}
            >
              {tabMode === 'focus' && 'Focus'}
              {tabMode === 'shortBreak' && 'Short Break'}
              {tabMode === 'longBreak' && 'Long Break'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Circle Countdown Timer */}
      <View style={styles.timerCircleWrapper}>
        <Svg width={TIMER_SIZE} height={TIMER_SIZE} style={styles.svg}>
          {/* Background circle */}
          <Circle
            cx={TIMER_SIZE / 2}
            cy={TIMER_SIZE / 2}
            r={RADIUS}
            stroke={COLORS.border}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={TIMER_SIZE / 2}
            cy={TIMER_SIZE / 2}
            r={RADIUS}
            stroke={COLORS.primary}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${TIMER_SIZE / 2} ${TIMER_SIZE / 2})`}
          />
        </Svg>
        
        {/* Absolute Centered Countdown Text */}
        <View style={styles.textOverlay}>
          <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.modeSubText}>
            {mode === 'focus' ? 'STAY FOCUSED' : 'REST & RECHARGE'}
          </Text>
        </View>
      </View>

      {/* Timer Action Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={() => resetTimer(mode, true)}
          style={[styles.circleButton, styles.secondaryButton]}
          activeOpacity={0.7}
        >
          <RotateCcw size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleTimer}
          style={[styles.circleButton, styles.primaryButton, SHADOWS.light]}
          activeOpacity={0.8}
        >
          {isActive ? (
            <Pause size={28} color={COLORS.surface} fill={COLORS.surface} />
          ) : (
            <Play size={28} color={COLORS.surface} fill={COLORS.surface} style={{ marginLeft: 3 }} />
          )}
        </TouchableOpacity>

        <View style={{ width: 48 }} /> 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
    marginBottom: SPACING.xl,
    width: '90%',
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.primaryLight,
  },
  tabText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primaryDark,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  timerCircleWrapper: {
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl + SPACING.sm,
  },
  svg: {
    position: 'absolute',
  },
  textOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: TYPOGRAPHY.sizes.jumbo - 14,
    fontWeight: TYPOGRAPHY.weights.light,
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  modeSubText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
    letterSpacing: 2,
    marginTop: -SPACING.xs,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
  },
  circleButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.lg,
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
