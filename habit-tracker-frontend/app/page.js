//Main landing page with links to signup and login
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold mb-4">Habit Tracker</h1>
      <p className="mb-6">
        Build consistent habits, track progress, and stay motivated with
        friends.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="/signup"
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
