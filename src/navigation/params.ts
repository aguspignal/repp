import {
	NativeStackNavigationProp,
	NativeStackScreenProps
} from "@react-navigation/native-stack"

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
	ExerciseRepository: undefined
	CreateExercise: undefined
	EditExercise: { id: number }
}

export type RootStackScreenProps<T extends keyof RootStackParams> =
	NativeStackScreenProps<RootStackParams, T>

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParams>
