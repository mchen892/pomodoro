import { MongoClient } from 'mongodb';
require('dotenv').config();

let client;
let clientPromise;

const uri = "mongodb+srv://js3498:2deYN3KZry0ZRvf0@cluster0.0m5ga.mongodb.net/pomodoro?retryWrites=true&w=majority";

if (!global._mongoClientPromise) {
  
  try {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    global._mongoClientPromise = client.connect();
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw new Error('Failed to connect to MongoDB'+ error) ;
  }
}
clientPromise = global._mongoClientPromise;

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db();
    return { db, client };
  } catch (error) {
    console.error('Failed to connect to database', error);
    throw new Error('Failed to connect to database');
  }
}