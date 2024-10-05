import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// PUT request handler
export async function PUT(req, { params }) {
    const { id } = params; 

  try {
    const { db } = await connectToDatabase();
    const { update } = await req.json(); // Retrieve the body from the request

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid task ID' }, { status: 400 });
    }

    const result = await db.collection('tasks').replaceOne(
      { _id: new ObjectId(id) },
      { ...update } // Replace the entire task with the updated object
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ message: 'Failed to update task' }, { status: 500 });
  }
}
