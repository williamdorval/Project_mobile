[
  {
    "name": "insert-user",
    "string": "INSERT INTO users (username, email, password)\nVALUES (\n  \"?username\",\n  \"?email\",\n  SHA2(\"?password\", 256)\n);",
    "type": 1
  },
  {
    "name": "select-user-auth",
    "string": "SELECT id, username, email, goal, height_cm, sexe\nFROM users\nWHERE email = \"?email\"\n  AND password = SHA2(\"?password\", 256);",
    "type": 0
  },
  {
    "name": "select-exercices-by-muscle",
    "string": "SELECT id, name, groupe_musculaire, moyenne_monde_poid\nFROM exercices\nWHERE groupe_musculaire = \"?muscle\"\nORDER BY name;",
    "type": 0
  },
  {
    "name": "select-user-by-id",
    "string": "SELECT\n  id,\n  username,\n  email,\n  firstName,\n  lastName,\n  weight,\n  height_cm,\n  sexe,\n  goal,\n  rank\nFROM users\nWHERE id = ?id;",
    "type": 0
  },
  {
    "name": "select-next-workout",
    "string": "SELECT id, nom, description, started_at\nFROM workouts\nWHERE user_id = ?id\n  AND (started_at IS NULL OR started_at >= NOW())\nORDER BY\n  CASE WHEN started_at IS NULL THEN 1 ELSE 0 END,\n  started_at ASC\nLIMIT 1;",
    "type": 0
  },
  {
    "name": "select-last-stats",
    "string": "SELECT s.id, e.name AS exercice, s.poids, s.reps, s.created_at\nFROM statistique s\nJOIN exercices e ON e.id = s.exercice_id\nWHERE s.user_id = ?id\nORDER BY s.created_at DESC\nLIMIT 5;",
    "type": 0
  },
  {
    "name": "select-weak-muscles",
    "string": "SELECT\n  e.groupe_musculaire AS groupe,\n  e.name AS exercice\nFROM exercices e\nJOIN statistique s ON s.exercice_id = e.id\nWHERE s.user_id = ?id\n  AND s.poids < e.moyenne_monde_poid\nGROUP BY e.id\nORDER BY (e.moyenne_monde_poid - AVG(s.poids)) DESC\nLIMIT 3;",
    "type": 0
  },
  {
    "name": "select-workouts-by-user",
    "string": "SELECT\n  id,\n  user_id,\n  nom,\n  description,\n  started_at,\n  ended_at\nFROM workouts\nWHERE user_id = ?id\nORDER BY\n  (ended_at IS NULL),\n  COALESCE(ended_at, started_at) DESC;",
    "type": 0
  },
  {
    "name": "select-workout-dates",
    "string": "SELECT DATE(started_at) AS day\nFROM workouts\nWHERE user_id = ?id;",
    "type": 0
  },
  {
    "name": "select-month-workout-count",
    "string": "SELECT COUNT(*) AS total\nFROM workouts\nWHERE user_id = ?id\n  AND MONTH(started_at) = MONTH(CURRENT_DATE())\n  AND YEAR(started_at) = YEAR(CURRENT_DATE());",
    "type": 0
  },
  {
    "name": "select-user-streak",
    "string": "WITH days AS (\n  SELECT DATE(started_at) AS d\n  FROM workouts\n  WHERE user_id = ?id\n  GROUP BY DATE(started_at)\n),\nseq AS (\n  SELECT d,\n         ROW_NUMBER() OVER (ORDER BY d) AS rn\n  FROM days\n),\ngrp AS (\n  SELECT d,\n         DATE_SUB(d, INTERVAL rn DAY) AS grp\n  FROM seq\n)\nSELECT COUNT(*) AS streak\nFROM grp\nWHERE grp = (\n  SELECT grp\n  FROM grp\n  ORDER BY grp DESC\n  LIMIT 1\n);",
    "type": 0
  },
  {
    "name": "select-user-muscle-scores",
    "string": "SELECT\n  e.groupe_musculaire,\n  MAX(s.poids * s.reps) AS best_score,\n  AVG(e.moyenne_monde_poid) AS avg_world\nFROM statistique s\nJOIN exercices e ON e.id = s.exercice_id\nWHERE s.user_id = ?id\nGROUP BY e.groupe_musculaire;",
    "type": 0
  },
  {
    "name": "select-all-exercices",
    "string": "SELECT id, name, groupe_musculaire, moyenne_monde_poid\nFROM exercices\nORDER BY groupe_musculaire, name;",
    "type": 0
  },
  {
    "name": "select-workout-exercices",
    "string": "SELECT we.id, we.exercice_id, we.sets, we.reps,\n       e.name, e.groupe_musculaire\nFROM workout_exercice we\nJOIN exercices e ON e.id = we.exercice_id\nWHERE we.workout_id = ?id\nORDER BY we.id;",
    "type": 0
  },
  {
    "name": "insert-workout",
    "string": "INSERT INTO workouts (user_id, nom, description, started_at, ended_at)\nVALUES (?user_id, '?nom', '?description', NOW(), NULL);",
    "type": 1
  },
  {
    "name": "select-last-workout-by-user",
    "string": "SELECT id, nom, description, started_at\nFROM workouts\nWHERE user_id = ?id\nORDER BY id DESC\nLIMIT 1;",
    "type": 0
  },
  {
    "name": "insert-workout-exercice",
    "string": "INSERT INTO workout_exercice (workout_id, exercice_id, sets, reps)\nVALUES (?workout_id, ?exercice_id, ?sets, ?reps);",
    "type": 1
  },
  {
    "name": "insert-statistique",
    "string": "INSERT INTO statistique (user_id, exercice_id, poids, reps)\nVALUES (?user_id, ?exercice_id, ?poids, ?reps);",
    "type": 1
  },
  {
    "name": "end-workout",
    "string": "UPDATE workouts\nSET ended_at = NOW()\nWHERE id = ?id;",
    "type": 1
  },
  {
    "name": "select-workout-by-id",
    "string": "SELECT *\nFROM workouts\nWHERE id = ?id;",
    "type": 0
  },
  {
    "name": "update-start-date",
    "string": "UPDATE workouts\nSET started_at = '?new_date'\nWHERE id = CAST(?workout_id AS SIGNED)\n  AND user_id = CAST(?user_id AS SIGNED);",
    "type": 1
  },
  {
    "name": "update-user-rank",
    "string": "UPDATE users\nSET rank = '?rank'\nWHERE id = ?id;",
    "type": 1
  },
  {
    "name": "select-user-discipline",
    "string": "SELECT\n  (SELECT COUNT(*) FROM workouts WHERE user_id = ?id AND ended_at IS NOT NULL) AS total_workouts,\n  (SELECT COUNT(*) FROM workouts WHERE user_id = ?id AND ended_at >= NOW() - INTERVAL 30 DAY) AS recent_workouts;",
    "type": 0
  },
  {
    "name": "delete-workout",
    "string": "DELETE FROM workouts\nWHERE id = ?workout_id\n  AND user_id = ?user_id;",
    "type": 1
  },
  {
    "name": "update-user-profile",
    "string": "UPDATE users\nSET\n  username = :firstName,\n  lastName = :lastName,\n  weight   = :weight,\n  height   = :height,\n  gender   = :gender,\n  goal     = :goal\nWHERE id = :userId;",
    "type": 1
  },
  {
    "name": "update-workout",
    "string": "UPDATE workouts\nSET\n  nom = '?nom',\n  description = '?description'\nWHERE id = ?workout_id;",
    "type": 1
  },
  {
    "name": "delete-user",
    "string": "DELETE FROM users\nWHERE id = ?id;",
    "type": 1
  }
]
