import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';

export default function HomeScreen({ setWorkouts }) {
  const [exercise, setExercise] = React.useState('');
  const [reps, setReps] = React.useState('');
  const [message, setMessage] = React.useState('');

  function addWorkout() {
    const name = exercise.trim();
    // Keep only letters, spaces, apostrophes, or hyphens in the exercise name.
    const hasValidName = /^[A-Za-z\s'-]+$/.test(name);
    const repCount = Number(reps);

    if (
      name === '' ||
      !hasValidName ||
      !Number.isInteger(repCount) ||
      repCount <= 0
    ) {
      setMessage('Enter a valid exercise name and a positive whole number of reps.');
      return;
    }

    const newWorkout = {
      id: `${Date.now()}-${Math.random()}`,
      name: name,
      reps: repCount,
    };

    // Add the new workout to the shared list from App.
    setWorkouts(currentWorkouts => [...currentWorkouts, newWorkout]);
    setExercise('');
    setReps('');
    setMessage('Exercise added. View it in History.');
  }

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Exercise</Text>
      <TextInput
        style={styles.input}
        value={exercise}
        onChangeText={setExercise}
        placeholder="e.g. Push-ups"
        placeholderTextColor="#777777"
      />

      <Text style={styles.label}>Reps</Text>
      <TextInput
        style={styles.input}
        value={reps}
        onChangeText={setReps}
        placeholder="e.g. 12"
        placeholderTextColor="#777777"
        keyboardType="number-pad"
      />

      <TouchableOpacity style={styles.addButton} onPress={addWorkout}>
        <Text style={styles.buttonText}>Add Exercise</Text>
      </TouchableOpacity>

      {message !== '' && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}
