import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from './AppHeader';
import { useWorkoutContext } from './WorkoutContext';
import { getTotalReps, isToday, isValidExerciseName } from './workoutUtils';
import styles from './styles';

export default function HomeScreen({ navigation, route }) {
  const { workouts, addWorkout } = useWorkoutContext();
  const [exercise, setExercise] = useState('');
  const [reps, setReps] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  // An exercise chosen in Explore is passed to this screen as a route parameter.
  useEffect(() => {
    const selectedExercise = route.params?.exerciseName;

    if (selectedExercise) {
      setExercise(selectedExercise);
      setMessage('Exercise selected. Enter your reps to save it.');
      setMessageType('success');
      navigation.setParams({ exerciseName: undefined });
    }
  }, [navigation, route.params?.exerciseName]);

  const todaysWorkouts = workouts.filter(workout => isToday(workout.createdAt));
  const todaysReps = getTotalReps(todaysWorkouts);

  function addTodaysWorkout() {
    const cleanedName = exercise.trim();
    const repCount = Number(reps);

    if (
      !isValidExerciseName(cleanedName) ||
      !Number.isSafeInteger(repCount) ||
      repCount <= 0
    ) {
      setMessage('Enter an exercise name and a positive whole number of reps.');
      setMessageType('error');
      return;
    }

    addWorkout({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: cleanedName,
      reps: repCount,
      createdAt: new Date().toISOString(),
    });

    setExercise('');
    setReps('');
    setMessage(`${cleanedName} was added to today's activity.`);
    setMessageType('success');
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <AppHeader
        title="Today's training"
        subtitle="Small steps. Stronger days. Log what you do."
      />

      <ScrollView
        style={styles.pageScroll}
        contentContainerStyle={styles.pagePadding}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{todaysWorkouts.length}</Text>
            <Text style={styles.statLabel}>Exercises today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{todaysReps}</Text>
            <Text style={styles.statLabel}>Total reps today</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Log an exercise</Text>
          <Text style={styles.fieldLabel}>Exercise name</Text>
          <TextInput
            style={styles.input}
            value={exercise}
            onChangeText={setExercise}
            placeholder="e.g. Push-ups"
            placeholderTextColor="#777777"
            maxLength={60}
            accessibilityLabel="Exercise name"
          />

          <Text style={styles.fieldLabel}>Repetitions</Text>
          <TextInput
            style={styles.input}
            value={reps}
            onChangeText={setReps}
            placeholder="e.g. 12"
            placeholderTextColor="#777777"
            keyboardType="number-pad"
            accessibilityLabel="Number of repetitions"
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={addTodaysWorkout}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Save Exercise</Text>
          </TouchableOpacity>

          {message !== '' && (
            <Text
              style={
                messageType === 'error'
                  ? styles.errorMessage
                  : styles.successMessage
              }
              accessibilityRole={messageType === 'error' ? 'alert' : 'text'}
            >
              {message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.textButton}
          onPress={() => navigation.navigate('History')}
          accessibilityRole="button"
        >
          <Text style={styles.textButtonLabel}>Review your workout history →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
