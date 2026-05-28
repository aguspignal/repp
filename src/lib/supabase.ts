import "react-native-url-polyfill/auto"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { createClient } from "@supabase/supabase-js"
import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"

import { config } from "../constants/config"
import type { Database } from "../types/supabase"

const SecureStoreAdapter = {
	getItem: (key: string) => SecureStore.getItemAsync(key),
	setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
	removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

const storage = Platform.OS === "web" ? AsyncStorage : SecureStoreAdapter

const client = createClient<Database>(config.supabaseUrl, config.supabaseAnonKey, {
	auth: {
		storage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
})

if (__DEV__) {
	const ops = new Set(["select", "insert", "update", "delete", "upsert"])
	let count = 0
	const origFrom = client.from.bind(client)
	;(client as { from: typeof client.from }).from = ((table: Parameters<typeof origFrom>[0]) => {
		const builder = origFrom(table)
		return new Proxy(builder as object, {
			get(target, prop, receiver) {
				const val = Reflect.get(target, prop, receiver)
				if (typeof prop === "string" && ops.has(prop) && typeof val === "function") {
					return (...args: unknown[]) => {
						count++
						console.log(`[db #${count}] ${prop} ${String(table)}`)
						return (val as (...a: unknown[]) => unknown).apply(target, args)
					}
				}
				return typeof val === "function" ? val.bind(target) : val
			},
		})
	}) as typeof client.from
}

export const supabase = client
