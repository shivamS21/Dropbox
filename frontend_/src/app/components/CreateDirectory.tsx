'use client'; // Ensure this is a client component

import { useState } from "react";
import { MongoDBFile } from "@/types/FileType";
import { directory } from "@/utils/fileService";

type CreateDirectoryProps = {
  files: MongoDBFile[];
  cwd: string;
  onUpload: (file: MongoDBFile) => void;
};

export default function CreateDirectory({ files, cwd, onUpload }: CreateDirectoryProps) {
  const [directoryName, setDirectoryName] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirectoryName(e.target.value);
    console.log(e.target.value);
  };

  const handleDirectoryCreation = async () => {
    try {
      const newFile = await directory(directoryName, cwd);
      onUpload(newFile); // update folder (as file)
    } catch (error) {
      console.error("Error creating directory:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 mr-10">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={directoryName}
          onChange={handleInputChange}
          placeholder="Enter directory name"
          className="border border-gray-300 px-4 py-2 rounded-lg w-72"
        />
        <button
          onClick={handleDirectoryCreation}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        >
          Create Directory
        </button>
      </div>
    </div>
  );
}
