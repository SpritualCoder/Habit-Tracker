//For creating and editing habits
"use client";
import { useState } from "react";
import api from "../lib/api";

export default function HabitForm({ habit, onSuccess }) {
  const [name, setName] = useState(habit?.name || "");
  const [category, setCategory] = useState(habit?.category || "");
  const [frequency, setFrequency] = useState(habit?.frequency || "daily");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (habit) {
        // Edit existing habit
        await api.put(`/api/habits/${habit._id}`, {
          name,
          category,
          frequency,
        });
      } else {
        // Create new habit
        await api.post("/api/habits", { name, category, frequency });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("HabitForm error:", err);
      setError(err.response?.data?.message || "Failed to save habit.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 p-4 rounded shadow max-w-lg"
    >
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <div className="mb-3">
        <label className="block text-sm mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded text-white"
          placeholder="e.g. Morning Run"
          required
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border px-3 py-2 rounded text-white"
          placeholder="e.g. Health"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">Frequency</label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="w-full border bg-gray-900 px-3 py-2 rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-500" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Saving..." : habit ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
