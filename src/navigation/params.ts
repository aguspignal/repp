import {
	NativeStackNavigationProp,
	NativeStackScreenProps
} from "@react-navigation/native-stack"
import {
	CompositeScreenProps,
	NavigatorScreenParams
} from "@react-navigation/native"
import { DatabaseExercise } from "../types/exercises"
import { DatabaseSchedule } from "../types/routines"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"

export type LoginStackParams = {
	Welcome: undefined
	SignIn: undefined
	SignUp: undefined
}

export type LoginScreenProps<T extends keyof LoginStackParams> =
	NativeStackScreenProps<LoginStackParams, T>

export type RootStackParams = {
	Tabs: NavigatorScreenParams<TabParams>
	Settings: undefined
	AddExercisesFromRepo: { dayId: number }
	EditRoutineDay: {
		id: number
		selectedExercises?: DatabaseExercise[]
	}
	RoutineDayHistory: {
		id: number
		canEdit: boolean
	}
	Workout: { dayId: number }
	EditWorkout: {
		wId: number
		dayId: number
	}
	ExerciseHistory: { id: number }
}

export type RootStackScreenProps<T extends keyof RootStackParams> =
	NativeStackScreenProps<RootStackParams, T>

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParams>

export type TabParams = {
	MesocyclesTab: undefined
	RoutinesTab: NavigatorScreenParams<RoutinesTabParams>
	ExercisesTab: NavigatorScreenParams<ExercisesTabParams>
	StatsTab: undefined
}

export type TabScreenProps<T extends keyof TabParams> = BottomTabScreenProps<
	TabParams,
	T
>

export type RoutinesTabParams = {
	MyRoutines: undefined
	Routine: { id: number }
	EditRoutine: { id: number }
	RoutineSchedule: {
		routineId: number
		schedule: DatabaseSchedule[] | undefined
	}
	ArchivedRoutines: undefined
}

export type RoutinesTabScreenProps<T extends keyof RoutinesTabParams> =
	CompositeScreenProps<
		NativeStackScreenProps<RoutinesTabParams, T>,
		CompositeScreenProps<
			TabScreenProps<keyof TabParams>,
			RootStackScreenProps<keyof RootStackParams>
		>
	>

export type ExercisesTabParams = {
	ExerciseRepository: undefined
	CreateExercise: undefined
	EditExercise: {
		id: number
		comingFromWorkout?: number[]
	}
}

export type ExercisesTabScreenProps<T extends keyof ExercisesTabParams> =
	CompositeScreenProps<
		NativeStackScreenProps<ExercisesTabParams, T>,
		CompositeScreenProps<
			TabScreenProps<keyof TabParams>,
			RootStackScreenProps<keyof RootStackParams>
		>
	>
