// import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// // Initialize Supabase client
// const supabase = createClient(
//   Deno.env.get("SUPABASE_URL")!,
//   Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
// );

// function levenshtein(a: string, b: string): number {
//   const dp = Array.from({ length: a.length + 1 }, () =>
//     Array(b.length + 1).fill(0)
//   );

//   for (let i = 0; i <= a.length; i++) dp[i][0] = i;
//   for (let j = 0; j <= b.length; j++) dp[0][j] = j;

//   for (let i = 1; i <= a.length; i++) {
//     for (let j = 1; j <= b.length; j++) {
//       dp[i][j] =
//         a[i - 1] === b[j - 1]
//           ? dp[i - 1][j - 1]
//           : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
//     }
//   }
//   return dp[a.length][b.length];
// }

// async function getMatchingDocuments(docId: string) {
//   const { data: targetDoc, error } = await supabase
//     .from("documents")
//     .select("content")
//     .eq("id", docId)
//     .single();

//   if (error || !targetDoc) return [];

//   const { data: allDocs } = await supabase
//     .from("documents")
//     .select("id, content");

//   if (!allDocs) return [];

//   const matches = allDocs.map((doc) => ({
//     id: doc.id,
//     similarity: levenshtein(targetDoc.content, doc.content),
//   }));

//   return matches.sort((a, b) => a.similarity - b.similarity);
// }

// serve(async (req) => {
//   const { searchParams } = new URL(req.url);
//   const docId = searchParams.get("docId");

//   if (!docId) {
//     return new Response(JSON.stringify({ error: "Missing document ID" }), {
//       status: 400,
//     });
//   }

//   const matches = await getMatchingDocuments(docId);
//   return new Response(JSON.stringify(matches), {
//     headers: { "Content-Type": "application/json" },
//   });
// });
