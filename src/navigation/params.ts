import {
	NativeStackNavigationProp,
	NativeStackScreenProps
} from "@react-navigation/native-stack"
import { DatabaseExercise } from "../types/exercises"

export type LoginStackParams = {
	Welcome: undefined
	SignIn: undefined
	SignUp: undefined
}

export type LoginScreenProps<T extends keyof LoginStackParams> =
	NativeStackScreenProps<LoginStackParams, T>

export type RootStackParams = {
	Home: undefined
	Settings: undefined
	ExerciseRepository: { editingRoutineDayId?: number }
	CreateExercise: undefined
	EditExercise: { id: number }
	Routine: { id: number }
	EditRoutineDay: {
		id: number
		selectedExercises?: DatabaseExercise[]
	}
}

export type RootStackScreenProps<T extends keyof RootStackParams> =
	NativeStackScreenProps<RootStackParams, T>

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParams>
