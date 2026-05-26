import { useQuery } from "@tanstack/react-query"

import { supabase } from "../lib/supabase"
import type { Progression } from "../types/db"
import { queryKeys } from "./queryKeys"

export const useProgressions = (exerciseId: number | null) =>
	useQuery({
		queryKey: queryKeys.progressions.byExercise(exerciseId ?? -1),
		queryFn: async (): Promise<Progression[]> => {
			if (!exerciseId) return []
			const { data, error } = await supabase
				.from("progressions")
				.select("*")
				.eq("exercise_id", exerciseId)
				.is("deleted_at", null)
				.order("order", { ascending: true })
			if (error) throw error
			return data ?? []
		},
		enabled: exerciseId != null,
	})
