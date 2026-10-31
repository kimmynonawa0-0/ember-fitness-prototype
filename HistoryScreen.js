import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from './AppHeader';
import { useWorkoutContext } from './WorkoutContext';
import {
  formatWorkoutDate,
  getTotalReps,
  isToday,
  isValidExerciseName,
} from './workoutUtils';
import styles from './styles';

export default function HistoryScreen() {
  const { workouts, updateWorkout, deleteWorkout } = useWorkoutContext();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [editName, setEditName] = useState('');
  const [editReps, setEditReps] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [notice, setNotice] = useState('');

  const sortedWorkouts = [...workouts].sort((first, second) => (
    new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  ));
  const visibleWorkouts = sortedWorkouts.filter(workout => (
    selectedFilter === 'All' || isToday(workout.createdAt)
  ));

  function startEditing(workout) {
    setEditingWorkout(workout);
    setEditName(workout.name);
    setEditReps(String(workout.reps));
    setEditMessage('');
  }

  function closeEditor() {
    setEditingWorkout(null);
    setEditMessage('');
  }

  function saveWorkoutChanges() {
    const cleanedName = editName.trim();
    const repCount = Number(editReps);

    if (
      !isValidExerciseName(cleanedName) ||
      !Number.isSafeInteger(repCount) ||
      repCount <= 0
    ) {
      setEditMessage('Enter an exercise name and a positive whole number of reps.');
      return;
    }

    updateWorkout(editingWorkout.id, {
      name: cleanedName,
      reps: repCount,
    });
    setNotice('Workout updated.');
    closeEditor();
  }

  function confirmDelete(workout) {
    Alert.alert(
      'Delete this workout?',
      `${workout.name} will be removed from your history.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteWorkout(workout.id);
            setNotice('Workout deleted.');
          },
        },
      ]
    );
  }

  function renderWorkout({ item }) {
    return (
      <View style={styles.workoutCard}>
        <View style={styles.workoutDetails}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.repText}>{item.reps} reps</Text>
          <Text style={styles.dateText}>{formatWorkoutDate(item.createdAt)}</Text>
        </View>
        <View style={styles.rowActions}>
          <TouchableOpacity
            style={styles.smallActionButton}
            onPress={() => startEditing(item)}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${item.name}`}
          >
            <Text style={styles.smallActionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.smallActionButton, styles.deleteActionButton]}
            onPress={() => confirmDelete(item)}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${item.name}`}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const emptyMessage = selectedFilter === 'Today'
    ? 'No exercises logged today. Add one from the Today tab.'
    : 'Your saved exercises will appear here.';

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <AppHeader
        title="Workout history"
        subtitle="Your effort, saved and ready to review."
      />

      <View style={styles.historySummary}>
        <Text style={styles.summaryText}>
          {workouts.length} {workouts.length === 1 ? 'exercise' : 'exercises'} saved
        </Text>
        <Text style={styles.summaryText}>{getTotalReps(workouts)} total reps</Text>
      </View>

      <View style={styles.filterRow}>
        {['All', 'Today'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.selectedFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter)}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedFilter === filter }}
          >
            <Text
              style={[
                styles.filterLabel,
                selectedFilter === filter && styles.selectedFilterLabel,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {notice !== '' && (
        <Text style={styles.successMessage} accessibilityRole="status">
          {notice}
        </Text>
      )}

      <FlatList
        data={visibleWorkouts}
        keyExtractor={item => item.id}
        renderItem={renderWorkout}
        contentContainerStyle={styles.historyList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        }
      />

      <Modal
        visible={editingWorkout !== null}
        transparent
        animationType="fade"
        onRequestClose={closeEditor}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.sectionTitle}>Edit workout</Text>
            <Text style={styles.fieldLabel}>Exercise name</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              maxLength={60}
              accessibilityLabel="Edit exercise name"
            />
            <Text style={styles.fieldLabel}>Repetitions</Text>
            <TextInput
              style={styles.input}
              value={editReps}
              onChangeText={setEditReps}
              keyboardType="number-pad"
              accessibilityLabel="Edit number of repetitions"
            />
            {editMessage !== '' && (
              <Text style={styles.errorMessage} accessibilityRole="alert">
                {editMessage}
              </Text>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={closeEditor}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={saveWorkoutChanges}
              >
                <Text style={styles.buttonText}>Save changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
