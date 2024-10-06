import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// Predefined list of usernames
const usernames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eva', 'Frank', 'Grace', 'Hank', 'Ivy', 'Jack'];

// Function to get a random username
function getRandomUsername(availableUsernames) {
  return availableUsernames[Math.floor(Math.random() * availableUsernames.length)];
}

export async function POST(req) {
  try {
    const { db } = await connectToDatabase();
    const { task, username, status } = await req.json(); // Parse the incoming request body

    // Validate the request body
    if (!task || !status) {
      return NextResponse.json({ message: 'Task and status are required' }, { status: 400 });
    }

    // Extract the IP address from the request headers
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'Unknown';

    let assignedUsername = username;

    // If no username is provided by the browser, assign a new one
    if (!assignedUsername) {
      assignedUsername = getRandomUsername(usernames);
    }

  
    // Create a new task with the assigned or existing username
    const newTask = {
      task,
      status,
      username: assignedUsername, // Use the username for this IP
      createdAt: new Date(),
      ipAddress: ip,
    };

    // Insert the new task into the `tasks` collection
    const result = await db.collection('tasks').insertOne(newTask);

    // Respond with the inserted task and username
    return NextResponse.json({ ...newTask, insertedId: result.insertedId });
  } catch (error) {
    console.error('Error inserting task:', error);
    return NextResponse.json({ message: 'Failed to insert task' }, { status: 500 });
  }
}

// Handle GET requests (fetching completed tasks)
export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Find all tasks with status 'completed', sorted by `createdAt` in descending order
    const tasks = await db
      .collection('tasks')
      .find({ status: 'completed' })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedTasks = tasks.map(task => ({
        ...task,
        id: task._id.toString(), // Convert ObjectId to string and rename _id to id
      }));

    // Respond with the list of completed tasks
    return NextResponse.json(formattedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ message: 'Failed to fetch tasks' }, { status: 500 });
  }
}

