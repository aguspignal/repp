import { Constants } from "./supabase"
import type { Database, Enums, Tables, TablesInsert, TablesUpdate } from "./supabase"

export type DB = Database["public"]

export type TableName = keyof DB["Tables"]

export type User = Tables<"users">
export type Exercise = Tables<"exercises">
export type Progression = Tables<"progressions">
export type Routine = Tables<"routines">
export type RoutineDay = Tables<"routine_days">
export type RoutineSchedule = Tables<"routine_schedules">
export type RoutineDayExercise = Tables<"routineday_exercises">
export type Macrocycle = Tables<"macrocycles">
export type Mesocycle = Tables<"mesocycles">
export type Workout = Tables<"workouts">
export type WorkoutExercise = Tables<"workout_exercises">
export type WorkoutSet = Tables<"workout_sets">
export type Milestone = Tables<"milestones">
export type BodyweightLog = Tables<"bodyweight_logs">

export type ExerciseInsert = TablesInsert<"exercises">
export type ExerciseUpdate = TablesUpdate<"exercises">
export type RoutineInsert = TablesInsert<"routines">
export type RoutineUpdate = TablesUpdate<"routines">
export type WorkoutInsert = TablesInsert<"workouts">
export type WorkoutUpdate = TablesUpdate<"workouts">
export type WorkoutSetInsert = TablesInsert<"workout_sets">
export type MesocycleInsert = TablesInsert<"mesocycles">
export type MilestoneInsert = TablesInsert<"milestones">
export type BodyweightLogInsert = TablesInsert<"bodyweight_logs">

export type CycleStatus = Enums<"cycle_status">
export type ExerciseType = Enums<"exercise_type">
export type MovementPattern = Enums<"movement_pattern">
export type RoutineStatus = Enums<"routine_status">
export type Weekday = Enums<"weekday">

export const CYCLE_STATUSES = Constants.public.Enums.cycle_status
export const EXERCISE_TYPES = Constants.public.Enums.exercise_type
export const MOVEMENT_PATTERNS = Constants.public.Enums.movement_pattern
export const ROUTINE_STATUSES = Constants.public.Enums.routine_status
export const WEEKDAYS = Constants.public.Enums.weekday
