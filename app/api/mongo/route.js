import { MongoClient } from "mongodb";


const uri = "mongodb+srv://meraiviraj:yFZcWTJrHJbXtFKR@cluster0.kdwxb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Ensure your MongoDB URI is set in environment variables
let client;
let clientPromise;

// Singleton connection to MongoDB
if (!uri) {
  throw new Error("Please add your MongoDB URI to the environment variables");
}

if (!clientPromise) {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    clientPromise = client.connect();
  }
  // Wait for the client to connect if it hasn't already
  await clientPromise;
  const db = client.db("Invetory"); // Replace 'yourDatabaseName' with your actual database name
  return { db, client };
}
