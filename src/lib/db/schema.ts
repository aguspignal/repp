export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  uuid TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  move_pattern TEXT,
  is_isometric INTEGER NOT NULL DEFAULT 0,
  is_weighted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  deleted_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_exercises_user ON exercises(user_id);

CREATE TABLE IF NOT EXISTS progressions (
  id INTEGER PRIMARY KEY,
  exercise_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  deleted_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);
CREATE INDEX IF NOT EXISTS idx_progressions_exercise ON progressions(exercise_id);

CREATE TABLE IF NOT EXISTS routines (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  colour_hex TEXT,
  schedule_weeks INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft',
  deleted_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_routines_user ON routines(user_id);

CREATE TABLE IF NOT EXISTS routine_days (
  id INTEGER PRIMARY KEY,
  routine_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  deleted_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (routine_id) REFERENCES routines(id)
);
CREATE INDEX IF NOT EXISTS idx_routine_days_routine ON routine_days(routine_id);

CREATE TABLE IF NOT EXISTS routine_schedules (
  id INTEGER PRIMARY KEY,
  routineday_id INTEGER NOT NULL,
  weekday TEXT NOT NULL,
  week_number INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (routineday_id) REFERENCES routine_days(id)
);
CREATE INDEX IF NOT EXISTS idx_routine_schedules_day ON routine_schedules(routineday_id);

CREATE TABLE IF NOT EXISTS routineday_exercises (
  id INTEGER PRIMARY KEY,
  exercise_id INTEGER NOT NULL,
  routineday_id INTEGER NOT NULL,
  "order" INTEGER NOT NULL,
  note TEXT,
  set_goal_low INTEGER,
  set_goal_high INTEGER,
  rep_goal_low INTEGER,
  rep_goal_high INTEGER,
  deleted_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id),
  FOREIGN KEY (routineday_id) REFERENCES routine_days(id)
);
CREATE INDEX IF NOT EXISTS idx_rde_day ON routineday_exercises(routineday_id);

CREATE TABLE IF NOT EXISTS macrocycles (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_macrocycles_user ON macrocycles(user_id);

CREATE TABLE IF NOT EXISTS mesocycles (
  id INTEGER PRIMARY KEY,
  macrocycle_id INTEGER,
  user_id INTEGER NOT NULL,
  routine_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  note TEXT,
  start_date TEXT NOT NULL,
  actual_end_date TEXT,
  duration_weeks INTEGER,
  deload_week INTEGER,
  status TEXT NOT NULL DEFAULT 'planned',
  deleted_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (macrocycle_id) REFERENCES macrocycles(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (routine_id) REFERENCES routines(id)
);
CREATE INDEX IF NOT EXISTS idx_mesocycles_user ON mesocycles(user_id);
CREATE INDEX IF NOT EXISTS idx_mesocycles_routine ON mesocycles(routine_id);

CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  mesocycle_id INTEGER NOT NULL,
  routineday_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  cycle_week INTEGER NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (mesocycle_id) REFERENCES mesocycles(id),
  FOREIGN KEY (routineday_id) REFERENCES routine_days(id)
);
CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON workouts(user_id, date);
CREATE INDEX IF NOT EXISTS idx_workouts_meso ON workouts(mesocycle_id);

CREATE TABLE IF NOT EXISTS workout_exercises (
  id INTEGER PRIMARY KEY,
  workout_id INTEGER NOT NULL,
  routineday_exercise_id INTEGER,
  exercise_id INTEGER NOT NULL,
  "order" INTEGER NOT NULL,
  is_unplanned INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (workout_id) REFERENCES workouts(id),
  FOREIGN KEY (routineday_exercise_id) REFERENCES routineday_exercises(id),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);
CREATE INDEX IF NOT EXISTS idx_we_workout ON workout_exercises(workout_id);

CREATE TABLE IF NOT EXISTS workout_sets (
  id INTEGER PRIMARY KEY,
  workout_exercise_id INTEGER NOT NULL,
  progression_id INTEGER NOT NULL,
  "order" INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight REAL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id),
  FOREIGN KEY (progression_id) REFERENCES progressions(id)
);
CREATE INDEX IF NOT EXISTS idx_ws_we ON workout_sets(workout_exercise_id);

CREATE TABLE IF NOT EXISTS milestones (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  progression_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  note TEXT,
  achieved_at TEXT NOT NULL,
  is_automatic INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (progression_id) REFERENCES progressions(id)
);
CREATE INDEX IF NOT EXISTS idx_milestones_user ON milestones(user_id);

CREATE TABLE IF NOT EXISTS bodyweight_logs (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  weight REAL NOT NULL,
  logged_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_bw_user_date ON bodyweight_logs(user_id, logged_at);

CREATE TABLE IF NOT EXISTS sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity TEXT NOT NULL,
  entity_id INTEGER,
  op TEXT NOT NULL,
  payload TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT
);
`
