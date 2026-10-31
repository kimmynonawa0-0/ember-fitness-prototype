import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

export default function AppHeader({ title, subtitle }) {
  return (
    <View style={styles.header}>
      <Text style={styles.brand}>EMBER</Text>
      <Text style={styles.headerTitle}>{title}</Text>
      <Text style={styles.headerSubtitle}>{subtitle}</Text>
    </View>
  );
}
