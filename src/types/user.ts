import { Database } from "./supabase";

export type DatabaseUser = Database["public"]["Tables"]["Users"]["Row"]