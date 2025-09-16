//login/page.js
//For the login page
"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-gray-900 p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full border px-3 py-2 rounded"
        />
        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
