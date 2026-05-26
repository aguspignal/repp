import { create } from "zustand"

export type DraftSet = {
	tempId: string
	progressionId: number
	order: number
	reps: number
	weight: number | null
}

export type DraftWorkoutExercise = {
	tempId: string
	exerciseId: number
	routinedayExerciseId: number | null
	order: number
	isUnplanned: boolean
	sets: DraftSet[]
}

export type DraftWorkout = {
	mesocycleId: number
	routinedayId: number
	cycleWeek: number
	date: string
	note: string | null
	exercises: DraftWorkoutExercise[]
}

type ActiveWorkoutState = {
	draft: DraftWorkout | null
	startedAt: number | null
	startWorkout: (
		init: Omit<DraftWorkout, "exercises"> & { exercises?: DraftWorkoutExercise[] },
	) => void
	cancelWorkout: () => void
	addExercise: (exercise: DraftWorkoutExercise) => void
	removeExercise: (tempId: string) => void
	addSet: (exerciseTempId: string, set: DraftSet) => void
	updateSet: (exerciseTempId: string, setTempId: string, patch: Partial<DraftSet>) => void
	removeSet: (exerciseTempId: string, setTempId: string) => void
	setNote: (note: string | null) => void
}

export const useActiveWorkoutStore = create<ActiveWorkoutState>((set, get) => ({
	draft: null,
	startedAt: null,
	startWorkout: init =>
		set({
			draft: { ...init, exercises: init.exercises ?? [] },
			startedAt: Date.now(),
		}),
	cancelWorkout: () => set({ draft: null, startedAt: null }),
	setNote: note => {
		const draft = get().draft
		if (!draft) return
		set({ draft: { ...draft, note } })
	},
	addExercise: exercise => {
		const draft = get().draft
		if (!draft) return
		set({ draft: { ...draft, exercises: [...draft.exercises, exercise] } })
	},
	removeExercise: tempId => {
		const draft = get().draft
		if (!draft) return
		set({
			draft: {
				...draft,
				exercises: draft.exercises.filter(e => e.tempId !== tempId),
			},
		})
	},
	addSet: (exerciseTempId, newSet) => {
		const draft = get().draft
		if (!draft) return
		set({
			draft: {
				...draft,
				exercises: draft.exercises.map(e =>
					e.tempId === exerciseTempId ? { ...e, sets: [...e.sets, newSet] } : e,
				),
			},
		})
	},
	updateSet: (exerciseTempId, setTempId, patch) => {
		const draft = get().draft
		if (!draft) return
		set({
			draft: {
				...draft,
				exercises: draft.exercises.map(e =>
					e.tempId === exerciseTempId
						? {
								...e,
								sets: e.sets.map(s =>
									s.tempId === setTempId ? { ...s, ...patch } : s,
								),
							}
						: e,
				),
			},
		})
	},
	removeSet: (exerciseTempId, setTempId) => {
		const draft = get().draft
		if (!draft) return
		set({
			draft: {
				...draft,
				exercises: draft.exercises.map(e =>
					e.tempId === exerciseTempId
						? { ...e, sets: e.sets.filter(s => s.tempId !== setTempId) }
						: e,
				),
			},
		})
	},
}))
