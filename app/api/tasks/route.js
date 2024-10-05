import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// Handle POST requests (creating a task)
export async function POST(req) {
  try {
    const { db } = await connectToDatabase();
    const { task, status } = await req.json(); // Parse the incoming request body

    // Log the request body for debugging
    console.log('Task:', task, 'Status:', status);

    // Validate the request body
    if (!task || !status) {
      return NextResponse.json({ message: 'Task and status are required' }, { status: 400 });
    }

    const newTask = {
      task,
      status,
      createdAt: new Date(),
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

    // Respond with the list of completed tasks
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ message: 'Failed to fetch tasks' }, { status: 500 });
  }
}

