import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Platform,
} from 'react-native';
import { Eraser } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface NumberPadProps {
  onNumberPress: (num: number) => void;
  onErasePress: () => void;
  disabled?: boolean;
}

export function NumberPad({
  onNumberPress,
  onErasePress,
  disabled = false,
}: NumberPadProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handlePress = (num: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onNumberPress(num);
  };

  const handleErase = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onErasePress();
  };

  return (
    <View style={styles.container}>
      <View style={styles.numberGrid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.numberButton,
              isDark ? styles.numberButtonDark : styles.numberButtonLight,
              disabled && styles.numberButtonDisabled,
            ]}
            onPress={() => handlePress(num)}
            disabled={disabled}>
            <Text
              style={[
                styles.numberText,
                isDark ? styles.numberTextDark : styles.numberTextLight,
              ]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[
          styles.eraseButton,
          isDark ? styles.eraseButtonDark : styles.eraseButtonLight,
          disabled && styles.numberButtonDisabled,
        ]}
        onPress={handleErase}
        disabled={disabled}>
        <Eraser
          size={24}
          color={isDark ? '#F9FAFB' : '#1F2937'}
        />
        <Text
          style={[
            styles.eraseText,
            isDark ? styles.eraseTextDark : styles.eraseTextLight,
          ]}>
          Erase
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  numberButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  numberButtonLight: {
    backgroundColor: '#FFFFFF',
  },
  numberButtonDark: {
    backgroundColor: '#374151',
  },
  numberButtonDisabled: {
    opacity: 0.5,
  },
  numberText: {
    fontSize: 24,
    fontWeight: '600',
  },
  numberTextLight: {
    color: '#1F2937',
  },
  numberTextDark: {
    color: '#F9FAFB',
  },
  eraseButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eraseButtonLight: {
    backgroundColor: '#FFFFFF',
  },
  eraseButtonDark: {
    backgroundColor: '#374151',
  },
  eraseText: {
    fontSize: 18,
    fontWeight: '600',
  },
  eraseTextLight: {
    color: '#1F2937',
  },
  eraseTextDark: {
    color: '#F9FAFB',
  },
});
