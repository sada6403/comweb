import { useState } from "react";
import { api } from "../lib/api";
import { AuthContext, AUTH_STORAGE_KEY } from "./AuthContext";

function readStored() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

/* Holds the admin JWT (persisted across reloads) and exposes login/logout.
   `token` is passed to api writes; the backend validates it as a Bearer. */
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(readStored);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    const session = { email, token: data.access_token };
    setAdmin(session);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch {
      /* storage unavailable — session stays in memory only */
    }
    return session;
  };

  const logout = () => {
    setAdmin(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <AuthContext.Provider value={{ admin, token: admin?.token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
