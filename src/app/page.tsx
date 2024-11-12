'use client';
import { useState } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File|null>(null);
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('shivam', selectedFile)
    
    if (!selectedFile) return;

    const formData = new FormData();
    console.log(formData)
  }
  return (
    <div className="flex justify-center">
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0]: null)}/>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
