'use client';
import { useEffect, useState } from "react";
import axios from 'axios';
import FileUpload from "./components/FileUpload";
import FilesList from "./components/FilesList";
import { MongoDBFile } from "../types/FileType";
import { useRouter } from "next/navigation";

const allowedFileTypes = ['image/jpeg', 'image/png', 'application/json', 'image/gif', 'application/pdf'];

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
    if (allowedFileTypes.includes(file.mimeType)) {
      // Assuming the server has a route to serve files by their ID
      const fileUrl = `http://localhost:5001/api/files/${file._id}`;
      window.open(fileUrl, "_blank"); // Opens the file in a new tab
    } else {
      alert('This file format cannot be viewed directly.');
    }
  };
  

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="fixed top-0 left-0 w-full h-20 bg-black flex flex-col justify-center items-center z-10">
        <h1 className="text-white text-4xl">Dropbox</h1>
      </div>
      <div className="bg-cyan-50 pt-24 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
        <div className="text-black text-xl flex flex-col items-center pt-2">
          Store your files with safety.
        </div>
        <FileUpload onUpload={handleFileUpload} />
        <FilesList files={files} onFileClick={handleFileClick} />
      </div>
    </div>
  );
}
