import { supabase } from "../lib/supabase";
import { jaccardSimilarity } from "../lib/similarity";  // ✅ Import the function

export async function getMatchingDocuments(docId: string) {
  const { data: targetDoc, error } = await supabase
    .from("documents")
    .select("content")
    .eq("id", docId)
    .single();

  if (error || !targetDoc) return [];

  const { data: allDocs, error: fetchError } = await supabase
    .from("documents")
    .select("id, content")
    .neq("id", docId);

  if (fetchError || !allDocs) return [];

  const matches = allDocs.map((doc) => {
    const similarity = jaccardSimilarity(targetDoc.content, doc.content);
    console.log(`Similarity Score: ${similarity} for document ${doc.id}`);
    return { id: doc.id, similarity };
  });

  return matches.sort((a, b) => b.similarity - a.similarity);
}
