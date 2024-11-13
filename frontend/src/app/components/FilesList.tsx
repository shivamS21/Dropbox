import axios from 'axios';

type FileListProps = {
    files: File[]
}
export default function FileList({ files }: FileListProps) {
    const handleDownload = async (id: string) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/download/${id}`, {
                responseType: 'blob',
            })
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', 'file');
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
        } catch(error) {
            console.error('Error downloading file:', error)
        }
    }
    return (
        <div>
            <h2>Uploaded files</h2>
            <ul>
                {files.map((file) => (
                    <li key={file._id}>
                        {file.name}
                        <button onClick={()=> handleDownload(file._id)}>Download</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}