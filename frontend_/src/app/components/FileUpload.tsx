import { useState } from 'react';
import axios from 'axios';

type FileUploadProps = {
    onUpload: (file: any) => void;
};

export default function FileUpload({ onUpload }: FileUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // Trigger the file input
    const handleFileInputClick = () => {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        fileInput?.click();
    };

    // Handle file upload
    const handleFileUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:5001/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUpload(response.data);
            setSelectedFile(null); // Clear the selected file after upload
        } catch (e) {
            console.error('Error uploading file:', e);
        }
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <label
                htmlFor="fileInput"
                className="cursor-pointer bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
                Choose a File
            </label>

            <input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                className="hidden"
            />

            {selectedFile && (
                <div className="mt-4 text-gray-700">
                    <p>Selected File: {selectedFile.name}</p>
                </div>
            )}

            {selectedFile && (
                <button
                    onClick={handleFileUpload}
                    className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                >
                    Upload
                </button>
            )}
        </div>
    );
}
