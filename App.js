import React, { useState } from 'react';
import {
  FlatList,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';

export default function App() {
  // useState remembers the inputs, saved list, and selected page while the app is open.
  const [exercise, setExercise] = useState('');
  const [reps, setReps] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState('Home');

  function addWorkout() {
    const name = exercise.trim();
    const repCount = Number(reps);

    if (name === '' || !Number.isInteger(repCount) || repCount <= 0) {
      setMessage('Enter an exercise and a positive whole number of reps.');
      return;
    }

    const newWorkout = {
      id: String(nextId),
      name: name,
      reps: repCount,
    };

    // Spread copies the old list, then adds the new exercise.
    setWorkouts([...workouts, newWorkout]);
    setNextId(nextId + 1);
    setExercise('');
    setReps('');
    setMessage('Exercise added. View it in History.');
  }

  function deleteWorkout(id) {
    // Filter makes a new list without the selected exercise.
    setWorkouts(workouts.filter(workout => workout.id !== id));
  }

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
          <View style={styles.form}>
            <Text style={styles.label}>Exercise</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Push Ups"
              placeholderTextColor="#aaaaaa"
              value={exercise}
              onChangeText={setExercise}
            />

            <Text style={styles.label}>Reps</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 10"
              placeholderTextColor="#aaaaaa"
              keyboardType="number-pad"
              value={reps}
              onChangeText={setReps}
            />

            <TouchableOpacity style={styles.addButton} onPress={addWorkout}>
              <Text style={styles.buttonText}>Add Exercise</Text>
            </TouchableOpacity>
            {message !== '' && <Text style={styles.message}>{message}</Text>}
          </View>
        ) : (
          <View style={styles.history}>
            <Text style={styles.listTitle}>Exercises saved: {workouts.length}</Text>

            <FlatList
              data={workouts}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No exercises yet.</Text>
              }
              renderItem={({ item }) => (
                <View style={styles.workoutRow}>
                  <View style={styles.workoutDetails}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    <Text style={styles.repText}>{item.reps} reps</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteWorkout(item.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
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
