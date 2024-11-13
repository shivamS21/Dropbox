import axios from 'axios';
import { MongoDBFile } from '@/src/types/FileType';

type FileListProps = {
    files: MongoDBFile[]
    onFileClick: (file: MongoDBFile) => void;  // Add the onClick handler to handle file viewing
}

export default function FileList({ files, onFileClick }: FileListProps) {
    const handleDownload = async (id: string) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/files/download/${id}`, {
                responseType: 'blob',
            })

            const contentDisposition = response.headers['content-disposition'];
            const fileName = contentDisposition
                                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                                : 'file';

            const url = window.URL.createObjectURL(new Blob([response.data]));
            console.log(url, response.data);
            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
        } catch(error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <div>
            <h2>Uploaded files</h2>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>
                        <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => onFileClick(file)}>
                            {file.name}
                        </span>
                        <button onClick={() => handleDownload(file._id)}>Download</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
