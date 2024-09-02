// API handlers
import { connectToDatabase } from "../mongo/route";

// GET request handler
export async function GET() {
  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Fetch all products from the collection
    const products = await db.collection("products").find({}).toArray();

    // Send the products data as a response
    return new Response(
      JSON.stringify({ message: "Products fetched successfully", products }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error handling GET request:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching products" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// POST request handler
export async function POST(request) {
  try {
    // Parse the incoming JSON data from the request body
    const data = await request.json();

    // Validate data
    if (!data.productName || !data.quantity || !data.price) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const collection = db.collection("products");

    // Insert data into the MongoDB collection
    await collection.insertOne(data);

    // Send a success response
    return new Response(
      JSON.stringify({ message: "Product added successfully", data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error handling POST request:", error);
    return new Response(
      JSON.stringify({ message: "Error processing request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
