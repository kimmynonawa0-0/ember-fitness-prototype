import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@daily-rep/workouts-v1';
const WorkoutContext = createContext(null);

function readWorkoutList(savedValue) {
  const parsedWorkouts = savedValue ? JSON.parse(savedValue) : [];

  if (!Array.isArray(parsedWorkouts)) {
    throw new Error('Saved workout data must be a list.');
  }

  // Give older records without a timestamp a usable date.
  return parsedWorkouts
    .filter(workout => (
      workout &&
      typeof workout.name === 'string' &&
      Number.isSafeInteger(Number(workout.reps)) &&
      Number(workout.reps) > 0
    ))
    .map((workout, index) => ({
      id: String(workout.id || `saved-${index}-${Date.now()}`),
      name: workout.name.trim(),
      reps: Number(workout.reps),
      createdAt: workout.createdAt || new Date().toISOString(),
    }));
}

export function WorkoutProvider({ children }) {
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const saveQueue = useRef(Promise.resolve());

  // Read saved data once when the provider mounts, and again if the user retries.
  useEffect(() => {
    let isActive = true;

    async function loadWorkouts() {
      setIsLoading(true);
      setLoadError('');

      try {
        const savedValue = await AsyncStorage.getItem(STORAGE_KEY);
        const savedWorkouts = readWorkoutList(savedValue);

        if (isActive) {
          setWorkouts(savedWorkouts);
          setIsReady(true);
        }
      } catch (error) {
        if (isActive) {
          setLoadError('Saved workouts could not be read from this device.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadWorkouts();

    return () => {
      isActive = false;
    };
  }, [loadAttempt]);

  // Save the full list after it changes. The queue keeps quick edits in order.
  useEffect(() => {
    if (!isReady) {
      return undefined;
    }

    let isActive = true;
    const savedValue = JSON.stringify(workouts);
    const saveTask = saveQueue.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(STORAGE_KEY, savedValue));

    saveQueue.current = saveTask;

    async function reportSaveResult() {
      try {
        await saveTask;
        if (isActive) {
          setSaveError('');
        }
      } catch (error) {
        if (isActive) {
          setSaveError('Your latest changes could not be saved. Try again later.');
        }
      }
    }

    reportSaveResult();

    return () => {
      isActive = false;
    };
  }, [isReady, workouts]);

  function addWorkout(workout) {
    setWorkouts(currentWorkouts => [...currentWorkouts, workout]);
  }

  function updateWorkout(id, changes) {
    setWorkouts(currentWorkouts => currentWorkouts.map(workout => (
      workout.id === id ? { ...workout, ...changes } : workout
    )));
  }

  function deleteWorkout(id) {
    setWorkouts(currentWorkouts => currentWorkouts.filter(
      workout => workout.id !== id
    ));
  }

  function retryLoading() {
    setIsReady(false);
    setLoadAttempt(currentAttempt => currentAttempt + 1);
  }

  async function clearSavedWorkouts() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setWorkouts([]);
      setLoadError('');
      setIsReady(true);
    } catch (error) {
      setLoadError('Saved data could not be cleared. Please try again.');
    }
  }

  const contextValue = {
    workouts,
    isLoading,
    loadError,
    saveError,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    retryLoading,
    clearSavedWorkouts,
  };

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkoutContext() {
  const context = useContext(WorkoutContext);

  if (context === null) {
    throw new Error('useWorkoutContext must be used inside WorkoutProvider.');
  }

  return context;
}
