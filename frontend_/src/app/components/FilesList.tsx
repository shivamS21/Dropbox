import axios from 'axios';
import { MongoDBFile } from '@/types/FileType';

type FileListProps = {
    files: MongoDBFile[];
    onFileClick: (file: MongoDBFile) => void;
};

export default function FileList({ files, onFileClick }: FileListProps) {
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

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Uploaded Files</h2>
            <ul className="space-y-4">
                {files.map((file, index) => (
                    <li key={index} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
                        <div className="flex justify-between items-center">
                            <span 
                                onClick={() => onFileClick(file)} 
                                className="text-blue-500 cursor-pointer hover:underline font-medium"
                            >
                                {file?.name||'shivam'}
                            </span>
                            <button
                                onClick={() => handleDownload(file._id)}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                            >
                                Download
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
