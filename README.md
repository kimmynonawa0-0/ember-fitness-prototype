# EMBER — Simple Workout Prototype

EMBER is a two-page React Native prototype for adding and deleting exercises. It follows the examples in `lessons-for-reference`. The purpose is to demonstrate how state updates the screen.

## Files to study

- `App.js` contains the single functional component, two page views, and simple add/delete functions.
- `styles.js` contains `StyleSheet.create()` and the Flexbox row for each exercise.
- `index.js` is Expo's generated entry file. It loads `App.js`.

The older, more detailed EMBER source is preserved in the sibling `daily-rep-legacy/` folder. It is not part of this running app. The five PNGs in `assets/brand/` are used for the Expo icon and splash screen.

## Lesson concepts

1. `useState` holds the input text, workout array, next ID, message, and selected page.
2. Each `TextInput` is controlled by `value` and `onChangeText`.
3. `TouchableOpacity` runs `addWorkout`, `deleteWorkout`, or changes pages through `onPress`.
4. Spread (`[...workouts, newWorkout]`) creates a new array when adding.
5. `.filter()` creates a new array when deleting.
6. `FlatList` displays the History array using `data`, `renderItem`, and `keyExtractor`.
7. `View`, `Text`, and Flexbox make the layout; the styles are in another file using `import`/`export`.

The main flow is: **type → Add Exercise → History → FlatList shows the row → Delete removes it**.

The Home and History icon tabs are fixed at the bottom and share the same list state. The house opens the exercise form; the clock opens History. Records exist only while the app is open. Reloading clears the list. There is no account, backend, database, or API.

## Run

From this `daily-rep` folder:

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go. Expo SDK 57 is used in this project.

## Short defense demonstration

1. Enter `Push Ups` and `10`, then tap **Add Exercise**.
2. Tap the clock icon and point out the new FlatList row and updated count.
3. Tap **Delete** and show that the row disappears; tap the house icon to return to Home.
4. Explain that the UI changes because the `setWorkouts` state setter makes React render again.
