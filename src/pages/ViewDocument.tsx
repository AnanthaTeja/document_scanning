import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useParams } from "react-router-dom";

export function ViewDocument() {
  const { id } = useParams();
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocument() {
      if (!id) return;

      const { data, error } = await supabase
        .from("documents")
        .select("content")
        .eq("id", id)
        .single();
      if (error) {
        setContent("Error loading document.");
      } else {
        setContent(data.content);v
      }
    }

    fetchDocument();
  }, [id]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">View Document</h2>
      <pre className="border p-4 bg-gray-50 mt-4 whitespace-pre-wrap">
        {content}
      </pre>
    </div>
  );
}
