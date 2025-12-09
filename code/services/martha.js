import { MARTHA_APP_AUTH, MARTHA_BASE } from "./config";


export function marthaPostSimple(queryName, body) {
  console.log("==== MARTHA DEBUG REQUEST ====");
  console.log("Query:", queryName);
  console.log("URL:", `${MARTHA_BASE}/${encodeURIComponent(queryName)}/execute`);
  console.log("Headers:", {
    auth: MARTHA_APP_AUTH,
    "Content-Type": "application/json"
  });
  console.log("Body:", body);
  console.log("==============================");
  console.log("=== MARTHA CALL ===");
  console.log("BODY SENT:", JSON.stringify(body));

  return fetch(`${MARTHA_BASE}/${encodeURIComponent(queryName)}/execute`, {
    method: "POST",
    headers: {
      auth: MARTHA_APP_AUTH,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).then(r => r.json());
}

export const selectUserAuth = (email, password) =>
  marthaPostSimple("select-user-auth", { email, password });

export const insertUser = (username, email, password) =>
  marthaPostSimple("insert-user", { username, email, password });

export async function getExercicesByMuscle(muscle) {
  const res = await marthaPostSimple("select-exercices-by-muscle", { muscle });
  if (!res) return [];
  if (res.data) return res.data;
  return [];
}

export async function getUserById(id) {
  const r = await marthaPostSimple("select-user-by-id", { id });
  return r?.data?.[0] ?? null;
}


export async function getNextWorkout(id) {
  const r = await marthaPostSimple("select-next-workout", { id });
  return r?.data?.[0] ?? null;
}

// 🔹 5 dernières stats
export async function getLastStats(id) {
  const r = await marthaPostSimple("select-last-stats", { id });
  return r?.data ?? [];
}

// 🔹 Groupes musculaires faibles
export async function getWeakMuscles(id) {
  const r = await marthaPostSimple("select-weak-muscles", { id });
  return r?.data ?? [];
}

export async function signupUser(username, email, password) {
  return marthaPostSimple("insert-user", { username, email, password });
}

export async function authenticateUser(email, password) {
  const r = await marthaPostSimple("select-user-auth", { email, password });
  return r?.data?.[0] ?? null;
}

export async function updateUserProfile(data) {
  return marthaPostSimple("update-user-profile", data);
}

export async function fetchUserById(id) {
  const r = await marthaPostSimple("select-user-by-id", { id });
  return r?.data?.[0] ?? null;
}


export async function getWorkoutDates(id) {
  const r = await marthaPostSimple("select-workout-dates", { id });
  return r?.data ?? [];
}

export async function getMonthlyWorkoutCount(id) {
  const r = await marthaPostSimple("select-month-workout-count", { id });
  return r?.data?.[0]?.total ?? 0;
}

export async function getUserStreak(id) {
  const r = await marthaPostSimple("select-user-streak", { id });
  return r?.data?.[0]?.streak ?? 0;
}

export async function getUserMuscleScores(id) {
  const r = await marthaPostSimple("select-user-muscle-scores", { id });

  if (!r || !r.success || !r.data || !Array.isArray(r.data)) {
    console.log("⚠️ Pas de données muscle scores pour user :", id, r);
    return [];
  }

  return r.data.map((row) => {
    const score = row.best_score || 0;
    const avg = row.avg_world || 1;

    const rankScore = (score / (avg * 10)) * 100;

    return {
      groupe: row.groupe_musculaire,
      best: score,
      world: avg,
      rankScore,
    };
  });
}



/* 🔹 Détails d’un workout (avec ses exercices) */
export async function getWorkoutDetail(workoutId) {
  const r = await marthaPostSimple("select-workout-exercices", { id: workoutId });
  if (!r || !r.success || !Array.isArray(r.data)) return [];
  return r.data;
}


// 🔹 Tous les exercices (pour construire un workout)
export async function getAllExercices() {
  const r = await marthaPostSimple("select-all-exercices", {});
  if (!r || !r.success || !Array.isArray(r.data)) return [];
  return r.data;
}

// 🔹 Workouts d’un utilisateur
export async function getUserWorkouts(userId) {
  const r = await marthaPostSimple("select-workouts-by-user", { id: userId });
  if (!r || !r.success || !Array.isArray(r.data)) return [];
  return r.data;
}

export async function getWorkoutById(id) {
  const r = await marthaPostSimple("select-workout-by-id", { id });
  return r?.data?.[0] ?? null;
}

export async function updateWorkoutDone(workoutId) {
  const r = await marthaPostSimple("end-workout", { workout_id: workoutId });
  return r?.success;
}


// 🔹 Création d’un workout + liaison des exercices (max 15)
export async function createWorkout(userId, nom, description, exercices) {
  // 1. Créer le workout
  const rInsert = await marthaPostSimple("insert-workout", {
    user_id: userId,
    nom,
    description,
  });
  if (!rInsert || !rInsert.success) {
    throw new Error(rInsert?.error || "Erreur lors de la création du workout");
  }

  // 2. Récupérer le dernier workout créé pour ce user
  const rLast = await marthaPostSimple("select-last-workout-by-user", { id: userId });
  if (!rLast || !rLast.success || !Array.isArray(rLast.data) || !rLast.data[0]) {
    throw new Error("Impossible de récupérer le workout créé");
  }
  const workoutId = rLast.data[0].id;

  // 3. Limite à 15 exercices
  const limited = exercices.slice(0, 15);

  // 4. Inserer les exercices du workout
  for (const ex of limited) {
    await marthaPostSimple("insert-workout-exercice", {
      workout_id: workoutId,
      exercice_id: ex.id,
      sets: ex.sets || 3,
      reps: ex.reps || 10,
    });
  }

  return workoutId;
}