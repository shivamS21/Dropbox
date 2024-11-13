import { useState } from 'react';
import axios from 'axios';

type FileUploadProps = {
    onUpload: (file: any) => void
}

export default function FileUpload({onUpload}: FileUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File|null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    }
    const handleFileUpload = async () => {
        console.log('hi')
        if (!selectedFile) return;
        console.log('hi2')

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            onUpload(response.data);
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