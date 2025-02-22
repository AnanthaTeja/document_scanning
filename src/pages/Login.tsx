// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";

// export function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { signIn } = useAuthStore();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await signIn(email, password);
//       navigate("/dashboard");
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (err) {
//       setError("Invalid email or password");
//     }
//   };

//   return (
//     <div className="min-h-[80vh] flex items-center justify-center">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
//         <div>
//           <h2 className="text-center text-3xl font-extrabold text-gray-900">
//             Sign in to your account
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="email-address" className="sr-only">
//                 Email address
//               </label>
//               <input
//                 id="email-address"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Sign in
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      setTimeout(() => navigate("/dashboard"), 500); // Ensures Zustand updates before redirect
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded p-2 w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded p-2 w-full"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
