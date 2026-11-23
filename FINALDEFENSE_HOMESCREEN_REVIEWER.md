# Final Defense Reviewer — Home Screen

This reviewer focuses on **one screen: `HomeScreen.js`**, also labeled **Today** in the app. It explains what the screen does, what each import is for, how its data moves, and what to say when asked about the logic.

> **Main idea:** Home owns the exercise form and its feedback. The workout list belongs to `WorkoutContext`, which Home reads and updates. Home calculates today's totals from that shared list. `WorkoutContext.js` handles saving the list on the device.

## Lesson alignment

| Lesson idea | Where Home demonstrates it |
| --- | --- |
| Lesson 6 — `useEffect` and dependency arrays | The route-parameter effect and the `blur`-listener effect (which returns a cleanup). |
| Lesson 7 — shared state and UI feedback | Home reads `workouts` from Context, keeps only form state locally, and shows one-time success/error feedback. |
| Lesson 8 — persistence boundary | Home does not touch AsyncStorage; `WorkoutContext.js` saves the list. |

## 1. What to know outside `HomeScreen.js`

Home is not a standalone file. For a complete explanation, know these related files:

| File | How it relates to Home |
| --- | --- |
| `App.js` | Wraps the app in `WorkoutProvider`, sets up bottom-tab navigation, and registers Home as the `Home` route (displayed as **Today**). It also shows storage loading/errors before the screens are available. |
| `WorkoutContext.js` | Owns the shared `workouts` array and provides `addWorkout`. It reads and writes workout data with AsyncStorage. |
| `workoutUtils.js` | Provides `isValidExerciseName`, `isToday`, and `getTotalReps`, which Home calls. |
| `AppHeader.js` | Displays the shared EMBER heading, title, and subtitle. Home supplies the title and subtitle as props. |
| `styles.js` | Defines shared visual styles. Home selects styles; it does not define the colors/layout rules itself. |
| `ExerciseLibraryScreen.js` | Can navigate to Home with an `exerciseName` route parameter, which Home uses to prefill its name field. The exercise API request itself is in that screen, not Home. |

## 2. Imports in `HomeScreen.js`

```js
import React, { useEffect, useState } from 'react';
```

- `React` is imported as the default React module; this file uses the named hooks directly and does not call `React.*` elsewhere.
- `useState` stores values that change while Home is being used.
- `useEffect` runs side effects after render. Home has two effects: one reads an exercise name passed through navigation, and one registers a `blur` listener that clears the feedback message when the user leaves the tab.

```js
import {
  ScrollView, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
```

These are React Native UI components: a scrollable page, text, text fields, tappable controls, and layout containers.

```js
import { SafeAreaView } from 'react-native-safe-area-context';
```

Keeps the screen content clear of device safe-area insets. Home sets `edges={['top']}` because the tab bar handles the bottom of the screen.

```js
import AppHeader from './AppHeader';
import { useWorkoutContext } from './WorkoutContext';
import { getTotalReps, isToday, isValidExerciseName } from './workoutUtils';
import styles from './styles';
```

These imports reuse the app header, shared workout data, small helper functions, and shared styles. Keeping these responsibilities in separate files makes Home easier to read.

## 3. Component inputs and state

```js
export default function HomeScreen({ navigation, route }) {
```

React Navigation supplies `navigation` and `route` to a registered screen:

- `navigation` provides actions such as `navigate()` and `setParams()`.
- `route` contains the current screen's route parameters, if any.

Home reads the shared data/actions from Context:

```js
const { workouts, addWorkout } = useWorkoutContext();
```

It keeps only the temporary form and message values in local state:

| State | Initial value | Purpose |
| --- | --- | --- |
| `exercise` | `''` | Current exercise-name input. |
| `reps` | `''` | Current repetitions input; kept as text while typing. |
| `message` | `''` | Success or validation feedback shown below the button. |
| `messageType` | `'success'` | Chooses success or error styling/accessibility role. |

The form fields are **controlled inputs**: each `TextInput` gets its displayed value from state, and `onChangeText` updates that state. This gives the component a current value to validate and clear. The change handlers (`handleExerciseChange` and `handleRepsChange`) also clear the feedback message, because the previous feedback no longer applies once the user starts a new entry.

The workout array is not copied into local Home state. Context is the shared source of truth used by Home and History; local state is for this screen's temporary form interaction.

## 4. The Explore-to-Home effect (route parameter)

```js
useEffect(() => {
  const selectedExercise = route.params?.exerciseName;

  if (selectedExercise) {
    setExercise(selectedExercise);
    setMessage('Exercise selected. Enter your reps to save it.');
    setMessageType('success');
    navigation.setParams({ exerciseName: undefined });
  }
}, [navigation, route.params?.exerciseName]);
```

1. Explore can call `navigation.navigate('Home', { exerciseName: item.name })`.
2. Home's effect checks the route parameter and prefills the exercise field.
3. It tells the user what to do next.
4. It clears the parameter so the same selection is not kept in the route and applied again later.
5. The dependency array means the effect runs when the screen is first set up and when the navigation object or `exerciseName` parameter changes. It does **not** run after every ordinary render.

`?.` is optional chaining: if `route.params` is missing, reading `exerciseName` safely results in `undefined` instead of throwing an error. This particular effect is synchronous and does not fetch data or subscribe to anything, so it does not need an async function or a cleanup function. The feedback-clearing effect in section 5 is different: it subscribes to a navigation event, so it returns an `unsubscribe` cleanup.

## 5. The feedback message lifecycle

```js
// Clear the feedback message when the user leaves this tab so it does
// not linger when they come back.
useEffect(() => {
  const unsubscribe = navigation.addListener('blur', () => {
    setMessage('');
    setMessageType('success');
  });

  return unsubscribe;
}, [navigation]);
```

1. Bottom-tab screens stay mounted when the user switches tabs, so Home's message would still be visible when they return.
2. This effect subscribes to the navigation `blur` event, which fires when Home loses focus (the user moves to History or Explore).
3. When the event fires, the message is cleared. The effect returns `unsubscribe` as its cleanup so React removes the listener if Home is ever removed.
4. Starting a new entry also clears the message: `handleExerciseChange` and `handleRepsChange` update their field's state and set `message` to `''`, because feedback about the previous action no longer applies.

The result is one-time feedback: it appears right after an action, then disappears when the user does something new or leaves the screen.

## 6. How the daily totals are calculated

```js
const todaysWorkouts = workouts.filter(workout => isToday(workout.createdAt));
const todaysReps = getTotalReps(todaysWorkouts);
```

- `filter()` creates a new array containing records whose `createdAt` date is today.
- `isToday()` in `workoutUtils.js` parses the date and compares its local calendar date with today's local calendar date. An invalid date does not count as today.
- `getTotalReps()` adds the `reps` values in the filtered array, starting from zero with `reduce()`.
- The UI displays `todaysWorkouts.length` and `todaysReps`.

These totals are **derived values**, not separate state. When the shared workout list changes, Context causes consumers to render again and Home recalculates the totals. This avoids keeping a second copy of the totals that could get out of sync. The calculation is small, so Home does not need `useMemo` here.

## 7. Save-button logic, step by step

The Save Exercise button calls `addTodaysWorkout()`:

### A. Normalize and convert

```js
const cleanedName = exercise.trim();
const repCount = Number(reps);
```

- `trim()` removes spaces at the beginning/end of the name.
- Repetitions are stored as text in a `TextInput`, so `Number()` converts the text to a number before checking it.

### B. Validate both values

```js
if (
  !isValidExerciseName(cleanedName) ||
  !Number.isSafeInteger(repCount) ||
  repCount <= 0
) {
  setMessage('Enter an exercise name and a positive whole number of reps.');
  setMessageType('error');
  return;
}
```

The name helper in `workoutUtils.js` requires a trimmed name of 1–60 characters. It must start with a letter or digit; later characters may be letters, digits, spaces, apostrophes, `&`, `/`, or `-`.

The repetition checks require a **positive safe integer**:

- `Number.isSafeInteger()` rejects values such as `NaN`, decimals, and integers too large for JavaScript's safe-integer range.
- `repCount <= 0` rejects zero and negative values.
- If either field is invalid, Home shows an error and returns early. It does not add a workout or clear the entered values.

The number-pad keyboard is only a typing aid; the JavaScript validation is what enforces the accepted value. `maxLength={60}` on the name input also limits normal typing, while the helper checks the name rule in the save logic.

### C. Create and add a record

```js
addWorkout({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: cleanedName,
  reps: repCount,
  createdAt: new Date().toISOString(),
});
```

The record has four fields:

| Field | Meaning |
| --- | --- |
| `id` | Identifier used to distinguish this workout record. The timestamp plus random suffix makes accidental collisions less likely; it is not a formal guarantee of uniqueness. |
| `name` | Validated, trimmed exercise name. |
| `reps` | Validated number of repetitions. |
| `createdAt` | Current date and time in ISO format (UTC). The app parses it later to decide whether it falls on today's local date. |

Home calls `addWorkout`; it does not update the array directly. In `WorkoutContext.js`, `addWorkout` uses a functional state update:

```js
setWorkouts(currentWorkouts => [...currentWorkouts, workout]);
```

This creates a new array rather than mutating the old one. The functional updater uses the latest state, which is safer if updates happen close together.

### D. Clear the form and show success

After calling `addWorkout`, Home clears both inputs, sets a success message using the cleaned exercise name, and sets `messageType` to `'success'`. The Context state update causes Home to render again with the new list and updated totals.

The screen does not wait for AsyncStorage here. The Context's persistence effect saves the changed list asynchronously. A storage failure is reported by the app through the save-warning UI in `App.js`; it is separate from Home's immediate “added” message.

## 8. What the user sees and why

Home's JSX renders these areas in order:

1. **Safe area and header:** `SafeAreaView` contains `AppHeader`, which receives the title “Today's training” and a subtitle.
2. **Scrollable page:** `ScrollView` holds the rest of the page. `keyboardShouldPersistTaps="handled"` helps taps on handled controls, such as Save, work while the keyboard is open.
3. **Two summary cards:** number of exercises logged today and total reps today.
4. **Exercise form:** controlled name/reps inputs and the Save Exercise button.
5. **Conditional feedback:** the message is only rendered if it is not an empty string. The style and accessibility role depend on `messageType`.
6. **History link:** pressing it calls `navigation.navigate('History')`.

`TextInput`'s `keyboardType="number-pad"` requests a number-oriented keyboard for reps. `accessibilityLabel` gives the fields and buttons meaningful names for assistive technology. `TouchableOpacity` provides tappable controls, and `accessibilityRole="button"` identifies button controls.

`styles.js` controls appearance/layout; for example, the stats row uses a horizontal Flexbox row. The screen code decides which styles to apply, while the style file defines their values.

## 9. Full data-flow picture

```text
App.js
  └─ WorkoutProvider (WorkoutContext.js)
       ├─ reads saved workout list when app starts
       ├─ provides workouts and addWorkout to Home
       └─ saves list changes with AsyncStorage

HomeScreen.js
  ├─ local state: exercise, reps, message, messageType
  ├─ derives today's records and rep total from workouts
  ├─ validates form and calls addWorkout(record)
  └─ displays the updated list-derived totals
```

The save-to-storage sequence is in `WorkoutContext.js`, not Home: the provider reads the saved list on startup, and after it is ready, its effect serializes changed workout arrays with `JSON.stringify` and writes them to AsyncStorage. It restores data using `JSON.parse`. This is local device storage, not an API, account, backend, or cloud sync.

Home itself does **not** call `fetch()` and does not require the exercise-library API. A user can enter an exercise manually. Explore needs internet to get exercise suggestions; if a suggestion is chosen, only its name is passed to Home as a navigation parameter.

## 10. Likely instructor questions and answers

### “What is the main responsibility of HomeScreen?”

It handles today's workout form and feedback, calculates today's summaries from shared workout data, and offers navigation to History. Shared workout state and persistence are handled elsewhere.

### “Why does the component receive `navigation` and `route`?”

React Navigation supplies them to registered screens. Home uses `navigation` to open History or clear a route parameter, and `route` to read an exercise name passed from Explore.

### “Why are the name and reps stored with `useState`?”

They change as the user types, and React needs to re-render the controlled inputs with the latest values. They are temporary screen/form data, so they belong locally in Home.

### “Why is `workouts` in Context rather than Home state?”

More than one screen needs the same workout list. The provider is a common owner and Context makes the same source of truth available without passing it through unrelated components.

### “What does controlled input mean?”

The input's `value` comes from React state, and `onChangeText` updates that state. React state and what is shown in the field stay in sync.

### “What happens when Save is pressed?”

The handler trims the name, converts reps text to a number, validates both values, returns with an error if invalid, or creates a record and passes it to `addWorkout` if valid. It then clears the form and shows success.

### “Why use `Number.isSafeInteger` and then compare with zero?”

The first check requires an integer representable safely by JavaScript. The second makes it positive; zero and negatives are not valid rep counts.

### “Does `keyboardType="number-pad"` validate the input?”

No. It only requests a more convenient keyboard. The handler still converts and validates the actual text.

### “What does `return` do in the validation block?”

It exits `addTodaysWorkout()` immediately, preventing invalid input from reaching record creation or `addWorkout`.

### “Why trim the exercise name?”

It removes accidental leading/trailing spaces before validation and saving, so a name made only of spaces is rejected and saved names are cleaner.

### “What is `isValidExerciseName` checking?”

It checks the trimmed name is 1–60 characters and follows the app's allowed character pattern. It is an app input rule, not a general security system.

### “Where does `addWorkout` actually add the record?”

Home passes the record to the function from Context. `WorkoutContext.js` appends it immutably with `[...currentWorkouts, workout]`.

### “Why use a functional state update?”

It calculates the new array from the latest `currentWorkouts` value rather than relying on a possibly old value captured by a render.

### “Why aren't today's totals stored in state?”

They can be calculated from `workouts`. Deriving them avoids maintaining duplicate state that could become inconsistent after adding, editing, or deleting a record.

### “How does Home know which records were made today?”

It filters `workouts` with `isToday(workout.createdAt)`. The helper parses each timestamp and compares local calendar dates.

### “Why does Home update after adding a workout?”

`addWorkout` updates Context state. React re-renders Context consumers, so Home recalculates its derived daily records and total reps.

### “Is the ‘added’ message proof the device write succeeded?”

Not by itself. Home reports that the record was added to app state. The provider saves asynchronously; a save failure is shown separately by `App.js`.

### “How does data survive closing/restarting the app?”

`WorkoutContext.js` serializes the workout array and stores it with AsyncStorage. On startup it reads and parses the saved value before the app shows the tabs.

### “Does Home need internet?”

No. Home's form and workout data use local app state and locally persisted data. Explore's exercise-guide request needs internet, but using Explore is optional.

### “What do the `useEffect`s do?”

The first reacts to an exercise name passed in the route. It fills the form, displays guidance, then clears that route parameter. It does not perform a network request. The second subscribes to the navigation `blur` event and clears the feedback message when the user leaves the tab, so old feedback does not linger when they return.

### “What does the effect dependency array mean?”

The route effect is tied to the navigation object and the selected exercise route parameter. It runs initially and when those dependencies change, instead of after every render. The blur effect depends only on `navigation`, so its listener is registered once.

### “Why use optional chaining in `route.params?.exerciseName`?”

Some visits to Home have no route parameters. Optional chaining safely handles that case.

### “Why clear `exerciseName` with `navigation.setParams`?”

To consume the one-time selection, so the route does not keep a stale selection to be reapplied later.

### “Why does the route effect have no cleanup function?”

That effect does not start an asynchronous operation or subscribe to anything; it only reads a parameter, sets state, and clears a parameter. The blur effect is different: it subscribes to a navigation event, so it returns `unsubscribe` as its cleanup.

### “Why does the success message disappear when I switch tabs or start typing?”

Tabs keep screens mounted, so the message would otherwise stay visible when the user returns. The `blur` listener clears it when Home loses focus, and the input handlers clear it when the user starts typing a new entry. Feedback is meant to be one-time.

### “Why use `ScrollView`?”

The Home page contains a small form and summary section that may need to scroll on smaller screens or with the keyboard open. A large virtualized collection is not being rendered here.

### “Where does the API call happen?”

In `ExerciseLibraryScreen.js`, not Home. Explore fetches exercise information from wger; Home only accepts an optional exercise-name route parameter.

### “Is there a backend or user account?”

No. Workout records are stored locally on the device. The external wger API is only used for the exercise guide.

## 11. A short oral walkthrough

Use this order when explaining the screen:

1. “Home receives navigation props, gets the shared workout list and add function from Context, and keeps the form fields and feedback in local state.”
2. Point out the controlled `TextInput`s: their values come from state and typing updates state.
3. “The summary is derived: filter records to today, then total their reps.”
4. Trace Save: trim/convert → validate → show an error and stop, or create a record → call Context → clear the form and show success.
5. Show the feedback lifecycle: switch to History and back — the success message is gone because the `blur` listener cleared it.
6. “Context immutably updates the shared list and saves it to AsyncStorage. Home doesn't talk to storage directly.”
7. Explain the route effect: Explore may send an exercise name; Home prefills it and clears the parameter.
8. Finish by noting Home works without internet; only the optional Explore guide uses the API.

## 12. Demo checklist

- Start on Today and identify the two summary values.
- Try saving with a blank name or invalid reps; explain the validation and early return.
- Save a valid exercise and point out the success feedback and updated totals.
- Switch to History and back to Today (or type a new entry) and point out that the success message is gone — the `blur` listener and input handlers clear one-time feedback.
- Open History and show the shared record is visible.
- If internet is available, optionally select an exercise in Explore and show Home's name-prefill behavior. Do not make this optional API flow the core of the Home explanation.
- Restarting the app can demonstrate local persistence, but explain that AsyncStorage work is implemented in `WorkoutContext.js`.

## 13. Details to avoid overstating

- Home does not directly save to AsyncStorage; the provider does.
- The success message is immediate app feedback, not a guarantee that a later storage write succeeded.
- The success message is one-time feedback: it clears when the user leaves the tab or types a new entry, so it is not a persistent status indicator.
- The exercise API is not needed to add a workout manually.
- AsyncStorage is device-local persistence, not a remote backup or cloud database.
- The generated ID is designed to be practically distinct for this app, but the timestamp/random combination is not a mathematical uniqueness guarantee.
