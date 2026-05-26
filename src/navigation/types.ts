import type { NavigatorScreenParams } from "@react-navigation/native"

export type AuthStackParamList = {
	Welcome: undefined
	Onboarding: undefined
	SignIn: undefined
	SignUp: undefined
}

export type AppTabParamList = {
	Home: undefined
	Workouts: undefined
	Routines: undefined
	Exercises: undefined
	Profile: undefined
}

export type RootStackParamList = {
	Auth: NavigatorScreenParams<AuthStackParamList>
	App: NavigatorScreenParams<AppTabParamList>
	WorkoutDetail: { workoutId: number }
	RoutineDetail: { routineId: number }
	ExerciseDetail: { exerciseId: number }
}

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}
