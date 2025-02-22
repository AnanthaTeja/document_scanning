import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";

export function AdminDashboard() {
  const { role } = useAuthStore();
  const [creditRequests, setCreditRequests] = useState<
    { id: string; user_id: string; amount: number }[]
  >([]);

  useEffect(() => {
    if (role !== "admin") return;

    async function fetchRequests() {
      const { data } = await supabase
        .from("credit_requests")
        .select("*")
        .eq("status", "pending");
      setCreditRequests(data || []);
    }

    fetchRequests();
  }, [role]);

  //   async function handleApproval(
  //     requestId: string,
  //     userId: string,
  //     amount: number,
  //     approve: boolean
  //   ) {
  //     const newStatus = approve ? "approved" : "denied";

  //     await supabase
  //       .from("credit_requests")
  //       .update({ status: newStatus })
  //       .eq("id", requestId);

  //     if (approve) {
  //       await supabase
  //         .from("profiles")
  //         .update({ credits: supabase.sql`credits + ${amount}` })
  //         .eq("id", userId);
  //     }

  //     setCreditRequests((prev) => prev.filter((req) => req.id !== requestId));
  //   }
  async function handleApproval(
    requestId: string,
    userId: string,
    amount: number,
    approve: boolean
  ) {
    const newStatus = approve ? "approved" : "denied";

    await supabase
      .from("credit_requests")
      .update({ status: newStatus })
      .eq("id", requestId);

    if (approve) {
      await supabase.rpc("increment_credits", { user_id: userId, amount });
    }

    setCreditRequests((prev) => prev.filter((req) => req.id !== requestId));
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      {creditRequests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <table className="w-full mt-4 border">
          <thead>
            <tr>
              <th className="border p-2">User ID</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {creditRequests.map((req) => (
              <tr key={req.id} className="border">
                <td className="border p-2">{req.user_id}</td>
                <td className="border p-2">{req.amount}</td>
                <td className="border p-2">
                  <button
                    onClick={() =>
                      handleApproval(req.id, req.user_id, req.amount, true)
                    }
                    className="bg-green-500 text-white px-2 py-1 mx-1"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleApproval(req.id, req.user_id, req.amount, false)
                    }
                    className="bg-red-500 text-white px-2 py-1 mx-1"
                  >
                    Deny
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
