# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Final MCO and defense direction

The current two-screen Daily Rep app is the midterm baseline. For requested work on the final product, use the lessons in `lessons-for-reference/lesson6`, `lesson7`, and `lesson8` as the course reference, along with the patterns in the current app. Read the relevant slides before implementing a feature; do not add every lesson concept just to demonstrate it.

- **Lesson 6 — lifecycle, effects, and data fetching:** Use `useEffect` for genuine side effects, choose a dependency array that matches when the effect should run, and use `async`/`await` for asynchronous work. If a screen fetches data, provide clear loading, error, and success UI and avoid updating state after the relevant screen/effect is no longer active.
- **Lesson 7 — navigation, shared state, and UI feedback:** Keep the existing Home/History flow unless a requested final requirement calls for a navigation change. When adding navigation, follow the lesson's React Navigation bottom-tab approach and the Expo SDK 57 setup docs. Keep shared state at the nearest common parent and pass it as props; use Context only when prop drilling makes the app harder to follow. Show useful feedback for user actions and asynchronous states.
- **Lesson 8 — local persistence:** If the final feature requires data to survive app restarts, use the Expo-compatible `@react-native-async-storage/async-storage` package. Store arrays/objects with `JSON.stringify`, restore them with `JSON.parse`, and keep create/read/update/delete behavior understandable and consistent with React state.

## Explainable implementation style

- Keep the app in JavaScript and follow the existing functional-component, `useState`, props, `StyleSheet`, and small-screen-component patterns unless a lesson requirement justifies changing them.
- Prefer a few clearly named functions and direct data flow over abstractions, extra packages, or clever compact code. Preserve immutable array updates and give each screen/component a clear responsibility.
- Make code understandable to the student presenting it: use meaningful names, focused comments for non-obvious decisions, and update the defense guide when an implementation change affects what should be explained.
- Treat AI-generated code as something the student must be able to explain and verify. Do not claim unimplemented behavior, backend services, or persistence; test the requested flow and explain any limitations honestly.
