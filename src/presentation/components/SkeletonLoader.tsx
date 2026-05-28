import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { THEME } from '../../core/theme';

export const SkeletonLoader: React.FC = () => {
  const animatedValue = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    // Shimmer opacity looping animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.75,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const renderSkeletonRow = (index: number) => (
    <Animated.View
      key={index}
      style={[styles.card, { opacity: animatedValue }]}
    >
      <View style={styles.avatarPlaceholder} />
      
      <View style={styles.contentPlaceholder}>
        <View style={styles.headerPlaceholder}>
          <View style={styles.nameLine} />
          <View style={styles.badgePlaceholder} />
        </View>
        <View style={styles.roleLine} />
        <View style={styles.tagLine} />
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map((id) => renderSkeletonRow(id))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  card: {
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: THEME.borderRadius.round,
    backgroundColor: THEME.colors.border,
    marginRight: THEME.spacing.md,
  },
  contentPlaceholder: {
    flex: 1,
  },
  headerPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  nameLine: {
    width: '45%',
    height: 14,
    borderRadius: THEME.borderRadius.xs,
    backgroundColor: THEME.colors.border,
  },
  badgePlaceholder: {
    width: 60,
    height: 18,
    borderRadius: THEME.borderRadius.round,
    backgroundColor: THEME.colors.border,
  },
  roleLine: {
    width: '70%',
    height: 12,
    borderRadius: THEME.borderRadius.xs,
    backgroundColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  tagLine: {
    width: '30%',
    height: 20,
    borderRadius: THEME.borderRadius.xs,
    backgroundColor: THEME.colors.border,
  },
});
