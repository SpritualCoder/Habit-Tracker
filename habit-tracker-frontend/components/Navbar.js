//For the navigation bar at the top of the app
"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-800 shadow">
      <div className="max-w-5xl mx-auto p-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-lg">
          HabitTracker
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hidden md:inline">
            Dashboard
          </Link>
          <Link href="/feed" className="hidden md:inline">
            Feed
          </Link>
          {user ? (
            <>
              <span className="hidden md:inline">Hi, {user.name}</span>
              <button onClick={logout} className="px-3 py-1 bg-red-800 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 py-1 border rounded">
                Login
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1 bg-indigo-600 text-white rounded"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
