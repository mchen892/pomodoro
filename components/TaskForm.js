import { useState } from 'react';

// Utility functions to get and set username in localStorage
export function getUsernameFromBrowser() {
  // Check if username already exists in localStorage
  return localStorage.getItem('username');
}

export function saveUsernameToBrowser(username) {
  // Save the assigned username in localStorage
  localStorage.setItem('username', username);
}

const TaskForm = ({ onTaskSubmit }) => {
  const [task, setTask] = useState('');

  // Get the username from localStorage
  let browserUsername = getUsernameFromBrowser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task, username: browserUsername, status: 'pending', createdAt: new Date() }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const newTask = await res.json();
      onTaskSubmit(newTask);
      setTask('');

      // If the server returns a new username, save it to localStorage
      if (newTask.username) {
        saveUsernameToBrowser(newTask.username);
      }
    } catch (error) {
      console.error('Failed to submit task:', error);
    }
  };

  return (
    <div className='input'>
      <form onSubmit={handleSubmit} className='form'>
        <input
          type="text"
          className='inputBox'
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter your task"
        />
        <button type="submit">Add Task</button>
      </form>

      <style jsx>{`
        .input {
          margin-top: 40px;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
        }

        .form {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 80%; 
          max-width: 900px;
          margin: 0 auto;
        }

        .inputBox {
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border-radius: 0.75em;
          font-size: 1.25rem;
          color: #000;
          background-color: #fff;
          box-sizing: border-box;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .inputBox::placeholder {
          color: #999;
        }

        button {
          width: 100%;
          padding: 0.5rem;
          background-color: rgba(73, 84, 100, 0.8);
          color: #fff;
          border: none;
          border-radius: 1em;
          font-size: 1.25rem;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        button:hover {
          background-color: #333;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
};

export default TaskForm;
