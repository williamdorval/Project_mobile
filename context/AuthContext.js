import React, { createContext, useContext, useState } from "react";
import {
  signupUser,
  loginUser,
  getProfile,
  updateProfile
} from "../services/martha.service";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);


  const login = async (email, password) => {
    const u = await loginUser(email, password);
    if (!u) return false;   // mauvais email / password

    setUser(u);
    return true;
  };

  
  const signup = async (email, password) => {
    const u = await signupUser(email, password);
    setUser(u);
    return true;
  };

  // 🔹 UPDATE PROFILE
  const saveProfile = async (profile) => {
    await updateProfile({ id: user.id, ...profile });

    // 🔄 refresh depuis BD
    const newData = await getProfile(user.id);
    setUser(newData);
  };

  // 🔹 LOGOUT
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        saveProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
