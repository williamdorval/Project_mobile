import React, { createContext, useContext, useState } from "react";
import {
  selectUserAuth,
  insertUser,
  updateUserProfile,
  fetchUserById,
  deleteUserById   
} from "../services/martha";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);


  const login = async (email, password) => {
    const res = await selectUserAuth(email.trim(), password.trim());

    if (!res?.success || !res.data?.length) {
      throw new Error("Identifiants invalides");
    }

    const normalized = normalizeUser(res.data[0]);
    setUser(normalized);
    return normalized;
  };


  const signup = async (username, email, password) => {
    const res = await insertUser(username.trim(), email.trim(), password.trim());

    if (!res.success) {
      throw new Error(res.error || "Erreur d'inscription");
    }

    return login(email, password);
  };

  const logout = () => {
    setUser(null);
  };

  
  const updateProfile = async (profile) => {
    if (!user) return;

    await updateUserProfile({
      id: user.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      weight: profile.weight,
      height: profile.height,
      gender: profile.gender,
      goal: profile.goal,
    });



    const refreshed = await fetchUserById(user.id);
    const normalized = normalizeUser(refreshed);

    setUser(normalized);
    return normalized;
  };

  const deleteAccount = async () => {
    if (!user) return;

    await deleteUserById(user.id);

   
    setUser(null);
  };


  function normalizeUser(raw) {
    if (!raw) return null;

    return {
      ...raw,
      weight: raw.weight ?? null,
      height: raw.height ?? null,
      gender: raw.gender ?? null,
    };
  }



  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        deleteAccount   
      }}
    >

      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
