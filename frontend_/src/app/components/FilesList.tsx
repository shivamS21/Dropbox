import axios from 'axios';
import { MongoDBFile } from '@/types/FileType';

type FileListProps = {
  files: MongoDBFile[];
  onFileClick: (file: MongoDBFile) => void;
  onDirectoryClick: (directory: MongoDBFile) => void;
  onFileDelete: (id: string) => void;
};

export default function FileList({ files, onFileClick, onDirectoryClick, onFileDelete }: FileListProps) {
  const handleDownload = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/files/download/${id}`, {
        responseType: 'blob',
      });

      const contentDisposition = response.headers['content-disposition'];

      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'file';

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/files/delete/${id}`);
      onFileDelete(id);
    } catch (error) {
      console.error('Error deleting the file:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Files and Folders</h2>
      <ul className="space-y-4">
        {files.map((file, index) => (
          <li
            key={index}
            className={`p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out ${
              file.isFile
                ? 'bg-white'
                : 'bg-yellow-100 text-yellow-700' // Styling directories differently
            }`}
          >
            <div className="flex justify-between items-center">
              <span
                onClick={() => (file.isFile ? onFileClick(file) : onDirectoryClick(file))}
                className={`cursor-pointer font-medium ${
                  file.isFile ? 'text-blue-500 hover:underline' : 'text-yellow-700 hover:underline'
                }`}
              >
                {file.name || 'file_uploaded'}
              </span>

              <div className="flex gap-2">
                {file.isFile && (
                  <button
                    onClick={() => handleDownload(file._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                  >
                    Download
                  </button>
                )}
                <button
                  onClick={() => handleDelete(file._id)}
                  className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
