//for editing an existing habit
"use client";

import { use, useEffect, useState } from "react";
import HabitForm from "../../../../components/HabitForm";
import api from "../../../../lib/api";
import { useRouter } from "next/navigation";

export default function EditHabit({ params }) {
  const { id } = use(params);

  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchHabit();
    }
  }, [id]);

  async function fetchHabit() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/habits/${id}`);
      setHabit(res.data.habit || null);
    } catch (e) {
      console.error("Failed to load habit:", e);
      setError("Failed to load habit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="mt-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="mt-8 text-center text-red-500">{error}</div>;
  }

  if (!habit) {
    return (
      <div className="mt-8 text-center text-gray-500">Habit not found.</div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Edit Habit</h2>
      <HabitForm habit={habit} onSuccess={() => router.push("/dashboard")} />
    </div>
  );
}
