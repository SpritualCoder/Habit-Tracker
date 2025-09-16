//For searching users and following/unfollowing them
"use client";
import { useState } from "react";
import api from "../lib/api";

export default function SearchUser() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get(
        `/api/friends/search?q=${encodeURIComponent(query)}`
      );
      setResults(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function follow(id) {
    try {
      await api.post(`/api/friends/follow/${id}`);
      setResults((r) =>
        r.map((u) => (u._id === id ? { ...u, following: true } : u))
      );
    } catch (e) {
      console.error(e);
    }
  }

  async function unfollow(id) {
    try {
      await api.delete(`/api/friends/unfollow/${id}`);
      setResults((r) =>
        r.map((u) => (u._id === id ? { ...u, following: false } : u))
      );
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button className="px-3 py-2 bg-indigo-600 text-white rounded">
          Search
        </button>
      </form>
      {loading ? (
        <div>Searching...</div>
      ) : (
        <div className="space-y-3">
          {results.map((u) => (
            <div
              key={u._id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-sm text-gray-500">{u.email}</div>
              </div>
              <div>
                {u.following ? (
                  <button
                    onClick={() => unfollow(u._id)}
                    className="px-3 py-1 border rounded"
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => follow(u._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
