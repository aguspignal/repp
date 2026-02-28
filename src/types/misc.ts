import { Database } from "./supabase"

export type TextType =
	| "note"
	| "boldNote"
	| "text"
	| "boldText"
	| "subtitle"
	| "title"

export type Weekday = Database["public"]["Enums"]["Weekday"]
