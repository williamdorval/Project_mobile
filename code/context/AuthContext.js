import React, { createContext, useContext, useState } from "react";
import { updateUserProfile, fetchUserById } from "../services/martha";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);

  const login = (authValue, userValue) => {
    setAuth(authValue);
    setUser(userValue);
  };

  const logout = () => {
    setAuth(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    if (!user?.id) throw new Error("Aucun utilisateur connecté.");

    await updateUserProfile({ id: user.id, ...data });

    const updatedUser = await fetchUserById(user.id);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ auth, user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}