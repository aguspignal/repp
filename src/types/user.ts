import { Database } from "./supabase"
import { ExerciseWithProgressions } from "./exercises"
import { RoutineWithDaysAndSchedule } from "./routines"

export type DatabaseUser = Database["public"]["Tables"]["Users"]["Row"]

export type InitialData = {
	user: DatabaseUser | null
	exercises: ExerciseWithProgressions[]
	routines: RoutineWithDaysAndSchedule[]
}
