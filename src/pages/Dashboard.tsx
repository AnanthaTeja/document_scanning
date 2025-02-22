// import { useAuthStore } from "../store/authStore";

// export function Dashboard() {
//   const { user } = useAuthStore();

//   return (
//     <div className="space-y-6">
//       <div className="bg-white shadow-sm rounded-lg p-6">
//         <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
//         <p className="mt-2 text-gray-600">Email: {user?.email}</p>
//       </div>
//     </div>
//   );
// }

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function Dashboard() {
  const { user, role } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome {role === "admin" ? "Admin" : "User"}!
        </h2>
        <p className="mt-2 text-gray-600">Email: {user?.email}</p>

        {role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Go to Admin Panel
          </button>
        )}
      </div>
    </div>
  );
}
