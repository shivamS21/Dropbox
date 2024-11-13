'use client';
import { useEffect, useState } from "react";
import axios from 'axios';
import FileUpload from "./components/FileUpload";
import FilesList from "./components/FilesList";
import { MongoDBFile } from "../types/FileType";
import { useRouter } from "next/navigation";

const allowedFileTypes = ['text/plain', 'image/jpeg', 'image/png', 'application/json'];

export default function Home() {
  const [files, setFiles] = useState<MongoDBFile[]>([]);
  const router = useRouter();

  useEffect(() => {
    const filesFetched = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/files");
        setFiles(response.data);
      } catch (e) {
        console.error("Error fetching files:", e);
      }
    }

    filesFetched();
  }, []);

  const handleFileUpload = (newFile: MongoDBFile) => {
    setFiles((prevFiles) => [...prevFiles, newFile]);
  };

  const handleFileClick = (file: MongoDBFile) => {
    // Check if the file type is allowed to be displayed in the browser
    if (allowedFileTypes.includes(file.mimeType)) {
      // For viewable files (like .txt, .jpg, .png, .json), open the file in a new tab
      router.push(`/file/${file._id}`);
    } else {
      // For unsupported files, either show an alert or download them
      alert('This file format cannot be viewed directly.');
    }
  };

  return (
    <div className="flex flex-col justify-center gap-10 bg-black p-4">
      <h1 className="text-white text-xl">Dropbox</h1>
      <FileUpload onUpload={handleFileUpload} />
      <FilesList files={files} onFileClick={handleFileClick} />
    </div>
  );
}
