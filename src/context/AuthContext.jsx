import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserByEmail } from "../api/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("hos_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (email, password) => {
    const foundUser = await fetchUserByEmail(email);
    if (!foundUser) throw new Error("User not found");
    if (foundUser.password !== password) throw new Error("Incorrect password");
    setUser(foundUser);
    localStorage.setItem("hos_user", JSON.stringify(foundUser));
    return foundUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hos_user");
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
