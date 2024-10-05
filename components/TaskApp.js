const TaskList = ({ tasks }) => {
    if (tasks.length === 0) {
      return <p>No tasks added yet!</p>;
    }
  
    return (
      <ul>
        {tasks.map((task, index) => (
            <li key={index}>
            {task.task || "No task name available"} 
            </li>
        ))}
      </ul>
    );
  };
  
  export default TaskList;
  