import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from './AppHeader';
import styles from './styles';

const EXERCISE_API_URL = 'https://wger.de/api/v2/exerciseinfo/?language=2&limit=30';

function formatExercise(exercise) {
  const englishTranslation = exercise.translations?.find(
    translation => translation.language === 2
  );

  if (!englishTranslation?.name) {
    return null;
  }

  return {
    id: String(exercise.id),
    name: englishTranslation.name,
    description: englishTranslation.description_source || '',
    category: exercise.category?.name || 'General',
    muscles: (exercise.muscles || []).map(muscle => (
      muscle.name_en || muscle.name
    )),
    equipment: (exercise.equipment || []).map(item => item.name),
    license: exercise.license?.short_name || 'Exercise database',
    author: exercise.license_author || 'wger community',
  };
}

export default function ExerciseLibraryScreen({ navigation }) {
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  // Load the exercise guide when this tab is first opened or refreshed.
  useEffect(() => {
    let isActive = true;

    async function loadExercises() {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(EXERCISE_API_URL);

        if (!response.ok) {
          throw new Error('The exercise service returned an error.');
        }

        const data = await response.json();

        if (!Array.isArray(data.results)) {
          throw new Error('The exercise service returned unexpected data.');
        }

        const exerciseList = data.results
          .map(formatExercise)
          .filter(exercise => exercise !== null);

        if (isActive) {
          setExercises(exerciseList);
        }
      } catch (requestError) {
        if (isActive) {
          setError('The exercise guide could not load. Check your connection and try again.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadExercises();

    return () => {
      // Ignore a late network response after this screen is removed.
      isActive = false;
    };
  }, [refreshCount]);

  const searchText = search.trim().toLowerCase();
  const filteredExercises = exercises.filter(exercise => (
    exercise.name.toLowerCase().includes(searchText) ||
    exercise.category.toLowerCase().includes(searchText) ||
    exercise.muscles.some(muscle => muscle.toLowerCase().includes(searchText))
  ));

  function refreshExercises() {
    setRefreshCount(currentCount => currentCount + 1);
  }

  function renderExercise({ item }) {
    const targetMuscles = item.muscles.length > 0
      ? item.muscles.join(', ')
      : 'Not listed';
    const equipment = item.equipment.length > 0
      ? item.equipment.join(', ')
      : 'Bodyweight or not listed';

    return (
      <View style={styles.exerciseCard}>
        <View style={styles.exerciseCardHeading}>
          <Text style={styles.exerciseCategory}>{item.category}</Text>
          <Text style={styles.exerciseName}>{item.name}</Text>
        </View>
        {item.description !== '' && (
          <Text style={styles.exerciseDescription} numberOfLines={4}>
            {item.description}
          </Text>
        )}
        <Text style={styles.exerciseMeta}>Target: {targetMuscles}</Text>
        <Text style={styles.exerciseMeta}>Equipment: {equipment}</Text>
        <Text style={styles.exerciseCredit}>
          Source: {item.author} · {item.license}
        </Text>
        <TouchableOpacity
          style={styles.secondaryActionButton}
          onPress={() => navigation.navigate('Home', { exerciseName: item.name })}
          accessibilityRole="button"
          accessibilityLabel={`Log ${item.name}`}
        >
          <Text style={styles.secondaryActionText}>Log this exercise</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <AppHeader
        title="Exercise guide"
        subtitle="Find a movement and add it to today's log."
      />

      <View style={styles.libraryControls}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search exercise or muscle"
          placeholderTextColor="#777777"
          accessibilityLabel="Search exercise guide"
        />
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshExercises}
          accessibilityRole="button"
        >
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {isLoading && exercises.length === 0 ? (
        <View style={styles.loadingPanel}>
          <ActivityIndicator size="large" color="#f07842" />
          <Text style={styles.loadingText}>Loading exercise guide...</Text>
        </View>
      ) : error !== '' && exercises.length === 0 ? (
        <View style={styles.errorPanel}>
          <Text style={styles.errorTitle}>Could not load exercises</Text>
          <Text style={styles.messageBody}>{error}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={refreshExercises}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {error !== '' && (
            <Text style={styles.errorMessage} accessibilityRole="alert">
              {error} Showing the last results.
            </Text>
          )}
          <FlatList
            data={filteredExercises}
            keyExtractor={item => item.id}
            renderItem={renderExercise}
            contentContainerStyle={styles.libraryList}
            refreshing={isLoading}
            onRefresh={refreshExercises}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {searchText ? 'No matching exercises.' : 'No exercises are available right now.'}
              </Text>
            }
            ListFooterComponent={(
              <TouchableOpacity
                style={styles.attributionLink}
                onPress={() => Linking.openURL('https://wger.de')}
                accessibilityRole="link"
              >
                <Text style={styles.exerciseCredit}>
                  Exercise information provided by wger.de. Tap for the source.
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
}
