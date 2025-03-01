// import { useState } from "react";
// import { supabase } from "../lib/supabase";
// import { useAuthStore } from "../store/authStore";

// export function UploadDocument() {
//   const { user } = useAuthStore();
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [matches, setMatches] = useState<{ id: string; similarity: number }[]>(
//     []
//   );

//   async function handleUpload() {
//     if (!file || !user) {
//       alert("Please select a file and log in.");
//       return;
//     }

//     setUploading(true);
//     setMessage("");

//     const reader = new FileReader();
//     reader.readAsText(file);
//     reader.onload = async () => {
//       const text = reader.result as string;

//       try {
//         // Upload to Supabase
//         const { data, error } = await supabase
//           .from("documents")
//           .insert([{ user_id: user.id, content: text }])
//           .select("id")
//           .single();

//         if (error) {
//           throw new Error("Error uploading file: " + error.message);
//         }

//         setMessage("File uploaded successfully!");
//         const newDocId = data?.id;
//         console.log("New document ID:", newDocId);

//         if (newDocId) {
//           // Call Django similarity endpoint
//           const similarityResponse = await fetch(
//             "http://localhost:8000/api/similarity/",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({ doc_id: newDocId }),
//             }
//           );

//           const similarityResult = await similarityResponse.json();

//           if (!similarityResponse.ok) {
//             throw new Error(
//               similarityResult.error || "Failed to fetch similarity"
//             );
//           }

//           setMatches(similarityResult.matches || []);
//         }
//       } catch (error) {
//         setMessage(`Error: ${error.message}`);
//       } finally {
//         setUploading(false);
//       }
//     };
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold">Upload Document</h2>
//       <input
//         type="file"
//         accept=".txt"
//         onChange={(e) => setFile(e.target.files?.[0] || null)}
//         className="border p-2 mt-2 w-full"
//       />
//       <button
//         onClick={handleUpload}
//         className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
//         disabled={uploading}
//       >
//         {uploading ? "Uploading..." : "Upload"}
//       </button>
//       {message && <p className="mt-2 text-gray-700">{message}</p>}
//       {matches.length > 0 && (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold">Top 5 Similar Documents</h3>
//           <ul className="mt-2 border p-4 rounded bg-gray-100">
//             {matches
//               .sort((a, b) => b.similarity - a.similarity) // Sort descending
//               .slice(0, 5) // Ensure top 5
//               .map((doc) => (
//                 <li
//                   key={doc.id}
//                   className="mb-2 flex justify-between items-center"
//                 >
//                   <div>
//                     <span className="font-bold">Document ID:</span> {doc.id}{" "}
//                     <span className="ml-4 text-sm text-gray-600">
//                       Similarity: {doc.similarity.toFixed(2)}%
//                     </span>
//                   </div>
//                   <button
//                     onClick={() => window.open(`/view/${doc.id}`, "_blank")}
//                     className="bg-indigo-500 text-white px-3 py-1 rounded text-sm"
//                   >
//                     View
//                   </button>
//                 </li>
//               ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";

export function UploadDocument() {
  const { user, credits, refreshCredits } = useAuthStore((state) => ({
    user: state.user,
    credits: state.credits,
    refreshCredits: state.refreshCredits,
  }));
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [matches, setMatches] = useState<{ id: string; similarity: number }[]>(
    []
  );

  async function handleUpload() {
    if (!file || !user) {
      alert("Please select a file and log in.");
      return;
    }

    if (credits <= 0) {
      setMessage("Error: Insufficient credits");
      return;
    }

    setUploading(true);
    setMessage("");

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async () => {
      const text = reader.result as string;

      try {
        // Upload to Supabase
        const { data, error } = await supabase
          .from("documents")
          .insert([{ user_id: user.id, content: text }])
          .select("id")
          .single();

        if (error) {
          throw new Error("Error uploading file: " + error.message);
        }

        setMessage("File uploaded successfully!");
        const newDocId = data?.id;
        console.log("New document ID:", newDocId);

        if (newDocId) {
          // Call Django similarity endpoint (credits deducted here)
          const similarityResponse = await fetch(
            // "http://localhost:8000/api/similarity/",
            "https://tack.pythonanywhere.com/api/similarity/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ doc_id: newDocId }),
            }
          );

          const similarityResult = await similarityResponse.json();

          if (!similarityResponse.ok) {
            throw new Error(
              similarityResult.error || "Failed to fetch similarity"
            );
          }

          setMatches(similarityResult.matches || []);
          await refreshCredits(); // Refresh credits after backend deduction
          console.log("Credits refreshed after similarity check");
        }
      } catch (error: unknown) {
        setMessage(`Error: ${(error as Error).message}`);
      } finally {
        setUploading(false);
      }
    };
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Upload Document</h2>
      <p className="text-gray-600">Remaining Credits: {credits}</p>
      <input
        type="file"
        accept=".txt"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 mt-2 w-full"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        disabled={uploading || credits <= 0}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {message && <p className="mt-2 text-gray-700">{message}</p>}
      {matches.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Top 5 Similar Documents</h3>
          <ul className="mt-2 border p-4 rounded bg-gray-100">
            {matches
              .sort((a, b) => b.similarity - a.similarity)
              .slice(0, 5)
              .map((doc) => (
                <li
                  key={doc.id}
                  className="mb-2 flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold">Document ID:</span> {doc.id}{" "}
                    <span className="ml-4 text-sm text-gray-600">
                      Similarity: {doc.similarity.toFixed(2)}%
                    </span>
                  </div>
                  <button
                    onClick={() => window.open(`/view/${doc.id}`, "_blank")}
                    className="bg-indigo-500 text-white px-3 py-1 rounded text-sm"
                  >
                    View
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
