// import { useEffect, useState } from "react";
// import { useAuthStore } from "../store/authStore";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../lib/supabase";

// export function Admin() {
//   const { user, role } = useAuthStore();
//   const navigate = useNavigate();
//   interface CreditRequest {
//     id: number;
//     user_id: string;
//     amount: number;
//     status: string;
//     created_at: string;
//   }

//   const [creditRequests, setCreditRequests] = useState<CreditRequest[]>([]);

//   useEffect(() => {
//     if (!user || role !== "admin") {
//       navigate("/dashboard");
//     }

//     async function fetchCreditRequests() {
//       const { data, error } = await supabase
//         .from("credit_requests")
//         .select("*")
//         .eq("status", "pending");

//       if (error) {
//         console.error("Error fetching credit requests:", error);
//         return;
//       }

//       setCreditRequests(data || []); // Ensure data is never null
//     }

//     fetchCreditRequests();
//   }, [user, role, navigate]);

//   //   async function handleApproval(requestId: number, approve: boolean) {
//   //     const newStatus = approve ? "approved" : "denied";

//   //     await supabase
//   //       .from("credit_requests")
//   //       .update({ status: newStatus })
//   //       .eq("id", requestId);

//   //     if (approve) {
//   //       const { data, error } = await supabase
//   //         .from("credit_requests")
//   //         .select("user_id, amount")
//   //         .eq("id", requestId)
//   //         .single();

//   //       if (error || !data) {
//   //         console.error("Error fetching credit request:", error);
//   //         return;
//   //       }

//   //       await supabase
//   //         .from("profiles")
//   //         .update({ credits: data.amount }) // Set to new value
//   //         .eq("id", data.user_id);
//   //     }

//   //     setCreditRequests((prev) => prev.filter((req) => req.id !== requestId));
//   //   }
//   async function handleApproval(requestId: number, approve: boolean) {
//     const newStatus = approve ? "approved" : "denied";

//     await supabase
//       .from("credit_requests")
//       .update({ status: newStatus })
//       .eq("id", requestId);

//     if (approve) {
//       const { data, error } = await supabase
//         .from("credit_requests")
//         .select("user_id, amount")
//         .eq("id", requestId)
//         .single();

//       if (error || !data) {
//         console.error("Error fetching credit request:", error);
//         return;
//       }

//       // Fetch current credits
//       const { data: profile, error: profileError } = await supabase
//         .from("profiles")
//         .select("credits")
//         .eq("id", data.user_id)
//         .single();

//       if (profileError || !profile) {
//         console.error("Error fetching profile:", profileError);
//         return;
//       }

//       const newCredits = profile.credits + data.amount;

//       await supabase
//         .from("profiles")
//         .update({ credits: newCredits })
//         .eq("id", data.user_id);
//     }

//     setCreditRequests((prev) => prev.filter((req) => req.id !== requestId));
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold">Admin Panel</h2>

//       {creditRequests.length === 0 ? (
//         <p>No pending requests</p>
//       ) : (
//         <table className="w-full mt-4">
//           <thead>
//             <tr>
//               <th>User ID</th>
//               <th>Amount</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {creditRequests.map((req) => (
//               <tr key={req.id}>
//                 <td>{req.user_id}</td>
//                 <td>{req.amount}</td>
//                 <td>
//                   <button
//                     onClick={() => handleApproval(req.id, true)}
//                     className="bg-green-500 text-white px-2 py-1 mx-1"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => handleApproval(req.id, false)}
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

// ==========================================================================================

// import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";
// import { useAuthStore } from "../store/authStore";

// export function Admin() {
//   const { user, role } = useAuthStore();
//   const [creditRequests, setCreditRequests] = useState([]);

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

//   async function handleApproval(
//     requestId: string,
//     userId: string,
//     amount: number,
//     approve: boolean
//   ) {
//     const newStatus = approve ? "approved" : "denied";

//     // Update request status
//     await supabase
//       .from("credit_requests")
//       .update({ status: newStatus })
//       .eq("id", requestId);

//     if (approve) {
//       // Grant credits
//       await supabase
//         .from("profiles")
//         .update({ credits: supabase.raw("credits + ?", [amount]) })
//         .eq("id", userId);
//     }

//     // Remove from UI
//     setCreditRequests((prev) => prev.filter((req) => req.id !== requestId));
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold">Admin Panel</h2>

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
