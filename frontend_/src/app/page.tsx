'use client';
import { useEffect, useState } from "react";
import axios from 'axios';
import FileUpload from "./components/FileUpload";
import FilesList from "./components/FilesList";
import CreateDirectory from "./components/CreateDirectory";
import { MongoDBFile } from "../types/FileType";

const allowedFileTypes = ['image/jpeg', 'image/png', 'application/json', 'image/gif', 'application/pdf'];

export default function Home() {
  const [files, setFiles] = useState<MongoDBFile[]>([]);
  const [cwd, setCwd] = useState<string>("/");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/files");
        const sortedFiles = response.data.sort((a: MongoDBFile, b: MongoDBFile) => {
          // Place folders before files
          return a.isFile === b.isFile ? 0 : a.isFile ? 1 : -1;
        });
        setFiles(sortedFiles);
      } catch (e) {
        console.error("Error fetching files:", e);
      }
    };

    fetchFiles();
  }, [cwd]); // Fetch files whenever cwd changes

  const handleFileUpload = (newFile: MongoDBFile) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, newFile];
      // Re-sort to place directories first
      return updatedFiles.sort((a, b) => (a.isFile === b.isFile ? 0 : a.isFile ? 1 : -1));
    });
  };

  const handleFileDelete = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id));
  };

  const handleFileOpen = (file: MongoDBFile) => {
    if (allowedFileTypes.includes(file.mimeType)) {
      const fileUrl = `http://localhost:5001/api/files/${file._id}`;
      window.open(fileUrl, "_blank"); // Opens the file in a new tab
    } else {
      alert("This file format cannot be viewed.");
    }
  };

  const handleDirectoryClick = (directory: MongoDBFile) => {
    setCwd((prevCwd) => `${prevCwd}${directory.name}/`); // Update current working directory
  };

  const handleBackClick = () => {
    setCwd((prevCwd) => {
      const pathSegments = prevCwd.split('/').filter(Boolean); 
      pathSegments.pop(); // Remove last segment (current directory)
      return '/' + pathSegments.join('/') + (pathSegments.length > 0 ? '/' : ''); 
    });
  };

  const getFilteredFiles = () => {
    return files.filter((file) => file.directory === cwd);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="fixed top-0 left-0 w-full h-20 bg-black flex flex-col justify-center items-center z-10">
        <h1 className="text-white text-4xl">Dropbox</h1>
      </div>

      <div className="bg-cyan-50 pt-12 overflow-y-auto" style={{ height: "calc(100vh - 80px)" }}>
        <div className="flex justify-center items-center space-x-4 mt-1">
          <FileUpload onUpload={handleFileUpload} cwd={cwd} />
        </div>

        {/* added functionality */}
        <div className="flex justify-end items-center mt-4 mr-4">
          <CreateDirectory files={files} cwd={cwd} onUpload={handleFileUpload} />
        </div>

        <div className="flex justify-start items-center ml-4 mt-2">
          <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            disabled={cwd === '/'} // Disable back button if already at root directory
          >
            Back
          </button>
        </div>

        <FilesList
          files={getFilteredFiles()}
          onFileClick={handleFileOpen}
          onDirectoryClick={handleDirectoryClick}
          onFileDelete={handleFileDelete}
        />
      </div>
    </div>
  );
}
