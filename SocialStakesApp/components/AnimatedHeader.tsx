// app/components/AnimatedHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

type AnimatedHeaderProps = {
  title: string;
};

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ title }) => {
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
      <Text style={styles.title}>{title}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: '#6200ee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AnimatedHeader;