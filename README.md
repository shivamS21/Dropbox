# Dropbox Application

## Project Description

This project implements a simplified Dropbox-like web application where users can upload, download, and view files. It provides a user-friendly interface to interact with a backend server via RESTful APIs to perform file management tasks.

## Features

### Backend Features:
- **Upload File**: API to upload a file.
- **Get List of All Files**: API to retrieve a list of all uploaded files.
- **Download File**: API to download a file by ID.
- **Open File**: API to view the file contents in a new tab (only for supported file types).

### Frontend Features:
- **User Home Page**: Displays a list of all user files.
  - Supports file upload restrictions.
- **Upload New File**: A button to allow users to upload files.
- **View File**: Clicking a file opens the file contents in a new tab (only for supported file types).
  - Supported file types: `txt`, `jpg`, `jpeg`, `png`, `json`, `pdf`, `gif`.

## Technologies Used

### Backend:
- **Language & Framework**: Node.js with Express (JavaScript)
- **Database**: MongoDB
- **File Upload Handling**: Multer (for file uploads)
- **File Storage**: Local file system

### Frontend:
- **Language & Framework**: Next.js (TypeScript)
- **UI Library**: Tailwind CSS

## Installation and Setup

### Prerequisites:
- Node.js (v14.x or higher)
- MongoDB (locally or using Docker)
- npm (Node Package Manager)

### Steps to Run the Project:

1. **Clone the Repository**:
    ```bash
    git clone [<repository_url>](https://github.com/shivamS21/dropbox.git)
    cd dropbox
    ```

2. **Install Backend Dependencies**:
    - Navigate to the `backend` directory and install the required dependencies:
    ```bash
    cd backend
    npm install
    ```

3. **Set Up MongoDB**:
    - Create MongoDB cluster and put its CONNECTION_STRING in .env file.
    - Add PORT = 5001 in .env.

4. **Start the Backend Server**:
    - In the `backend` directory, run the following command:
    ```bash
    npm start
    ```
    This will start the backend server on `http://localhost:5001`.

5. **Install Frontend Dependencies**:
    - Navigate to the `frontend_` directory and install the required dependencies:
    ```bash
    cd ../frontend_
    npm install
    ```

6. **Start the Frontend Development Server**:
    - In the `frontend_` directory, run the following command:
    ```bash
    npm run dev
    ```
    This will start the frontend development server on `http://localhost:3000`.

7. **Open the Application**:
    - Open your browser and go to `http://localhost:3000` to access the application.
    - You can now upload, download, and view files.

## File Upload Restrictions

- The following file types are supported for upload: 
  - `jpeg`, `jpeg`, `jpg`, `png`, `gif`, `pdf`, and `json`.
- Files of other types will not be accepted for upload.

### File Viewing

- The following file types are allowed to be opened in a new tab:
  - `jpeg`, `jpeg`, `jpg`, `png`, `gif`, `pdf`, and `json`.
- Unsupported file types will prompt an alert that the file cannot be viewed directly.

## API Endpoints

### Upload a File
- **POST /api/files/upload**
  - Allows users to upload a file.
  - File type restrictions apply.

### Get All Files
- **GET /api/files**
  - Retrieves a list of all files.

### Download a File
- **GET /api/files/download/:id**
  - Allows users to download a file by ID.

### Open File in a New Tab
- **GET /api/files/:id**
  - Allows users to view the file contents in a new tab (for supported file types).

## Backend File Upload Handling

- File uploads are handled using [Multer](https://www.npmjs.com/package/multer), which stores the files in a local directory (`uploads/`) on the server.
- Upload file restrictions are enforced based on MIME type and file extension, allowing only specific formats (e.g., jpeg, png, gif, pdf, json).

## License

MIT License - Feel free to fork, modify, and use this project!

---

Thank you for using this Dropbox-like application. Enjoy managing your files!
