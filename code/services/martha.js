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

export async function getUserWorkouts(id) {
  const r = await marthaPostSimple("select-workouts-by-user", { id });
  return r?.data ?? [];
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
