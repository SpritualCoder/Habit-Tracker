//For showing individual habit cards in the dashboard
"use client";
import Link from "next/link";
import api from "../lib/api";
import { useState } from "react";

export default function HabitCard({ habit, onComplete, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this habit?")) return;
    try {
      setDeleting(true);
      await api.delete(`/api/habits/${habit._id}`);
      if (onDeleted) onDeleted(habit._id);
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Failed to delete habit.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="bg-slate-800 p-4 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{habit.title || habit.name}</h3>
          {habit.category && (
            <p className="text-sm text-gray-400">{habit.category}</p>
          )}
        </div>
        <div className="text-sm text-gray-400">{habit.currentStreak || 0}d</div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Frequency: {habit.frequency || "daily"}
        </div>

        <div className="flex gap-2">
          {/* Complete button */}
          <button
            onClick={onComplete}
            disabled={habit.completed}
            className={`px-3 py-1 rounded ${
              habit.completed
                ? "bg-gray-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {habit.completed ? "Done" : "Complete"}
          </button>

          {/* Edit button */}
          <Link
            href={`/habits/${habit._id}/edit`}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Edit
          </Link>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
