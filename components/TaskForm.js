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
          width: 100%; 
          max-width: 810px;
          margin: 0 auto;
        }

        .inputBox {
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border: 1px solid #495464;
          border-radius: 0;
          font-size: 1.25rem;
          color: #000;
          background-color: #fff;
          box-sizing: border-box;
        }

        .inputBox::placeholder {
          color: #999;
        }

        button {
          width: 100%;
          padding: 0.75rem;
          background-color: #495464;
          color: #fff;
          border: none;
          border-radius: 0;
          font-size: 1.25rem;
          cursor: pointer;
        }

        button:hover {
          background-color: #333;
        }
      `}</style>
    </div>
  );
};

export default TaskForm;
