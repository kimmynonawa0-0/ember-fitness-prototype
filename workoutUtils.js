export function isValidExerciseName(name) {
  const cleanedName = name.trim();
  return (
    cleanedName.length > 0 &&
    cleanedName.length <= 60 &&
    /^[A-Za-z0-9][A-Za-z0-9\s'’&/-]*$/.test(cleanedName)
  );
}

export function isToday(dateValue) {
  const workoutDate = new Date(dateValue);

  return (
    !Number.isNaN(workoutDate.getTime()) &&
    workoutDate.toDateString() === new Date().toDateString()
  );
}

export function getTotalReps(workouts) {
  return workouts.reduce((total, workout) => total + Number(workout.reps), 0);
}

export function formatWorkoutDate(dateValue) {
  const workoutDate = new Date(dateValue);

  if (Number.isNaN(workoutDate.getTime())) {
    return 'Date unavailable';
  }

  return workoutDate.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
