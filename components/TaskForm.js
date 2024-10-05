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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={task.task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter your task"
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
