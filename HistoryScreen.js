import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

export default function HistoryScreen({ workouts, setWorkouts }) {
  function deleteWorkout(id) {
    // Filter makes a new list without the selected exercise.
    setWorkouts(currentWorkouts =>
      currentWorkouts.filter(workout => workout.id !== id)
    );
  }

  return (
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
  );
}
