import { useState } from 'react';

const TaskForm = ({ onTaskSubmit }) => {
  const [task, setTask] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task, id: Math.random().toString(36).substr(2, 9), status: 'pending' , createdAt: new Date() }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const newTask = await res.json();
      onTaskSubmit(newTask);
      setTask('');
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
          value={task.task}
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
    flex-direction: column; /* Stack input and button vertically */
    align-items: center; /* Center items horizontally */
    justify-content: center; /* Center items vertically */
    width: 100%; 
    max-width: 810px; /* Add a max width for better design */
    margin: 0 auto; /* Center form in the container */
  }

  .inputBox {
    width: 100%; /* Make the input take up the full width of its container */
    padding: 0.75rem;
    margin-bottom: 1rem; /* Space between input and button */
    border: 1px solid #495464; /* Simple black border */
    border-radius: 0; /* No rounded corners for a sharp, modern look */
    font-size: 1.25rem; /* Slightly larger for readability */
    color: #000; /* Black text */
    background-color: #fff; /* White background */
    box-sizing: border-box; /* Ensure padding is inside the width */
  }

  .inputBox::placeholder {
    color: #999; /* Light gray placeholder for a subtle effect */
  }

  button {
    width: 100%; /* Make the button the same width as the input */
    padding: 0.75rem;
    background-color: #495464; /* Solid black button */
    color: #fff; /* White text */
    border: none; /* Remove borders */
    border-radius: 0; /* No rounded corners for a modern look */
    font-size: 1.25rem; /* Match the font size of the input */
    cursor: pointer;
  }

  button:hover {
    background-color: #333; /* Slightly lighter black for hover */
  }
`}</style>

  </div>
  
    
  );
};

export default TaskForm;
