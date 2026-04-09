import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchSession } from "../handlers/authHandlers.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signInMode, setSignInMode] = useState("login");

  const refreshSession = useCallback(async () => {
    try {
      const data = await fetchSession();
      setUserId(data?.session?.userId || data?.userId || null);
    } catch {
      setUserId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      userId,
      loading,
      refreshSession,
      signInMode,
      setSignInMode,
    }),
    [userId, loading, refreshSession, signInMode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
