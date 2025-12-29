import { DatabaseUser } from "../types/user"
import { PostgrestError } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

const userService = {
    async fetchUserByUuid(uuid: string): Promise<DatabaseUser | null | PostgrestError> {
		console.log("U-SERVICE: fetchUserByUuid")
		const { error, data } = await supabase.from("Users").select("*").eq("uuid", uuid)

		if (error) return error
		return data[0] ?? null
	},
}

export default userService