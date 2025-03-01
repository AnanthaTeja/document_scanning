import { supabase } from "../lib/supabase";

// Tokenize text (remove stopwords, lowercase, split)
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .split(/\s+/)
    .filter(word => word.length > 2); // Remove small words
}

// Store document in the inverted index
export async function storeInvertedIndex(docId: string, content: string) {
  const tokens = tokenize(content);

  // Convert each word into an object
  const indexEntries = tokens.map(word => ({ word, doc_id: docId }));

  if (indexEntries.length === 0) {
    console.log("No valid words to insert into the index.");
    return;
  }

  // Insert multiple rows at once
  const { error } = await supabase
    .from("inverted_index")
    .upsert(indexEntries, { onConflict: "word, doc_id" });

  if (error) {
    console.error("Error inserting into inverted index:", error.message);
  } else {
    console.log(`Inverted Index updated for document ${docId}`);
  }
}
