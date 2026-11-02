import React from 'react';
import { ActivityIndicator, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ExerciseLibraryScreen from './ExerciseLibraryScreen';
import HistoryScreen from './HistoryScreen';
import HomeScreen from './HomeScreen';
import { WorkoutProvider, useWorkoutContext } from './WorkoutContext';
import styles from './styles';

const Tab = createBottomTabNavigator();

function LoadingScreen() {
  return (
    <SafeAreaView style={styles.messageScreen}>
      <Text style={styles.brand}>EMBER</Text>
      <ActivityIndicator size="large" color="#f07842" />
      <Text style={styles.loadingText}>Loading your saved workouts...</Text>
    </SafeAreaView>
  );
}

function StorageErrorScreen() {
  const { retryLoading, clearSavedWorkouts } = useWorkoutContext();

  return (
    <SafeAreaView style={styles.messageScreen}>
      <Text style={styles.brand}>EMBER</Text>
      <Text style={styles.messageTitle}>Your workouts could not be loaded.</Text>
      <Text style={styles.messageBody}>
        Try reading your saved data again. If it is damaged, you can clear it and
        start with an empty history.
      </Text>
      <TouchableOpacity style={styles.primaryButton} onPress={retryLoading}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={clearSavedWorkouts}
      >
        <Text style={styles.secondaryButtonText}>Clear Saved Data</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function AppNavigation() {
  const { isLoading, loadError, saveError } = useWorkoutContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (loadError) {
    return <StorageErrorScreen />;
  }

  return (
    <View style={styles.appRoot}>
      <StatusBar barStyle="light-content" backgroundColor="#101010" />
      {saveError !== '' && (
        <Text style={styles.saveWarning} accessibilityRole="alert">
          {saveError}
        </Text>
      )}
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#f07842',
            tabBarInactiveTintColor: '#888888',
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarHideOnKeyboard: true,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Today', tabBarLabel: 'Today' }}
          />
          <Tab.Screen
            name="History"
            component={HistoryScreen}
            options={{ title: 'History', tabBarLabel: 'History' }}
          />
          <Tab.Screen
            name="Exercises"
            component={ExerciseLibraryScreen}
            options={{ title: 'Explore', tabBarLabel: 'Explore' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <WorkoutProvider>
        <AppNavigation />
      </WorkoutProvider>
    </SafeAreaProvider>
  );
}
