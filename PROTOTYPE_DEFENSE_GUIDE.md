# Daily Rep Prototype Defense Guide

This guide explains the active Daily Rep prototype so each group member can describe how it works and answer questions about its code.

## 1. What the app does

Daily Rep lets a user record an exercise and its number of repetitions. The user can open History to view saved exercises and delete an exercise. A two-button bar at the bottom switches between Home and History.

The app is a front-end prototype. Its data exists only while the app is running. It has no database, account system, backend, or API, so the list resets when the app reloads.

## 2. Project files

- `index.js` is Expo's entry point. It registers `App` so Expo Go knows what component to launch.
- `App.js` contains the main React component, state, input validation, add/delete functions, screen content, and basic navigation.
- `styles.js` contains the React Native styles, including the Flexbox layout and shapes used to draw the Home and History icons.
- `package.json` lists the packages used by the project and the Expo start commands. `react-native-safe-area-context` supplies the safe-area components used by `App.js`.
- `package-lock.json` records the installed dependency versions. It helps npm install the same dependency tree.
- `app.json` contains Expo app configuration, including the app name and icon/splash references.

For the instructor's topic list, the main source files to explain are `App.js`, `styles.js`, and `index.js`.

## 3. How the app starts: `index.js`

```js
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

`registerRootComponent` tells Expo to render the imported `App` component. This file is an app bootstrap file; it does not contain the workout interface or workout logic.

## 4. Imports in `App.js`

```js
import React, { useState } from 'react';
```

- `React` is the library used to build the interface.
- `useState` is a React Hook for storing values that can change while the app runs. When a state setter is called, React renders the affected interface again.

```js
import {
  FlatList,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
```

- `View` groups and lays out interface elements.
- `Text` displays text.
- `TextInput` accepts typed text.
- `TouchableOpacity` creates a touchable control that runs an action when pressed.
- `FlatList` displays the workout array as a scrollable list.
- `StatusBar` controls the appearance of the phone's status bar.

```js
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
```

- `SafeAreaProvider` provides device safe-area information; `SafeAreaView` keeps screen content within the usable area around notches and system bars. They come from `react-native-safe-area-context` because React Native's built-in `SafeAreaView` is deprecated.
- `styles` imports the style object exported by `styles.js`.

## 5. The `App` component and state

`export default function App()` declares the main functional component and makes it available to `index.js`.

The component declares six state values:

| State | Initial value | Purpose |
| --- | --- | --- |
| `exercise` | `''` | Text currently typed into the Exercise field |
| `reps` | `''` | Text currently typed into the Reps field |
| `workouts` | `[]` | Array of saved exercise objects |
| `nextId` | `1` | Number used to create the next workout ID |
| `message` | `''` | Validation or success message shown on Home |
| `page` | `'Home'` | Which view is displayed: Home or History |

Each `useState` call returns a current value and a setter. For example, `[exercise, setExercise]` gives the current exercise text and the function used to update it.

## 6. Adding an exercise: `addWorkout()`

The Add Exercise button calls `addWorkout()` using its `onPress` property. The function follows this sequence:

1. `exercise.trim()` removes spaces at the beginning and end of the name.
2. `Number(reps)` converts the typed repetition text into a number.
3. The `if` condition rejects an empty name, a value that is not a whole number, or a number less than or equal to zero.
4. `newWorkout` is an object containing a unique string `id`, the cleaned `name`, and numeric `reps`.
5. `setWorkouts([...workouts, newWorkout])` creates a new array containing the existing workouts plus the new one. The spread syntax (`...`) copies the existing items.
6. `setNextId(nextId + 1)` prepares an ID for the next exercise.
7. `setExercise('')` and `setReps('')` clear the input fields.
8. `setMessage(...)` displays confirmation.

The list is updated by creating a new array rather than directly changing the existing array. This lets React detect the state update and render the latest list.

## 7. Deleting an exercise: `deleteWorkout(id)`

Each row has a Delete button. Its `onPress` calls `deleteWorkout(item.id)` with that row's ID.

```js
setWorkouts(workouts.filter(workout => workout.id !== id));
```

`.filter()` returns a new array containing only workouts whose IDs do not match the selected ID. Updating `workouts` makes the displayed list refresh.

## 8. Inputs and controlled components

Both `TextInput` controls are connected to state:

- `value={exercise}` displays the current Exercise state.
- `onChangeText={setExercise}` updates it whenever the user types.
- `value={reps}` and `onChangeText={setReps}` do the same for Reps.
- `keyboardType="number-pad"` requests a number keypad for the Reps field. The validation is still needed because the app must check that the value is a positive whole number.

An input connected this way is called a **controlled input**: the displayed text is kept in React state.

## 9. Home and History views

The header uses the `page` state to show a different title and subtitle for Home and History.

Inside `pageContent`, a conditional expression checks `page === 'Home'`:

- When true, it renders the exercise form and Add Exercise button.
- Otherwise, it renders the History heading and `FlatList`.

The Home and History navigation controls are `TouchableOpacity` components at the bottom. Their `onPress` handlers call `setPage('Home')` or `setPage('History')`. The selected icon changes color based on the same `page` state.

These controls provide **basic state-based navigation** between two views. They do not use a navigation stack or the React Navigation library. The workout array stays in the same `App` component while the view changes, so exercises remain available when switching between Home and History.

The icon controls also have `accessibilityLabel`, `accessibilityRole`, and `accessibilityState` properties. These provide assistive technologies with the button name, role, and selected state.

## 10. The History `FlatList`

`FlatList` is given the `workouts` array through `data`.

- `renderItem` describes how to draw one workout row. It receives an object containing `item`, the current workout.
- `keyExtractor={item => item.id}` supplies a stable key so React can track rows when the list changes.
- `ListEmptyComponent` shows “No exercises yet” when there are no items.
- The row displays `item.name` and `item.reps`, and its Delete button passes `item.id` to `deleteWorkout`.

`FlatList` is designed for lists and can render visible rows efficiently. It is preferable to manually creating an unlimited number of row components for a longer list.

## 11. Styling and Flexbox: `styles.js`

`StyleSheet.create({...})` groups named React Native style objects into one exported object. `App.js` refers to these names with expressions such as `style={styles.screen}`.

Important examples:

- `screen: { flex: 1 }` makes the main screen fill available space.
- `pageContent: { flex: 1 }` lets the content area take the remaining vertical space so the bottom navigation stays below it.
- `history: { flex: 1 }` gives the History list space to scroll.
- `workoutRow: { flexDirection: 'row', alignItems: 'center' }` places workout details and Delete next to each other and aligns them vertically.
- `tabBar: { flexDirection: 'row' }` places Home and History controls side by side.
- `flex: 1` on each `tab` gives the two controls equal width.
- `padding`, `margin`, `borderRadius`, `fontSize`, `color`, and `backgroundColor` control spacing and appearance.

The Home icon is drawn from triangle and rectangle-shaped `View` elements. The History icon is drawn from a bordered circular `View` and two narrow `View` elements for clock hands. This avoids another icon dependency.

## 12. Main user flow

1. The app starts on Home because `page` starts as `'Home'`.
2. The user types an exercise and a rep count.
3. The user taps Add Exercise.
4. `addWorkout()` validates the input and appends a workout object to state.
5. The user taps the History icon.
6. The conditional view displays the `workouts` array using `FlatList`.
7. The user can tap Delete; `deleteWorkout()` removes that row from state.
8. The user can tap the Home icon to return to the form.

## 13. How it matches the instructor's pictured topics

- **Components:** `App` is a functional component composed from React Native components such as `View`, `Text`, `TextInput`, and `FlatList`.
- **Flexbox:** the screen and rows use `flex`, `flexDirection`, and alignment properties.
- **Buttons:** `TouchableOpacity` controls add, delete, Home, and History actions.
- **TextInput:** both inputs are controlled through `value` and `onChangeText`.
- **Basic navigation:** the Home and History buttons change the `page` state to switch views.

The photo lists “basic navigation”; it does not specify a navigation library. If asked, explain honestly that this prototype uses simple state-based view switching and does not use React Navigation.

## 14. Common defense questions

**Why use `useState`?**  
To store values that change while the app runs. When a setter updates a value, React renders the interface with the new value.

**Why store workouts as objects in an array?**  
Each workout has related values (`id`, `name`, and `reps`), and an array makes it easy to display, add, and remove workouts.

**Why use spread when adding?**  
It copies the existing array and adds a new item without directly mutating the old array.

**Why use `.filter()` when deleting?**  
It returns a new array with the selected workout removed.

**Why use `FlatList`?**  
It is a React Native component made for rendering lists efficiently and uses keys to keep track of individual rows.

**Why use `keyExtractor`?**  
React needs a stable key for each row to recognize which item changed or was removed. This app uses each workout's ID.

**Why does the list clear after restarting?**  
The workouts are only in React state. There is no persistent storage or database in this prototype.

**Is the navigation React Navigation?**  
No. It is basic navigation using a `page` state and conditional rendering. This keeps the example simple and matches the basic-navigation wording in the photo.

**Why are the styles in another file?**  
Keeping styles in `styles.js` separates layout and appearance from the screen logic and makes them easier to find.

## 15. Short defense presentation

> “Daily Rep is a small workout logging prototype. The user enters an exercise and repetitions in controlled `TextInput` components. The Add button calls `addWorkout`, which validates the values and adds a workout object to the `workouts` state array using spread syntax. The History view displays that array with `FlatList`, and Delete removes an item using `filter`. The bottom Home and History buttons change the `page` state to switch views. The layout is styled separately in `styles.js` using Flexbox. The data is temporary and resets when the app reloads.”

