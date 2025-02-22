import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export function UserDashboard() {
  const { user, credits } = useAuthStore();
  const [requested, setRequested] = useState(false);

  async function requestCredits() {
    if (requested) return; // Prevent duplicate requests

    const { error } = await supabase
      .from("credit_requests")
      .insert([{ user_id: user?.id, amount: 10, status: "pending" }]);

    if (error) {
      alert("Error requesting credits: " + error.message);
    } else {
      setRequested(true);
      alert("Credit request sent!");
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">User Dashboard</h2>
      <p>Credits: {credits}</p>

      {credits === 0 && (
        <button
          onClick={requestCredits}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={requested}
        >
          {requested ? "Request Sent" : "Request More Credits"}
        </button>
      )}
    </div>
  );
}
