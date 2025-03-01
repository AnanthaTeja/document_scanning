// import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";
// import { useAuthStore } from "../store/authStore";

// export function AdminDashboard() {
//   const { role } = useAuthStore();
//   const [creditRequests, setCreditRequests] = useState<
//     { id: string; user_id: string; amount: number }[]
//   >([]);

//   useEffect(() => {
//     if (role !== "admin") return;

//     async function fetchRequests() {
//       const { data } = await supabase
//         .from("credit_requests")
//         .select("*")
//         .eq("status", "pending");
//       setCreditRequests(data || []);
//     }

//     fetchRequests();
//   }, [role]);

//   //   async function handleApproval(
//   //     requestId: string,
//   //     userId: string,
//   //     amount: number,
//   //     approve: boolean
//   //   ) {
//   //     const newStatus = approve ? "approved" : "denied";

//   //     await supabase
//   //       .from("credit_requests")
//   //       .update({ status: newStatus })
//   //       .eq("id", requestId);

//   //     if (approve) {
//   //       await supabase
//   //         .from("profiles")
//   //         .update({ credits: supabase.sql`credits + ${amount}` })
//   //         .eq("id", userId);
//   //     }

//   //     setCreditRequests((prev) => prev.filter((req) => req.id !== requestId));
//   //   }
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
//       await supabase.rpc("increment_credits", { user_id: userId, amount });
//     }

//     setCreditRequests((prev) => prev.filter((req) => req.id !== requestId));
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold">Admin Dashboard</h2>

//       {creditRequests.length === 0 ? (
//         <p>No pending requests</p>
//       ) : (
//         <table className="w-full mt-4 border">
//           <thead>
//             <tr>
//               <th className="border p-2">User ID</th>
//               <th className="border p-2">Amount</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {creditRequests.map((req) => (
//               <tr key={req.id} className="border">
//                 <td className="border p-2">{req.user_id}</td>
//                 <td className="border p-2">{req.amount}</td>
//                 <td className="border p-2">
//                   <button
//                     onClick={() =>
//                       handleApproval(req.id, req.user_id, req.amount, true)
//                     }
//                     className="bg-green-500 text-white px-2 py-1 mx-1"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleApproval(req.id, req.user_id, req.amount, false)
//                     }
//                     className="bg-red-500 text-white px-2 py-1 mx-1"
//                   >
//                     Deny
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";

// Define the interface for credit requests
interface CreditRequest {
  id: string;
  user_id: string;
  amount: number;
  status?: string; // Optional since it might not always be present in payload
}

export function AdminDashboard() {
  const { role } = useAuthStore();
  const [creditRequests, setCreditRequests] = useState<CreditRequest[]>([]);

  useEffect(() => {
    if (role !== "admin") return;

    async function fetchRequests() {
      const { data, error } = await supabase
        .from("credit_requests")
        .select("*")
        .eq("status", "pending");
      if (error) {
        console.error("Error fetching requests:", error.message);
      } else {
        setCreditRequests(data || []);
      }
    }

    fetchRequests();

    // Real-time subscription for credit requests
    const subscription = supabase
      .channel("credit_requests")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "credit_requests" },
        (payload) => {
          const newRequest = payload.new as CreditRequest;
          if (newRequest.status === "pending") {
            setCreditRequests((prev) => [...prev, newRequest]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "credit_requests" },
        (payload) => {
          const updatedRequest = payload.new as CreditRequest;
          if (updatedRequest.status !== "pending") {
            setCreditRequests((prev) =>
              prev.filter((req) => req.id !== updatedRequest.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [role]);

  async function handleApproval(requestId: string, approve: boolean) {
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error("No active session");

      const response = await fetch(
        `http://localhost:8000/api/credit-requests/${requestId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ approve }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to process request");
      }

      // Remove the request locally (subscription will handle this too)
      setCreditRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error: unknown) {
      console.error("Error processing request:", (error as Error).message);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      {role !== "admin" ? (
        <p>Access denied. Admin only.</p>
      ) : creditRequests.length === 0 ? (
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
                    onClick={() => handleApproval(req.id, true)}
                    className="bg-green-500 text-white px-2 py-1 mx-1"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(req.id, false)}
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
