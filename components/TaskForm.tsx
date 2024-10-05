import { useState } from 'react';

interface TaskFormProps {
  onTaskSubmit: (task: string) => void;
}

export default function TaskForm({ onTaskSubmit }: TaskFormProps) {  // This should be the only default export
  const [taskInput, setTaskInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskInput.trim()) {
      onTaskSubmit(taskInput);
      setTaskInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Add a new task"
          className="flex-grow p-2 border rounded-l"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Add
        </button>
      </div>
    </form>
  );
}
