import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Clock, X } from 'lucide-react-native';

interface GameInfoProps {
  timer: number;
  mistakes: number;
  maxMistakes: number;
}

export function GameInfo({ timer, mistakes, maxMistakes }: GameInfoProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoItem}>
        <Clock
          size={20}
          color={isDark ? '#9CA3AF' : '#6B7280'}
        />
        <Text
          style={[
            styles.infoText,
            isDark ? styles.infoTextDark : styles.infoTextLight,
          ]}>
          {formatTime(timer)}
        </Text>
      </View>

      <View style={styles.infoItem}>
        <X
          size={20}
          color={mistakes >= maxMistakes ? '#DC2626' : isDark ? '#9CA3AF' : '#6B7280'}
        />
        <Text
          style={[
            styles.infoText,
            isDark ? styles.infoTextDark : styles.infoTextLight,
            mistakes >= maxMistakes && styles.mistakesMax,
          ]}>
          {mistakes}/{maxMistakes}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoTextLight: {
    color: '#1F2937',
  },
  infoTextDark: {
    color: '#F9FAFB',
  },
  mistakesMax: {
    color: '#DC2626',
  },
});
