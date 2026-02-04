import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Platform,
} from 'react-native';
import { Trophy, Clock, X as XIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Difficulty } from '@/utils/sudoku';

interface WinModalProps {
  visible: boolean;
  timer: number;
  mistakes: number;
  difficulty: Difficulty;
  onNewGame: () => void;
  onClose: () => void;
}

export function WinModal({
  visible,
  timer,
  mistakes,
  difficulty,
  onNewGame,
  onClose,
}: WinModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (visible && Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [visible]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.modal,
            isDark ? styles.modalDark : styles.modalLight,
          ]}>
          <View style={styles.iconContainer}>
            <Trophy size={64} color="#FBBF24" />
          </View>

          <Text
            style={[
              styles.title,
              isDark ? styles.titleDark : styles.titleLight,
            ]}>
            Puzzle Complete!
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Clock
                size={20}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
              <Text
                style={[
                  styles.statLabel,
                  isDark ? styles.statLabelDark : styles.statLabelLight,
                ]}>
                Time
              </Text>
              <Text
                style={[
                  styles.statValue,
                  isDark ? styles.statValueDark : styles.statValueLight,
                ]}>
                {formatTime(timer)}
              </Text>
            </View>

            <View style={styles.statItem}>
              <XIcon
                size={20}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
              <Text
                style={[
                  styles.statLabel,
                  isDark ? styles.statLabelDark : styles.statLabelLight,
                ]}>
                Mistakes
              </Text>
              <Text
                style={[
                  styles.statValue,
                  isDark ? styles.statValueDark : styles.statValueLight,
                ]}>
                {mistakes}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Trophy
                size={20}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
              <Text
                style={[
                  styles.statLabel,
                  isDark ? styles.statLabelDark : styles.statLabelLight,
                ]}>
                Difficulty
              </Text>
              <Text
                style={[
                  styles.statValue,
                  isDark ? styles.statValueDark : styles.statValueLight,
                ]}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonPrimary,
            ]}
            onPress={onNewGame}>
            <Text style={styles.buttonPrimaryText}>New Game</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              isDark ? styles.buttonSecondaryDark : styles.buttonSecondaryLight,
            ]}
            onPress={onClose}>
            <Text
              style={[
                styles.buttonSecondaryText,
                isDark ? styles.buttonSecondaryTextDark : styles.buttonSecondaryTextLight,
              ]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalLight: {
    backgroundColor: '#FFFFFF',
  },
  modalDark: {
    backgroundColor: '#1F2937',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 24,
  },
  titleLight: {
    color: '#1F2937',
  },
  titleDark: {
    color: '#F9FAFB',
  },
  statsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statLabel: {
    fontSize: 16,
    flex: 1,
  },
  statLabelLight: {
    color: '#6B7280',
  },
  statLabelDark: {
    color: '#9CA3AF',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  statValueLight: {
    color: '#1F2937',
  },
  statValueDark: {
    color: '#F9FAFB',
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: '#3B82F6',
  },
  buttonPrimaryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonSecondaryLight: {
    backgroundColor: '#F3F4F6',
  },
  buttonSecondaryDark: {
    backgroundColor: '#374151',
  },
  buttonSecondaryText: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttonSecondaryTextLight: {
    color: '#1F2937',
  },
  buttonSecondaryTextDark: {
    color: '#F9FAFB',
  },
});
