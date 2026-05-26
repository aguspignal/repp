import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { supabase } from "../lib/supabase"
import { useAuthStore } from "../stores/authStore"
import type { Milestone, MilestoneInsert } from "../types/db"
import { queryKeys } from "./queryKeys"

export const useMilestones = () => {
	const userId = useAuthStore(s => s.profile?.id)
	return useQuery({
		queryKey: userId ? queryKeys.milestones.all(userId) : ["milestones", "noUser"],
		queryFn: async (): Promise<Milestone[]> => {
			const { data, error } = await supabase
				.from("milestones")
				.select("*")
				.eq("user_id", userId!)
				.order("achieved_at", { ascending: false })
			if (error) throw error
			return data ?? []
		},
		enabled: !!userId,
	})
}

export const useCreateMilestone = () => {
	const qc = useQueryClient()
	const userId = useAuthStore(s => s.profile?.id)

	return useMutation({
		mutationFn: async (payload: Omit<MilestoneInsert, "user_id">) => {
			if (!userId) throw new Error("No user")
			const { data, error } = await supabase
				.from("milestones")
				.insert({ ...payload, user_id: userId })
				.select()
				.single()
			if (error) throw error
			return data
		},
		onSuccess: () => {
			if (userId) qc.invalidateQueries({ queryKey: queryKeys.milestones.all(userId) })
		},
	})
}
