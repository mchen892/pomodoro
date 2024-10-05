import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';


// Handle POST requests (creating a task)
export async function POST(req) {
  try {
    const { db } = await connectToDatabase();
    const { task, status } = await req.json(); // Parse the incoming request body

    // Log the request body for debugging
 

    // Validate the request body
    if (!task || !status) {
      return NextResponse.json({ message: 'Task and status are required' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'Unknown';

    const newTask = {
      task,
      status,
      createdAt: new Date(),
      ipAddress: ip,
    };
    
    const result = await db.collection('tasks').insertOne(newTask);


    // Respond with the insertedId
    return NextResponse.json({  ...newTask, insertedId: result.insertedId });
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

