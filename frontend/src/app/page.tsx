'use client';
import { useEffect, useState } from "react";
import axios from 'axios';
import FileUpload from "./components/FileUpload";
import FilesList from "./components/FilesList";
export default function Home() {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(()=>{
    const filesFetched = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/files")
        setFiles(response.data);
      } catch(e) {  
        console.error("Error fetching files:", e);
      }
    }

    filesFetched();
  }, [])
  const handleFileUpload = (newFile: File) => {
    setFiles((prevFiles) => [...prevFiles, newFile]);
  }
  return (
    <div className="flex flex-col justify-center gap-10">
      <h1>Dropbox</h1>
      <FileUpload onUpload={handleFileUpload}/>
      <FilesList files={files}/>
    </div>
  );
}
