# Daily Rep — Final MCO Defense Guide

This guide explains the current EMBER app, its main data flow, and how the Lesson 6–8 ideas are used. The project is intentionally kept in plain JavaScript with small functional components so the code can be followed and explained during a defense.

## 1. What the app does

Daily Rep is an offline-first workout tracker with three bottom tabs:

- **Today** records an exercise and its rep count, then shows today's exercise and rep totals.
- **History** lists saved records, filters to today's entries, and lets the user edit or delete an entry.
- **Explore** fetches exercise names and details from the wger public REST API. A selected exercise can be sent to Today to prefill the form.

Workout history is stored on the device with AsyncStorage. There is no account, backend, or cloud synchronization. The Explore tab needs an internet connection; if its request fails, the app shows an error and retry option while local workout tracking remains available.

## 2. Project files

- `index.js` is Expo's entry point. It registers `App`.
- `App.js` provides safe-area support, wraps the app in `WorkoutProvider`, handles storage startup feedback, and declares the bottom tab navigator.
- `WorkoutContext.js` owns the shared workout array. It loads and saves the array with AsyncStorage and provides the add, update, and delete functions to screens.
- `HomeScreen.js` owns the Today form state, validates user input, records a workout, and displays today's totals.
- `HistoryScreen.js` renders saved entries with `FlatList`, filters them, and handles editing and deletion.
- `ExerciseLibraryScreen.js` fetches and searches the wger exercise list and links a selected item to the Today form.
- `AppHeader.js` is the shared screen heading.
- `workoutUtils.js` contains small helpers for validating exercise names, checking dates, formatting dates, and totaling reps.
- `styles.js` contains the app's shared React Native styles and Flexbox layout.
- `README.md` describes how to run and demonstrate the app.

## 3. How the app starts

`index.js` imports `App` and calls Expo's `registerRootComponent(App)`. In `App.js`, `SafeAreaProvider` makes device inset information available and `WorkoutProvider` starts reading saved workout data. While that read is in progress, `AppNavigation` shows a loading screen. If reading fails, it offers **Try Again** and **Clear Saved Data** instead of silently replacing the history.

When storage is ready, `AppNavigation` renders one `NavigationContainer` and a `createBottomTabNavigator` with Today, History, and Explore routes. Each route points to a screen component. The navigator owns tab selection and keeps a tab's screen state when the user moves between tabs.

## 4. Shared state and Context

The workout list is used by Today and History, so `WorkoutProvider` is the common owner of that state. It provides these values through `WorkoutContext`:

| Value or function | Purpose |
| --- | --- |
| `workouts` | The current array of workout records |
| `addWorkout(workout)` | Adds a record using a new array |
| `updateWorkout(id, changes)` | Replaces the matching record with an updated object |
| `deleteWorkout(id)` | Removes a record with `filter` |
| `isLoading`, `loadError`, `saveError` | Lets the app show storage feedback |

Screens call `useWorkoutContext()` to read these values. This avoids passing the same workout data through navigation components that do not use it. The updates use React state setters and do not mutate the existing array or objects.

## 5. Local persistence: Lesson 8

AsyncStorage stores strings, so `WorkoutContext.js` uses `JSON.parse` after `getItem` to restore an array and `JSON.stringify` before `setItem` to save it.

1. When the provider mounts, a `useEffect` reads the key `@daily-rep/workouts-v1`.
2. A valid saved array becomes the `workouts` state. Any record without a date receives a usable date when it is loaded.
3. `isReady` prevents the save effect from writing the initial empty array before the read has completed.
4. A second `useEffect` saves the complete workout array whenever it changes. A small promise queue keeps rapid updates in order.
5. Storage errors are surfaced in the interface. A load failure can be retried or cleared; a save failure displays a warning.

The workout record has this shape:

```js
{
  id: 'unique-id',
  name: 'Push-ups',
  reps: 12,
  createdAt: '2026-10-29T10:30:00.000Z'
}
```

AsyncStorage is local, unencrypted device storage. It is appropriate for this small app's workout history, but it is not a cloud backup or a secure vault.

## 6. Creating a workout: Today

`HomeScreen.js` keeps `exercise` and `reps` in local state. Each `TextInput` is controlled: its `value` comes from state and `onChangeText` updates that state.

When **Save Exercise** is tapped, `addTodaysWorkout()`:

1. Trims the exercise name and converts the reps text with `Number()`.
2. Calls `isValidExerciseName()` and checks that reps are a positive whole number.
3. Creates a record with an ID, name, reps, and current timestamp.
4. Calls `addWorkout()`, which appends the record with `[...currentWorkouts, workout]`.
5. Clears the inputs and displays a success message. Invalid input gets an error message instead.

The Today totals are derived from the shared list using `isToday()` and `getTotalReps()`. They are calculated from records rather than stored separately, so they cannot drift out of sync with the history.

## 7. Reading, updating, and deleting: History

`HistoryScreen.js` passes the shared `workouts` array to `FlatList`. The list uses each record's `id` as its key and displays the name, reps, and date. The filter state selects either all records or only today's records.

- **Update:** Edit opens a modal with controlled inputs. The same validation is used as in Today. `updateWorkout()` maps over the list and creates a replacement object for the matching ID; the original date is preserved.
- **Delete:** Delete asks for confirmation with `Alert.alert`. Confirming calls `deleteWorkout()`, which uses `filter` to create a list without that ID.
- **Persistence:** Either update changes the Context state, which triggers the persistence effect and writes the new list to AsyncStorage.

This covers Create, Read, Update, and Delete (CRUD) for workout records.

## 8. Exercise data fetching: Lesson 6

`ExerciseLibraryScreen.js` requests:

```text
https://wger.de/api/v2/exerciseinfo/?language=2&limit=30
```

Its `useEffect` runs when the Explore screen first mounts and when the refresh counter changes. The effect calls an inner `async` function, uses `await fetch(...)`, checks `response.ok`, and then converts the JSON response into the smaller set of fields that the screen needs. `catch` displays an error; `finally` ends the loading state. The cleanup flag ignores a late response if the screen has been removed before the request finishes.

The screen has distinct loading, error, empty, and results UI. The user can retry a failed request or search by exercise name, category, or muscle. Each result shows its author/license where provided and has a **Log this exercise** button.

That button uses `navigation.navigate('Home', { exerciseName: item.name })`. `HomeScreen` watches that route parameter in its own `useEffect`, fills the exercise input, and clears the parameter so it is not applied again on later renders. This demonstrates passing small route data between tabs.

## 9. Navigation and UI feedback: Lesson 7

`createBottomTabNavigator()` defines three named routes. The tab bar remains available while the user moves between the main sections. Shared workout state is held above the screens in `WorkoutProvider`, following the lesson's shared-state idea. Context is used here because several tab screens need common data; for a single parent-child relationship, ordinary props would be simpler.

The app provides feedback instead of leaving the user to infer an outcome: storage loading and errors, API loading and errors, form validation, add/update/delete confirmation, empty lists, and a visible warning if saving fails.

## 10. Styling

`styles.js` uses `StyleSheet.create()` to keep visual styles out of most screen logic. Flexbox lays out the daily summary cards, workout rows, action buttons, and bottom navigation. The orange accent and dark background are carried over from the midterm EMBER design.

## 11. Short defense walkthrough

1. Start on **Today** and explain the controlled fields and input validation.
2. Open **Explore**, point out the loading UI, fetched results, and search. Tap **Log this exercise** and explain the `exerciseName` route parameter.
3. Enter reps on Today and save. Explain that Context updates the shared list immutably and the totals are derived from it.
4. Open **History**, edit the entry, and then delete it. Point out `FlatList`, `.map()`, `.filter()`, and the confirmation dialog.
5. Restart the app and show the record still exists. Explain the `useEffect` read/write flow and JSON conversion.

## 12. Common defense questions

**Why use `useEffect` for the API request?**  
Fetching is a side effect, not part of calculating the screen's UI. `useEffect` runs it after render, and its dependency array says it runs on first mount and when the refresh counter changes.

**Why is there a cleanup flag?**  
It prevents a finished request from calling state setters after its screen has been removed.

**Why use Context?**  
Today and History need the same workout data, and the tab navigator sits between the provider and those screens. Context shares it without passing props through unused components.

**Why are the records still there after closing the app?**  
The app stores the serialized list with AsyncStorage and reads it back when `WorkoutProvider` mounts.

**Does the exercise guide work offline?**  
No. It uses the wger API and needs a connection. Logging, editing, deleting, and viewing already-saved workouts use local state and AsyncStorage and do not depend on that request.

**Is there a backend or account system?**  
No. Workout data stays on the current device. The wger service only provides the exercise guide.

**Why use a `FlatList`?**  
It is designed for scrolling data collections and uses stable keys to track individual rows.
