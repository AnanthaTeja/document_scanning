// import { Outlet, Link } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";
// import { FileSearch } from "lucide-react";

// export function Layout() {
//   const { user, signOut } = useAuthStore();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <nav className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex">
//               <Link to="/" className="flex items-center">
//                 <FileSearch className="h-8 w-8 text-indigo-600" />
//                 <span className="ml-2 text-xl font-bold text-gray-900">
//                   DocScanner
//                 </span>
//               </Link>
//             </div>
//             <div className="flex items-center">
//               {user ? (
//                 <>
//                   <Link
//                     to="/dashboard"
//                     className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
//                   >
//                     Dashboard
//                   </Link>
//                   <button
//                     onClick={() => signOut()}
//                     className="ml-4 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
//                   >
//                     Sign Out
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     to="/login"
//                     className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     to="/register"
//                     className="ml-4 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
//                   >
//                     Register
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <Outlet />
//       </main>
//     </div>
//   );
// }
import { Outlet, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { FileSearch } from "lucide-react";
import { CreditDisplay } from "./CreditDisplay"; // Import the new component

export function Layout() {
  const { user, signOut } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <FileSearch className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  DocScanner
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>

                  {/* Credits Display */}
                  <CreditDisplay />

                  <button
                    onClick={() => signOut()}
                    className="ml-4 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="ml-4 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
