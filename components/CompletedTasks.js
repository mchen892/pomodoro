import { useEffect, useState, useRef } from 'react';

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [previousTaskCount, setPreviousTaskCount] = useState(0); // Track the previous number of tasks
  const tasksEndRef = useRef(null);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        setCompletedTasks(data);
      } catch (error) {
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

  // Auto-scroll to the bottom only when a new task is added
  useEffect(() => {
    if (completedTasks.length > previousTaskCount) {
      // Scroll to the bottom only if a new task was added
      if (tasksEndRef.current) {
        tasksEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      setPreviousTaskCount(completedTasks.length); // Update task count after scrolling
    }
  }, [completedTasks, previousTaskCount]);

  return (
    <div className="completed-tasks-container">
      <div className="completed-tasks">
        {completedTasks.slice().reverse().map((task) => (
          <div key={task.id} className="task bg-black-100 p-4 rounded-lg mb-4">
            <p className="font-bold">{`${task.username} finished ${task.task}`}</p>
            <p className="text-sm text-black-500">{new Date(task.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {/* Reference for auto-scroll */}
        <div ref={tasksEndRef}></div>
      </div>

      <style jsx>{`
        .completed-tasks-container {
          width: 90%;
          max-height: 85%;
          margin-left: auto;
          margin-right: auto;
          overflow: auto;
          display: flex;
          justify-content: flex-end; /* Align content at the bottom */
          padding: 10px;
        }

        .completed-tasks {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 100%;
        }

        .task {
          background-color: #eeeeee;
          color: #333;
          padding: 0.5em;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }

        .task:hover {
          background-color: #d4edda;
        }

        .task p {
          margin: 0;
          padding: 2px 0;
        }
      `}</style>
    </div>
  );
};

export default CompletedTasks;
