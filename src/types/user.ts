import { Database } from "./supabase"
import { DatabaseExercise } from "./exercises"
import { RoutineAndDays } from "./routines"

export type DatabaseUser = Database["public"]["Tables"]["Users"]["Row"]

export type InitialData = {
	user: DatabaseUser | null
	exercises: DatabaseExercise[]
	routines: RoutineAndDays[]
}
