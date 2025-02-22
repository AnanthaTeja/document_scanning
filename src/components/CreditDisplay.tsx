// import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";
// import { Bolt } from "lucide-react";

// export function CreditDisplay({ userId }: { userId: string }) {
//   const [credits, setCredits] = useState<number | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [requestedAmount, setRequestedAmount] = useState(10);

//   // Fetch user credits
//   useEffect(() => {
//     async function fetchCredits() {
//       if (!userId) return;
//       const { data, error } = await supabase
//         .from("users")
//         .select("credits")
//         .eq("id", userId)
//         .single();

//       if (error) {
//         console.error("Error fetching credits:", error.message);
//       } else {
//         setCredits(data?.credits ?? 0);
//       }
//     }
//     fetchCredits();
//   }, [userId]);

//   // Handle credit request
//   async function requestCredits() {
//     if (!userId) return;

//     const { error } = await supabase
//       .from("credit_requests")
//       .insert([
//         { user_id: userId, amount: requestedAmount, status: "pending" },
//       ]);

//     if (error) {
//       console.error("Error requesting credits:", error.message);
//       alert("Failed to request credits. Please try again.");
//     } else {
//       setShowModal(false);
//       alert("Credit request submitted!");
//     }
//   }

//   return (
//     <div>
//       {/* Credit Display Button */}
//       <button
//         onClick={() => setShowModal(true)}
//         className="flex items-center bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
//       >
//         <Bolt className="h-5 w-5 text-yellow-500 mr-1" />
//         {credits !== null ? credits : "Loading..."}
//       </button>

//       {/* Credit Request Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-lg font-bold">Request More Credits</h2>
//             <p className="text-gray-600 text-sm mb-4">
//               Enter the number of credits you need:
//             </p>

//             <input
//               type="number"
//               value={requestedAmount}
//               onChange={(e) => setRequestedAmount(Number(e.target.value))}
//               className="w-full border px-3 py-2 rounded-md"
//               min="1"
//             />

//             <div className="flex justify-end mt-4">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="text-gray-500 px-3 py-2 mr-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={requestCredits}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md"
//               >
//                 Request
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";
import { Bolt } from "lucide-react";

export function CreditDisplay() {
  const { user, credits, refreshCredits } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [requestedAmount, setRequestedAmount] = useState(10);
  const [loading, setLoading] = useState(false);

  async function requestCredits() {
    if (!user || loading) return;

    setLoading(true); // Show loading state to prevent multiple clicks

    const { error } = await supabase
      .from("credit_requests")
      .insert([
        { user_id: user.id, amount: requestedAmount, status: "pending" },
      ]);

    if (error) {
      alert("Error requesting credits: " + error.message);
    } else {
      alert("Credit request sent!");
      setShowModal(false); // ✅ Close modal after request
      await refreshCredits(); // ✅ Refresh credits after request
    }

    setLoading(false); // Reset loading state
  }

  return (
    <div>
      {/* Credits Display Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
      >
        <Bolt className="h-5 w-5 text-yellow-500 mr-1" />
        {credits !== null ? credits : "Loading..."}
      </button>

      {/* Credit Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold">Request More Credits</h2>
            <p className="text-gray-600 text-sm mb-4">
              Enter the number of credits you need:
            </p>

            <input
              type="number"
              value={requestedAmount}
              onChange={(e) => setRequestedAmount(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded-md"
              min="1"
            />

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 px-3 py-2 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={requestCredits}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading} // Disable button when loading
              >
                {loading ? "Requesting..." : "Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
