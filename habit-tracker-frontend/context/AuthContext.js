// AuthContext.js (fixed)
// Context for authentication state and actions
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["x-auth-token"] = token;
      api
        .get("/api/auth/me")
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          // set null so UI knows "not logged in"
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  async function login({ email, password }) {
    const res = await api.post("/api/auth/login", { email, password });
    const token = res.data.token;
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["x-auth-token"] = token;
      const profile = await api.get("/api/auth/me");
      setUser(profile.data);
    }
  }

  async function signup({ name, email, password }) {
    const res = await api.post("/api/auth/register", { name, email, password });
    const token = res.data.token;
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["x-auth-token"] = token;
      const profile = await api.get("/api/auth/me");
      setUser(profile.data);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["x-auth-token"];
    setUser(null);
    router.push("/");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
