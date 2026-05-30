@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — Expo dev server (dev-client build required; this is not Expo Go)
- `npm run android` / `npm run ios` / `npm run web`
- `npm run typecheck` — `tsc --noEmit` (strict mode on)
- `npm run lint` / `npm run lint:fix` — `expo lint` (flat config, eslint-config-expo + prettier)
- `npm run format` / `npm run format:check`
- `npm run doc` — `expo-doctor`
- `npm run build-dev` / `build-prev` / `build-prod` — EAS Android builds (development, preview, production)

There is no test runner configured yet.

## Required environment

`src/constants/config.ts` reads two `EXPO_PUBLIC_*` vars from `.env`:

- `EXPO_PUBLIC_SUPABASE_URL` (project root, no path — auth API appends `/auth/v1`)
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Missing values only `console.warn` — Supabase calls will silently fail. `.env` is gitignored.

## Architecture

### Boot sequence
`App.tsx` → `AppProviders` opens SQLite + initializes i18n in parallel, gated behind two `useState` readiness flags → `RootNavigator` calls `useAuthListener` and additionally waits on `authStore.isReady` + `onboardingStore.isHydrated` before rendering. All four gates must resolve before the first screen paints.

### Navigation (`src/navigation/RootNavigator.tsx`)
Single source of truth for the entire nav tree:

- Root `NativeStack` switches on `authStore.session`: `AuthNavigator` when signed out, `AppTabsNavigator` + modal screens (`ExerciseCreate`, `ExerciseDetail`) when signed in.
- Auth stack initial route depends on `onboardingStore.hasCompleted` (Welcome on first launch, SignIn after).
- 4 bottom tabs: Home / Library / Stats / Profile. Each tab has its own `NativeStack` except Library, which uses `createMaterialTopTabNavigator` for Routines / Exercises sub-tabs.
- Param lists in `src/navigation/types.ts`; the file augments `ReactNavigation.RootParamList` for global type-safety on `navigation.navigate`.

### Data layer — two stores, currently disconnected
1. **Supabase** (`src/lib/supabase.ts`) — typed against generated `Database` (`src/types/supabase.ts`, ESLint-ignored). Uses `expo-secure-store` for auth on native, `AsyncStorage` on web. In `__DEV__` the `from()` builder is Proxy-wrapped to log every `select/insert/update/delete/upsert` with a running counter.
2. **expo-sqlite** (`src/lib/db/`) — opens `repp.db` once, sets WAL + foreign keys, applies `SCHEMA_SQL` (full mirror of Supabase tables + a reserved `sync_queue` table). Domain hooks currently bypass SQLite entirely and hit Supabase directly — the local DB exists for future offline-first work but is not yet wired into reads or mutations.

### Server state — React Query
- Single `QueryClient` in `src/lib/queryClient.ts`: 60s `staleTime`, 24h `gcTime`, retry 1, no refetch-on-focus.
- All query keys go through `src/hooks/queryKeys.ts` — when invalidating, always reference this map, never inline tuples.
- Domain hooks live in `src/hooks/use*.ts` and follow a shared shape: they read `userId` from `authStore.profile?.id` and gate `enabled` on it. Mutations invalidate by the same `queryKeys.*` helpers.
- The user-row foreign key is the **local** `users.id` from the `public.users` table, NOT the Supabase `auth.users` UUID. `useAuthListener` does a second `from("users").eq("uuid", session.user.id)` lookup to populate `authStore.profile`. If that row doesn't exist (no `auth.users` → `public.users` trigger yet), `profile` is null and every user-scoped query is skipped.

### Client state — Zustand stores (`src/stores/`)
- `authStore` — `session`, `profile`, `isReady`. In-memory only; the Supabase SDK persists the session itself via SecureStore.
- `preferencesStore` — `weightUnit`, `language`; persisted with `zustand/middleware/persist` + AsyncStorage under key `repp.preferences.v1`. Uses `onRehydrateStorage` to flip `isHydrated`.
- `onboardingStore` — `hasCompleted` flag, manually hydrated via `AsyncStorage` (not the persist middleware). `AppProviders` calls `hydrate()` once.
- `activeWorkoutStore` — in-progress workout draft, in-memory only (intentionally not persisted).

### i18n (`src/i18n/`)
- `i18next` + `react-i18next` + `expo-localization`. EN and ES resources in `src/i18n/resources/`.
- `src/i18n/types.ts` augments the `i18next` module so `t()` keys are typed off the EN catalog — ES must structurally match EN or TypeScript breaks.
- Locale resolution: `preferencesStore.language` if set, else `detectDeviceLocale()` (falls back to `en`). `AppProviders` waits on the preferences-store hydration before calling `initI18n`.
- **All user-facing strings go through `t()`** — never hardcoded.

### Theme + UI primitives
- Theme tokens in `src/theme/` (palette → semantic colors/spacing/fontSize/fontWeight/radii). Dark-first. Screens consume tokens via the `theme` export; raw hex/rgb should not appear outside `theme/palette.ts`.
- All UI is built from primitives in `src/components/ui/` (`Screen`, `Stack`/`Row`, `Text`, `Button`, `TextField`, `PasswordField`, `Banner`, `Card`, `Divider`, `EmptyState`, `Icon`, `ListItem`, `ScreenHeader`, `SegmentedControl`, `SwitchRow`). Re-export through the barrel `src/components/ui/index.ts`.
- Per-screen `StyleSheet` only when something is inherently layout-specific — typography, color, and spacing come from primitives.

### Icons
- `@react-native-vector-icons/ionicons` with the `/static` import (`import Ionicons from "@react-native-vector-icons/ionicons/static"`). This is a **dev-client requirement** — do not switch to `@expo/vector-icons`.
- Use the `Icon` wrapper in `src/components/ui/Icon.tsx`. It accepts theme color tokens (`color="primary"`) as well as raw strings.

## Conventions

- Expo SDK 56: read https://docs.expo.dev/versions/v56.0.0/ before writing code that touches Expo APIs (see `AGENTS.md`).
- Prettier: tabs (width 4), no semicolons, double quotes, trailing commas, 100-col, `arrowParens: "avoid"`, LF endings.
- No emojis anywhere — UI, code, commits, comments. Use `Icon` for visual symbols.
- ESLint flat config: `src/types/supabase.ts` (generated) is ignored. `src/navigation/types.ts` allows empty interfaces for the module augmentation.
- Soft deletes via `deleted_at IS NULL` — all list queries must filter this.
- Always convert relative `weightUnit` and locale through the preferences store; never read device locale directly outside `i18n/`.

## Background context

`PROGRESS.md` tracks shipped features, known issues, and the upcoming roadmap. `dbschema.txt` is the source-of-truth DBML for the Supabase schema (gitignored locally) and should match `src/lib/db/schema.ts` and the generated `src/types/supabase.ts`.
