import React, { createContext, useContext, useState } from "react";
import AuthService from "../services/auth.service";
import UserCredentials from "../models/UserCredentials.model";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(email, password) {
    const credentials = new UserCredentials({ email, password });
    const ok = await AuthService.login(credentials);

    if (ok) setUser(AuthService.currentUser);
    return ok;
  }

  async function signup(email, password, username) {
    const credentials = new UserCredentials({ email, password, username });
    const ok = await AuthService.signup(credentials);

    if (ok) setUser(AuthService.currentUser);
    return ok;
  }

  async function updateProfile(values) {
    const ok = await AuthService.updateProfile(values);
    if (ok) setUser(AuthService.currentUser);
    return ok;
  }

  function logout() {
    AuthService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
