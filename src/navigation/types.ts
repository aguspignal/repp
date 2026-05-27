import type { NavigatorScreenParams } from "@react-navigation/native"

export type AuthStackParamList = {
	Welcome: undefined
	Onboarding: undefined
	SignIn: undefined
	SignUp: undefined
}

export type HomeStackParamList = {
	HomeMain: undefined
}

export type LibraryTopTabParamList = {
	Routines: undefined
	Exercises: undefined
}

export type StatsStackParamList = {
	StatsMain: undefined
}

export type ProfileStackParamList = {
	ProfileMain: undefined
	Settings: undefined
}

export type AppTabParamList = {
	Home: NavigatorScreenParams<HomeStackParamList>
	Library: NavigatorScreenParams<LibraryTopTabParamList>
	Stats: NavigatorScreenParams<StatsStackParamList>
	Profile: NavigatorScreenParams<ProfileStackParamList>
}

export type RootStackParamList = {
	Auth: NavigatorScreenParams<AuthStackParamList>
	App: NavigatorScreenParams<AppTabParamList>
	WorkoutDetail: { workoutId: number }
	RoutineDetail: { routineId: number }
	ExerciseDetail: { exerciseId: number }
	ExerciseCreate: undefined
}

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}
