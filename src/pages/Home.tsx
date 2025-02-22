// import { Link } from "react-router-dom";
// import { FileSearch, Shield, Clock, BarChart3 } from "lucide-react";
// import { useAuthStore } from "../store/authStore";

// export function Home() {
//   const { user } = useAuthStore();
//   return (
//     <div className="py-12">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
//           Document Scanner & Matcher
//         </h1>
//         <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
//           Scan and match documents with our intelligent system. Get 20 free
//           scans daily.
//         </p>
//         {user ? (
//           <>
//             <h1>Scan </h1>
//           </>
//         ) : (
//           <div>
//             <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
//               <Link
//                 to="/register"
//                 className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
//               >
//                 Get Started
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="mt-24">
//         <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
//           <div className="pt-6">
//             <div className="flow-root bg-white rounded-lg px-6 pb-8">
//               <div className="-mt-6">
//                 <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
//                   <FileSearch className="h-6 w-6 text-white" />
//                 </div>
//                 <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
//                   Smart Document Scanning
//                 </h3>
//                 <p className="mt-5 text-base text-gray-500">
//                   Upload and scan documents with our intelligent system that
//                   matches similar content.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="pt-6">
//             <div className="flow-root bg-white rounded-lg px-6 pb-8">
//               <div className="-mt-6">
//                 <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
//                   <Shield className="h-6 w-6 text-white" />
//                 </div>
//                 <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
//                   Secure Storage
//                 </h3>
//                 <p className="mt-5 text-base text-gray-500">
//                   Your documents are stored securely and accessible only to
//                   authorized users.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="pt-6">
//             <div className="flow-root bg-white rounded-lg px-6 pb-8">
//               <div className="-mt-6">
//                 <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
//                   <Clock className="h-6 w-6 text-white" />
//                 </div>
//                 <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
//                   Daily Free Credits
//                 </h3>
//                 <p className="mt-5 text-base text-gray-500">
//                   Get 20 free document scans every day. Need more? Request
//                   additional credits.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { FileSearch, Shield, Clock } from "lucide-react";
import { useAuthStore } from "../store/authStore";

interface User {
  name: string;
  email: string;
}

export function Home() {
  const { user, signOut } = useAuthStore();

  const features = [
    {
      icon: FileSearch,
      title: "Smart Document Scanning",
      description:
        "Upload and scan documents with our intelligent system that matches similar content.",
    },
    {
      icon: Shield,
      title: "Secure Storage",
      description:
        "Your documents are stored securely and accessible only to authorized users.",
    },
    {
      icon: Clock,
      title: "Daily Free Credits",
      description:
        "Get 20 free document scans every day. Need more? Request additional credits.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl tracking-tight">
          Document Scanner & Matcher
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Scan and match documents with our intelligent system. Get 20 free
          scans daily.
        </p>

        {user ? (
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm font-medium text-gray-500">
                  Scans Available
                </p>
                <p className="mt-2 text-3xl font-bold text-indigo-600">20</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm font-medium text-gray-500">
                  Documents Scanned
                </p>
                <p className="mt-2 text-3xl font-bold text-indigo-600">0</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm font-medium text-gray-500">
                  Matches Found
                </p>
                <p className="mt-2 text-3xl font-bold text-indigo-600">0</p>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={() => (window.location.href = "/scan")}
              >
                Start Scanning
              </button>
              <button
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                onClick={signOut}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 flex justify-center gap-4">
            <button
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              onClick={() => (window.location.href = "/register")}
            >
              Get Started
            </button>
            <button
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => (window.location.href = "/login")}
            >
              Sign In
            </button>
          </div>
        )}
      </div>

      <div className="mt-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
