//for creating a new habit
"use client";
import HabitForm from "../../../components/HabitForm";
import { useRouter } from "next/navigation";

export default function NewHabitPage() {
  const router = useRouter();
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Create a new habit</h2>
      <HabitForm onSuccess={() => router.push("/dashboard")} />
    </div>
  );
}
