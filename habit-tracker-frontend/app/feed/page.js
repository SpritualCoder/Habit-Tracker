//for the main feed page showing friends' activities and leaderboard
"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function FeedPage() {
  const [feed, setFeed] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const [feedRes, leaderboardRes] = await Promise.all([
          api.get("/api/feed"),
          api.get("/api/feed/leaderboard"),
        ]);

        setFeed(feedRes.data || []);
        setLeaderboard(leaderboardRes.data || []);
      } catch (e) {
        console.error("Error fetching feed:", e);
        setError("Failed to load feed");
      } finally {
        setLoading(false);
      }
    }

    fetchFeed();
  }, []);

  if (loading) {
    return <div className="mt-8 text-center">Loading feed...</div>;
  }

  if (error) {
    return <div className="mt-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <section className="md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Friends’ Activity</h2>
        {feed.length === 0 ? (
          <p className="text-gray-900">No recent activity yet.</p>
        ) : (
          <ul className="space-y-3">
            {feed.map((item) => (
              <li
                key={item._id}
                className="p-3 bg-slate-800 rounded-lg shadow-sm"
              >
                <span className="font-bold">{item.user.name}</span> checked in
                for <span className="italic">{item.habit.name}</span> ✅
                <div className="text-sm text-gray-400">
                  Streak: {item.habit.currentStreak} days
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(item.completedAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="md:col-span-1">
        <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
        {leaderboard.length === 0 ? (
          <p className="text-gray-500">No leaderboard data available.</p>
        ) : (
          <ol className="space-y-3">
            {leaderboard.map((user, index) => (
              <li
                key={user.userId}
                className="p-3 bg-slate-800 rounded-lg shadow-sm flex justify-between"
              >
                <span>
                  {index + 1}. {user.name}
                </span>
                <span className="font-semibold">🔥 {user.maxStreak}</span>
              </li>
            ))}
          </ol>
        )}
      </aside>
    </div>
  );
}
