import { useState } from "react";
import { supabase } from "../lib/supabase";

export function UploadDocument({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);

  async function handleUpload() {
    if (!file) return;

    setScanning(true);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("documents")
      .upload(`docs/${file.name}`, file);

    if (error) {
      alert("Upload failed");
      setScanning(false);
      return;
    }

    // Insert record & scan
    await supabase
      .from("documents")
      .insert([{ user_id: userId, content: data.path }]);

    alert("Document uploaded & scanned!");
    setScanning(false);
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        disabled={!file || scanning}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {scanning ? "Scanning..." : "Upload & Scan"}
      </button>
    </div>
  );
}
