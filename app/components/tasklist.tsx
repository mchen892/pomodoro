interface TaskListProps {
  tasks: string[];
}

export default function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="mt-4">
      <h2>Tasks:</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  );
}
