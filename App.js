import React, { useState } from 'react';
import {
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './HomeScreen';
import HistoryScreen from './HistoryScreen';
import styles from './styles';

export default function App() {
  // The workout list is shared by both screens, so it stays here in App.
  const [workouts, setWorkouts] = useState([]);
  const [page, setPage] = useState('Home');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#101010" />

      <View style={styles.header}>
        <Text style={styles.brand}>EMBER</Text>
        <Text style={styles.title}>
          {page === 'Home' ? 'Daily Workout' : 'History'}
        </Text>
        <Text style={styles.subtitle}>
          {page === 'Home'
            ? 'Record each exercise and its reps.'
            : 'Exercises you added during this session.'}
        </Text>
      </View>

      <View style={styles.pageContent}>
        {page === 'Home' ? (
          <HomeScreen setWorkouts={setWorkouts} />
        ) : (
          <HistoryScreen workouts={workouts} setWorkouts={setWorkouts} />
        )}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setPage('Home')}
          accessibilityLabel="Home"
          accessibilityRole="button"
          accessibilityState={{ selected: page === 'Home' }}
        >
          <View style={styles.homeIcon}>
            <View style={[
              styles.homeRoof,
              page === 'Home' ? styles.activeRoof : styles.inactiveRoof,
            ]} />
            <View style={[
              styles.homeBody,
              page === 'Home' ? styles.activeIcon : styles.inactiveIcon,
            ]} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setPage('History')}
          accessibilityLabel="History"
          accessibilityRole="button"
          accessibilityState={{ selected: page === 'History' }}
        >
          <View style={[
            styles.clockIcon,
            page === 'History' ? styles.activeClock : styles.inactiveClock,
          ]}>
            <View style={[
              styles.clockHandTop,
              page === 'History' ? styles.activeIcon : styles.inactiveIcon,
            ]} />
            <View style={[
              styles.clockHandSide,
              page === 'History' ? styles.activeIcon : styles.inactiveIcon,
            ]} />
          </View>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
