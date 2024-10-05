const TaskList = ({ tasks,onTaskUpdate}) => {
    const handleTaskUpdate = async (task) => {
        const { _id, ...restOfTask } = task;
        const updatedTask = { ...restOfTask, status: 'completed' };
    
        try {
          const response = await fetch(`/api/tasks/${task._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({update: updatedTask}),
          });
    
          if (!response.ok) {
            const errorDetails = await response.json();
            console.log('Error details:', errorDetails);
            throw new Error('Error updating task');
          }
          onTaskUpdate(task._id);
        } catch (error) {
          console.error('Failed to update task', error);
        }
      };

      

  
      return (
        <div className="taskListContainer">
          <ul className="taskList">
            {tasks.map((task, index) => (
              <li key={task._id} className="taskItem">
                <input
                  className="checkBox"
                  type="checkbox"
                  onChange={() => handleTaskUpdate(task)}
                />
                <span className="taskText">{task.task}</span>
              </li>
            ))}
          </ul>
      
          <style jsx>{`
        .taskListContainer {
            width: 100%;
            max-width: 810px; /* Match the width of the form */
            margin: 2rem auto 0; /* Add space between form and task list */
            padding: 1rem;
            border-radius: 0; /* Match the no-rounded-corners style */
            box-sizing: border-box;
        }

        .taskList {
            list-style-type: none; /* Remove bullet points */
            padding: 0;
            margin: 0;
        }

        .taskItem {
            display: flex;
            align-items: center; /* Center checkbox and text vertically */
            padding: 0.75rem 0;
            border-bottom: 1px solid #495464; /* Optional: add border between tasks */
        }

        .taskItem:last-child {
            border-bottom: none; /* Remove the bottom border on the last item */
        }

        .checkBox {
            margin-right: 1rem;
            width: 1.25rem;
            height: 1.25rem;
            cursor: pointer;
            vertical-align: middle; /* Ensures checkbox aligns with text */
        }

        .taskText {
            font-size: 1.25rem; /* Match the font size of the input box */
            line-height: 1.5rem; /* Match the checkbox height */
            color: #495464; /* Black text */
            flex-grow: 1; /* Ensure task text takes up available space */
        }
        `}</style>

        </div>
      );
      
  };
  
  export default TaskList;
  