// app/(whatever)/dashboard/page.jsx  (or DashboardPage.js)
// Dashboard page showing user's habits and allowing management
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import HabitCard from "../../components/HabitCard";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return; // auth still loading
    if (!user) {
      setLoading(false); // not logged in
      return;
    }
    fetchHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function fetchHabits() {
    setLoading(true);
    try {
      const res = await api.get("/api/habits"); // ✅ correct endpoint
      setHabits(res.data.habits || []); // backend always wraps in { habits: [...] }
    } catch (err) {
      console.error("Failed to fetch habits:", err);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }

  async function completeHabit(id) {
    try {
      await api.post(`/api/habits/${id}/complete`); // ✅ correct endpoint
      fetchHabits();
    } catch (e) {
      console.error(e);
    }
  }

  if (user === undefined) {
    return <div className="mt-12 text-center">Loading user...</div>;
  }

  if (!user) {
    return (
      <div className="mt-12 text-center">
        <p>
          Please{" "}
          <Link href="/login" className="text-indigo-600">
            login
          </Link>{" "}
          to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Habits</h2>
        <div className="flex gap-2">
          <Link
            href="/habits/new"
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            New Habit
          </Link>
          <Link
            href="/friends"
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Friends
          </Link>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : habits.length === 0 ? (
        <div className="text-center text-gray-500">
          No habits yet. Create one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map((h) => (
            <HabitCard
              key={h._id || h.id}
              habit={h}
              onComplete={() => completeHabit(h._id || h.id)}
              onDeleted={(deletedId) =>
                setHabits((prev) => prev.filter((x) => x._id !== deletedId))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
