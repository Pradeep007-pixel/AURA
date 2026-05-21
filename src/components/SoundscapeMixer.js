import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { Volume2, VolumeX, CloudRain, Waves, Trees, Play, Pause } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/colors';

const TRACKS = [
  {
    id: 'santa-monica',
    name: 'Santa Monica Waves',
    icon: Waves,
    url: 'https://raw.githubusercontent.com/thesephist/sounds/master/static/mp3/santa-monica-beach.mp3',
    description: 'Calming ocean waves crashing on the beach.'
  },
  {
    id: 'central-park',
    name: 'Central Park Birds',
    icon: Trees,
    url: 'https://raw.githubusercontent.com/thesephist/sounds/master/static/mp3/central-park-southeast.mp3',
    description: 'Rustling trees and singing morning birds.'
  },
  {
    id: 'getty-center',
    name: 'Getty Center Wind',
    icon: CloudRain, // Representing weather/wind ambiance
    url: 'https://raw.githubusercontent.com/thesephist/sounds/master/static/mp3/getty-center.mp3',
    description: 'Serene wind drafts and peaceful outdoor garden white noise.'
  }
];

const VOLUME_LEVELS = [
  { label: 'Off', value: 0.0 },
  { label: 'Soft', value: 0.25 },
  { label: 'Mid', value: 0.60 },
  { label: 'High', value: 1.0 }
];

export default function SoundscapeMixer() {
  const [loadingTracks, setLoadingTracks] = useState({});
  const [playingTracks, setPlayingTracks] = useState({});
  const [trackVolumes, setTrackVolumes] = useState({
    'santa-monica': 0.0,
    'central-park': 0.0,
    'getty-center': 0.0,
  });

  const soundsRef = useRef({});

  // Ensure Audio category is set for playback on iOS/Android
  useEffect(() => {
    async function setupAudio() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldRouteThroughEarpieceAndroid: false,
          staysActiveInBackground: true,
        });
      } catch (e) {
        console.log("Error configuring Audio settings:", e);
      }
    }
    setupAudio();

    return () => {
      // Unload all sounds on unmount to prevent resource leaks
      Object.entries(soundsRef.current).forEach(async ([id, sound]) => {
        if (sound) {
          try {
            await sound.stopAsync();
            await sound.unloadAsync();
          } catch (e) {
            console.log(`Error unloading track ${id}:`, e);
          }
        }
      });
    };
  }, []);

  const loadAndPlayTrack = async (trackId, url, initialVolume) => {
    setLoadingTracks((prev) => ({ ...prev, [trackId]: true }));
    try {
      if (soundsRef.current[trackId]) {
        await soundsRef.current[trackId].unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { 
          shouldPlay: true, 
          volume: initialVolume,
          isLooping: true
        }
      );

      soundsRef.current[trackId] = sound;
      setPlayingTracks((prev) => ({ ...prev, [trackId]: true }));
    } catch (error) {
      console.error(`Error loading track ${trackId}:`, error);
      alert(`Could not stream audio track. Please check your internet connection.`);
    } finally {
      setLoadingTracks((prev) => ({ ...prev, [trackId]: false }));
    }
  };

  const handleVolumeSelect = async (trackId, url, volumeValue) => {
    const prevVolume = trackVolumes[trackId];
    setTrackVolumes((prev) => ({ ...prev, [trackId]: volumeValue }));

    // If volume set to 0, pause the sound to save bandwidth/resources
    if (volumeValue === 0) {
      const sound = soundsRef.current[trackId];
      if (sound && playingTracks[trackId]) {
        try {
          await sound.setStatusAsync({ shouldPlay: false, volume: 0 });
          setPlayingTracks((prev) => ({ ...prev, [trackId]: false }));
        } catch (e) {
          console.log("Error pausing sound:", e);
        }
      }
    } 
    // If setting to a positive volume
    else {
      const sound = soundsRef.current[trackId];
      if (sound) {
        try {
          // If was paused, play it
          if (!playingTracks[trackId]) {
            await sound.setStatusAsync({ shouldPlay: true, volume: volumeValue });
            setPlayingTracks((prev) => ({ ...prev, [trackId]: true }));
          } else {
            await sound.setVolumeAsync(volumeValue);
          }
        } catch (e) {
          console.log("Error updating volume:", e);
        }
      } else {
        // Track not loaded yet, load and play it
        await loadAndPlayTrack(trackId, url, volumeValue);
      }
    }
  };

  const toggleMuteAll = async () => {
    const allMuted = Object.values(trackVolumes).every(v => v === 0);
    
    if (allMuted) {
      // Unmute to middle volume
      const newVolumes = {
        'santa-monica': 0.25,
        'central-park': 0.25,
        'getty-center': 0.0,
      };
      
      for (const track of TRACKS) {
        if (newVolumes[track.id] > 0) {
          await handleVolumeSelect(track.id, track.url, newVolumes[track.id]);
        }
      }
    } else {
      // Mute everything
      for (const track of TRACKS) {
        await handleVolumeSelect(track.id, track.url, 0);
      }
    }
  };

  const isAnyActive = Object.values(trackVolumes).some(v => v > 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>MIX YOUR ENVIRONMENT</Text>
        <Text style={styles.title}>Soundscapes</Text>
        <Text style={styles.description}>
          Layer calming atmospheric field-recordings to mask background noise and enhance focus.
        </Text>
      </View>

      {/* Mixer Board */}
      <View style={styles.mixerBoard}>
        {TRACKS.map((track) => {
          const IconComponent = track.icon;
          const currentVolume = trackVolumes[track.id];
          const isLoading = loadingTracks[track.id];
          const isPlaying = playingTracks[track.id];

          return (
            <View key={track.id} style={styles.trackRow}>
              {/* Left Side Info */}
              <View style={styles.trackInfo}>
                <View style={[styles.iconWrapper, isPlaying && styles.activeIconWrapper]}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <IconComponent 
                      size={20} 
                      color={isPlaying ? COLORS.primaryDark : COLORS.textSecondary} 
                    />
                  )}
                </View>
                <View style={styles.textWrapper}>
                  <Text style={styles.trackName}>{track.name}</Text>
                  <Text style={styles.trackDesc} numberOfLines={1}>{track.description}</Text>
                </View>
              </View>

              {/* Right Side: Step Volume Controls */}
              <View style={styles.volumeSelector}>
                {VOLUME_LEVELS.map((level) => {
                  const isSelected = currentVolume === level.value;
                  return (
                    <TouchableOpacity
                      key={level.label}
                      onPress={() => handleVolumeSelect(track.id, track.url, level.value)}
                      style={[
                        styles.volumeButton,
                        isSelected && styles.activeVolumeButton,
                      ]}
                      disabled={isLoading}
                    >
                      <Text
                        style={[
                          styles.volumeButtonText,
                          isSelected && styles.activeVolumeButtonText,
                        ]}
                      >
                        {level.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>

      {/* Master Toggle Bar */}
      <TouchableOpacity
        onPress={toggleMuteAll}
        style={[styles.muteAllButton, isAnyActive ? styles.muteAllActive : styles.muteAllInactive]}
        activeOpacity={0.8}
      >
        {isAnyActive ? (
          <>
            <VolumeX size={18} color={COLORS.danger} style={{ marginRight: SPACING.sm }} />
            <Text style={[styles.muteAllText, { color: COLORS.danger }]}>Mute All Sounds</Text>
          </>
        ) : (
          <>
            <Volume2 size={18} color={COLORS.primaryDark} style={{ marginRight: SPACING.sm }} />
            <Text style={[styles.muteAllText, { color: COLORS.primaryDark }]}>Activate Ambient Sounds</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  header: {
    marginBottom: SPACING.lg + SPACING.sm,
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
  mixerBoard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.light,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.sm,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeIconWrapper: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryLight,
  },
  textWrapper: {
    flex: 1,
  },
  trackName: {
    fontSize: TYPOGRAPHY.sizes.sm + 1,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  trackDesc: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textSecondary,
  },
  volumeSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  volumeButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 9,
    minWidth: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeVolumeButton: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.light,
  },
  volumeButtonText: {
    fontSize: TYPOGRAPHY.sizes.xs - 1,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  activeVolumeButtonText: {
    color: COLORS.primaryDark,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  muteAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: SPACING.xs,
  },
  muteAllActive: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
  },
  muteAllInactive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  muteAllText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
});
