import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './Taskmanager.css';

// Initialize Firebase (replace with your own config)
const firebaseConfig = {
  // Your Firebase configuration here
  apiKey: "AIzaSyA8bcz1njXntCAZIgiT2srWkAij6z9dMUs",
  authDomain: "taskmanager-c10ce.firebaseapp.com",
  projectId: "taskmanager-c10ce",
  storageBucket: "taskmanager-c10ce.appspot.com",
  messagingSenderId: "71489688647",
  appId: "1:71489688647:web:e1cd9b4375163d058dcd62"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TaskManager = () => {
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState({ name: '', deadline: '', department: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [alertFiles, setAlertFiles] = useState([]);

  useEffect(() => {
    loadFiles();
    const interval = setInterval(checkDeadlines, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const loadFiles = async () => {
    const filesCollection = collection(db, 'files');
    const filesSnapshot = await getDocs(filesCollection);
    const filesList = filesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setFiles(filesList);
    checkDeadlines(filesList);
  };

  const addFile = async () => {
    if (newFile.name && newFile.deadline && newFile.department) {
      const uploadDate = new Date().toISOString().split('T')[0];
      await addDoc(collection(db, 'files'), { ...newFile, uploadDate });
      setNewFile({ name: '', deadline: '', department: '' });
      loadFiles();
    }
  };

  const deleteFile = async (fileId) => {
    await deleteDoc(doc(db, 'files', fileId));
    loadFiles();
  };

  const isUrgent = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 2 && daysDiff > 0;
  };

  const isPastDue = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    return deadlineDate < today;
  };

  const checkDeadlines = (fileList = files) => {
    const urgentFiles = fileList.filter(file => isUrgent(file.deadline));
    if (urgentFiles.length > 0) {
      setAlertFiles(urgentFiles);
      setShowAlert(true);
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="file-manager">
      <h1>File Deadline Manager</h1>
      <div className="file-input">
        <input
          type="text"
          placeholder="File name"
          value={newFile.name}
          onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
        />
        <input
          type="date"
          value={newFile.deadline}
          onChange={(e) => setNewFile({ ...newFile, deadline: e.target.value })}
        />
        <input
          type="text"
          placeholder="Department"
          value={newFile.department}
          onChange={(e) => setNewFile({ ...newFile, department: e.target.value })}
        />
        <button onClick={addFile}>Add File</button>
      </div>
      <div className="file-list">
        <div className="file-header">
          <span>File Name</span>
          <span>Deadline</span>
          <span>Upload Date</span>
          <span>Department</span>
          <span>Action</span>
        </div>
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${
              isPastDue(file.deadline)
                ? 'past-due'
                : isUrgent(file.deadline)
                ? 'urgent'
                : ''
            }`}
          >
            <span>{file.name}</span>
            <span>{formatDate(file.deadline)}</span>
            <span className="upload-date">{formatDate(file.uploadDate)}</span>
            <span>{file.department}</span>
            <button onClick={() => deleteFile(file.id)}>Delete</button>
          </div>
        ))}
      </div>
      {showAlert && (
        <div className="alert-overlay">
          <div className="alert-modal">
            <h2>Urgent Files Alert</h2>
            <p>The following files are due within 2 days:</p>
            <ul>
              {alertFiles.map((file) => (
                <li key={file.id}>{file.name} - Due: {formatDate(file.deadline)}</li>
              ))}
            </ul>
            <button onClick={() => setShowAlert(false)}>Acknowledge</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;