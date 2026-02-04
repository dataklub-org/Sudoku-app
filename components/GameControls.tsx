import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Platform,
} from 'react-native';
import { Undo, Redo, Lightbulb, PencilLine } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface GameControlsProps {
  notesMode: boolean;
  onToggleNotes: () => void;
  hintsRemaining: number;
  onUseHint: () => void;
  canUndo: boolean;
  onUndo: () => void;
  canRedo: boolean;
  onRedo: () => void;
}

export function GameControls({
  notesMode,
  onToggleNotes,
  hintsRemaining,
  onUseHint,
  canUndo,
  onUndo,
  canRedo,
  onRedo,
}: GameControlsProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handlePress = (callback: () => void) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    callback();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isDark ? styles.buttonDark : styles.buttonLight,
          notesMode && (isDark ? styles.buttonActiveDark : styles.buttonActiveLight),
        ]}
        onPress={() => handlePress(onToggleNotes)}>
        <PencilLine
          size={20}
          color={notesMode ? (isDark ? '#60A5FA' : '#3B82F6') : (isDark ? '#F9FAFB' : '#1F2937')}
        />
        <Text
          style={[
            styles.buttonText,
            isDark ? styles.buttonTextDark : styles.buttonTextLight,
            notesMode && (isDark ? styles.buttonTextActiveDark : styles.buttonTextActiveLight),
          ]}>
          Notes
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          isDark ? styles.buttonDark : styles.buttonLight,
          hintsRemaining === 0 && styles.buttonDisabled,
        ]}
        onPress={() => handlePress(onUseHint)}
        disabled={hintsRemaining === 0}>
        <Lightbulb
          size={20}
          color={hintsRemaining > 0 ? (isDark ? '#F9FAFB' : '#1F2937') : '#9CA3AF'}
        />
        <Text
          style={[
            styles.buttonText,
            isDark ? styles.buttonTextDark : styles.buttonTextLight,
            hintsRemaining === 0 && styles.buttonTextDisabled,
          ]}>
          Hint ({hintsRemaining})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          isDark ? styles.buttonDark : styles.buttonLight,
          !canUndo && styles.buttonDisabled,
        ]}
        onPress={() => handlePress(onUndo)}
        disabled={!canUndo}>
        <Undo
          size={20}
          color={canUndo ? (isDark ? '#F9FAFB' : '#1F2937') : '#9CA3AF'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          isDark ? styles.buttonDark : styles.buttonLight,
          !canRedo && styles.buttonDisabled,
        ]}
        onPress={() => handlePress(onRedo)}
        disabled={!canRedo}>
        <Redo
          size={20}
          color={canRedo ? (isDark ? '#F9FAFB' : '#1F2937') : '#9CA3AF'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonLight: {
    backgroundColor: '#FFFFFF',
  },
  buttonDark: {
    backgroundColor: '#374151',
  },
  buttonActiveLight: {
    backgroundColor: '#DBEAFE',
  },
  buttonActiveDark: {
    backgroundColor: '#1E3A5F',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextLight: {
    color: '#1F2937',
  },
  buttonTextDark: {
    color: '#F9FAFB',
  },
  buttonTextActiveLight: {
    color: '#3B82F6',
  },
  buttonTextActiveDark: {
    color: '#60A5FA',
  },
  buttonTextDisabled: {
    color: '#9CA3AF',
  },
});
