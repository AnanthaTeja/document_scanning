import { useState } from "react";
import { supabase } from "../lib/supabase";

export function CreditRequest({ userId }: { userId: string }) {
  const [requested, setRequested] = useState(false);

  async function requestCredits() {
    await supabase
      .from("credit_requests")
      .insert([{ user_id: userId, amount: 10, status: "pending" }]);
    setRequested(true);
  }

  return (
    <div>
      {requested ? (
        <p>Request sent!</p>
      ) : (
        <button
          onClick={requestCredits}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Request More Credits
        </button>
      )}
    </div>
  );
}
