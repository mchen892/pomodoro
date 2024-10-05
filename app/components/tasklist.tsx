// TaskForm.tsx
import { useState } from 'react';

interface TaskFormProps {
  onTaskSubmit: (task: string) => void;
}

export default function TaskForm({ onTaskSubmit }: TaskFormProps) {
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

// TaskApp.tsx
interface Task {
  id: string;
  task: string;
  status: string;
  createdAt: string;
}

interface TaskAppProps {
  tasks: Task[];
}

export default function TaskApp({ tasks }: TaskAppProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Tasks</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li 
            key={task.id}
            className="p-2 bg-gray-100 rounded flex justify-between"
          >
            <span>{task.task}</span>
            <span className="text-gray-500 text-sm">
              {new Date(task.createdAt).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}