import { useEffect, useState } from 'react';

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
       
        try{
           const res = await fetch('/api/tasks');
           const data = await res.json();
            setCompletedTasks(data);
        }catch (error) {
            console.error('Failed to fetch tasks:', error);
          }
      
    };
    fetchCompletedTasks();
  }, []);

  return (
    <div className="completed-tasks">
      {completedTasks.map((task) => (
        <div key={task.id} className="task bg-gray-100 p-4 rounded-lg mb-4">
          <p className="font-bold">{task.task}</p>
          <p className="text-sm text-gray-500">{new Date(task.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CompletedTasks;
