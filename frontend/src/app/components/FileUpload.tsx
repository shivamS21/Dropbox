import { useState } from 'react';
import axios from 'axios';
import { MongoDBFile } from '@/src/types/FileType';

type FileUploadProps = {
    onUpload: (file: MongoDBFile) => void
}

export default function FileUpload({onUpload}: FileUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File|null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    }
    const handleFileUpload = async () => {
        if (!selectedFile) return;
        console.log('selected file', selectedFile)

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:5001/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log('printing response', response)

            // Map the response data to a MongoDBFile object
            const mongoFile: MongoDBFile = {
                _id: response.data._id,
                name: response.data.name,
                path: response.data.path,
                size: response.data.size,
                mimeType: response.data.mimeType,
            };
            onUpload(mongoFile);
            setSelectedFile(null);
        } catch(e) {
            console.error('Error uploading file:', e);
        }
    }
    return(
        <div>
            <input type="file" onChange={handleFileChange}/>
            <button onClick={handleFileUpload}>Upload</button>
        </div>
    )
}