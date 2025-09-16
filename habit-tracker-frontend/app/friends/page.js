//for the friends page where users can search, follow, and unfollow friends
"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function FriendsPage() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [following, setFollowing] = useState([]);

  // Load following list on mount
  useEffect(() => {
    fetchFollowing();
  }, []);

  async function fetchFollowing() {
    try {
      const res = await api.get("/api/friends/following");
      setFollowing(res.data);
    } catch (err) {
      console.error("Failed to fetch following:", err);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!search.trim()) return;
    try {
      const res = await api.get(`/api/friends/search?q=${search}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  }

  async function followUser(userId) {
    try {
      await api.post(`/api/friends/follow/${userId}`);
      fetchFollowing();
    } catch (err) {
      console.error("Follow failed:", err);
    }
  }

  async function unfollowUser(userId) {
    try {
      await api.delete(`/api/friends/unfollow/${userId}`);
      fetchFollowing();
    } catch (err) {
      console.error("Unfollow failed:", err);
    }
  }

  const isFollowing = (userId) => following.some((u) => u._id === userId);

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Friends</h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold mb-2">Search Results</h3>
          <ul className="space-y-2">
            {results.map((user) => (
              <li
                key={user._id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>
                  {user.name}{" "}
                  <span className="text-gray-500">({user.email})</span>
                </span>
                {isFollowing(user._id) ? (
                  <button
                    onClick={() => unfollowUser(user._id)}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => followUser(user._id)}
                    className="text-sm px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Follow
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Following List */}
      <div>
        <h3 className="font-semibold mb-2">Following</h3>
        {following.length === 0 ? (
          <p className="text-gray-500">You are not following anyone yet.</p>
        ) : (
          <ul className="space-y-2">
            {following.map((user) => (
              <li
                key={user._id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>
                  {user.name}{" "}
                  <span className="text-gray-500">({user.email})</span>
                </span>
                <button
                  onClick={() => unfollowUser(user._id)}
                  className="text-sm px-3 py-1 bg-red-500 text-white rounded"
                >
                  Unfollow
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
