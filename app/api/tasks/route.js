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
    const { task, status } = await req.json(); // Parse the incoming request body

    // Validate the request body
    if (!task || !status) {
      return NextResponse.json({ message: 'Task and status are required' }, { status: 400 });
    }

    // Extract the IP address from the request headers
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'Unknown';

    // Check if the IP address already has a username
    let user = await db.collection('users').findOne({ ipAddress: ip });

    // If no username exists for this IP, assign a new one and store it
    if (!user) {
      // Fetch all currently used usernames
      const usedUsernames = await db.collection('users').find({}).toArray();
      const usedUsernamesList = usedUsernames.map((user) => user.username);

      // Get a list of available usernames
      const availableUsernames = usernames.filter(
        (username) => !usedUsernamesList.includes(username)
      );

      // If no usernames are available, respond with an error
      if (availableUsernames.length === 0) {
        return NextResponse.json({ message: 'No available usernames' }, { status: 500 });
      }

      // Assign a new username to the IP address
      const assignedUsername = getRandomUsername(availableUsernames);

      // Store the new username and IP in the `users` collection
      await db.collection('users').insertOne({ ipAddress: ip, username: assignedUsername });

      user = { username: assignedUsername };
    }

    // Create a new task with the assigned or existing username
    const newTask = {
      task,
      status,
      username: user.username, // Use the username for this IP
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

