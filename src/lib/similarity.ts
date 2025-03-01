import { supabase } from "../lib/supabase";


export function jaccardSimilarity(text1: string, text2: string): number {
    const set1 = new Set(text1.toLowerCase().split(/\s+/));
    const set2 = new Set(text2.toLowerCase().split(/\s+/));
  
    const intersection = new Set([...set1].filter(word => set2.has(word)));
    const union = new Set([...set1, ...set2]);

    if (union.size === 0) return 0;
    // Avoid division by zero
    const similarityScore = intersection.size / union.size; 
    // Always between 0 and 1

    console.log(`Jaccard similarity: ${similarityScore} (${text1.slice(0, 20)}... vs ${text2.slice(0, 20)}...)`);

    return similarityScore;
  }



function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}
export async function getMatchingDocuments(docId: string) {
    // Get the document content
    const { data: targetDoc, error } = await supabase
      .from("documents")
      .select("content")
      .eq("id", docId)
      .single();
  
    if (error || !targetDoc) return [];
  
    // Get all documents EXCEPT the uploaded one
    const { data: allDocs, error: fetchError } = await supabase
      .from("documents")
      .select("id, content")
      .neq("id", docId); // ✅ Exclude the uploaded document
  
    if (fetchError || !allDocs) return [];
  
    // Compare using Levenshtein distance
    const matches = allDocs.map((doc) => ({
      id: doc.id,
      similarity: levenshtein(targetDoc.content, doc.content),
    }));
  
    // Sort by similarity (ascending)
    return matches.sort((a, b) => a.similarity - b.similarity);
  }
  