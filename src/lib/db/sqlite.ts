import * as SQLite from "expo-sqlite"

import { config } from "../../constants/config"
import { SCHEMA_SQL } from "./schema"

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null

export const getDb = (): Promise<SQLite.SQLiteDatabase> => {
	if (!dbPromise) {
		dbPromise = (async () => {
			const db = await SQLite.openDatabaseAsync(config.sqliteDbName)
			await db.execAsync("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;")
			await db.execAsync(SCHEMA_SQL)
			return db
		})()
	}
	return dbPromise
}

export const resetDb = async (): Promise<void> => {
	const db = await getDb()
	await db.closeAsync()
	await SQLite.deleteDatabaseAsync(config.sqliteDbName)
	dbPromise = null
}
