// utils/fileService.ts
import axios from "axios";
import { MongoDBFile } from "@/types/FileType";

export const directory = async (directoryName: string, cwd: string): Promise<MongoDBFile> => {
  const response = await axios.post('http://localhost:5001/api/files/create', {
    directoryName,
    cwd,
  });
  return response.data.file;
};
