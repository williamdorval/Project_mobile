import { insertUser, selectUserAuth } from "./martha";
import { MARTHA_APP_AUTH } from "./config";
import { fetchUserById, updateUserProfile } from "../services/martha";

export async function loginWithMartha(email, password) {
  const e = email.trim();
  const p = password.trim();

  const res = await selectUserAuth(e, p);

  if (!res.success) throw new Error(res.error || "Erreur_Martha_(auth)");
  if (!res.data || !res.data.length) throw new Error("Identifiants invalides");

  return { auth: MARTHA_APP_AUTH, user: res.data[0] };
}

export async function signupWithMartha(username, email, password) {
  const u = username.trim();
  const e = email.trim();
  const p = password.trim();

  const ins = await insertUser(u, e, p);

  if (!ins.success) {
    const msg = String(ins.error || "");
    if (msg.includes("1062")) throw new Error("Ce nom d’utilisateur ou cet email est déjà pris.");
    throw new Error("Erreur d'inscription");
  }

  return loginWithMartha(e, p);
}


const updateProfile = async (newData) => {
  await updateUserProfile({ id: user.id, ...newData });

  const updated = await fetchUserById(user.id);
  setUser(updated);
};