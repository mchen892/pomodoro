interface TaskAppProps {
  tasks: { id: string; task: string; createdAt: string }[];
}

// Ensure only one default export here as well
export default function TaskList({ tasks }: TaskAppProps) {
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
              {new Date(task.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
