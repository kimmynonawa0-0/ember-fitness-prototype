# EMBER — Daily Rep

Daily Rep is a small workout tracker built with React Native and Expo. A user can log exercises and repetitions, review and edit workout history, and browse an online exercise guide. Workout records are saved on the device, so they remain after the app is closed.

## Features

- **Today:** log an exercise and reps, and see today's exercise and rep totals.
- **History:** review all records or today's records, edit an entry, or delete it after confirmation.
- **Explore:** search an exercise guide loaded from the [wger REST API](https://wger.de). Choose an exercise to prefill the Today form. This screen needs an internet connection and has loading, error, and retry feedback.
- **Local persistence:** workout records are stored with AsyncStorage. The guide data is fetched online and is not the source of workout history.

There is no sign-in, backend, or cloud synchronization. Workout history stays on the device where it was created.

## Main files

- `App.js` sets up the React Navigation bottom tabs and the app's startup states.
- `WorkoutContext.js` shares the workout list, loads/saves it with AsyncStorage, and exposes add, update, and delete functions.
- `HomeScreen.js` validates and records today's exercises.
- `HistoryScreen.js` displays, edits, filters, and deletes workout records with `FlatList`.
- `ExerciseLibraryScreen.js` fetches and searches the wger exercise guide using `useEffect` and `async`/`await`.
- `AppHeader.js` keeps the screen header consistent; `styles.js` contains the shared Flexbox styles.
- `workoutUtils.js` contains the small date, validation, and total-rep helpers.
- `PROTOTYPE_DEFENSE_GUIDE.md` explains the app flow and gives a defense walkthrough.
- `lessons-for-reference/lesson6`, `lesson7`, and `lesson8` contain the course references used for the final update.

## Lesson concepts in this project

- **Lesson 6:** the Explore screen fetches API data in `useEffect`; the effect has a dependency array and cleanup guard. `async`/`await` handles the request. Loading, error, empty, and retry states keep the screen informative.
- **Lesson 7:** `createBottomTabNavigator` provides Today, History, and Explore. Shared workout state lives in the nearest common owner, `WorkoutProvider`, and `useContext` lets the screens access it without passing props through every tab. User actions and errors provide visible feedback.
- **Lesson 8:** AsyncStorage reads the saved JSON on startup and writes updates. `JSON.parse` restores the array and `JSON.stringify` saves it. Add, read, edit, and delete cover the workout record CRUD flow.

## Run the app

From this `daily-rep` directory:

```bash
npm install
npx expo start
```

Use Expo Go to scan the QR code. The project uses Expo SDK 57; `AGENTS.md` links to the versioned Expo documentation used for SDK-specific changes.

## Defense demonstration

1. Open **Explore**, search for an exercise, and tap **Log this exercise**. Point out the loading/error states and the navigation parameter that prefills Today.
2. Enter a repetition count on **Today** and save. Explain the controlled inputs, validation, Context action, and immutable array update.
3. Open **History**, edit the saved record, then delete it. Point out `FlatList`, the edit modal, and the delete confirmation.
4. Reload the app and show that the record remains. Explain the AsyncStorage read/write and JSON conversion.

Exercise names and descriptions come from wger; individual records display their source/creator and license where provided. If the API is unavailable, local workout tracking still works.
