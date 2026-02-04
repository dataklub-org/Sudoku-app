import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, useColorScheme } from 'react-native';
import { Trophy } from 'lucide-react-native';

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView
      style={[
        styles.container,
        isDark ? styles.containerDark : styles.containerLight,
      ]}>
      <View style={styles.content}>
        <Trophy
          size={64}
          color={isDark ? '#9CA3AF' : '#6B7280'}
        />
        <Text
          style={[
            styles.title,
            isDark ? styles.titleDark : styles.titleLight,
          ]}>
          Stats Coming Soon
        </Text>
        <Text
          style={[
            styles.description,
            isDark ? styles.descriptionDark : styles.descriptionLight,
          ]}>
          Track your progress, best times, and achievements here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  titleLight: {
    color: '#1F2937',
  },
  titleDark: {
    color: '#F9FAFB',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
  descriptionLight: {
    color: '#6B7280',
  },
  descriptionDark: {
    color: '#9CA3AF',
  },
});
