import { useEffect, useState } from 'react';

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]); // No TypeScript here
  const [error, setError] = useState(null); // Use null initially for errors

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const res = await fetch('/api/tasks');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setCompletedTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        setError('Failed to fetch completed tasks.');
      }
    };

    fetchCompletedTasks();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>; // Display error if fetch fails
  }

  return (
    <div className="completed-tasks">
      {completedTasks.length === 0 ? (
        <p>No completed tasks yet.</p>
      ) : (
        completedTasks.map((task) => (
          <div key={task.id} className="task bg-gray-100 p-4 rounded-lg mb-4">
            <p className="font-bold">{task.task || "Unnamed Task"}</p>
            <p className="text-sm text-gray-500">
              {task.createdAt ? new Date(task.createdAt).toLocaleString() : "No date available"}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default CompletedTasks;
