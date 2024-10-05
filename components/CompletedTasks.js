import { useEffect, useState } from 'react';

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [userIdentifier, setUserIdentifier] = useState('');

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
    // Polling: fetch tasks every second
    const intervalId = setInterval(() => {
        fetchCompletedTasks();
      }, 1000); // 1 second interval
  
      // Cleanup the interval when component unmounts
      return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        const getIpAddress = async () => {
          try {
            const response = await fetch('/api/get-ip');
            const data = await response.json();
            setUserIdentifier(data.ip); // Set IP address as the unique identifier
          } catch (error) {
            console.error('Failed to fetch IP address:', error);
          }
        };
    
        getIpAddress();
      }, []);

  return (
    <div className="completed-tasks">
      {completedTasks.map((task) => (
        <div key={task.id} className="task bg-black-100 p-4 rounded-lg mb-4">
          <p className="font-bold">{`${task.ipAddress} finished ${task.task}`}</p>
          <p className="text-sm text-black-500">{new Date(task.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CompletedTasks;
