export const queryKeys = {
	auth: {
		session: ["auth", "session"] as const,
	},
	exercises: {
		all: (userId: number) => ["exercises", userId] as const,
		byId: (id: number) => ["exercises", "byId", id] as const,
		deleted: (userId: number) => ["exercises", userId, "deleted"] as const,
	},
	progressions: {
		byExercise: (exerciseId: number) => ["progressions", "byExercise", exerciseId] as const,
	},
	routines: {
		all: (userId: number) => ["routines", userId] as const,
		byId: (id: number) => ["routines", "byId", id] as const,
		days: (routineId: number) => ["routines", routineId, "days"] as const,
	},
	mesocycles: {
		all: (userId: number) => ["mesocycles", userId] as const,
		active: (userId: number) => ["mesocycles", userId, "active"] as const,
	},
	workouts: {
		all: (userId: number) => ["workouts", userId] as const,
		byId: (id: number) => ["workouts", "byId", id] as const,
		recent: (userId: number, limit: number) => ["workouts", userId, "recent", limit] as const,
	},
	milestones: {
		all: (userId: number) => ["milestones", userId] as const,
	},
	bodyweight: {
		all: (userId: number) => ["bodyweight", userId] as const,
	},
} as const
