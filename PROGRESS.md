# Repp — Progress

Workout tracking app on Expo SDK 56. This file tracks what's been built, what's broken, and what's next.

Last updated: 2026-05-26

---

## Features shipped

### Foundation

- **Expo SDK 56** scaffold with `expo-dev-client` (React 19.2, RN 0.85)
- **React Navigation 7** — auth-aware root stack switching between an `AuthNavigator` (Welcome → Onboarding → SignUp/SignIn) and an `AppTabs` bottom-tab shell (Home / Workouts / Routines / Exercises / Profile)
- **Tooling** — ESLint 9 flat config (`eslint-config-expo` + Prettier integration), Prettier (tabs, no semicolons, 100-col), `lint` / `lint:fix` / `format` / `format:check` / `typecheck` scripts, VS Code workspace settings for format-on-save

### Data layer

- **Supabase client** (`src/lib/supabase.ts`) — typed against generated `Database` schema, SecureStore-backed auth on native, AsyncStorage on web, URL polyfill imported
- **SQLite client** (`src/lib/db/`) — async `expo-sqlite` instance, WAL + foreign-keys, full schema mirror of all Supabase tables, `sync_queue` table reserved for future offline-first
- **React Query** client with 60s `staleTime`, 24h `gcTime`, single retry, no refetch-on-focus
- **Query hooks** per domain entity with centralized `queryKeys` map:
  - `useExercises`, `useProgressions`, `useRoutines` (+ `useRoutineDays`), `useMesocycles` (+ `useActiveMesocycle`), `useWorkouts` (+ `useRecentWorkouts`, `useWorkoutDetail`, `useCreateWorkout`), `useMilestones`, `useBodyweightLogs`, `useAuth` (listener + sign-in/up/out helpers)

### State stores (Zustand)

- `authStore` — `session`, `profile`, `isReady`
- `activeWorkoutStore` — in-progress workout draft (`startWorkout`, `addExercise`, `addSet`, `updateSet`, `removeSet`, etc.)
- `preferencesStore` — `weightUnit`, `theme`, `language`; persisted via `zustand/middleware` + AsyncStorage; `isHydrated` flag
- `onboardingStore` — `hasCompleted` flag persisted via AsyncStorage; controls first-launch flow

### Auth flow

- **WelcomeScreen** — landing screen with logo + "Get started" / "I already have an account"
- **OnboardingScreen** — 3-slide horizontal flow (track / plan / progress) with paged dots and Ionicons in primary-orange surface tiles; shows only on first launch
- **SignInScreen** — working email/password sign-in via Supabase, inline validation, error banner
- **SignUpScreen** — email + password + confirm (8-char min), success banner when Supabase email confirmation is required, error banner otherwise

### Design system (`src/theme/` + `src/components/ui/`)

- **Theme tokens** — palette + semantic `colors`, `spacing`, `fontSize`, `fontWeight`, `radii`. Dark-first.
- **Primitives** — `Screen`, `Stack`/`Row`, `Text` (9 variants), `Button` (4 variants × 3 sizes), `TextField`, `Banner`, `Card`, `Divider`, `ScreenHeader`, `Icon`
- Every screen built from these primitives — no per-screen `StyleSheet` for typography/layout

### Internationalization

- **i18next** + **react-i18next** + **expo-localization**
- EN and ES catalogs (`src/i18n/resources/`), strictly typed so ES must structurally match EN
- TS module augmentation gives autocomplete on `t()` keys
- First-launch locale = persisted preference, falling back to device locale
- All user-facing strings routed through `t()` (Welcome, Onboarding, SignIn, SignUp, tab labels)

### Icons

- `@react-native-vector-icons/ionicons` with `/static` import (dev-client builds)
- `Icon` wrapper accepts theme color tokens; consumers reference `IconName` type for autocomplete
- Used in bottom tabs (paired filled/outline per route) and onboarding slides

---

## Known issues / fixes

- [ ] **Postgres trigger missing** — `signUp` populates `auth.users` but not `public.users`. Until a trigger (or RPC) creates the `public.users` row from `auth.users`, `profile` stays `null` after sign-in and every user-scoped query is gated off. Add a Supabase migration with an `AFTER INSERT` trigger on `auth.users`.
- [ ] **Schema mismatch on `workout_exercises.routineday_exercise_id`** — generated Supabase types mark it non-nullable but `dbschema.txt` has it nullable (needed for unplanned exercises with `is_unplanned=true`). Reconcile: either alter the column in Supabase and regenerate types, or update the DBML.
- [ ] **`.env` is required but not validated at runtime** — `src/constants/config.ts` only logs a `console.warn`. Missing keys silently break Supabase calls. Add a startup assertion or surface a visible error screen when keys are blank.
- [ ] **Hooks bypass SQLite** — every read goes straight to Supabase; offline = broken. Wire SQLite as a read-through cache (or use TanStack Query persister) and start populating `sync_queue` on mutations.
- [ ] **`useExercise` / `useRoutine` / similar** use `id ?? -1` as a sentinel when null — currently fine because `enabled: id != null` skips the query, but the query key still gets `-1`. Switch to a separate "noId" key to avoid stale cache collisions.
- [ ] **`activeWorkoutStore` is in-memory only** — kill the app mid-workout and the draft is gone. Persist it (separately from `preferencesStore` since it's transient).
- [ ] **Sign-out has no UI** — `signOut()` helper exists in `useAuth` but nothing calls it. Add a button in the Profile screen.
- [ ] **No error boundary** — an unhandled render error crashes to a blank screen. Add a root `ErrorBoundary` with a retry.
- [ ] **No splash/loading polish** — `AppProviders` shows a bare `ActivityIndicator` during DB + i18n init. Match the design system.

---

## Upcoming features

### Auth

- [ ] Forgot password flow (Supabase `resetPasswordForEmail` + deep link)
- [ ] OAuth providers (Apple, Google)
- [ ] Email re-confirmation resend

### Domain UIs (every tab is currently a placeholder)

- [ ] **Exercises** — list + filters (type, movement pattern), create/edit/delete (soft-delete via `deleted_at`), manage progressions per exercise
- [ ] **Routines builder** — create routine → add `RoutineDays` → schedule via `RoutineSchedules` (weekday × week_number) → add `RoutineDayExercises` with set/rep goals
- [ ] **Mesocycle planner** — pick a routine, start date, duration, deload week; tie under an optional `Macrocycle`; active/completed/abandoned states
- [ ] **Active workout flow** — pick today's `RoutineDay` from the active mesocycle → live log sets (reps, weight, progression) → save to `workouts` + `workout_exercises` + `workout_sets`, leveraging `activeWorkoutStore` draft
- [ ] **Workout history** — recent list + detail view (already have `useWorkoutDetail` returning nested exercises + sets)
- [ ] **Milestones** — manual entry + automatic detection (e.g., first time hitting a progression's rep target)
- [ ] **Bodyweight log** — quick-add screen, chart over time
- [ ] **Home / dashboard** — today's planned workout, current week of mesocycle, recent activity, latest bodyweight, upcoming milestones

### Preferences

- [ ] Theme toggle (light/dark/system) — token exists in `preferencesStore`, isn't wired to any theme switching yet
- [ ] Weight unit toggle (kg/lb) — token exists, not consumed in input/display
- [ ] Language switcher UI (en/es) — store + `changeLanguage` helper exist, no screen

### Charts / analytics

- [ ] Progress chart per exercise (volume / 1RM estimate / top set over time)
- [ ] Bodyweight trend
- [ ] Mesocycle adherence (planned vs. completed workouts)

### Infra / quality

- [ ] Supabase migration + trigger for `public.users` (see Known issues)
- [ ] Reconcile `workout_exercises` nullability (see Known issues)
- [ ] Offline-first wiring against SQLite + `sync_queue`
- [ ] Unit tests for stores and validation helpers
- [ ] Smoke E2E (Maestro) for auth + create-workout flow
- [ ] CI: GitHub Actions running `typecheck`, `lint`, `format:check` on PR

---

## Tech stack

- **Runtime:** Expo SDK 56, React Native 0.85, React 19.2, TypeScript 6
- **Navigation:** `@react-navigation/native` + `native-stack` + `bottom-tabs`
- **State:** Zustand (with `persist` middleware)
- **Server state:** TanStack Query 5
- **Backend:** Supabase (Postgres + auth)
- **Local DB:** `expo-sqlite`
- **Storage:** `expo-secure-store` (auth), AsyncStorage (preferences, onboarding)
- **i18n:** i18next + react-i18next + expo-localization
- **Icons:** `@react-native-vector-icons/ionicons` (`/static`)
- **Tooling:** ESLint 9 (flat) + Prettier 3

## Repository conventions

- Tabs (width 4), no semicolons, double quotes, trailing commas, 100-col print width
- All UI strings via `t()` — never hardcoded
- No emojis anywhere — UI, code, commits, comments
- Theme tokens only — no raw hex/rgb in screens (the primitives encode them)
- Screens compose from `src/components/ui` primitives; per-screen `StyleSheet` only when something inherently layout-specific is needed
